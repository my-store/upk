import { Module } from '@nestjs/common';
import { KasirService } from './kasir.service';
import { KasirController } from './kasir.controller';

@Module({
  controllers: [KasirController],
  providers: [KasirService],
})
export class KasirModule {}
