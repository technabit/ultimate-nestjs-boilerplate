import { AwsS3Service } from '@app/nest-core';
import { File } from '@nest-lab/fastify-multer';
export declare class FileService {
    private readonly awsS3Service;
    constructor(awsS3Service: AwsS3Service);
    uploadFile(file: File): Promise<File | import("@app/nest-core/config/aws/aws-config.types").AwsS3UploadResponse>;
    uploadMultipleFiles(files: File[]): Promise<File[] | import("@app/nest-core/config/aws/aws-config.types").AwsS3UploadResponse[]>;
}
