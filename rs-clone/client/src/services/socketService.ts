import { io, Socket } from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";

class SocketService{
public socket: Socket | null = null;
public connect(url: string): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
  return new Promise((res, rej) => {
    this.socket = io(url);
    if(!this.socket) {
      return rej()
    }
    this.socket.on('connect', () => {
      res(this.socket as Socket)
    })
    this.socket.on('connect_error', (error) => {
      console.log(error);
      rej(error)
    })

  })
}
}

export default new SocketService();