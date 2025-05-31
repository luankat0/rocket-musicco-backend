import { BeforeInsert, Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity("carts")
export class Cart {
    @PrimaryColumn()
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true, eager: true })
    items: CartItem[];

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    total: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = 'cart-' + nanoid();
    }
}
