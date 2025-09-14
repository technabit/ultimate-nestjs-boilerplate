import { FileInterceptor } from '@nest-lab/fastify-multer';
import { NestInterceptor, Type } from '@nestjs/common';
type FileInterceptorParameters = Parameters<typeof FileInterceptor>;
declare function FileUploadInterceptor(field: FileInterceptorParameters[0], options?: FileInterceptorParameters[1] & {
    multiple?: boolean;
    maxCount?: number;
}): Type<NestInterceptor>;
export default FileUploadInterceptor;
