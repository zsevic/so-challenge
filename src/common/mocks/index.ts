import { getConnectionToken } from '@nestjs/typeorm';

export const connectionProviderMock = {
  provide: getConnectionToken(),
  useValue: {
    transaction: () => [],
  },
};
