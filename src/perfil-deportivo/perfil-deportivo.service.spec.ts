import { Test, TestingModule } from '@nestjs/testing';
import { PerfilDeportivoService } from './perfil-deportivo.service';

describe('PerfilDeportivoService', () => {
  let service: PerfilDeportivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfilDeportivoService],
    }).compile();

    service = module.get<PerfilDeportivoService>(PerfilDeportivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
