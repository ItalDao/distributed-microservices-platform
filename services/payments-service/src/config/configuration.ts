export default () => ({
  port: parseInt(process.env.PORT || '3002', 10),
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://admin:admin123@localhost:27017/payments_db?authSource=admin',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672',
  },
});