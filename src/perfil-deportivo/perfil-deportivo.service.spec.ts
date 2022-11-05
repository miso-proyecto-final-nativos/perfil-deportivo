import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { HistoriaDeportivaEntity } from './model/historia-deportiva.entity';
import { PerfilDeportivoEntity } from './model/perfil-deportivo.entity';
import { PerfilDeportivoService } from './perfil-deportivo.service';
import { faker } from '@faker-js/faker';

describe('PerfilDeportivoService', () => {
  let service: PerfilDeportivoService;
  let perfilDeportivoRepository: Repository<PerfilDeportivoEntity>;
  let historiaDeportivaRepository: Repository<HistoriaDeportivaEntity>;
  let perfilDeportivo: PerfilDeportivoEntity;
  let historiasDeportivasList: HistoriaDeportivaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerfilDeportivoService],
    }).compile();

    service = module.get<PerfilDeportivoService>(PerfilDeportivoService);
    perfilDeportivoRepository = module.get<Repository<PerfilDeportivoEntity>>(
      getRepositoryToken(PerfilDeportivoEntity),
    );
    historiaDeportivaRepository = module.get<
      Repository<HistoriaDeportivaEntity>
    >(getRepositoryToken(HistoriaDeportivaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    perfilDeportivoRepository.clear();
    historiaDeportivaRepository.clear();
    historiasDeportivasList = [];
    for (let i = 0; i < 5; i++) {
      const historiaDeportiva: HistoriaDeportivaEntity =
        await historiaDeportivaRepository.save({
          idDeporte: i,
          practicadoActualmente: faker.datatype.boolean(),
          aniosPractica: faker.datatype.number(20),
          ciudad: faker.address.cityName(),
          edadInicioPractica: faker.datatype.number(20),
          dedicacionHorasSemana: faker.datatype.number(30),
        });
      historiasDeportivasList.push(historiaDeportiva);
    }
    perfilDeportivo = await perfilDeportivoRepository.save({
      ftpActual: faker.datatype.float({ max: 100 }),
      vo2Max: faker.datatype.float({ max: 100 }),
      idDeportista: 1,
      molestias: faker.datatype.number(),
      lesiones: faker.datatype.number(),
      historiasDeportivas: historiasDeportivasList,
    });
  };

  it('El servicio de perfil deportivo debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findByDeportistaId debe retornar los datos del perfil deportivo a partir de un id de deportista suministrado', async () => {
    const perfilDeportivoAlmacenado: PerfilDeportivoEntity =
      await service.findByDeportistaId(perfilDeportivo.idDeportista);
    expect(perfilDeportivoAlmacenado).not.toBeNull();
    expect(perfilDeportivoAlmacenado.ftpActual).toEqual(
      perfilDeportivo.ftpActual,
    );
    expect(perfilDeportivoAlmacenado.vo2Max).toEqual(perfilDeportivo.vo2Max);
    expect(perfilDeportivoAlmacenado.molestias).toEqual(
      perfilDeportivo.molestias,
    );
    expect(perfilDeportivoAlmacenado.lesiones).toEqual(
      perfilDeportivo.lesiones,
    );
    expect(perfilDeportivoAlmacenado.historiasDeportivas).toEqual(
      perfilDeportivo.historiasDeportivas,
    );
  });

  it('findByDeportistaId debe lanzar una excepción para un id de un deportista que tenga datos de perfil deportivo', async () => {
    await expect(() => service.findByDeportistaId(0)).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil deportivo para el id de deportista suministrado',
    );
  });

  it('create debe almacenar un nuevo perfil deportivo', async () => {
    let perfilDeportivoNuevo: PerfilDeportivoEntity = {
      id: -1,
      ftpActual: faker.datatype.float({ max: 100 }),
      vo2Max: faker.datatype.float({ max: 100 }),
      idDeportista: 2,
      molestias: faker.datatype.number(),
      lesiones: faker.datatype.number(),
      historiasDeportivas: [],
    };

    perfilDeportivoNuevo = await service.create(perfilDeportivoNuevo);
    expect(perfilDeportivoNuevo).not.toBeNull();
    const perfilDeportivoAlmacenado: PerfilDeportivoEntity =
      await service.findByDeportistaId(perfilDeportivoNuevo.idDeportista);
    expect(perfilDeportivoAlmacenado).not.toBeNull();
    expect(perfilDeportivoAlmacenado.ftpActual).toEqual(
      perfilDeportivoNuevo.ftpActual,
    );
    expect(perfilDeportivoAlmacenado.vo2Max).toEqual(
      perfilDeportivoNuevo.vo2Max,
    );
    expect(perfilDeportivoAlmacenado.molestias).toEqual(
      perfilDeportivoNuevo.molestias,
    );
    expect(perfilDeportivoAlmacenado.lesiones).toEqual(
      perfilDeportivoNuevo.lesiones,
    );
    expect(perfilDeportivoAlmacenado.historiasDeportivas).toEqual(
      perfilDeportivoNuevo.historiasDeportivas,
    );
  });

  it('create debe lanzar una excepción para un id de deportista que ya haya sido almacenado', async () => {
    const perfilDeportivoNuevo: PerfilDeportivoEntity = {
      id: -1,
      ftpActual: faker.datatype.float({ max: 100 }),
      vo2Max: faker.datatype.float({ max: 100 }),
      idDeportista: 1,
      molestias: faker.datatype.number(),
      lesiones: faker.datatype.number(),
      historiasDeportivas: [],
    };
    await expect(() =>
      service.create(perfilDeportivoNuevo),
    ).rejects.toHaveProperty(
      'message',
      `Ya existe un perfil de deportista asociado al id ${perfilDeportivoNuevo.idDeportista}`,
    );
  });

  it('update debe modificar los datos de un perfil deportivo', async () => {
    perfilDeportivo.ftpActual = faker.datatype.float({ max: 100 });
    perfilDeportivo.vo2Max = faker.datatype.float({ max: 100 });
    const historiasDeportivasUpdate = [];
    for (let i = 0; i < 5; i++) {
      const historiaDeportiva: HistoriaDeportivaEntity =
        await historiaDeportivaRepository.save({
          idDeporte: i,
          practicadoActualmente: faker.datatype.boolean(),
          aniosPractica: faker.datatype.number(20),
          ciudad: faker.address.cityName(),
          edadInicioPractica: faker.datatype.number(20),
          dedicacionHorasSemana: faker.datatype.number(30),
        });
      historiasDeportivasUpdate.push(historiaDeportiva);
    }
    perfilDeportivo.historiasDeportivas = historiasDeportivasUpdate;
    const perfilDeportivoActualizado = await service.update(
      perfilDeportivo.idDeportista,
      perfilDeportivo,
    );
    expect(perfilDeportivoActualizado).not.toBeNull();
    const perfilDeportivoAlmacenado: PerfilDeportivoEntity =
      await service.findByDeportistaId(perfilDeportivo.idDeportista);
    expect(perfilDeportivoAlmacenado).not.toBeNull();
    expect(perfilDeportivoAlmacenado.ftpActual).toEqual(
      perfilDeportivo.ftpActual,
    );
    expect(perfilDeportivoAlmacenado.vo2Max).toEqual(perfilDeportivo.vo2Max);
    expect(perfilDeportivoAlmacenado.molestias).toEqual(
      perfilDeportivo.molestias,
    );
    expect(perfilDeportivoAlmacenado.lesiones).toEqual(
      perfilDeportivo.lesiones,
    );
    expect(perfilDeportivoAlmacenado.historiasDeportivas).toEqual(
      perfilDeportivo.historiasDeportivas,
    );
  });

  it('update debe lanzar una excepción para un id de deportista no tiene un perfil deportivo registrado y se está intentando actualizar', async () => {
    perfilDeportivo.ftpActual = faker.datatype.float({ max: 100 });
    perfilDeportivo.vo2Max = faker.datatype.float({ max: 100 });
    perfilDeportivo.historiasDeportivas = historiasDeportivasList;
    await expect(() =>
      service.update(-1, perfilDeportivo),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil deportivo con el id suministrado',
    );
  });

  it('delete debe eliminar los datos de un perfil deportivo', async () => {
    await service.delete(perfilDeportivo.idDeportista);
    await expect(() =>
      service.findByDeportistaId(perfilDeportivo.idDeportista),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil deportivo para el id de deportista suministrado',
    );
  });

  it('update debe lanzar una excepción para un id de deportista no tiene un perfil deportivo registrado y se está intentando eliminar', async () => {
    await expect(() => service.delete(-1)).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil deportivo con el id suministrado',
    );
  });
});
