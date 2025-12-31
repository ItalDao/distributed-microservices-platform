export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    payments: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3002',
    notifications:
      process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3003',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
});