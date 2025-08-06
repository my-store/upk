import { KasirController } from './kasir.controller';
import { PrismaService } from 'src/prisma.service';
import { KasirService } from './kasir.service';
import { Module } from '@nestjs/common';

@Module({
  exports: [KasirService],
  controllers: [KasirController],
  providers: [KasirService, PrismaService],
})
export class KasirModule {}
