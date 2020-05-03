import { getConnectionToken } from '@nestjs/typeorm';

export const mockConnectionProvider = {
  provide: getConnectionToken(),
  useValue: {},
};
