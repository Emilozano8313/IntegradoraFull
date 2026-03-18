@echo off
title Sistema de Pedidos - Iniciando...
color 0A

echo.
echo  =====================================================
echo   SISTEMA DE PEDIDOS RESTAURANTE
echo   Iniciando backend y frontend...
echo  =====================================================
echo.

REM --- Iniciar Spring Boot en ventana separada ---
echo  [1/2] Arrancando backend Spring Boot (puerto 8080)...
start "Backend Spring Boot" cmd /k "cd /d %~dp0backend && .\mvnw.cmd spring-boot:run"

REM --- Esperar 20 segundos a que Spring Boot levante ---
echo  Esperando que el backend inicie (20 segundos)...
timeout /t 20 /nobreak >nul

REM --- Iniciar Vite frontend en ventana separada ---
echo  [2/2] Arrancando frontend React (puerto 5173)...
start "Frontend React" cmd /k "cd /d %~dp0 && npm run dev"

REM --- Esperar 4 segundos y abrir el navegador ---
timeout /t 4 /nobreak >nul

echo  Abriendo navegador (vista Administrador)...
start "" "http://localhost:5173/?admin=menu"

echo.
echo  =====================================================
echo   Sistema iniciado. 
echo.
echo   Frontend: http://localhost:5173/?admin=menu
echo   Backend:  http://localhost:8080
echo.
echo   Presiona cualquier tecla para CERRAR el sistema.
echo  =====================================================
echo.
pause >nul

echo.
echo  Cerrando sistema...

REM --- Matar Spring Boot (puerto 8080) ---
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM --- Matar Vite / Node (puerto 5173) ---
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING" 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo  Sistema cerrado. Hasta luego!
timeout /t 2 /nobreak >nul
