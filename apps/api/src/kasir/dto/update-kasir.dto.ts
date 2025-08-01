import { PartialType } from '@nestjs/mapped-types';
import { CreateKasirDto } from './create-kasir.dto';

export class UpdateKasirDto extends PartialType(CreateKasirDto) {}
