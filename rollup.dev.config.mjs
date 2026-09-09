import { nodeResolve } from "@rollup/plugin-node-resolve";
import pkg from "./package.json" with { type: "json" };
import { configAsset } from "./rollup.config.mjs";

const banner = chunk =>
	`console.log('Date: ${new Date().toLocaleString("zh-CN", { timeZone: "PRC" })}');\nconsole.log('Version: ${process.env.BUILD_VERSION || pkg.version || "dev"}');\nconsole.log('${chunk.fileName}');\nconsole.log('${pkg.displayName} β');\n/* 项目主页：${pkg.homepage} */\n/* Project homepage: ${pkg.homepage} */`;

export default [
	{ input: "./src/request.dev.js", output: { file: "./dist/request.dev.bundle.js", format: "es", banner }, plugins: [nodeResolve(), configAsset(".dev")] },
	{ input: "./src/response.dev.js", output: { file: "./dist/response.dev.bundle.js", format: "es", banner }, plugins: [nodeResolve()] },
];
