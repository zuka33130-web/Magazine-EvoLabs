@echo off
title EVO LOCAL AGENT // WINDOWS CIM TELEMETRY SERVICE (PORT 43921)
color 0b
echo ==============================================================================
echo [EVO LABS] INICIANDO EVO LOCAL AGENT (FASE DE DESARROLLO)
echo ==============================================================================
echo Servidor: http://127.0.0.1:43921
echo Endpoints: /health, /v1/machine, /v1/capabilities, /v1/telemetry
echo.
echo Presione Ctrl+C para detener el agente.
echo ==============================================================================
echo.

cd /d "%~dp0"
if exist "src\index.ts" (
    npx tsx src\index.ts
) else (
    echo [ERROR] No se encontro src\index.ts
    pause
)
