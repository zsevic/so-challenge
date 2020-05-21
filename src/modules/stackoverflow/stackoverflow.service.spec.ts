import { Test, TestingModule } from '@nestjs/testing';
import { StackoverflowRepository } from './stackoverflow.repository';
import { StackoverflowService } from './stackoverflow.service';

describe('StackoverflowService', () => {
  let service: StackoverflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StackoverflowRepository, StackoverflowService],
    }).compile();

    service = module.get<StackoverflowService>(StackoverflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
