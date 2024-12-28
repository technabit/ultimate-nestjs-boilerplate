import { MailService } from '@/shared/mail/mail.service';
import { getQueueToken } from '@nestjs/bullmq';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailQueueService } from './email.service';

describe('EmailQueueService', () => {
  let service: EmailQueueService;
  let mailServiceValue: Partial<Record<keyof MailService, jest.Mock>>;
  let jwtServiceValue: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeAll(async () => {
    mailServiceValue = {
      sendEmailVerificationMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailQueueService,
        {
          provide: MailService,
          useValue: mailServiceValue,
        },
        {
          provide: JwtService,
          useValue: jwtServiceValue,
        },
        {
          provide: getQueueToken('email'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailQueueService>(EmailQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
