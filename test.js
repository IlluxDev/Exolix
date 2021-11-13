"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Terminal_1 = require("./terminal/Terminal");
Terminal_1.terminal.log("Hello");
Terminal_1.terminal.error("This is an error");
Terminal_1.terminal.warning("This is a warn");
Terminal_1.terminal.success("Success");
setInterval(() => { Terminal_1.terminal.warning("Failed to find uwu.js"); }, 1000);
//# sourceMappingURL=test.js.map