import { GlobalConfig } from '@/config/global-config.type';
import { JwtToken } from '@/constants/auth.constant';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions, JwtService as NestJwtService } from '@nestjs/jwt';
import merge from 'lodash/merge';
import { JwtTokenPayload } from './jwt.type';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService<GlobalConfig>,
  ) {}

  async sign(payload: Buffer | object, options?: JwtSignOptions) {
    return this.nestJwtService.signAsync(payload, options);
  }

  async createToken(
    { type, payload }: JwtTokenPayload,
    options?: JwtSignOptions,
  ): Promise<{ token: string; options: JwtSignOptions }> {
    const _options: JwtSignOptions = {};
    switch (type) {
      case JwtToken.RefreshToken: {
        _options.secret = this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        });
        _options.expiresIn = this.configService.getOrThrow(
          'auth.refreshExpiresIn',
          {
            infer: true,
          },
        );
        break;
      }
      case JwtToken.EmailVerificationToken: {
        _options.secret = this.configService.getOrThrow(
          'auth.confirmEmailSecret',
          {
            infer: true,
          },
        );
        _options.expiresIn = this.configService.getOrThrow(
          'auth.confirmEmailExpiresIn',
          {
            infer: true,
          },
        );
        break;
      }
      case JwtToken.AccessToken:
      default: {
        _options.secret = this.configService.getOrThrow('auth.jwtSecret', {
          infer: true,
        });
        _options.expiresIn = this.configService.getOrThrow(
          'auth.jwtExpiresIn',
          {
            infer: true,
          },
        );
      }
    }
    const appliedOptions = merge(_options, options);
    const token = await this.sign(payload, appliedOptions);
    return {
      token,
      options: appliedOptions,
    };
  }

  async verifyToken<T extends JwtTokenPayload['type']>(
    token: string,
    type?: T,
  ): Promise<Extract<JwtTokenPayload, { type: T }>['payload']> {
    try {
      switch (type) {
        case JwtToken.RefreshToken: {
          const payload = await this.nestJwtService.verify(token, {
            secret: this.configService.getOrThrow('auth.refreshSecret', {
              infer: true,
            }),
          });
          return payload;
        }
        case JwtToken.EmailVerificationToken: {
          const payload = await this.nestJwtService.verify(token, {
            secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
              infer: true,
            }),
          });
          return payload;
        }
        case JwtToken.AccessToken:
        default: {
          const payload = await this.nestJwtService.verify(token, {
            secret: this.configService.getOrThrow('auth.jwtSecret', {
              infer: true,
            }),
          });
          return payload;
        }
      }
    } catch {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
