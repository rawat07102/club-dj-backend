import { Test, TestingModule } from '@nestjs/testing';
import ClubsGateway from './clubs.gateway';

describe('ClubsGateway', () => {
  let gateway: ClubsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubsGateway],
    }).compile();

    gateway = module.get<ClubsGateway>(ClubsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
