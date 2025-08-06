import { Kasir, Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KasirService {
  private readonly findAllKeys: Prisma.KasirSelect = {};
  private readonly findOneKeys: Prisma.KasirSelect = {};

  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<Kasir> {
    let newData: Prisma.KasirCreateInput = { ...data };

    // Konfigurasi timestamp
    const thisTime = new Date().toISOString();
    newData.createdAt = thisTime;
    newData.updatedAt = thisTime;

    // Save a new data
    return this.prisma.kasir.create({ data: newData });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.KasirWhereUniqueInput;
    where?: Prisma.KasirWhereInput;
    orderBy?: Prisma.KasirOrderByWithRelationInput;
  }): Promise<Kasir[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.kasir.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(params: {
    select?: Prisma.KasirSelect;
    where: Prisma.KasirWhereUniqueInput;
  }): Promise<Kasir | null> {
    const { select, where } = params;
    return this.prisma.kasir.findUnique({
      select: { ...this.findOneKeys, ...select },
      where,
    });
  }

  async update(where: Prisma.KasirWhereUniqueInput, data: any): Promise<Kasir> {
    let updatedData: Prisma.KasirUpdateInput = { ...data };

    // Konfigurasi timestamp
    const thisTime = new Date().toISOString();
    updatedData.updatedAt = thisTime;

    // Save updated data
    return this.prisma.kasir.update({ where, data: updatedData });
  }

  async remove(where: Prisma.KasirWhereUniqueInput): Promise<Kasir> {
    return this.prisma.kasir.delete({ where });
  }
}
