import { Test, TestingModule } from '@nestjs/testing';
import { PosterController } from './poster.controller';

describe('PosterController', () => {
  let controller: PosterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosterController],
    }).compile();

    controller = module.get<PosterController>(PosterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
