import { terminal } from "./terminal/Terminal";
import { Cli } from "./cli/Cli";

terminal.log("Illux Exolix");
terminal.log("Command handler unit");

const application = new Cli();

application.addCommand("greet", {
	name: "string"
}, (args, flags) => {
	console.log(`Hello ${flags.name}`);
}, {
	requiredFlags: [ "name" ]
});

application.execute(application.processSplice(process.argv));