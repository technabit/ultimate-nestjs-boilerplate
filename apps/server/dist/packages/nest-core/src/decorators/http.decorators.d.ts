import { HttpStatus, type Type } from '@nestjs/common';
import { ApiOperationOptions } from '@nestjs/swagger';
type ApiResponseType = number;
type PaginationType = 'offset' | 'cursor';
interface IApiOptions<T extends Type<any>> {
    type?: T;
    summary?: string;
    description?: string;
    errorResponses?: ApiResponseType[];
    statusCode?: HttpStatus;
    isPaginated?: boolean;
    paginationType?: PaginationType;
    operations?: ApiOperationOptions;
}
type IApiPublicOptions = IApiOptions<Type<any>>;
type IApiAuthOptions = IApiOptions<Type<any>>;
export declare const ApiPublic: (options?: IApiPublicOptions) => MethodDecorator;
export declare const ApiAuth: (options?: IApiAuthOptions) => MethodDecorator;
export {};
