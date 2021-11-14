import express, { Express, Request, Response } from "express";
import deepmerge from "deepmerge";
import cookieParser from "cookie-parser";
import { RestConnection } from "./RestConnection";

export interface RestOptions {
	port?: number | null;
}

export class Rest {
	private started = false;
	private config: RestOptions;
	private expressServer?: Express;
	private expressPlugins = [cookieParser(), express.json(), express.urlencoded()] as any[];
	private events = {
		invalidGet: [] as ((connection: RestConnection) => void)[],
		ready: [] as ((port: RestOptions["port"]) => void)[],
		listenError: [] as ((error: any) => void)[],
		get: [] as {
			listener: (connection: RestConnection) => void,
			path: string
		}[],
		post: [] as {
			listener: (connection: RestConnection) => void,
			path: string
		}[]
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

		this.expressPlugins.forEach(plugin => this.expressServer?.use(plugin));
	}

	/**
	 * Get the Express server instance
	 * @returns The Express server instance
	 */
	public getExpressServer(): Express {
		if (this.started) {
			return this.expressServer!;
		}

		throw new Error("The Express server is not alive");
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

	/**
	 * Listen for GET request
	 * @param event Event Name
	 * @param requestPath The URL request path
	 * @param listener Callback listener for when the request is fired
	 */
	public onRequest(event: "get", requestPath: string, listener: (connection: RestConnection) => void): void;

	/**
	 * Listen for POST requests
	 * @param event Event Name
	 * @param requestPath The URL request path
	 * @param listener Callback listener for when the request is fired
	 */
	public onRequest(event: "post", requestPath: string, listener: (connection: RestConnection) => void): void;

	public onRequest(event: string, requestPath: string, listener: any) {
		if (event == "get" || event == "post") {
			this.addRequestListener(event, requestPath, (request, response) => {
				const connection = new RestConnection(request, response);

				this.events[event].forEach(eventListener => {
					if (eventListener.path == requestPath) {
						eventListener.listener(connection);
					}
				});
			});
		}

		(this.events as any)[event].push({
			listener: listener,
			path: requestPath
		});
	}
}
