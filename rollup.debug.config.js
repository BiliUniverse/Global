import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";

export default [
	{
		input: 'src/BiliBili.Global.request.beta.js',
		output: {
			file: 'js/BiliBili.Global.request.beta.js',
			format: 'es',
			banner: '/* README: https://github.com/BiliUniverse */',
		},
		plugins: [json(), commonjs()]
	},
	{
		input: 'src/BiliBili.Global.response.beta.js',
		output: {
			file: 'js/BiliBili.Global.response.beta.js',
			format: 'es',
			banner: '/* README: https://github.com/BiliUniverse */',
		},
		plugins: [json(), commonjs()]
	},
	{
		input: 'src/BiliIntl.Global.request.beta.js',
		output: {
			file: 'js/BiliIntl.Global.request.beta.js',
			format: 'es',
			banner: '/* README: https://github.com/BiliUniverse */',
		},
		plugins: [json(), commonjs()]
	},
];
