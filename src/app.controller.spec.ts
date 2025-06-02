import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('deve retornar mensagem receptativa', () => {
      expect(appController.getHello()).toBe('Bem-vindo à API RocketLab Musicco - Sua loja de instrumentos musicais online!');
    });
  });
});
