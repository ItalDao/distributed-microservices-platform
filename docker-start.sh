#!/bin/bash

# ==================== DISTRIBUTED MICROSERVICES PLATFORM ====================
# Docker Compose Initialization Script
# Levanta TODO el stack en un comando

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Distributed Microservices Platform - Docker Bootstrap    ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

success() {
    echo -e "${GREEN}✓${NC}  $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

error() {
    echo -e "${RED}✗${NC}  $1"
    exit 1
}

# Verificar si Docker está instalado
info "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado. Descárgalo en https://www.docker.com/"
fi
success "Docker encontrado"

# Verificar si Docker Compose está instalado
info "Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado. Instálalo con: docker-compose install"
fi
success "Docker Compose encontrado"

# Verificar si Docker daemon está corriendo
info "Verificando daemon de Docker..."
if ! docker info &> /dev/null; then
    error "Docker daemon no está corriendo. Inicia Docker Desktop o el servicio."
fi
success "Docker daemon está corriendo"

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    info "Creando archivo .env basado en .env.example..."
    cp .env.example .env
    warning "Archivo .env creado. Edítalo si necesitas cambiar configuración."
    warning "Especialmente: SMTP_USER y SMTP_PASSWORD para notificaciones por email"
fi

# Mostrar información del sistema
echo ""
info "Requerimientos de sistema:"
echo "  • RAM recomendada: 4GB"
echo "  • Espacio disco: 2GB mínimo"
echo "  • Puertos: 3000, 3001, 3002, 3003, 5432, 27017, 6379, 5672, 9090, 15672, 3004"

echo ""
warning "Algunos puertos pueden estar en uso. El compose intentará asignarlos."

# Limpiar contenedores antiguos si existen
echo ""
info "Verificando contenedores existentes..."
if docker-compose ps 2>/dev/null | grep -q "auth_service\|payments_service\|notifications_service\|api_gateway"; then
    warning "Se encontraron contenedores existentes del proyecto"
    read -p "¿Deseas eliminarlos y empezar desde cero? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        info "Deteniendo y eliminando contenedores..."
        docker-compose down -v
        success "Contenedores eliminados"
    fi
fi

# Construir imágenes
echo ""
info "Construyendo imágenes Docker..."
docker-compose build --no-cache

# Iniciar servicios
echo ""
info "Iniciando servicios..."
docker-compose up -d

# Esperar a que se inicie
echo ""
info "Esperando a que se inicien todos los servicios (esto tarda 2-3 minutos)..."
echo ""

# Contador
COUNTER=0
MAX_WAIT=180

while [ $COUNTER -lt $MAX_WAIT ]; do
    if docker-compose ps | grep -q "auth_service.*Up"; then
        if docker-compose ps | grep -q "payments_service.*Up"; then
            if docker-compose ps | grep -q "notifications_service.*Up"; then
                if docker-compose ps | grep -q "api_gateway.*Up"; then
                    break
                fi
            fi
        fi
    fi
    
    COUNTER=$((COUNTER + 1))
    echo -ne "\r  Esperando... ${COUNTER}s"
    sleep 1
done

echo -e "\n"

# Verificar estado
info "Verificando estado de servicios..."
docker-compose ps

# Verificar health checks
echo ""
info "Verificando salud de servicios..."

# Array de servicios y puertos
declare -a SERVICES=("auth_service:3001" "payments_service:3002" "notifications_service:3003" "api_gateway:3000")
declare -a DATABASES=("postgres:5432" "mongodb:27017" "redis:6379" "rabbitmq:15672")

services_ok=0
for service in "${SERVICES[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        success "$name está listo"
        services_ok=$((services_ok + 1))
    else
        warning "$name aún se está iniciando..."
    fi
done

# Resumen
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ¡LISTO PARA USAR!                        ║"
echo "╚════════════════════════════════════════════════════════════╝"

echo ""
echo "URLs de Acceso:"
echo "  • API Gateway:        http://localhost:3000"
echo "  • Auth Service:       http://localhost:3001"
echo "  • Payments Service:   http://localhost:3002"
echo "  • Notifications:      http://localhost:3003"
echo "  • RabbitMQ Manager:   http://localhost:15672 (admin/admin123)"
echo "  • Prometheus:         http://localhost:9090"
echo "  • Grafana:            http://localhost:3004 (admin/admin123)"

echo ""
echo "Comandos útiles:"
echo "  • Ver logs:           docker-compose logs -f"
echo "  • Ver logs servicio:  docker-compose logs -f auth-service"
echo "  • Detener:            docker-compose stop"
echo "  • Reiniciar:          docker-compose restart"
echo "  • Eliminar TODO:      docker-compose down -v"
echo "  • Estado:             docker-compose ps"

echo ""
echo "Próximos pasos:"
echo "  1. Accede a http://localhost:3000 (API Gateway)"
echo "  2. Registra un usuario en /auth/register"
echo "  3. Inicia sesión con /auth/login"
echo "  4. Prueba los servicios"

echo ""
success "¡El proyecto está corriendo! Disfruta..."
echo ""

# Mostrar logs
read -p "¿Deseas ver los logs en tiempo real? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi
