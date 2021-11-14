import { SocketOptions } from "./SocketOptions";
import http from "http";
import https from "https";
import deepmerge from "deepmerge";
import { WebSocketServer } from "ws";
import { SocketConnection } from "./SocketConnection";

export { SocketOptions, SocketConnection };

export class Socket {
	private websocketServer?: WebSocketServer;
	private httpServer?: http.Server | https.Server;
	private started = false;
	private settings: SocketOptions;
	private events = {
		ready: [] as any[],
		error: [] as any[],
		stop: [] as any[],
		open: [] as any[],
	};

	public constructor(options: SocketOptions) {
		this.settings = deepmerge<SocketOptions>(
			{
				port: null,
				host: "0.0.0.0",
				ssl: false,
				connectionLimit: 1000,
			},
			options
		);

		if (this.settings.ssl != false) {
			this.httpServer = https.createServer({
				cert: this.settings.ssl?.certificate,
				key: this.settings.ssl?.key,
			});
		} else {
			this.httpServer = http.createServer();
		}

		this.websocketServer = new WebSocketServer({
			server: this.httpServer,
		});

		this.websocketServer?.on("error", (error) => {
			this.events.error.forEach((event) => event(error));
		});

		this.websocketServer?.on("connection", (ws) => {
			console.log(ws);
		});
	}

	public start(): Promise<SocketOptions["port"]> {
		return new Promise((resolve, reject) => {
			if (this.started) {
				reject("Server has already been started");
				return;
			}

			try {
				this.httpServer?.listen(
					this.settings.port ?? undefined,
					this.settings.host,
					this.settings.connectionLimit,
					() => {
						resolve(this.settings.port);
						this.events.ready.forEach((event) =>
							event(this.settings.port)
						);
					}
				);
			} catch (error: any) {
				reject(error);
				this.events.error.forEach((event) => event(error));
			}
		});
	}

	public on(event: "stop", listener: () => void): void;
	public on(
		event: "ready",
		listener: (port: SocketOptions["port"]) => void
	): void;
	public on(event: "error", listener: () => void): void;
	public on(
		event: "open",
		listener: (connection: SocketConnection) => void
	): void;

	public on(event: any, listener: any) {
		(this.events as any)[event].push(listener);
	}
}
