import {
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { InjectConnection, TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'rxjs';
import { Connection } from 'typeorm';
import config from 'common/config';
import databaseConfig from 'common/config/database';
import { CRON_JOB_NAME } from 'modules/tasks/tasks.constants';
import { TasksModule } from 'modules/tasks/tasks.module';
import { TeamModule } from 'modules/team/team.module';
import { AppController } from './app.controller';

const typeOrmConfig = {
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      expandVariables: true,
    }),
  ],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    configService.get('database'),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    ScheduleModule.forRoot(),
    TasksModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'configService',
      useFactory: () => new ConfigService(),
    },
  ],
})
@Injectable()
export class AppModule implements OnApplicationShutdown {
  private readonly logger = new Logger(AppModule.name);
  private readonly shutdownListener$: Subject<void> = new Subject();
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async closeDatabaseConnection(): Promise<void> {
    await this.connection
      .close()
      .then(() => this.logger.log('Database connection is closed'));
  }

  async onApplicationShutdown(signal: string): Promise<void> {
    this.logger.error(`detected signal: ${signal}`);

    this.shutdownListener$.next();
    this.stopCronJob(CRON_JOB_NAME);
    await this.closeDatabaseConnection();
  }

  stopCronJob(name: string): void {
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();

    this.logger.log(`Cron job "${name}" is stopped`);
  }

  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => {
      this.logger.log('App is closed');
      shutdownFn();
    });
  }
}
