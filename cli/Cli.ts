import yargs from "yargs";
import { CommandRegistryItem } from "./CommandRegistryItem";
import { CommandItemOptions } from "./CommandItemOptions";
import deepmerge from "deepmerge";
import { CommandUsageError } from "./CommandUsageError";
import { CommandHelpPage } from "./CommandHelpPage";

export class Cli {
	private helpList: CommandHelpPage[] = [];
	private commandRegistry: CommandRegistryItem[] = [];
	private helpMeta = {
		renderer: this.renderHelpPage as any
	};
	private events = {
		usageError: [] as any[]
	};

	public constructor() {
		this.addCommand("help", {}, (args) => {
			if (args.length == 0) {
				this.helpMeta.renderer(this.helpList);
				return;
			}

			this.helpMeta.renderer(this.helpList, args[1]);
		});
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

		this.helpList.push({
			commandName,
			flags: flags,
			description: settings.description ?? "No description",
			usage: settings.usage ?? `${commandName} [args/options]`
		});
	}

	public renderHelpPage(helpList: CommandHelpPage[], commandName?: string) {
		if (!commandName) {
			console.log("--- Help ------------");
			helpList.forEach(helpPage => {
				console.log(" " + helpPage.usage + " - " + helpPage.description);
			});
			return;
		}

		helpList.forEach(helpPage => {
			if (helpPage.commandName == commandName) {
				console.log("--- Help ------------");
				console.log(` Showing help for command: "${commandName}"`);
				console.log(" Description: " + helpPage.description);
				console.log(" Usage: " + helpPage.usage);

				console.log(" Options:");

				for (const flag in helpPage.flags) {
					console.log("  --" + flag);
				}
			}
		});
	}

	public useCustomHelperRenderer(renderer: (helpList: CommandHelpPage[], commandName?: string) => void) {
		this.helpMeta.renderer = renderer;
	}

	public execute(args: string[]) {
		const parsed = yargs
			.help(false)
			.parse(args) as {
			_: string[],
			"$0": string,
			[index: string]: any
		};

		let commandMatched = false;

		this.commandRegistry.forEach(registryItem => {
			if (registryItem.commandName == args[0]) {
				commandMatched = true;
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

		if (!commandMatched) {
			this.helpMeta.renderer(this.helpList);
		}
	}

	public processSplice(processArgv: string[]): string[] {
		return processArgv.splice(2);
	}

	public on(event: "usageError", listener: (errorData: CommandUsageError) => void): void;

	public on(event: any, listener: any) {
		(this.events as any)[event].push(listener);
	}
}