import { File } from '@nest-lab/fastify-multer';
import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: File): Promise<any>;
    uploadFiles(files: Array<File>): Promise<any>;
}
