import { Test, TestingModule } from '@nestjs/testing';
import { CloudSourceController } from './cloud-source.controller';

describe('CloudSourceController', () => {
  let controller: CloudSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudSourceController],
    }).compile();

    controller = module.get<CloudSourceController>(CloudSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
