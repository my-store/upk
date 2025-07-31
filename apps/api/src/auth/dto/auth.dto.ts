import { IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  tlp: string;

  @IsNotEmpty()
  pass: string;
}
