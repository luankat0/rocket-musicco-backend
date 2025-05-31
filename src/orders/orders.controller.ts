import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Finalizar compra (criar pedido)' })
    @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Carrinho vazio ou estoque insuficiente.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os pedidos' })
    @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso.' })
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar pedido por ID' })
    @ApiResponse({ status: 200, description: 'Pedido encontrado.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Listar pedidos do usuário' })
    @ApiResponse({ status: 200, description: 'Pedidos do usuário retornados com sucesso.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    findByUserId(@Param('userId') userId: string) {
        return this.ordersService.findByUserId(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar status do pedido' })
    @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Cancelar pedido' })
    @ApiResponse({ status: 204, description: 'Pedido cancelado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Só é possível cancelar pedidos pendentes.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    async remove(@Param('id') id: string) {
        await this.ordersService.remove(id);
    }
}
