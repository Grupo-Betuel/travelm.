import { Socket } from "socket.io-client";

export const DEV_SOCKET_URL = 'http://localhost:5000'
// export const PROD_SOCKET_URL = 'http://165.232.158.16'
export const PROD_SOCKET_URL = 'ws://142.93.127.19:5000/chat'
export const CONNECTED_EVENT = 'connect'
export const onSocketOnce = (socket: Socket, eventName: string, callback: (data: any) => any) => {
    if (socket && !socket.hasListeners(eventName)) {
        console.log('event:', eventName);
        socket.on(eventName, callback);
    }
};
