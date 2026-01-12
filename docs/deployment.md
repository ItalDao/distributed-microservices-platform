# Deployment Guide

## Overview

This guide covers deployment strategies for the Distributed Microservices Platform across different environments: development, staging, and production.

---

## Environment Setup

### Development Environment

**Purpose**: Local development with Docker Compose

**Prerequisites**:
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+
- Git

**Setup Steps**:

```bash
# Clone repository
git clone https://github.com/ItalDao/distributed-microservices-platform.git
cd distributed-microservices-platform

# Start infrastructure
cd infrastructure
docker-compose up -d

# Verify all services are running
docker-compose ps
```

**Services Running**:
```
SERVICE              PORT      STATUS
PostgreSQL          5432      Running
MongoDB             27017     Running
Redis               6379      Running
RabbitMQ            5672      Running
RabbitMQ Management 15672     Running
Prometheus          9090      Running
```

**Verification**:
```bash
# Test RabbitMQ
curl http://localhost:15672
# Expected: Redirect to login page

# Test Prometheus
curl http://localhost:9090
# Expected: Prometheus web UI

# Check database connections
psql -U postgres -h localhost  # PostgreSQL
mongo localhost:27017         # MongoDB
redis-cli -h localhost        # Redis
```

---

### Staging Environment

**Purpose**: Pre-production testing with production-like configuration

**Infrastructure**:
- Docker containers on staging server
- Shared database instances
- Real SSL certificates
- Performance monitoring enabled

**Deployment Process**:

```bash
# Pull latest code
git checkout staging
git pull origin staging

# Build Docker images
docker build -t auth-service:staging services/auth-service/
docker build -t payments-service:staging services/payments-service/
docker build -t notifications-service:staging services/notifications-service/
docker build -t api-gateway:staging services/api-gateway/

# Push to registry (if using)
docker tag auth-service:staging myregistry/auth-service:staging
docker push myregistry/auth-service:staging

# Deploy with Docker Compose
cd infrastructure
docker-compose -f docker-compose.staging.yml up -d
```

**Environment Variables**:
```bash
# .env.staging
NODE_ENV=staging
LOG_LEVEL=info
DB_HOST=staging-postgres.internal
REDIS_URL=redis://staging-redis.internal:6379
RABBITMQ_URL=amqp://user:password@staging-rabbitmq.internal:5672
JWT_SECRET=<secure-random-secret>
API_GATEWAY_RATE_LIMIT=100
```

**Post-Deployment Testing**:
```bash
# Run health checks
curl https://staging-api.example.com/health

# Run E2E tests
npm run test:e2e

# Verify database connections
npm run db:verify

# Check service metrics
curl https://staging-api.example.com/metrics
```

---

### Production Environment

**Purpose**: Live user-facing system with high availability

**Infrastructure Requirements**:

| Component | Type | Count | Notes |
|-----------|------|-------|-------|
| API Gateway | Container | 3 | Behind load balancer |
| Auth Service | Container | 3 | Horizontal scaling |
| Payments Service | Container | 3 | Horizontal scaling |
| Notifications Service | Container | 2 | Event-driven |
| PostgreSQL | Database | 1 | With replication |
| MongoDB | Database | 3 | Replica set |
| Redis | Cache | 1 | With persistence |
| RabbitMQ | Queue | 3 | Cluster mode |
| Prometheus | Monitoring | 1 | Long-term storage |
| Grafana | Dashboard | 1 | Multiple replicas optional |

**Architecture Diagram**:
```
Internet Traffic
      |
      v
  Load Balancer (HTTPS)
      |
      +---> API Gateway 1 (Port 3000)
      +---> API Gateway 2 (Port 3000)
      +---> API Gateway 3 (Port 3000)
            |
            +---> Auth Service Cluster
            +---> Payments Service Cluster
            +---> Notifications Service Cluster
            |
            Database Layer (replicated)
            Message Queue (clustered)
            Monitoring Stack
```

**Deployment Strategy**:

```bash
# Blue-Green Deployment
# 1. Deploy to "green" environment
# 2. Run full test suite
# 3. Switch traffic to "green"
# 4. Keep "blue" for rollback

# Rolling Deployment (per service)
# 1. Deploy new version to 1 instance
# 2. Run health checks
# 3. Gradually shift traffic
# 4. Deploy to remaining instances

# Zero-downtime deployment steps:
git checkout main
git pull origin main

# Build and push images
./scripts/build-and-push.sh production

# Deploy with rolling update
kubectl set image deployment/api-gateway \
  api-gateway=myregistry/api-gateway:$(git rev-parse --short HEAD) \
  --record=true

# Verify deployment
kubectl rollout status deployment/api-gateway
```

**Production Environment Variables**:
```bash
# .env.production
NODE_ENV=production
LOG_LEVEL=warn
DB_HOST=prod-postgres-primary.internal
DB_REPLICA=prod-postgres-replica.internal
MONGODB_REPLICA_SET=rs0
REDIS_URL=redis://prod-redis-cluster.internal:6379
RABBITMQ_URL=amqp://prod-cluster1.internal,prod-cluster2.internal,prod-cluster3.internal
JWT_SECRET=<secure-random-secret-from-vault>
JWT_EXPIRY=24h
API_GATEWAY_RATE_LIMIT=1000
CORS_ORIGINS=https://app.example.com
HTTPS_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/
```

---

## Database Deployment

### PostgreSQL Setup

**Initial Setup**:
```bash
# Create user and database
CREATE USER api_user WITH PASSWORD 'secure_password';
CREATE DATABASE platform_db OWNER api_user;

# Grant privileges
GRANT CONNECT ON DATABASE platform_db TO api_user;
GRANT USAGE ON SCHEMA public TO api_user;
GRANT CREATE ON SCHEMA public TO api_user;
```

**Replication Configuration** (for high availability):

```bash
# Primary server setup
# postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64
hot_standby = on

# Recovery configuration
# recovery.conf
standby_mode = 'on'
primary_conninfo = 'host=primary.example.com'
restore_command = 'cp /mnt/server/wal_archive/%f %p'
```

**Backup Strategy**:
```bash
# Daily backups
pg_dump -U api_user -h localhost platform_db > backup_$(date +%Y%m%d).sql

# WAL archiving for point-in-time recovery
archive_command = 'cp %p /mnt/server/wal_archive/%f'
```

**Migrations**:
```bash
# Run migrations
npm run typeorm migration:run

# Revert migrations if needed
npm run typeorm migration:revert

# Create new migration
npm run typeorm migration:create -n AddNewTable
```

---

### MongoDB Setup

**Replica Set Configuration** (for replication):

```bash
# Initialize replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-1:27017" },
    { _id: 1, host: "mongo-2:27017" },
    { _id: 2, host: "mongo-3:27017" }
  ]
})

# Verify status
rs.status()
```

**Backup Strategy**:
```bash
# Backup database
mongodump --uri="mongodb://user:password@localhost:27017/platform_db" \
  --out=/backup/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb://user:password@localhost:27017" \
  /backup/20240101
```

**Connection Pooling**:
```javascript
// Mongoose connection options
mongoose.connect(process.env.MONGODB_URI, {
  minPoolSize: 10,
  maxPoolSize: 50,
  maxConnecting: 10,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});
```

---

### Redis Setup

**Persistence Configuration**:
```bash
# redis.conf
# RDB snapshots
save 900 1        # Save after 900 sec if 1+ keys changed
save 300 10       # Save after 300 sec if 10+ keys changed
save 60 10000     # Save after 60 sec if 10000+ keys changed

# AOF (Append Only File)
appendonly yes
appendfsync everysec
```

**Memory Management**:
```bash
# Maximum memory
maxmemory 2gb
maxmemory-policy allkeys-lru  # Evict LRU keys when max reached
```

---

## Service Deployment

### Building Docker Images

**Dockerfile Template**:
```dockerfile
# Multi-stage build for optimized images
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**Build Command**:
```bash
# Development build
docker build -t auth-service:dev \
  --build-arg NODE_ENV=development \
  services/auth-service/

# Production build
docker build -t auth-service:v1.0.0 \
  --build-arg NODE_ENV=production \
  services/auth-service/
```

**Image Registry**:
```bash
# Tag image
docker tag auth-service:v1.0.0 myregistry/auth-service:v1.0.0

# Push to registry
docker push myregistry/auth-service:v1.0.0

# Pull from registry
docker pull myregistry/auth-service:v1.0.0
```

---

### Docker Compose Deployment

**Production Compose File**:
```yaml
version: '3.8'

services:
  api-gateway:
    image: myregistry/api-gateway:v1.0.0
    container_name: api-gateway
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      AUTH_SERVICE_URL: http://auth-service:3001
      PAYMENTS_SERVICE_URL: http://payments-service:3002
      NOTIFICATIONS_SERVICE_URL: http://notifications-service:3003
    depends_on:
      - auth-service
      - payments-service
      - notifications-service
    networks:
      - platform-network
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  auth-service:
    image: myregistry/auth-service:v1.0.0
    container_name: auth-service
    environment:
      DATABASE_URL: postgresql://api_user:password@postgres:5432/platform_db
      RABBITMQ_URL: amqp://rabbitmq:5672
    depends_on:
      - postgres
      - rabbitmq
    networks:
      - platform-network
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: api_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: platform_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - platform-network
    restart: always

networks:
  platform-network:
    driver: bridge

volumes:
  postgres_data:
```

**Deployment Steps**:
```bash
# Validate compose file
docker-compose config

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f api-gateway

# Stop services
docker-compose down

# Update specific service
docker-compose up -d --no-deps --build api-gateway
```

---

## Kubernetes Deployment (Advanced)

### Deployment Manifests

**API Gateway Deployment**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: myregistry/api-gateway:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: AUTH_SERVICE_URL
          value: "http://auth-service:3001"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Service Definition**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
spec:
  selector:
    app: api-gateway
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## Monitoring and Health Checks

### Health Check Configuration

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "services": {
    "auth": "healthy",
    "payments": "healthy",
    "notifications": "healthy"
  },
  "database": "connected",
  "cache": "connected",
  "messageQueue": "connected"
}
```

**Kubernetes Health Probes**:
```yaml
livenessProbe:        # Is container alive?
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:       # Is container ready for traffic?
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2
```

---

### Prometheus Monitoring

**Metrics Endpoint**: `GET /metrics`

**Key Metrics to Monitor**:
```
# Request metrics
http_requests_total{endpoint="/auth/login", status="200"}
http_request_duration_seconds{endpoint="/auth/login"}

# Error metrics
http_errors_total{endpoint="/payments", status="500"}

# Database metrics
db_connection_pool_size{service="auth"}
db_queries_duration_seconds{query_type="select"}

# Business metrics
payments_total{status="completed"}
notifications_sent{type="welcome"}
```

**Alerting Rules** (prometheus.yml):
```yaml
groups:
- name: microservices
  rules:
  - alert: ServiceDown
    expr: up{job="api-gateway"} == 0
    for: 5m
    annotations:
      summary: "{{ $labels.job }} is down"

  - alert: HighErrorRate
    expr: rate(http_errors_total[5m]) > 0.05
    annotations:
      summary: "High error rate detected"

  - alert: SlowResponse
    expr: histogram_quantile(0.99, http_request_duration_seconds) > 1
    annotations:
      summary: "Slow response times"
```

---

### Log Aggregation

**ELK Stack Setup** (optional):

```yaml
# docker-compose with ELK
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
  environment:
    - discovery.type=single-node
  ports:
    - "9200:9200"

kibana:
  image: docker.elastic.co/kibana/kibana:8.0.0
  ports:
    - "5601:5601"

logstash:
  image: docker.elastic.co/logstash/logstash:8.0.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
  ports:
    - "5000:5000/udp"
```

**Application Log Configuration**:
```typescript
// Winston transport to ELK
new winston.transports.Http({
  host: 'logstash.example.com',
  port: 5000,
  path: '/logs'
})
```

---

## Scaling Strategies

### Horizontal Scaling

**Auto-scaling Policy** (Kubernetes HPA):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Vertical Scaling

**Resource Requests/Limits**:
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

---

## Rollback Procedures

### Docker Compose Rollback

```bash
# View deployment history
docker image ls

# Rollback to previous version
docker-compose up -d api-gateway:v1.0.0

# Verify rollback
curl http://localhost:3000/health
```

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/api-gateway

# Rollback to previous version
kubectl rollout undo deployment/api-gateway

# Rollback to specific revision
kubectl rollout undo deployment/api-gateway --to-revision=3

# Verify rollback
kubectl rollout status deployment/api-gateway
```

---

## Post-Deployment Checklist

- [ ] All services are running and healthy
- [ ] Database connections established
- [ ] RabbitMQ cluster operational
- [ ] Redis cache responding
- [ ] API Gateway responding to requests
- [ ] SSL/TLS certificates valid
- [ ] Monitoring and alerting configured
- [ ] Log aggregation working
- [ ] Backups scheduled
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Performance baselines established

---

## Troubleshooting

### Common Issues

**Service Won't Start**:
```bash
# Check logs
docker-compose logs auth-service

# Verify environment variables
docker inspect auth-service | grep -i env

# Check port availability
netstat -an | grep 3001
```

**Database Connection Failures**:
```bash
# Test connection
psql -U api_user -h localhost -d platform_db

# Verify credentials in .env
cat .env | grep DATABASE

# Check network connectivity
docker network ls
docker network inspect platform-network
```

**High Memory Usage**:
```bash
# Check container memory
docker stats

# Review application logs for memory leaks
docker-compose logs --since=1h auth-service

# Increase container limits
# Modify docker-compose.yml memory limits
```

---

## Security Checklist

- [ ] Environment variables stored securely (use Vault/Secrets Manager)
- [ ] Database passwords rotated monthly
- [ ] SSL/TLS certificates valid and renewed
- [ ] API keys rotated quarterly
- [ ] Firewall rules configured
- [ ] Network segmentation implemented
- [ ] Logging audit trail enabled
- [ ] Backup encryption enabled
- [ ] DDoS protection configured
- [ ] Vulnerability scans scheduled

---

## Maintenance Schedule

**Daily**:
- Monitor application logs
- Check error rates
- Verify backup completion

**Weekly**:
- Review performance metrics
- Check disk space
- Update security patches

**Monthly**:
- Rotate credentials
- Update dependencies
- Review access logs
- Test disaster recovery

**Quarterly**:
- Full security audit
- Capacity planning review
- Performance optimization
- Documentation update

---

## Support and Escalation

**Contact Information**:
- **On-Call Engineer**: escalation@example.com
- **DevOps Team**: devops@example.com
- **Database Team**: database@example.com

**Response Times**:
- Critical (Service Down): 15 minutes
- High (Degraded): 1 hour
- Medium (Bug): 4 hours
- Low (Enhancement): 1 business day
