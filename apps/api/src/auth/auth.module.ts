import { KasirModule } from 'src/kasir/kasir.module';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './auth.constants';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AdminModule,
    UserModule,
    KasirModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        // expiresIn: 60000,
        expiresIn: 60,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
