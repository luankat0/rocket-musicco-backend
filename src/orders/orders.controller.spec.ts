import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
	let controller: OrdersController;

	beforeEach(async () => {
		const mockOrdersService = {
			create: jest.fn(),
			findAll: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			remove: jest.fn(),
			findByUserId: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
		controllers: [OrdersController],
		providers: [
			{
				provide: OrdersService,
				useValue: mockOrdersService,
			},
		],
		}).compile();

		controller = module.get<OrdersController>(OrdersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
