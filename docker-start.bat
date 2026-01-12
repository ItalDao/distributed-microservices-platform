@echo off
REM ==================== DISTRIBUTED MICROSERVICES PLATFORM ====================
REM Docker Compose Initialization Script para Windows
REM Levanta TODO el stack en un comando

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Distributed Microservices Platform - Docker Bootstrap    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar si Docker está instalado
echo [*] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [X] Docker no está instalado. Descárgalo en https://www.docker.com/
    pause
    exit /b 1
)
echo [OK] Docker encontrado

REM Verificar si Docker Compose está instalado
echo [*] Verificando Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [X] Docker Compose no está instalado. Instálalo con: docker compose install
    pause
    exit /b 1
)
echo [OK] Docker Compose encontrado

REM Verificar si Docker daemon está corriendo
echo [*] Verificando daemon de Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo [X] Docker daemon no está corriendo. Inicia Docker Desktop.
    pause
    exit /b 1
)
echo [OK] Docker daemon está corriendo

REM Crear archivo .env si no existe
if not exist .env (
    echo [*] Creando archivo .env basado en .env.example...
    copy .env.example .env >nul
    echo [!] Archivo .env creado. Edítalo si necesitas cambiar configuración.
    echo [!] Especialmente: SMTP_USER y SMTP_PASSWORD para notificaciones por email
)

echo.
echo [i] Requerimientos de sistema:
echo     - RAM recomendada: 4GB
echo     - Espacio disco: 2GB mínimo
echo     - Puertos: 3000, 3001, 3002, 3003, 5432, 27017, 6379, 5672, 9090, 15672, 3004

echo.
echo [!] Algunos puertos pueden estar en uso. El compose intentará asignarlos.

REM Limpiar contenedores antiguos si existen
echo.
echo [*] Verificando contenedores existentes...
docker-compose ps 2>nul | find "auth_service" >nul
if not errorlevel 1 (
    echo [!] Se encontraron contenedores existentes del proyecto
    set /p cleanup="¿Deseas eliminarlos y empezar desde cero? (s/n): "
    if /i "!cleanup!"=="s" (
        echo [*] Deteniendo y eliminando contenedores...
        docker-compose down -v
        echo [OK] Contenedores eliminados
    )
)

REM Construir imágenes
echo.
echo [*] Construyendo imágenes Docker (esto puede tardar varios minutos)...
docker-compose build --no-cache
if errorlevel 1 (
    echo [X] Error al construir las imágenes
    pause
    exit /b 1
)

REM Iniciar servicios
echo.
echo [*] Iniciando servicios...
docker-compose up -d
if errorlevel 1 (
    echo [X] Error al iniciar servicios
    pause
    exit /b 1
)

REM Esperar a que se inicie
echo.
echo [*] Esperando a que se inicien todos los servicios (esto tarda 2-3 minutos)...
echo.

timeout /t 10 /nobreak

REM Verificar estado
echo [*] Verificando estado de servicios...
docker-compose ps

echo.
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                   ¡LISTO PARA USAR!                        ║
echo ╚════════════════════════════════════════════════════════════╝

echo.
echo URLs de Acceso:
echo   * API Gateway:        http://localhost:3000
echo   * Auth Service:       http://localhost:3001
echo   * Payments Service:   http://localhost:3002
echo   * Notifications:      http://localhost:3003
echo   * RabbitMQ Manager:   http://localhost:15672 (admin/admin123)
echo   * Prometheus:         http://localhost:9090
echo   * Grafana:            http://localhost:3004 (admin/admin123)

echo.
echo Comandos útiles:
echo   * Ver logs:           docker-compose logs -f
echo   * Ver logs servicio:  docker-compose logs -f auth-service
echo   * Detener:            docker-compose stop
echo   * Reiniciar:          docker-compose restart
echo   * Eliminar TODO:      docker-compose down -v
echo   * Estado:             docker-compose ps

echo.
echo Próximos pasos:
echo   1. Accede a http://localhost:3000 (API Gateway)
echo   2. Registra un usuario en /auth/register
echo   3. Inicia sesión con /auth/login
echo   4. Prueba los servicios

echo.
echo [OK] ¡El proyecto está corriendo! Disfruta...
echo.

set /p viewlogs="¿Deseas ver los logs en tiempo real? (s/n): "
if /i "!viewlogs!"=="s" (
    docker-compose logs -f
)

pause
