import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PerfilDeportivoEntity } from './perfil-deportivo.entity';

@Entity()
export class HistoriaDeportivaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  edadInicioPractica: number;

  @Column()
  practicadoActualmente: boolean;

  @Column()
  aniosPractica: number;

  @Column()
  dedicacionHorasSemana: number;

  @Column()
  ciudad: string;

  @Column()
  idDeporte: number;

  @ManyToOne(
    () => PerfilDeportivoEntity,
    (perfilDeportivo) => perfilDeportivo.historiasDeportivas,
  )
  perfilDeportivo: PerfilDeportivoEntity;
}
