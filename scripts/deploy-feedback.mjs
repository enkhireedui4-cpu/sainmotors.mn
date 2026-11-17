// Run from the user's authenticated terminal, outside the restricted agent shell.
// This deploys only contact feedback; it does not deploy or modify the R8 function.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(root, ".tmp-assets/supabase-cli-3.1.0/supabase.exe");
const ref = "uzffaelpmhwffcuiqgjq";
const remote = `--remote=${ref}`;
const scratch = path.join(root, ".tmp-assets");
const env = {
  ...process.env,
  SUPABASE_HOME: path.join(scratch, "supabase-home"),
  SUPABASE_NO_UPDATE_NOTIFIER: "1",
  SUPABASE_API_MAX_RETRIES: "0",
};
const allowedMigrations = new Set([
  "20261113090000_create_r8_leads.sql",
  "20261113100000_add_r8_lead_city.sql",
  "20261117120000_create_feedback_requests.sql",
]);

function run(args, { capture = false, allowFailure = false } = {}) {
  const result = spawnSync(cli, args, {
    cwd: root, env, windowsHide: true, encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) {
    if (capture) console.error(result.stderr || result.stdout || "Supabase command failed.");
    throw new Error(`Supabase ${args[0]} ${args[1] ?? ""} did not finish.`);
  }
  return result;
}

try {
  if (!fs.existsSync(cli)) throw new Error("Prepared Supabase CLI is missing.");
  for (const file of fs.readdirSync(path.join(root, "supabase/migrations"))) {
    if (file.endsWith(".sql") && !allowedMigrations.has(file)) {
      throw new Error(`Unrelated migration found: ${file}. Review it before deploying.`);
    }
  }
  if (!fs.existsSync(path.join(root, "supabase/migrations/20261117120000_create_feedback_requests.sql"))) {
    throw new Error("Contact feedback migration is missing.");
  }
  if (!fs.existsSync(path.join(root, "scripts/verify-feedback-deployment.mjs"))) {
    throw new Error("Contact feedback verification script is missing.");
  }
  if (process.argv.includes("--check")) {
    console.log(`Offline checks passed. Target: ${ref}; function: submit-feedback.`);
    process.exit(0);
  }

  const auth = run(["functions", "list", remote, "--output-format", "json"], { capture: true, allowFailure: true });
  if (auth.status !== 0) {
    const output = `${auth.stderr ?? ""}\n${auth.stdout ?? ""}`;
    if (!/AccessTokenRequired|access token not provided|unauthorized|invalid.*token|expired.*token|401/i.test(output)) {
      throw new Error("Supabase could not be reached. Check this terminal's internet connection and try again.");
    }
    console.log("Sign in to Supabase in the browser, then enter its verification code in THIS terminal.");
    run(["login", "--agent=no", "--output-format", "text"]);
    run(["functions", "list", remote, "--output-format", "json"], { capture: true });
  }

  // Refuse to apply legacy R8 migrations if this is not the expected existing database.
  fs.mkdirSync(scratch, { recursive: true });
  const checkFile = path.join(scratch, "feedback-existing-migrations-check.sql");
  fs.writeFileSync(checkFile, `do $$ begin
    if (select count(*) from supabase_migrations.schema_migrations
      where version in ('20261113090000','20261113100000')) <> 2 then
      raise exception 'Expected R8 migrations are not recorded. Stop and review the selected project.';
    end if;
  end $$;`);
  try {
    run(["db", "query", remote, "--file", checkFile, "--yes", "--output-format", "text"], { capture: true });
  } finally {
    fs.rmSync(checkFile, { force: true });
  }

  console.log("Checking pending contact migration...");
  run(["db", "push", remote, "--skip-vault", "--dry-run", "--output-format", "text"]);
  run(["db", "push", remote, "--skip-vault", "--yes", "--output-format", "text"]);
  const origins = [
    "https://sainmotors.mn", "https://www.sainmotors.mn",
    "http://localhost:3200", "http://127.0.0.1:3200",
    "http://localhost:3300", "http://127.0.0.1:3300",
    "http://localhost:3317", "http://127.0.0.1:3317",
  ];
  run(["secrets", "set", `FEEDBACK_ALLOWED_ORIGINS=${origins.join(",")}`, remote, "--yes", "--output-format", "text"]);
  console.log("Deploying submit-feedback...");
  run(["functions", "deploy", "submit-feedback", remote, "--use-api", "--no-verify-jwt", "--yes", "--output-format", "text"]);
  const verified = spawnSync(process.execPath, [path.join(root, "scripts/verify-feedback-deployment.mjs"), cli], {
    cwd: root, env, windowsHide: true, stdio: "inherit",
  });
  if (verified.error) throw verified.error;
  if (verified.status !== 0) throw new Error("The receiver was deployed, but verification did not complete. Review the error above.");
  console.log("Contact feedback is deployed and verified. Synthetic test row removed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Contact feedback deployment failed.");
  process.exitCode = 1;
}
