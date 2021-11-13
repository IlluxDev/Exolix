import { Rest } from "./rest/Rest";
import { terminal } from "./terminal/Terminal";

terminal.log("Hello");
terminal.error("This is an error");
terminal.warning("This is a warn");
terminal.success("Success");

const rest = new Rest({
	port: 8080,
	listeningPaths: {
		get: ["/test"]
	}
});

rest.start();
