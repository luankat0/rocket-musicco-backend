import { BeforeInsert, Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { nanoid } from 'nanoid';

@Entity("products")
export class Product {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('int')
    stock: number;

    @Column({ nullable: true })
    imageUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = 'product-' + nanoid();
    }
}
