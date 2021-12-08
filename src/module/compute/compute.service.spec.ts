import { Test, TestingModule } from '@nestjs/testing';
import { ComputeService } from './compute.service';

describe('ComputeService', () => {
  let service: ComputeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComputeService],
    }).compile();

    service = module.get<ComputeService>(ComputeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
