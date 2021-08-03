import { Module } from '@nestjs/common';
import { CloudSourceService } from './cloud-source.service';
import { CloudSourceController } from './cloud-source.controller';

@Module({
  providers: [CloudSourceService],
  controllers: [CloudSourceController]
})
export class CloudSourceModule {}
