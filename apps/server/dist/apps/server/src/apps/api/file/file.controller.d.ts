import { File } from '@nest-lab/fastify-multer';
import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: File): Promise<File | import("@app/nest-core/config/aws/aws-config.types").AwsS3UploadResponse>;
    uploadFiles(files: Array<File>): Promise<File[] | import("@app/nest-core/config/aws/aws-config.types").AwsS3UploadResponse[]>;
}
