export interface RestOptions {
	port: number;
}

export class Rest {
	private started = false;
	private config: RestOptions;

	constructor(options: RestOptions) {
		this.config = options;
	}
}
