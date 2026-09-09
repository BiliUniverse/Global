import { PlayViewUniteReq } from "@biliverse/protobuf/bilibili/app/playerunite/v1/playerunite.js";
import { ViewReq } from "@biliverse/protobuf/bilibili/app/viewunite/v1/viewunite.js";
import { PlayViewReq } from "@biliverse/protobuf/bilibili/pgc/gateway/player/v2/playurl.js";
import { SearchAllRequest, SearchByTypeRequest } from "@biliverse/protobuf/bilibili/polymer/app/search/v1/search.js";
import gRPC from "@nsnanocat/grpc";
import { URL } from "@nsnanocat/url";
import { Lodash as _, $app, Console, fetch } from "@nsnanocat/util";
import database from "../function/database.mjs";
import isResponseAvailability from "../function/isResponseAvailability.mjs";
import setENV from "../function/setENV.mjs";
/***************** Processing *****************/
export async function Request($request) {
	let $response;
	// 解构URL
	const url = new URL($request.url);
	Console.info(`url: ${url.toJSON()}`);
	// 获取连接参数
	const PATHs = url.pathname.split("/").filter(Boolean);
	Console.info(`PATHs: ${PATHs}`);
	// 解析格式
	const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
	Console.info(`FORMAT: ${FORMAT}`);
	/**
	 * 设置
	 * @type {{Settings: import('../types').Settings}}
	 */
	const { Settings, Caches, Configs } = setENV("BiliBili", "Global", database);
	Console.logLevel = Settings.LogLevel;
	// 创建空数据
	let body = { code: 0, message: "0", data: {} };
	// 信息组
	const infoGroup = {
		seasonTitle: url.searchParams.get("season_title"),
		seasonId: url.searchParams.get("season_id") || undefined,
		epId: url.searchParams.get("ep_id") || undefined,
		mId: url.searchParams.get("mid") || url.searchParams.get("vmid") || undefined,
		evaluate: undefined,
		keyword: url.searchParams.get("keyword"),
		locale: url.searchParams.get("locale"),
		locales: [],
		type: "UGC",
	};
	// 初步检查信息组
	switch (infoGroup.mId) {
		case undefined:
			break;
		case "928123": // 哔哩哔哩番剧
		case "15773384": // 哔哩哔哩电影
		default:
			infoGroup.type = "PGC";
			infoGroup.locales = ["CHN"];
			break;
		case "11783021": // 哔哩哔哩番剧出差
		case "1988098633": // b站_戲劇咖
		case "2042149112": // b站_綜藝咖
			infoGroup.type = "PGC";
			infoGroup.locales = Settings.Locales.filter(locale => locale !== "CHN");
			break;
	}
	// 方法判断
	switch ($request.method) {
		case "POST":
		case "PUT":
		case "PATCH":
		// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
		case "DELETE":
			// 格式判断
			switch (FORMAT) {
				case undefined: // 视为无body
					break;
				case "application/x-www-form-urlencoded":
				case "text/plain":
				default:
					break;
				case "application/x-mpegURL":
				case "application/x-mpegurl":
				case "application/vnd.apple.mpegurl":
				case "audio/mpegurl":
					break;
				case "text/xml":
				case "text/html":
				case "text/plist":
				case "application/xml":
				case "application/plist":
				case "application/x-plist":
					break;
				case "text/vtt":
				case "application/vtt":
					break;
				case "text/json":
				case "application/json":
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "application/octet-stream": {
					//Console.debug(`$request.body: ${JSON.stringify($request.body)}`);
					let rawBody = $app === "Quantumult X" ? new Uint8Array($request.bodyBytes ?? []) : ($request.body ?? new Uint8Array());
					//Console.debug(`isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`);
					switch (FORMAT) {
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
							break;
						case "application/grpc":
						case "application/grpc+proto":
							rawBody = gRPC.decode(rawBody);
							// 解析链接并处理protobuf数据
							// 主机判断
							switch (url.hostname) {
								case "grpc.biliapi.net": // HTTP/2
								case "app.biliapi.net": // HTTP/1.1
								case "app.bilibili.com": // HTTP/1.1
									switch (PATHs?.[0]) {
										case "bilibili.app.viewunite.v1.View":
											switch (PATHs?.[1]) {
												case "View": // 播放页
													body = ViewReq.fromBinary(rawBody);
													Console.debug(`ViewUniteReq: ${JSON.stringify(body, null, 2)}`);
													body.playerArgs.forceHost = Settings?.ForceHost ?? 1;
													rawBody = ViewReq.toBinary(body);
													// 判断线路
													infoGroup.seasonId = body?.extraContent?.season_id || infoGroup.seasonId;
													infoGroup.epId = body?.extraContent.ep_id || infoGroup.epId;
													if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId);
													else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
													break;
											}
											break;
										case "bilibili.app.playerunite.v1.Player":
											switch (PATHs?.[1]) {
												case "PlayViewUnite": // 播放地址
													body = PlayViewUniteReq.fromBinary(rawBody);
													Console.debug(`body: ${JSON.stringify(body)}`);
													body.vod.forceHost = Settings?.ForceHost ?? 1;
													rawBody = PlayViewUniteReq.toBinary(body);
													// 判断线路
													infoGroup.seasonId = body?.extraContent?.season_id || infoGroup.seasonId;
													infoGroup.epId = body?.extraContent.ep_id || infoGroup.epId;
													if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId);
													else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
													break;
											}
											break;
										case "bilibili.app.playurl.v1.PlayURL": // 普通视频
											switch (PATHs?.[1]) {
												case "PlayView": // 播放地址
													break;
												case "PlayConf": // 播放配置
													break;
											}
											break;
										case "bilibili.pgc.gateway.player.v2.PlayURL": // 番剧
											switch (PATHs?.[1]) {
												case "PlayView": // 播放地址
													body = PlayViewReq.fromBinary(rawBody);
													body.forceHost = Settings?.ForceHost ?? 1;
													rawBody = PlayViewReq.toBinary(body);
													// 判断线路
													infoGroup.seasonId = body?.seasonId;
													infoGroup.epId = body?.epId;
													if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId);
													else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
													break;
												case "PlayConf": // 播放配置
													break;
											}
											break;
										case "bilibili.app.nativeact.v1.NativeAct": // 活动-节目、动画、韩综（港澳台）
											switch (PATHs?.[1]) {
												case "Index": // 首页
													break;
											}
											break;
										case "bilibili.app.interface.v1.Search": // 搜索框
											switch (PATHs?.[1]) {
												case "Suggest3": // 搜索建议
													break;
											}
											break;
										case "bilibili.polymer.app.search.v1.Search": // 搜索结果
											switch (PATHs?.[1]) {
												case "SearchAll": // 全部结果（综合）
													body = SearchAllRequest.fromBinary(rawBody);
													({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(body?.keyword));
													body.keyword = infoGroup.keyword;
													rawBody = SearchAllRequest.toBinary(body);
													break;
												case "SearchByType": {
													// 分类结果（番剧、用户、影视、专栏）
													body = SearchByTypeRequest.fromBinary(rawBody);
													({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(body?.keyword));
													body.keyword = infoGroup.keyword;
													rawBody = SearchByTypeRequest.toBinary(body);
													break;
												}
											}
											break;
									}
									break;
							}
							rawBody = gRPC.encode(rawBody);
							break;
					}
					// 写入二进制数据
					$request.body = rawBody;
					break;
				}
			}
		//break; // 不中断，继续处理URL
		case "GET":
		case "HEAD":
		case "OPTIONS":
		default:
			// 主机判断
			switch (url.hostname) {
				case "www.bilibili.com":
					switch (PATHs?.[0]) {
						case "bangumi": // 番剧-web
							switch (PATHs?.[1]) {
								case "play": {
									// 番剧-播放页-web
									const URLRegex = /ss(?<seasonId>[0-9]+)|ep(?<epId>[0-9]+)/;
									({ seasonId: infoGroup.seasonId, epId: infoGroup.epId } = PATHs?.[2].match(URLRegex)?.groups);
									infoGroup.seasonId = infoGroup.seasonId || infoGroup.seasonId;
									infoGroup.epId = infoGroup.epId || infoGroup.epId;
									if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId);
									else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
									break;
								}
							}
							break;
					}
					break;
				case "search.bilibili.com":
					switch (url.pathname) {
						case "/all": // 搜索-全部结果-web（综合）
							({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup.keyword));
							url.searchParams.set("keyword", infoGroup.keyword);
							break;
					}
					break;
				case "app.bilibili.com":
				case "app.biliapi.net":
					// 路径判断
					switch (url.pathname) {
						case "/x/v2/splash/show": // 开屏页
						case "/x/v2/splash/list": // 开屏页
						case "/x/v2/splash/brand/list": // 开屏页
						case "/x/v2/splash/event/list2": // 开屏页
							break;
						case "/x/v2/feed/index": // 推荐页
							break;
						case "/x/v2/feed/index/story": // 首页短视频流
							break;
						case "/x/v2/search/square": // 搜索页
							break;
						case "/x/v2/search": // 搜索-全部结果-api（综合）
						case "/x/v2/search/type": // 搜索-分类结果-api（番剧、用户、影视、专栏）
							({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup.keyword));
							url.searchParams.set("keyword", infoGroup.keyword);
							break;
						case "/x/v2/space": // 用户空间
							break;
					}
					break;
				case "api.bilibili.com":
				case "api.biliapi.net":
					switch (url.pathname) {
						case "/pgc/player/api/playurl": // 番剧-播放地址-api
						case "/pgc/player/web/playurl": // 番剧-播放地址-web
						case "/pgc/player/web/v2/playurl": // 番剧-播放地址-web-v2
						case "/pgc/player/web/playurl/html5": // 番剧-播放地址-web-HTML5
							if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId);
							else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
							break;
						case "/pgc/page/bangumi": // 追番页
						case "/pgc/page/cinema/tab": // 观影页
							infoGroup.type = "PGC";
							break;
						case "/x/player/wbi/playurl": // UGC-用户生产内容-播放地址
							break;
						case "/x/space/acc/info": // 用户空间-账号信息-pc
						case "/x/space/wbi/acc/info": // 用户空间-账号信息-wbi
							break;
						case "/pgc/view/v2/app/season": // 番剧页面-内容-app
						case "/pgc/view/web/season": // 番剧-内容-web
						case "/pgc/view/pc/season": // 番剧-内容-pc
							if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId);
							else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
							break;
						case "/x/web-interface/search": // 搜索-全部结果-web（综合）
						case "/x/web-interface/search/all/v2": // 搜索-全部结果-web（综合）
						case "/x/web-interface/search/type": // 搜索-分类结果-web（番剧、用户、影视、专栏）
							({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup.keyword));
							url.searchParams.set("keyword", infoGroup.keyword);
							break;
						case "/x/web-interface/wbi/search/all/v2": // 搜索-全部结果-wbi（综合）
						case "/x/web-interface/wbi/search/type": // 搜索-分类结果-wbi（番剧、用户、影视、专栏）
							({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup.keyword, "+"));
							url.searchParams.get("keyword", infoGroup.keyword);
							break;
					}
					break;
				case "api.live.bilibili.com":
					switch (url.pathname) {
						case "/xlive/app-room/v1/index/getInfoByRoom": // 直播
							break;
					}
					break;
			}
			break;
		case "CONNECT":
		case "TRACE":
			break;
	}
	$request.url = url.toString();
	Console.debug(`$request.url: ${$request.url}`);
	// 核查信息组
	if (infoGroup.seasonId || infoGroup.epId) infoGroup.type = "PGC";
	Console.debug(`infoGroup: ${JSON.stringify(infoGroup)}`);
	// 请求策略
	switch (url.pathname) {
		case "/bilibili.app.viewunite.v1.View/View": // 番剧页面-内容-app
			break;
		case "/pgc/view/v2/app/season": // 番剧页面-内容-app
		case "/pgc/view/web/season": // 番剧-内容-web
		case "/pgc/view/pc/season": // 番剧-内容-pc
			switch (infoGroup.type) {
				case "PGC":
					if (infoGroup.locales.length !== 0) $request = await availableFetch($request, Settings.Proxies, Settings.Locales, infoGroup.locales);
					else ({ request: $request } = await mutiFetch($request, Settings.Proxies, Settings.Locales));
					break;
				case "UGC":
				default:
					Console.info("不是 PGC, 跳过");
					break;
			}
			switch ($app) {
				// 直通模式，不处理，否则无法进http-response
				case "Shadowrocket":
				case "Quantumult X":
					$request.policy = undefined;
					break;
			}
			break;
		case "/all": // 搜索-全部结果-html（综合）
		case "/bilibili.polymer.app.search.v1.Search/SearchAll": // 搜索-全部结果-proto（综合）
		case "/bilibili.polymer.app.search.v1.Search/SearchByType": // 搜索-分类结果-proto（番剧、用户、影视、专栏）
		case "/x/web-interface/search": // 搜索-全部结果-web（综合）
		case "/x/web-interface/search/all/v2": // 搜索-全部结果-web（综合）
		case "/x/web-interface/search/type": // 搜索-分类结果-web（番剧、用户、影视、专栏）
		case "/x/web-interface/wbi/search/all/v2": // 搜索-全部结果-wbi（综合）
		case "/x/web-interface/wbi/search/type": // 搜索-分类结果-wbi（番剧、用户、影视、专栏）
		case "/x/v2/search": // 搜索-全部结果-api（综合）
		case "/x/v2/search/type": // 搜索-分类结果-api（番剧、用户、影视、专栏）
			$request.policy = Settings.Proxies[infoGroup.locale];
			break;
		default:
			switch (infoGroup.type) {
				case "PGC":
					if (infoGroup.locales.length !== 0) $request = await availableFetch($request, Settings.Proxies, Settings.Locales, infoGroup.locales);
					else ({ request: $request, response: $response } = await mutiFetch($request, Settings.Proxies, Settings.Locales));
					break;
				case "UGC":
				default:
					Console.info("不是 PGC, 跳过");
					break;
			}
			break;
	}
	switch ($app) {
		// 已有指定策略的请求，根据策略fetch
		case "Shadowrocket":
		case "Quantumult X":
			if ($request.policy && !$response) $response = await fetch($request); // 无（构造）回复数据
			break;
	}
	return { $request, $response };
}

/***************** Function *****************/
/**
 * Fetch
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @param {Object} proxies - Proxies Name
 * @param {Array} locales - Locales Names
 * @param {array} availableLocales - Available Locales @ Caches
 * @return {Promise<request>} modified request
 */
async function availableFetch(request = {}, proxies = {}, locales = [], availableLocales = []) {
	Console.log("☑️ availableFetch", `availableLocales: ${availableLocales}`);
	availableLocales = availableLocales.filter(locale => locales.includes(locale));
	let locale = "";
	locale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
	request.policy = proxies[locale];
	Console.log("✅ availableFetch", `locale: ${locale}`);
	return request;
}
/**
 * mutiFetch
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @param {Object} proxies - Proxies Name
 * @param {Array} locales - Locales Names
 * @return {Promise<{request, response}>} modified { request, response }
 */
async function mutiFetch(request = {}, proxies = {}, locales = []) {
	Console.log("☑️ mutiFetch", `locales: ${locales}`);
	const responses = {};
	await Promise.allSettled(
		locales.map(async locale => {
			request.policy = proxies[locale];
			if ($app === "Quantumult X") request.body = undefined;
			responses[locale] = await fetch(request);
		}),
	);
	for (const locale in responses) {
		if (!isResponseAvailability(responses[locale])) delete responses[locale];
	}
	const availableLocales = Object.keys(responses);
	Console.log("☑️ mutiFetch", `availableLocales: ${availableLocales}`);
	const locale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
	request.policy = proxies[locale];
	const response = responses[locale];
	Console.log("✅ mutiFetch", `locale: ${locale}`);
	return { request, response };
}

/**
 * Check Search Keyword
 * @author VirgilClyne
 * @param {String} keyword - Search Keyword
 * @param {String} delimiter - Keyword Delimiter
 * @return {Object} { keyword, locale }
 */
function checkKeyword(keyword = "", delimiter = " ") {
	Console.log("☑️ Check Search Keyword", `Original Keyword: ${keyword}`);
	const keywords = keyword?.split(delimiter);
	Console.debug("Check Search Keyword", `keywords: ${keywords}`);
	let locale;
	switch ([...keywords].pop()) {
		case "CN":
		case "cn":
		case "CHN":
		case "chn":
		case "中国":
		case "中":
		case "🇨🇳":
			locale = "CHN";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
		case "HK":
		case "hk":
		case "HKG":
		case "hkg":
		case "港":
		case "香港":
		case "🇭🇰":
			locale = "HKG";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
		//case "MO":
		//case "mo":
		//case "MAC":
		//case "mac":
		case "澳":
		case "澳门":
		case "🇲🇴":
			locale = "MAC";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
		case "TW":
		case "tw":
		case "TWN":
		case "台":
		case "台湾":
		case "🇹🇼":
			locale = "TWN";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
		//case "US":
		//case "us":
		case "USA":
		//case "美":
		case "美国":
		case "🇺🇸":
			locale = "USA";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
		case "SG":
		case "sg":
		case "SGP":
		//case "新":
		case "新加坡":
		case "🇸🇬":
			locale = "SGP";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
		case "TH":
		case "th":
		case "THA":
		case "泰":
		case "泰国":
		case "🇹🇭":
			locale = "THA";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
		//case "MY":
		//case "my":
		case "MYS":
		//case "马":
		case "马来西亚":
		case "🇲🇾":
			locale = "MYS";
			keywords.pop();
			keyword = keywords.join(delimiter);
			break;
	}
	Console.log("✅ Check Search Keyword", `Keyword: ${keyword}, Locale: ${locale}`);
	return { keyword, locale };
}
