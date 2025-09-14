"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWAGGER_PATH = void 0;
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
exports.SWAGGER_PATH = '/swagger';
function setupSwagger(app) {
    const configService = app.get((config_1.ConfigService));
    const appName = configService.getOrThrow('app.name', { infer: true });
    const config = new swagger_1.DocumentBuilder()
        .setTitle(appName)
        .setDescription(`<p>Ultimate Nest.js Boilerplate.</p>
      <p>Click <a href="/api/auth/reference">here</a> to see authentication API's.</p>`)
        .setVersion('1.0')
        .addBearerAuth()
        .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
        .addServer(configService.getOrThrow('app.url', { infer: true }), 'Development')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(exports.SWAGGER_PATH, app, document, {
        customSiteTitle: appName,
        jsonDocumentUrl: 'swagger/json',
    });
    return document;
}
exports.default = setupSwagger;
//# sourceMappingURL=swagger.setup.js.map