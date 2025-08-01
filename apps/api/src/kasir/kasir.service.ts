import { Injectable } from '@nestjs/common';
import { CreateKasirDto } from './dto/create-kasir.dto';
import { UpdateKasirDto } from './dto/update-kasir.dto';

@Injectable()
export class KasirService {
  create(createKasirDto: CreateKasirDto) {
    return 'This action adds a new kasir';
  }

  findAll() {
    return `This action returns all kasir`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kasir`;
  }

  update(id: number, updateKasirDto: UpdateKasirDto) {
    return `This action updates a #${id} kasir`;
  }

  remove(id: number) {
    return `This action removes a #${id} kasir`;
  }
}
