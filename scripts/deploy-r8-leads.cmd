@echo off
setlocal
set "SUPABASE_HOME=%~dp0..\.tmp-assets\supabase-home"
set "SUPABASE_NO_UPDATE_NOTIFIER=1"
set "SUPABASE_API_MAX_RETRIES=0"
set "SAIN_R8_CLI=%~dp0..\.tmp-assets\supabase-cli-3.1.0\supabase.exe"
if not exist "%SAIN_R8_CLI%" (
  echo The prepared Supabase CLI 3.1.0 is missing. See docs/rely-r8-supabase.md.
  pause
  exit /b 1
)
if not defined SAIN_R8_ALLOWED_ORIGINS set "SAIN_R8_ALLOWED_ORIGINS=https://sainmotors.mn,https://www.sainmotors.mn,http://localhost:3200,http://127.0.0.1:3200,http://localhost:3300,http://127.0.0.1:3300"
pushd "%~dp0.."
for %%F in ("supabase\migrations\*.sql") do (
  if /I not "%%~nxF"=="20261113090000_create_r8_leads.sql" if /I not "%%~nxF"=="20261113100000_add_r8_lead_city.sql" (
    echo Additional migrations exist. Review them separately before using this R8-only helper.
    goto failed
  )
)

echo Checking the selected project's pending R8 migrations...
"%SAIN_R8_CLI%" db push --remote=uzffaelpmhwffcuiqgjq --skip-vault --dry-run --output-format text
if errorlevel 1 goto failed

echo Applying the prepared R8 migrations...
"%SAIN_R8_CLI%" db push --remote=uzffaelpmhwffcuiqgjq --skip-vault --yes --output-format text
if errorlevel 1 goto failed

"%SAIN_R8_CLI%" secrets set "R8_ALLOWED_ORIGINS=%SAIN_R8_ALLOWED_ORIGINS%" --remote=uzffaelpmhwffcuiqgjq --yes --output-format text
if errorlevel 1 goto failed

echo Deploying only submit-r8-lead...
"%SAIN_R8_CLI%" functions deploy submit-r8-lead --remote=uzffaelpmhwffcuiqgjq --use-api --no-verify-jwt --yes --output-format text
if errorlevel 1 goto failed

node "%~dp0verify-r8-deployment.mjs" "%SAIN_R8_CLI%"
if errorlevel 1 goto failed

echo.
echo R8 lead storage is deployed and verified. The synthetic test row was removed.
popd
pause
exit /b 0

:failed
echo.
echo Deployment or verification did not finish. Keep this error visible for review.
popd
pause
exit /b 1
