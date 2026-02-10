import {
  Controller,
  All,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  // Auth Service Routes (Public routes)
  @Public()
  @All('auth/register')
  async authRegister(@Req() req: Request, @Res() res: Response) {
    return this.forwardToService('auth', '/auth/register', req, res);
  }

  @Public()
  @All('auth/login')
  async authLogin(@Req() req: Request, @Res() res: Response) {
    return this.forwardToService('auth', '/auth/login', req, res);
  }

  @All('auth/:path(*)')
  async authRoutes(@Req() req: Request, @Res() res: Response) {
    const path = req.path;
    return this.forwardToService('auth', path, req, res);
  }

  @All('users/:path(*)')
  async usersRoutes(@Req() req: Request, @Res() res: Response) {
    const path = req.path;
    return this.forwardToService('auth', path, req, res);
  }

  @All('users')
  async usersRoot(@Req() req: Request, @Res() res: Response) {
    return this.forwardToService('auth', '/users', req, res);
  }

  // Payments Service Routes
  @All('payments/:path(*)')
  async paymentsRoutes(@Req() req: Request, @Res() res: Response) {
    const path = req.path;
    return this.forwardToService('payments', path, req, res);
  }

  @All('payments')
  async paymentsRoot(@Req() req: Request, @Res() res: Response) {
    return this.forwardToService('payments', '/payments', req, res);
  }

  // Notifications Service Routes
  @All('notifications/:path(*)')
  async notificationsRoutes(@Req() req: Request, @Res() res: Response) {
    const path = req.path;
    return this.forwardToService('notifications', path, req, res);
  }

  @All('notifications')
  async notificationsRoot(@Req() req: Request, @Res() res: Response) {
    return this.forwardToService('notifications', '/notifications', req, res);
  }

  private async forwardToService(
    service: 'auth' | 'payments' | 'notifications',
    path: string,
    req: Request,
    res: Response,
  ) {
    try {
      const result = await this.proxyService.forwardRequest(
        service,
        path,
        req.method,
        req.body,
        req.headers,
      );

      return res.status(result.status).json(result.data);
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response || error.message || 'Internal server error';
      return res.status(status).json(message);
    }
  }
}