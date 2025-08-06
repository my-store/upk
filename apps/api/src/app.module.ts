import { PersediaanModule } from './persediaan/persediaan.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AdminModule } from './admin/admin.module';
import { KasirModule } from './kasir/kasir.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client', 'dist'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PersediaanModule,
    AdminModule,
    UserModule,
    AuthModule,
    KasirModule,
  ],

  providers: [AppGateway, AppService],
})
export class AppModule {}
