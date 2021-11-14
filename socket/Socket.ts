import { SocketOptions } from "./SocketOptions";
import express, { Express } from "express";
import expressWs from "express-ws";
import deepmerge from "deepmerge";
import { WebSocketServer } from "ws";

export class Socket {
	private websocketServer?: WebSocketServer;
	private started = false;
	private settings: SocketOptions;
	private events = {
		ready: [] as any[],
		error: [] as any[],
		stop: [] as any[]
	};

	public constructor(options: SocketOptions) {
		this.settings = deepmerge<SocketOptions>({
			port: null,
			host: "0.0.0.0",
			secure: false
		}, options);
	}

	public start(): Promise<SocketOptions["port"]> {
		return new Promise((resolve, reject) => {
			if (this.started) {
				reject("Server has already been started");
				return;
			}

			this.websocketServer = new WebSocketServer({
				port: this.settings.port ?? undefined,
				host: this.settings.host
			});

			this.websocketServer.on("listening", () => {
				resolve(this.settings.port);
				this.events.ready.forEach(event => event(this.settings.port));
			});

			this.websocketServer.on("error", error => {
				reject(error);
				this.events.error.forEach(event => event(error));
			});
		});
	}

	public on(event: "stop", listener: () => void): void;
	public on(event: "ready", listener: (port: SocketOptions["port"]) => void): void;
	public on(event: "error", listener: () => void): void;

	public on(event: any, listener: any) {
		(this.events as any)[event].push(listener);
	}
}