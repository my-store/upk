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
  constructor(private service: AuthService) {}

  @Post()
  signIn(@Body() signInDto: AuthLoginDto) {
    return this.service.signIn(signInDto.tlp, signInDto.pass);
  }

  @Post('refresh')
  refreshToken(@Body('data') data: string) {
    const person = JSON.parse(Buffer.from(data, 'hex').toString('utf8'));
    const { tlp, password } = person;
    return this.service.refresh(tlp, password);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
