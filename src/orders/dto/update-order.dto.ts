import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../entities/order.entity";

export class UpdateOrderDto {
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @IsString()
    @IsOptional()
    shippingAddress?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
