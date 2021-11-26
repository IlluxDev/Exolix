import { WebSocket } from "ws";

export class SocketConnection {
	private readonly identifier: string;
	private ws: WebSocket;
	private responseListeners: { listener: any; channel: string }[] = [];
	private events = { close: [] as any[] };
	private readonly remoteAddress: string;

	public constructor(ws: WebSocket, request: any, identifier: string) {
		this.identifier = identifier;
		this.ws = ws;
		this.remoteAddress = request.socket.remoteAddress;

		this.ws.on("message", (responseMessage) => {
			try {
				const message: {
					channel?: string;
					data?: {
						[index: string]: any;
					};
				} = JSON.parse(responseMessage.toString());

				this.responseListeners.forEach((responseLocation) => {
					if (
						typeof message.channel == "string" &&
						responseLocation.channel == message.channel
					) {
						responseLocation.listener(message.data ?? {});
					}
				});
			} catch (error: any) {}
		});

		this.ws.on("close", () => {
			this.events.close.forEach((event) => event());
		});
	}

	public getIdentifier(): string {
		return this.identifier;
	}

	public onResponse<MessageType>(
		channel: string,
		listener: (message: MessageType) => void
	) {
		this.responseListeners.push({
			channel,
			listener,
		});
	}

	public getRemoteAddress(): string {
		return this.remoteAddress;
	}

	public on(event: "close", listener: () => void): void;

	public on(event: any, listener: any) {
		(this.events as any)[event].push(listener);
	}
}
