import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { HistoriaDeportivaEntity } from './perfil-deportivo/model/historia-deportiva.entity';
import { PerfilDeportivoEntity } from './perfil-deportivo/model/perfil-deportivo.entity';
import { PerfilDeportivoModule } from './perfil-deportivo/perfil-deportivo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    PerfilDeportivoModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        database: configService.get<string>('database.dbName'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        synchronize: true,
        entities: [PerfilDeportivoEntity, HistoriaDeportivaEntity],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
