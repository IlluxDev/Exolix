export interface CommandHelpPage {
	description: string;
	usage: string;
	commandName: string;
	flags: {
		[index: string]: string;
	};
}