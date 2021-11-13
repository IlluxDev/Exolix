"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminal = void 0;
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class Terminal {
    /**
     * Log a message into the console
     * @param text Text to log
     */
    log(text) {
        console.log(this.prefix("#888", "INFO", text));
    }
    error(text) {
        console.log(this.prefix("#ff5555", "ERROR", text));
    }
    warning(text) {
        console.log(this.prefix("#ffff55", "WARNING", text));
    }
    success(text) {
        console.log(this.prefix("#50ffab", "SUCCESS", text));
    }
    /**
     * Add a prefix to a message
     * @param color Color for the prefix
     * @param prefix Prefix text
     * @param text Text message
     * @returns Full output
     */
    prefix(color, prefix, text) {
        return chalk_1.default.hex("#777")(` [ ${(0, moment_1.default)(new Date()).format("HH:mm:ss")} ]`) + chalk_1.default.hex(color)(` [ ${prefix} ] `) + text;
    }
}
const terminal = new Terminal();
exports.terminal = terminal;
//# sourceMappingURL=Terminal.js.map