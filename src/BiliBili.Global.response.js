import _ from './ENV/Lodash.mjs'
import $Storage from './ENV/$Storage.mjs'
import ENV from "./ENV/ENV.mjs";

import Database from "./database/BiliBili.mjs";
import setENV from "./function/setENV.mjs";
import pako from "./pako/dist/pako.esm.mjs";
import addgRPCHeader from "./function/addgRPCHeader.mjs";

import { WireType, UnknownFieldHandler, reflectionMergePartial, MESSAGE_TYPE, MessageType, BinaryReader, isJsonObject, typeofJsonValue, jsonWriteOptions } from "../node_modules/@protobuf-ts/runtime/build/es2015/index.js";

const $ = new ENV("📺 BiliBili: 🌐 Global v0.5.0(1006) repsonse");

/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
$.log(`⚠ url: ${url.toJSON()}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = url.hostname, PATH = url.pathname, PATHs = url.pathname.split("/").filter(Boolean);
$.log(`⚠ METHOD: ${METHOD}, HOST: ${HOST}, PATH: ${PATH}` , "");
// 解析格式
const FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ FORMAT: ${FORMAT}`, "");
!(async () => {
	// 读取设置
	const { Settings, Caches, Configs } = setENV("BiliBili", "Global", Database);
	$.log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
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
					body = JSON.parse($response.body ?? "{}");
					// 解析链接
					switch (HOST) {
						case "www.bilibili.com":
							break;
						case "app.bilibili.com":
						case "app.biliapi.net":
							break;
						case "api.bilibili.com":
						case "api.biliapi.net":
							switch (PATH) {
								case "/pgc/player/api/playurl": // 番剧-播放地址-api
								case "/pgc/player/web/playurl": // 番剧-播放地址-web
								case "/pgc/player/web/playurl/html5": // 番剧-播放地址-web-HTML5
									infoGroup.type = "PGC";
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
										case 11783021: // 哔哩哔哩番剧出差
										case 1988098633: // b站_戲劇咖
										case 2042149112: // b站_綜藝咖
											break;
										default:
											break;
									};
									break;
								case "/pgc/view/v2/app/season": // 番剧页面-内容-app
									let data = body.data;
									infoGroup.seasonTitle = data?.season_title ?? infoGroup.seasonTitle;
									infoGroup.seasonId = data?.season_id ?? infoGroup.seasonId;
									infoGroup.mId = data?.up_info?.mid ?? infoGroup.mId;
									infoGroup.evaluate = data?.evaluate ?? infoGroup.evaluate;
									infoGroup.type = "PGC";
									// 有剧集信息
									if (data?.modules) {
										// 解锁剧集信息限制
										data.modules = setModules(data?.modules);
									};
									infoGroup.locales = detectLocales(infoGroup);
									setCache(infoGroup, getEpisodes(data?.modules), Caches);
									// 解锁地区限制遮罩
									if (data?.dialog) {
										if (data?.dialog?.code === 6010001) delete data.dialog;
									};
									// 解锁弹幕和评论区等限制
									if (data?.rights) {
										data.rights.allow_bp = 1;
										data.rights.allow_download = 1;
										data.rights.allow_demand = 1;
										data.rights.area_limit = 0;
									};
									break;
								case "/pgc/view/web/season": // 番剧-内容-web
								case "/pgc/view/pc/season": // 番剧-内容-pc
									let result = body.result;
									infoGroup.seasonTitle = result.season_title ?? infoGroup.seasonTitle;
									infoGroup.seasonId = result.season_id ?? infoGroup.seasonId;
									infoGroup.mId = result.up_info?.mid ?? infoGroup.mId;
									infoGroup.evaluate = result?.evaluate ?? infoGroup.evaluate;
									infoGroup.type = "PGC";
									// 有剧集信息
									if (result?.episodes || result?.section) {
										// 解锁剧集信息限制
										if (result?.episodes) result.episodes = setEpisodes(result.episodes);
										if (result?.section) result.section = setEpisodes(result.section);
									};
									infoGroup.locales = detectLocales(infoGroup);
									setCache(infoGroup, result?.episodes, Caches);
									// 解锁弹幕和评论区等限制
									if (result?.rights) {
										result.rights.allow_bp = 1;
										result.rights.area_limit = 0;
										result.rights.can_watch = 1;
										result.allow_download = 1;
										result.allow_bp_rank = 1;
									};
									break;
							};
							break;
					};
					$response.body = JSON.stringify(body);
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "application/octet-stream":
					//$.log(`🚧 $response.body: ${JSON.stringify($response.body)}`, "");
					let rawBody = $.isQuanX() ? new Uint8Array($response.bodyBytes ?? []) : $response.body ?? new Uint8Array();
					//$.log(`🚧 isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`, "");
					switch (FORMAT) {
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
							break;
						case "application/grpc":
						case "application/grpc+proto":
							// 先拆分B站gRPC校验头和protobuf数据体
							let header = rawBody.slice(0, 5);
							body = rawBody.slice(5);
							// 处理response压缩protobuf数据体
							switch (header?.[0]) {
								case 0: // unGzip
									break;
								case 1: // Gzip
									body = pako.ungzip(body);
									header[0] = 0; // unGzip
									break;
							};
							// 解析链接并处理protobuf数据
							switch (HOST) {
								case "grpc.biliapi.net": // HTTP/2
								case "app.bilibili.com": // HTTP/1.1
									/******************  initialization start  *******************/
									// protobuf/bilibili/app/viewunite/common.proto
									// @generated message type with reflection information, may provide speed optimized methods
									class Owner$Type extends MessageType {
										constructor() {
											super("bilibili.app.viewunite.common.Owner", [
												{ no: 2, name: "url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
												{ no: 3, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
												{ no: 4, name: "fans", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
												{ no: 5, name: "arc_count", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
												{ no: 6, name: "attention", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
												{ no: 7, name: "attention_relation", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
												{ no: 8, name: "pub_location", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
												{ no: 10, name: "title_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
												{ no: 11, name: "face", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
												{ no: 12, name: "mid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
												{ no: 15, name: "fans_num", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
												{ no: 16, name: "assists", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ }
											]);
										}
									}
									/**
									 * @generated MessageType for protobuf message bilibili.app.viewunite.common.Owner
									 */
									const Owner = new Owner$Type();
									/******************  initialization finish  *******************/
									switch (PATHs?.[0]) {
										case "bilibili.app.viewunite.v1.View":
											/******************  initialization start  *******************/
											// protobuf/bilibili/app/viewunite/v1/viewunite.proto
											// @generated message type with reflection information, may provide speed optimized methods
											class Arc$Type extends MessageType {
												constructor() {
													super("bilibili.app.viewunite.v1.Arc", [
														{ no: 1, name: "aid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
														{ no: 2, name: "cid", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
														{ no: 3, name: "duration", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
														{ no: 5, name: "bvid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
														{ no: 6, name: "copyright", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
														{ no: 7, name: "right", kind: "message", T: () => Rights },
														{ no: 8, name: "cover", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
														{ no: 9, name: "type_id", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
														{ no: 10, name: "title", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
													]);
												}
											}
											/**
											 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.Arc
											 */
											const Arc = new Arc$Type();
											// @generated message type with reflection information, may provide speed optimized methods
											class Rights$Type extends MessageType {
												constructor() {
													super("bilibili.app.viewunite.v1.Rights", [
														{ no: 1, name: "only_vip_download", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
														{ no: 2, name: "no_reprint", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
														{ no: 3, name: "download", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
													]);
												}
											}
											/**
											 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.Rights
											 */
											const Rights = new Rights$Type();
											/******************  initialization finish  *******************/
											switch (PATHs?.[1]) {
												case "View": // 播放页
													/******************  initialization start  *******************/
													// protobuf/bilibili/app/viewunite/v1/viewunite.proto
													// @generated message type with reflection information, may provide speed optimized methods
													class ViewReply$Type extends MessageType {
														constructor() {
															super("bilibili.app.viewunite.v1.ViewReply", [
																{ no: 2, name: "arc", kind: "message", T: () => Arc },
																{ no: 4, name: "owner", kind: "message", T: () => Owner },
																//{ no: 5, name: "tab", kind: "message", T: () => Tab },
																//{ no: 6, name: "supplement", kind: "message", T: () => Any },
																{ no: 10, name: "report", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
															]);
														}
													}
													/**
													 * @generated MessageType for protobuf message bilibili.app.viewunite.v1.ViewReply
													 */
													const ViewReply = new ViewReply$Type();
													/******************  initialization finish  *******************/
													let data = ViewReply.fromBinary(body);
													$.log(`🚧 data: ${JSON.stringify(data)}`, "");
													body = ViewReply.toBinary(data);
													infoGroup.seasonTitle = data?.arc?.title ?? data?.supplement?.ogv_data?.title ?? infoGroup.seasonTitle;
													infoGroup.seasonId = parseInt(data?.report?.season_id, 10) || data?.supplement?.ogv_data?.season_id || infoGroup.seasonId;
													infoGroup.mId = parseInt(data?.report?.up_mid, 10) || data?.owner?.mid || infoGroup.mId;
													//infoGroup.evaluate = result?.evaluate ?? infoGroup.evaluate;
													if (infoGroup.seasonId || infoGroup.epId) infoGroup.type = "PGC";
													infoGroup.locales = detectLocales(infoGroup);
													setCache(infoGroup, [], Caches);
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
											/******************  initialization start  *******************/
											/******************  initialization finish  *******************/
											infoGroup.type = "PGC";
											switch (PATHs?.[1]) {
												case "PlayView": // 播放地址
													/******************  initialization start  *******************/
													/******************  initialization finish  *******************/
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
											/******************  initialization start  *******************/
											/******************  initialization finish  *******************/
											switch (PATHs?.[1]) {
												case "SearchAll": { // 全部结果（综合）
													/******************  initialization start  *******************/
													/******************  initialization finish  *******************/
													break;
												};
												case "SearchByType": { // 分类结果（番剧、用户、影视、专栏）
													break;
												};
											};
											break;
									};
									break;
							};
							// protobuf部分处理完后，重新计算并添加B站gRPC校验头
							rawBody = addgRPCHeader({ header, body }); // gzip压缩有问题，别用
							break;
					};
					// 写入二进制数据
					$response.body = rawBody;
					break;
			};
			$.log(`🚧 ${$.name}，信息组, infoGroup: ${JSON.stringify(infoGroup)}`, "");
			break;
		case false:
			break;
	};
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done($response))

/***************** Function *****************/
/**
 * Get Episodes Data
 * @author VirgilClyne
 * @param {Array} modules - Response Body's Data's Modules
 * @return {Array<Object>} Episodes Datas
 */
function getEpisodes(modules = []) {
	$.log(`⚠ Get Episodes`, "");
	let episodes = modules.flatMap(module => {
		switch (module?.style) {
			case "positive": // 选集
			case "section": // SP
				return module?.data?.episodes;
			case "season": // 选季
				return [];
			case "pugv": // 猜你喜欢
			default:
				return [];
		};
	});
	$.log(`🎉 Get Episodes`, "");
	//$.log(`🚧 Get Episodes`, `modules.episodes: ${JSON.stringify(episodes)}`, "");
	return episodes;
};

/**
 * Set Modules Data
 * @author NyaMisty & VirgilClyne
 * @param {Array} modules - Response Body's Data's Modules
 * @return {Array<Object>} Modules Datas
 */
function setModules(modules = []) {
	$.log(`⚠ Set Episodes`, "");
	modules = modules.map(module => {
		switch (module?.style) {
			case "positive": // 选集
			case "section": // SP
				// 解锁弹幕和评论区
				module.data.episodes = setEpisodes(module?.data?.episodes);
				break;
			case "pugv": // 猜你喜欢
			case "season": // 选季
			default:
				break;
		};
		return module;
	});
	$.log(`🎉 Set Episodes`, "");
	//$.log(`🚧 Set Episodes`, `modules: ${JSON.stringify(modules)}`, "");
	return modules;
};

/**
 * Set Episodes Data
 * @author NyaMisty & VirgilClyne
 * @param {Array} modules - Response Body's Data's Modules's Episodes
 * @return {Array<Object>} Modules Datas
 */
function setEpisodes(episodes = []) {
	$.log(`⚠ Set Episodes`, "");
	episodes = episodes.map(episode => {
		if (episode?.badge_info?.text == "受限") {
			episode.badge_info.text = "";
			episode.badge_info.bg_color = "#FB7299";
			episode.badge_info.bg_color_night = "#BB5B76";
		};
		if (episode?.rights) {
			episode.rights.allow_dm = 1;
			episode.rights.allow_download = 1;
			episode.rights.allow_demand = 1;
			episode.rights.area_limit = 0;
		};
		return episode;
	});
	$.log(`🎉 Set Episodes`, "");
	//$.log(`🚧 Set Episodes`, `episodes: ${JSON.stringify(episodes)}`, "");
	return episodes;
};

/**
 * Detect Locales
 * @author VirgilClyne
 * @param {Object} info - Info Group: { seasonTitle: undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}
 * @return {String} locales
 */
function detectLocales(infoGroup = {"seasonTitle": undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}) {
	$.log(`☑️ Detect Locales`, `seasonTitle: ${infoGroup.seasonTitle}, seasonId: ${infoGroup.seasonId}, epId: ${infoGroup.epId}, mId: ${infoGroup.mId}`, "");
	switch (infoGroup.seasonTitle) {
		case undefined:
		case null:
			infoGroup.locales = detectMId(infoGroup.mId);
			break;
		default:
			infoGroup.locales = detectSeasonTitle(infoGroup.seasonTitle);
			break;
	};
	$.log(`✅ Detect Locales, locales: ${infoGroup.locales}`, "");
	return infoGroup.locales;
	/***************** Functions *****************/
	function detectSeasonTitle(seasonTitle){
		$.log(`☑️ Detect Season Title`, "");
		let locales = [];
		$.log([...infoGroup.seasonTitle?.matchAll(/[(\uFF08]([^(\uFF08)\uFF09]+)[)\uFF09]/g)]);
		switch ([...seasonTitle?.matchAll(/[(\uFF08]([^(\uFF08)\uFF09]+)[)\uFF09]/g)]?.pop()?.[1]) {
			case "僅限港澳台地區":
			case "限僅港澳台地區":
			case "港澳台地區":
				locales = ["HKG", "MAC", "TWN"];
				break;
			case "僅限港台地區":
				locales = ["HKG", "TWN"];
				break;
			case "僅限港澳地區":
			case "僅港澳地區":
				locales = ["HKG", "MAC"];
				break;
			case "僅限台灣地區":
				locales = ["TWN"];
				break;
			case "僅限港澳台及其他地區":
				locales = ["HKG", "MAC", "TWN", "SEA"];
				break;
			case "僅限港澳及其他地區":
				locales = ["HKG", "MAC", "SEA"];
				break;
			case undefined:
			case null:
			default:
				locales = detectMId(infoGroup.mId);
				break;
		};
		$.log(`✅ Detect Season Title, locales: ${locales}`, "");
		return locales;
	};

	function detectMId(mId){
		$.log(`☑️ Detect mId`, "");
		let locales = [];
		switch (mId) {
			case 928123: // 哔哩哔哩番剧
				locales = ["CHN"];
				break;
			case 11783021: // 哔哩哔哩番剧出差
			case 1988098633: // b站_戲劇咖
			case 2042149112: // b站_綜藝咖
				locales = ["HKG", "MAC", "TWN"];
				break;
			case 15773384: // 哔哩哔哩电影
				locales = ["CHN"];
				break;
			case 4856007: // 迷影社
			case 98627270: // 哔哩哔哩国创
				locales = ["CHN", "HKG", "MAC", "TWN"];
				break;
			case undefined: // 无UP主信息
			case null:
			default: // 其他UP主
				locales = detectTraditional(infoGroup.seasonTitle, infoGroup.evaluate);
				break;
		};
		$.log(`✅ Detect mId, locales: ${locales}`, "");
		return locales;
	};

	function detectTraditional(seasonTitle, evaluate){
		$.log(`☑️ Detect Traditional`, "");
		let locales = [];
		if (isTraditional(seasonTitle) > 0) { // Traditional Chinese
			locales = ["HKG", "MAC", "TWN"];
		} else if (isTraditional(evaluate) > 1) { // Traditional Chinese
			locales = ["HKG", "MAC", "TWN"];
		} else { // Simplified Chinese
			locales = ["CHN"];
		};
		$.log(`✅ Detect Traditional, locales: ${locales}`, "");
		return locales;
		/***************** Functions *****************/
		/**
		 * is the Strings Traditional Chinese?
		 * @author VirgilClyne
		 * @param {String} strings - Strings to check
		 * @return {Number} Traditional Chinese Count
		 */
		function isTraditional(strings = [""]) {
			$.log(`☑️ is the Strings Traditional Chinese?`, "");
			const reg = /[䊷䋙䝼䰾䲁丟並乾亂亞佇馀併來侖侶俁係俔俠倀倆倈倉個們倫偉側偵偽傑傖傘備傭傯傳傴債傷傾僂僅僉僑僕僞僥僨價儀儂億儈儉儐儔儕儘償優儲儷儺儻儼兌兒兗內兩冊冪凈凍凜凱別刪剄則剋剎剗剛剝剮剴創劃劇劉劊劌劍劑勁動務勛勝勞勢勩勱勵勸勻匭匯匱區協卻厙厠厭厲厴參叄叢吒吳吶呂咼員唄唚問啓啞啟啢喎喚喪喬單喲嗆嗇嗊嗎嗚嗩嗶嘆嘍嘔嘖嘗嘜嘩嘮嘯嘰嘵嘸嘽噓噝噠噥噦噯噲噴噸噹嚀嚇嚌嚕嚙嚦嚨嚲嚳嚴嚶囀囁囂囅囈囑囪圇國圍園圓圖團垵埡埰執堅堊堖堝堯報場塊塋塏塒塗塢塤塵塹墊墜墮墳墻墾壇壈壋壓壘壙壚壞壟壠壢壩壯壺壼壽夠夢夾奐奧奩奪奬奮奼妝姍姦娛婁婦婭媧媯媼媽嫗嫵嫻嫿嬀嬈嬋嬌嬙嬡嬤嬪嬰嬸孌孫學孿宮寢實寧審寫寬寵寶將專尋對導尷屆屍屓屜屢層屨屬岡峴島峽崍崗崢崬嵐嶁嶄嶇嶔嶗嶠嶢嶧嶮嶴嶸嶺嶼巋巒巔巰帥師帳帶幀幃幗幘幟幣幫幬幹幺幾庫廁廂廄廈廚廝廟廠廡廢廣廩廬廳弒弳張強彈彌彎彙彞彥後徑從徠復徵徹恆恥悅悞悵悶惡惱惲惻愛愜愨愴愷愾慄態慍慘慚慟慣慤慪慫慮慳慶憂憊憐憑憒憚憤憫憮憲憶懇應懌懍懟懣懨懲懶懷懸懺懼懾戀戇戔戧戩戰戱戲戶拋拾挩挾捨捫掃掄掗掙掛採揀揚換揮損搖搗搵搶摑摜摟摯摳摶摻撈撏撐撓撝撟撣撥撫撲撳撻撾撿擁擄擇擊擋擓擔據擠擬擯擰擱擲擴擷擺擻擼擾攄攆攏攔攖攙攛攜攝攢攣攤攪攬敗敘敵數斂斃斕斬斷時晉晝暈暉暘暢暫曄曆曇曉曏曖曠曨曬書會朧東杴桿梔梘條梟梲棄棖棗棟棧棲棶椏楊楓楨業極榪榮榲榿構槍槤槧槨槳樁樂樅樓標樞樣樸樹樺橈橋機橢橫檁檉檔檜檟檢檣檮檯檳檸檻櫃櫓櫚櫛櫝櫞櫟櫥櫧櫨櫪櫫櫬櫱櫳櫸櫻欄權欏欒欖欞欽歐歟歡歲歷歸歿殘殞殤殨殫殮殯殲殺殻殼毀毆毿氂氈氌氣氫氬氳決沒沖況洶浹涇涼淚淥淪淵淶淺渙減渦測渾湊湞湯溈準溝溫滄滅滌滎滬滯滲滷滸滻滾滿漁漚漢漣漬漲漵漸漿潁潑潔潙潛潤潯潰潷潿澀澆澇澗澠澤澦澩澮澱濁濃濕濘濟濤濫濰濱濺濼濾瀅瀆瀉瀏瀕瀘瀝瀟瀠瀦瀧瀨瀲瀾灃灄灑灕灘灝灠灣灤灧災為烏烴無煉煒煙煢煥煩煬熅熒熗熱熲熾燁燈燉燒燙燜營燦燭燴燼燾爍爐爛爭爲爺爾牆牘牽犖犢犧狀狹狽猙猶猻獁獄獅獎獨獪獫獮獰獲獵獷獸獺獻獼玀現琺琿瑋瑒瑣瑤瑩瑪瑲璉璣璦璫環璽瓊瓏瓔瓚甌產産畝畢異畵當疇疊痙痾瘂瘋瘍瘓瘞瘡瘧瘮瘲瘺瘻療癆癇癉癘癟癢癤癥癧癩癬癭癮癰癱癲發皚皰皸皺盜盞盡監盤盧眥眾睏睜睞瞘瞜瞞瞶瞼矓矚矯硜硤硨硯碩碭碸確碼磑磚磣磧磯磽礆礎礙礦礪礫礬礱祿禍禎禕禡禦禪禮禰禱禿秈稅稈稟種稱穀穌積穎穠穡穢穩穫穭窩窪窮窯窵窶窺竄竅竇竈竊竪競筆筍筧筴箋箏節範築篋篔篤篩篳簀簍簞簡簣簫簹簽簾籃籌籙籜籟籠籩籪籬籮粵糝糞糧糲糴糶糹糾紀紂約紅紆紇紈紉紋納紐紓純紕紖紗紘紙級紛紜紝紡紬細紱紲紳紵紹紺紼紿絀終組絅絆絎結絕絛絝絞絡絢給絨絰統絲絳絶絹綁綃綆綈綉綌綏經綜綞綠綢綣綫綬維綯綰綱網綳綴綸綹綺綻綽綾綿緄緇緊緋緑緒緓緔緗緘緙線緝緞締緡緣緦編緩緬緯緱緲練緶緹緻縈縉縊縋縐縑縕縗縛縝縞縟縣縧縫縭縮縱縲縳縵縶縷縹總績繃繅繆繒織繕繚繞繡繢繩繪繫繭繮繯繰繳繸繹繼繽繾纈纊續纍纏纓纖纘纜缽罈罌罰罵罷羅羆羈羋羥義習翹耬耮聖聞聯聰聲聳聵聶職聹聽聾肅脅脈脛脫脹腎腖腡腦腫腳腸膃膚膠膩膽膾膿臉臍臏臘臚臟臠臢臨臺與興舉舊艙艤艦艫艱艷芻苎苧茲荊莊莖莢莧華萇萊萬萵葉葒著葤葦葯葷蒓蒔蒞蒼蓀蓋蓮蓯蓴蓽蔔蔞蔣蔥蔦蔭蕁蕆蕎蕒蕓蕕蕘蕢蕩蕪蕭蕷薀薈薊薌薔薘薟薦薩薴薺藍藎藝藥藪藴藶藹藺蘄蘆蘇蘊蘋蘚蘞蘢蘭蘺蘿虆處虛虜號虧虯蛺蛻蜆蝕蝟蝦蝸螄螞螢螻螿蟄蟈蟎蟣蟬蟯蟲蟶蟻蠅蠆蠐蠑蠟蠣蠨蠱蠶蠻衆術衕衚衛衝衹袞裊裏補裝裡製複褌褘褲褳褸褻襇襏襖襝襠襤襪襯襲見覎規覓視覘覡覥覦親覬覯覲覷覺覽覿觀觴觶觸訁訂訃計訊訌討訐訒訓訕訖託記訛訝訟訢訣訥訩訪設許訴訶診註詁詆詎詐詒詔評詖詗詘詛詞詠詡詢詣試詩詫詬詭詮詰話該詳詵詼詿誄誅誆誇誌認誑誒誕誘誚語誠誡誣誤誥誦誨說説誰課誶誹誼誾調諂諄談諉請諍諏諑諒論諗諛諜諝諞諢諤諦諧諫諭諮諱諳諶諷諸諺諼諾謀謁謂謄謅謊謎謐謔謖謗謙謚講謝謠謡謨謫謬謭謳謹謾證譎譏譖識譙譚譜譫譯議譴護譸譽譾讀變讎讒讓讕讖讜讞豈豎豐豬豶貓貝貞貟負財貢貧貨販貪貫責貯貰貲貳貴貶買貸貺費貼貽貿賀賁賂賃賄賅資賈賊賑賒賓賕賙賚賜賞賠賡賢賣賤賦賧質賫賬賭賴賵賺賻購賽賾贄贅贇贈贊贋贍贏贐贓贔贖贗贛贜赬趕趙趨趲跡踐踴蹌蹕蹣蹤蹺躂躉躊躋躍躑躒躓躕躚躡躥躦躪軀車軋軌軍軑軒軔軛軟軤軫軲軸軹軺軻軼軾較輅輇輈載輊輒輓輔輕輛輜輝輞輟輥輦輩輪輬輯輳輸輻輾輿轀轂轄轅轆轉轍轎轔轟轡轢轤辦辭辮辯農逕這連進運過達違遙遜遞遠適遲遷選遺遼邁還邇邊邏邐郟郵鄆鄉鄒鄔鄖鄧鄭鄰鄲鄴鄶鄺酇酈醖醜醞醫醬醱釀釁釃釅釋釐釒釓釔釕釗釘釙針釣釤釧釩釵釷釹釺鈀鈁鈃鈄鈈鈉鈍鈎鈐鈑鈒鈔鈕鈞鈣鈥鈦鈧鈮鈰鈳鈴鈷鈸鈹鈺鈽鈾鈿鉀鉅鉈鉉鉋鉍鉑鉕鉗鉚鉛鉞鉢鉤鉦鉬鉭鉶鉸鉺鉻鉿銀銃銅銍銑銓銖銘銚銛銜銠銣銥銦銨銩銪銫銬銱銳銷銹銻銼鋁鋃鋅鋇鋌鋏鋒鋙鋝鋟鋣鋤鋥鋦鋨鋩鋪鋭鋮鋯鋰鋱鋶鋸鋼錁錄錆錇錈錏錐錒錕錘錙錚錛錟錠錡錢錦錨錩錫錮錯録錳錶錸鍀鍁鍃鍆鍇鍈鍋鍍鍔鍘鍚鍛鍠鍤鍥鍩鍬鍰鍵鍶鍺鎂鎄鎇鎊鎔鎖鎘鎛鎡鎢鎣鎦鎧鎩鎪鎬鎮鎰鎲鎳鎵鎸鎿鏃鏇鏈鏌鏍鏐鏑鏗鏘鏜鏝鏞鏟鏡鏢鏤鏨鏰鏵鏷鏹鏽鐃鐋鐐鐒鐓鐔鐘鐙鐝鐠鐦鐧鐨鐫鐮鐲鐳鐵鐶鐸鐺鐿鑄鑊鑌鑒鑔鑕鑞鑠鑣鑥鑭鑰鑱鑲鑷鑹鑼鑽鑾鑿钁長門閂閃閆閈閉開閌閎閏閑間閔閘閡閣閥閨閩閫閬閭閱閲閶閹閻閼閽閾閿闃闆闈闊闋闌闍闐闒闓闔闕闖關闞闠闡闤闥阪陘陝陣陰陳陸陽隉隊階隕際隨險隱隴隸隻雋雖雙雛雜雞離難雲電霢霧霽靂靄靈靚靜靦靨鞀鞏鞝鞽韁韃韉韋韌韍韓韙韜韞韻響頁頂頃項順頇須頊頌頎頏預頑頒頓頗領頜頡頤頦頭頮頰頲頴頷頸頹頻頽顆題額顎顏顒顓顔願顙顛類顢顥顧顫顬顯顰顱顳顴風颭颮颯颱颳颶颸颺颻颼飀飄飆飈飛飠飢飣飥飩飪飫飭飯飲飴飼飽飾飿餃餄餅餉養餌餎餏餑餒餓餕餖餚餛餜餞餡館餱餳餶餷餺餼餾餿饁饃饅饈饉饊饋饌饑饒饗饜饞饢馬馭馮馱馳馴馹駁駐駑駒駔駕駘駙駛駝駟駡駢駭駰駱駸駿騁騂騅騌騍騎騏騖騙騤騫騭騮騰騶騷騸騾驀驁驂驃驄驅驊驌驍驏驕驗驚驛驟驢驤驥驦驪驫骯髏髒體髕髖髮鬆鬍鬚鬢鬥鬧鬩鬮鬱魎魘魚魛魢魨魯魴魷魺鮁鮃鮊鮋鮍鮎鮐鮑鮒鮓鮚鮜鮝鮞鮦鮪鮫鮭鮮鮳鮶鮺鯀鯁鯇鯉鯊鯒鯔鯕鯖鯗鯛鯝鯡鯢鯤鯧鯨鯪鯫鯴鯷鯽鯿鰁鰂鰃鰈鰉鰍鰏鰐鰒鰓鰜鰟鰠鰣鰥鰨鰩鰭鰮鰱鰲鰳鰵鰷鰹鰺鰻鰼鰾鱂鱅鱈鱉鱒鱔鱖鱗鱘鱝鱟鱠鱣鱤鱧鱨鱭鱯鱷鱸鱺鳥鳧鳩鳬鳲鳳鳴鳶鳾鴆鴇鴉鴒鴕鴛鴝鴞鴟鴣鴦鴨鴯鴰鴴鴷鴻鴿鵁鵂鵃鵐鵑鵒鵓鵜鵝鵠鵡鵪鵬鵮鵯鵲鵷鵾鶄鶇鶉鶊鶓鶖鶘鶚鶡鶥鶩鶪鶬鶯鶲鶴鶹鶺鶻鶼鶿鷀鷁鷂鷄鷈鷊鷓鷖鷗鷙鷚鷥鷦鷫鷯鷲鷳鷸鷹鷺鷽鷿鸇鸌鸏鸕鸘鸚鸛鸝鸞鹵鹹鹺鹽麗麥麩麵麽黃黌點黨黲黶黷黽黿鼉鼴齊齋齎齏齒齔齕齗齙齜齟齠齡齦齪齬齲齶齷龍龎龐龔龕龜]/
			const isTraditional = [...strings].map(string => bool = (string?.match(reg)) ? true : false);
			const sumEqual = isTraditional.reduce((prev, current, index, arr) => {
				return prev + current
			});
			$.log(`✅ is the Strings Traditional Chinese?`, `sumEqual: ${sumEqual}`, "");
			return sumEqual;
		};
	};
};

/**
 * Set Cache
 * @author VirgilClyne
 * @param {Object} info - Info Group: { seasonTitle: undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}
 * @param {Array} episodes - Episodes info
 * @param {Object} cache - Caches
 * @return {Array<Boolean>} is setJSON success?
 */
function setCache(infoGroup = { seasonTitle: undefined, "seasonId": undefined, "epId": undefined, "mId": undefined, "evaluate": undefined}, episodes = [], cache = {}) {
	$.log(`☑️ Set Cache`, `seasonTitle: ${infoGroup.seasonTitle}, seasonId: ${infoGroup.seasonId}, epId: ${infoGroup.epId}, mId: ${infoGroup.mId}`, "");
	let isSaved = false;
	if (infoGroup.locales?.length > 0) {
		if (infoGroup.seasonId) cache.ss.set(infoGroup.seasonId, infoGroup.locales);
		if (infoGroup.epId) cache.ep.set(infoGroup.epId, infoGroup.locales);
		episodes.forEach(episode => cache.ep.set(episode?.id, infoGroup.locales));
		cache.ss = Array.from(cache.ss).slice(-100); // Map转Array.限制缓存大小
		cache.ep = Array.from(cache.ep).slice(-1000); // Map转Array.限制缓存大小
		isSaved = $Storage.setItem("@BiliBili.Global.Caches", cache);
	};
	$.log(`✅ Set Cache, locales: ${infoGroup.locales}, isSaved: ${isSaved}`, "");
	return isSaved;
};
