import { File } from '@nest-lab/fastify-multer';
import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: File): Promise<import("../../../core/config/aws/aws-config.types").AwsS3UploadResponse | File>;
    uploadFiles(files: Array<File>): Promise<File[] | import("../../../core/config/aws/aws-config.types").AwsS3UploadResponse[]>;
}
