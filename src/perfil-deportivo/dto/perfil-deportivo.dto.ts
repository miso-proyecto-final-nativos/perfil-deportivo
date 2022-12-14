import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { HistoriaDeportivaDto } from './historia-deportiva.dto';

export class PerfilDeportivoDto {
  @IsString()
  @IsNotEmpty()
  idDeportista: string;

  @IsNotEmpty()
  vo2Max: number;

  @IsNotEmpty()
  ftpActual: number;

  @IsArray()
  molestias?: string[];

  @IsArray()
  lesiones?: string[];

  @IsArray()
  historiasDeportivas?: HistoriaDeportivaDto[];
}
