import { Socket } from "./socket/Socket";
import { terminal } from "./terminal/Terminal";

Error.stackTraceLimit = Infinity;

const ws = new Socket({
	port: 3000
});

ws.on("open", conn => {
	terminal.log("New connection");
});

ws.start().then((port) => {
	terminal.success("WS server running at port " + port);
});
