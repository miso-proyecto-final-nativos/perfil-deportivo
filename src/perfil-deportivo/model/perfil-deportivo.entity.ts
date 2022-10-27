import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { HistoriaDeportivaEntity } from './historia-deportiva.entity';

@Entity()
export class PerfilDeportivoEntity {
  @PrimaryColumn()
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
