import { AuthLoginDto, AuthRefreshDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {
  Controller,
  UseGuards,
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
  refreshToken(@Body() data: AuthRefreshDto) {
    return this.service.refresh(data.tlp);
  }

  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
