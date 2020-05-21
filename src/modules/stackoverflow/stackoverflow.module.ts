import { Module } from '@nestjs/common';
import { StackoverflowRepository } from './stackoverflow.repository';
import { StackoverflowService } from './stackoverflow.service';

@Module({
  providers: [StackoverflowService, StackoverflowRepository],
  exports: [StackoverflowService, StackoverflowRepository],
})
export class StackoverflowModule {}
