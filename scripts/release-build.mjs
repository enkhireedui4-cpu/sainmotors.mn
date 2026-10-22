// Release builds fail before image generation while content is unapproved.
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const env = { ...process.env, SITE_RELEASE: "1", NEXT_PUBLIC_SITE_URL: "https://sainmotors.mn" };
const runNode = (...args) => {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
runNode("scripts/release-check.mjs");
runNode("scripts/build-images.mjs");
runNode("node_modules/next/dist/bin/next", "build", "--webpack");
runNode("scripts/fix-export-segments.mjs");
runNode("scripts/check-export.mjs", "--release");
fs.copyFileSync("deployment/apache/production.htaccess", "out/.htaccess");
console.log("Approved production export ready. Package it with npm run package:release.");
