import { io, type Socket } from 'socket.io-client';

export let socket: Socket | null = null;

export function socketConnect(target: string) {
  socket = io(target);
}
