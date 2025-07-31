import { Controller, Get } from '@nestjs/common';
import { PersediaanService } from './persediaan.service';

@Controller('persediaan')
export class PersediaanController {
  constructor(private readonly service: PersediaanService) {}

  @Get()
  getall() {
    return this.service.getall();
  }
}
