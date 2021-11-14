import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
	input: "Utils.ts",
	output: {
		dir: "dist",
		format: "cjs",
	},
	plugins: [
		typescript({ module: "ESNext" }),
		commonjs({ transformMixedEsModules: true }),
	],
};
