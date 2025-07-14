@echo off
setlocal enabledelayedexpansion

:: Configuraciones por defecto
set PUERTO=8000
set ABRIR_BROWSER=S
set CARPETA=.
set ARCHIVO=index.html

echo ==============================
echo    Servidor HTTP con Python
echo ==============================
echo.

:: Preguntar carpeta a servir
set /p CARPETA_INPUT=Carpeta a servir (Enter para actual: .): 
if not "%CARPETA_INPUT%"=="" set CARPETA=%CARPETA_INPUT%

:: Preguntar puerto
set /p PUERTO_INPUT=Puerto (Enter para %PUERTO%): 
if not "%PUERTO_INPUT%"=="" set PUERTO=%PUERTO_INPUT%

:: Preguntar si abrir navegador
set /p ABRIR_BROWSER=¿Abrir navegador automáticamente? (S/N, Enter para S): 
if /I "%ABRIR_BROWSER%"=="" set ABRIR_BROWSER=S

:: Preguntar archivo o ruta para abrir (opcional)
set /p ARCHIVO_INPUT=Archivo o ruta inicial en navegador (Enter para index.html): 
if not "%ARCHIVO_INPUT%"=="" set ARCHIVO=%ARCHIVO_INPUT%

:: Obtener IP local
for /f "tokens=2 delims=:" %%f in ('ipconfig ^| findstr "IPv4"') do set IP_LOCAL=%%f
set IP_LOCAL=%IP_LOCAL: =%

echo.
echo ========================================
echo Servidor iniciado en:
echo   Local:   http://localhost:%PUERTO%/%ARCHIVO%
echo   Red LAN: http://%IP_LOCAL%:%PUERTO%/%ARCHIVO%
echo ========================================
echo.

:: Cambiar al directorio elegido
cd /d "%CARPETA%"

:: Abrir navegador si se desea
if /I "%ABRIR_BROWSER%"=="S" (
    start http://localhost:%PUERTO%/%ARCHIVO%
)

:: Iniciar servidor
python -m http.server %PUERTO%

pause
endlocal
