import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";
import terser from '@rollup/plugin-terser';

export default [
	{
		input: 'src/BiliBili.Global.request.js',
		output: {
			file: 'js/BiliBili.Global.request.js',
			format: 'es',
			banner: '/* README: https://github.com/BiliUniverse */',
		},
		plugins: [json(), commonjs(), terser()]
	},
	{
		input: 'src/BiliBili.Global.response.js',
		output: {
			file: 'js/BiliBili.Global.response.js',
			format: 'es',
			banner: '/* README: https://github.com/BiliUniverse */',
		},
		plugins: [json(), commonjs(), terser()]
	},
	/*
	{
		input: 'src/BiliIntl.Global.request.js',
		output: {
			file: 'js/BiliIntl.Global.request.js',
			format: 'es',
		},
		plugins: [json(), commonjs(), terser()]
	},
	*/
];
