import { Test, TestingModule } from '@nestjs/testing';
import { CloudSourceService } from './cloud-source.service';

describe('CloudSourceService', () => {
  let service: CloudSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudSourceService],
    }).compile();

    service = module.get<CloudSourceService>(CloudSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
