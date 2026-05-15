import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Up and Running! 💪"', () => {
      const result = appService.getHello();
      expect(result).toBe('Up and Running! 💪');
    });

    it('should return a string', () => {
      const result = appService.getHello();
      expect(typeof result).toBe('string');
    });
  });
});
