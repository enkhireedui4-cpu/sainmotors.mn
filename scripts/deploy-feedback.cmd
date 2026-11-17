@echo off
setlocal
pushd "%~dp0.."
node scripts\deploy-feedback.mjs
set "FEEDBACK_DEPLOY_EXIT=%ERRORLEVEL%"
popd
echo.
if not "%FEEDBACK_DEPLOY_EXIT%"=="0" echo Contact feedback deployment did not finish. Keep this window open to review the error.
pause
exit /b %FEEDBACK_DEPLOY_EXIT%
