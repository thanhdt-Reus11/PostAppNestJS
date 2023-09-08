import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from '../common/types/tokens.type';
import { LoginDto } from './dto/login.dto';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { SkipAT } from 'src/common/decorators/skipAccess.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAT()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto
  ) : Promise<Tokens> {
    return this.authService.register(registerDto);
  }

  
  @SkipAT()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto
  ) : Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req
  ) {
    return this.authService.logout(req.user);
  }

  @SkipAT()
  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() req 
  ) : Promise<Tokens> {
    return this.authService.refresh(req.user);
  }
}
