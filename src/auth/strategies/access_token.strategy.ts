import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../schemas/user.schema";
import { Model } from "mongoose";
import { Payload } from "../types/payload.type";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.AT_SECRET
        })
    }

    async validate(payload: Payload) {
        const { id, role } = payload;

        const user = await this.userModel.findById(id);

        if(!user) {
            throw new UnauthorizedException('Login first to access this endpoint.');
        }

        return user;
    }
}