import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KasirService } from './kasir.service';
import { CreateKasirDto } from './dto/create-kasir.dto';
import { UpdateKasirDto } from './dto/update-kasir.dto';

@Controller('kasir')
export class KasirController {
  constructor(private readonly kasirService: KasirService) {}

  @Post()
  create(@Body() createKasirDto: CreateKasirDto) {
    return this.kasirService.create(createKasirDto);
  }

  @Get()
  findAll() {
    return this.kasirService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kasirService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKasirDto: UpdateKasirDto) {
    return this.kasirService.update({ id: +id }, updateKasirDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kasirService.remove({ id: +id });
  }
}
