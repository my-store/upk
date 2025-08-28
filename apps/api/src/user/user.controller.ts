import { User, Prisma } from '../../generated/prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import {
  GetFileDestBeforeUpload,
  ProfileImageValidator,
  upload_img_dir,
  DeleteFile,
  UploadFile,
} from 'src/libs/upload-file-handler';
import {
  InternalServerErrorException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Controller,
  UseGuards,
  Delete,
  Patch,
  Param,
  Body,
  Post,
  Get,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('register/:dev_code')
  @UseInterceptors(FileInterceptor('foto'))
  async register(
    @Param('dev_code') dev_code: string,
    @Body() data: CreateUserDto,
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
    @Body() data: CreateUserDto,
    @UploadedFile()
    foto: Express.Multer.File,
  ): Promise<any> {
    let newData: any;

    // Jika user tidak mengunggah foto
    if (!foto) {
      throw new BadRequestException('Wajib mengunggah foto!');
    }

    // User mengunggah foto namun formatnya salah,
    // atau mungkin user salah input file.
    else {
      const { status, message } = ProfileImageValidator(foto);
      if (!status) {
        throw new BadRequestException(message);
      }
    }

    // Set image name
    const img_path = `${upload_img_dir}/user/profile`;
    const img_name = data.tlp;
    data.foto = GetFileDestBeforeUpload(foto, img_path, img_name);

    try {
      newData = await this.service.create({
        ...data,

        // Parse adminId to integer
        adminId: parseInt(data.adminId),

        // Remove 'public' from image directory
        foto: data.foto.replace('public', ''),
      });
    } catch (e) {
      // Unique constraint error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'There is a unique constraint violation.',
          );
        }
      }

      // Another error
      throw new InternalServerErrorException(e);
    }

    // Upload image
    try {
      UploadFile(foto, data.foto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    // Data yang berhasil di input ke database
    return newData;
  }

  @UseGuards(AuthGuard)
  @Get('except-me/:tlp')
  async getAllExceptMe(@Param('tlp') tlp: string): Promise<User[]> {
    let data: any;

    try {
      data = await this.service.findAll({
        where: {
          tlp: {
            not: tlp,
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return data;
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get('where')
  async searchBy(@Body() where: any): Promise<User[]> {
    let data: any;

    try {
      data = await this.service.findAll({ where });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return data;
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    let deletedData: any;

    // Delete data from database
    try {
      deletedData = await this.service.remove({ id: +id });
    } catch (e) {
      throw new BadRequestException(e);
    }

    // Delete image profile too
    try {
      // Dont forget to add 'public' int the path
      DeleteFile('public' + deletedData.foto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    // Data yang berhasil di hapus dari database
    return deletedData;
  }
}
