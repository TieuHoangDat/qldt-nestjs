import { IsNotEmpty, IsString } from "class-validator"

export class AuthDTO {
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}