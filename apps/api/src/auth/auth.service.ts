import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly admin: AdminService,
    private readonly jwt: JwtService,
  ) {}

  async signIn(tlp: string, pass: string): Promise<any> {
    let person: any = null;

    // Try find admin first
    try {
      person = await this.admin.findOne({ where: { tlp } });
    } catch (error) {}

    // Admin not found, try find user
    if (!person) {
      try {
        person = await this.user.findOne({ where: { tlp } });
      } catch (error) {}
    }

    // Still not found
    if (!person) {
      throw new UnauthorizedException();
    }

    // Compare password
    const passed = bcrypt.compareSync(pass, person.password);

    // Wrong password
    if (!passed) {
      throw new UnauthorizedException();
    }

    // Generate JWT token
    const payload = { sub: person.id, username: tlp };
    return { access_token: await this.jwt.signAsync(payload) };
  }
}
