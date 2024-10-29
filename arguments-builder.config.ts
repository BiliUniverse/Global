import { defineConfig } from "@iringo/arguments-builder";

export default defineConfig({
	output: {
		surge: {
			path: "./dist/BiliBili.Global.sgmodule",
		},
		loon: {
			path: "./dist/BiliBili.Global.plugin",
		},
		customItems: [
			{
				path: "./dist/BiliBili.Global.stoverride",
				template: "./template/stash.handlebars",
			},
			{
				path: "./dist/BiliBili.Global.yaml",
				template: "./template/egern.handlebars",
			},
			{
				path: "./dist/BiliBili.Global.snippet",
				template: "./template/quantumultx.handlebars",
			},
			{
				path: "./dist/BiliBili.Global.srmodule",
				template: "./template/shadowrocket.handlebars",
			},
		],
		dts: {
			isExported: true,
			path: "./src/types.d.ts",
		},
		boxjsSettings: {
			path: "./template/boxjs.settings.json",
			scope: "@BiliBili.Global.Settings",
		},
	},
	args: [
		{
			key: "Switch",
			name: "总功能开关",
			defaultValue: true,
			type: "boolean",
			description: "是否启用此APP修改",
			exclude: ["surge", "loon"],
		},
		{
			key: "ForceHost",
			name: "强制CDN主机名类型",
			defaultValue: "1",
			type: "number",
			boxJsType: "selects",
			description: "请设置强制返回的CDN主机名类型。",
			options: [
				{
					key: "0",
					label: "IP: 返回远端DNS解析地址（强烈不推荐！严重影响域名分流规则与CDN重定向）",
				},
				{
					key: "1",
					label: "HTTP: 返回HTTP域名（推荐，免去重定向时MitM操作）",
				},
				{
					key: "2",
					label: "HTTPS: 返回HTTPS域名（不推荐，重定向时需对指定域名启用MitM）",
				},
			],
		},
		{
			key: "Locales",
			name: "启用自动识别与分流功能的地区",
			defaultValue: ["CHN", "HKG", "TWN"],
			type: "array",
			boxJsType: "checkboxes",
			description: "请选择启用自动识别与分流功能的地区。",
			options: [
				{
					key: "CHN",
					label: "🇨🇳中国大陆",
				},
				{
					key: "HKG",
					label: "🇭🇰中国香港",
				},
				{
					key: "MAC",
					label: "🇲🇴中国澳门",
				},
				{
					key: "TWN",
					label: "🇹🇼中国台湾",
				},
			],
		},
		{
			key: "Proxies.CHN",
			name: "[🇨🇳中国大陆] 代理策略名称",
			defaultValue: "DIRECT",
			type: "string",
			boxJsType: "text",
			description: "请填写此地区的代理或策略组名称。",
		},
		{
			key: "Proxies.HKG",
			name: "[🇭🇰中国香港] 代理策略名称",
			defaultValue: "🇭🇰香港",
			type: "string",
			boxJsType: "text",
			description: "请填写此地区的代理或策略组名称。",
		},
		{
			key: "Proxies.MAC",
			name: "[🇲🇴中国澳门] 代理策略名称",
			defaultValue: "🇲🇴澳门",
			type: "string",
			boxJsType: "text",
			description: "请填写此地区的代理或策略组名称。",
		},
		{
			key: "Proxies.TWN",
			name: "[🇹🇼中国台湾] 代理策略名称",
			defaultValue: "🇹🇼台湾",
			type: "string",
			boxJsType: "text",
			description: "请填写此地区的代理或策略组名称。",
		},
	],
});
