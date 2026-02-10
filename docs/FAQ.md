# Frequently Asked Questions (FAQ)

Common questions and answers about the Distributed Microservices Platform.

> [!NOTE]
> This FAQ reflects the current demo setup (local Docker + API Gateway).

---

## Table of Contents

- [Getting Started](#getting-started)
- [Installation & Setup](#installation--setup)
- [Services & Architecture](#services--architecture)
- [API & Integration](#api--integration)
- [Testing](#testing)
- [Deployment & Production](#deployment--production)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Performance](#performance)
- [Contributing](#contributing)

---

## Getting Started

### What is the Distributed Microservices Platform?

The Distributed Microservices Platform is a production-ready microservices system demonstrating modern software engineering practices. It includes:

- 4 microservices (Auth, Payments, Notifications, API Gateway)
- Event-driven architecture with RabbitMQ
- Polyglot persistence (PostgreSQL, MongoDB, Redis)
- Complete observability (Prometheus, Grafana, Winston)
- Full test coverage and documentation

### Who is this project for?

This project is ideal for:
- Learning microservices architecture
- Reference implementation for enterprise systems
- Building production systems on modern stack
- Training and educational purposes
- Hiring evaluations and technical interviews

### What technologies does it use?

**Core Stack**:
- NestJS (framework)
- TypeScript (language)
- PostgreSQL, MongoDB, Redis (databases)
- RabbitMQ (message broker)
- Prometheus + Grafana (monitoring)
- Docker + Docker Compose (containerization)

See [Technology Stack](./README.md#technology-stack) for details.

### How much experience do I need?

Recommended background:
- Basic Node.js/JavaScript knowledge
- Understanding of REST APIs
- Familiarity with microservices concepts
- Docker basics (helpful but not required)
- Database concepts (SQL/NoSQL)

### Is this production-ready?

The codebase demonstrates production patterns and best practices, but requires:
- Security hardening for your specific needs
- Performance testing and optimization
- Infrastructure setup for your deployment platform
- Monitoring and alerting configuration

---

## Installation & Setup

### How do I install the project?

**Quick Start**:
```bash
git clone https://github.com/ItalDao/distributed-microservices-platform.git
cd distributed-microservices-platform

# Start infrastructure
cd infrastructure
docker-compose up -d

# Install dependencies
cd ..
npm run install:all

# Start services
npm run dev
```

See [Quick Start Guide](./README.md#quick-start-guide) for detailed instructions.

### What are the system requirements?

**Minimum Requirements**:
- Node.js 18.0.0+
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM
- 2GB disk space

**Recommended**:
- Node.js 20+ (latest LTS)
- Docker latest version
- 8GB+ RAM
- 10GB+ disk space
- SSD storage for databases

### Can I run this on Windows/macOS/Linux?

Yes, all three operating systems are supported:
- **Windows**: Use Windows Terminal + Docker Desktop
- **macOS**: Use Docker Desktop (Intel or Apple Silicon)
- **Linux**: Install Docker and Docker Compose via package manager

### How long does installation take?

Typical installation time:
- Clone repository: 1 minute
- Docker image pulls: 5-10 minutes (first time)
- npm install: 3-5 minutes per service
- Service startup: 1-2 minutes
- **Total**: 10-20 minutes

### What if Docker Compose startup fails?

**Troubleshooting steps**:
```bash
# 1. Check Docker is running
docker --version

# 2. Check Docker Compose
docker-compose --version

# 3. View logs
docker-compose logs

# 4. Stop and retry
docker-compose down
docker-compose up -d --no-deps --build
```

---

## Services & Architecture

### What does each service do?

**Auth Service** (Port 3001):
- User registration and login
- JWT token generation and validation
- User management

**Payments Service** (Port 3002):
- Payment transaction creation
- Payment status management
- Transaction history

**Notifications Service** (Port 3003):
- Email notifications
- Template management
- Event-driven email sending

**API Gateway** (Port 3000):
- Centralized request routing
- Authentication middleware
- Rate limiting
- Health aggregation

### Can I run services independently?

Yes, each service is independent, but:
- Auth Service can run standalone
- Payments Service needs MongoDB and RabbitMQ
- Notifications Service needs Redis and RabbitMQ
- API Gateway needs all services running

### How do services communicate?

**Synchronous**: REST API via HTTP
- Client → API Gateway → Services
- Services respond immediately

**Asynchronous**: RabbitMQ events
- Service A publishes event
- Service B consumes event
- Loose coupling, eventual consistency

### Can I modify the microservices?

Absolutely! You can:
- Add new endpoints
- Modify business logic
- Add new databases
- Create new services
- Change technology stack per service

---

## API & Integration

### How do I authenticate API requests?

**Process**:
1. Call `POST /auth/login` with credentials
2. Receive JWT access token
3. Include token in Authorization header: `Bearer {token}`

**Example**:
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

See [Authentication API](./docs/api-specs.md#authentication-api) for details.

### What's the rate limit?

Default rate limit: **100 requests per minute per IP address**

When exceeded:
- Returns HTTP 429 Too Many Requests
- Includes `Retry-After` header
- Use exponential backoff for retries

See [Rate Limiting](./docs/api-specs.md#rate-limiting) for configuration.

### Can I use this with a frontend application?

Yes! Configure CORS in API Gateway:
```bash
# .env
CORS_ORIGINS=http://localhost:4200,https://app.example.com
```

Supported frontend frameworks:
- React
- Angular
- Vue
- Any framework that makes HTTP requests

### What payment methods are supported?

**Supported Methods**:
- Credit Card
- Debit Card
- PayPal
- Bank Transfer

**Note**: This is a simulation. For real payments, integrate a payment gateway like Stripe or PayPal.

### How do I send notifications?

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "type": "welcome",
    "data": {"firstName": "John"}
  }'
```

See [Notifications API](./docs/api-specs.md#notifications-api) for all notification types.

---

## Testing

### How do I run tests?

**Unit Tests**:
```bash
npm run test                    # Run all tests
npm run test:watch             # Watch mode
npm run test:cov               # With coverage
```

**E2E Tests**:
```bash
npm run test:e2e               # End-to-end tests
```

See [Testing Guide](./README.md#testing-strategy) for details.

### What's the test coverage?

**Target Coverage**:
- Auth Service: >85%
- Payments Service: >85%
- Notifications Service: >85%
- API Gateway: >80%

**View Coverage**:
```bash
npm run test:cov
open coverage/index.html
```

### How do I write tests?

**Test Template**:
```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should return user', async () => {
    const result = await service.getUser('123');
    expect(result).toBeDefined();
  });
});
```

See [Testing Requirements](./CONTRIBUTING.md#testing-requirements) for guidelines.

### Can I skip tests in development?

Not recommended, but you can:
```bash
npm run test:no-coverage       # Skip coverage checks
npm test -- --testPathIgnorePatterns # Skip specific tests
```

Best practice: Always write and run tests.

---

## Deployment & Production

### How do I deploy to production?

**Deployment Methods**:
1. **Docker Compose** (small scale)
   - See [Docker Compose Deployment](./docs/deployment.md#docker-compose-deployment)

2. **Kubernetes** (large scale)
   - See [Kubernetes Deployment](./docs/deployment.md#kubernetes-deployment-advanced)

3. **Cloud Platforms**
   - AWS: ECS, App Runner
   - Google Cloud: Cloud Run, GKE
   - Azure: Container Instances, AKS
   - Heroku: Docker container

### What's the minimum infrastructure for production?

**Required**:
- 3+ API Gateway instances (load balanced)
- 2+ instances per microservice
- Managed PostgreSQL database
- Managed MongoDB database
- Redis cache cluster
- RabbitMQ cluster
- Monitoring stack

See [Production Environment](./docs/deployment.md#production-environment) for details.

### How do I handle SSL/TLS certificates?

**Options**:
1. **Let's Encrypt** (free)
   ```bash
   certbot certonly --standalone -d api.example.com
   ```

2. **AWS ACM** (managed)
   - Use AWS Certificate Manager for free certificates

3. **Self-signed** (development only)
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem
   ```

### How do I scale the services?

**Horizontal Scaling**:
```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        averageUtilization: 70
```

See [Scaling Strategies](./docs/deployment.md#scaling-strategies) for more.

### How do I backup data?

**Database Backups**:
```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# MongoDB
mongodump --uri="$MONGODB_URL" --out=/backup

# Redis
redis-cli BGSAVE
```

**Backup Strategy**:
- Daily automated backups
- Offsite storage (S3, GCS)
- Point-in-time recovery capability
- Regular restore testing

---

## Troubleshooting

### Service won't start

**Check logs**:
```bash
docker-compose logs auth-service

# Or for individual service
npm run start:dev
```

**Common causes**:
- Port already in use: Change PORT in .env
- Database not running: `docker-compose up -d postgres`
- Missing environment variables: Check .env file
- Module not installed: `npm install`

### Database connection fails

**Verify connection**:
```bash
# PostgreSQL
psql -U postgres -h localhost

# MongoDB
mongo localhost:27017

# Redis
redis-cli ping
```

**Check connection string**:
```bash
# PostgreSQL: postgresql://user:password@host:port/database
# MongoDB: mongodb://host:port/database
# Redis: redis://host:port
```

### Port already in use

```bash
# Find process using port
lsof -i :3001                    # macOS/Linux
netstat -ano | findstr :3001   # Windows

# Kill process
kill -9 <PID>                    # macOS/Linux
taskkill /PID <PID> /F          # Windows

# Or change port in .env
PORT=3010
```

### High memory usage

**Troubleshooting**:
```bash
# Check memory usage
docker stats

# Increase memory limit in docker-compose.yml
mem_limit: 1024m

# Check for memory leaks in logs
docker-compose logs --tail=100 | grep -i memory
```

### CORS errors

**Solution**:
```bash
# Update .env
CORS_ORIGINS=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true

# Restart service
docker-compose restart api-gateway
```

---

## Security

### How is data encrypted?

**Encryption**:
- Database passwords: bcrypt (auth service)
- JWT tokens: HMAC-SHA256
- Connections: TLS/SSL (production)
- Data at rest: Database-level encryption

**To enhance**:
1. Enable database encryption at rest
2. Use Vault for secrets management
3. Implement end-to-end encryption
4. Regular security audits

### How do I rotate secrets?

**Password Rotation**:
```bash
# Generate new secret
openssl rand -base64 32

# Update in .env
JWT_SECRET=new-secret

# Restart services
docker-compose restart

# Old tokens remain valid until expiry
```

### Is this GDPR compliant?

Not by default. To achieve GDPR compliance:
1. Implement data deletion (right to be forgotten)
2. Add audit logging
3. Encrypt sensitive data
4. Implement data export
5. Update privacy policy

See [Security Checklist](./docs/deployment.md#security-checklist).

### How do I report security issues?

**DO NOT** open public GitHub issues for security vulnerabilities.

Instead:
1. Email maintainers privately
2. Provide detailed reproduction steps
3. Wait for response before public disclosure
4. Follow responsible disclosure practice

Email: [security@example.com](mailto:matias@example.com)

---

## Performance

### How do I improve performance?

**Optimizations**:
1. **Caching**: Use Redis for frequently accessed data
2. **Database**: Add indexes, use connection pooling
3. **API**: Enable compression, use pagination
4. **Infrastructure**: Increase CPU/RAM, use CDN

### What's the throughput?

**Expected Performance** (per instance):
- Auth Service: 500+ req/sec
- Payments Service: 300+ req/sec
- Notifications Service: 200+ req/sec
- API Gateway: 1000+ req/sec

Actual depends on:
- Database performance
- Network latency
- Hardware resources
- Concurrent connections

### How do I monitor performance?

**Tools**:
- Prometheus: Metrics collection
- Grafana: Visualization
- Winston: Application logging

Access at:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3004

### Why is my service slow?

**Common causes**:
1. **Database**: Missing indexes, slow queries
2. **Memory**: Insufficient RAM, memory leaks
3. **Network**: High latency, bandwidth limits
4. **Code**: Inefficient algorithms, blocking operations

**Diagnosis**:
```bash
# Check metrics
curl http://localhost:3000/metrics | grep duration

# Check logs
docker-compose logs --tail=100 | grep -i slow

# Analyze performance
npm run test:perf
```

---

## Contributing

### How do I contribute?

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Fork repository
3. Create feature branch
4. Make changes with tests
5. Submit pull request

### What types of contributions are welcome?

- **Code**: Features, bug fixes, optimizations
- **Documentation**: Guides, API specs, examples
- **Tests**: Increase coverage, add test cases
- **Infrastructure**: Docker improvements, CI/CD
- **Issues**: Bug reports, feature requests

### How do I report a bug?

Use GitHub Issues with template:
```markdown
## Description
Clear bug description

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen

## Actual Behavior
What actually happens
```

### How long does PR review take?

Typical review time:
- Simple changes: 24-48 hours
- Complex changes: 3-5 days
- Weekend: May take longer

### Can I suggest features?

Yes! Create GitHub Issue with:
- Feature description
- Use case/motivation
- Proposed implementation (optional)
- Priority level

---

## Other Questions

### Where's the documentation?

- [README.md](./README.md) - Overview
- [Architecture Guide](./docs/architecture.md) - System design
- [API Specifications](./docs/api-specs.md) - API docs
- [Deployment Guide](./docs/deployment.md) - Deployment
- [Contributing Guide](./CONTRIBUTING.md) - Contributing
- [Configuration Guide](./docs/CONFIGURATION.md) - Configuration

### How do I get help?

**Resources**:
- GitHub Issues: Bug reports, features
- Documentation: Guides, examples
- Discussions: Community questions
- Author: [@ItalDao](https://github.com/ItalDao)

### Is there a roadmap?

Yes, see [Architecture Guide](./docs/architecture.md#future-enhancements) for planned features.

### Can I use this commercially?

Yes! This is MIT licensed. You can:
- Use commercially
- Modify code
- Distribute
- Use privately

See [LICENSE](./LICENSE) file.

### How often is this updated?

- Active development
- Regular security updates
- Community contributions
- Latest best practices

Subscribe to releases:
https://github.com/ItalDao/distributed-microservices-platform/releases

---

## Still Have Questions?

- Check existing issues: https://github.com/ItalDao/distributed-microservices-platform/issues
- Review documentation: See links above
- Contact author: [@ItalDao](https://github.com/ItalDao)
- Open discussion: https://github.com/ItalDao/distributed-microservices-platform/discussions

**Last Updated**: January 11, 2026
