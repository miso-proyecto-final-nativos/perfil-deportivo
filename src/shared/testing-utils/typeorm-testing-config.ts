import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriaDeportivaEntity } from '../../perfil-deportivo/model/historia-deportiva.entity';
import { PerfilDeportivoEntity } from '../../perfil-deportivo/model/perfil-deportivo.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [PerfilDeportivoEntity, HistoriaDeportivaEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([PerfilDeportivoEntity, HistoriaDeportivaEntity]),
];
