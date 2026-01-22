import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  const testUser = {
    email: 'test@example.com',
    password: 'Test@1234',
    firstName: 'Test',
    lastName: 'User',
  };

  try {
    const existingUser = await usersService.findByEmail(testUser.email);
    if (existingUser) {
      console.log('✓ Test user already exists');
    } else {
      const created = await usersService.create(testUser);
      console.log('✓ Test user created:', created.email);
    }
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
