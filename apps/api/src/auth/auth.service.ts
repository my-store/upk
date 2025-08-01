import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin, User } from '../../generated/prisma/client';
import { AdminService } from '../admin/admin.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface FindAdminOrUser {
  data: Admin | User;
  type: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly admin: AdminService,
    private readonly jwt: JwtService,
  ) {}

  async findAdminOrUser(tlp: string): Promise<FindAdminOrUser> {
    let data: any;
    let type: string = '';

    // Try find admin first
    try {
      data = await this.admin.findOne({ where: { tlp } });
      type = 'Admin';
    } catch (error) {}

    // Admin not found, try find user
    if (!data) {
      try {
        data = await this.user.findOne({ where: { tlp } });
        type = 'User';
      } catch (error) {}
    }

    return { data, type };
  }

  async signIn(tlp: string, pass: string): Promise<any> {
    const { data, type }: any = await this.findAdminOrUser(tlp);

    // Admin or User not found
    if (!data) {
      throw new UnauthorizedException();
    }

    // Compare password
    const passed = bcrypt.compareSync(pass, data.password);

    // Wrong password
    if (!passed) {
      throw new UnauthorizedException();
    }

    // Create JWT token
    return this.createJwt(data, type);
  }

  async createJwt(person: Admin | User, type: string): Promise<any> {
    // Convert person data into hex string
    const personString = JSON.stringify(person);
    const personHex = Buffer.from(personString, 'utf8').toString('hex');

    // Generate JWT token
    const payload = { sub: person.tlp, type, data: personHex };
    return { access_token: await this.jwt.signAsync(payload) };
  }

  async refresh(tlp: string, pass: string) {
    const { data, type }: any = await this.findAdminOrUser(tlp);

    // Admin or User not found
    if (!data) {
      throw new UnauthorizedException();
    }

    // Wrong password
    if (pass != data.password) {
      throw new UnauthorizedException();
    }

    // Create JWT token
    return this.createJwt(data, type);
  }
}
