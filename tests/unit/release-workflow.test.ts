import { describe, expect, it } from "vitest";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";

describe("release preflight", () => {
  it("ships Apache directives without a UTF-8 BOM", () => {
    for (const file of ["public/.htaccess", "deployment/apache/preview.htaccess", "deployment/apache/production.htaccess"]) {
      expect(readFileSync(file).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])), file).toBe(false);
    }
  });
  it("refuses unapproved source content before a build or package is attempted", () => {
    const result = spawnSync(process.execPath, ["scripts/release-check.mjs"], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Release blocked");
    expect(result.stderr).toContain("company.introduction: draft");
    expect(result.stderr).not.toContain("brands.soueast: logo missing");
  });

  it("catches a missing local image in an otherwise present export", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "sain-export-"));
    try {
      for (const locale of ["mn", "en"]) {
        mkdirSync(path.join(dir, locale), { recursive: true });
        writeFileSync(path.join(dir, locale, "index.html"), '<html><head><meta name="robots" content="noindex,nofollow"></head><body><h1>Sain Motors</h1><img src="/media/missing.webp" alt="Showroom"></body></html>');
      }
      writeFileSync(path.join(dir, "robots.txt"), "User-Agent: *\nDisallow: /\n");
      writeFileSync(path.join(dir, "sitemap.xml"), "<urlset/>");
      writeFileSync(path.join(dir, "404.html"), "<h1>Not found</h1>");
      const result = spawnSync(process.execPath, ["scripts/check-export.mjs", "--source", dir], { encoding: "utf8" });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("missing.webp");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it("packages a preview with its hidden Apache config and a matching ZIP checksum", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "sain-package-"));
    const source = path.join(dir, "out");
    const output = path.join(dir, "packages");
    try {
      for (const locale of ["mn", "en"]) {
        mkdirSync(path.join(source, locale), { recursive: true });
        writeFileSync(path.join(source, locale, "index.html"), '<html><head><meta name="robots" content="noindex,nofollow"></head><body><h1>Sain Motors</h1></body></html>');
      }
      writeFileSync(path.join(source, "robots.txt"), "User-Agent: *\nDisallow: /\n");
      writeFileSync(path.join(source, "sitemap.xml"), "<urlset/>");
      writeFileSync(path.join(source, "404.html"), "<h1>Not found</h1>");
      const result = spawnSync(process.execPath, ["scripts/package-export.mjs", "--source", source, "--output-dir", output], { encoding: "utf8" });
      expect(result.status, result.stderr).toBe(0);
      const zip = readdirSync(output).find((file) => file.endsWith(".zip"))!;
      const checksum = createHash("sha256").update(readFileSync(path.join(output, zip))).digest("hex");
      expect(readFileSync(path.join(output, zip + ".sha256"), "utf8")).toBe(`${checksum}  ${zip}\n`);
      const contents = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "Add-Type -AssemblyName System.IO.Compression.FileSystem; $archive = [System.IO.Compression.ZipFile]::OpenRead($env:SAIN_TEST_ZIP); $archive.Entries.FullName; $archive.Dispose()"], { encoding: "utf8", env: { ...process.env, SAIN_TEST_ZIP: path.join(output, zip) } });
      expect(contents.status).toBe(0);
      expect(contents.stdout).toContain(".htaccess");
      expect(contents.stdout).toContain("SHA256SUMS.txt");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it("rejects staging pages that accidentally permit indexing during the HTTP health check", async () => {
    const server = createServer((request, response) => {
      if (request.url === "/robots.txt") { response.end("User-Agent: *\nDisallow: /\n"); return; }
      if (request.url === "/sitemap.xml") { response.end("<urlset/>"); return; }
      if (request.url === "/mn/" || request.url === "/en/") {
        response.setHeader("Content-Type", "text/html");
        response.end(`<html lang="${request.url.slice(1, 3)}"><head></head><body><h1>Sain Motors</h1></body></html>`);
        return;
      }
      response.statusCode = 404; response.end("Missing");
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("Fixture server did not bind");
      const result = await new Promise<{ status: number | null; stderr: string }>((resolve, reject) => {
        const child = spawn(process.execPath, ["scripts/health-check.mjs", `http://127.0.0.1:${address.port}`]);
        let stderr = "";
        child.stderr.on("data", (chunk) => { stderr += chunk; });
        child.on("error", reject);
        child.on("close", (status) => resolve({ status, stderr }));
      });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("mn: indexing does not match preview");
      expect(result.stderr).toContain("en: indexing does not match preview");
    } finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
  });
});
