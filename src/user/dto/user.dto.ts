import { IsNotEmpty } from "class-validator";

export class UserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

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
