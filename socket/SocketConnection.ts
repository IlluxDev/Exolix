import { WebSocket } from "ws";

export class SocketConnection {
	private identifier: string;
	private ws: WebSocket;

	public constructor(ws: WebSocket, identifier: string) {
		this.identifier = identifier;
		this.ws = ws;
	}

	public getIdentifier(): string {
		return this.identifier;
	}
}
