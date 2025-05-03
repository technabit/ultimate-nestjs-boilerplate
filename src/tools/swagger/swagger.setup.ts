import { type GlobalConfig } from '@/config/global-config.type';
import { type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as swaggerStats from 'swagger-stats';

function setupSwagger(app: INestApplication): OpenAPIObject {
  const configService = app.get(ConfigService<GlobalConfig>);
  const appName = configService.getOrThrow('app.name', { infer: true });

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('Ultimate Nest.js Boilerplate')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .addServer(
      configService.getOrThrow('app.url', { infer: true }),
      'Development',
    )
    .addServer('https://example.com', 'Staging')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: appName,
    jsonDocumentUrl: 'swagger/json',
  });

  app.use(
    swaggerStats.getMiddleware({
      name: configService.getOrThrow('app.name', { infer: true }),
      swaggerSpec: document,
      authentication: true,
      onAuthenticate(_, username: string, password: string) {
        // We use grafana credentials for all stats related things
        return (
          username ===
            configService.getOrThrow('grafana.username', { infer: true }) &&
          password ===
            configService.getOrThrow('grafana.password', { infer: true })
        );
      },
    }),
  );
  return document;
}

export default setupSwagger;
