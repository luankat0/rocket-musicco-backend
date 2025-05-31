import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        private readonly cartService: CartService,
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const { userId, shippingAddress, notes } = createOrderDto;

        await this.usersService.findOne(userId);

        const cart = await this.cartService.getCartByUserId(userId);

        if (!cart.items || cart.items.length === 0) {
            throw new BadRequestException('Carrinho está vazio');
        }

        for (const cartItem of cart.items) {
            const product = await this.productsService.findOne(cartItem.productId);
            if (product.stock < cartItem.quantity) {
                throw new BadRequestException(`Estoque insuficiente deste produto: ${product.name}`);
            }
        }

        const order = this.orderRepository.create({
            userId,
            total: cart.total,
            status: OrderStatus.PENDING,
            shippingAddress,
            notes
        });

        const savedOrder = await this.orderRepository.save(order);

        for (const cartItem of cart.items) {
            const product = await this.productsService.findOne(cartItem.productId);
            
            const orderItem = this.orderItemRepository.create({
                orderId: savedOrder.id,
                productId: cartItem.productId,
                productName: product.name,
                quantity: cartItem.quantity,
                unitPrice: cartItem.unitPrice,
                subtotal: cartItem.subtotal
            });

            await this.orderItemRepository.save(orderItem);

            await this.productsService.update(cartItem.productId, {
                stock: product.stock - cartItem.quantity
            });
        }

        await this.cartService.clearCart(userId);

        return this.findOne(savedOrder.id);
    }

    async findAll(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: ['user', 'items', 'items.product'],
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product']
        });

        if (!order) {
            throw new NotFoundException(`Pedido com este ${id} não encontrado`);
        }

        return order;
    }

    async findByUserId(userId: string): Promise<Order[]> {
        await this.usersService.findOne(userId);

        return this.orderRepository.find({
            where: { userId },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' }
        });
    }

    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id);

        Object.assign(order, updateOrderDto);
        await this.orderRepository.save(order);

        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const order = await this.findOne(id);
        
        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Somente pedidos pendentes podem ser cancelados');
        }

        for (const item of order.items) {
            const product = await this.productsService.findOne(item.productId);
            await this.productsService.update(item.productId, {
                stock: product.stock + item.quantity
            });
        }

        await this.orderRepository.remove(order);
    }
}
