import { IsEmail, IsString, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Email deve ter um formato válido' })
    email: string;

    @IsString({ message: 'Nome deve ser uma string válida' })
    @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
    name: string;

    @IsString({ message: 'Telefone deve ser uma string válida' })
    @IsOptional()
    phone?: string;

    @IsString({ message: 'Endereço deve ser uma string válida' })
    @IsOptional()
    address?: string;
}
