import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer, request, type IncomingHttpHeaders } from "node:http";
import path from "node:path";

const project = path.resolve(import.meta.dirname, "../..");
const fixtureParent = path.join(project, "tests");
const video = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const html = "<h1>Preview home</h1>";
const notFound = "<h1>Missing page</h1>";

type Response = { status: number | undefined; headers: IncomingHttpHeaders; body: Buffer };

describe("static MP4 preview responses", () => {
  let fixture: string | undefined;
  let child: ChildProcessWithoutNullStreams | undefined;
  let port: number;

  function get(url: string, options: { method?: string; range?: string } = {}) {
    return new Promise<Response>((resolve, reject) => {
      const req = request({
        host: "127.0.0.1",
        port,
        path: url,
        method: options.method ?? "GET",
        headers: { Connection: "close", ...(options.range ? { Range: options.range } : {}) },
      }, (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("error", reject);
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      });
      req.on("error", reject);
      req.setTimeout(3000, () => req.destroy(new Error("Preview request timed out")));
      req.end();
    });
  }

  beforeAll(async () => {
    fixture = mkdtempSync(path.join(fixtureParent, ".static-video-preview-"));
    mkdirSync(path.join(fixture, "mn"));
    writeFileSync(path.join(fixture, "hero.mp4"), video);
    writeFileSync(path.join(fixture, "empty.mp4"), "");
    writeFileSync(path.join(fixture, "mn/index.html"), html);
    writeFileSync(path.join(fixture, "404.html"), notFound);

    const reservation = createServer();
    await new Promise<void>((resolve, reject) => {
      reservation.once("error", reject);
      reservation.listen(0, "127.0.0.1", resolve);
    });
    const address = reservation.address();
    if (!address || typeof address === "string") throw new Error("Temporary port did not bind");
    port = address.port;
    await new Promise<void>((resolve, reject) => reservation.close((error) => error ? reject(error) : resolve()));

    child = spawn(process.execPath, ["scripts/serve-out.mjs", "--source", fixture], {
      cwd: project,
      env: { ...process.env, PORT: String(port) },
    });
    await new Promise<void>((resolve, reject) => {
      let output = "";
      const timer = setTimeout(() => reject(new Error(`Preview server did not start: ${output}`)), 5000);
      const fail = (error: Error) => { clearTimeout(timer); reject(error); };
      child!.once("error", fail);
      child!.once("exit", (code, signal) => fail(new Error(`Preview server exited (${code ?? signal}): ${output}`)));
      child!.stderr.on("data", (chunk) => { output += chunk; });
      child!.stdout.on("data", (chunk) => {
        output += chunk;
        if (output.includes(`http://localhost:${port}`)) { clearTimeout(timer); resolve(); }
      });
    });
  });

  afterAll(async () => {
    try {
      if (child && child.exitCode === null && child.signalCode === null) {
        await new Promise<void>((resolve) => {
          child!.once("close", () => resolve());
          child!.kill();
        });
      }
    } finally {
      if (fixture) {
        if (path.dirname(fixture) !== fixtureParent || !path.basename(fixture).startsWith(".static-video-preview-")) {
          throw new Error("Refusing to remove a fixture outside the test directory");
        }
        rmSync(fixture, { recursive: true, force: true });
      }
    }
  });

  it("serves the full MP4 with a known length and advertised seek support", async () => {
    const result = await get("/hero.mp4");
    expect(result.status).toBe(200);
    expect(result.headers["content-type"]).toBe("video/mp4");
    expect(result.headers["content-length"]).toBe("36");
    expect(result.headers["accept-ranges"]).toBe("bytes");
    expect(result.headers["content-range"]).toBeUndefined();
    expect(result.headers["transfer-encoding"]).toBeUndefined();
    expect(result.body).toEqual(Buffer.from(video));
  });

  it.each([
    ["bytes=0-0", "bytes 0-0/36", "0"],
    ["bytes=5-10", "bytes 5-10/36", "56789A"],
    ["bytes=30-", "bytes 30-35/36", "UVWXYZ"],
    ["bytes=-4", "bytes 32-35/36", "WXYZ"],
    ["bytes=33-999", "bytes 33-35/36", "XYZ"],
    ["bytes=-999", "bytes 0-35/36", video],
  ])("returns only the requested MP4 bytes for %s", async (range, contentRange, body) => {
    const result = await get("/hero.mp4", { range });
    expect(result.status).toBe(206);
    expect(result.headers["content-type"]).toBe("video/mp4");
    expect(result.headers["accept-ranges"]).toBe("bytes");
    expect(result.headers["content-range"]).toBe(contentRange);
    expect(result.headers["content-length"]).toBe(String(Buffer.byteLength(body)));
    expect(result.headers["transfer-encoding"]).toBeUndefined();
    expect(result.body).toEqual(Buffer.from(body));
  });

  it.each([
    "bytes=36-",
    "bytes=10-9",
    "bytes=-0",
    "bytes=-",
    "bytes=1-2,4-5",
    "items=0-1",
    "bytes=9007199254740992-",
  ])("rejects the unsatisfiable or unsupported range %s", async (range) => {
    const result = await get("/hero.mp4", { range });
    expect(result.status).toBe(416);
    expect(result.headers["content-range"]).toBe("bytes */36");
    expect(result.headers["content-length"]).toBe("0");
    expect(result.body.length).toBe(0);
  });

  it.each([
    [undefined, 200, "36", undefined],
    ["bytes=5-10", 206, "6", "bytes 5-10/36"],
  ])("returns GET-equivalent headers without a body for HEAD range=%s", async (range, status, length, contentRange) => {
    const result = await get("/hero.mp4", { method: "HEAD", range });
    expect(result.status).toBe(status);
    expect(result.headers["content-type"]).toBe("video/mp4");
    expect(result.headers["accept-ranges"]).toBe("bytes");
    expect(result.headers["content-length"]).toBe(length);
    expect(result.headers["content-range"]).toBe(contentRange);
    expect(result.body.length).toBe(0);
  });

  it("ends an empty MP4 response without attempting a negative byte stream", async () => {
    const result = await get("/empty.mp4");
    expect(result.status).toBe(200);
    expect(result.headers["content-length"]).toBe("0");
    expect(result.body.length).toBe(0);
    const range = await get("/empty.mp4", { range: "bytes=0-" });
    expect(range.status).toBe(416);
    expect(range.headers["content-range"]).toBe("bytes */0");
    expect(range.body.length).toBe(0);
  });

  it("keeps HTML routes complete even when a Range header is present", async () => {
    const result = await get("/mn/", { range: "bytes=0-2" });
    expect(result.status).toBe(200);
    expect(result.headers["content-type"]).toBe("text/html; charset=utf-8");
    expect(result.headers["content-length"]).toBe(String(Buffer.byteLength(html)));
    expect(result.headers["content-range"]).toBeUndefined();
    expect(result.headers["accept-ranges"]).toBeUndefined();
    expect(result.body.toString()).toBe(html);
  });

  it.each([
    ["/", 302, "/mn/"],
    ["/mn?from=preview", 301, "/mn/?from=preview"],
    ["/en/brands/jetour/models?from=preview", 301, "https://jetour.mn/?from=preview"],
    ["/mn/brands/chery/", 301, "https://chery.mn/"],
  ])("preserves the existing redirect for %s", async (url, status, location) => {
    const result = await get(url);
    expect(result.status).toBe(status);
    expect(result.headers.location).toBe(location);
    expect(result.body.length).toBe(0);
  });

  it("keeps missing routes on the custom 404 page", async () => {
    const result = await get("/missing.mp4", { range: "bytes=0-2" });
    expect(result.status).toBe(404);
    expect(result.headers["content-type"]).toBe("text/html; charset=utf-8");
    expect(result.headers["content-range"]).toBeUndefined();
    expect(result.body.toString()).toBe(notFound);
  });
});
