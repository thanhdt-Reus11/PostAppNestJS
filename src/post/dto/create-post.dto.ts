import { IsBoolean, IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/schemas/user.schema";




export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    readonly description: string;

    readonly isPublished: boolean;

    @IsEmpty({message: 'You cannot pass owner id'})
    readonly owner: User;
}
