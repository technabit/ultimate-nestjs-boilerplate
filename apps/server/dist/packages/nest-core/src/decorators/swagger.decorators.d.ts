import { type Type } from '@nestjs/common';
export declare const ApiPaginatedResponse: <T extends Type<any>>(options: {
    type: T;
    description?: string;
    paginationType?: "offset" | "cursor";
}) => MethodDecorator;
