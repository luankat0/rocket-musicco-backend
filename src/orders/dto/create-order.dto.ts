import { IsString, IsOptional } from "class-validator";

export class CreateOrderDto {
    @IsString({ message: 'ID do usuário deve ser uma string válida' })
    userId: string;

    @IsString({ message: 'Endereço de entrega deve ser uma string válida' })
    @IsOptional()
    shippingAddress?: string;

    @IsString({ message: 'Observações devem ser uma string válida' })
    @IsOptional()
    notes?: string;
}
