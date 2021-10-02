import { Test, TestingModule } from '@nestjs/testing';
import { ChunkService } from './chunk.service';

describe('ChunkService', () => {
  let service: ChunkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChunkService],
    }).compile();

    service = module.get<ChunkService>(ChunkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
