import yargs from "yargs/yargs";
import { CommandRegistryItem } from "./CommandRegistryItem";
import { CommandItemOptions } from "./CommandItemOptions";
import deepmerge from "deepmerge";
import { CommandUsageError } from "./CommandUsageError";

export class Cli {
	private commandRegistry: CommandRegistryItem[] = [];
	private events = {
		usageError: [] as any[]
	};

	public constructor() {
	}

	public addCommand(commandName: string, flags: CommandRegistryItem["flags"], listener: CommandRegistryItem["listener"], options: CommandItemOptions = {}) {
		const settings = deepmerge<CommandItemOptions>({
			requiredFlags: []
		}, options);

		this.commandRegistry.push({
			commandName,
			flags,
			listener,
			requiredFlags: settings.requiredFlags
		});
	}

	public execute(args: string[]) {
		const parsed = yargs(args).argv as {
			_: string[],
			"$0": string,
			[index: string]: any
		};

		this.commandRegistry.forEach(registryItem => {
			if (registryItem.commandName == args[0]) {
				let containsError = false;
				let invalidFlags = [];
				let missingFlags = [] as string[];

				const separateFlags: () => { [index: string]: any } = () => {
					let result = {} as any;

					for (const item in parsed) {
						if (item != "_" && item != "$0") {
							result[item] = parsed[item];
						}
					}

					return result;
				}

				const commandData = {
					flags: separateFlags(),
					args: parsed._
				};

				for (const inputFlag in commandData.flags) {
					if (!registryItem.flags.hasOwnProperty(inputFlag)) {
						containsError = true;
						invalidFlags.push(inputFlag);
					}
				}

				registryItem.requiredFlags?.forEach(requiredFlag => {
					if (!commandData.flags.hasOwnProperty(requiredFlag)) {
						containsError = true;
						missingFlags.push(requiredFlag);
					}
				});

				if (!containsError) {
					registryItem.listener(commandData.args, commandData.flags);
					return;
				}

				const usageError: CommandUsageError = {
					invalidFlags,
					missingFlags
				};

				this.events.usageError.forEach(listener => {
					listener(usageError);
				});
			}
		});
	}

	public processSplice(processArgv: string[]): string[] {
		return processArgv.splice(2);
	}

	public on(event: "usageError", listener: (errorData: CommandUsageError) => void): void;

	public on(event: any, listener: any) {
		(this.events as any)[event].push(listener);
	}
}