# so-challenge

> Stackoverflow challenge registration and leaderboard

See demo: [http://so-challenge.herokuapp.com](http://so-challenge.herokuapp.com)

## Getting started

### Setup

```bash
git clone https://github.com/zsevic/so-challenge
cd so-challenge
cp .env.sample .env # change values after copying
npm i
npm run start:dev
```

### Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing

```bash
npm test
npm run test:e2e
```

### Migrations

```bash
npm run migration:generate <MIGRATION_NAME>
npm run migrate:dev
npm run migrate:dev:down
npm run migrate:prod
npm run migrate:prod:down
```

### Seeders

```bash
npm run seed:generate <SEEDER_NAME>
npm run seed
npm run seed:down
```

### API documentation

API documentation is generated using [@nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger) module at `/api-docs` endpoint

### Technologies used

- Node.js, TypeScript, NestJS, TypeORM
