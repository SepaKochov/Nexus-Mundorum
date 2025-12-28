@echo off
chcp 65001 >nul
setlocal

set "REPO_DIR=E:\OneDrive\Рабочий стол\bestiary_A_fresh"
set "BRANCH=main"
set "MSG=Update: %date% %time%"

echo ============================
echo Nexus-Mundorum: git push
echo Repo: %REPO_DIR%
echo ============================

cd /d "%REPO_DIR%" || (
  echo [ОШИБКА] Не могу перейти в папку репозитория.
  pause
  exit /b 1
)

echo.
echo [1/5] Проверяю, что это git-репозиторий...
git rev-parse --is-inside-work-tree >nul 2>&1 || (
  echo [ОШИБКА] Это не git-репозиторий (нет .git).
  pause
  exit /b 1
)

echo.
echo [2/5] Текущая ветка:
for /f "delims=" %%i in ('git branch --show-current') do set "CUR=%%i"
echo %CUR%
if /i not "%CUR%"=="%BRANCH%" (
  echo [INFO] Перехожу на ветку %BRANCH%...
  git checkout "%BRANCH%" || (
    echo [ОШИБКА] Не удалось переключиться на %BRANCH%.
    pause
    exit /b 1
  )
)

echo.
echo [3/5] Сначала забираю изменения с GitHub (rebase)...
git pull --rebase origin "%BRANCH%"
if errorlevel 1 (
  echo [ОШИБКА] git pull --rebase завершился с ошибкой. Возможен конфликт.
  echo Откройте репозиторий, решите конфликт, затем снова запустите батник.
  pause
  exit /b 1
)

echo.
echo [4/5] Добавляю изменения в индекс (git add -A)...
git add -A

echo.
echo [INFO] Статус:
git status

echo.
echo [5/5] Коммит и push (если есть изменения)...
git diff --cached --quiet
if %errorlevel%==0 (
  echo [OK] Нет изменений для коммита.
  pause
  exit /b 0
)

git commit -m "%MSG%"
if errorlevel 1 (
  echo [ОШИБКА] Коммит не выполнен.
  pause
  exit /b 1
)

git push origin "%BRANCH%"
if errorlevel 1 (
  echo [ОШИБКА] Push не выполнен.
  pause
  exit /b 1
)

echo.
echo [OK] Готово: изменения отправлены на GitHub.
pause
endlocal
