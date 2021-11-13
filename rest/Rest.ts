import express, { Express } from "express";
import { utils } from "../utils/Utils";

export interface RestOptions {
	port?: number | null;
	listeningPaths?: {
		get?: string[],
		post?: string[]
	};
}

export class Rest {
	private started = false;
	private config: RestOptions;
	private expressServer?: Express;

	public constructor(options: RestOptions) {
		this.config = utils.merge({
			port: null,
			listeningPaths: {}
		}, {...options});

		this.initialize();
	}

	private initialize() {
		this.expressServer = express();

		this.config.listeningPaths?.get?.forEach(listeningPath => {
			console.log("Adding " + listeningPath)

			this.expressServer!.get(listeningPath, (request, response) => {
				console.log("REQ");
				response.send("Hello");
			});
		});
	}

	public start() {
		if (this.started) {
			throw new Error("The server has already been started");
		}

		console.log("Listing on " + this.config.port)
		this.expressServer!.listen(this.config.port);
	}
}
