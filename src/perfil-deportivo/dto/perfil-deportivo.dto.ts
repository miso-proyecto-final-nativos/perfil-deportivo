import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { HistoriaDeportivaDto } from './historia-deportiva.dto';

export class PerfilDeportivoDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  idDeportista: number;

  @IsNotEmpty()
  vo2Max: number;

  @IsNotEmpty()
  ftpActual: number;

  @IsArray()
  molestias?: number[];

  @IsArray()
  lesiones?: number[];

  @IsArray()
  historiasDeportivas?: HistoriaDeportivaDto[];
}
