import { Test, TestingModule } from '@nestjs/testing';
import { KasirController } from './kasir.controller';
import { KasirService } from './kasir.service';

describe('KasirController', () => {
  let controller: KasirController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KasirController],
      providers: [KasirService],
    }).compile();

    controller = module.get<KasirController>(KasirController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
