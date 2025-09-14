import { AwsS3Service } from '@app/nest-core/services/aws/aws-s3.service';
import { File } from '@nest-lab/fastify-multer';
export declare class FileService {
    private readonly awsS3Service;
    constructor(awsS3Service: AwsS3Service);
    uploadFile(file: File): Promise<any>;
    uploadMultipleFiles(files: File[]): Promise<any>;
}
