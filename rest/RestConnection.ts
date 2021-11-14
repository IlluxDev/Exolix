import { Request, Response } from "express";

export class RestConnection {
	private expressData: { request: Request, response: Response };
	private responseWritten = false;

	public constructor(request: Request, response: Response) {
		this.expressData = {request, response};
	}

	public getExpressResponse(): Response {
		return this.expressData.response;
	}

	public getExpressRequest(): Request {
		return this.expressData.request;
	}

	public write(data: string) {
		if (this.responseWritten) {
			throw new Error("The response has already been written");
		}

		this.expressData.response.send(data);
		this.responseWritten = true;
	}
}