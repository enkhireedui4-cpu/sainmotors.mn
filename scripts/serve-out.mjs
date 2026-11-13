// Serves the static export in out/ the way the Apache host will (see
// public/.htaccess): "/" → /mn/, folders → index.html, unknown → 404.html.
// Run after `npm run build`:  npm run preview   (http://localhost:3300)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const sourceIndex = process.argv.indexOf("--source");
const ROOT = path.resolve(sourceIndex >= 0 ? process.argv[sourceIndex + 1] : path.resolve(import.meta.dirname, "..", "out"));
const workspace = path.resolve(import.meta.dirname, "..");
const relativeSource = path.relative(workspace, ROOT);
if (!relativeSource || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) throw new Error("Export source must be inside the project workspace");
const PORT = Number(process.env.PORT ?? 3300);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

if (!fs.existsSync(ROOT)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(1);
}

function send(req, res, status, file) {
  const size = fs.statSync(file).size;
  const headers = {
    "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
    "Content-Length": size,
  };
  let start = 0;
  let end = size - 1;
  // Video playback and native PDF viewers seek using byte ranges.
  if ([".mp4", ".pdf"].includes(path.extname(file)) && status === 200) {
    headers["Accept-Ranges"] = "bytes";
    if (req.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (range && (range[1] || range[2])) {
        start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      } else start = size;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
        res.writeHead(416, { "Content-Range": `bytes */${size}`, "Content-Length": 0 });
        return res.end();
      }
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
      headers["Content-Length"] = end - start + 1;
    }
  }
  res.writeHead(status, headers);
  if (req.method === "HEAD" || size === 0) return res.end();
  const stream = fs.createReadStream(file, { start, end });
  res.on("close", () => stream.destroy());
  stream.on("error", () => res.destroy());
  stream.pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") {
      res.writeHead(302, { Location: "/mn/" });
      return res.end();
    }
    const externalBrand = pathname.match(/^\/(?:mn|en)\/brands\/(jetour|chery)(?:\/.*)?$/)?.[1];
    if (externalBrand) {
      res.writeHead(301, { Location: `https://${externalBrand}.mn/${url.search}` });
      return res.end();
    }
    const target = path.join(ROOT, pathname);
    if (!target.startsWith(ROOT)) {
      res.writeHead(400);
      return res.end();
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      if (!pathname.endsWith("/")) {
        res.writeHead(301, { Location: `${pathname}/${url.search}` });
        return res.end();
      }
      const index = path.join(target, "index.html");
      if (fs.existsSync(index)) return send(req, res, 200, index);
    } else if (fs.existsSync(target)) {
      return send(req, res, 200, target);
    }
    send(req, res, 404, path.join(ROOT, "404.html"));
  })
  .listen(PORT, () => console.log(`Serving out/ on http://localhost:${PORT}`));
