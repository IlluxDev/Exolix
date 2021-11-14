import { exec } from "child_process";

const fs = require("fs");
const path = require("path");
const { terminal } = require("./terminal/Terminal");

const config = {
	excludeDirs: [".git", "node_modules", "docs"],
	currentDir: path.join(__dirname, "./"),
};

fs.readdir(
	config.currentDir,
	{ withFileTypes: true },
	(error: any, files: any) => {
		files = files.filter((file: any) =>
			fs.statSync(path.join(config.currentDir, file.name)).isDirectory()
		);
		let filesTemp = [] as any[];

		files.forEach((file: any) => {
			if (!config.excludeDirs.includes(file.name)) {
				filesTemp.push(file.name);
			}
		});

		files = filesTemp;
		terminal.log("The following projects will be published:");
		files.forEach((file: any) => terminal.log(" - " + file));

		files.forEach((file: string) => {
			process.chdir(path.join(config.currentDir, file));
			const proc = exec(
				"npm i | npx rollup -c | npm publish --access public"
			);

			proc.stdout?.on("data", (data) =>
				terminal.log("[ " + file + " ] >_" + data.replace("\n", ""))
			);
			proc.stderr?.on("data", (data) =>
				terminal.log("[ " + file + " ] >_" + data.replace("\n", ""))
			);
		});
	}
);
