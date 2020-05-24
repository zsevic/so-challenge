import { registerAs } from '@nestjs/config';

const options = {
  entities: [__dirname + '/../../../**/*.entity.{js,ts}'],
  keepConnectionAlive: true,
  logging: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
};

export default registerAs('database', () =>
  process.env.NODE_ENV === 'production'
    ? {
        ...options,
        type: 'postgres',
        url: process.env.DATABASE_URL,
      }
    : {
        ...options,
        database: 'database.sqlite',
        type: 'sqlite',
      },
);
