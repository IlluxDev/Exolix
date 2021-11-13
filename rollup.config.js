import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
	input: "Exolix.js",
	output: {
		dir: "dist",
		format: "cjs"
	},
	plugins: [typescript(), commonjs({transformMixedEsModules:true})]
};