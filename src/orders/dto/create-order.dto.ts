import { IsString, IsOptional } from "class-validator";

export class CreateOrderDto {
    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    shippingAddress?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
