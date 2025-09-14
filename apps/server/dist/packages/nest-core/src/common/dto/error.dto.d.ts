import { ErrorDetailDto } from './error-detail.dto';
export declare class ErrorDto {
    statusCode: number;
    error: string;
    message: string;
    errorCode?: string;
    details?: ErrorDetailDto[];
    stack?: string;
    trace?: Error | unknown;
}
