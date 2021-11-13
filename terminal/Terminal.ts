class Terminal {
	/**
	 * Log a message into the console
	 * @param text Text to log
	 */
	public static log(text: string | number) {
		console.log(" [ INFO ] " + text);
	}
}

const log = Terminal.log;
export {
	log,
	Terminal
}