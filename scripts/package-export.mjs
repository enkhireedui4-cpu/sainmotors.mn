// ZIP packaging of an existing verified export. No deployment or source mutations.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const release = args.includes("--release");
const sourceIndex = args.indexOf("--source");
const source = path.resolve(sourceIndex >= 0 ? args[sourceIndex + 1] : path.join(root, "out"));
const outputIndex = args.indexOf("--output-dir");
const output = path.resolve(outputIndex >= 0 ? args[outputIndex + 1] : path.join(root, "dist"));
if (output === source || output.startsWith(source + path.sep)) throw new Error("Package output must be outside the static export");
const run = (script, ...extra) => {
  const result = spawnSync(process.execPath, [path.join(root, "scripts", script), ...extra], { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
if (release) run("release-check.mjs");
run("check-export.mjs", "--source", source, ...(release ? ["--release"] : []));
const stamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
const name = `sainmotors-${release ? "release" : "preview"}-${stamp}`;
const staged = path.join(output, name);
const apacheTemplate = path.join(root, "deployment/apache", `${release ? "production" : "preview"}.htaccess`);
if (fs.readFileSync(apacheTemplate).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) throw new Error("Apache template contains a UTF-8 BOM");
fs.mkdirSync(staged, { recursive: true });
fs.cpSync(source, staged, { recursive: true, errorOnExist: true });
fs.copyFileSync(apacheTemplate, path.join(staged, ".htaccess"));
const hashes = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(dir, entry.name);
    const info = fs.lstatSync(file);
    if (info.isDirectory()) walk(file);
    else if (info.isFile()) hashes.push(`${crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}  ${path.relative(staged, file).replaceAll(path.sep, "/")}`);
    else throw new Error(`Unsupported export entry: ${file}`);
  }
};
walk(staged);
fs.writeFileSync(path.join(staged, "SHA256SUMS.txt"), hashes.join("\n") + "\n");
const archive = path.join(output, `${name}.zip`);
if (process.platform !== "win32") throw new Error("This packaging workflow requires Windows PowerShell/.NET; static folder and checksums are ready.");
// Paths cross the process boundary as environment values, never executable text.
const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory($env:SAIN_PACKAGE_SOURCE, $env:SAIN_PACKAGE_ZIP, [System.IO.Compression.CompressionLevel]::Optimal, $false)"], { stdio: "inherit", env: { ...process.env, SAIN_PACKAGE_SOURCE: staged, SAIN_PACKAGE_ZIP: archive } });
if (result.status !== 0) process.exit(result.status ?? 1);
const checksum = crypto.createHash("sha256").update(fs.readFileSync(archive)).digest("hex");
fs.writeFileSync(`${archive}.sha256`, `${checksum}  ${path.basename(archive)}\n`);
console.log(`${release ? "Release" : "Preview"} package: ${archive}\nSHA-256: ${checksum}\nFiles: ${hashes.length} (plus SHA256SUMS.txt). No external deployment performed.`);
