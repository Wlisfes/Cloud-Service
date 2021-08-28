import { Test, TestingModule } from '@nestjs/testing';
import { MinuteService } from './minute.service';

describe('MinuteService', () => {
  let service: MinuteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinuteService],
    }).compile();

    service = module.get<MinuteService>(MinuteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
