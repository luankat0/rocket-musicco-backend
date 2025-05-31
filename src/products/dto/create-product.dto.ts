import { IsDate, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsDate()
    @IsOptional()
    createdAt?: Date;
}
