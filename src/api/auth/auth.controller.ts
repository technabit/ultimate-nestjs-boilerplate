import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiPublic({
  //   summary: 'Sign in with an existing account.',
  //   type: LoginResDto,
  // })
  // @Post('email/login')
  // async signIn(
  //   @Body() userLogin: LoginReqDto,
  //   @Req() req: FastifyRequest,
  //   @Res({ passthrough: true }) res: FastifyReply,
  // ): Promise<LoginResDto> {
  //   return await this.authService.login(userLogin, { req, res });
  // }

  // @ApiPublic({
  //   summary: 'Register a new account.',
  //   type: RegisterResDto,
  // })
  // @Post('email/register')
  // async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
  //   return await this.authService.register(dto);
  // }

  // @ApiPublic({
  //   summary: 'Verify email associated with the account.',
  // })
  // @Post('email/verify')
  // async verifyEmail(@Body() dto: VerifyEmailDto) {
  //   return await this.authService.verifyEmail(dto.token);
  // }
}
