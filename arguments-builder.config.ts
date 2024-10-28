import { defineConfig } from "@iringo/arguments-builder";

export default defineConfig({
	output: {
		surge: {
			path: "./dist/Enhanced.sgmodule",
		},
		loon: {
			path: "./dist/Enhanced.plugin",
		},
		customItems: [
			{
				path: "./dist/Enhanced.stoverride",
				template: "./template/stash.handlebars",
			},
			{
				path: "./dist/Enhanced.yaml",
				template: "./template/egern.handlebars",
			},
			{
				path: "./dist/Enhanced.snippet",
				template: "./template/quantumultx.handlebars",
			},
			{
				path: "./dist/Enhanced.srmodule",
				template: "./template/shadowrocket.handlebars",
			},
		],
		dts: {
			isExported: true,
			path: "./src/types.d.ts",
		},
		boxjsSettings: {
			path: "./template/boxjs.settings.json",
			scope: "@BiliBili.Enhanced.Settings",
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
			key: "Home.Tab",
			name: "[首页]标签页",
			defaultValue: ["直播tab", "推荐tab", "hottopic", "bangumi", "anime", "film", "koreavtw"],
			type: "array",
			boxJsType: "checkboxes",
			description: "请选择启用的首页标签页，建议不超过7个。",
			options: [
				{
					key: "直播tab",
					label: "直播",
				},
				{
					key: "推荐tab",
					label: "推荐",
				},
				{
					key: "hottopic",
					label: "热门",
				},
				{
					key: "bangumi",
					label: "番剧",
				},
				{
					key: "anime",
					label: "动画（港澳台）",
				},
				{
					key: "film",
					label: "影视",
				},
				{
					key: "koreavtw",
					label: "韩综（港澳台）",
				},
				{
					key: "game",
					label: "游戏",
				},
				{
					key: "mctab",
					label: "minecraft",
				},
				{
					key: "dhtr",
					label: "动画同人",
				},
				{
					key: "gaoxiao",
					label: "搞笑",
				},
				{
					key: "school",
					label: "校园",
				},
				{
					key: "kj",
					label: "数码",
				},
			],
		},
		{
			key: "Home.Tab_default",
			name: "[首页]默认标签页",
			defaultValue: "推荐tab",
			type: "string",
			boxJsType: "selects",
			description: "请选择启动APP时默认展示的标签页，需选择已启用的标签页。",
			options: [
				{
					key: "直播tab",
					label: "直播",
				},
				{
					key: "推荐tab",
					label: "推荐",
				},
				{
					key: "hottopic",
					label: "热门",
				},
				{
					key: "bangumi",
					label: "番剧",
				},
				{
					key: "anime",
					label: "动画（港澳台）",
				},
				{
					key: "film",
					label: "影视",
				},
				{
					key: "koreavtw",
					label: "韩综（港澳台）",
				},
				{
					key: "game",
					label: "游戏",
				},
				{
					key: "mctab",
					label: "minecraft",
				},
				{
					key: "dhtr",
					label: "动画同人",
				},
				{
					key: "gaoxiao",
					label: "搞笑",
				},
				{
					key: "school",
					label: "校园",
				},
				{
					key: "kj",
					label: "数码",
				},
			],
		},
		{
			key: "Home.Top_left",
			name: "[首页]顶栏（左侧）按钮（用户头像）",
			defaultValue: "mine",
			type: "string",
			boxJsType: "selects",
			description: "请选择顶栏（左侧）按钮（用户头像）的作用（在biliBili粉色版中无法修改）。",
			options: [
				{
					key: "mine",
					label: "用户中心-我的",
				},
				{
					key: "videoshortcut",
					label: "短视频",
				},
			],
		},
		{
			key: "Home.Top",
			name: "[首页]顶栏（右侧）按钮",
			defaultValue: ["消息Top"],
			type: "array",
			boxJsType: "checkboxes",
			description: "请选择启用的顶栏（右侧）按钮。",
			options: [
				{
					key: "游戏中心Top",
					label: "游戏中心",
				},
				{
					key: "会员购Top",
					label: "会员购",
				},
				{
					key: "消息Top",
					label: "消息",
				},
			],
		},
		{
			key: "Bottom",
			name: "[底部]导航栏按钮",
			defaultValue: ["home", "dynamic", "ogv", "会员购Bottom", "我的Bottom"],
			type: "array",
			boxJsType: "checkboxes",
			description: "请选择启用的底部导航栏按钮，最多6个。",
			options: [
				{
					"key": "home",
					"label": "首页"
				},
				{
					"key": "频道Bottom",
					"label": "频道"
				},
				{
					"key": "dynamic",
					"label": "动态"
				},
				{
					"key": "publish",
					"label": "发布"
				},
				{
					"key": "ogv",
					"label": "节目（港澳台）"
				},
				{
					"key": "会员购Bottom",
					"label": "会员购"
				},
				{
					"key": "消息Bottom",
					"label": "消息"
				},
				{
					"key": "我的Bottom",
					"label": "我的"
				}
			],
		},
	],
});
