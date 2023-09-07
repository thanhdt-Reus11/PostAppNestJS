import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { ForbiddenError } from "@casl/ability";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AbilityFactory } from "src/ability/ability.factory";
import { CreateRoleDta } from "./dto/create-role.dts";


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private abilityFactory : AbilityFactory
    ) {}

    async findOne(id: string) {
        const data = this.userModel.findById(id);
        if(!data) {
            throw new BadRequestException('lol');
        }

        return data;
    }

    // finAll() {}
    // update() {}

    create(createRoleDto: CreateRoleDta) {
        return {message:  "Moi thu OK" };
    }

    update(id: number, createRoleDto: CreateRoleDta) {
        return {message:  "Moi thu OKlllooo" };
    }
}