import { UserEntity } from '@/api/user/entities/user.entity';
import { JwtService } from '@/shared/jwt/jwt.service';
import { MailService } from '@/shared/mail/mail.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerifyEmailJob } from './email.type';

@Injectable()
export class EmailQueueService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async sendEmailVerification(data: VerifyEmailJob): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: data?.userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.isEmailVerified) {
      this.logger.log(`Email is already verified for user id=${user?.id}`);
      return;
    }
    const token = await this._createEmailVerificationToken(user?.id);
    await this.mailService.sendEmailVerificationMail({
      email: user.email,
      token: token,
    });
  }

  private async _createEmailVerificationToken(userId: string): Promise<string> {
    const emailVerificationToken = await this.jwtService.createToken({
      type: 'email-verification-token',
      payload: { sub: userId },
    });
    return emailVerificationToken.token;
  }
}
