import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class HistoriaDeportivaDto {
  @IsNumber()
  @IsNotEmpty()
  edadInicioPractica: number;

  @IsBoolean()
  @IsNotEmpty()
  practicadoActualmente: boolean;

  @IsNumber()
  @IsNotEmpty()
  aniosPractica: number;

  @IsNumber()
  @IsNotEmpty()
  dedicacionHorasSemana: number;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsNumber()
  @IsNotEmpty()
  idDeporte: number;
}
