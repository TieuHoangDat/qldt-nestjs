import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    date: number;

    @IsNotEmpty()
    month: number;

    @IsNotEmpty()
    year: number;

    @IsNotEmpty()
    role: number;

    opt?: string;
}
