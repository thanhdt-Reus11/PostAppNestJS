import { Socket } from "socket.io";


export type Payload = {
    id: string,
    email: string,
    role: string
}

export type SocketWithAuth = Socket & Payload;