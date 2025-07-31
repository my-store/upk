import { Module } from '@nestjs/common';
import { PersediaanController } from './persediaan.controller';
import { PersediaanService } from './persediaan.service';

@Module({
  imports: [],
  controllers: [PersediaanController],
  providers: [PersediaanService],
})
export class PersediaanModule {}
