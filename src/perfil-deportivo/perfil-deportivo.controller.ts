import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  RequestTimeoutException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { HistoriaDeportivaDto } from './dto/historia-deportiva.dto';
import { PerfilDeportivoDto } from './dto/perfil-deportivo.dto';
import { AuthGuard } from './guards/auth.guard';
import { PerfilDeportivoEntity } from './model/perfil-deportivo.entity';
import { PerfilDeportivoService } from './perfil-deportivo.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('perfil-deportivo')
export class PerfilDeportivoController {
  constructor(
    @Inject('MS_CATALOGO_SERVICE') private clienteCatalogoService: ClientProxy,
    @Inject('USER_MS') private clienteUsuarioService: ClientProxy,
    private readonly perfilDeportivoService: PerfilDeportivoService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':idDeportista')
  async findByDeportistaId(@Param('idDeportista') idDeportista: number) {
    return await this.perfilDeportivoService.findByDeportistaId(idDeportista);
  }

  @UseGuards(AuthGuard)
  @Post(':idDeportista')
  async create(
    @Param('idDeportista') idDeportista: number,
    @Body() perfilDeportivoDto: PerfilDeportivoDto,
  ) {
    await this.validarIdDeportista(idDeportista);
    const idMolestiaNoValido = await this.validarMolestias(
      perfilDeportivoDto.molestias,
    );
    if (idMolestiaNoValido) {
      throw new BusinessLogicException(
        `No se encontró la molestia con el id ${idMolestiaNoValido}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const idLesionNoValido = await this.validarLesiones(
      perfilDeportivoDto.lesiones,
    );
    if (idLesionNoValido) {
      throw new BusinessLogicException(
        `No se encontró la lesión con el id ${idLesionNoValido}`,
        BusinessError.NOT_FOUND,
      );
    }
    const idDeporteNoValido = await this.validarDeporteHistoriasDeportivas(
      perfilDeportivoDto.historiasDeportivas,
    );
    if (idDeporteNoValido) {
      throw new BusinessLogicException(
        `No se encontró el deporte con el id ${idDeporteNoValido}`,
        BusinessError.NOT_FOUND,
      );
    }
    perfilDeportivoDto.idDeportista = idDeportista;
    const perfilDeportivoEntity: PerfilDeportivoEntity = plainToInstance(
      PerfilDeportivoEntity,
      perfilDeportivoDto,
    );
    return await this.perfilDeportivoService.create(perfilDeportivoEntity);
  }
  private async validarIdDeportista(idDeportista: number) {
    const molestia$ = this.clienteUsuarioService
      .send({ role: 'user', cmd: 'getById' }, { idDeportista })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        }),
      );

    const molestia = await firstValueFrom(molestia$);

    if (!molestia) {
      throw new BusinessLogicException(
        `No se encontró un deportista con el ${idDeportista}`,
        BusinessError.NOT_FOUND,
      );
    }
  }

  private async validarMolestias(molestias: number[]) {
    let idMolestiaNoValido = undefined;
    for (let i = 0; i < molestias.length; i++) {
      try {
        const molestiaId = molestias[i];
        const molestia$ = this.clienteCatalogoService
          .send({ role: 'molestia', cmd: 'getById' }, { molestiaId })
          .pipe(
            timeout(5000),
            catchError((err) => {
              if (err instanceof TimeoutError) {
                return throwError(() => new RequestTimeoutException());
              }
              return throwError(() => err);
            }),
          );

        const molestia = await firstValueFrom(molestia$);

        if (!molestia) {
          throw new BusinessLogicException(
            `No se encontró la molestia con el id ${molestiaId}`,
            BusinessError.NOT_FOUND,
          );
        }
      } catch (error) {
        idMolestiaNoValido = molestias[i];
        break;
      }
    }
    return idMolestiaNoValido;
  }

  private async validarLesiones(lesiones: number[]) {
    let idLesionNoValido = undefined;
    for (let i = 0; i < lesiones.length; i++) {
      const lesionId = lesiones[i];
      try {
        const lesion$ = this.clienteCatalogoService
          .send({ role: 'lesion', cmd: 'getById' }, { lesionId })
          .pipe(
            timeout(5000),
            catchError((err) => {
              if (err instanceof TimeoutError) {
                return throwError(() => new RequestTimeoutException());
              }
              return throwError(() => err);
            }),
          );

        const lesion = await firstValueFrom(lesion$);

        if (!lesion) {
          throw new BusinessLogicException(
            `No se encontró la lesión con el id ${lesionId}`,
            BusinessError.NOT_FOUND,
          );
        }
      } catch (error) {
        idLesionNoValido = lesiones[i];
        break;
      }
    }
    return idLesionNoValido;
  }

  private async validarDeporteHistoriasDeportivas(
    historiasDeportivas: HistoriaDeportivaDto[],
  ) {
    let idDeporteNoValido = undefined;
    for (let i = 0; i < historiasDeportivas.length; i++) {
      const idDeporte = historiasDeportivas[i].idDeporte;
      try {
        const deporte$ = this.clienteCatalogoService
          .send({ role: 'deporte', cmd: 'getById' }, { idDeporte })
          .pipe(
            timeout(5000),
            catchError((err) => {
              if (err instanceof TimeoutError) {
                return throwError(() => new RequestTimeoutException());
              }
              return throwError(() => err);
            }),
          );

        const deporte = await firstValueFrom(deporte$);

        if (!deporte) {
          throw new BusinessLogicException(
            `No se encontró el deporte con el id ${idDeporte}`,
            BusinessError.NOT_FOUND,
          );
        }
      } catch (error) {
        idDeporteNoValido = historiasDeportivas[i].idDeporte;
        break;
      }
    }
    return idDeporteNoValido;
  }

  @Get('health')
  async healthCheck(): Promise<string> {
    return 'All good!';
  }
}
