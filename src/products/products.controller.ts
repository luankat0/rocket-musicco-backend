import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Criar um novo produto' })
    @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os produtos' })
    @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.' })
    findAll() {
        return this.productsService.findAll();
    }

    @Get('search')
    @ApiOperation({ summary: 'Buscar produtos por nome ou descrição' })
    @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
    @ApiResponse({ status: 200, description: 'Produtos encontrados.' })
    searchProducts(@Query('q') query: string) {
        return this.productsService.searchProducts(query);
    }

    @Get('in-stock')
    @ApiOperation({ summary: 'Listar produtos em estoque' })
    @ApiResponse({ status: 200, description: 'Produtos em estoque retornados.' })
    findInStock() {
        return this.productsService.findInStock();
    }

    @Get('price-range')
    @ApiOperation({ summary: 'Buscar produtos por faixa de preço' })
    @ApiQuery({ name: 'min', description: 'Preço mínimo', required: true })
    @ApiQuery({ name: 'max', description: 'Preço máximo', required: true })
    @ApiResponse({ status: 200, description: 'Produtos na faixa de preço encontrados.' })
    findByPriceRange(
        @Query('min') minPrice: number,
        @Query('max') maxPrice: number
    ) {
        return this.productsService.findByPriceRange(minPrice, maxPrice);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar produto por ID' })
    @ApiResponse({ status: 200, description: 'Produto encontrado.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar produto' })
    @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletar produto' })
    @ApiResponse({ status: 204, description: 'Produto deletado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    async remove(@Param('id') id: string) {
        await this.productsService.remove(id);
    }
}
