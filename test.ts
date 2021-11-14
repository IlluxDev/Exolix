import { Rest } from "./rest/Rest";
import { terminal } from "./terminal/Terminal";

terminal.log("Hello");
terminal.error("This is an error");
terminal.warning("This is a warn");
terminal.success("Success");

const rest = new Rest({
	port: 8080,
});

let list = ["Walk the dog"]

function buildList(): string {
	let opt = "";
	list.forEach
}

rest.onRequest("get", "/", (conn) => {
	console.log("New request");
	conn.write(
		"<h1>Welcome to this website</h1>" +
			'<form method="POST" action="/">' +
			'<input name="name" placeholder="Name" />' +
			buildList() +
			"<button>Submit</button>" +
			"</form>" +
			"<p>Footer | Powered by Exolix REST Api</p>"
	);
});

rest.onRequest("post", "/", (conn) => {
	console.log(conn.getExpressRequest().body);
	conn.redirect("/");
});

rest.start().then((port) => {
	terminal.log("Server running at " + port);
});
