import { AuthLoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {
  Controller,
  HttpStatus,
  UseGuards,
  HttpCode,
  Request,
  Body,
  Post,
  Get,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  signIn(@Body() signInDto: AuthLoginDto) {
    return this.authService.signIn(signInDto.tlp, signInDto.pass);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
