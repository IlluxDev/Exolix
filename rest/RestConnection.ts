import deepmerge from "deepmerge";
import { Request, Response } from "express";

export class RestConnection<MessageType> {
	private expressData: { request: Request; response: Response };
	private responseWritten = false;
	private dead = false;
	public message: MessageType;

	/**
	 * A wrapper for an Express request and response
	 * @param request Express request
	 * @param response Express response
	 */
	public constructor(
		request: Request,
		response: Response,
		messageBase?: MessageType
	) {
		this.expressData = { request, response };
		this.message = messageBase
			? deepmerge({ ...messageBase }, this.expressData.request.body)
			: this.expressData.request.body;

		this.message = deepmerge(this.message, this.expressData.request.query) as any;
	}

	/**
	 * Get an Express server response
	 * @returns Express response
	 */
	public getExpressResponse(): Response {
		return this.expressData.response;
	}

	/**
	 * Get an Express server request
	 * @returns Express request
	 */
	public getExpressRequest(): Request {
		return this.expressData.request;
	}

	/**
	 * write to the response
	 * @param data Response data
	 */
	public write(data: string) {
		if (this.responseWritten) {
			throw new Error("The response has already been written");
		}

		this.expressData.response.send(data);
		this.responseWritten = true;
	}

	/**
	 * Redirect the request
	 * @param location Redirect location
	 */
	public redirect(location: string) {
		if (this.dead) {
			throw new Error("The connection is not alive");
		}

		this.expressData.response.redirect(location);
		this.dead = true;
	}
}
