import { registerAs } from '@nestjs/config';

const options = {
  entities: [__dirname + '/../../../**/*.entity.{js,ts}'],
  keepConnectionAlive: true,
  logging: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
};

export default registerAs('database', () => {
  const environmentsConfig = {
    production: {
      ...options,
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
    test: {
      ...options,
      database: 'test.sqlite',
      dropSchema: true,
      synchronize: true,
      type: 'sqlite',
    },
    development: {
      ...options,
      database: 'database.sqlite',
      type: 'sqlite',
    },
  };
  const currentEnvironment = process.env.NODE_ENV || 'development';

  return environmentsConfig[currentEnvironment];
});
