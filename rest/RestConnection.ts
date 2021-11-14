import { Request, Response } from "express";

export class RestConnection {
	private expressData: { request: Request, response: Response };

	public constructor(request: Request, response: Response) {
		this.expressData = {request, response};
	}

	public getExpressResponse(): Response {
		return this.expressData.response;
	}

	public getExpressRequest(): Request {
		return this.expressData.request;
	}
}