import express, { Express } from "express";
import { utils } from "../utils/Utils";
import cookieParser from "cookie-parser";

export interface RestOptions {
	port?: number | null;
}

export class Rest {
	private started = false;
	private config: RestOptions;
	private expressServer?: Express;
	private events = {
		invalidGet: [] as ((connection: any) => void)[],
		ready: [] as ((port: RestOptions["port"]) => void)[],
		listenError: [] as ((error: any) => void)[],
	};

	/**
	 * Create a new REST API server
	 * @param options Options for the REST server
	 */
	public constructor(options: RestOptions) {
		this.config = utils.merge(
			{
				port: null,
			},
			{ ...options }
		);

		this.initialize();
	}

	/**
	 * Initialize the Express server
	 */
	private initialize() {
		this.expressServer = express();

		this.expressServer.use(cookieParser());
	}

	/**
	 * Start the REST API server
	 * @returns Promise for when the server is ready
	 */
	public start(): Promise<RestOptions["port"]> {
		return new Promise((resolve, reject) => {
			if (this.started) {
				throw new Error("The server has already been started");
			}

			try {
				this.expressServer!.listen(this.config.port, () => {
					resolve(this.config.port);
					this.events.ready.forEach((event) =>
						event(this.config.port)
					);
				});
			} catch (error: any) {
				let message =
					"An error occurred in Express server listen, " + error;

				reject(message);
				this.events.listenError.forEach((event) => event(message));
			}
		});
	}
}
