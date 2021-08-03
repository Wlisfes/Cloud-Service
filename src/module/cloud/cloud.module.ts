import { Module } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { CloudController } from './cloud.controller';

@Module({
  providers: [CloudService],
  controllers: [CloudController]
})
export class CloudModule {}
