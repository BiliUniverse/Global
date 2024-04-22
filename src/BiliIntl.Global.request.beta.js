import _ from './ENV/Lodash.mjs'
import $Storage from './ENV/$Storage.mjs'
import ENV from "./ENV/ENV.mjs";

import Database from "./database/BiliIntl.mjs";
import setENV from "./function/setENV.mjs";

const $ = new ENV("📺 BiliIntl: 🌐 Global v0.6.0(1005) request.beta");

// 构造回复数据
let $response = undefined;

/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
$.log(`⚠ url: ${url.toJSON()}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = url.hostname, PATH = url.pathname, PATHs = url.pathname.split("/").filter(Boolean);
$.log(`⚠ METHOD: ${METHOD}, HOST: ${HOST}, PATH: ${PATH}` , "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ FORMAT: ${FORMAT}`, "");
!(async () => {
	// 读取设置
	const { Settings, Caches, Configs } = setENV("BiliIntl", "Global", Database);
	switch (Settings.Switch) {
		case true:
		default:
			// 创建空数据
			let body = { "code": 0, "message": "0", "data": {} };
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
							//body = M3U8.parse($request.body);
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = M3U8.stringify(body);
							break;
						case "text/xml":
						case "text/html":
						case "text/plist":
						case "application/xml":
						case "application/plist":
						case "application/x-plist":
							//body = XML.parse($request.body);
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = XML.stringify(body);
							break;
						case "text/vtt":
						case "application/vtt":
							//body = VTT.parse($request.body);
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = VTT.stringify(body);
							break;
						case "text/json":
						case "application/json":
							//body = JSON.parse($request.body ?? "{}");
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = JSON.stringify(body);
							break;
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
						case "application/grpc":
						case "application/grpc+proto":
						case "application/octet-stream":
							break;
					};
					break;
				case "GET":
				case "HEAD":
				case "OPTIONS":
				default:
					// 解析链接
					switch (HOST) {
						case "www.bilibili.tv":
							if (PATH.includes("/anime")) { // 番剧-web
								$request.policy = Settings.Proxies["SEA"]; // 默认用SEA
							} else if (PATH.includes("/play/")) { // 番剧-播放页-web
								let epid = url.searchParams.get("ep_id");
								$.log(`🚧 epid: ${epid}`, "");
								if (Caches?.ep?.[epid]) {
									let availableLocales = Caches.ep[epid].filter(locale => Settings?.Locales.includes(locale));
									$.log(`🚧 availableLocales: ${availableLocales}`, "");
									$request.policy = Settings.Proxies[availableLocales[Math.floor(Math.random() * availableLocales.length)]]; // 随机用一个
								} else {
									$request.policy = Settings.Proxies["SEA"]; // 默认用SEA
								};
							};
							break;
						case "api.bilibili.tv":
							switch (PATH) {
								case "/intl/gateway/web/playurl": { // 番剧-播放地址-web
									let epid = url.searchParams.get("ep_id");
									$.log(`🚧 epid: ${epid}`, "");
									if (Caches?.ep?.[epid]) {
										let availableLocales = Caches.ep[epid].filter(locale => Settings?.Locales.includes(locale));
										$.log(`🚧 availableLocales: ${availableLocales}`, "");
										$request.policy = Settings.Proxies[availableLocales[Math.floor(Math.random() * availableLocales.length)]]; // 随机用一个
									} else {
										$request.policy = Settings.Proxies["SEA"]; // 默认用SEA
									};
									break;
								};
							};
							break;
						case "app.biliintl.com": // app
						case "passport.biliintl.com": // 登录
							if (url.searchParams.get("s_locale")) { // 处理系统语言_地区代码
								let s_locale = url.searchParams.get("s_locale").split("_");
								if (s_locale.length === 2) {
									url.searchParams.set("s_locale", `${s_locale[0]}_${"SG"}`);
								};
							};
							if (url.searchParams.get("sim_code")) { // 处理MNC
								url.searchParams.set("sim_code", "");
							};
							$request.url = url.toString();
							$.log(`🚧 cookie: ${JSON.stringify($request.headers?.["cookie"] ?? $request.headers?.["Cookie"])}`, "");
							delete $request.headers["cookie"];
							delete $request.headers["Cookie"];
							switch (HOST) {
								case "app.biliintl.com":
									switch (PATH) {
										case "/intl/gateway/v2/ogv/playurl": { // 番剧-播放地址-ogv
											let epid = url.searchParams.get("ep_id");
											$.log(`🚧 epid: ${epid}`, "");
											if (Caches?.ep?.[epid]) {
												let availableLocales = Caches.ep[epid].filter(locale => Settings?.Locales.includes(locale));
												$.log(`🚧 availableLocales: ${availableLocales}`, "");
												$request.policy = Settings.Proxies[availableLocales[Math.floor(Math.random() * availableLocales.length)]]; // 随机用一个
											} else {
												let responses = await mutiFetch($request, Settings.Proxies, Settings.Locales.filter(locale => locale !== "CHN")); // 国际版不含中国大陆
												let availableLocales = checkLocales(responses);
												$response = responses[availableLocales[Math.floor(Math.random() * availableLocales.length)]]; // 随机用一个
											};
											break;
										};
										case "/intl/gateway/v2/app/search/v2": // 搜索-全部结果-app
										case "/intl/gateway/v2/app/search/type": // 搜索-分类结果-app
											let { keyword, locale } = checkKeyword(url.searchParams.get("keyword"));
											url.searchParams.set("keyword", keyword);
											$request.url = url.toString();
											$request.policy = Settings.Proxies[locale];
											break;
										case "/intl/gateway/v2/ogv/view/app/season2": // 番剧-详情页-app
											let responses = await mutiFetch($request, Settings.Proxies, Settings.Locales.filter(locale => locale !== "CHN")); // 国际版不含中国大陆
											let availableLocales = checkLocales(responses);
											$response = responses[availableLocales[Math.floor(Math.random() * availableLocales.length)]]; // 随机用一个
											let epid = url.searchParams.get("ep_id");
											if (epid) {
												$.log(`🚧 epid: ${epid}`, "");
												let newCaches = Caches;
												if (!newCaches?.ep) newCaches.ep = {};
												newCaches.ep[epid] = availableLocales;
												$.log(`newCaches = ${JSON.stringify(newCaches)}`);
												let isSave = $Storage.setItem("@BiliBili.Global.Caches", newCaches);
												$.log(`$Storage.setItem ? ${isSave}`);
											}
											break;
									};
									break;
								case "passport.biliintl.com": // 登录
									break;
							};
							break;
					};
					break;
				case "CONNECT":
				case "TRACE":
					break;
			};
			url.searchParams.set("type", infoGroup.type);
			$request.url = url.toString();
			$.log(`🚧 调试信息`, `$request.url: ${$request.url}`, "");
			break;
		case false:
			$.log(`⚠ 功能关闭`, "");
			break;
	};
})()
.catch((e) => $.logErr(e))
.finally(() => {
	switch ($response) {
		default: // 有构造回复数据，返回构造的回复数据
			//$.log(`🚧 finally`, `echo $response: ${JSON.stringify($response, null, 2)}`, "");
			if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
			if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
			if ($.isQuanX()) {
				if (!$response.status) $response.status = "HTTP/1.1 200 OK";
				delete $response.headers?.["Content-Length"];
				delete $response.headers?.["content-length"];
				delete $response.headers?.["Transfer-Encoding"];
				$.done($response);
			} else $.done({ response: $response });
			break;
		case undefined: // 无构造回复数据，发送修改的请求数据
			//$.log(`🚧 finally`, `$request: ${JSON.stringify($request, null, 2)}`, "");
			$.done($request);
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
    $.log(`☑️ Determine Response Availability`, "");
	$.log(`statusCode: ${response.statusCode}`, `headers: ${JSON.stringify(response.headers)}`, "");
	const FORMAT = (response?.headers?.["Content-Type"] ?? response?.headers?.["content-type"])?.split(";")?.[0];
	$.log(`🚧 Determine Response Availability`, `FORMAT: ${FORMAT}`, "");
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
	$.log(`✅ Determine Response Availability`, `isAvailable:${isAvailable}`, "");
    return isAvailable;
};

/**
 * mutiFetch
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @param {Object} proxies - Proxies Name
 * @param {Array} locales - Locales Names
 * @return {Promise<{request, response}>} modified { request, response }
 */
async function mutiFetch(request = {}, proxies = {}, locales = []) {
	$.log(`☑️ mutiFetch`, `locales: $: {locales}`, "");
	let responses = {};
	await Promise.allSettled(locales.map(async locale => { responses[locale] = await $.fetch(request, { "policy": proxies[locale] }) }));
	for (let locale in responses) { if (!isResponseAvailability(responses[locale])) delete responses[locale]; };
	let availableLocales = Object.keys(responses);
	$.log(`☑️ mutiFetch`, `availableLocales: ${availableLocales}`, "");
	let locale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
	request.policy = proxies[locale];
	let response = responses[locale];
	$.log(`✅ mutiFetch`, `locale: ${locale}`, "");
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
	$.log(`⚠ Check Search Keyword`, `Original Keyword: ${keyword}`, "");
	let keywords = keyword?.split(delimiter);
	$.log(`🚧 Check Search Keyword`, `keywords: ${keywords}`, "");
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
	$.log(`🎉 Check Search Keyword`, `Keyword: ${keyword}, Locale: ${locale}`, "");
	return { keyword, locale };
};
