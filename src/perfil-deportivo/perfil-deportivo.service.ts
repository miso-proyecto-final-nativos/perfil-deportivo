import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PerfilDeportivoEntity } from './model/perfil-deportivo.entity';
import { HistoriaDeportivaEntity } from './model/historia-deportiva.entity';

@Injectable()
export class PerfilDeportivoService {
  constructor(
    @InjectRepository(PerfilDeportivoEntity)
    private readonly perfilDeportivoRepository: Repository<PerfilDeportivoEntity>,
    @InjectRepository(HistoriaDeportivaEntity)
    private readonly historiaDeportivaRepository: Repository<HistoriaDeportivaEntity>,
  ) {}

  async findByDeportistaId(
    idDeportista: number,
  ): Promise<PerfilDeportivoEntity> {
    const perfilDeportivo: PerfilDeportivoEntity =
      await this.perfilDeportivoRepository.findOne({
        where: { idDeportista: idDeportista },
        relations: ['historiasDeportivas'],
      });
    if (!perfilDeportivo)
      throw new BusinessLogicException(
        'No se encontró un perfil deportivo para el id de deportista suministrado',
        BusinessError.NOT_FOUND,
      );
    return perfilDeportivo;
  }

  async create(
    perfilDeportivo: PerfilDeportivoEntity,
  ): Promise<PerfilDeportivoEntity> {
    await this.validarIdDeportista(perfilDeportivo.idDeportista);
    return await this.perfilDeportivoRepository.save(perfilDeportivo);
  }

  private async validarIdDeportista(idDeportista: number) {
    const perfilDeportivo: PerfilDeportivoEntity =
      await this.perfilDeportivoRepository.findOne({
        where: { idDeportista: idDeportista },
      });
    if (perfilDeportivo)
      throw new BusinessLogicException(
        `Ya existe un perfil de deportista asociado al id ${perfilDeportivo.idDeportista}`,
        BusinessError.PRECONDITION_FAILED,
      );
  }

  async update(
    idDeportista: number,
    perfilDeportivo: PerfilDeportivoEntity,
  ): Promise<PerfilDeportivoEntity> {
    const persistedPerfilDeportivo: PerfilDeportivoEntity =
      await this.perfilDeportivoRepository.findOne({
        where: { idDeportista: idDeportista },
        relations: ['historiasDeportivas'],
      });
    if (!persistedPerfilDeportivo) {
      throw new BusinessLogicException(
        'No se encontró un perfil deportivo con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.eliminarHistoriasDeportivas(persistedPerfilDeportivo);
    return await this.perfilDeportivoRepository.save({
      ...persistedPerfilDeportivo,
      ...perfilDeportivo,
    });
  }

  async delete(idDeportista: number) {
    const perfilDeportivo: PerfilDeportivoEntity =
      await this.perfilDeportivoRepository.findOne({
        where: { idDeportista: idDeportista },
      });
    if (!perfilDeportivo) {
      throw new BusinessLogicException(
        'No se encontró un perfil deportivo con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.perfilDeportivoRepository.delete(perfilDeportivo);
  }

  private async eliminarHistoriasDeportivas(
    perfilDeportivoEntity: PerfilDeportivoEntity,
  ) {
    perfilDeportivoEntity.historiasDeportivas.forEach(
      async (historiaDeportivaEntity) => {
        await this.historiaDeportivaRepository.delete(historiaDeportivaEntity);
      },
    );
  }
}
