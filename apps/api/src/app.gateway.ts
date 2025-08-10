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

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const matchedUser = this.users.find((u) => u.socket == client);
    if (matchedUser) {
      // Find for matched user
      const matchedUserIndex = this.users.indexOf(matchedUser);
      // Remove matched user
      this.users.splice(matchedUserIndex, 1);
      // Update online status to false
      this.service.logout(matchedUser.tlp, matchedUser.role);
      // Broadcast to all connected devices except me
      client.broadcast.emit('offline', matchedUser.tlp);
    }
  }

  @SubscribeMessage('online')
  async online(
    @MessageBody() { tlp, role }: OnlineBody,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // Add new user if not exist
    const matchedUser: any = this.users.find((u) => u.socket == client);
    // User not exist
    if (!matchedUser) {
      // Add new user
      this.users.push({ tlp, role, socket: client });
      // Update online status to true
      await this.service.login(tlp, role);
      // Broadcast to all connected devices except me
      client.broadcast.emit('online', tlp);
    }
  }
}
