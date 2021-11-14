import express, { Express, Request, Response } from "express";
import deepmerge from "deepmerge";
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
	private requestListeners = {
		get: [] as string[],
		post: [] as string[]
	};

	/**
	 * Create a new REST API server
	 * @param options Options for the REST server
	 */
	public constructor(options: RestOptions) {
		this.config = deepmerge(
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

		this.addRequestListener("get", "/", (req, res) => {
			console.log("INTERNAL GET");
			res.send("2 not");
		});

		this.addRequestListener("get", "/", (req, res) => {
			console.log("INTERNAL GET 2");
			res.send("2 yes");
		});
	}

	/**
	 * Add an event listener if possible
	 * @param type Type of request to listen for
	 * @param requestPath Path for the request
	 * @param listener Callback for when request is called
	 * @returns void
	 */
	private addRequestListener(type: "get" | "post", requestPath: string, listener: (request: Request, response: Response) => void) {
		const checkExists = (checkPath: string, listeners: string[]): boolean => {
			return listeners.includes(checkPath);
		}
		
		if (type == "get") {
			this.requestListeners.get.forEach(element => {
				let exists = false;

				if (checkExists(element, this.requestListeners.get)) {
					exists = true;
				}

				console.log("PASSED? " + exists);
				if (!exists) {
					console.log("PASSED")
					this.requestListeners.get.push(requestPath);
	
					this.expressServer?.get(requestPath, listener);
				}
			});

			if (this.requestListeners.get.length == 0) {
				this.requestListeners.get.push(requestPath);
	
				this.expressServer?.get(requestPath, listener);
			}
			return;
		}

		this.requestListeners.post.forEach(element => {
			let exists = false;

			if (checkExists(element, this.requestListeners.post)) {
				exists = true;
			}

			if (!exists) {
				this.requestListeners.post.push(requestPath);

				this.expressServer?.post(requestPath, listener);
			}
		});

		if (this.requestListeners.post.length == 0) {
			this.requestListeners.post.push(requestPath);

			this.expressServer?.post(requestPath, listener);
		}
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
