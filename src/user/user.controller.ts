import { Controller, Get, HttpCode,HttpStatus, Req, ForbiddenException, BadRequestException, Patch, Param, Body, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { ForbiddenError } from "@casl/ability";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateRoleDta } from "./dto/create-role.dts";
import { AbilityFactory } from "../ability/ability.factory";
import { UserEntity } from "./entities/user.entity";
import { Action } from "../ability/ability.factory";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/types/role.enum";


@Controller('user')
export class UserController {
    constructor( private readonly userService: UserService,
    private abilityFactory : AbilityFactory
    ) {}

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req
    ) {
        const userToUpdate = new UserEntity();
        userToUpdate.id = id;
        const ability = this.abilityFactory.defineAbility(req.user);
        try {
            ForbiddenError
                .from(ability)
                .throwUnlessCan(Action.Update, userToUpdate);
            return this.userService.update(id, updateUserDto);
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }

            throw new BadRequestException('Bad request');
        }
    }

    @Roles(Role.Admin)
    @Get('')
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req : any
    ) : Promise<User[]> {
        return this.userService.findAll();
    }

    // @Patch(':id')
    // async update(
    //     @Param('id') id : string,
    //     @Body() updateUserDto : UpdateUserDto,
    //     @Req() req : any
    // ) : Promise<User> {
    //     return this.userService.update(id, updateUserDto, req.user);
    // }
}