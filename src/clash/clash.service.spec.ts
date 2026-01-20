import { Test, TestingModule } from '@nestjs/testing';
import { ClashService } from './clash.service';

describe('ClashService', () => {
  let service: ClashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClashService],
    }).compile();

    service = module.get<ClashService>(ClashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
