import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  adminId: string;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  tlp: string;

  @IsNotEmpty()
  password: string;

  foto?: string;
}
