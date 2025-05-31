import { IsString, IsNumber, Min } from "class-validator";

export class AddToCartDto {
    @IsString({ message: 'ID do usuário deve ser uma string válida' })
    userId: string;

    @IsString({ message: 'ID do instrumento deve ser uma string válida' })
    productId: string;

    @IsNumber({}, { message: 'Quantidade deve ser um número' })
    @Min(1, { message: 'Quantidade deve ser pelo menos 1' })
    quantity: number;
}
