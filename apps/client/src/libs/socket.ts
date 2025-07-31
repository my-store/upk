import { io } from 'socket.io-client';

// Socket configuration, perhatikan URL ini saat production.
const server_url = 'http://localhost:3000';
export const socket = io(server_url);
