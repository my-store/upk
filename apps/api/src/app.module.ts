import { PersediaanModule } from './persediaan/persediaan.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MessagesModule } from './messages/messages.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client', 'dist'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PersediaanModule,
    MessagesModule,
    AdminModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
