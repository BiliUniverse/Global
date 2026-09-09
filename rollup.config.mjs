import { readFile } from "node:fs/promises";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" with { type: "json" };

/**
 * 从同次构建的 JSON 生成非原生 Mock 平台的纯配置响应，不包含页面或存储操作。
 * Emit config-only responses for non-native Mock platforms, without pages or persistence.
 * @param {string} [suffix] 开发版文件后缀 / Development filename suffix.
 * @returns {import("rollup").Plugin} 配置产物插件 / Configuration artifact plugin.
 */
export function configAsset(suffix = "") {
	return {
		name: "boxjs-config",
		async generateBundle() {
			const body = await readFile(`./dist/BiliBili.Global${suffix}.boxjs.json`, "utf8");
			const version = process.env.BUILD_VERSION || pkg.version || "dev";
			const source = `const response = {status: 200, headers: {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-PreferencePanes-Version":${JSON.stringify(version)}}, body: $request.method === "HEAD" ? "" : ${JSON.stringify(body)}};\n$done(typeof $task === "undefined" ? {response} : {...response, status:"HTTP/1.1 200 OK"});\n`;
			this.emitFile({ type: "asset", fileName: `config${suffix}.bundle.js`, source });
		},
	};
}

const banner = chunk =>
	`console.log('Date: ${new Date().toLocaleString("zh-CN", { timeZone: "PRC" })}');\nconsole.log('Version: ${process.env.BUILD_VERSION || pkg.version}');\nconsole.log('${chunk.fileName}');\nconsole.log('${pkg.displayName}');\n/* 项目主页：${pkg.homepage} */\n/* Project homepage: ${pkg.homepage} */`;

export default [
	{ input: "./src/request.js", output: { file: "./dist/request.bundle.js", format: "es", banner }, plugins: [nodeResolve(), terser(), configAsset()] },
	{ input: "./src/response.js", output: { file: "./dist/response.bundle.js", format: "es", banner }, plugins: [nodeResolve(), terser()] },
];
