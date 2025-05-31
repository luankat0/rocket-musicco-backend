import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
    ) {}

    async getCartByUserId(userId: string): Promise<Cart> {
        await this.usersService.findOne(userId);

        let cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.product']
        });

        if (!cart) {
            cart = this.cartRepository.create({ userId, total: 0 });
            cart = await this.cartRepository.save(cart);
        }

        return cart;
    }

    async addToCart(addToCartDto: AddToCartDto): Promise<Cart> {
        const { userId, productId, quantity } = addToCartDto;

        const product = await this.productsService.findOne(productId);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        const cart = await this.getCartByUserId(userId);

        const existingItem = await this.cartItemRepository.findOne({
            where: { cartId: cart.id, productId }
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * product.price;
            await this.cartItemRepository.save(existingItem);
        } else {
            const cartItem = this.cartItemRepository.create({
                cartId: cart.id,
                productId,
                quantity,
                unitPrice: product.price,
                subtotal: quantity * product.price
            });
            await this.cartItemRepository.save(cartItem);
        }
        await this.updateCartTotal(cart.id);

        return this.getCartByUserId(userId);
    }

    async updateCartItem(cartItemId: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart', 'product']
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }
        if (cartItem.product.stock < updateCartItemDto.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        cartItem.quantity = updateCartItemDto.quantity;
        cartItem.subtotal = cartItem.quantity * cartItem.unitPrice;

        await this.cartItemRepository.save(cartItem);
        await this.updateCartTotal(cartItem.cartId);

        return this.getCartByUserId(cartItem.cart.userId);
    }

    async removeFromCart(cartItemId: string): Promise<Cart> {
        const cartItem = await this.cartItemRepository.findOne({
            where: { id: cartItemId },
            relations: ['cart']
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        const userId = cartItem.cart.userId;
        await this.cartItemRepository.remove(cartItem);

        await this.updateCartTotal(cartItem.cartId);

        return this.getCartByUserId(userId);
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await this.getCartByUserId(userId);
        await this.cartItemRepository.delete({ cartId: cart.id });
        cart.total = 0;
        await this.cartRepository.save(cart);
    }

    private async updateCartTotal(cartId: string): Promise<void> {
        const cart = await this.cartRepository.findOne({
            where: { id: cartId },
            relations: ['items']
        });

        if (cart) {
            cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);
            await this.cartRepository.save(cart);
        }
    }
}
