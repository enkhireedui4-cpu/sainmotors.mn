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
};

if (!fs.existsSync(ROOT)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(1);
}

function send(res, status, file) {
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") {
      res.writeHead(302, { Location: "/mn/" });
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
      if (fs.existsSync(index)) return send(res, 200, index);
    } else if (fs.existsSync(target)) {
      return send(res, 200, target);
    }
    send(res, 404, path.join(ROOT, "404.html"));
  })
  .listen(PORT, () => console.log(`Serving out/ on http://localhost:${PORT}`));
