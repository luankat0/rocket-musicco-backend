import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get('user/:userId')
    @ApiOperation({ summary: 'Obter carrinho do usuário' })
    @ApiResponse({ status: 200, description: 'Carrinho do usuário retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    getCartByUserId(@Param('userId') userId: string) {
        return this.cartService.getCartByUserId(userId);
    }    @Post('add')
    @ApiOperation({ summary: 'Adicionar instrumento ao carrinho' })
    @ApiResponse({ status: 200, description: 'Instrumento adicionado ao carrinho com sucesso.' })
    @ApiResponse({ status: 400, description: 'Estoque insuficiente ou dados inválidos.' })
    @ApiResponse({ status: 404, description: 'Instrumento ou usuário não encontrado.' })
    addToCart(@Body() addToCartDto: AddToCartDto) {
        return this.cartService.addToCart(addToCartDto);
    }

    @Patch('item/:cartItemId')
    @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
    @ApiResponse({ status: 200, description: 'Item do carrinho atualizado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Estoque insuficiente.' })
    @ApiResponse({ status: 404, description: 'Item do carrinho não encontrado.' })
    updateCartItem(
        @Param('cartItemId') cartItemId: string,
        @Body() updateCartItemDto: UpdateCartItemDto
    ) {
        return this.cartService.updateCartItem(cartItemId, updateCartItemDto);
    }

    @Delete('item/:cartItemId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Remover item do carrinho' })
    @ApiResponse({ status: 200, description: 'Item removido do carrinho com sucesso.' })
    @ApiResponse({ status: 404, description: 'Item do carrinho não encontrado.' })
    removeFromCart(@Param('cartItemId') cartItemId: string) {
        return this.cartService.removeFromCart(cartItemId);
    }

    @Delete('user/:userId/clear')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Limpar carrinho do usuário' })
    @ApiResponse({ status: 204, description: 'Carrinho limpo com sucesso.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    async clearCart(@Param('userId') userId: string) {
        await this.cartService.clearCart(userId);
    }
}
