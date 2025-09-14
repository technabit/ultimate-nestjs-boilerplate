import { type INestApplication } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
export declare const SWAGGER_PATH = "/swagger";
declare function setupSwagger(app: INestApplication): OpenAPIObject;
export default setupSwagger;
