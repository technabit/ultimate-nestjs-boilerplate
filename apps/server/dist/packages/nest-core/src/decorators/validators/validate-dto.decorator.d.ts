export declare function ValidateDto(dtoClass: any, options?: {
    property?: string;
    argIndex?: number;
}): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
