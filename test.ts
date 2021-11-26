import { terminal } from "./terminal/Terminal";
import { Cli } from "./cli/Cli";

terminal.log("Illux Exolix");
terminal.log("Command handler unit");

const application = new Cli();

application.on("usageError", error => {
	if (error.missingFlags?.length != 0) {
		console.log("[ MISSING FLAGS ] " + error.missingFlags?.join(", "));
	}

	if (error.invalidFlags?.length != 0) {
		console.log("[ INVALID FLAGS ] " + error.invalidFlags?.join(", "));
	}
});

application.addCommand("greet", {
	name: {
		type: "string",
		description: "Your first name or full name"
	}
}, (args, flags) => {
	console.log(`Hello ${flags.name}`);
}, {
	requiredFlags: [ "name" ]
});

application.execute(application.processSplice(process.argv));
