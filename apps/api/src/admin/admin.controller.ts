import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Prisma } from '../../generated/prisma/client';
import { Admin } from './entities/admin.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminService } from './admin.service';
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
} from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  async create(
    @Body() data: CreateAdminDto,
    @UploadedFile()
    foto: Express.Multer.File,
  ): Promise<any> {
    let newData: any;

    // Jika admin tidak mengunggah foto
    if (!foto) {
      throw new BadRequestException('Wajib mengunggah foto!');
    }

    // Admin mengunggah foto namun formatnya salah,
    // atau mungkin admin salah input file.
    else {
      const { status, message } = ProfileImageValidator(foto);
      if (!status) {
        throw new BadRequestException(message);
      }
    }

    // Set image name
    const img_path = `${upload_img_dir}/admin/profile`;
    const img_name = data.tlp;
    data.foto = GetFileDestBeforeUpload(foto, img_path, img_name);

    try {
      newData = await this.service.create({
        ...data,

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

  @Get('except-me/:tlp')
  async getAllExceptMe(@Param('tlp') tlp: string): Promise<Admin[]> {
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

  @Get()
  async findAll(): Promise<Admin[]> {
    let data: any;

    try {
      data = await this.service.findAll({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return data;
  }

  @Get('where')
  async searchBy(@Body() where: any): Promise<Admin[]> {
    let data: any;

    try {
      data = await this.service.findAll({ where });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return data;
  }

  @Get(':tlp')
  async findOne(@Param('tlp') tlp: string): Promise<Admin> {
    let data: any;

    try {
      data = await this.service.findOne({ where: { tlp } });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    return data;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAdminDto,
    @UploadedFile() foto?: Express.Multer.File,
  ): Promise<Admin> {
    let updatedData: any;

    // Check foto ...
    if (foto) {
      const { status, message } = ProfileImageValidator(foto);
      if (!status) {
        throw new BadRequestException(message);
      }
    }

    return 'Oke';

    try {
      updatedData = await this.service.update({ id: +id }, data);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    // Data yang berhasil di ubah di database
    return updatedData;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Admin> {
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
