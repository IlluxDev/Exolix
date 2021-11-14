import { Rest } from "./rest/Rest";
import { terminal } from "./terminal/Terminal";

terminal.log("Hello");
terminal.error("This is an error");
terminal.warning("This is a warn");
terminal.success("Success");

const rest = new Rest({
	port: 8080,
});

rest.onRequest("get", "/", (conn) => {
	console.log("New request");
	conn.write(
		"<h1>Welcome to this website</h1>"
		+ "<p>Footer | Powered by Exolix REST Api</p>"
	);
});

rest.start().then((port) => {
	terminal.log("Server running at " + port);
});
