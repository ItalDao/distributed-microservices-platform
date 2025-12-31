import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Public } from '../auth/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  async checkHealth() {
    const services = {
      auth: this.configService.get<string>('services.auth'),
      payments: this.configService.get<string>('services.payments'),
      notifications: this.configService.get<string>('services.notifications'),
    };

    const results = await Promise.allSettled([
      this.checkService(services.auth!, 'auth'),
      this.checkService(services.payments!, 'payments'),
      this.checkService(services.notifications!, 'notifications'),
    ]);

    const healthStatus = {
      gateway: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
      services: {} as any,
    };

    results.forEach((result, index) => {
      const serviceName = ['auth', 'payments', 'notifications'][index];
      if (result.status === 'fulfilled') {
        healthStatus.services[serviceName] = result.value;
      } else {
        healthStatus.services[serviceName] = {
          status: 'error',
          message: 'Service unavailable',
        };
      }
    });

    const allHealthy = Object.values(healthStatus.services).every(
      (s: any) => s.status === 'ok',
    );

    return {
      ...healthStatus,
      overall: allHealthy ? 'healthy' : 'degraded',
    };
  }

  private async checkService(url: string, name: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${url}/health`, { timeout: 3000 }),
      );
      return {
        status: 'ok',
        service: name,
        response: response?.data || {},
      };
    } catch (error) {
      return {
        status: 'error',
        service: name,
        message: 'Service unavailable',
      };
    }
  }
}