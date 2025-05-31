import { BeforeInsert, Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity("order_items")
export class OrderItem {
    @PrimaryColumn()
    id: string;

    @Column()
    orderId: string;

    @Column()
    productId: string;

    @Column()
    productName: string; 

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice: number; 
    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @BeforeInsert()
    generateId() {
        this.id = 'order-item-' + nanoid();
    }
}
