import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt"
import { User } from "../../user/schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from 'bcryptjs';
import { Request } from "express";
import { Payload } from "../types/payload.type";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.RT_SECRET,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: Payload) {
        const { id, email } = payload;

        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        const refresh_token = type === 'Bearer' ? token : undefined;

        if (!refresh_token) {
            throw new UnauthorizedException('Not refresh token');
        }

        const user = await this.userModel.findById(id);

        if (!user || !user.refresh_token) {
            throw new UnauthorizedException('Login first to access this endpoint.');
        }

        const isRTMatched = await bcrypt.compare(refresh_token, user.refresh_token);

        if (!isRTMatched) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return user;
    }
}