import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { plainToClass } from 'class-transformer';
import { ResponseOrderDto } from './dto/response-order.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(
      getRepositoryToken(Order),
    ) as jest.Mocked<Repository<Order>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GET ALL', () => {
    const orders = [] as Order[];

    it('should return all orders with items and customer', async () => {
      const expectResult = orders.map((order) =>
        plainToClass(ResponseOrderDto, order),
      );

      jest.spyOn(repository, 'find').mockResolvedValue(orders);
      const result = await service.findAll();
      expect(result).toEqual(expectResult);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['items', 'customer'],
      });
    });
  });
});
