import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Interval(2000)
  handleCron() {
    this.logger.debug('Called every 2 seconds');
  }
}