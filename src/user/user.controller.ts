import { Controller, Get, HttpCode,HttpStatus, Req, ForbiddenException, BadRequestException, Patch, Param, Body, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { ForbiddenError } from "@casl/ability";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateRoleDta } from "./dto/create-role.dts";
import { AbilityFactory } from "../ability/ability.factory";
import { Role } from "./entities/user.entity";
import { Action } from "../ability/ability.factory";


@Controller('user')
export class UserController {
    constructor( private readonly userService: UserService,
    private abilityFactory : AbilityFactory
    ) {}


    @Post()
    async create(@Body() createRoleDto: CreateRoleDta, @Req() req) {
        //const user = { id: 1, isAdmin:true, orgId: 1 };


        const ability = this.abilityFactory.defineAbility(req.user);

        const userToUpdate = await this.userService.findOne('64f7924da0800b7b5f0284d5');
        try {
            console.log(req.user.email);
            console.log(userToUpdate.constructor.name);
            ForbiddenError.from(ability).throwUnlessCan(Action.Create, userToUpdate);

            return this.userService.create(createRoleDto);
        } catch (error) {
            if ( error instanceof ForbiddenError) {
                //console.log(error);
                throw new ForbiddenException(error.message);
            }

            throw new BadRequestException('Bad request');
        }
    }

    @Patch(':id')
    update(@Param('id') id: string,
    @Body() createRoleDto: CreateRoleDta,
    @Req() req) {
        const userToUpdate = new Role();
        userToUpdate.id = 2;
        userToUpdate.isAdmin = true;
        userToUpdate.orgId = 1

        const user = { id: 1, isAdmin:true, orgId: 2};
        const ability = this.abilityFactory.defineAbility(req.user);
        try {
            ForbiddenError.from(ability).throwUnlessCan(Action.Update, userToUpdate);

            return this.userService.update(+id, createRoleDto);
        } catch (error) {
            if ( error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }

            throw new BadRequestException('Bad request');
        }
    }

    // @Get('')
    // @HttpCode(HttpStatus.OK)
    // async findAll(
    //     @Req() req : any
    // ) : Promise<User[]> {
    //     return this.userService.findAll(req.user);
    // }

    // @Patch(':id')
    // async update(
    //     @Param('id') id : string,
    //     @Body() updateUserDto : UpdateUserDto,
    //     @Req() req : any
    // ) : Promise<User> {
    //     return this.userService.update(id, updateUserDto, req.user);
    // }
}