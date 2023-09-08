import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AbilityModule } from '../ability/ability.module'
import { AbilityFactory } from '../ability/ability.factory';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        AbilityModule,
        AuthModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    controllers: [UserController],
    providers: [UserService, AbilityFactory, AuthService],
    exports: [UserService]
})

export class UserModule {}