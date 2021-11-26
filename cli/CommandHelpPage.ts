export interface CommandHelpPage {
	description: string;
	usage: string;
	commandName: string;
	flags: {
		[index: string]: {
			type: string;
			description: string;
		};
	};
}