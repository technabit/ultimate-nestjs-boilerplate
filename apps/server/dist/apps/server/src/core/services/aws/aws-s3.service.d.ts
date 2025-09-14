import { GlobalConfig } from '@/core/config/config.type';
import { File } from '@nest-lab/fastify-multer';
import { ConfigService } from '@nestjs/config';
import { AwsS3UploadOptions, AwsS3UploadResponse } from '../../config/aws/aws-config.types';
export declare class AwsS3Service {
    private readonly configService;
    private _s3Client?;
    constructor(configService: ConfigService<GlobalConfig>);
    private get s3Client();
    uploadFile(file: File, config: AwsS3UploadOptions): Promise<AwsS3UploadResponse>;
    uploadBuffer(buffer: Buffer, config: AwsS3UploadOptions): Promise<AwsS3UploadResponse>;
    private _constructFileObject;
    private _generateFilename;
}
