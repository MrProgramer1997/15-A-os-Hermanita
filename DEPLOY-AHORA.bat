@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo 15-A-os-Hermanita - verificacion y despliegue
echo ==============================================

echo.
echo [1/5] Instalando dependencias...
call npm install --no-audit --no-fund
if errorlevel 1 goto :error

echo.
echo [2/5] Compilando Vite...
call npm run build
if errorlevel 1 goto :error

if not exist "dist\index.html" (
  echo ERROR: Vite no genero dist\index.html
  goto :error
)

echo.
echo [3/5] Preparando Git...
git add -A
if errorlevel 1 goto :error

echo.
echo [4/5] Creando commit...
git commit -m "Fix definitivo Vite GitHub Pages Node 24"
if errorlevel 1 echo No habia cambios nuevos para commit. Continuando...

echo.
echo [5/5] Enviando a GitHub...
git push origin main
if errorlevel 1 goto :error

echo.
echo LISTO. Ahora GitHub Actions debe compilar y publicar el sitio.
echo En GitHub, Settings - Pages - Source debe estar en GitHub Actions.
pause
exit /b 0

:error
echo.
echo ERROR: el proceso se detuvo. Copia el mensaje que aparece arriba y enviamelo.
pause
exit /b 1
