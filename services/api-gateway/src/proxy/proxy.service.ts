import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxyService {
  private readonly authServiceUrl: string;
  private readonly paymentsServiceUrl: string;
  private readonly notificationsServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('services.auth')!;
    this.paymentsServiceUrl = this.configService.get<string>(
      'services.payments',
    )!;
    this.notificationsServiceUrl = this.configService.get<string>(
      'services.notifications',
    )!;
  }

  async forwardRequest(
    service: 'auth' | 'payments' | 'notifications',
    path: string,
    method: string,
    body?: any,
    headers?: any,
  ): Promise<any> {
    const serviceUrls = {
      auth: this.authServiceUrl,
      payments: this.paymentsServiceUrl,
      notifications: this.notificationsServiceUrl,
    };

    const baseUrl = serviceUrls[service];
    const url = `${baseUrl}${path}`;

    const config: AxiosRequestConfig = {
      method: method as any,
      url,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      data: body,
      validateStatus: () => true, // Don't throw on any status
    };

    try {
      const response = await firstValueFrom(this.httpService.request(config));

      // If the service returned an error status, throw it
      if (response.status >= 400) {
        throw new HttpException(
          response.data || 'Service error',
          response.status,
        );
      }

      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(`Error forwarding to ${service} service:`, error.message);
      throw new HttpException(
        {
          message: 'Service unavailable',
          service,
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}