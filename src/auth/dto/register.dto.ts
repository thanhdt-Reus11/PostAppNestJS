import { IsEmail, IsEmpty, IsNotEmpty, IsString, MinLength } from "class-validator";



export class RegisterDto {
    
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    
    @IsEmail({}, {message: "Please enter correct email."})
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    isAdmin: boolean;

    @IsEmpty({ message: "You cannot pass refresh token" })
    readonly refresh_token: string;
}