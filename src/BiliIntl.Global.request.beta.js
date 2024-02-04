import ENVs from "./ENV/ENV.mjs";
import URIs from "./URI/URI.mjs";

import Database from "./database/BiliIntl.mjs";
import setENV from "./function/setENV.mjs";

const $ = new ENVs("📺 BiliIntl: 🌐 Global v0.4.0(1) request.beta");
const URI = new URIs();

// 构造回复数据
let $response = undefined;

/***************** Processing *****************/
// 解构URL
const URL = URI.parse($request.url);
$.log(`⚠ ${$.name}`, `URL: ${JSON.stringify(URL)}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = URL.host, PATH = URL.path, PATHs = URL.paths;
$.log(`⚠ ${$.name}`, `METHOD: ${METHOD}`, "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ ${$.name}`, `FORMAT: ${FORMAT}`, "");
(async () => {
	// 读取设置
	const { Settings, Caches, Configs } = setENV($, "BiliIntl", "Global", Database);
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
						case "text/html":
						default:
							break;
						case "application/x-mpegURL":
						case "application/x-mpegurl":
						case "application/vnd.apple.mpegurl":
						case "audio/mpegurl":
							//body = M3U8.parse($request.body);
							//$.log(`🚧 ${$.name}`, `body: ${JSON.stringify(body)}`, "");
							//$request.body = M3U8.stringify(body);
							break;
						case "text/xml":
						case "text/plist":
						case "application/xml":
						case "application/plist":
						case "application/x-plist":
							//body = XML.parse($request.body);
							//$.log(`🚧 ${$.name}`, `body: ${JSON.stringify(body)}`, "");
							//$request.body = XML.stringify(body);
							break;
						case "text/vtt":
						case "application/vtt":
							//body = VTT.parse($request.body);
							//$.log(`🚧 ${$.name}`, `body: ${JSON.stringify(body)}`, "");
							//$request.body = VTT.stringify(body);
							break;
						case "text/json":
						case "application/json":
							//body = JSON.parse($request.body ?? "{}");
							//$.log(`🚧 ${$.name}`, `body: ${JSON.stringify(body)}`, "");
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
				case undefined: // QX牛逼，script-echo-response不返回method
				default:
					// 解析链接
					switch (HOST) {
						case "www.bilibili.tv":
							if (PATH.includes("/anime")) { // 番剧-web
								$request = ReReqeust($request, Settings.Proxies["SEA"]); // 默认用SEA
							} else if (PATH.includes("/play/")) { // 番剧-播放页-web
								let epid = URL.query?.ep_id;
								$.log(`🚧 ${$.name}`, `epid: ${epid}`, "");
								if (Caches?.ep?.[epid]) {
									let availableLocales = Caches.ep[epid].filter(locale => Settings?.Locales.includes(locale));
									$.log(`🚧 ${$.name}`, `availableLocales: ${availableLocales}`, "");
									$request = ReReqeust($request, Settings.Proxies[availableLocales[Math.floor(Math.random() * availableLocales.length)]]); // 随机用一个
								} else {
									$request = ReReqeust($request, Settings.Proxies["SEA"]); // 默认用SEA
								};
							};
							break;
						case "api.bilibili.tv":
							switch (PATH) {
								case "intl/gateway/web/playurl": { // 番剧-播放地址-web
									let epid = URL.query?.ep_id;
									$.log(`🚧 ${$.name}`, `epid: ${epid}`, "");
									if (Caches?.ep?.[epid]) {
										let availableLocales = Caches.ep[epid].filter(locale => Settings?.Locales.includes(locale));
										$.log(`🚧 ${$.name}`, `availableLocales: ${availableLocales}`, "");
										$request = ReReqeust($request, Settings.Proxies[availableLocales[Math.floor(Math.random() * availableLocales.length)]]); // 随机用一个
									} else {
										$request = ReReqeust($request, Settings.Proxies["SEA"]); // 默认用SEA
									};
									break;
								};
							};
							break;
						case "app.biliintl.com": // app
						case "passport.biliintl.com": // 登录
							if (URL.query?.s_locale) { // 处理系统语言_地区代码
								let s_locale = URL.query.s_locale.split("_");
								if (s_locale.length === 2) {
									URL.query.s_locale = `${s_locale[0]}_${"SG"}`;
								};
							};
							if (URL.query?.sim_code) { // 处理MNC
								URL.query.sim_code = "";
							};
							$request.url = URI.stringify(URL);
							$.log(`🚧 ${$.name}`, `cookie: ${JSON.stringify($request.headers?.["cookie"] ?? $request.headers?.["Cookie"])}`, "");
							delete $request.headers["cookie"];
							delete $request.headers["Cookie"];
							switch (HOST) {
								case "app.biliintl.com":
									switch (PATH) {
										case "intl/gateway/v2/ogv/playurl": { // 番剧-播放地址-ogv
											let epid = URL.query?.ep_id;
											$.log(`🚧 ${$.name}`, `epid: ${epid}`, "");
											if (Caches?.ep?.[epid]) {
												let availableLocales = Caches.ep[epid].filter(locale => Settings?.Locales.includes(locale));
												$.log(`🚧 ${$.name}`, `availableLocales: ${availableLocales}`, "");
												$request = ReReqeust($request, Settings.Proxies[availableLocales[Math.floor(Math.random() * availableLocales.length)]]); // 随机用一个
											} else {
												let responses = await mutiFetch($request, Settings.Proxies, Settings.Locales.filter(locale => locale !== "CHN")); // 国际版不含中国大陆
												let availableLocales = checkLocales(responses);
												$response = responses[availableLocales[Math.floor(Math.random() * availableLocales.length)]]; // 随机用一个
											};
											break;
										};
										case "intl/gateway/v2/app/search/v2": // 搜索-全部结果-app
										case "intl/gateway/v2/app/search/type": // 搜索-分类结果-app
											let { keyword, locale } = checkKeyword(decodeURIComponent(URL.query?.keyword));
											URL.query.keyword = encodeURIComponent(keyword);
											$request.url = URI.stringify(url);
											$request = ReReqeust($request, Settings.Proxies[locale]);
											break;
										case "intl/gateway/v2/ogv/view/app/season2": // 番剧-详情页-app
											let responses = await mutiFetch($request, Settings.Proxies, Settings.Locales.filter(locale => locale !== "CHN")); // 国际版不含中国大陆
											let availableLocales = checkLocales(responses);
											$response = responses[availableLocales[Math.floor(Math.random() * availableLocales.length)]]; // 随机用一个
											let epid = URL.query?.ep_id;
											if (epid) {
												$.log(`🚧 ${$.name}`, `epid: ${epid}`, "");
												let newCaches = Caches;
												if (!newCaches?.ep) newCaches.ep = {};
												newCaches.ep[epid] = availableLocales;
												$.log(`newCaches = ${JSON.stringify(newCaches)}`);
												let isSave = $.setjson(newCaches, "@BiliBili.Global.Caches");
												$.log(`$.setjson ? ${isSave}`);
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
			if ($request.headers?.Host) $request.headers.Host = URL.host;
			$request.url = URI.stringify(URL);
			$.log(`🚧 ${$.name}, 调试信息`, `$request.url: ${$request.url}`, "");
			break;
		case false:
			$.log(`⚠ ${$.name}, 功能关闭`, "");
			break;
	};
})()
.catch((e) => $.logErr(e))
.finally(() => {
	switch ($response) {
		default: { // 有构造回复数据，返回构造的回复数据
			const FORMAT = ($response?.headers?.["Content-Type"] ?? $response?.headers?.["content-type"])?.split(";")?.[0];
			$.log(`🎉 ${$.name}, finally`, `echo $response`, `FORMAT: ${FORMAT}`, "");
			//$.log(`🚧 ${$.name}, finally`, `echo $response: ${JSON.stringify($response)}`, "");
			if ($response?.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
			if ($response?.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
			if ($.isQuanX()) {
				$response.status = "HTTP/1.1 200 OK";
				delete $response?.headers?.["Content-Length"];
				delete $response?.headers?.["content-length"];
				delete $response?.headers?.["Transfer-Encoding"];
				switch (FORMAT) {
					case undefined: // 视为无body
						// 返回普通数据
						$.done({ status: $response.status, headers: $response.headers });
						break;
					default:
						// 返回普通数据
						$.done({ status: $response.status, headers: $response.headers, body: $response.body });
						break;
					case "application/protobuf":
					case "application/x-protobuf":
					case "application/vnd.google.protobuf":
					case "application/grpc":
					case "application/grpc+proto":
					case "application/octet-stream":
						// 返回二进制数据
						//$.log(`${$response.bodyBytes.byteLength}---${$response.bodyBytes.buffer.byteLength}`);
						$.done({ status: $response.status, headers: $response.headers, bodyBytes: $response.bodyBytes });
						break;
				};
			} else $.done({ response: $response });
			break;
		};
		case undefined: { // 无构造回复数据，发送修改的请求数据
			//const FORMAT = ($request?.headers?.["Content-Type"] ?? $request?.headers?.["content-type"])?.split(";")?.[0];
			$.log(`🎉 ${$.name}, finally`, `$request`, `FORMAT: ${FORMAT}`, "");
			//$.log(`🚧 ${$.name}, finally`, `$request: ${JSON.stringify($request)}`, "");
			if ($.isQuanX()) {
				switch (FORMAT) {
					case undefined: // 视为无body
						// 返回普通数据
						$.done({ url: $request.url, headers: $request.headers })
						break;
					default:
						// 返回普通数据
						$.done({ url: $request.url, headers: $request.headers, body: $request.body })
						break;
					case "application/protobuf":
					case "application/x-protobuf":
					case "application/vnd.google.protobuf":
					case "application/grpc":
					case "application/grpc+proto":
					case "application/octet-stream":
						// 返回二进制数据
						//$.log(`${$request.bodyBytes.byteLength}---${$request.bodyBytes.buffer.byteLength}`);
						$.done({ url: $request.url, headers: $request.headers, bodyBytes: $request.bodyBytes.buffer.slice($request.bodyBytes.byteOffset, $request.bodyBytes.byteLength + $request.bodyBytes.byteOffset) });
						break;
				};
			} else $.done($request);
			break;
		};
	};
})

/***************** Function *****************/
/**
 * Construct Redirect Reqeusts
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @param {Object} proxyName - Proxies Name
 * @return {Object} Modify Request Content with Policy
 */
function ReReqeust(request = {}, proxyName = "") {
	$.log(`⚠ ${$.name}, Construct Redirect Reqeusts`, "");
	if (proxyName) {
		if ($.isLoon()) request.node = proxyName;
		if ($.isQuanX()) {
			if (request.opts) request.opts.policy = proxyName;
			else request.opts = { "policy": proxyName };
		};
		if ($.isSurge()) {
			delete request.id;
			request.headers["X-Surge-Policy"] = proxyName;
			request.policy = proxyName;
		};
		if ($.isStash()) request.headers["X-Stash-Selected-Proxy"] = encodeURI(proxyName);
		if ($.isShadowrocket()) $.logErr(`❗️${$.name}, ${Fetch.name}执行失败`, `不支持的app: Shadowrocket`, "");
	}
	$.log(`🎉 ${$.name}, Construct Redirect Reqeusts`, "");
	//$.log(`🚧 ${$.name}, Construct Redirect Reqeusts`, `Request:${JSON.stringify(request)}`, "");
	return request;
};

/**
 * Fetch Ruled Reqeust
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @return {Promise<*>}
 */
async function Fetch(request = {}) {
	$.log(`⚠ ${$.name}, Fetch Ruled Reqeust`, "");
	let response = (request?.body ?? request?.bodyBytes)
		? await $.http.post(request)
		: await $.http.get(request);
	$.log(`🎉 ${$.name}, Fetch Ruled Reqeust`, "");
	//$.log(`🚧 ${$.name}, Fetch Ruled Reqeust`, `Response:${JSON.stringify(response)}`, "");
	return response;
};

/**
 * Fetch Muti-Locales Reqeusts
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @param {Object} proxies - Proxies Name
 * @param {Array} locales - Locales Names
 * @return {Promise<*>}
 */
async function mutiFetch(request = {}, proxies = {}, locales = []) {
    $.log(`⚠ ${$.name}, Fetch Muti-Locales Reqeusts`, `locales = [${locales}]`, "");
    let responses = {};
	await Promise.allSettled(locales.map(async locale => { responses[locale] = await Fetch(ReReqeust(request, proxies[locale])) }));
	$.log(`🎉 ${$.name}, Fetch Muti-Locales Reqeusts`, "");
	//$.log(`🚧 ${$.name}, Fetch Muti-Locales Reqeusts`, `Responses:${JSON.stringify(responses)}`, "");
    return responses;
};

/**
 * Determine Response Availability
 * @author VirgilClyne
 * @param {Object} response - Original Response Content
 * @return {Boolean} is Available
 */
function isResponseAvailability(response = {}) {
    //$.log(`⚠ ${$.name}, Determine Response Availability`, "");
	$.log(`🚧 ${$.name}, Determine Response Availability`, `statusCode: ${response.statusCode}`, `headers: ${JSON.stringify(response.headers)}`, "");
	let isAvailable = true;
	switch (response?.statusCode) {
		case 200:
			switch ((response?.headers?.["content-type"] || response.headers?.["Content-Type"])?.split(";")?.[0]) {
				case "application/grpc":
					switch (response?.headers?.["grpc-message"] || response.headers?.["Grpc-Message"]) {
						case "0":
							isAvailable = true;
							break;
						case undefined:
							if (parseInt(response?.headers?.["content-length"] ?? response?.headers?.["Content-Length"]) < 800) isAvailable = false;
							else isAvailable = true;
							break;
						case "-404":
						default:
							isAvailable = false;
							break;
					};
					break;
				case "application/json":
					switch (response?.headers?.["bili-status-code"]) {
						case "0":
						case undefined:
							switch (response?.headers?.["idc"]) {
								case "sgp001":
								case "sgp002":
									let data = JSON.parse(response?.body).data;
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
								case undefined:
								default:
									isAvailable = true;
									break;
							};
							break;
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
	$.log(`🎉 ${$.name}, Determine Response Availability`, `isAvailable:${isAvailable}`, "");
    return isAvailable;
};

/**
 * Check Locales Availability
 * @author VirgilClyne
 * @param {Object} responses - Several Original Response Content
 * @return {Array} available Locales Code
 */
function checkLocales(responses = {}) {
	$.log(`⚠ ${$.name}, Check Locales Availability`, `allLocales: ${Object.keys(responses)}`, "");
	for (let locale in responses) {
		if (!isResponseAvailability(responses[locale])) delete responses[locale];
	};
	let availableLocales = Object.keys(responses);
	$.log(`🎉 ${$.name}, Check Locales Availability`, `Available Locales: ${availableLocales}`, "");
	return availableLocales;
};

/**
 * Check Search Keyword
 * @author VirgilClyne
 * @param {String} keyword - Search Keyword
 * @param {String} delimiter - Keyword Delimiter
 * @return {Object} { keyword, locale }
 */
function checkKeyword(keyword = "", delimiter = " ") {
	$.log(`⚠ ${$.name}, Check Search Keyword`, `Original Keyword: ${keyword}`, "");
	let keywords = keyword?.split(delimiter);
	$.log(`🚧 ${$.name}, Check Search Keyword`, `keywords: ${keywords}`, "");
	let locale = "";
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
	$.log(`🎉 ${$.name}, Check Search Keyword`, `Keyword: ${keyword}, Locale: ${locale}`, "");
	return { keyword, locale };
};
