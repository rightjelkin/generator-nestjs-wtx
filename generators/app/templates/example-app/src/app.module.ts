import { IHelmetConfiguration } from 'helmet';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import { Connection } from 'typeorm';

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';
import { CompressionMiddleware } from './common/middlewares/compression.middleware';
import { HelmetMiddleware } from './common/middlewares/helmet.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

const allRoutes = {
  method: RequestMethod.ALL,
  path: '*',
};

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    ArticleModule,
    UserModule,
    ProfileModule,
    TagModule,
    LoggerModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class ApplicationModule implements NestModule {
  public static helmetOptions: IHelmetConfiguration = {
    hsts: {
      maxAge: 31536000,
      includeSubdomains: true,
    },
    noCache: true,
  };

  constructor(private readonly connection: Connection) {}
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .with('IncomingRequest')
      .forRoutes(allRoutes)
      .apply(HelmetMiddleware)
      .with(ApplicationModule.helmetOptions)
      .forRoutes(allRoutes)
      .apply(CompressionMiddleware)
      .forRoutes(allRoutes);
  }

}
