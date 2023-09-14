import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel, MongooseModule } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { ForbiddenError } from "@casl/ability";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AbilityFactory } from "src/ability/ability.factory";
import { AuthService } from "src/auth/auth.service";


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private readonly authService : AuthService
    ) {}

    async findAll() : Promise<User[]> {
        const users = await this.userModel.find();
        return users;
    }

    async update(id: string, updateUserDto: UpdateUserDto)  {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('Please enter correct id');
        }

        const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
            new: true,
            runValidators: true
        })

        if(!user) {
            throw new NotFoundException('User not found')
        }
        
        return await this.authService.refresh(user);
    }
}