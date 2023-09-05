import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";



export class LoginDto {
    @IsEmail({}, {message: "Please enter correct email."})
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}