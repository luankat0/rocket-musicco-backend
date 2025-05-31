import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';

@Entity("products")
export class Product {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column('decimal')
    price: number;

    @Column('int')
    stock: number;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ type: 'datetime', nullable: true })
    createdAt?: Date;

    @BeforeInsert()
    generateId() {
        this.id = 'product-' + nanoid();
    }
}
