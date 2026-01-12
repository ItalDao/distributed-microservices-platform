# Getting Started Guide

Quick guide to get the Distributed Microservices Platform up and running.

---

## 5-Minute Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ItalDao/distributed-microservices-platform.git
cd distributed-microservices-platform
```

### 2. Start Infrastructure
```bash
cd infrastructure
docker-compose up -d
```

### 3. Install Dependencies
```bash
cd ..
npm run install:all
```

### 4. Start Services
```bash
npm run dev
```

### 5. Verify Services
```bash
# Check API Gateway
curl http://localhost:3000/health

# Check individual services
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Payments
curl http://localhost:3003/health  # Notifications
```

**All services running!** ✓

---

## Access Points

| Service | URL | Port |
|---------|-----|------|
| API Gateway | http://localhost:3000 | 3000 |
| Auth Service | http://localhost:3001 | 3001 |
| Payments Service | http://localhost:3002 | 3002 |
| Notifications Service | http://localhost:3003 | 3003 |
| Prometheus | http://localhost:9090 | 9090 |
| Grafana | http://localhost:3004 | 3004 |
| RabbitMQ | http://localhost:15672 | 15672 |

**Grafana Credentials**: admin/admin
**RabbitMQ Credentials**: guest/guest

---

## Next Steps

### Learn the Project
1. Read [README.md](./README.md)
2. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
3. Review [FAQ.md](./FAQ.md)

### Understand the Architecture
1. Read [docs/architecture.md](./docs/architecture.md)
2. Review [docs/api-specs.md](./docs/api-specs.md)

### Use the APIs
```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'

# Create payment
curl -X POST http://localhost:3000/payments/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "amount": "99.99",
    "currency": "USD",
    "method": "credit_card",
    "description": "Purchase subscription"
  }'
```

See [docs/api-specs.md](./docs/api-specs.md) for complete API documentation.

### Set Up for Development
1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Review [docs/CONFIGURATION.md](./docs/CONFIGURATION.md)
3. Check coding standards
4. Start development

### Deploy to Production
1. Read [docs/deployment.md](./docs/deployment.md)
2. Choose deployment method
3. Configure environment
4. Deploy services
5. Set up monitoring

---

## Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Check ports aren't in use
lsof -i :3000  # Or netstat on Windows

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Connection Failed
```bash
# Check PostgreSQL
psql -U postgres -h localhost

# Check MongoDB
mongo localhost:27017

# Check connection strings in .env files
cat services/auth-service/.env
```

### Port Already in Use
```bash
# Change port in .env
echo "PORT=3010" > services/auth-service/.env

# Restart service
docker-compose restart auth-service
```

See [docs/deployment.md#troubleshooting](./docs/deployment.md#troubleshooting) for more help.

---

## Test the Services

### Run All Tests
```bash
npm run test           # Unit tests
npm run test:cov       # With coverage
npm run test:e2e       # E2E tests
```

### Test Scripts
```bash
# Test Auth Service
node test-auth.js

# Test Payments Service
node test-payments.js
```

---

## Documentation Map

```
START HERE
    |
    ├── README.md (Overview)
    |       |
    |       ├── QUICK_REFERENCE.md (Fast links)
    |       |
    |       └── FAQ.md (Q&A)
    |
    ├── CONTRIBUTING.md (Development)
    |       |
    |       └── docs/architecture.md (Design)
    |
    ├── docs/api-specs.md (APIs)
    |
    ├── docs/CONFIGURATION.md (Setup)
    |
    └── docs/deployment.md (Operations)
```

---

## Common Commands

```bash
# Install dependencies
npm run install:all

# Start services in development
npm run dev

# Run tests
npm run test
npm run test:cov
npm run test:e2e

# Lint code
npm run lint
npm run lint:fix

# Build services
npm run build

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Clean everything
docker-compose down -v  # Also removes volumes
```

---

## Environment Files

Each service needs a `.env` file. Templates are provided:

```bash
# Create .env files from templates
cp services/auth-service/.env.example services/auth-service/.env
cp services/payments-service/.env.example services/payments-service/.env
cp services/notifications-service/.env.example services/notifications-service/.env
cp services/api-gateway/.env.example services/api-gateway/.env
```

See [docs/CONFIGURATION.md](./docs/CONFIGURATION.md) for all options.

---

## Performance Tips

- Use Redis caching for frequently accessed data
- Enable database connection pooling
- Configure rate limiting appropriately
- Use pagination for large datasets
- Monitor Prometheus metrics regularly
- Review logs for performance issues

See [docs/architecture.md#scalability-design](./docs/architecture.md#scalability-design) for details.

---

## Getting Help

### Documentation
- [README.md](./README.md) - Overview
- [FAQ.md](./FAQ.md) - Questions
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Links
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Full index

### Support
- GitHub Issues: [Issues](https://github.com/ItalDao/distributed-microservices-platform/issues)
- Author: [@ItalDao](https://github.com/ItalDao)
- Email: [Contact via GitHub](https://github.com/ItalDao)

---

## System Requirements

- **Node.js**: 18.0.0+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **RAM**: 4GB minimum
- **Disk**: 2GB free space

---

## What's Included

- ✓ 4 microservices (Auth, Payments, Notifications, API Gateway)
- ✓ Event-driven architecture with RabbitMQ
- ✓ Polyglot persistence (PostgreSQL, MongoDB, Redis)
- ✓ Complete monitoring (Prometheus, Grafana)
- ✓ API rate limiting and authentication
- ✓ Health checks and metrics
- ✓ Comprehensive testing
- ✓ Production-ready code
- ✓ Complete documentation

---

## Next: Read the Documentation

Now that you have the system running:

1. **Quick Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) (5 min)
2. **Full README**: [README.md](./README.md) (15 min)
3. **Architecture**: [docs/architecture.md](./docs/architecture.md) (30 min)
4. **API Guide**: [docs/api-specs.md](./docs/api-specs.md) (20 min)
5. **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md) (if developing)

---

## Success Checklist

- [ ] Repository cloned
- [ ] Docker services running
- [ ] Dependencies installed
- [ ] Services started
- [ ] Health checks passing
- [ ] All 4 services accessible
- [ ] Grafana accessible
- [ ] Prometheus accessible
- [ ] First API call successful
- [ ] Tests passing

**All done?** You're ready to explore! 🚀

---

## Quick Reference

| What | Command | URL |
|------|---------|-----|
| Start | `docker-compose up -d` + `npm run dev` | - |
| Test | `npm run test` | - |
| Health | `curl http://localhost:3000/health` | http://localhost:3000 |
| API Docs | Read [docs/api-specs.md](./docs/api-specs.md) | - |
| Monitoring | Access Grafana | http://localhost:3004 |
| Help | Read [FAQ.md](./FAQ.md) | - |

---

**Last Updated**: January 11, 2026
**Version**: 2.0
**License**: MIT
**Author**: Matias (@ItalDao)

[← Back to README](./README.md)
