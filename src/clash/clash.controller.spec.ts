import { Test, TestingModule } from '@nestjs/testing';
import { ClashController } from './clash.controller';

describe('ClashController', () => {
  let controller: ClashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClashController],
    }).compile();

    controller = module.get<ClashController>(ClashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
