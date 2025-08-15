import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  MessageBody,
} from '@nestjs/websockets';
import { Admin, Kasir, User } from 'generated/prisma';

interface OnlineBody {
  tlp: string;
  role: string;
}

interface Users extends OnlineBody {
  socket: Socket;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private users: Users[] = [];

  @WebSocketServer()
  server: Server;

  constructor(private readonly service: AppService) {}

  afterInit(server: any) {}

  handleConnection(@ConnectedSocket() client: Socket) {}

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // Find for matched user
    const matchedUser = this.users.find((u) => u.socket == client);
    if (matchedUser) {
      // Find index for matched user
      const matchedUserIndex = this.users.indexOf(matchedUser);

      // Remove matched user
      this.users.splice(matchedUserIndex, 1);

      // Except videotron
      if (matchedUser.role != 'Videotron') {
        // Update online status to false
        await this.offline(
          { tlp: matchedUser.tlp, role: matchedUser.role },
          client,
        );
      }
    }
  }

  crudHandler(event: string, data: any, client: Socket) {
    // Broadcast to all connected devices except me
    client.broadcast.emit(event, data);
  }

  @SubscribeMessage('online')
  async online(
    @MessageBody() { tlp, role }: OnlineBody,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // Find for matched user
    const matchedUser: any = this.users.find((u) => u.socket == client);

    // Add new user if not exist
    if (!matchedUser) {
      // Add new user
      this.users.push({ tlp, role, socket: client });

      // Except videotron
      if (role != 'Videotron') {
        // Update online status to true
        await this.service.login(tlp, role);

        // Broadcast to all connected devices except me
        client.broadcast.emit('online', tlp);
      }
    }
  }

  @SubscribeMessage('offline')
  async offline(
    @MessageBody() { tlp, role }: OnlineBody,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.service.logout(tlp, role);

    // Broadcast to all connected devices except me
    client.broadcast.emit('offline', tlp);
  }

  @SubscribeMessage('new-admin')
  async newAdmin(
    @MessageBody() data: Admin,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('new-admin', data, client);
  }

  @SubscribeMessage('update-admin')
  async updateAdmin(
    @MessageBody() data: Admin,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('update-admin', data, client);
  }

  @SubscribeMessage('delete-admin')
  async deleteAdmin(
    @MessageBody() data: Admin,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('delete-admin', data, client);
  }

  @SubscribeMessage('new-user')
  async newUser(
    @MessageBody() data: User,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('new-user', data, client);
  }

  @SubscribeMessage('update-user')
  async updateUser(
    @MessageBody() data: User,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('update-user', data, client);
  }

  @SubscribeMessage('delete-user')
  async deleteUser(
    @MessageBody() data: User,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('delete-user', data, client);
  }

  @SubscribeMessage('new-kasir')
  async newKasir(
    @MessageBody() data: Kasir,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('new-kasir', data, client);
  }

  @SubscribeMessage('update-kasir')
  async updateKasir(
    @MessageBody() data: Kasir,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('update-kasir', data, client);
  }

  @SubscribeMessage('delete-kasir')
  async deleteKasir(
    @MessageBody() data: Kasir,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.crudHandler('delete-kasir', data, client);
  }
}
