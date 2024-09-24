import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
	{
		input: "src/BiliBili.Global.request.beta.js",
		output: {
			file: "js/BiliBili.Global.request.beta.js",
			format: "es",
			banner: "/* README: https://github.com/BiliUniverse */\nconsole.log('📺 BiliBili: 🌐 Global β Request')",
		},
		plugins: [json(), commonjs(), nodeResolve()]
	},
	{
		input: "src/BiliBili.Global.response.beta.js",
		output: {
			file: "js/BiliBili.Global.response.beta.js",
			format: "es",
			banner: "/* README: https://github.com/BiliUniverse */\nconsole.log('📺 BiliBili: 🌐 Global β Response')",
		},
		plugins: [json(), commonjs(), nodeResolve()]
	},
	{
		input: "src/BiliIntl.Global.request.beta.js",
		output: {
			file: "js/BiliIntl.Global.request.beta.js",
			format: "es",
			banner: "/* README: https://github.com/BiliUniverse */\nconsole.log('📺 BiliIntl: 🌐 Global β Request')",
		},
		plugins: [json(), commonjs(), nodeResolve()]
	},
];
