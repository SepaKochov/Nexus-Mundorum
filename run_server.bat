@echo off
title Bestiary CMS - локальный сервер
cd /d "%~dp0"
echo Запуск локального сервера на http://localhost:8000 ...
echo (не закрывайте это окно)
python -m http.server 8000
pause
