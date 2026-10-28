import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
const port = "3311";
const origin = `http://localhost:${port}`;
const server = spawn(process.execPath, ["scripts/serve-out.mjs"], { stdio: "inherit", env: { ...process.env, PORT: port } });
try {
  let ready = false;
  for (let i = 0; i < 30; i++) {
    if (await fetch(`${origin}/en/`).then(r => r.ok).catch(() => false)) { ready = true; break; }
    await setTimeout(1000);
  }
  if (!ready) throw new Error("Preview did not start");
  const tests = spawn(process.execPath, ["--test", "--test-concurrency=1", "tests/e2e/*.test.mjs"], { stdio: "inherit", env: { ...process.env, BASE_URL: origin } });
  const code = await new Promise(resolve => tests.on("exit", resolve));
  process.exitCode = code ?? 1;
} finally { server.kill(); }
