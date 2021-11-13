import chalk from "chalk";
import moment from "moment";

class Terminal {
	/**
	 * Log a message into the console
	 * @param text Text to log
	 */
	public log(text: string | number) {
		console.log(this.prefix("#888", "INFO", text));
	}

	/**
	 * Log an error message
	 * @param text Text to log
	 */
	public error(text: string | number) {
		console.log(this.prefix("#ff5555", "ERROR", text));
	}

	/**
	 * Log a warning
	 * @param text Text to log
	 */
	public warning(text: string | number) {
		console.log(this.prefix("#ffff55", "WARNING", text));
	}

	/**
	 * Log a success message
	 * @param text Text to log
	 */
	public success(text: string | number) {
		console.log(this.prefix("#50ffab", "SUCCESS", text));
	}

	/**
	 * Add a prefix to a message
	 * @param color Color for the prefix
	 * @param prefix Prefix text
	 * @param text Text message
	 * @returns Full output
	 */
	private prefix(
		color: string,
		prefix: string,
		text: string | number
	): string {
		return (
			chalk.hex("#777")(` [ ${moment(new Date()).format("HH:mm:ss")} ]`) +
			chalk.hex(color)(` [ ${prefix} ] `) +
			text
		);
	}
}

const terminal = new Terminal();

export { terminal };
