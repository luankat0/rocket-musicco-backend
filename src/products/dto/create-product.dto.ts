import { IsString, IsNumber, IsOptional, IsUrl, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(2, { message: 'Tamanho do nome do Produto deve ser 2 ou mais' })
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber({}, { message: 'Preço deve ser um número válido' })
    @Min(0.01, { message: 'Preço deve ser maior que 0' })
    price: number;

    @IsNumber({}, { message: 'Quantidade deve ser um número válido' })
    @Min(0, { message: 'Quantidade deve ser maior ou igual a 0' })
    stock: number;

    @IsString()
    @IsUrl({}, { message: 'A URL da Imagem deve ser válida' })
    @IsOptional()
    imageUrl?: string;
}
