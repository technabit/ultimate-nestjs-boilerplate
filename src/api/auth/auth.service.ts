import { GlobalConfig } from '@/config/global-config.type';
import { JwtToken } from '@/constants/auth.constant';
import { Job as JobName, Queue as QueueName } from '@/constants/job.constant';
import { I18nTranslations } from '@/generated/i18n.generated';
import { CacheService } from '@/shared/cache/cache.service';
import { JwtService } from '@/shared/jwt/jwt.service';
import { verifyPassword } from '@/utils/password/password.util';
import { CookieSerializeOptions } from '@fastify/cookie';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import * as cookie from 'cookie';
import crypto from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';
import ms from 'ms';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { AccessTokenPayload } from '@/shared/jwt/jwt.type';
import { hashPassword } from '@/utils/password/password.util';
import { VerifyEmailJob } from '@/worker/queues/email/email.type';
import { Socket } from 'socket.io';
import { UserEntity } from '../user/entities/user.entity';
import { Role } from '../user/user.enum';
import { AuthToken } from './auth.type';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly configService: ConfigService<GlobalConfig>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectQueue(QueueName.Email)
    private readonly emailQueue: Queue<VerifyEmailJob, any, string>,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    dto: LoginReqDto,
    { req, res }: { req: FastifyRequest; res: FastifyReply },
  ): Promise<LoginResDto> {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = await this._createAuthTokens({
      sub: user.id,
      role: user.role,
    });

    this._setAuthCookie(
      {
        req,
        res,
        key: 'AccessToken',
        value: token.accessToken,
      },
      { maxAge: token.tokenTTL },
    );

    this._setAuthCookie(
      {
        req,
        res,
        key: 'RefreshToken',
        value: token.refreshToken,
      },
      { maxAge: token.tokenTTL },
    );

    return {
      userId: user.id,
      tokenTTL: token.tokenTTL,
    };
  }

  async register(dto: RegisterReqDto): Promise<RegisterResDto> {
    const userExists = await this.userRepository.exists({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (userExists) {
      throw new ConflictException(
        this.i18nService.t('user.sameUsernameOrEmailAlreadyExists'),
      );
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    await user.save({ transaction: false });

    await this.emailQueue.add(JobName.EmailVerification, {
      userId: user?.id,
    });

    return {
      userId: user?.id,
    };
  }

  async refreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    const payload = await this.jwtService.verifyToken(
      dto.refreshToken,
      'refresh-token',
    );
    const { hash, sub: userId } = payload;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });
    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.notFound'));
    }

    const tokens = await this._createAuthTokens({
      sub: user.id,
      role: user?.role,
    });
    await this.cacheService.delete({ key: 'AccessToken', args: [hash] });
    return tokens;
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const payload = await this.jwtService.verifyToken(token, 'access-token');
    const { sub, hash } = payload;

    const userId = await this.cacheService.get<string>({
      key: 'AccessToken',
      args: [hash],
    });
    if (!userId || !sub || userId !== sub) {
      throw new UnauthorizedException();
    }
    return payload;
  }

  async verifyEmail(token: string) {
    const payload = await this.jwtService.verifyToken(
      token,
      'email-verification-token',
    );
    if (!payload || !payload?.sub) {
      throw new BadRequestException('Invalid token.');
    }
    const { sub: userId } = payload;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified.');
    }
    user.isEmailVerified = true;
    await this.userRepository.save(user);
    return HttpStatus.OK;
  }

  async verifySocketAccessToken(socket: Socket): Promise<AccessTokenPayload> {
    const cookies = cookie.parse(socket?.handshake?.headers?.cookie);
    const accessToken = cookies?.[JwtToken.AccessToken];
    if (!accessToken) {
      throw new UnauthorizedException('Invalid access token.');
    }
    const payload = await this.verifyAccessToken(accessToken);
    return payload;
  }

  private async _createAuthTokens(data: {
    sub: string;
    role: Role;
  }): Promise<AuthToken> {
    const { hash } = await this._generateUserHash(data?.sub);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.createToken({
        type: 'access-token',
        payload: {
          sub: data.sub,
          hash: hash,
          role: data?.role,
        },
      }),
      await this.jwtService.createToken({
        type: 'refresh-token',
        payload: {
          sub: data.sub,
          hash: hash,
        },
      }),
    ]);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      tokenTTL: ms(accessToken.options.expiresIn as string) ?? Infinity,
    };
  }

  private _setAuthCookie<T extends keyof typeof JwtToken>(
    {
      req,
      res,
      key,
      value,
    }: {
      req: FastifyRequest;
      res: FastifyReply;
      key: T;
      value: string;
    },
    options?: CookieSerializeOptions,
  ) {
    res.setCookie(JwtToken[key], value, {
      path: '/',
      httpOnly: true,
      ...(req.protocol === 'https' ? { secure: true, sameSite: 'none' } : {}),
      ...(options ?? {}),
    });
  }

  private async _generateUserHash(userId: string) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.jwtExpiresIn', {
      infer: true,
    });
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const ttl = ms(tokenExpiresIn);
    await this.cacheService.set({ key: 'AccessToken', args: [hash] }, userId, {
      ttl: ttl,
    });
    return { hash, ttl: ttl };
  }
}
