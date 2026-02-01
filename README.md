# Distributed Microservices Platform

Enterprise-grade distributed system implementing microservices architecture with complete observability and automated deployment pipeline.

## Quick Start

```bash
# Start all services with Docker Compose
docker-compose up -d

# Run backend tests (19/19 passing in ~3.5 seconds)
cd services/auth-service
npm test

# Start frontend dev server (Vite)
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Auth Service: http://localhost:3001
Payments Service: http://localhost:3002
Notifications Service: http://localhost:3003
Prometheus: http://localhost:9090
Grafana: http://localhost:3004

## Documentation

All documentation is in the `docs/` folder:

- **[README_MAIN.md](./docs/README_MAIN.md)** - Complete project overview
- **[QUICK_START.md](./docs/QUICK_START.md)** - Quick reference guide
- **[TESTING.md](./docs/TESTING.md)** - Testing guide (19/19 backend tests)
- **[BEST_PRACTICES.md](./docs/BEST_PRACTICES.md)** - Development standards
- **[CI-CD.md](./docs/CI-CD.md)** - GitHub Actions pipeline
- **[DOCKER.md](./docs/DOCKER.md)** - Docker deployment
- **[CHANGELOG.md](./docs/CHANGELOG.md)** - Version history
- **[DOCUMENTATION.md](./docs/DOCUMENTATION.md)** - Documentation index

## System Status

✅ **Docker**: 11 services operational
✅ **Backend**: 19/19 unit tests passing
✅ **Frontend**: React 18 + TypeScript, fully functional
✅ **Databases**: PostgreSQL, MongoDB, Redis running
✅ **Authentication**: JWT working, register/login tested
✅ **Documentation**: Complete and professional

## Technology Stack

- **Backend**: NestJS 9+, TypeScript 5+
- **Frontend**: React 18, Vite 5, TypeScript 5.3
- **Databases**: PostgreSQL 15, MongoDB 6, Redis 7
- **Message Queue**: RabbitMQ 3.12
- **Monitoring**: Prometheus, Grafana
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest (backend), Vitest (frontend)

## Project Structure

```
distributed-microservices-platform/
├── services/
│   ├── api-gateway/          # Central routing and auth
│   ├── auth-service/         # User management and JWT
│   ├── payments-service/     # Payment processing
│   └── notifications-service/ # Email notifications
├── frontend/                 # React + TypeScript UI
├── infrastructure/           # Docker Compose, monitoring
├── docs/                     # All documentation
└── shared/                   # Shared types and utilities
```

## Getting Started

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop
2. **Start the system**: `docker-compose up -d`
3. **Wait 30-60 seconds** for all services to initialize
4. **Run tests**: `cd services/auth-service && npm test`
5. **Access frontend**: http://localhost:5173
6. **Register/Login**: Create account and test authentication

## Support

See [QUICK_START.md](./docs/QUICK_START.md) for:
- Common commands
- API endpoints
- Troubleshooting
- Development workflow

See [BEST_PRACTICES.md](./docs/BEST_PRACTICES.md) for:
- Code standards
- Testing patterns
- Git workflow
- Performance tips

---

**Status**: Production Ready | **Last Updated**: January 31, 2026
