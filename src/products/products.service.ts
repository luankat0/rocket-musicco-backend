import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository, Like, MoreThan } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private readonly repository: Repository<Product>
	) {}

  	async create(dto: CreateProductDto): Promise<Product> {
		const product = this.repository.create({
			...dto,
			createdAt: new Date()
		});
		return this.repository.save(product);
  	}

  	async findAll(): Promise<Product[]> {
		return this.repository.find({
			order: { createdAt: 'DESC' }
		});
  	}

	async findOne(id: string): Promise<Product> {
		const product = await this.repository.findOneBy({ id });
		if (!product) {
			throw new NotFoundException(`Product with ID ${id} not found`);
		}
		return product;
	}

	async searchProducts(query: string): Promise<Product[]> {
		return this.repository.find({
			where: [
				{ name: Like(`%${query}%`) },
				{ description: Like(`%${query}%`) }
			],
			order: { createdAt: 'DESC' }
		});
	}

	async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
		return this.repository.createQueryBuilder('product')
			.where('product.price >= :minPrice', { minPrice })
			.andWhere('product.price <= :maxPrice', { maxPrice })
			.orderBy('product.price', 'ASC')
			.getMany();
	}

	async findInStock(): Promise<Product[]> {
		return this.repository.find({
			where: { stock: MoreThan(0) },
			order: { name: 'ASC' }
		});
	}

	async update(id: string, dto: UpdateProductDto): Promise<Product> {
		const product = await this.findOne(id);
		this.repository.merge(product, dto);
		return this.repository.save(product);
	}

	async remove(id: string): Promise<void> {
		const product = await this.findOne(id);
		await this.repository.remove(product);
	}
}
