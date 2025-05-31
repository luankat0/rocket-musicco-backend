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
    @ApiOperation({ summary: 'Adicionar um novo instrumento musical' })
    @ApiResponse({ status: 201, description: 'Instrumento criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os instrumentos musicais' })
    @ApiResponse({ status: 200, description: 'Lista de instrumentos retornada com sucesso.' })
    findAll() {
        return this.productsService.findAll();
    }

    @Get('search')
    @ApiOperation({ summary: 'Buscar instrumentos por nome ou descrição' })
    @ApiQuery({ name: 'q', description: 'Termo de busca', required: true })
    @ApiResponse({ status: 200, description: 'Instrumentos encontrados.' })
    searchProducts(@Query('q') query: string) {
        return this.productsService.searchProducts(query);
    }

    @Get('in-stock')
    @ApiOperation({ summary: 'Listar instrumentos em estoque' })
    @ApiResponse({ status: 200, description: 'Instrumentos em estoque retornados.' })
    findInStock() {
        return this.productsService.findInStock();
    }

    @Get('price-range')
    @ApiOperation({ summary: 'Buscar instrumentos por faixa de preço' })
    @ApiQuery({ name: 'min', description: 'Preço mínimo', required: true })
    @ApiQuery({ name: 'max', description: 'Preço máximo', required: true })
    @ApiResponse({ status: 200, description: 'Instrumentos na faixa de preço encontrados.' })
    findByPriceRange(
        @Query('min') minPrice: number,
        @Query('max') maxPrice: number
    ) {
        return this.productsService.findByPriceRange(minPrice, maxPrice);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar instrumento por ID' })
    @ApiResponse({ status: 200, description: 'Instrumento encontrado.' })
    @ApiResponse({ status: 404, description: 'Instrumento não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar instrumento' })
    @ApiResponse({ status: 200, description: 'Instrumento atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Instrumento não encontrado.' })
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletar instrumento' })
    @ApiResponse({ status: 204, description: 'Instrumento deletado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Instrumento não encontrado.' })
    async remove(@Param('id') id: string) {
        await this.productsService.remove(id);
    }
}
