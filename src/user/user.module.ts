import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AbilityModule } from '../ability/ability.module'
import { AbilityFactory } from '../ability/ability.factory';

@Module({
    imports: [
        AbilityModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    controllers: [UserController],
    providers: [UserService, AbilityFactory],
    exports: [AbilityFactory]
})

export class UserModule {}