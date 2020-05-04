import { registerAs } from '@nestjs/config';

const options = {
  entities: ['dist/**/**.entity{.ts,.js}'],
  keepConnectionAlive: true,
  logging: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
};

export default registerAs('database', () =>
  process.env.NODE_ENV === 'production'
    ? {
        ...options,
        synchronize: true,
        type: 'postgres',
        url: process.env.DATABASE_URL,
      }
    : {
        ...options,
        synchronize: false,
        database: 'database.sqlite',
        type: 'sqlite',
      },
);
