@echo off
echo ===========================================
echo  RH Essencial Digital - Instalacao
echo ===========================================
echo.
echo Instalando dependencias...
call npm install
echo.
echo Iniciando o sistema...
echo.
echo Acesse: http://localhost:3000
echo.
call npm run dev
pause
