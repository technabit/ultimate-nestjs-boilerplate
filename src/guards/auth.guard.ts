import { AuthService } from '@/api/auth/auth.service';
import { IS_AUTH_OPTIONAL, IS_PUBLIC } from '@/constants/app.constant';
import { JwtToken } from '@/constants/auth.constant';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type FastifyRequest } from 'fastify';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_OPTIONAL,
      [context.getHandler(), context.getClass()],
    );

    // ws
    if (context.getType() === 'ws') {
      const socket = context.switchToWs().getClient<Socket>();
      try {
        const payload = await this.authService.verifySocketAccessToken(socket);
        socket['user'] = payload;
      } catch (_) {
        socket.disconnect();
        return false;
      }
      return true;
    }

    // http
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const accessToken = request?.cookies?.[JwtToken.AccessToken];

    if (isAuthOptional && !accessToken) {
      return true;
    }
    if (!accessToken) {
      throw new UnauthorizedException('Invalid access token.');
    }

    try {
      const payload = await this.authService.verifyAccessToken(accessToken);
      request['user'] = payload;
    } catch (_) {
      throw new UnauthorizedException('Invalid access token.');
    }

    return true;
  }
}
