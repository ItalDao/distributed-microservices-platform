import { Controller, Get } from '@nestjs/common';
import { register } from 'prom-client';
import { Public } from '../auth/public.decorator';

@Controller()
export class MetricsController {
  @Public()
  @Get('metrics')
  async getMetrics() {
    return register.metrics();
  }
}