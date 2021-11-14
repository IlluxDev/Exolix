import { Rest } from "./rest/Rest";
import { terminal } from "./terminal/Terminal";

(async () => {
	terminal.log("Hello");
	terminal.error("This is an error");
	terminal.warning("This is a warn");
	terminal.success("Success");

	const rest = new Rest({
		port: 8080,
	});

	await terminal
		.read("Whats your name", (ans) => (ans == "bean" ? false : true))
		.then((name) => {
			terminal.log("Hello, " + name + "!");
		});

	let list = ["Walk the dog"];

	function buildList(): string {
		let opt = "";
		list.forEach((it) => {
			opt += "<p>" + it + "</p>";
		});

		return opt;
	}

	rest.onRequest("get", "/", (conn) => {
		console.log("New request");
		conn.setCookie("beam", "true");
		console.log(conn.getCookie("beam"));
		conn.write(
			"<h1>Welcome to this website</h1>" +
				'<form method="GET" action="/">' +
				'<input name="name" placeholder="Name" />' +
				buildList() +
				"<button>Submit</button>" +
				"</form>" +
				"<p>Footer | Powered by Exolix REST Api</p>"
		);
	});

	rest.onRequest(
		"get",
		"/",
		(conn) => {
			
		},
		{
			uwu: "yes",
			lastName: "noname",
		}
	);

	rest.start().then((port) => {
		terminal.log("Server running at " + port);
	});
})();
