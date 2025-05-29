import type WebSocket from 'ws';

export type SocketStream = {
	socket: WebSocket;
	setEncoding: (encoding: BufferEncoding) => void;
};
