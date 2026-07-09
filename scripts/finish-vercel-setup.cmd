@echo off
setlocal
cd /d "%~dp0.."

echo.
echo === Forge Web: finish Vercel auth + database setup ===
echo.

call scripts\ensure-node.cmd
if errorlevel 1 exit /b 1

echo Step 1: Install Clerk marketplace integration (syncs API keys to Vercel)
echo   If prompted, accept terms in the browser, then rerun this script.
call npx.cmd vercel integration add clerk -e production -e preview
if errorlevel 1 (
  echo Clerk integration not finished. Open:
  echo   https://vercel.com/wellstech/~/integrations/accept-terms/clerk?source=cli
  goto :after_clerk
)

echo Step 2: Install Supabase marketplace integration (syncs DB env vars)
call npx.cmd vercel integration add supabase -e production -e preview
if errorlevel 1 (
  echo Supabase integration not finished. Open:
  echo   https://vercel.com/wellstech/~/integrations/accept-terms/supabase?source=cli
  goto :after_supabase
)

:after_clerk
:after_supabase

echo.
echo Step 3: Pull env vars locally
call npx.cmd vercel env pull .env.local --environment=production --yes

echo.
echo Step 4: Run supabase/schema.sql in Supabase SQL Editor
echo   https://supabase.com/dashboard/project/_/sql/new
echo   Paste contents of supabase\schema.sql and run it once.

echo.
echo Step 5: Redeploy production
call npx.cmd vercel --prod --yes

echo.
echo Done. Visit https://forge-web-wellstech.vercel.app
endlocal
