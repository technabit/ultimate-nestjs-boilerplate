interface ClassConstructor {
    new (...args: any[]): object;
}
export declare function ExplicitSerialize(): MethodDecorator & ClassDecorator;
export declare function Serialize(dto: ClassConstructor): MethodDecorator & ClassDecorator;
export {};
