import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from '../config/configuration';
import { HistoriaDeportivaEntity } from './model/historia-deportiva.entity';
import { PerfilDeportivoEntity } from './model/perfil-deportivo.entity';
import { PerfilDeportivoService } from './perfil-deportivo.service';
import { PerfilDeportivoController } from './perfil-deportivo.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([PerfilDeportivoEntity, HistoriaDeportivaEntity]),
  ],
  providers: [
    {
      provide: 'MS_CATALOGO_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('catalogo_microservice.host'),
            port: configService.get<number>('catalogo_microservice.port'),
          },
        }),
    },
    {
      provide: 'AUTH_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('auth_microservice.host'),
            port: configService.get<number>('auth_microservice.port'),
          },
        }),
    },
    PerfilDeportivoService,
  ],
  controllers: [PerfilDeportivoController],
})
export class PerfilDeportivoModule {}
