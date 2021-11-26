export interface CommandRegistryItem {
	commandName: string;
	listener: (args: string[], flags: {[index: string]: string}) => void;
	flags: {
		[index: string]: {
			type: "string"
				| "number"
				| "boolean";
			description: string;
		}
	};
	requiredFlags?: string[];
}