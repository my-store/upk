import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin, User, Kasir } from '../../generated/prisma/client';
import { KasirService } from 'src/kasir/kasir.service';
import { AdminService } from '../admin/admin.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface FindAdminOrUser {
  data: Admin | User | Kasir;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly admin: AdminService,
    private readonly kasir: KasirService,
    private readonly user: UserService,
    private readonly jwt: JwtService,
  ) {}

  async findAdminOrUser(tlp: string): Promise<FindAdminOrUser> {
    let data: any;
    let role: string = '';

    // Try find admin first
    try {
      data = await this.admin.findOne({ where: { tlp } });
      role = 'Admin';
    } catch (error) {}

    // Admin not found, try find User
    if (!data) {
      try {
        data = await this.user.findOne({ where: { tlp } });
        role = 'User';
      } catch (error) {}
    }

    // User not found, try find Kasir
    if (!data) {
      try {
        data = await this.kasir.findOne({ where: { tlp } });
        role = 'Kasir';
      } catch (error) {}
    }

    return { data, role };
  }

  async signIn(tlp: string, pass: string): Promise<any> {
    const { data, role }: any = await this.findAdminOrUser(tlp);

    // Admin or User or Kasir not found
    if (!data) {
      // Terminate task
      throw new UnauthorizedException();
    }

    // Compare password
    const passed = bcrypt.compareSync(pass, data.password);

    // Wrong password
    if (!passed) {
      throw new UnauthorizedException();
    }

    // Create JWT token
    return this.createJwt(data, role);
  }

  async createJwt(person: Admin | User | Kasir, role: string): Promise<any> {
    const payload = { sub: person.tlp, role };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token, role };
  }

  async refresh(tlp: string): Promise<void> {
    // Ambil data user/admin
    const { data, role }: any = await this.findAdminOrUser(tlp);

    // Admin or User or Kasir not found
    if (!data) {
      // Terminate task
      throw new UnauthorizedException();
    }

    // --------------------------------------------------------------
    // SOON
    // --------------------------------------------------------------
    // Disini akan dilakukan pengecekan pada database token,
    // jika data tidak benar, blokir permintaan refresh token.
    // --------------------------------------------------------------
    // Jangan lupa buat dulu tabel untuk menyimpan token di database.
    // --------------------------------------------------------------

    // Buat token baru
    return this.createJwt(data, role);
  }
}
