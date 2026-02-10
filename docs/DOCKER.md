# Docker Compose Setup

Levanta TODO con un comando.

## Quick Start

**Windows:**
```batch
docker-start.bat
```

**Linux/Mac:**
```bash
chmod +x docker-start.sh && ./docker-start.sh
```

**Manual:**
```bash
docker-compose up -d
```

Espera 2-3 minutos y accede a http://localhost:3000

> [!NOTE]
> Docker Desktop debe estar iniciado antes de levantar los servicios.

## Qué Levanta

```
API Gateway (3000)
├── Auth Service (3001) → PostgreSQL (5432)
├── Payments Service (3002) → MongoDB (27017)
├── Notifications (3003) → Redis (6379)
└── RabbitMQ (5672, 15672 UI)

Monitoreo:
- Prometheus (9090)
- Grafana (3004) - admin/admin123
```

## URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|-------------|
| API Gateway | http://localhost:3000 | - |
| Auth Service | http://localhost:3001 | - |
| Payments | http://localhost:3002 | - |
| Notifications | http://localhost:3003 | - |
| RabbitMQ | http://localhost:15672 | admin/admin123 |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3004 | admin/admin123 |

## Comandos Útiles

```bash
# Estado
docker-compose ps

# Logs (tiempo real)
docker-compose logs -f

# Logs de un servicio
docker-compose logs -f auth-service

# Detener
docker-compose stop

# Reiniciar
docker-compose restart

# Limpiar TODO
docker-compose down -v
```

## Credenciales por Defecto

| Sistema | Usuario | Contraseña |
|---------|---------|-----------|
| PostgreSQL | admin | admin123 |
| MongoDB | admin | admin123 |
| RabbitMQ | admin | admin123 |
| Grafana | admin | admin123 |

> [!WARNING]
> Cambiar credenciales en `.env` antes de producción.

## Troubleshooting

**"Port already in use"**
```bash
# Cambiar puerto en docker-compose.yml
# ports: - "3001:3000"  # Host:Container
```

**"Services not starting"**
```bash
docker-compose logs -f  # Ver el error
docker-compose restart  # Reintentar
```

**"Connection refused"**
```bash
# Esperar 2-3 minutos, los servicios tardan en iniciar
docker-compose logs -f  # Verificar progreso
```

## Requisitos Mínimos

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM
- 2GB disco

## Siguiente

- [README.md](./README.md) - Descripción del proyecto
- [docs/api-specs.md](./docs/api-specs.md) - API endpoints
- [docs/architecture.md](./docs/architecture.md) - Arquitectura
