import { $platform, _, Storage, fetch, notification, log, logError, wait, done, getScript, runScript } from "./utils/utils.mjs";
import GRPC from "./utils/GRPC.mjs";
import Database from "./database/BiliBili.mjs";
import setENV from "./function/setENV.mjs";
import { WireType, UnknownFieldHandler, reflectionMergePartial, MESSAGE_TYPE, MessageType, BinaryReader, isJsonObject, typeofJsonValue, jsonWriteOptions } from "@protobuf-ts/runtime";
import { ViewReq } from "./protobuf/bilibili/app/viewunite/v1/viewunite.js";
import { PlayViewUniteReq } from "./protobuf/bilibili/app/playerunite/v1/playerunite.js";
import { PlayViewReq } from "./protobuf/bilibili/pgc/gateway/player/v2/playurl.js";
import { SearchAllRequest, SearchByTypeRequest } from "./protobuf/bilibili/polymer/app/search/v1/search.js";
log("v0.8.2(1011)");
// 构造回复数据
let $response = undefined;
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
log(`⚠ url: ${url.toJSON()}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = url.hostname, PATH = url.pathname, PATHs = url.pathname.split("/").filter(Boolean);
log(`⚠ METHOD: ${METHOD}, HOST: ${HOST}, PATH: ${PATH}` , "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
log(`⚠ FORMAT: ${FORMAT}`, "");
!(async () => {
	// 读取设置
	const { Settings, Caches, Configs } = setENV("BiliBili", "Global", Database);
	log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			// 创建空数据
			let body = { "code": 0, "message": "0", "data": {} };
			// 信息组
			let infoGroup = {
				"seasonTitle": url.searchParams.get("season_title"),
				"seasonId": parseInt(url.searchParams.get("season_id"), 10) || undefined,
				"epId": parseInt(url.searchParams.get("ep_id"), 10) || undefined,
				"mId": parseInt(url.searchParams.get("mid") || url.searchParams.get("vmid"), 10) || undefined,
				"evaluate": undefined,
				"keyword": url.searchParams.get("keyword"),
				"locale": url.searchParams.get("locale"),
				"locales": [],
				"type": "UGC"
			};
			// 方法判断
			switch (METHOD) {
				case "POST":
				case "PUT":
				case "PATCH":
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
						case "application/octet-stream":
							//log(`🚧 $request.body: ${JSON.stringify($request.body)}`, "");
							let rawBody = ($platform === "Quantumult X") ? new Uint8Array($request.bodyBytes ?? []) : $request.body ?? new Uint8Array();
							//log(`🚧 isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`, "");
							switch (FORMAT) {
								case "application/protobuf":
								case "application/x-protobuf":
								case "application/vnd.google.protobuf":
									break;
								case "application/grpc":
								case "application/grpc+proto":
									rawBody = GRPC.decode(rawBody);
									// 解析链接并处理protobuf数据
									// 主机判断
									switch (HOST) {
										case "grpc.biliapi.net": // HTTP/2
										case "app.bilibili.com": // HTTP/1.1
											switch (PATHs?.[0]) {
												case "bilibili.app.viewunite.v1.View":
													switch(PATHs?.[1]) {
														case "View": // 播放页
															body = ViewReq.fromBinary(rawBody);
															rawBody = ViewReq.toBinary(body);
															// 判断线路
															infoGroup.seasonId = parseInt(body?.extraContent?.season_id, 10) || infoGroup.seasonId;
															infoGroup.epId = parseInt(body?.extraContent.ep_id, 10) || infoGroup.epId;
															if (infoGroup.seasonId || infoGroup.epId) infoGroup.type = "PGC";
															if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
															else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
															break;
														};
														break;
												case "bilibili.app.playerunite.v1.Player":
													switch (PATHs?.[1]) {
														case "PlayViewUnite": // 播放地址
															body = PlayViewUniteReq.fromBinary(rawBody);
															body.vod.forceHost = Settings?.ForceHost ?? 1;
															rawBody = PlayViewUniteReq.toBinary(body);
															// 判断线路
															infoGroup.seasonId = parseInt(body?.extraContent?.season_id, 10) || infoGroup.seasonId;
															infoGroup.epId = parseInt(body?.extraContent.ep_id, 10) || infoGroup.epId;
															if (infoGroup.seasonId || infoGroup.epId) infoGroup.type = "PGC";
															if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
															else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
															break;
													};
													break;
												case "bilibili.app.playurl.v1.PlayURL": // 普通视频
													switch (PATHs?.[1]) {
														case "PlayView": // 播放地址
															break;
														case "PlayConf": // 播放配置
															break;
													};
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
															infoGroup.type = "PGC";
															if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
															else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
															break;
														case "PlayConf": // 播放配置
															break;
													};
													break;
												case "bilibili.app.nativeact.v1.NativeAct": // 活动-节目、动画、韩综（港澳台）
													switch (PATHs?.[1]) {
														case "Index": // 首页
															break;
													};
													break;
												case "bilibili.app.interface.v1.Search": // 搜索框
													switch (PATHs?.[1]) {
														case "Suggest3": // 搜索建议
															break;
													};
													break;
												case "bilibili.polymer.app.search.v1.Search": // 搜索结果
													switch (PATHs?.[1]) {
														case "SearchAll": // 全部结果（综合）
															body = SearchAllRequest.fromBinary(rawBody);
															({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(body?.keyword));
															body.keyword = infoGroup.keyword;
															rawBody = SearchAllRequest.toBinary(body);
															break;
														case "SearchByType": { // 分类结果（番剧、用户、影视、专栏）
															body = SearchByTypeRequest.fromBinary(rawBody);
															({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(body?.keyword));
															body.keyword = infoGroup.keyword;
															rawBody = SearchByTypeRequest.toBinary(body);
															break;
														};
													};
													break;
											};
											break;
									};
									rawBody = GRPC.encode(rawBody);
									break;
							};
							// 写入二进制数据
							$request.body = rawBody;
							break;
					};
					//break; // 不中断，继续处理URL
				case "GET":
				case "HEAD":
				case "OPTIONS":
				default:
					// 主机判断
					switch (HOST) {
						case "www.bilibili.com":
							switch (PATHs?.[0]) {
								case "bangumi": // 番剧-web
									switch (PATHs?.[1]) {
										case "play": // 番剧-播放页-web
											const URLRegex = /ss(?<seasonId>[0-9]+)|ep(?<epId>[0-9]+)/;
											({ seasonId: infoGroup.seasonId, epId: infoGroup.epId } = PATHs?.[2].match(URLRegex)?.groups);
											infoGroup.seasonId = parseInt(infoGroup.seasonId, 10) || infoGroup.seasonId;
											infoGroup.epId = parseInt(infoGroup.epId, 10) || infoGroup.epId;
											if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
											else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
											break;
									};
									break;
							};
							break;
						case "search.bilibili.com":
							switch (PATH) {
								case "/all": // 搜索-全部结果-web（综合）
									({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup.keyword));
									url.searchParams.set("keyword", infoGroup.keyword);
									break;
							};
							break;
						case "app.bilibili.com":
						case "app.biliapi.net":
							// 路径判断
							switch (PATH) {
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
									switch (infoGroup.mId) {
										case 928123: // 哔哩哔哩番剧
										case 15773384: // 哔哩哔哩电影
										default:
											infoGroup.locales = ["CHN"];
											break;
										case 11783021: // 哔哩哔哩番剧出差
										case 1988098633: // b站_戲劇咖
										case 2042149112: // b站_綜藝咖
											infoGroup.locales = Settings.Locales.filter(locale => locale !== "CHN");
											break;
									};
									break;
							};
							break;
						case "api.bilibili.com":
						case "api.biliapi.net":
							switch (PATH) {
								case "/pgc/player/api/playurl": // 番剧-播放地址-api
								case "/pgc/player/web/playurl": // 番剧-播放地址-web
								case "/pgc/player/web/v2/playurl": // 番剧-播放地址-web-v2
								case "/pgc/player/web/playurl/html5": // 番剧-播放地址-web-HTML5
									infoGroup.type = "PGC";
									if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
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
									switch (infoGroup.mId) {
										case 928123: // 哔哩哔哩番剧
										case 15773384: // 哔哩哔哩电影
										default:
											infoGroup.locales = ["CHN"];
											break;
										case 11783021: // 哔哩哔哩番剧出差
										case 1988098633: // b站_戲劇咖
										case 2042149112: // b站_綜藝咖
											infoGroup.locales = Settings.Locales.filter(locale => locale !== "CHN");
											break;
									};
									break;
								case "/pgc/view/v2/app/season": // 番剧页面-内容-app
								case "/pgc/view/web/season": // 番剧-内容-web
								case "/pgc/view/pc/season": // 番剧-内容-pc
									infoGroup.type = "PGC";
									if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
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
							};
							break;
						case "api.live.bilibili.com":
							switch (PATH) {
								case "/xlive/app-room/v1/index/getInfoByRoom": // 直播
									break;
							};
							break;
					};
					break;
				case "CONNECT":
				case "TRACE":
					break;
			};
			$request.url = url.toString();
			log(`🚧 信息组, infoGroup: ${JSON.stringify(infoGroup)}`, "");
			// 请求策略
			switch (PATH) {
				case "/bilibili.app.viewunite.v1.View/View": //
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
							log(`⚠ 不是 PGC, 跳过`, "")
							break;
					};
					switch ($platform) { // 直通模式，不处理，否则无法进http-response
						case "Shadowrocket":
						case "Quantumult X":
							delete $request.policy;
							break;
					};
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
							log(`⚠ 不是 PGC, 跳过`, "")
							break;
					};
					break;
			};
			if (!$response) { // 无（构造）回复数据
				switch ($platform) { // 已有指定策略的请求，根据策略fetch
					case "Shadowrocket":
					case "Quantumult X":
						if ($request.policy) $response = await fetch($request);
						break;
				};
			};
			break;
		case false:
			break;
	};
})()
	.catch((e) => logError(e))
	.finally(() => {
		switch ($response) {
			default: // 有构造回复数据，返回构造的回复数据
				if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				switch ($platform) {
					default:
						done({ response: $response });
						break;
					case "Quantumult X":
						if (!$response.status) $response.status = "HTTP/1.1 200 OK";
						delete $response.headers?.["Content-Length"];
						delete $response.headers?.["content-length"];
						delete $response.headers?.["Transfer-Encoding"];
						done($response);
						break;
				};
				break;
			case undefined: // 无构造回复数据，发送修改的请求数据
				done($request);
				break;
		};
	})

/***************** Function *****************/
/**
 * Determine Response Availability
 * @author VirgilClyne
 * @param {Object} response - Original Response Content
 * @return {Boolean} is Available
 */
function isResponseAvailability(response = {}) {
    log(`☑️ Determine Response Availability`, "");
	const FORMAT = (response?.headers?.["Content-Type"] ?? response?.headers?.["content-type"])?.split(";")?.[0];
	log(`🚧 Determine Response Availability`, `FORMAT: ${FORMAT}`, "");
	let isAvailable = true;
	switch (response?.statusCode) {
		case 200:
			switch (FORMAT) {
				case "application/grpc":
				case "application/grpc+proto":
					switch (response?.headers?.["Grpc-Message"] ?? response?.headers?.["grpc-message"]) {
						case "0":
							isAvailable = true;
							break;
						case undefined:
							if (parseInt(response?.headers?.["content-length"] ?? response?.headers?.["Content-Length"]) < 1200) isAvailable = false;
							else isAvailable = true;
							break;
						case "-404":
						default:
							isAvailable = false;
							break;
					};
					break;
				case "text/json":
				case "application/json":
					switch (response?.headers?.["bili-status-code"]) {
						case "0":
						case undefined:
							let data = JSON.parse(response?.body).data;
							switch (response?.headers?.idc) {
								case "sgp001":
								case "sgp002":
									switch (data?.limit) {
										case "":
										case undefined:
											isAvailable = true;
											break;
										default:
											isAvailable = false;
											break;
									};
									break;
								case "shjd":
								case undefined:
								default:
									switch (data?.video_info?.code) {
										case 0:
										default:
											isAvailable = true;
											break;
										case undefined:
											isAvailable = false;
											break;
									};
									switch (data?.dialog?.code) {
										case undefined:
											isAvailable = true;
											break;
										case 6010001:
										default:
											isAvailable = false;
											break;
									};
									break;
							};
							break;
						case "-404": // 啥都木有
						case "-10403":
						case "10015001": // 版权地区受限
						default:
							isAvailable = false;
							break;
					};
					break;
				case "text/html":
					isAvailable = true;
					break;
			};
			break;
		case 403:
		case 404:
		case 415:
		default:
			isAvailable = false;
			break;
	};
	log(`✅ Determine Response Availability`, `isAvailable:${isAvailable}`, "");
    return isAvailable;
};

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
	log(`☑️ availableFetch`, `availableLocales: ${availableLocales}`, "");
	availableLocales = availableLocales.filter(locale => locales.includes(locale));
	let locale = "";
	locale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
	request.policy = proxies[locale];
	log(`✅ availableFetch`, `locale: ${locale}`, "");
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
	log(`☑️ mutiFetch`, `locales: ${locales}`, "");
	let responses = {};
	await Promise.allSettled(locales.map(async locale => {
		request["policy"] = proxies[locale];
		if ($platform === "Quantumult X") request.body = request.bodyBytes;
		responses[locale] = await fetch(request);
	}));
	for (let locale in responses) { if (!isResponseAvailability(responses[locale])) delete responses[locale]; };
	let availableLocales = Object.keys(responses);
	log(`☑️ mutiFetch`, `availableLocales: ${availableLocales}`, "");
	let locale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
	request.policy = proxies[locale];
	let response = responses[locale];
	log(`✅ mutiFetch`, `locale: ${locale}`, "");
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
	log(`⚠ Check Search Keyword`, `Original Keyword: ${keyword}`, "");
	let keywords = keyword?.split(delimiter);
	log(`🚧 Check Search Keyword`, `keywords: ${keywords}`, "");
	let locale = undefined;
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
	};
	log(`🎉 Check Search Keyword`, `Keyword: ${keyword}, Locale: ${locale}`, "");
	return { keyword, locale };
};
