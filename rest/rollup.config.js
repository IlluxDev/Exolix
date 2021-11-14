import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
	input: "Rest.ts",
	output: {
		dir: "dist",
		format: "cjs",
	},
	plugins: [
		typescript({ module: "ESNext" }),
		commonjs({ transformMixedEsModules: true }),
	],
};
