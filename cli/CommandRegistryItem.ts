export interface CommandRegistryItem {
	commandName: string;
	listener: (args: string[], flags: {[index: string]: string}) => void;
	flags: {
		[index: string]: "string"
		| "number"
		| "boolean"
	};
	requiredFlags?: string[];
}