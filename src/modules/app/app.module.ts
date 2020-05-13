import {
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { InjectConnection, TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import config from 'common/config';
import databaseConfig from 'common/config/database';
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
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onApplicationShutdown(signal: string): Promise<void> {
    this.logger.error(`detected signal: ${signal}`);
    await this.connection
      .close()
      .then(() => this.logger.log('database connection is closed'));
  }
}
