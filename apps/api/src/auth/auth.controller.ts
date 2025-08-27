import { FileInterceptor } from '@nestjs/platform-express';
import { Admin, Prisma } from 'generated/prisma';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {
  GetFileDestBeforeUpload,
  ProfileImageValidator,
  upload_img_dir,
  UploadFile,
} from 'src/libs/upload-file-handler';
import {
  InternalServerErrorException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Controller,
  UseGuards,
  Request,
  Body,
  Post,
  Get,
} from '@nestjs/common';
import {
  AuthAddDevAccountDto,
  AuthRefreshDto,
  AuthLoginDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  // Connection test
  @Get('connecton-test')
  connectionTest() {
    return "Oke, you're connected!";
  }

  @Post()
  signIn(@Body() signInDto: AuthLoginDto) {
    return this.service.signIn(signInDto.tlp, signInDto.pass);
  }

  @Post('refresh')
  refreshToken(@Body() data: AuthRefreshDto) {
    return this.service.refresh(data.tlp);
  }

  @Post('add-dev-account')
  @UseInterceptors(FileInterceptor('foto'))
  async addDevAccount(
    @Body() data: AuthAddDevAccountDto,
    @UploadedFile()
    foto: Express.Multer.File,
  ): Promise<Admin> {
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
      newData = await this.service.addDevAccount({
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

  // PROTECTED ROUTE
  @UseGuards(AuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
