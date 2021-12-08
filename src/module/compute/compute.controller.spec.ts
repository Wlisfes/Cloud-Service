import { Test, TestingModule } from '@nestjs/testing';
import { ComputeController } from './compute.controller';

describe('ComputeController', () => {
  let controller: ComputeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComputeController],
    }).compile();

    controller = module.get<ComputeController>(ComputeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
