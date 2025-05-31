import { BeforeInsert, Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity("cart_items")
export class CartItem {
    @PrimaryColumn()
    id: string;

    @Column()
    cartId: string;

    @Column()
    productId: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cartId' })
    cart: Cart;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @BeforeInsert()
    generateId() {
        this.id = 'cart-item-' + nanoid();
    }
}
