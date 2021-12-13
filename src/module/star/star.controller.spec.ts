import { Test, TestingModule } from '@nestjs/testing';
import { StarController } from './star.controller';

describe('StarController', () => {
  let controller: StarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarController],
    }).compile();

    controller = module.get<StarController>(StarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
