import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../common/types/tokens.type';
import * as bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private readonly  userModel: Model<User>,
        private readonly jwtService: JwtService
        ) {};
    
    async register (registerDto: RegisterDto) : Promise<Tokens> {

        const {firstName, lastName, email, password, isAdmin} = registerDto;

        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await this.userModel.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                isAdmin
            })

            const role =  (isAdmin ? 'admin' : 'user')
            const [refresh_token, access_token] = await this.createTokens(user._id, user.email, role)
            
            user.refresh_token = await bcrypt.hash(refresh_token, 10);
            user.save();

            return {
                refresh_token: refresh_token,
                access_token: access_token
            }
        }
        catch(error) {
            if (error.code === 11000) {
                throw new ConflictException('Duplicate email entered');
              } else {
                throw error;
              }
        }
    }

    async login(loginDto: LoginDto) : Promise<Tokens> {
        const {email, password} = loginDto;

        const user = await this.userModel.findOne({email});

        if(!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const role =  (user.isAdmin ? 'admin' : 'user')
        const [refresh_token, access_token] = await this.createTokens(user._id, user.email, role);

        user.refresh_token = await bcrypt.hash(refresh_token, 10);
        user.save();

        return {
            refresh_token: refresh_token,
            access_token: access_token
        }
    }

    async logout (user: User) {
        if (user.refresh_token) {
            user.refresh_token = null;
            user.save();
        }
        return {
            message: "Log out successfully!"
        };
    }

    async refresh (user: User) {
        const role =  (user.isAdmin ? 'admin' : 'user');
        const [refresh_token, access_token] = await this.createTokens(user._id, user.email, role);

        const hashRT = await bcrypt.hash(refresh_token, 10);
        await this.userModel.findByIdAndUpdate(user._id, {
            refresh_token: hashRT
        });

        return {
            refresh_token: refresh_token,
            access_token: access_token
        }
    }

    private createTokens (userId: mongoose.Types.ObjectId, userEmail: string, userRole: string) {
        return Promise.all([
            this.jwtService.signAsync({
                id: userId,
                email: userEmail,
                role: userRole
            },
            {
                secret: process.env.RT_SECRET,
                expiresIn: process.env.RT_EXPIRE
            }),
            this.jwtService.signAsync({
                id: userId,
                email: userEmail,
                role: userRole
            },
            {
                secret: process.env.AT_SECRET,
                expiresIn: process.env.AT_EXPIRE
            }),
        ])  
    }
}
