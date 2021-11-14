import { Socket } from "./socket/Socket";
import { terminal } from "./terminal/Terminal";

const ws = new Socket({
	port: 3000
});

ws.start().then(port => {
	terminal.success("WS server running at port " + port);
});