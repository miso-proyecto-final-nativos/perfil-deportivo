import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HistoriaDeportivaEntity } from './historia-deportiva.entity';

@Entity()
export class PerfilDeportivoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  idDeportista: number;

  @Column({ type: 'real' })
  vo2Max: number;

  @Column({ type: 'real' })
  ftpActual: number;

  @Column({ array: true })
  molestias?: number;

  @Column({ array: true })
  lesiones?: number;

  @OneToMany(
    () => HistoriaDeportivaEntity,
    (historiaDeportiva) => historiaDeportiva.perfilDeportivo,
    {
      cascade: true,
    },
  )
  historiasDeportivas?: HistoriaDeportivaEntity[];
}
