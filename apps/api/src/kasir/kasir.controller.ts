import {
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  Controller,
  UseGuards,
  Delete,
  Patch,
  Param,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { KasirService } from './kasir.service';
// import { CreateKasirDto } from './dto/create-kasir.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateKasirDto } from './dto/update-kasir.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('kasir')
export class KasirController {
  constructor(private readonly kasirService: KasirService) {}

  @Post('register/:dev_code')
  @UseInterceptors(FileInterceptor('foto'))
  async register(
    @Param('dev_code') dev_code: string,
    @Body() data: any, // Change this !!!
    @UploadedFile()
    foto: Express.Multer.File,
  ): Promise<any> {
    // Wrong developer key not presented
    if (!dev_code || dev_code != 'by-owner-permata-komputer') {
      // Terminate task
      throw new UnauthorizedException();
    }
    return this.create(data, foto);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  async create(
    @Body() data: any,
    @UploadedFile()
    foto: Express.Multer.File,
  ): Promise<any> {
    return this.kasirService.create(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.kasirService.findAll({});
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kasirService.findOne({ where: { id: +id } });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKasirDto: UpdateKasirDto) {
    return this.kasirService.update({ id: +id }, updateKasirDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kasirService.remove({ id: +id });
  }
}
