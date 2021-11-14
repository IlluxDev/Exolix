import { SocketOptions } from "./SocketOptions";
import express, { Express } from "express";
import expressWs from "express-ws";
import deepmerge from "deepmerge";

export class Socket {
	private expressServer?: Express;
	private expressPlugins = [] as any[];
	private started = false;
	private settings: SocketOptions;

	public constructor(options: SocketOptions) {
		this.settings = deepmerge<SocketOptions>({
			port: 3000,
			host: "0.0.0.0"
		}, options);

		this.initialize();
	}

	private initialize() {
		this.expressServer = express();
		expressWs(this.expressServer);

		this.expressPlugins.forEach(plugin => this.expressServer?.use(plugin));
	}

	public start(): Promise<number> {
		return new Promise((resolve, reject) => {
			if (this.started) {
				reject("Server has already been started");
				return;
			}

			this.expressServer?.listen(this.settings.port, () => {
				resolve(this.settings.port!);
			});
		});
	}
}