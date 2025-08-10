import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin, Kasir, User } from 'generated/prisma';
import { AdminService } from './admin/admin.service';
import { KasirService } from './kasir/kasir.service';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly admin: AdminService,
    private readonly kasir: KasirService,
    private readonly user: UserService,
  ) {}

  async update(
    tlp: string,
    role: string,
    newData: any,
  ): Promise<Admin | User | Kasir> {
    let updatedData: any;

    // Update data by role
    switch (role) {
      // ADMIN
      case 'Admin':
        try {
          updatedData = await this.admin.update({ tlp }, newData);
        } catch {}
        break;

      // USER
      case 'User':
        try {
          updatedData = await this.user.update({ tlp }, newData);
        } catch {}
        break;

      // KASIR
      case 'Kasir':
        try {
          updatedData = await this.kasir.update({ tlp }, newData);
        } catch {}
        break;
    }

    // An error occured while updating data
    if (!updatedData) {
      // Terminate task
      throw new UnauthorizedException();
    }

    // Updated data
    return updatedData;
  }

  async login(tlp: string, role: string): Promise<Admin | User | Kasir> {
    return this.update(tlp, role, { online: true });
  }

  async logout(tlp: string, role: string): Promise<Admin | User | Kasir> {
    return this.update(tlp, role, {
      online: false,
      lastOnline: new Date().toISOString(),
    });
  }
}
