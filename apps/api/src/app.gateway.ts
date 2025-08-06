import { IsNotEmpty } from 'class-validator';
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

interface Client {
  socket: Socket;

  // Data ini didapatkan dari server[auth]->client setelah login
  tlp?: any; // prisma.admin.tlp | prisma.kasir.tlp | prisma.user.tlp
  role?: any; // Admin | Kasir | User
}

class InitBody {
  @IsNotEmpty()
  tlp: any;

  @IsNotEmpty()
  role: any;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients: Client[] = [];

  constructor(private readonly service: AppService) {}

  // Websocket server is started ...
  afterInit(server: any) {}

  // When user is connected
  handleConnection(@ConnectedSocket() client: Socket) {
    // Add a new user
    this.clients.push({ socket: client });

    console.log('Connected', client.id);
    console.log('Active', this.clients.length);
  }

  // When user is disconnected
  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    // The the disconnected client data
    const activeUser: Client = this.findUser(client.id);

    // The the index of disconnected client data
    const activeUserIndex = this.clients.indexOf(activeUser);

    // Remove this client from client list
    this.clients = this.clients.slice(activeUserIndex, 1);

    // Merubah status online = false
    await this.service.logout(activeUser.tlp, activeUser.role);

    console.log('Disconnected', client.id);
    console.log('Active', this.clients.length);
  }

  // Status online Admin, User dan Kasir dikerjakan disini
  @SubscribeMessage('initialize')
  async init(
    @MessageBody() { tlp, role }: InitBody,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // Get old user data index
    const activeUserIndex = this.clients.indexOf(this.findUser(client.id));

    // Old user data (client object only withour tlp and role)
    const oldUser = this.clients[activeUserIndex];

    // Untuk menghindari duplikasi client, check dulu apakah
    // sebelumnya telah melakukan inisialisasi.
    // Jika iya, blokir akses inisialisai ganda.
    // Proses inisialisasi pada client terletak pada halaman
    // admin | user | kasir bukan pada halaman login.
    // Maka dari itu, ketika admin | user | kasir berhasil login
    // dan membuka tab baru, akan memicu inisialisasi ganda.
    if (oldUser.role && oldUser.tlp) {
      // Blokir inisialisasi ganda.
      return;
    }

    // Update old user data with included tlp and role
    this.clients[activeUserIndex] = { ...oldUser, tlp, role };

    // Merubah status online = true
    await this.service.login(tlp, role);

    // Broadcast to all connected clients except me!
    this.broadcast('login', tlp, client);
  }

  findUser(id: string): any {
    return this.clients.find((u) => u.socket.id == id);
  }

  broadcast(event: string, data: any, client: Socket) {
    // Broadcast that sender (me) is online now.
    const otherClients = this.clients.filter((u) => u.socket.id != client.id);
    // Kirim event 'login' ke seluruh user yang terhubung socket
    // sambil mengirim no tlp yang baru saja aktif.
    for (let oc of otherClients) {
      // Dengan syarat client client memiliki object tlp dan role (sudah login)
      // untuk menghindari duplikasi client, atau ada client yang belum login.
      if (oc.role && oc.tlp) {
        // Kirim pesan broadcast
        oc.socket.emit('login', data);
      }
    }
  }

  //   @SubscribeMessage('createMessage')
  //   create(@MessageBody() data: CreateMessageDto) {
  //     const message = this.service.create(data);

  //     this.server.emit('message', message);

  //     return message;
  //   }

  //   @SubscribeMessage('findAllMessages')
  //   findAll() {
  //     return this.service.findAll();
  //   }

  //   @SubscribeMessage('join')
  //   joinRoom(
  //     @MessageBody('name') name: string,
  //     @ConnectedSocket() client: Socket,
  //   ) {}

  //   @SubscribeMessage('typing')
  //   async typing(
  //     @MessageBody('isTyping') isTyping: boolean,
  //     @ConnectedSocket() client: Socket,
  //   ) {}
}
