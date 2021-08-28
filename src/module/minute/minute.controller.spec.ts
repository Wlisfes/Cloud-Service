import { Test, TestingModule } from '@nestjs/testing';
import { MinuteController } from './minute.controller';

describe('MinuteController', () => {
  let controller: MinuteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinuteController],
    }).compile();

    controller = module.get<MinuteController>(MinuteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
