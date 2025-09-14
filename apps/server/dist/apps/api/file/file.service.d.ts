import { AwsS3Service } from '@/core/services/aws/aws-s3.service';
import { File } from '@nest-lab/fastify-multer';
export declare class FileService {
    private readonly awsS3Service;
    constructor(awsS3Service: AwsS3Service);
    uploadFile(file: File): Promise<import("../../../core/config/aws/aws-config.types").AwsS3UploadResponse | File>;
    uploadMultipleFiles(files: File[]): Promise<File[] | import("../../../core/config/aws/aws-config.types").AwsS3UploadResponse[]>;
}
