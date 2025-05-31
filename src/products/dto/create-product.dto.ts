import { IsString, IsNumber, IsOptional, IsUrl, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(2, { message: 'Nome do instrumento deve ter 2 ou mais caracteres' })
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber({}, { message: 'Preço deve ser um número válido' })
    @Min(0.01, { message: 'Preço deve ser maior que 0' })
    price: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsNumber({}, { message: 'Quantidade em estoque deve ser um número válido' })
    @Min(0, { message: 'Quantidade em estoque deve ser maior ou igual a 0' })
    stock: number;

    @IsString()
    @IsUrl({}, { message: 'A URL da imagem deve ser válida' })
    @IsOptional()
    imageUrl?: string;
}
