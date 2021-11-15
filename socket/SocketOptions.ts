export interface SocketOptions {
	port?: number | null;
	host?: string;
	ssl?:
		| {
				certificate: string;
				key?: string;
		  }
		| false;
	connectionLimit?: number;
}
