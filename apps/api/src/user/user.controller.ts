import { User, Prisma } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import {
  InternalServerErrorException,
  BadRequestException,
  Controller,
  UseGuards,
  Delete,
  Patch,
  Param,
  Body,
  Post,
  Get,
} from '@nestjs/common';

// @UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<User> {
    let newData: any;

    try {
      newData = await this.service.create(data);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'There is a unique constraint violation.',
          );
        }
      }
    }

    // Data yang berhasil di input ke database
    return newData;
  }

  @Get()
  async findAll(): Promise<User[]> {
    let data: any;

    try {
      data = await this.service.findAll({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return data;
  }

  @Get(':tlp')
  async findOne(@Param('tlp') tlp: string): Promise<User> {
    let data: any;

    try {
      data = await this.service.findOne({ where: { tlp } });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return data;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    let updatedData: any;

    try {
      updatedData = await this.service.update({ id: +id }, data);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    // Data yang berhasil di ubah di database
    return updatedData;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    let deletedData: any;

    try {
      deletedData = await this.service.remove({ id: +id });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    // Data yang berhasil di hapus dari database
    return deletedData;
  }
}
