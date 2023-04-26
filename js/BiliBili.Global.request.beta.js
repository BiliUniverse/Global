/*
WEBSITE: https://biliuniverse.io
README: https://github.com/BiliUniverse
*/
const $ = new Env("📺 BiliBili:Global v0.4.6(5) request.beta");
const URL = new URLs();
const DataBase = {
	"Enhanced":{
		"Settings":{
			"Switch":"true",
			"Home":{"Top_left":"mine","Top":["消息Top"],"Top_more":[],"Tab":["直播tab","推荐tab","hottopic","bangumi","anime","film","koreavtw"],"Tab_default":"bangumi"},
			"Bottom":["home","dynamic","ogv","会员购Bottom","我的Bottom"],
			"Mine":{"CreatorCenter":[],"Recommend":["400","402","403","404"],"More":["407","410","1028"]}
		},
		"Configs":{
			"Tab":{"tab":[{"id":39,"name":"直播","uri":"bilibili://live/home","tab_id":"直播tab","pos":1},{"id":40,"name":"推荐","uri":"bilibili://pegasus/promo","tab_id":"推荐tab","pos":2},{"id":41,"name":"热门","uri":"bilibili://pegasus/hottopic","tab_id":"hottopic","pos":3},{"id":545,"name":"追番","uri":"bilibili://pgc/home","tab_id":"bangumi","pos":4},{"id":774,"name":"动画","uri":"bilibili://following/home_activity_tab/6544","tab_id":"anime","pos":4},{"id":151,"name":"影视","uri":"bilibili://pgc/cinema-tab","tab_id":"film","pos":5},{"id":2280,"name":"校园","uri":"bilibili://campus/home_tab","tab_id":"school","pos":6},{"id":136117,"name":"新征程","uri":"bilibili://following/home_activity_tab/136117","tab_id":"165","pos":7,"color":"#DD1225"},{"id":1716,"icon":"http://i0.hdslb.com/bfs/archive/38d2c2669a68eae8a53fc9afaa193aafa5265a78.png","name":"数码","uri":"bilibili://pegasus/vertical/13807","tab_id":"kj","pos":8},{"id":801,"icon":"http://i0.hdslb.com/bfs/archive/38d2c2669a68eae8a53fc9afaa193aafa5265a78.png","name":"韩综","uri":"bilibili://following/home_activity_tab/95636","tab_id":"koreavtw","pos":10}],"top":[{"id":222,"icon":"http://i0.hdslb.com/bfs/archive/734a3b610a953df398bbe6d787944514dcd94a46.png","name":"游戏中心","uri":"bilibili://game_center/home","tab_id":"游戏中心Top","pos":1},{"id":108,"icon":"http://i0.hdslb.com/bfs/archive/9d1c0985b9d0e2da2c2f919cc2ee0e36ea41fd90.png","name":"会员购","uri":"bilibili://mall/home/","tab_id":"会员购Top","pos":2},{"id":176,"icon":"http://i0.hdslb.com/bfs/archive/d43047538e72c9ed8fd8e4e34415fbe3a4f632cb.png","name":"消息","uri":"bilibili://link/im_home","tab_id":"消息Top","pos":2}],"bottom":[{"id":177,"icon":"http://i0.hdslb.com/bfs/archive/63d7ee88d471786c1af45af86e8cb7f607edf91b.png","icon_selected":"http://i0.hdslb.com/bfs/archive/e5106aa688dc729e7f0eafcbb80317feb54a43bd.png","name":"首页","uri":"bilibili://main/home/","tab_id":"home","pos":1},{"id":103,"icon":"http://i0.hdslb.com/bfs/archive/b4f621f268c1f9eda501805135f132aa9498b0ba.png","icon_selected":"http://i0.hdslb.com/bfs/archive/94539249e59621214f7dc1226cf38a2b8fe4c64f.png","name":"频道","uri":"bilibili://pegasus/channel/","tab_id":"频道Bottom","pos":2},{"id":179,"icon":"http://i0.hdslb.com/bfs/archive/86dfbe5fa32f11a8588b9ae0fccb77d3c27cedf6.png","icon_selected":"http://i0.hdslb.com/bfs/archive/25b658e1f6b6da57eecba328556101dbdcb4b53f.png","name":"动态","uri":"bilibili://following/home/","tab_id":"dynamic","pos":2},{"id":670,"icon":"http://i0.hdslb.com/bfs/feed-admin/c25cabacb40e9df2ccf54c327350e1afc4ae2f8c.png","name":"发布","uri":"bilibili://uper/center_plus?relation_from=center_plus\u0026tab_index=2","tab_id":"publish","pos":3,"dialog_items":[{"id":617,"name":"开直播","icon":"http://i0.hdslb.com/bfs/feed-admin/01f9b3f8ed61a4e59af693da9fcd38fc342ee7e5.png","uri":"activity://liveStreaming/home?source_event=14"},{"id":618,"name":"拍摄","icon":"http://i0.hdslb.com/bfs/feed-admin/30636aa60e594550ec47422e3875b4345e7d6017.png","uri":"bilibili://uper/user_center/add_archive/?from=1\u0026is_new_ui=1\u0026relation_from=center_plus"},{"id":619,"name":"上传","icon":"http://i0.hdslb.com/bfs/feed-admin/55c3c112f4885adc6cce0b4b94149409fd1c147b.png","uri":"bilibili://uper/user_center/add_archive/?from=0\u0026is_new_ui=1\u0026relation_from=center_plus"},{"id":620,"name":"模板创作","icon":"http://i0.hdslb.com/bfs/feed-admin/4e5188d8390754655dee0fdfd90c1088da3cdf90.png","uri":"bilibili://uper/user_center/add_archive/?from=2\u0026is_new_ui=1\u0026relation_from=center_plus"}],"type":3},{"id":690,"icon":"http://i0.hdslb.com/bfs/feed-admin/68b1625cef3a8315d6fe3fbfd2a8b06c905f323a.png","icon_selected":"http://i0.hdslb.com/bfs/feed-admin/1903c6f1dc881ed4c459ab337767fd8436cda159.png","name":"节目","uri":"bilibili://following/home_bottom_tab_activity_tab/168312","tab_id":"ogv","pos":4,"type":4},{"id":242,"icon":"http://i0.hdslb.com/bfs/archive/6090d5fa7ece2a94de839e7cce4f1e774dae7779.png","icon_selected":"http://i0.hdslb.com/bfs/archive/eeaf83fb7157000776dd93f61702a049f56801d3.png","name":"会员购","uri":"bilibili://mall/home","tab_id":"会员购Bottom","pos":4},{"id":105,"icon":"http://i0.hdslb.com/bfs/archive/93dae0f0fb2c9887effb2840800d5b639be69351.png","icon_selected":"http://i0.hdslb.com/bfs/archive/f96bfd9ffea2e51443aed44dba6d76b7b34891c8.png","name":"消息","uri":"bilibili://link/im_home","tab_id":"消息Bottom","pos":4},{"id":181,"icon":"http://i0.hdslb.com/bfs/archive/4b0b2c49ffeb4f0c2e6a4cceebeef0aab1c53fe1.png","icon_selected":"http://i0.hdslb.com/bfs/archive/a54a8009116cb896e64ef14dcf50e5cade401e00.png","name":"我的","uri":"bilibili://user_center/","tab_id":"我的Bottom","pos":5}],"top_more":[{"id":621,"icon":"http://i0.hdslb.com/bfs/feed-admin/f95dfa31c793c857af6e7b65b5387a05f30d31ba.png","name":"更多分区","uri":"bilibili://main/top_category","pos":1},{"id":922,"icon":"http://i0.hdslb.com/bfs/feed-admin/38beac42189ad4d838d20259a5b2cdfd302fef40.png","name":"搜索","uri":"bilibili://search","pos":2}],"top_left":{"mine":{"exp":0,"head_tag":"","url":"bilibili://user_center/","goto":1,"story_background_image":"","story_foreground_image":"","listen_background_image":"","listen_foreground_image":""},"videoshortcut":{"exp":1,"head_tag":"https://i0.hdslb.com/bfs/app/92e7b36c3bd10c850e8a2ba85d19566937751540.png","url":"bilibili://videoshortcut?user_reg_state=0","goto":2,"story_background_image":"http://i0.hdslb.com/bfs/app/7391267ec11cfe99823a8cfd80532a7bc6eca390.png","story_foreground_image":"http://i0.hdslb.com/bfs/app/98098cfd9349b7500c233216169d768cd536d305.png","listen_background_image":"http://i0.hdslb.com/bfs/app/365848675f453e32b42567ba9e249a347a5df061.png","listen_foreground_image":"http://i0.hdslb.com/bfs/app/986ee5e963237d511802c4084c83c2f228e97369.png"}}},
			"Mine":{"sections_v2":[{"items":[{"id":396,"title":"离线缓存","icon":"http://i0.hdslb.com/bfs/archive/5fc84565ab73e716d20cd2f65e0e1de9495d56f8.png","common_op_item":{},"uri":"bilibili://user_center/download"},{"id":397,"title":"历史记录","icon":"http://i0.hdslb.com/bfs/archive/8385323c6acde52e9cd52514ae13c8b9481c1a16.png","common_op_item":{},"uri":"bilibili://user_center/history"},{"id":398,"title":"我的收藏","icon":"http://i0.hdslb.com/bfs/archive/d79b19d983067a1b91614e830a7100c05204a821.png","common_op_item":{},"uri":"bilibili://user_center/favourite"},{"id":399,"title":"稍后再看","icon":"http://i0.hdslb.com/bfs/archive/63bb768caa02a68cb566a838f6f2415f0d1d02d6.png","need_login":1,"uri":"bilibili://user_center/watch_later","common_op_item":{}}],"style":1,"button":{}},{"up_title":"创作中心","title":"创作中心","items":[{"need_login":1,"display":1,"id":171,"title":"创作中心","global_red_dot":1,"uri":"bilibili://uper/homevc","icon":"http://i0.hdslb.com/bfs/archive/d3aad2d07538d2d43805f1fa14a412d7a45cc861.png"},{"need_login":1,"display":1,"id":172,"title":"稿件管理","global_red_dot":1,"uri":"bilibili://uper/user_center/archive_list","icon":"http://i0.hdslb.com/bfs/archive/97acb2d8dec09b296a38f7f7093d651947d13b91.png"},{"need_login":1,"display":1,"id":174,"title":"有奖活动","red_dot":1,"global_red_dot":1,"uri":"https://member.bilibili.com/york/hot-activity","icon":"http://i0.hdslb.com/bfs/archive/7f4fa86d99bf3814bf10f8ee5d6c8c9db6e931c8.png"},{"need_login":1,"display":1,"id":533,"title":"任务中心","global_red_dot":1,"uri":"https://member.bilibili.com/york/mission-center?navhide=1","icon":"http://i0.hdslb.com/bfs/archive/ae18624fd2a7bdda6d95ca606d5e4cf2647bfa4d.png"},{"id":707,"title":"主播中心","icon":"http://i0.hdslb.com/bfs/feed-admin/48e17ccd0ce0cfc9c7826422d5e47ce98f064c2a.png","need_login":1,"uri":"https://live.bilibili.com/p/html/live-app-anchor-center/index.html?is_live_webview=1#/","display":1},{"id":708,"title":"主播活动","icon":"http://i0.hdslb.com/bfs/feed-admin/5bc5a1aa8dd4bc5d6f5222d29ebaca9ef9ce37de.png","need_login":1,"uri":"https://live.bilibili.com/activity/live-activity-full/activity_center/mobile.html?is_live_webview=1","display":1},{"id":709,"title":"开播福利","icon":"https://i0.hdslb.com/bfs/legacy/97a52b64cbd8c099d6520c6be57006c954ec0f5c.png","need_login":1,"uri":"https://live.bilibili.com/p/html/live-anchor-galaxy/task_center/?source_event=16&week_live_btn=1&is_live_full_webview=1#/","display":1},{"id":710,"title":"我的直播","icon":"http://i0.hdslb.com/bfs/feed-admin/a9be4fa50ea4772142c1fc7992cde28294d63021.png","need_login":1,"uri":"https://live.bilibili.com/p/html/live-app-center/index.html?is_live_webview=1&foreground=pink&background=white","display":1}],"style":1,"button":{"icon":"http://i0.hdslb.com/bfs/archive/205f47675eaaca7912111e0e9b1ac94cb985901f.png","style":1,"url":"bilibili://uper/user_center/archive_selection","text":"发布"},"type":1},{"title":"推荐服务","items":[{"id":400,"title":"我的课程","icon":"http://i0.hdslb.com/bfs/archive/aa3a13c287e4d54a62b75917dd9970a3cde472e1.png","common_op_item":{},"uri":"https://m.bilibili.com/cheese/mine?navhide=1&native.theme=1&night=0&spm_id_from=main.my-information.0.0.pv&csource=Me_myclass"},{"id":401,"title":"看视频免流量","icon":"http://i0.hdslb.com/bfs/archive/393dd15a4f0a149e016cd81b55bd8bd6fe40882c.png","common_op_item":{},"uri":"bilibili://user_center/free_traffic"},{"id":402,"title":"个性装扮","icon":"http://i0.hdslb.com/bfs/archive/0bcad10661b50f583969b5a188c12e5f0731628c.png","common_op_item":{},"uri":"https://www.bilibili.com/h5/mall/home?navhide=1&f_source=shop"},{"id":403,"title":"游戏中心","icon":"http://i0.hdslb.com/bfs/archive/873e3c16783fe660b111c02ebc4c50279cb5db57.png","common_op_item":{},"uri":"bilibili://game_center/user?sourceFrom=100003"},{"id":404,"title":"我的钱包","icon":"http://i0.hdslb.com/bfs/archive/f416634e361824e74a855332b6ff14e2e7c2e082.png","need_login":1,"common_op_item":{},"uri":"bilibili://bilipay/mine_wallet"},{"id":406,"title":"直播中心","icon":"http://i0.hdslb.com/bfs/archive/1db5791746a0112890b77a0236baf263d71ecb27.png","common_op_item":{},"uri":"bilibili://user_center/live_center"},{"id":423,"title":"邀好友赚红包","icon":"http://i0.hdslb.com/bfs/archive/de39fc8899204a4e5abaab68fa4bd604068ce124.png","common_op_item":{},"uri":"https://www.bilibili.com/blackboard/redpack/activity-8SX5lYqUj.html?from=wode","red_dot_for_new":true},{"id":514,"title":"社区中心","icon":"http://i0.hdslb.com/bfs/archive/551a39b7539e64d3b15775295c4b2e13e5513b43.png","need_login":1,"uri":"https://www.bilibili.com/blackboard/dynamic/169422","common_op_item":{}},{"id":544,"title":"创作中心","icon":"http://i0.hdslb.com/bfs/archive/a879489af0406067c39940316396ae63aeefe088.png","need_login":1,"uri":"bilibili://upper/homevc","common_op_item":{}},{"id":622,"title":"会员购中心","icon":"http://i0.hdslb.com/bfs/archive/19c794f01def1a267b894be84427d6a8f67081a9.png","common_op_item":{},"uri":"bilibili://mall/mine?msource=mine"},{"id":924,"title":"哔哩哔哩公益","icon":"http://i0.hdslb.com/bfs/feed-admin/a943016e8bef03222998b4760818894ba2bd5c80.png","common_op_item":{},"uri":"https://love.bilibili.com/h5/?navhide=1&c=1"},{"id":990,"title":"能量加油站","icon":"http://i0.hdslb.com/bfs/feed-admin/6acb0cb1f719703c62eb443ba6cf3abfc51164ab.png","common_op_item":{},"uri":"https://www.bilibili.com/blackboard/dynamic/306424"}],"style":1,"button":{}},{"title":"更多服务","items":[{"id":407,"title":"联系客服","icon":"http://i0.hdslb.com/bfs/archive/7ca840cf1d887a45ee1ef441ab57845bf26ef5fa.png","common_op_item":{},"uri":"bilibili://user_center/feedback"},{"id":410,"title":"设置","icon":"http://i0.hdslb.com/bfs/archive/e932404f2ee62e075a772920019e9fbdb4b5656a.png","common_op_item":{},"uri":"bilibili://user_center/setting"},{"id":741,"title":"我的钱包","icon":"http://i0.hdslb.com/bfs/archive/f416634e361824e74a855332b6ff14e2e7c2e082.png","need_login":1,"uri":"bilibili://bilipay/mine_wallet","common_op_item":{}},{"id":742,"title":"稿件管理","icon":"http://i0.hdslb.com/bfs/archive/97acb2d8dec09b296a38f7f7093d651947d13b91.png","need_login":1,"uri":"bilibili://uper//user_center/manuscript-list/","common_op_item":{}},{"id":812,"title":"听视频","icon":"http://i0.hdslb.com/bfs/feed-admin/97276c5df099e516946682edf4ef10dc6b18c7dc.png","common_op_item":{},"uri":"bilibili://podcast","red_dot_for_new":true},{"id":950,"title":"青少年模式","icon":"http://i0.hdslb.com/bfs/archive/68acfd37a735411ad56b59b3253acc33f94f7046.png","common_op_item":{},"uri":"bilibili://user_center/teenagersmode"},{"id":964,"title":"青少年守护","icon":"http://i0.hdslb.com/bfs/feed-admin/90f5920ac351da19c6451757ad71704fcea8192b.png","common_op_item":{},"uri":"https://www.bilibili.com/h5/teenagers/home?navhide=1"},{"id":1028,"title":"我的NFT","icon":"http://i0.hdslb.com/bfs/feed-admin/569a9178aa707f2f2494e34bb6eb1d9d14bd9a7b.png","need_login":1,"uri":"https://www.bilibili.com/h5/pangu/gat?navhide=1","common_op_item":{}}],"style":2,"button":{}}]}
		}
	},
	"Global":{
		"Settings":{"Switch":"true","ForceHost":"1","Locales":["CHN","HKG","TWN"],"Proxies":{"CHN":"DIRECT","HKG":"🇭🇰香港","MAC":"🇲🇴澳门","TWN":"🇹🇼台湾"}}
	},
	"Roaming":{
		"Settings":{"Switch":"true","Proxy":{"Pool":["xn--2vrub.plus","api.qiu.moe","xn--2vrub.icu","xn--n4yr07d.xn--6qq986b3xl","xn--3dz622b.xn--n4y597a0mfle743a.icu","bili.tuturu.top","xn--7rv796dvkm.xn--6qq986b3xl","xn--7ovr3tf1cxr4d.fun","xn--8fv56a330gjea.icu","xn--qoqt3y678a.xn--6qq986b3xl","atri.ink","xn--kiv440b.xn--6qq986b3xl","xn--w4r620anpl.xn--oor00vs23b.icu","xn--chqwq129p.pch.pub","melusinesuki.site","bili.takami.ink"],"Customs":""}}
	},
	"Default": {
		"Settings":{"Switch":"true"}
	}
};

// 构造回复数据
let $response = undefined;

/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = setENV("BiliBili", "Global", DataBase);
	$.log(`⚠ ${$.name}`, `Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings?.Switch) {
		case "true":
		default:
			let url = URL.parse($request?.url);
			const HOST = url?.host, PATH = url?.path, PATHs = PATH.split("/");
			// 解析格式
			const FORMAT = ($request?.headers?.["Content-Type"] ?? $request?.headers?.["content-type"])?.split(";")?.[0];
			$.log(`⚠ ${$.name}`, `HOST: ${HOST}`, `PATH: ${PATH}`, `PATHs: ${PATHs}`, `FORMAT: ${FORMAT}`, "");
			// 创建空数据
			let body = { "code": 0, "message": "0", "data": {} };
			switch (FORMAT) {
				case undefined: // 视为无body
					switch (HOST) {
						case "www.bilibili.com":
							if (PATH.includes("bangumi/play/")) // 番剧-web
								({ response: $response } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
							break;
						case "search.bilibili.com":
							switch (PATH) {
								case "all": // 搜索-全部结果-web（综合）
									let { keyword, locale } = checkKeyword(decodeURIComponent(url.params?.keyword));
									url.params.keyword = encodeURIComponent(keyword);
									$request.url = URL.stringify(url);
									$request = ReReqeust($request, Settings.Proxies[locale]);
									break;
							};
							break;
						case "app.bilibili.com":
						case "app.biliapi.net":
							switch (PATH) {
								case "x/v2/search": // 搜索-全部结果-api（综合）
								case "x/v2/search/type": { // 搜索-分类结果-api（番剧、用户、影视、专栏）
									let { keyword, locale } = checkKeyword(decodeURIComponent(url.params?.keyword));
									url.params.keyword = encodeURIComponent(keyword);
									$request.url = URL.stringify(url);
									$request = ReReqeust($request, Settings.Proxies[locale]);
									break;
								};
								case "x/v2/space": // 用户空间
									switch (url.params?.vmid || url.params?.mid) {
										case "11783021": // 哔哩哔哩番剧出差
										case "1988098633": // b站_戲劇咖
										case "2042149112": // b站_綜藝咖
											({ request: $request } = await processStrategy("randomwithoutCHN", $request, Settings.Proxies, Settings.Locales));
											break;
										default:
											break;
									};
									break;
							};
							break;
						case "api.bilibili.com":
						case "api.biliapi.net":
							switch (PATH) {
								case "pgc/player/api/playurl": // 番剧-播放地址-api
								case "pgc/player/web/playurl": // 番剧-播放地址-web
								case "pgc/player/web/playurl/html5": { // 番剧-播放地址-web-HTML5
									let epId = parseInt(url?.params?.ep_id, 10);
									let seasonId = parseInt(url?.params?.season_id, 10);
									if (Caches.ss.has(seasonId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ss.get(seasonId)));
									else if (Caches.ep.has(epId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ep.get(epId)));
									else ({ response: $response } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
									break;
								};
								case "x/player/wbi/playurl": // UGC-用户生产内容-播放地址
									break;
								case "x/space/acc/info": // 用户空间-账号信息-pc
								case "x/space/wbi/acc/info": // 用户空间-账号信息-wbi
									switch (url.params?.vmid || url.params?.mid) {
										case "11783021": // 哔哩哔哩番剧出差
										case "1988098633": // b站_戲劇咖
										case "2042149112": // b站_綜藝咖
											({ request: $request } = await processStrategy("randomwithoutCHN", $request, Settings.Proxies, Settings.Locales));
											break;
										default:
											break;
									};
									break;
								case "pgc/view/v2/app/season": // 番剧页面-内容-app
								case "pgc/view/web/season": // 番剧-内容-web
								case "pgc/view/pc/season": // 番剧-内容-pc
									// 判断线路
									let epId = parseInt(url?.params?.ep_id, 10);
									let seasonId = parseInt(url?.params?.season_id, 10);
									// 兼容性处理
									switch ($.getEnv()) {
										case "Loon":
										case "Stash":
										case "Surge":
										default:
											if (Caches.ss.has(seasonId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ss.get(seasonId)));
											else if (Caches.ep.has(epId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ep.get(epId)));
											else ({ request: $request } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
											break;
										case "Shadowrocket":
										case "Quantumult X":
											// 直通请求
											break;
									};
									break;
								//case "pgc/view/web/season": // 番剧-内容-web
									//if (Caches.AccessKey) {
									// https://github.com/ipcjs/bilibili-helper/blob/user.js/packages/unblock-area-limit/src/api/biliplus.ts
									//} else ({ response: $response } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
									//break;
								case "x/web-interface/search": // 搜索-全部结果-web（综合）
								case "x/web-interface/search/all/v2": // 搜索-全部结果-web（综合）
								case "x/web-interface/search/type": // 搜索-分类结果-web（番剧、用户、影视、专栏）
									let { keyword, locale } = checkKeyword(decodeURIComponent(url.params?.keyword));
									url.params.keyword = encodeURIComponent(keyword);
									$request.url = URL.stringify(url);
									$request = ReReqeust($request, Settings.Proxies[locale]);
									break;
								case "x/web-interface/wbi/search/all/v2": // 搜索-全部结果-wbi（综合）
								case "x/web-interface/wbi/search/type": { // 搜索-分类结果-wbi（番剧、用户、影视、专栏）
									let { keyword, locale } = checkKeyword(decodeURIComponent(url.params?.keyword), "+");
									url.params.keyword = encodeURIComponent(keyword);
									$request.url = URL.stringify(url);
									$request = ReReqeust($request, Settings.Proxies[locale]);
									break;
								};
							};
							break;
					};
					break;
				case "application/x-www-form-urlencoded":
				case "text/html":
				default:
					break;
				case "text/xml":
					break;
				case "application/json":
					break;
				case "application/x-protobuf":
				case "application/grpc":
					//$.log(`🚧 ${$.name}`, `$request.body: ${JSON.stringify($request.body)}`, "");
					let rawBody = $.isQuanX() ? new Uint8Array($request.bodyBytes) : $request.body;
					//$.log(`🚧 ${$.name}`, `isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`, "");
					/******************  initialization start  *******************/
					// timostamm/protobuf-ts
					!function(i){"use strict";function _(n,e,i){return e<=n&&n<=i}"undefined"!=typeof module&&module.exports&&!i["encoding-indexes"]&&(i["encoding-indexes"]=require("./encoding-indexes.js")["encoding-indexes"]);var l=Math.floor;function s(n){if(void 0===n)return{};if(n===Object(n))return n;throw TypeError("Could not convert argument to dictionary")}function u(n){return 0<=n&&n<=127}var a=u,b=-1;function c(n){this.tokens=[].slice.call(n),this.tokens.reverse()}c.prototype={endOfStream:function(){return!this.tokens.length},read:function(){return this.tokens.length?this.tokens.pop():b},prepend:function(n){if(Array.isArray(n))for(var e=n;e.length;)this.tokens.push(e.pop());else this.tokens.push(n)},push:function(n){if(Array.isArray(n))for(var e=n;e.length;)this.tokens.unshift(e.shift());else this.tokens.unshift(n)}};var w=-1;function m(n,e){if(n)throw TypeError("Decoder error");return e||65533}function f(n){throw TypeError("The code point "+n+" could not be encoded.")}function r(n){return n=String(n).trim().toLowerCase(),Object.prototype.hasOwnProperty.call(d,n)?d[n]:null}var t,o,n=[{encodings:[{labels:["unicode-1-1-utf-8","utf-8","utf8"],name:"UTF-8"}],heading:"The Encoding"},{encodings:[{labels:["866","cp866","csibm866","ibm866"],name:"IBM866"},{labels:["csisolatin2","iso-8859-2","iso-ir-101","iso8859-2","iso88592","iso_8859-2","iso_8859-2:1987","l2","latin2"],name:"ISO-8859-2"},{labels:["csisolatin3","iso-8859-3","iso-ir-109","iso8859-3","iso88593","iso_8859-3","iso_8859-3:1988","l3","latin3"],name:"ISO-8859-3"},{labels:["csisolatin4","iso-8859-4","iso-ir-110","iso8859-4","iso88594","iso_8859-4","iso_8859-4:1988","l4","latin4"],name:"ISO-8859-4"},{labels:["csisolatincyrillic","cyrillic","iso-8859-5","iso-ir-144","iso8859-5","iso88595","iso_8859-5","iso_8859-5:1988"],name:"ISO-8859-5"},{labels:["arabic","asmo-708","csiso88596e","csiso88596i","csisolatinarabic","ecma-114","iso-8859-6","iso-8859-6-e","iso-8859-6-i","iso-ir-127","iso8859-6","iso88596","iso_8859-6","iso_8859-6:1987"],name:"ISO-8859-6"},{labels:["csisolatingreek","ecma-118","elot_928","greek","greek8","iso-8859-7","iso-ir-126","iso8859-7","iso88597","iso_8859-7","iso_8859-7:1987","sun_eu_greek"],name:"ISO-8859-7"},{labels:["csiso88598e","csisolatinhebrew","hebrew","iso-8859-8","iso-8859-8-e","iso-ir-138","iso8859-8","iso88598","iso_8859-8","iso_8859-8:1988","visual"],name:"ISO-8859-8"},{labels:["csiso88598i","iso-8859-8-i","logical"],name:"ISO-8859-8-I"},{labels:["csisolatin6","iso-8859-10","iso-ir-157","iso8859-10","iso885910","l6","latin6"],name:"ISO-8859-10"},{labels:["iso-8859-13","iso8859-13","iso885913"],name:"ISO-8859-13"},{labels:["iso-8859-14","iso8859-14","iso885914"],name:"ISO-8859-14"},{labels:["csisolatin9","iso-8859-15","iso8859-15","iso885915","iso_8859-15","l9"],name:"ISO-8859-15"},{labels:["iso-8859-16"],name:"ISO-8859-16"},{labels:["cskoi8r","koi","koi8","koi8-r","koi8_r"],name:"KOI8-R"},{labels:["koi8-ru","koi8-u"],name:"KOI8-U"},{labels:["csmacintosh","mac","macintosh","x-mac-roman"],name:"macintosh"},{labels:["dos-874","iso-8859-11","iso8859-11","iso885911","tis-620","windows-874"],name:"windows-874"},{labels:["cp1250","windows-1250","x-cp1250"],name:"windows-1250"},{labels:["cp1251","windows-1251","x-cp1251"],name:"windows-1251"},{labels:["ansi_x3.4-1968","ascii","cp1252","cp819","csisolatin1","ibm819","iso-8859-1","iso-ir-100","iso8859-1","iso88591","iso_8859-1","iso_8859-1:1987","l1","latin1","us-ascii","windows-1252","x-cp1252"],name:"windows-1252"},{labels:["cp1253","windows-1253","x-cp1253"],name:"windows-1253"},{labels:["cp1254","csisolatin5","iso-8859-9","iso-ir-148","iso8859-9","iso88599","iso_8859-9","iso_8859-9:1989","l5","latin5","windows-1254","x-cp1254"],name:"windows-1254"},{labels:["cp1255","windows-1255","x-cp1255"],name:"windows-1255"},{labels:["cp1256","windows-1256","x-cp1256"],name:"windows-1256"},{labels:["cp1257","windows-1257","x-cp1257"],name:"windows-1257"},{labels:["cp1258","windows-1258","x-cp1258"],name:"windows-1258"},{labels:["x-mac-cyrillic","x-mac-ukrainian"],name:"x-mac-cyrillic"}],heading:"Legacy single-byte encodings"},{encodings:[{labels:["chinese","csgb2312","csiso58gb231280","gb2312","gb_2312","gb_2312-80","gbk","iso-ir-58","x-gbk"],name:"GBK"},{labels:["gb18030"],name:"gb18030"}],heading:"Legacy multi-byte Chinese (simplified) encodings"},{encodings:[{labels:["big5","big5-hkscs","cn-big5","csbig5","x-x-big5"],name:"Big5"}],heading:"Legacy multi-byte Chinese (traditional) encodings"},{encodings:[{labels:["cseucpkdfmtjapanese","euc-jp","x-euc-jp"],name:"EUC-JP"},{labels:["csiso2022jp","iso-2022-jp"],name:"ISO-2022-JP"},{labels:["csshiftjis","ms932","ms_kanji","shift-jis","shift_jis","sjis","windows-31j","x-sjis"],name:"Shift_JIS"}],heading:"Legacy multi-byte Japanese encodings"},{encodings:[{labels:["cseuckr","csksc56011987","euc-kr","iso-ir-149","korean","ks_c_5601-1987","ks_c_5601-1989","ksc5601","ksc_5601","windows-949"],name:"EUC-KR"}],heading:"Legacy multi-byte Korean encodings"},{encodings:[{labels:["csiso2022kr","hz-gb-2312","iso-2022-cn","iso-2022-cn-ext","iso-2022-kr"],name:"replacement"},{labels:["utf-16be"],name:"UTF-16BE"},{labels:["utf-16","utf-16le"],name:"UTF-16LE"},{labels:["x-user-defined"],name:"x-user-defined"}],heading:"Legacy miscellaneous encodings"}],d={},h=(n.forEach(function(n){n.encodings.forEach(function(e){e.labels.forEach(function(n){d[n]=e})})}),{}),g={};function y(n,e){return e&&e[n]||null}function p(n,e){e=e.indexOf(n);return-1===e?null:e}function v(n){if("encoding-indexes"in i)return i["encoding-indexes"][n];throw Error("Indexes missing. Did you forget to include encoding-indexes.js first?")}var x="utf-8";function O(n,e){if(!(this instanceof O))throw TypeError("Called as a function. Did you forget 'new'?");n=void 0!==n?String(n):x,e=s(e),this._encoding=null,this._decoder=null,this._ignoreBOM=!1,this._BOMseen=!1,this._error_mode="replacement",this._do_not_flush=!1;var i=r(n);if(null===i||"replacement"===i.name)throw RangeError("Unknown encoding: "+n);if(g[i.name])return(n=this)._encoding=i,Boolean(e.fatal)&&(n._error_mode="fatal"),Boolean(e.ignoreBOM)&&(n._ignoreBOM=!0),Object.defineProperty||(this.encoding=n._encoding.name.toLowerCase(),this.fatal="fatal"===n._error_mode,this.ignoreBOM=n._ignoreBOM),n;throw Error("Decoder not present. Did you forget to include encoding-indexes.js first?")}function k(n,e){if(!(this instanceof k))throw TypeError("Called as a function. Did you forget 'new'?");e=s(e),this._encoding=null,this._encoder=null,this._do_not_flush=!1,this._fatal=Boolean(e.fatal)?"fatal":"replacement";if(Boolean(e.NONSTANDARD_allowLegacyEncoding)){e=r(n=void 0!==n?String(n):x);if(null===e||"replacement"===e.name)throw RangeError("Unknown encoding: "+n);if(!h[e.name])throw Error("Encoder not present. Did you forget to include encoding-indexes.js first?");this._encoding=e}else this._encoding=r("utf-8"),void 0!==n&&"console"in i&&console.warn("TextEncoder constructor called with encoding label, which is ignored.");return Object.defineProperty||(this.encoding=this._encoding.name.toLowerCase()),this}function e(n){var r=n.fatal,t=0,o=0,s=0,l=128,a=191;this.handler=function(n,e){if(e===b&&0!==s)return s=0,m(r);if(e===b)return w;if(0===s){if(_(e,0,127))return e;if(_(e,194,223))s=1,t=31&e;else if(_(e,224,239))224===e&&(l=160),237===e&&(a=159),s=2,t=15&e;else{if(!_(e,240,244))return m(r);240===e&&(l=144),244===e&&(a=143),s=3,t=7&e}return null}var i;return _(e,l,a)?(l=128,a=191,t=t<<6|63&e,(o+=1)!==s?null:(i=t,t=s=o=0,i)):(t=s=o=0,l=128,a=191,n.prepend(e),m(r))}}function E(n){n.fatal;this.handler=function(n,e){if(e===b)return w;if(a(e))return e;_(e,128,2047)?(i=1,r=192):_(e,2048,65535)?(i=2,r=224):_(e,65536,1114111)&&(i=3,r=240);for(var i,r,t=[(e>>6*i)+r];0<i;)t.push(128|63&e>>6*(i-1)),--i;return t}}function j(i,n){var r=n.fatal;this.handler=function(n,e){return e===b?w:u(e)?e:null===(e=i[e-128])?m(r):e}}function B(r,n){n.fatal;this.handler=function(n,e){var i;return e===b?w:a(e)?e:(null===(i=p(e,r))&&f(e),i+128)}}function S(n){var o=n.fatal,s=0,l=0,a=0;this.handler=function(n,e){var i,r,t;return e===b&&0===s&&0===l&&0===a?w:(e!==b||0===s&&0===l&&0===a||(a=l=s=0,m(o)),0!==a?(i=null,_(e,48,57)&&(i=function(n){if(39419<n&&n<189e3||1237575<n)return null;if(7457===n)return 59335;for(var e=0,i=0,r=v("gb18030-ranges"),t=0;t<r.length;++t){var o=r[t];if(!(o[0]<=n))break;e=o[0],i=o[1]}return i+n-e}(10*(126*(10*(s-129)+l-48)+a-129)+e-48)),r=[l,a,e],a=l=s=0,null===i?(n.prepend(r),m(o)):i):0!==l?_(e,129,254)?(a=e,null):(n.prepend([l,e]),l=s=0,m(o)):0!==s?_(e,48,57)?(l=e,null):(r=s,s=0,(t=null)===(i=null===(t=_(e,64,126)||_(e,128,254)?190*(r-129)+(e-(e<127?64:65)):t)?null:y(t,v("gb18030")))&&u(e)&&n.prepend(e),null===i?m(o):i):u(e)?e:128===e?8364:_(e,129,254)?(s=e,null):m(o))}}function T(n,t){n.fatal;this.handler=function(n,e){var i,r;return e===b?w:a(e)?e:58853===e?f(e):t&&8364===e?128:null!==(i=p(e,v("gb18030")))?(r=i%190,[l(i/190)+129,r+(r<63?64:65)]):t?f(e):(i=function(n){if(59335===n)return 7457;for(var e=0,i=0,r=v("gb18030-ranges"),t=0;t<r.length;++t){var o=r[t];if(!(o[1]<=n))break;e=o[1],i=o[0]}return i+n-e}(e),[(r=l(i/10/126/10))+129,(e=l((i-=10*r*126*10)/10/126))+48,(r=l((i-=10*e*126)/10))+129,48+(i-10*r)])}}function I(n){var t=n.fatal,o=0;this.handler=function(n,e){if(e===b&&0!==o)return o=0,m(t);if(e===b&&0===o)return w;if(0===o)return u(e)?e:_(e,129,254)?(o=e,null):m(t);var i=o,r=null;switch(o=0,r=_(e,64,126)||_(e,161,254)?157*(i-129)+(e-(e<127?64:98)):r){case 1133:return[202,772];case 1135:return[202,780];case 1164:return[234,772];case 1166:return[234,780]}i=null===r?null:y(r,v("big5"));return null===i&&u(e)&&n.prepend(e),null===i?m(t):i}}function U(n){n.fatal;this.handler=function(n,e){var i,r;return e===b?w:a(e)?e:(i=e,r=o=o||v("big5").map(function(n,e){return e<5024?null:n}),null===(i=9552===i||9566===i||9569===i||9578===i||21313===i||21317===i?r.lastIndexOf(i):p(i,r))||(r=l(i/157)+129)<161?f(e):[r,(e=i%157)+(e<63?64:98)])}}function C(n){var t=n.fatal,o=!1,s=0;this.handler=function(n,e){var i,r;return e===b&&0!==s?(s=0,m(t)):e===b&&0===s?w:142===s&&_(e,161,223)?(s=0,65216+e):143===s&&_(e,161,254)?(o=!0,s=e,null):0!==s?(i=s,s=0,r=null,_(i,161,254)&&_(e,161,254)&&(r=y(94*(i-161)+(e-161),v(o?"jis0212":"jis0208"))),o=!1,_(e,161,254)||n.prepend(e),null===r?m(t):r):u(e)?e:142===e||143===e||_(e,161,254)?(s=e,null):m(t)}}function P(n){n.fatal;this.handler=function(n,e){var i;return e===b?w:a(e)?e:165===e?92:8254===e?126:_(e,65377,65439)?[142,e-65377+161]:null===(i=p(e=8722===e?65293:e,v("jis0208")))?f(e):[l(i/94)+161,i%94+161]}}function D(n){var t=n.fatal,o=0,s=1,l=2,a=3,u=4,c=5,f=6,d=o,h=o,g=0,p=!1;this.handler=function(n,e){switch(d){default:case o:return 27===e?(d=c,null):_(e,0,127)&&14!==e&&15!==e&&27!==e?(p=!1,e):e===b?w:(p=!1,m(t));case s:return 27===e?(d=c,null):92===e?(p=!1,165):126===e?(p=!1,8254):_(e,0,127)&&14!==e&&15!==e&&27!==e&&92!==e&&126!==e?(p=!1,e):e===b?w:(p=!1,m(t));case l:return 27===e?(d=c,null):_(e,33,95)?(p=!1,65344+e):e===b?w:(p=!1,m(t));case a:return 27===e?(d=c,null):_(e,33,126)?(p=!1,g=e,d=u,null):e===b?w:(p=!1,m(t));case u:if(27===e)d=c;else{if(_(e,33,126))return d=a,null===(i=y(94*(g-33)+e-33,v("jis0208")))?m(t):i;e===b?(d=a,n.prepend(e)):d=a}return m(t);case c:return 36===e||40===e?(g=e,d=f,null):(n.prepend(e),p=!1,d=h,m(t));case f:var i=g,r=(g=0,null);return(40===i&&66===e&&(r=o),40===i&&74===e&&(r=s),40===i&&73===e&&(r=l),null!==(r=36!==i||64!==e&&66!==e?r:a))?(d=r,r=p,p=!0,r?m(t):null):(n.prepend([i,e]),p=!1,d=h,m(t))}}}function F(n){n.fatal;var r=0,t=1,o=2,s=r;this.handler=function(n,e){if(e===b&&s!==r)return n.prepend(e),s=r,[27,40,66];if(e===b&&s===r)return w;if(!(s!==r&&s!==t||14!==e&&15!==e&&27!==e))return f(65533);if(s===r&&a(e))return e;if(s===t&&(a(e)&&92!==e&&126!==e||165==e||8254==e)){if(a(e))return e;if(165===e)return 92;if(8254===e)return 126}var i;return a(e)&&s!==r?(n.prepend(e),s=r,[27,40,66]):165!==e&&8254!==e||s===t?null===(i=p(e=8722===e?65293:e,v("jis0208")))?f(e):s!==o?(n.prepend(e),s=o,[27,36,66]):[l(i/94)+33,i%94+33]:(n.prepend(e),s=t,[27,40,74])}}function J(n){var t=n.fatal,o=0;this.handler=function(n,e){var i,r;return e===b&&0!==o?(o=0,m(t)):e===b&&0===o?w:0!==o?(r=o,i=null,o=0,(_(e,64,126)||_(e,128,252))&&(i=188*(r-(r<160?129:193))+e-(e<127?64:65)),_(i,8836,10715)?48508+i:(null===(r=null===i?null:y(i,v("jis0208")))&&u(e)&&n.prepend(e),null===r?m(t):r)):u(e)||128===e?e:_(e,161,223)?65216+e:_(e,129,159)||_(e,224,252)?(o=e,null):m(t)}}function K(n){n.fatal;this.handler=function(n,e){var i;return e===b?w:a(e)||128===e?e:165===e?92:8254===e?126:_(e,65377,65439)?e-65377+161:(i=e=8722===e?65293:e,null===(i=(t=t||v("jis0208").map(function(n,e){return _(e,8272,8835)?null:n})).indexOf(i))?f(e):[(e=l(i/188))+(e<31?129:193),(e=i%188)+(e<63?64:65)])}}function R(n){var t=n.fatal,o=0;this.handler=function(n,e){var i,r;return e===b&&0!==o?(o=0,m(t)):e===b&&0===o?w:0!==o?(r=o,o=0,r=(i=null)===(i=_(e,65,254)?190*(r-129)+(e-65):i)?null:y(i,v("euc-kr")),null===i&&u(e)&&n.prepend(e),null===r?m(t):r):u(e)?e:_(e,129,254)?(o=e,null):m(t)}}function G(n){n.fatal;this.handler=function(n,e){var i;return e===b?w:a(e)?e:null===(i=p(e,v("euc-kr")))?f(e):[l(i/190)+129,i%190+65]}}function A(n,e){var i=n>>8,n=255&n;return e?[i,n]:[n,i]}function L(r,n){var t=n.fatal,o=null,s=null;this.handler=function(n,e){var i;return e!==b||null===o&&null===s?e===b&&null===o&&null===s?w:null===o?(o=e,null):(e=r?(o<<8)+e:(e<<8)+o,(o=null)!==s?(i=s,s=null,_(e,56320,57343)?65536+1024*(i-55296)+(e-56320):(n.prepend(A(e,r)),m(t))):_(e,55296,56319)?(s=e,null):_(e,56320,57343)?m(t):e):m(t)}}function M(r,n){n.fatal;this.handler=function(n,e){var i;return e===b?w:_(e,0,65535)?A(e,r):(i=A(55296+(e-65536>>10),r),e=A(56320+(e-65536&1023),r),i.concat(e))}}function N(n){n.fatal;this.handler=function(n,e){return e===b?w:u(e)?e:63360+e-128}}function q(n){n.fatal;this.handler=function(n,e){return e===b?w:a(e)?e:_(e,63360,63487)?e-63360+128:f(e)}}Object.defineProperty&&(Object.defineProperty(O.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}}),Object.defineProperty(O.prototype,"fatal",{get:function(){return"fatal"===this._error_mode}}),Object.defineProperty(O.prototype,"ignoreBOM",{get:function(){return this._ignoreBOM}})),O.prototype.decode=function(n,e){n="object"==typeof n&&n instanceof ArrayBuffer?new Uint8Array(n):"object"==typeof n&&"buffer"in n&&n.buffer instanceof ArrayBuffer?new Uint8Array(n.buffer,n.byteOffset,n.byteLength):new Uint8Array(0);e=s(e),this._do_not_flush||(this._decoder=g[this._encoding.name]({fatal:"fatal"===this._error_mode}),this._BOMseen=!1),this._do_not_flush=Boolean(e.stream);for(var i,r=new c(n),t=[];;){var o=r.read();if(o===b)break;if((i=this._decoder.handler(r,o))===w)break;null!==i&&(Array.isArray(i)?t.push.apply(t,i):t.push(i))}if(!this._do_not_flush){for(;(i=this._decoder.handler(r,r.read()))!==w&&(null!==i&&(Array.isArray(i)?t.push.apply(t,i):t.push(i)),!r.endOfStream()););this._decoder=null}return function(n){e=["UTF-8","UTF-16LE","UTF-16BE"],i=this._encoding.name,-1===e.indexOf(i)||this._ignoreBOM||this._BOMseen||(0<n.length&&65279===n[0]?(this._BOMseen=!0,n.shift()):0<n.length&&(this._BOMseen=!0));for(var e,i,r=n,t="",o=0;o<r.length;++o){var s=r[o];s<=65535?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296+(s>>10),56320+(1023&s)))}return t}.call(this,t)},Object.defineProperty&&Object.defineProperty(k.prototype,"encoding",{get:function(){return this._encoding.name.toLowerCase()}}),k.prototype.encode=function(n,e){n=void 0===n?"":String(n),e=s(e),this._do_not_flush||(this._encoder=h[this._encoding.name]({fatal:"fatal"===this._fatal})),this._do_not_flush=Boolean(e.stream);for(var i,r=new c(function(n){for(var e=String(n),i=e.length,r=0,t=[];r<i;){var o,s=e.charCodeAt(r);s<55296||57343<s?t.push(s):56320<=s&&s<=57343?t.push(65533):55296<=s&&s<=56319&&(r!==i-1&&56320<=(o=e.charCodeAt(r+1))&&o<=57343?(t.push(65536+((1023&s)<<10)+(1023&o)),r+=1):t.push(65533)),r+=1}return t}(n)),t=[];;){var o=r.read();if(o===b)break;if((i=this._encoder.handler(r,o))===w)break;Array.isArray(i)?t.push.apply(t,i):t.push(i)}if(!this._do_not_flush){for(;;){if((i=this._encoder.handler(r,r.read()))===w)break;Array.isArray(i)?t.push.apply(t,i):t.push(i)}this._encoder=null}return new Uint8Array(t)},h["UTF-8"]=function(n){return new E(n)},g["UTF-8"]=function(n){return new e(n)},"encoding-indexes"in i&&n.forEach(function(n){"Legacy single-byte encodings"===n.heading&&n.encodings.forEach(function(n){var n=n.name,e=v(n.toLowerCase());g[n]=function(n){return new j(e,n)},h[n]=function(n){return new B(e,n)}})}),g.GBK=function(n){return new S(n)},h.GBK=function(n){return new T(n,!0)},h.gb18030=function(n){return new T(n)},g.gb18030=function(n){return new S(n)},h.Big5=function(n){return new U(n)},g.Big5=function(n){return new I(n)},h["EUC-JP"]=function(n){return new P(n)},g["EUC-JP"]=function(n){return new C(n)},h["ISO-2022-JP"]=function(n){return new F(n)},g["ISO-2022-JP"]=function(n){return new D(n)},h.Shift_JIS=function(n){return new K(n)},g.Shift_JIS=function(n){return new J(n)},h["EUC-KR"]=function(n){return new G(n)},g["EUC-KR"]=function(n){return new R(n)},h["UTF-16BE"]=function(n){return new M(!0,n)},g["UTF-16BE"]=function(n){return new L(!0,n)},h["UTF-16LE"]=function(n){return new M(!1,n)},g["UTF-16LE"]=function(n){return new L(!1,n)},h["x-user-defined"]=function(n){return new q(n)},g["x-user-defined"]=function(n){return new N(n)},i.TextEncoder||(i.TextEncoder=k),i.TextDecoder||(i.TextDecoder=O),"undefined"!=typeof module&&module.exports&&(module.exports={TextEncoder:i.TextEncoder,TextDecoder:i.TextDecoder,EncodingIndexes:i["encoding-indexes"]})}(this||{});
					// @protobuf-ts/runtime
					var UnknownFieldHandler,WireType,ScalarType,LongType,RepeatType,__defProp=Object.defineProperty,__defProps=Object.defineProperties,__getOwnPropDescs=Object.getOwnPropertyDescriptors,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(e,r,t)=>r in e?__defProp(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,__spreadValues=(e,r)=>{for(var t in r=r||{})__hasOwnProp.call(r,t)&&__defNormalProp(e,t,r[t]);if(__getOwnPropSymbols)for(var t of __getOwnPropSymbols(r))__propIsEnum.call(r,t)&&__defNormalProp(e,t,r[t]);return e},__spreadProps=(e,r)=>__defProps(e,__getOwnPropDescs(r));function varint64read(){let r=0,t=0;for(let e=0;e<28;e+=7){var a=this.buf[this.pos++];if(r|=(127&a)<<e,0==(128&a))return this.assertBounds(),[r,t]}var e=this.buf[this.pos++];if(r|=(15&e)<<28,t=(112&e)>>4,0==(128&e))return this.assertBounds(),[r,t];for(let e=3;e<=31;e+=7){var n=this.buf[this.pos++];if(t|=(127&n)<<e,0==(128&n))return this.assertBounds(),[r,t]}throw new Error("invalid varint")}function varint64write(r,t,a){for(let e=0;e<28;e+=7){var n=r>>>e,s=!(n>>>7==0&&0==t);if(a.push(255&(s?128|n:n)),!s)return}var e=r>>>28&15|(7&t)<<4,i=!(t>>3==0);if(a.push(255&(i?128|e:e)),i){for(let e=3;e<31;e+=7){var o=t>>>e,l=!(o>>>7==0);if(a.push(255&(l?128|o:o)),!l)return}a.push(t>>>31&1)}}const TWO_PWR_32_DBL$1=4294967296;function int64fromString(t){var e="-"==t[0];e&&(t=t.slice(1));let a=0,n=0;function r(e,r){e=Number(t.slice(e,r));n*=1e6,(a=1e6*a+e)>=TWO_PWR_32_DBL$1&&(n+=a/TWO_PWR_32_DBL$1|0,a%=TWO_PWR_32_DBL$1)}return r(-24,-18),r(-18,-12),r(-12,-6),r(-6),[e,a,n]}function int64toString(e,r){if(r<=2097151)return""+(TWO_PWR_32_DBL$1*r+e);var t=(e>>>24|r<<8)>>>0&16777215,r=r>>16&65535;let a=(16777215&e)+6777216*t+6710656*r,n=t+8147497*r,s=2*r;e=1e7;function i(e,r){e=e?String(e):"";return r?"0000000".slice(e.length)+e:e}return a>=e&&(n+=Math.floor(a/e),a%=e),n>=e&&(s+=Math.floor(n/e),n%=e),i(s,0)+i(n,s)+i(a,1)}function varint32write(r,t){if(0<=r){for(;127<r;)t.push(127&r|128),r>>>=7;t.push(r)}else{for(let e=0;e<9;e++)t.push(127&r|128),r>>=7;t.push(1)}}function varint32read(){let r=this.buf[this.pos++];var e=127&r;if(0==(128&r))return this.assertBounds(),e;if(e|=(127&(r=this.buf[this.pos++]))<<7,0==(128&r))return this.assertBounds(),e;if(e|=(127&(r=this.buf[this.pos++]))<<14,0==(128&r))return this.assertBounds(),e;if(e|=(127&(r=this.buf[this.pos++]))<<21,0==(128&r))return this.assertBounds(),e;e|=(15&(r=this.buf[this.pos++]))<<28;for(let e=5;0!=(128&r)&&e<10;e++)r=this.buf[this.pos++];if(0!=(128&r))throw new Error("invalid varint");return this.assertBounds(),e>>>0}function detectBi(){var e=new DataView(new ArrayBuffer(8));return void 0!==globalThis.BigInt&&"function"==typeof e.getBigInt64&&"function"==typeof e.getBigUint64&&"function"==typeof e.setBigInt64&&"function"==typeof e.setBigUint64?{MIN:BigInt("-9223372036854775808"),MAX:BigInt("9223372036854775807"),UMIN:BigInt("0"),UMAX:BigInt("18446744073709551615"),C:BigInt,V:e}:void 0}const BI=detectBi();function assertBi(e){if(!e)throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support")}const RE_DECIMAL_STR=/^-?[0-9]+$/,TWO_PWR_32_DBL=4294967296;class SharedPbLong{constructor(e,r){this.lo=0|e,this.hi=0|r}isZero(){return 0==this.lo&&0==this.hi}toNumber(){var e=this.hi*TWO_PWR_32_DBL+(this.lo>>>0);if(Number.isSafeInteger(e))return e;throw new Error("cannot convert to safe number")}}const _PbULong=class extends SharedPbLong{static from(e){if(BI)switch(typeof e){case"string":if("0"==e)return this.ZERO;if(""==e)throw new Error("string is no integer");e=BI.C(e);case"number":if(0===e)return this.ZERO;e=BI.C(e);case"bigint":if(!e)return this.ZERO;if(e<BI.UMIN)throw new Error("signed value for ulong");if(e>BI.UMAX)throw new Error("ulong too large");return BI.V.setBigUint64(0,e,!0),new _PbULong(BI.V.getInt32(0,!0),BI.V.getInt32(4,!0))}else switch(typeof e){case"string":if("0"==e)return this.ZERO;if(e=e.trim(),!RE_DECIMAL_STR.test(e))throw new Error("string is no integer");var[r,t,a]=int64fromString(e);if(r)throw new Error("signed value");return new _PbULong(t,a);case"number":if(0==e)return this.ZERO;if(!Number.isSafeInteger(e))throw new Error("number is no integer");if(e<0)throw new Error("signed value for ulong");return new _PbULong(e,e/TWO_PWR_32_DBL)}throw new Error("unknown value "+typeof e)}toString(){return BI?this.toBigInt().toString():int64toString(this.lo,this.hi)}toBigInt(){return assertBi(BI),BI.V.setInt32(0,this.lo,!0),BI.V.setInt32(4,this.hi,!0),BI.V.getBigUint64(0,!0)}};let PbULong=_PbULong;PbULong.ZERO=new _PbULong(0,0);const _PbLong=class extends SharedPbLong{static from(e){if(BI)switch(typeof e){case"string":if("0"==e)return this.ZERO;if(""==e)throw new Error("string is no integer");e=BI.C(e);case"number":if(0===e)return this.ZERO;e=BI.C(e);case"bigint":if(!e)return this.ZERO;if(e<BI.MIN)throw new Error("ulong too small");if(e>BI.MAX)throw new Error("ulong too large");return BI.V.setBigInt64(0,e,!0),new _PbLong(BI.V.getInt32(0,!0),BI.V.getInt32(4,!0))}else switch(typeof e){case"string":if("0"==e)return this.ZERO;var r,t,a;if(e=e.trim(),RE_DECIMAL_STR.test(e))return[r,a,t]=int64fromString(e),a=new _PbLong(a,t),r?a.negate():a;throw new Error("string is no integer");case"number":if(0==e)return this.ZERO;if(Number.isSafeInteger(e))return 0<e?new _PbLong(e,e/TWO_PWR_32_DBL):new _PbLong(-e,-e/TWO_PWR_32_DBL).negate();throw new Error("number is no integer")}throw new Error("unknown value "+typeof e)}isNegative(){return 0!=(2147483648&this.hi)}negate(){let e=~this.hi,r=this.lo;return r?r=1+~r:e+=1,new _PbLong(r,e)}toString(){var e;return BI?this.toBigInt().toString():this.isNegative()?"-"+int64toString((e=this.negate()).lo,e.hi):int64toString(this.lo,this.hi)}toBigInt(){return assertBi(BI),BI.V.setInt32(0,this.lo,!0),BI.V.setInt32(4,this.hi,!0),BI.V.getBigInt64(0,!0)}};let PbLong=_PbLong;PbLong.ZERO=new _PbLong(0,0);class BinaryReader{constructor(e,r){this.varint64=varint64read,this.uint32=varint32read,this.buf=e,this.len=e.length,this.pos=0,this.view=new DataView(e.buffer,e.byteOffset,e.byteLength),this.textDecoder=null!=r?r:new TextDecoder("utf-8",{fatal:!0})}tag(){var e=this.uint32(),r=e>>>3,e=7&e;if(r<=0||e<0||5<e)throw new Error("illegal tag: field no "+r+" wire type "+e);return[r,e]}skip(e){var r,t=this.pos;switch(e){case WireType.Varint:for(;128&this.buf[this.pos++];);break;case WireType.Bit64:this.pos+=4;case WireType.Bit32:this.pos+=4;break;case WireType.LengthDelimited:var a=this.uint32();this.pos+=a;break;case WireType.StartGroup:for(;(r=this.tag()[1])!==WireType.EndGroup;)this.skip(r);break;default:throw new Error("cant skip wire type "+e)}return this.assertBounds(),this.buf.subarray(t,this.pos)}assertBounds(){if(this.pos>this.len)throw new RangeError("premature EOF")}int32(){return 0|this.uint32()}sint32(){var e=this.uint32();return e>>>1^-(1&e)}int64(){return new PbLong(...this.varint64())}uint64(){return new PbULong(...this.varint64())}sint64(){var[e,r]=this.varint64(),t=-(1&e),e=(e>>>1|(1&r)<<31)^t,r=r>>>1^t;return new PbLong(e,r)}bool(){var[e,r]=this.varint64();return 0!==e||0!==r}fixed32(){return this.view.getUint32((this.pos+=4)-4,!0)}sfixed32(){return this.view.getInt32((this.pos+=4)-4,!0)}fixed64(){return new PbULong(this.sfixed32(),this.sfixed32())}sfixed64(){return new PbLong(this.sfixed32(),this.sfixed32())}float(){return this.view.getFloat32((this.pos+=4)-4,!0)}double(){return this.view.getFloat64((this.pos+=8)-8,!0)}bytes(){var e=this.uint32(),r=this.pos;return this.pos+=e,this.assertBounds(),this.buf.subarray(r,r+e)}string(){return this.textDecoder.decode(this.bytes())}}function assert(e,r){if(!e)throw new Error(r)}const FLOAT32_MAX=34028234663852886e22,FLOAT32_MIN=-34028234663852886e22,UINT32_MAX=4294967295,INT32_MAX=2147483647,INT32_MIN=-2147483648;function assertInt32(e){if("number"!=typeof e)throw new Error("invalid int 32: "+typeof e);if(!Number.isInteger(e)||e>INT32_MAX||e<INT32_MIN)throw new Error("invalid int 32: "+e)}function assertUInt32(e){if("number"!=typeof e)throw new Error("invalid uint 32: "+typeof e);if(!Number.isInteger(e)||e>UINT32_MAX||e<0)throw new Error("invalid uint 32: "+e)}function assertFloat32(e){if("number"!=typeof e)throw new Error("invalid float 32: "+typeof e);if(Number.isFinite(e)&&(e>FLOAT32_MAX||e<FLOAT32_MIN))throw new Error("invalid float 32: "+e)}class BinaryWriter{constructor(e){this.stack=[],this.textEncoder=null!=e?e:new TextEncoder,this.chunks=[],this.buf=[]}finish(){this.chunks.push(new Uint8Array(this.buf));let r=0;for(let e=0;e<this.chunks.length;e++)r+=this.chunks[e].length;var t=new Uint8Array(r);let a=0;for(let e=0;e<this.chunks.length;e++)t.set(this.chunks[e],a),a+=this.chunks[e].length;return this.chunks=[],t}fork(){return this.stack.push({chunks:this.chunks,buf:this.buf}),this.chunks=[],this.buf=[],this}join(){var e=this.finish(),r=this.stack.pop();if(r)return this.chunks=r.chunks,this.buf=r.buf,this.uint32(e.byteLength),this.raw(e);throw new Error("invalid state, fork stack empty")}tag(e,r){return this.uint32((e<<3|r)>>>0)}raw(e){return this.buf.length&&(this.chunks.push(new Uint8Array(this.buf)),this.buf=[]),this.chunks.push(e),this}uint32(e){for(assertUInt32(e);127<e;)this.buf.push(127&e|128),e>>>=7;return this.buf.push(e),this}int32(e){return assertInt32(e),varint32write(e,this.buf),this}bool(e){return this.buf.push(e?1:0),this}bytes(e){return this.uint32(e.byteLength),this.raw(e)}string(e){e=this.textEncoder.encode(e);return this.uint32(e.byteLength),this.raw(e)}float(e){assertFloat32(e);var r=new Uint8Array(4);return new DataView(r.buffer).setFloat32(0,e,!0),this.raw(r)}double(e){var r=new Uint8Array(8);return new DataView(r.buffer).setFloat64(0,e,!0),this.raw(r)}fixed32(e){assertUInt32(e);var r=new Uint8Array(4);return new DataView(r.buffer).setUint32(0,e,!0),this.raw(r)}sfixed32(e){assertInt32(e);var r=new Uint8Array(4);return new DataView(r.buffer).setInt32(0,e,!0),this.raw(r)}sint32(e){return assertInt32(e),varint32write(e=(e<<1^e>>31)>>>0,this.buf),this}sfixed64(e){var r=new Uint8Array(8),t=new DataView(r.buffer),e=PbLong.from(e);return t.setInt32(0,e.lo,!0),t.setInt32(4,e.hi,!0),this.raw(r)}fixed64(e){var r=new Uint8Array(8),t=new DataView(r.buffer),e=PbULong.from(e);return t.setInt32(0,e.lo,!0),t.setInt32(4,e.hi,!0),this.raw(r)}int64(e){e=PbLong.from(e);return varint64write(e.lo,e.hi,this.buf),this}sint64(e){var e=PbLong.from(e),r=e.hi>>31;return varint64write(e.lo<<1^r,(e.hi<<1|e.lo>>>31)^r,this.buf),this}uint64(e){e=PbULong.from(e);return varint64write(e.lo,e.hi,this.buf),this}}function binaryWriteOptions(e){return e?__spreadValues(__spreadValues({},defaultsWrite$1),e):defaultsWrite$1}function binaryReadOptions(e){return e?__spreadValues(__spreadValues({},defaultsRead$1),e):defaultsRead$1}!function(i){i.symbol=Symbol.for("protobuf-ts/unknown"),i.onRead=(e,r,t,a,n)=>{(s(r)?r[i.symbol]:r[i.symbol]=[]).push({no:t,wireType:a,data:n})},i.onWrite=(e,r,t)=>{for(var{no:a,wireType:n,data:s}of i.list(r))t.tag(a,n).raw(s)},i.list=(e,r)=>s(e)?(e=e[i.symbol],r?e.filter((e=>e.no==r)):e):[],i.last=(e,r)=>i.list(e,r).slice(-1)[0];const s=e=>e&&Array.isArray(e[i.symbol])}(UnknownFieldHandler=UnknownFieldHandler||{});const defaultsRead$1={readUnknownField:!0,readerFactory:e=>new BinaryReader(e)},defaultsWrite$1={writeUnknownFields:!0,writerFactory:()=>new BinaryWriter},MESSAGE_TYPE=(!function(e){e[e.Varint=0]="Varint",e[e.Bit64=1]="Bit64",e[e.LengthDelimited=2]="LengthDelimited",e[e.StartGroup=3]="StartGroup",e[e.EndGroup=4]="EndGroup",e[e.Bit32=5]="Bit32"}(WireType=WireType||{}),Symbol.for("protobuf-ts/message-type"));function lowerCamelCase(r){let t=!1;var a=[];for(let e=0;e<r.length;e++){var n=r.charAt(e);"_"==n?t=!0:/\d/.test(n)?(a.push(n),t=!0):t?(a.push(n.toUpperCase()),t=!1):0==e?a.push(n.toLowerCase()):a.push(n)}return a.join("")}function normalizeFieldInfo(e){var r;return e.localName=null!=(r=e.localName)?r:lowerCamelCase(e.name),e.jsonName=null!=(r=e.jsonName)?r:lowerCamelCase(e.name),e.repeat=null!=(r=e.repeat)?r:0,e.opt=null!=(r=e.opt)?r:!e.repeat&&(!e.oneof&&"message"==e.kind),e}function isOneofGroup(e){if("object"!=typeof e||null===e||!e.hasOwnProperty("oneofKind"))return!1;switch(typeof e.oneofKind){case"string":return void 0===e[e.oneofKind]?!1:2==Object.keys(e).length;case"undefined":return 1==Object.keys(e).length;default:return!1}}!function(e){e[e.DOUBLE=1]="DOUBLE",e[e.FLOAT=2]="FLOAT",e[e.INT64=3]="INT64",e[e.UINT64=4]="UINT64",e[e.INT32=5]="INT32",e[e.FIXED64=6]="FIXED64",e[e.FIXED32=7]="FIXED32",e[e.BOOL=8]="BOOL",e[e.STRING=9]="STRING",e[e.BYTES=12]="BYTES",e[e.UINT32=13]="UINT32",e[e.SFIXED32=15]="SFIXED32",e[e.SFIXED64=16]="SFIXED64",e[e.SINT32=17]="SINT32",e[e.SINT64=18]="SINT64"}(ScalarType=ScalarType||{}),function(e){e[e.BIGINT=0]="BIGINT",e[e.STRING=1]="STRING",e[e.NUMBER=2]="NUMBER"}(LongType=LongType||{}),function(e){e[e.NO=0]="NO",e[e.PACKED=1]="PACKED",e[e.UNPACKED=2]="UNPACKED"}(RepeatType=RepeatType||{});class ReflectionTypeCheck{constructor(e){this.fields=null!=(e=e.fields)?e:[]}prepare(){if(!this.data){var e,r=[],t=[],a=[];for(e of this.fields)if(e.oneof)a.includes(e.oneof)||(a.push(e.oneof),r.push(e.oneof),t.push(e.oneof));else switch(t.push(e.localName),e.kind){case"scalar":case"enum":e.opt&&!e.repeat||r.push(e.localName);break;case"message":e.repeat&&r.push(e.localName);break;case"map":r.push(e.localName)}this.data={req:r,known:t,oneofs:Object.values(a)}}}is(e,a,n=!1){if(!(a<0)){if(null==e||"object"!=typeof e)return!1;this.prepare();let r=Object.keys(e),t=this.data;if(r.length<t.req.length||t.req.some((e=>!r.includes(e))))return!1;if(!n&&r.some((e=>!t.known.includes(e))))return!1;if(!(a<1)){for(const i of t.oneofs){const o=e[i];if(!isOneofGroup(o))return!1;if(void 0!==o.oneofKind){var s=this.fields.find((e=>e.localName===o.oneofKind));if(!s)return!1;if(!this.field(o[o.oneofKind],s,n,a))return!1}}for(const l of this.fields)if(void 0===l.oneof&&!this.field(e[l.localName],l,n,a))return!1}}return!0}field(e,r,t,a){var n=r.repeat;switch(r.kind){case"scalar":return void 0===e?r.opt:n?this.scalars(e,r.T,a,r.L):this.scalar(e,r.T,r.L);case"enum":return void 0===e?r.opt:n?this.scalars(e,ScalarType.INT32,a):this.scalar(e,ScalarType.INT32);case"message":return void 0===e?!0:n?this.messages(e,r.T(),t,a):this.message(e,r.T(),t,a);case"map":if("object"!=typeof e||null===e)return!1;if(a<2)return!0;if(!this.mapKeys(e,r.K,a))return!1;switch(r.V.kind){case"scalar":return this.scalars(Object.values(e),r.V.T,a,r.V.L);case"enum":return this.scalars(Object.values(e),ScalarType.INT32,a);case"message":return this.messages(Object.values(e),r.V.T(),t,a)}}return!0}message(e,r,t,a){return t?r.isAssignable(e,a):r.is(e,a)}messages(r,t,e,a){if(!Array.isArray(r))return!1;if(!(a<2))if(e){for(let e=0;e<r.length&&e<a;e++)if(!t.isAssignable(r[e],a-1))return!1}else for(let e=0;e<r.length&&e<a;e++)if(!t.is(r[e],a-1))return!1;return!0}scalar(e,r,t){var a=typeof e;switch(r){case ScalarType.UINT64:case ScalarType.FIXED64:case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:switch(t){case LongType.BIGINT:return"bigint"==a;case LongType.NUMBER:return"number"==a&&!isNaN(e);default:return"string"==a}case ScalarType.BOOL:return"boolean"==a;case ScalarType.STRING:return"string"==a;case ScalarType.BYTES:return e instanceof Uint8Array;case ScalarType.DOUBLE:case ScalarType.FLOAT:return"number"==a&&!isNaN(e);default:return"number"==a&&Number.isInteger(e)}}scalars(r,t,a,n){if(!Array.isArray(r))return!1;if(!(a<2)&&Array.isArray(r))for(let e=0;e<r.length&&e<a;e++)if(!this.scalar(r[e],t,n))return!1;return!0}mapKeys(e,r,t){var a=Object.keys(e);switch(r){case ScalarType.INT32:case ScalarType.FIXED32:case ScalarType.SFIXED32:case ScalarType.SINT32:case ScalarType.UINT32:return this.scalars(a.slice(0,t).map((e=>parseInt(e))),r,t);case ScalarType.BOOL:return this.scalars(a.slice(0,t).map((e=>"true"==e||"false"!=e&&e)),r,t);default:return this.scalars(a,r,t,LongType.STRING)}}}function typeofJsonValue(e){var r=typeof e;if("object"==r){if(Array.isArray(e))return"array";if(null===e)return"null"}return r}function isJsonObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}let encTable="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),decTable=[];for(let e=0;e<encTable.length;e++)decTable[encTable[e].charCodeAt(0)]=e;function base64decode(r){let e=3*r.length/4,t=("="==r[r.length-2]?e-=2:"="==r[r.length-1]&&--e,new Uint8Array(e)),a=0,n=0,s,i=0;for(let e=0;e<r.length;e++){if(void 0===(s=decTable[r.charCodeAt(e)]))switch(r[e]){case"=":n=0;case"\n":case"\r":case"\t":case" ":continue;default:throw Error("invalid base64 string.")}switch(n){case 0:i=s,n=1;break;case 1:t[a++]=i<<2|(48&s)>>4,i=s,n=2;break;case 2:t[a++]=(15&i)<<4|(60&s)>>2,i=s,n=3;break;case 3:t[a++]=(3&i)<<6|s,n=0}}if(1==n)throw Error("invalid base64 string.");return t.subarray(0,a)}function base64encode(r){let t="",a=0,n,s=0;for(let e=0;e<r.length;e++)switch(n=r[e],a){case 0:t+=encTable[n>>2],s=(3&n)<<4,a=1;break;case 1:t+=encTable[s|n>>4],s=(15&n)<<2,a=2;break;case 2:t=(t+=encTable[s|n>>6])+encTable[63&n],a=0}return a&&(t=t+encTable[s]+"=",1==a&&(t+="=")),t}function reflectionLongConvert(e,r){switch(r){case LongType.BIGINT:return e.toBigInt();case LongType.NUMBER:return e.toNumber();default:return e.toString()}}decTable["-".charCodeAt(0)]=encTable.indexOf("+"),decTable["_".charCodeAt(0)]=encTable.indexOf("/");class ReflectionJsonReader{constructor(e){this.info=e}prepare(){var e;if(void 0===this.fMap){this.fMap={};for(const r of null!=(e=this.info.fields)?e:[])this.fMap[r.name]=r,this.fMap[r.jsonName]=r,this.fMap[r.localName]=r}}assert(e,r,t){if(!e){let e=typeofJsonValue(t);throw"number"!=e&&"boolean"!=e||(e=t.toString()),new Error(`Cannot parse JSON ${e} for ${this.info.typeName}#`+r)}}read(e,r,t){this.prepare();var a,n,s=[];for([a,n]of Object.entries(e)){var i=this.fMap[a];if(!i){if(t.ignoreUnknownFields)continue;throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: `+a)}var o=i.localName;let e;if(i.oneof){if(s.includes(i.oneof))throw new Error(`Multiple members of the oneof group "${i.oneof}" of ${this.info.typeName} are present in JSON.`);s.push(i.oneof),e=r[i.oneof]={oneofKind:o}}else e=r;if("map"==i.kind){if(null!==n){this.assert(isJsonObject(n),i.name,n);var l,c,u=e[o];for([l,c]of Object.entries(n)){this.assert(null!==c,i.name+" map value",null);let e;switch(i.V.kind){case"message":e=i.V.T().internalJsonRead(c,t);break;case"enum":if(!1===(e=this.enum(i.V.T(),c,i.name,t.ignoreUnknownFields)))continue;break;case"scalar":e=this.scalar(c,i.V.T,i.V.L,i.name)}this.assert(void 0!==e,i.name+" map value",c);let r=l;i.K==ScalarType.BOOL&&(r="true"==r||"false"!=r&&r),u[r=this.scalar(r,i.K,LongType.STRING,i.name).toString()]=e}}}else if(i.repeat){if(null!==n){this.assert(Array.isArray(n),i.name,n);var f=e[o];for(const p of n){this.assert(null!==p,i.name,null);let e;switch(i.kind){case"message":e=i.T().internalJsonRead(p,t);break;case"enum":if(!1===(e=this.enum(i.T(),p,i.name,t.ignoreUnknownFields)))continue;break;case"scalar":e=this.scalar(p,i.T,i.L,i.name)}this.assert(void 0!==e,i.name,n),f.push(e)}}}else switch(i.kind){case"message":null===n&&"google.protobuf.Value"!=i.T().typeName?this.assert(void 0===i.oneof,i.name+" (oneof member)",null):e[o]=i.T().internalJsonRead(n,t,e[o]);break;case"enum":var h=this.enum(i.T(),n,i.name,t.ignoreUnknownFields);!1!==h&&(e[o]=h);break;case"scalar":e[o]=this.scalar(n,i.T,i.L,i.name)}}}enum(r,t,a,n){if("google.protobuf.NullValue"==r[0]&&assert(null===t,`Unable to parse field ${this.info.typeName}#${a}, enum ${r[0]} only accepts null.`),null===t)return 0;switch(typeof t){case"number":return assert(Number.isInteger(t),`Unable to parse field ${this.info.typeName}#${a}, enum can only be integral number, got ${t}.`),t;case"string":let e=t;r[2]&&t.substring(0,r[2].length)===r[2]&&(e=t.substring(r[2].length));var s=r[1][e];return void 0===s&&n?!1:(assert("number"==typeof s,`Unable to parse field ${this.info.typeName}#${a}, enum ${r[0]} has no value for "${t}".`),s)}assert(!1,`Unable to parse field ${this.info.typeName}#${a}, cannot parse enum value from ${typeof t}".`)}scalar(r,t,a,e){let n;try{switch(t){case ScalarType.DOUBLE:case ScalarType.FLOAT:if(null===r)return 0;if("NaN"===r)return Number.NaN;if("Infinity"===r)return Number.POSITIVE_INFINITY;if("-Infinity"===r)return Number.NEGATIVE_INFINITY;if(""===r)n="empty string";else if("string"==typeof r&&r.trim().length!==r.length)n="extra whitespace";else if("string"==typeof r||"number"==typeof r){var s=Number(r);if(Number.isNaN(s))n="not a number";else{if(Number.isFinite(s))return t==ScalarType.FLOAT&&assertFloat32(s),s;n="too large or small"}}break;case ScalarType.INT32:case ScalarType.FIXED32:case ScalarType.SFIXED32:case ScalarType.SINT32:case ScalarType.UINT32:if(null===r)return 0;let e;if("number"==typeof r?e=r:""===r?n="empty string":"string"==typeof r&&(r.trim().length!==r.length?n="extra whitespace":e=Number(r)),void 0===e)break;return(t==ScalarType.UINT32?assertUInt32:assertInt32)(e),e;case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:if(null===r)return reflectionLongConvert(PbLong.ZERO,a);if("number"!=typeof r&&"string"!=typeof r)break;return reflectionLongConvert(PbLong.from(r),a);case ScalarType.FIXED64:case ScalarType.UINT64:if(null===r)return reflectionLongConvert(PbULong.ZERO,a);if("number"!=typeof r&&"string"!=typeof r)break;return reflectionLongConvert(PbULong.from(r),a);case ScalarType.BOOL:if(null===r)return!1;if("boolean"!=typeof r)break;return r;case ScalarType.STRING:if(null===r)return"";if("string"!=typeof r){n="extra whitespace";break}try{encodeURIComponent(r)}catch(e){0;break}return r;case ScalarType.BYTES:if(null===r||""===r)return new Uint8Array(0);if("string"!=typeof r)break;return base64decode(r)}}catch(e){n=e.message}this.assert(!1,e+(n?" - "+n:""),r)}}class ReflectionJsonWriter{constructor(e){this.fields=null!=(e=e.fields)?e:[]}write(e,r){var t,a,n={},s=e;for(const i of this.fields)i.oneof?(t=s[i.oneof]).oneofKind===i.localName&&(a="scalar"==i.kind||"enum"==i.kind?__spreadProps(__spreadValues({},r),{emitDefaultValues:!0}):r,assert(void 0!==(t=this.field(i,t[i.localName],a))),n[r.useProtoFieldName?i.name:i.jsonName]=t):void 0!==(a=this.field(i,s[i.localName],r))&&(n[r.useProtoFieldName?i.name:i.jsonName]=a);return n}field(r,t,a){let e=void 0;if("map"==r.kind){assert("object"==typeof t&&null!==t);var n={};switch(r.V.kind){case"scalar":for(var[s,i]of Object.entries(t)){i=this.scalar(r.V.T,i,r.name,!1,!0);assert(void 0!==i),n[s.toString()]=i}break;case"message":var o,l,c=r.V.T();for([o,l]of Object.entries(t)){var u=this.message(c,l,r.name,a);assert(void 0!==u),n[o.toString()]=u}break;case"enum":var f,h,p=r.V.T();for([f,h]of Object.entries(t)){assert(void 0===h||"number"==typeof h);var d=this.enum(p,h,r.name,!1,!0,a.enumAsInteger);assert(void 0!==d),n[f.toString()]=d}}(a.emitDefaultValues||0<Object.keys(n).length)&&(e=n)}else if(r.repeat){assert(Array.isArray(t));var y=[];switch(r.kind){case"scalar":for(let e=0;e<t.length;e++){var T=this.scalar(r.T,t[e],r.name,r.opt,!0);assert(void 0!==T),y.push(T)}break;case"enum":var g=r.T();for(let e=0;e<t.length;e++){assert(void 0===t[e]||"number"==typeof t[e]);var b=this.enum(g,t[e],r.name,r.opt,!0,a.enumAsInteger);assert(void 0!==b),y.push(b)}break;case"message":var m=r.T();for(let e=0;e<t.length;e++){var w=this.message(m,t[e],r.name,a);assert(void 0!==w),y.push(w)}}(a.emitDefaultValues||0<y.length||a.emitDefaultValues)&&(e=y)}else switch(r.kind){case"scalar":e=this.scalar(r.T,t,r.name,r.opt,a.emitDefaultValues);break;case"enum":e=this.enum(r.T(),t,r.name,r.opt,a.emitDefaultValues,a.enumAsInteger);break;case"message":e=this.message(r.T(),t,r.name,a)}return e}enum(e,r,t,a,n,s){if("google.protobuf.NullValue"==e[0])return null;if(void 0===r)assert(a);else if(0!==r||n||a)return assert("number"==typeof r),assert(Number.isInteger(r)),s||!e[1].hasOwnProperty(r)?r:e[2]?e[2]+e[1][r]:e[1][r]}message(e,r,t,a){return void 0===r?a.emitDefaultValues?null:void 0:e.internalJsonWrite(r,a)}scalar(e,r,t,a,n){if(void 0===r)assert(a);else{var s=n||a;switch(e){case ScalarType.INT32:case ScalarType.SFIXED32:case ScalarType.SINT32:return 0===r?s?0:void 0:(assertInt32(r),r);case ScalarType.FIXED32:case ScalarType.UINT32:return 0===r?s?0:void 0:(assertUInt32(r),r);case ScalarType.FLOAT:assertFloat32(r);case ScalarType.DOUBLE:return 0===r?s?0:void 0:(assert("number"==typeof r),Number.isNaN(r)?"NaN":r===Number.POSITIVE_INFINITY?"Infinity":r===Number.NEGATIVE_INFINITY?"-Infinity":r);case ScalarType.STRING:return""===r?s?"":void 0:(assert("string"==typeof r),r);case ScalarType.BOOL:return!1===r?!s&&void 0:(assert("boolean"==typeof r),r);case ScalarType.UINT64:case ScalarType.FIXED64:assert("number"==typeof r||"string"==typeof r||"bigint"==typeof r);var i=PbULong.from(r);return i.isZero()&&!s?void 0:i.toString();case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:assert("number"==typeof r||"string"==typeof r||"bigint"==typeof r);i=PbLong.from(r);return i.isZero()&&!s?void 0:i.toString();case ScalarType.BYTES:return(assert(r instanceof Uint8Array),r.byteLength)?base64encode(r):s?"":void 0}}}}function reflectionScalarDefault(e,r=LongType.STRING){switch(e){case ScalarType.BOOL:return!1;case ScalarType.UINT64:case ScalarType.FIXED64:return reflectionLongConvert(PbULong.ZERO,r);case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:return reflectionLongConvert(PbLong.ZERO,r);case ScalarType.DOUBLE:case ScalarType.FLOAT:return 0;case ScalarType.BYTES:return new Uint8Array(0);case ScalarType.STRING:return"";default:return 0}}class ReflectionBinaryReader{constructor(e){this.info=e}prepare(){var e;this.fieldNoToField||(e=null!=(e=this.info.fields)?e:[],this.fieldNoToField=new Map(e.map((e=>[e.no,e]))))}read(a,n,s,e){this.prepare();for(var r=void 0===e?a.len:a.pos+e;a.pos<r;){var[t,i]=a.tag(),o=this.fieldNoToField.get(t);if(o){let e=n,r=o.repeat,t=o.localName;switch(o.oneof&&(e=e[o.oneof]).oneofKind!==t&&(e=n[o.oneof]={oneofKind:t}),o.kind){case"scalar":case"enum":var l="enum"==o.kind?ScalarType.INT32:o.T,c="scalar"==o.kind?o.L:void 0;if(r){var u=e[t];if(i==WireType.LengthDelimited&&l!=ScalarType.STRING&&l!=ScalarType.BYTES)for(var f=a.uint32()+a.pos;a.pos<f;)u.push(this.scalar(a,l,c));else u.push(this.scalar(a,l,c))}else e[t]=this.scalar(a,l,c);break;case"message":r?(h=e[t],p=o.T().internalBinaryRead(a,a.uint32(),s),h.push(p)):e[t]=o.T().internalBinaryRead(a,a.uint32(),s,e[t]);break;case"map":var[h,p]=this.mapEntry(o,a,s);e[t][h]=p}}else{var d=s.readUnknownField;if("throw"==d)throw new Error(`Unknown field ${t} (wire type ${i}) for `+this.info.typeName);var y=a.skip(i);!1!==d&&(!0===d?UnknownFieldHandler.onRead:d)(this.info.typeName,n,t,i,y)}}}mapEntry(e,r,t){var a=r.uint32(),n=r.pos+a;let s=void 0,i=void 0;for(;r.pos<n;){var[o,l]=r.tag();switch(o){case 1:s=e.K==ScalarType.BOOL?r.bool().toString():this.scalar(r,e.K,LongType.STRING);break;case 2:switch(e.V.kind){case"scalar":i=this.scalar(r,e.V.T,e.V.L);break;case"enum":i=r.int32();break;case"message":i=e.V.T().internalBinaryRead(r,r.uint32(),t)}break;default:throw new Error(`Unknown field ${o} (wire type ${l}) in map entry for ${this.info.typeName}#`+e.name)}}if(void 0===s&&(a=reflectionScalarDefault(e.K),s=e.K==ScalarType.BOOL?a.toString():a),void 0===i)switch(e.V.kind){case"scalar":i=reflectionScalarDefault(e.V.T,e.V.L);break;case"enum":i=0;break;case"message":i=e.V.T().create()}return[s,i]}scalar(e,r,t){switch(r){case ScalarType.INT32:return e.int32();case ScalarType.STRING:return e.string();case ScalarType.BOOL:return e.bool();case ScalarType.DOUBLE:return e.double();case ScalarType.FLOAT:return e.float();case ScalarType.INT64:return reflectionLongConvert(e.int64(),t);case ScalarType.UINT64:return reflectionLongConvert(e.uint64(),t);case ScalarType.FIXED64:return reflectionLongConvert(e.fixed64(),t);case ScalarType.FIXED32:return e.fixed32();case ScalarType.BYTES:return e.bytes();case ScalarType.UINT32:return e.uint32();case ScalarType.SFIXED32:return e.sfixed32();case ScalarType.SFIXED64:return reflectionLongConvert(e.sfixed64(),t);case ScalarType.SINT32:return e.sint32();case ScalarType.SINT64:return reflectionLongConvert(e.sint64(),t)}}}class ReflectionBinaryWriter{constructor(e){this.info=e}prepare(){var e;this.fields||(e=this.info.fields?this.info.fields.concat():[],this.fields=e.sort(((e,r)=>e.no-r.no)))}write(n,s,i){this.prepare();for(const f of this.fields){let e,r,t=f.repeat,a=f.localName;if(f.oneof){var o=n[f.oneof];if(o.oneofKind!==a)continue;e=o[a],r=!0}else e=n[a],r=!1;switch(f.kind){case"scalar":case"enum":var l="enum"==f.kind?ScalarType.INT32:f.T;if(t)if(assert(Array.isArray(e)),t==RepeatType.PACKED)this.packed(s,l,f.no,e);else for(const h of e)this.scalar(s,l,f.no,h,!0);else void 0===e?assert(f.opt):this.scalar(s,l,f.no,e,r||f.opt);break;case"message":if(t){assert(Array.isArray(e));for(const p of e)this.message(s,i,f.T(),f.no,p)}else this.message(s,i,f.T(),f.no,e);break;case"map":assert("object"==typeof e&&null!==e);for(var[c,u]of Object.entries(e))this.mapEntry(s,i,f,c,u)}}var e=i.writeUnknownFields;!1!==e&&(!0===e?UnknownFieldHandler.onWrite:e)(this.info.typeName,n,s)}mapEntry(e,r,t,a,n){e.tag(t.no,WireType.LengthDelimited),e.fork();let s=a;switch(t.K){case ScalarType.INT32:case ScalarType.FIXED32:case ScalarType.UINT32:case ScalarType.SFIXED32:case ScalarType.SINT32:s=Number.parseInt(a);break;case ScalarType.BOOL:assert("true"==a||"false"==a),s="true"==a}switch(this.scalar(e,t.K,1,s,!0),t.V.kind){case"scalar":this.scalar(e,t.V.T,2,n,!0);break;case"enum":this.scalar(e,ScalarType.INT32,2,n,!0);break;case"message":this.message(e,r,t.V.T(),2,n)}e.join()}message(e,r,t,a,n){void 0!==n&&(t.internalBinaryWrite(n,e.tag(a,WireType.LengthDelimited).fork(),r),e.join())}scalar(e,r,t,a,n){var[r,s,i]=this.scalarInfo(r,a);i&&!n||(e.tag(t,r),e[s](a))}packed(r,e,t,a){if(a.length){assert(e!==ScalarType.BYTES&&e!==ScalarType.STRING),r.tag(t,WireType.LengthDelimited),r.fork();var[,n]=this.scalarInfo(e);for(let e=0;e<a.length;e++)r[n](a[e]);r.join()}}scalarInfo(e,r){let t=WireType.Varint,a;var n=void 0===r;let s=0===r;switch(e){case ScalarType.INT32:a="int32";break;case ScalarType.STRING:s=n||!r.length,t=WireType.LengthDelimited,a="string";break;case ScalarType.BOOL:s=!1===r,a="bool";break;case ScalarType.UINT32:a="uint32";break;case ScalarType.DOUBLE:t=WireType.Bit64,a="double";break;case ScalarType.FLOAT:t=WireType.Bit32,a="float";break;case ScalarType.INT64:s=n||PbLong.from(r).isZero(),a="int64";break;case ScalarType.UINT64:s=n||PbULong.from(r).isZero(),a="uint64";break;case ScalarType.FIXED64:s=n||PbULong.from(r).isZero(),t=WireType.Bit64,a="fixed64";break;case ScalarType.BYTES:s=n||!r.byteLength,t=WireType.LengthDelimited,a="bytes";break;case ScalarType.FIXED32:t=WireType.Bit32,a="fixed32";break;case ScalarType.SFIXED32:t=WireType.Bit32,a="sfixed32";break;case ScalarType.SFIXED64:s=n||PbLong.from(r).isZero(),t=WireType.Bit64,a="sfixed64";break;case ScalarType.SINT32:a="sint32";break;case ScalarType.SINT64:s=n||PbLong.from(r).isZero(),a="sint64"}return[t,a,n||s]}}function reflectionCreate(e){var r,t={};Object.defineProperty(t,MESSAGE_TYPE,{enumerable:!1,value:e});for(r of e.fields){var a=r.localName;if(!r.opt)if(r.oneof)t[r.oneof]={oneofKind:void 0};else if(r.repeat)t[a]=[];else switch(r.kind){case"scalar":t[a]=reflectionScalarDefault(r.T,r.L);break;case"enum":t[a]=0;break;case"map":t[a]={}}}return t}function reflectionMergePartial(e,r,t){let a,n=t,s;for(var i of e.fields){var o=i.localName;if(i.oneof){var l=n[i.oneof];if(void 0===l)continue;if(a=l[o],(s=r[i.oneof]).oneofKind=l.oneofKind,void 0===a){delete s[o];continue}}else if(a=n[o],s=r,void 0===a)continue;switch(i.kind){case"scalar":case"enum":i.repeat?s[o]=a.concat():s[o]=a;break;case"message":var c=i.T();if(i.repeat)for(let e=0;e<a.length;e++)s[o][e]=c.create(a[e]);else void 0===s[o]?s[o]=c.create(a):c.mergePartial(s[o],a);break;case"map":switch(i.V.kind){case"scalar":case"enum":Object.assign(s[o],a);break;case"message":var u,f=i.V.T();for(u of Object.keys(a))s[o][u]=f.create(a[u])}}}}const defaultsWrite={emitDefaultValues:!1,enumAsInteger:!1,useProtoFieldName:!1,prettySpaces:0},defaultsRead={ignoreUnknownFields:!1};function jsonReadOptions(e){return e?__spreadValues(__spreadValues({},defaultsRead),e):defaultsRead}function jsonWriteOptions(e){return e?__spreadValues(__spreadValues({},defaultsWrite),e):defaultsWrite}function reflectionEquals(e,r,t){if(r!==t){if(!r||!t)return!1;for(var a of e.fields){var n=a.localName,s=(a.oneof?r[a.oneof]:r)[n],i=(a.oneof?t[a.oneof]:t)[n];switch(a.kind){case"enum":case"scalar":var o="enum"==a.kind?ScalarType.INT32:a.T;if((a.repeat?repeatedPrimitiveEq:primitiveEq)(o,s,i))break;return!1;case"map":if("message"==a.V.kind?repeatedMsgEq(a.V.T(),objectValues(s),objectValues(i)):repeatedPrimitiveEq("enum"==a.V.kind?ScalarType.INT32:a.V.T,objectValues(s),objectValues(i)))break;return!1;case"message":o=a.T();if(a.repeat?repeatedMsgEq(o,s,i):o.equals(s,i))break;return!1}}}return!0}const objectValues=Object.values;function primitiveEq(e,r,t){if(r!==t){if(e!==ScalarType.BYTES)return!1;var a=r,n=t;if(a.length!==n.length)return!1;for(let e=0;e<a.length;e++)if(a[e]!=n[e])return!1}return!0}function repeatedPrimitiveEq(r,t,a){if(t.length!==a.length)return!1;for(let e=0;e<t.length;e++)if(!primitiveEq(r,t[e],a[e]))return!1;return!0}function repeatedMsgEq(r,t,a){if(t.length!==a.length)return!1;for(let e=0;e<t.length;e++)if(!r.equals(t[e],a[e]))return!1;return!0}class MessageType{constructor(e,r,t){this.defaultCheckDepth=16,this.typeName=e,this.fields=r.map(normalizeFieldInfo),this.options=null!=t?t:{},this.refTypeCheck=new ReflectionTypeCheck(this),this.refJsonReader=new ReflectionJsonReader(this),this.refJsonWriter=new ReflectionJsonWriter(this),this.refBinReader=new ReflectionBinaryReader(this),this.refBinWriter=new ReflectionBinaryWriter(this)}create(e){var r=reflectionCreate(this);return void 0!==e&&reflectionMergePartial(this,r,e),r}clone(e){var r=this.create();return reflectionMergePartial(this,r,e),r}equals(e,r){return reflectionEquals(this,e,r)}is(e,r=this.defaultCheckDepth){return this.refTypeCheck.is(e,r,!1)}isAssignable(e,r=this.defaultCheckDepth){return this.refTypeCheck.is(e,r,!0)}mergePartial(e,r){reflectionMergePartial(this,e,r)}fromBinary(e,r){r=binaryReadOptions(r);return this.internalBinaryRead(r.readerFactory(e),e.byteLength,r)}fromJson(e,r){return this.internalJsonRead(e,jsonReadOptions(r))}fromJsonString(e,r){e=JSON.parse(e);return this.fromJson(e,r)}toJson(e,r){return this.internalJsonWrite(e,jsonWriteOptions(r))}toJsonString(e,r){var e=this.toJson(e,r);return JSON.stringify(e,null,null!=(e=null==r?void 0:r.prettySpaces)?e:0)}toBinary(e,r){r=binaryWriteOptions(r);return this.internalBinaryWrite(e,r.writerFactory(),r).finish()}internalJsonRead(e,r,t){if(null===e||"object"!=typeof e||Array.isArray(e))throw new Error(`Unable to parse message ${this.typeName} from JSON ${typeofJsonValue(e)}.`);return t=null!=t?t:this.create(),this.refJsonReader.read(e,t,r),t}internalJsonWrite(e,r){return this.refJsonWriter.write(e,r)}internalBinaryWrite(e,r,t){return this.refBinWriter.write(e,r,t),r}internalBinaryRead(e,r,t,a){a=null!=a?a:this.create();return this.refBinReader.read(e,a,t,r),a}}
					/******************  initialization finish  *******************/
					switch (FORMAT) {
						case "application/grpc":
							/******************  initialization start  *******************/
							// pako 2.0.4
							!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).pako={})}(this,(function(t){"use strict";function e(t){let e=t.length;for(;--e>=0;)t[e]=0}const a=256,i=286,n=30,s=15,r=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),l=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]),o=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]),h=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),d=new Array(576);e(d);const _=new Array(60);e(_);const f=new Array(512);e(f);const c=new Array(256);e(c);const u=new Array(29);e(u);const w=new Array(n);function b(t,e,a,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}let g,p,m;function k(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}e(w);const v=t=>t<256?f[t]:f[256+(t>>>7)],y=(t,e)=>{t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255},x=(t,e,a)=>{t.bi_valid>16-a?(t.bi_buf|=e<<t.bi_valid&65535,y(t,t.bi_buf),t.bi_buf=e>>16-t.bi_valid,t.bi_valid+=a-16):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)},z=(t,e,a)=>{x(t,a[2*e],a[2*e+1])},A=(t,e)=>{let a=0;do{a|=1&t,t>>>=1,a<<=1}while(--e>0);return a>>>1},E=(t,e,a)=>{const i=new Array(16);let n,r,l=0;for(n=1;n<=s;n++)i[n]=l=l+a[n-1]<<1;for(r=0;r<=e;r++){let e=t[2*r+1];0!==e&&(t[2*r]=A(i[e]++,e))}},R=t=>{let e;for(e=0;e<i;e++)t.dyn_ltree[2*e]=0;for(e=0;e<n;e++)t.dyn_dtree[2*e]=0;for(e=0;e<19;e++)t.bl_tree[2*e]=0;t.dyn_ltree[512]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0},Z=t=>{t.bi_valid>8?y(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0},U=(t,e,a,i)=>{const n=2*e,s=2*a;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[a]},S=(t,e,a)=>{const i=t.heap[a];let n=a<<1;for(;n<=t.heap_len&&(n<t.heap_len&&U(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!U(e,i,t.heap[n],t.depth));)t.heap[a]=t.heap[n],a=n,n<<=1;t.heap[a]=i},D=(t,e,i)=>{let n,s,o,h,d=0;if(0!==t.last_lit)do{n=t.pending_buf[t.d_buf+2*d]<<8|t.pending_buf[t.d_buf+2*d+1],s=t.pending_buf[t.l_buf+d],d++,0===n?z(t,s,e):(o=c[s],z(t,o+a+1,e),h=r[o],0!==h&&(s-=u[o],x(t,s,h)),n--,o=v(n),z(t,o,i),h=l[o],0!==h&&(n-=w[o],x(t,n,h)))}while(d<t.last_lit);z(t,256,e)},T=(t,e)=>{const a=e.dyn_tree,i=e.stat_desc.static_tree,n=e.stat_desc.has_stree,r=e.stat_desc.elems;let l,o,h,d=-1;for(t.heap_len=0,t.heap_max=573,l=0;l<r;l++)0!==a[2*l]?(t.heap[++t.heap_len]=d=l,t.depth[l]=0):a[2*l+1]=0;for(;t.heap_len<2;)h=t.heap[++t.heap_len]=d<2?++d:0,a[2*h]=1,t.depth[h]=0,t.opt_len--,n&&(t.static_len-=i[2*h+1]);for(e.max_code=d,l=t.heap_len>>1;l>=1;l--)S(t,a,l);h=r;do{l=t.heap[1],t.heap[1]=t.heap[t.heap_len--],S(t,a,1),o=t.heap[1],t.heap[--t.heap_max]=l,t.heap[--t.heap_max]=o,a[2*h]=a[2*l]+a[2*o],t.depth[h]=(t.depth[l]>=t.depth[o]?t.depth[l]:t.depth[o])+1,a[2*l+1]=a[2*o+1]=h,t.heap[1]=h++,S(t,a,1)}while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],((t,e)=>{const a=e.dyn_tree,i=e.max_code,n=e.stat_desc.static_tree,r=e.stat_desc.has_stree,l=e.stat_desc.extra_bits,o=e.stat_desc.extra_base,h=e.stat_desc.max_length;let d,_,f,c,u,w,b=0;for(c=0;c<=s;c++)t.bl_count[c]=0;for(a[2*t.heap[t.heap_max]+1]=0,d=t.heap_max+1;d<573;d++)_=t.heap[d],c=a[2*a[2*_+1]+1]+1,c>h&&(c=h,b++),a[2*_+1]=c,_>i||(t.bl_count[c]++,u=0,_>=o&&(u=l[_-o]),w=a[2*_],t.opt_len+=w*(c+u),r&&(t.static_len+=w*(n[2*_+1]+u)));if(0!==b){do{for(c=h-1;0===t.bl_count[c];)c--;t.bl_count[c]--,t.bl_count[c+1]+=2,t.bl_count[h]--,b-=2}while(b>0);for(c=h;0!==c;c--)for(_=t.bl_count[c];0!==_;)f=t.heap[--d],f>i||(a[2*f+1]!==c&&(t.opt_len+=(c-a[2*f+1])*a[2*f],a[2*f+1]=c),_--)}})(t,e),E(a,d,t.bl_count)},O=(t,e,a)=>{let i,n,s=-1,r=e[1],l=0,o=7,h=4;for(0===r&&(o=138,h=3),e[2*(a+1)+1]=65535,i=0;i<=a;i++)n=r,r=e[2*(i+1)+1],++l<o&&n===r||(l<h?t.bl_tree[2*n]+=l:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[32]++):l<=10?t.bl_tree[34]++:t.bl_tree[36]++,l=0,s=n,0===r?(o=138,h=3):n===r?(o=6,h=3):(o=7,h=4))},I=(t,e,a)=>{let i,n,s=-1,r=e[1],l=0,o=7,h=4;for(0===r&&(o=138,h=3),i=0;i<=a;i++)if(n=r,r=e[2*(i+1)+1],!(++l<o&&n===r)){if(l<h)do{z(t,n,t.bl_tree)}while(0!=--l);else 0!==n?(n!==s&&(z(t,n,t.bl_tree),l--),z(t,16,t.bl_tree),x(t,l-3,2)):l<=10?(z(t,17,t.bl_tree),x(t,l-3,3)):(z(t,18,t.bl_tree),x(t,l-11,7));l=0,s=n,0===r?(o=138,h=3):n===r?(o=6,h=3):(o=7,h=4)}};let F=!1;const L=(t,e,a,i)=>{x(t,0+(i?1:0),3),((t,e,a,i)=>{Z(t),i&&(y(t,a),y(t,~a)),t.pending_buf.set(t.window.subarray(e,e+a),t.pending),t.pending+=a})(t,e,a,!0)};var N={_tr_init:t=>{F||((()=>{let t,e,a,h,k;const v=new Array(16);for(a=0,h=0;h<28;h++)for(u[h]=a,t=0;t<1<<r[h];t++)c[a++]=h;for(c[a-1]=h,k=0,h=0;h<16;h++)for(w[h]=k,t=0;t<1<<l[h];t++)f[k++]=h;for(k>>=7;h<n;h++)for(w[h]=k<<7,t=0;t<1<<l[h]-7;t++)f[256+k++]=h;for(e=0;e<=s;e++)v[e]=0;for(t=0;t<=143;)d[2*t+1]=8,t++,v[8]++;for(;t<=255;)d[2*t+1]=9,t++,v[9]++;for(;t<=279;)d[2*t+1]=7,t++,v[7]++;for(;t<=287;)d[2*t+1]=8,t++,v[8]++;for(E(d,287,v),t=0;t<n;t++)_[2*t+1]=5,_[2*t]=A(t,5);g=new b(d,r,257,i,s),p=new b(_,l,0,n,s),m=new b(new Array(0),o,0,19,7)})(),F=!0),t.l_desc=new k(t.dyn_ltree,g),t.d_desc=new k(t.dyn_dtree,p),t.bl_desc=new k(t.bl_tree,m),t.bi_buf=0,t.bi_valid=0,R(t)},_tr_stored_block:L,_tr_flush_block:(t,e,i,n)=>{let s,r,l=0;t.level>0?(2===t.strm.data_type&&(t.strm.data_type=(t=>{let e,i=4093624447;for(e=0;e<=31;e++,i>>>=1)if(1&i&&0!==t.dyn_ltree[2*e])return 0;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return 1;for(e=32;e<a;e++)if(0!==t.dyn_ltree[2*e])return 1;return 0})(t)),T(t,t.l_desc),T(t,t.d_desc),l=(t=>{let e;for(O(t,t.dyn_ltree,t.l_desc.max_code),O(t,t.dyn_dtree,t.d_desc.max_code),T(t,t.bl_desc),e=18;e>=3&&0===t.bl_tree[2*h[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e})(t),s=t.opt_len+3+7>>>3,r=t.static_len+3+7>>>3,r<=s&&(s=r)):s=r=i+5,i+4<=s&&-1!==e?L(t,e,i,n):4===t.strategy||r===s?(x(t,2+(n?1:0),3),D(t,d,_)):(x(t,4+(n?1:0),3),((t,e,a,i)=>{let n;for(x(t,e-257,5),x(t,a-1,5),x(t,i-4,4),n=0;n<i;n++)x(t,t.bl_tree[2*h[n]+1],3);I(t,t.dyn_ltree,e-1),I(t,t.dyn_dtree,a-1)})(t,t.l_desc.max_code+1,t.d_desc.max_code+1,l+1),D(t,t.dyn_ltree,t.dyn_dtree)),R(t),n&&Z(t)},_tr_tally:(t,e,i)=>(t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&i,t.last_lit++,0===e?t.dyn_ltree[2*i]++:(t.matches++,e--,t.dyn_ltree[2*(c[i]+a+1)]++,t.dyn_dtree[2*v(e)]++),t.last_lit===t.lit_bufsize-1),_tr_align:t=>{x(t,2,3),z(t,256,d),(t=>{16===t.bi_valid?(y(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)})(t)}};var B=(t,e,a,i)=>{let n=65535&t|0,s=t>>>16&65535|0,r=0;for(;0!==a;){r=a>2e3?2e3:a,a-=r;do{n=n+e[i++]|0,s=s+n|0}while(--r);n%=65521,s%=65521}return n|s<<16|0};const C=new Uint32Array((()=>{let t,e=[];for(var a=0;a<256;a++){t=a;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e})());var M=(t,e,a,i)=>{const n=C,s=i+a;t^=-1;for(let a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t},H={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"},j={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_MEM_ERROR:-4,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};const{_tr_init:K,_tr_stored_block:P,_tr_flush_block:Y,_tr_tally:G,_tr_align:X}=N,{Z_NO_FLUSH:W,Z_PARTIAL_FLUSH:q,Z_FULL_FLUSH:J,Z_FINISH:Q,Z_BLOCK:V,Z_OK:$,Z_STREAM_END:tt,Z_STREAM_ERROR:et,Z_DATA_ERROR:at,Z_BUF_ERROR:it,Z_DEFAULT_COMPRESSION:nt,Z_FILTERED:st,Z_HUFFMAN_ONLY:rt,Z_RLE:lt,Z_FIXED:ot,Z_DEFAULT_STRATEGY:ht,Z_UNKNOWN:dt,Z_DEFLATED:_t}=j,ft=258,ct=262,ut=103,wt=113,bt=666,gt=(t,e)=>(t.msg=H[e],e),pt=t=>(t<<1)-(t>4?9:0),mt=t=>{let e=t.length;for(;--e>=0;)t[e]=0};let kt=(t,e,a)=>(e<<t.hash_shift^a)&t.hash_mask;const vt=t=>{const e=t.state;let a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(t.output.set(e.pending_buf.subarray(e.pending_out,e.pending_out+a),t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))},yt=(t,e)=>{Y(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,vt(t.strm)},xt=(t,e)=>{t.pending_buf[t.pending++]=e},zt=(t,e)=>{t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e},At=(t,e,a,i)=>{let n=t.avail_in;return n>i&&(n=i),0===n?0:(t.avail_in-=n,e.set(t.input.subarray(t.next_in,t.next_in+n),a),1===t.state.wrap?t.adler=B(t.adler,e,n,a):2===t.state.wrap&&(t.adler=M(t.adler,e,n,a)),t.next_in+=n,t.total_in+=n,n)},Et=(t,e)=>{let a,i,n=t.max_chain_length,s=t.strstart,r=t.prev_length,l=t.nice_match;const o=t.strstart>t.w_size-ct?t.strstart-(t.w_size-ct):0,h=t.window,d=t.w_mask,_=t.prev,f=t.strstart+ft;let c=h[s+r-1],u=h[s+r];t.prev_length>=t.good_match&&(n>>=2),l>t.lookahead&&(l=t.lookahead);do{if(a=e,h[a+r]===u&&h[a+r-1]===c&&h[a]===h[s]&&h[++a]===h[s+1]){s+=2,a++;do{}while(h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&h[++s]===h[++a]&&s<f);if(i=ft-(f-s),s=f-ft,i>r){if(t.match_start=e,r=i,i>=l)break;c=h[s+r-1],u=h[s+r]}}}while((e=_[e&d])>o&&0!=--n);return r<=t.lookahead?r:t.lookahead},Rt=t=>{const e=t.w_size;let a,i,n,s,r;do{if(s=t.window_size-t.lookahead-t.strstart,t.strstart>=e+(e-ct)){t.window.set(t.window.subarray(e,e+e),0),t.match_start-=e,t.strstart-=e,t.block_start-=e,i=t.hash_size,a=i;do{n=t.head[--a],t.head[a]=n>=e?n-e:0}while(--i);i=e,a=i;do{n=t.prev[--a],t.prev[a]=n>=e?n-e:0}while(--i);s+=e}if(0===t.strm.avail_in)break;if(i=At(t.strm,t.window,t.strstart+t.lookahead,s),t.lookahead+=i,t.lookahead+t.insert>=3)for(r=t.strstart-t.insert,t.ins_h=t.window[r],t.ins_h=kt(t,t.ins_h,t.window[r+1]);t.insert&&(t.ins_h=kt(t,t.ins_h,t.window[r+3-1]),t.prev[r&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=r,r++,t.insert--,!(t.lookahead+t.insert<3)););}while(t.lookahead<ct&&0!==t.strm.avail_in)},Zt=(t,e)=>{let a,i;for(;;){if(t.lookahead<ct){if(Rt(t),t.lookahead<ct&&e===W)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=kt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ct&&(t.match_length=Et(t,a)),t.match_length>=3)if(i=G(t,t.strstart-t.match_start,t.match_length-3),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=3){t.match_length--;do{t.strstart++,t.ins_h=kt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart}while(0!=--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=kt(t,t.ins_h,t.window[t.strstart+1]);else i=G(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(yt(t,!1),0===t.strm.avail_out))return 1}return t.insert=t.strstart<2?t.strstart:2,e===Q?(yt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(yt(t,!1),0===t.strm.avail_out)?1:2},Ut=(t,e)=>{let a,i,n;for(;;){if(t.lookahead<ct){if(Rt(t),t.lookahead<ct&&e===W)return 1;if(0===t.lookahead)break}if(a=0,t.lookahead>=3&&(t.ins_h=kt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=2,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ct&&(t.match_length=Et(t,a),t.match_length<=5&&(t.strategy===st||3===t.match_length&&t.strstart-t.match_start>4096)&&(t.match_length=2)),t.prev_length>=3&&t.match_length<=t.prev_length){n=t.strstart+t.lookahead-3,i=G(t,t.strstart-1-t.prev_match,t.prev_length-3),t.lookahead-=t.prev_length-1,t.prev_length-=2;do{++t.strstart<=n&&(t.ins_h=kt(t,t.ins_h,t.window[t.strstart+3-1]),a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart)}while(0!=--t.prev_length);if(t.match_available=0,t.match_length=2,t.strstart++,i&&(yt(t,!1),0===t.strm.avail_out))return 1}else if(t.match_available){if(i=G(t,0,t.window[t.strstart-1]),i&&yt(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return 1}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=G(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<2?t.strstart:2,e===Q?(yt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(yt(t,!1),0===t.strm.avail_out)?1:2};function St(t,e,a,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=i,this.func=n}const Dt=[new St(0,0,0,0,((t,e)=>{let a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(Rt(t),0===t.lookahead&&e===W)return 1;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;const i=t.block_start+a;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,yt(t,!1),0===t.strm.avail_out))return 1;if(t.strstart-t.block_start>=t.w_size-ct&&(yt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===Q?(yt(t,!0),0===t.strm.avail_out?3:4):(t.strstart>t.block_start&&(yt(t,!1),t.strm.avail_out),1)})),new St(4,4,8,4,Zt),new St(4,5,16,8,Zt),new St(4,6,32,32,Zt),new St(4,4,16,16,Ut),new St(8,16,32,32,Ut),new St(8,16,128,128,Ut),new St(8,32,128,256,Ut),new St(32,128,258,1024,Ut),new St(32,258,258,4096,Ut)];function Tt(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=_t,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Uint16Array(1146),this.dyn_dtree=new Uint16Array(122),this.bl_tree=new Uint16Array(78),mt(this.dyn_ltree),mt(this.dyn_dtree),mt(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Uint16Array(16),this.heap=new Uint16Array(573),mt(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Uint16Array(573),mt(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}const Ot=t=>{if(!t||!t.state)return gt(t,et);t.total_in=t.total_out=0,t.data_type=dt;const e=t.state;return e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?42:wt,t.adler=2===e.wrap?0:1,e.last_flush=W,K(e),$},It=t=>{const e=Ot(t);var a;return e===$&&((a=t.state).window_size=2*a.w_size,mt(a.head),a.max_lazy_match=Dt[a.level].max_lazy,a.good_match=Dt[a.level].good_length,a.nice_match=Dt[a.level].nice_length,a.max_chain_length=Dt[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=2,a.match_available=0,a.ins_h=0),e},Ft=(t,e,a,i,n,s)=>{if(!t)return et;let r=1;if(e===nt&&(e=6),i<0?(r=0,i=-i):i>15&&(r=2,i-=16),n<1||n>9||a!==_t||i<8||i>15||e<0||e>9||s<0||s>ot)return gt(t,et);8===i&&(i=9);const l=new Tt;return t.state=l,l.strm=t,l.wrap=r,l.gzhead=null,l.w_bits=i,l.w_size=1<<l.w_bits,l.w_mask=l.w_size-1,l.hash_bits=n+7,l.hash_size=1<<l.hash_bits,l.hash_mask=l.hash_size-1,l.hash_shift=~~((l.hash_bits+3-1)/3),l.window=new Uint8Array(2*l.w_size),l.head=new Uint16Array(l.hash_size),l.prev=new Uint16Array(l.w_size),l.lit_bufsize=1<<n+6,l.pending_buf_size=4*l.lit_bufsize,l.pending_buf=new Uint8Array(l.pending_buf_size),l.d_buf=1*l.lit_bufsize,l.l_buf=3*l.lit_bufsize,l.level=e,l.strategy=s,l.method=a,It(t)};var Lt={deflateInit:(t,e)=>Ft(t,e,_t,15,8,ht),deflateInit2:Ft,deflateReset:It,deflateResetKeep:Ot,deflateSetHeader:(t,e)=>t&&t.state?2!==t.state.wrap?et:(t.state.gzhead=e,$):et,deflate:(t,e)=>{let a,i;if(!t||!t.state||e>V||e<0)return t?gt(t,et):et;const n=t.state;if(!t.output||!t.input&&0!==t.avail_in||n.status===bt&&e!==Q)return gt(t,0===t.avail_out?it:et);n.strm=t;const s=n.last_flush;if(n.last_flush=e,42===n.status)if(2===n.wrap)t.adler=0,xt(n,31),xt(n,139),xt(n,8),n.gzhead?(xt(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),xt(n,255&n.gzhead.time),xt(n,n.gzhead.time>>8&255),xt(n,n.gzhead.time>>16&255),xt(n,n.gzhead.time>>24&255),xt(n,9===n.level?2:n.strategy>=rt||n.level<2?4:0),xt(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(xt(n,255&n.gzhead.extra.length),xt(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(t.adler=M(t.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(xt(n,0),xt(n,0),xt(n,0),xt(n,0),xt(n,0),xt(n,9===n.level?2:n.strategy>=rt||n.level<2?4:0),xt(n,3),n.status=wt);else{let e=_t+(n.w_bits-8<<4)<<8,a=-1;a=n.strategy>=rt||n.level<2?0:n.level<6?1:6===n.level?2:3,e|=a<<6,0!==n.strstart&&(e|=32),e+=31-e%31,n.status=wt,zt(n,e),0!==n.strstart&&(zt(n,t.adler>>>16),zt(n,65535&t.adler)),t.adler=1}if(69===n.status)if(n.gzhead.extra){for(a=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>a&&(t.adler=M(t.adler,n.pending_buf,n.pending-a,a)),vt(t),a=n.pending,n.pending!==n.pending_buf_size));)xt(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>a&&(t.adler=M(t.adler,n.pending_buf,n.pending-a,a)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){a=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>a&&(t.adler=M(t.adler,n.pending_buf,n.pending-a,a)),vt(t),a=n.pending,n.pending===n.pending_buf_size)){i=1;break}i=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,xt(n,i)}while(0!==i);n.gzhead.hcrc&&n.pending>a&&(t.adler=M(t.adler,n.pending_buf,n.pending-a,a)),0===i&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){a=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>a&&(t.adler=M(t.adler,n.pending_buf,n.pending-a,a)),vt(t),a=n.pending,n.pending===n.pending_buf_size)){i=1;break}i=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,xt(n,i)}while(0!==i);n.gzhead.hcrc&&n.pending>a&&(t.adler=M(t.adler,n.pending_buf,n.pending-a,a)),0===i&&(n.status=ut)}else n.status=ut;if(n.status===ut&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&vt(t),n.pending+2<=n.pending_buf_size&&(xt(n,255&t.adler),xt(n,t.adler>>8&255),t.adler=0,n.status=wt)):n.status=wt),0!==n.pending){if(vt(t),0===t.avail_out)return n.last_flush=-1,$}else if(0===t.avail_in&&pt(e)<=pt(s)&&e!==Q)return gt(t,it);if(n.status===bt&&0!==t.avail_in)return gt(t,it);if(0!==t.avail_in||0!==n.lookahead||e!==W&&n.status!==bt){let a=n.strategy===rt?((t,e)=>{let a;for(;;){if(0===t.lookahead&&(Rt(t),0===t.lookahead)){if(e===W)return 1;break}if(t.match_length=0,a=G(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(yt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===Q?(yt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(yt(t,!1),0===t.strm.avail_out)?1:2})(n,e):n.strategy===lt?((t,e)=>{let a,i,n,s;const r=t.window;for(;;){if(t.lookahead<=ft){if(Rt(t),t.lookahead<=ft&&e===W)return 1;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=3&&t.strstart>0&&(n=t.strstart-1,i=r[n],i===r[++n]&&i===r[++n]&&i===r[++n])){s=t.strstart+ft;do{}while(i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&i===r[++n]&&n<s);t.match_length=ft-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=3?(a=G(t,1,t.match_length-3),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=G(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(yt(t,!1),0===t.strm.avail_out))return 1}return t.insert=0,e===Q?(yt(t,!0),0===t.strm.avail_out?3:4):t.last_lit&&(yt(t,!1),0===t.strm.avail_out)?1:2})(n,e):Dt[n.level].func(n,e);if(3!==a&&4!==a||(n.status=bt),1===a||3===a)return 0===t.avail_out&&(n.last_flush=-1),$;if(2===a&&(e===q?X(n):e!==V&&(P(n,0,0,!1),e===J&&(mt(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),vt(t),0===t.avail_out))return n.last_flush=-1,$}return e!==Q?$:n.wrap<=0?tt:(2===n.wrap?(xt(n,255&t.adler),xt(n,t.adler>>8&255),xt(n,t.adler>>16&255),xt(n,t.adler>>24&255),xt(n,255&t.total_in),xt(n,t.total_in>>8&255),xt(n,t.total_in>>16&255),xt(n,t.total_in>>24&255)):(zt(n,t.adler>>>16),zt(n,65535&t.adler)),vt(t),n.wrap>0&&(n.wrap=-n.wrap),0!==n.pending?$:tt)},deflateEnd:t=>{if(!t||!t.state)return et;const e=t.state.status;return 42!==e&&69!==e&&73!==e&&91!==e&&e!==ut&&e!==wt&&e!==bt?gt(t,et):(t.state=null,e===wt?gt(t,at):$)},deflateSetDictionary:(t,e)=>{let a=e.length;if(!t||!t.state)return et;const i=t.state,n=i.wrap;if(2===n||1===n&&42!==i.status||i.lookahead)return et;if(1===n&&(t.adler=B(t.adler,e,a,0)),i.wrap=0,a>=i.w_size){0===n&&(mt(i.head),i.strstart=0,i.block_start=0,i.insert=0);let t=new Uint8Array(i.w_size);t.set(e.subarray(a-i.w_size,a),0),e=t,a=i.w_size}const s=t.avail_in,r=t.next_in,l=t.input;for(t.avail_in=a,t.next_in=0,t.input=e,Rt(i);i.lookahead>=3;){let t=i.strstart,e=i.lookahead-2;do{i.ins_h=kt(i,i.ins_h,i.window[t+3-1]),i.prev[t&i.w_mask]=i.head[i.ins_h],i.head[i.ins_h]=t,t++}while(--e);i.strstart=t,i.lookahead=2,Rt(i)}return i.strstart+=i.lookahead,i.block_start=i.strstart,i.insert=i.lookahead,i.lookahead=0,i.match_length=i.prev_length=2,i.match_available=0,t.next_in=r,t.input=l,t.avail_in=s,i.wrap=n,$},deflateInfo:"pako deflate (from Nodeca project)"};const Nt=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var Bt=function(t){const e=Array.prototype.slice.call(arguments,1);for(;e.length;){const a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(const e in a)Nt(a,e)&&(t[e]=a[e])}}return t},Ct=t=>{let e=0;for(let a=0,i=t.length;a<i;a++)e+=t[a].length;const a=new Uint8Array(e);for(let e=0,i=0,n=t.length;e<n;e++){let n=t[e];a.set(n,i),i+=n.length}return a};let Mt=!0;try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){Mt=!1}const Ht=new Uint8Array(256);for(let t=0;t<256;t++)Ht[t]=t>=252?6:t>=248?5:t>=240?4:t>=224?3:t>=192?2:1;Ht[254]=Ht[254]=1;var jt=t=>{if("function"==typeof TextEncoder&&TextEncoder.prototype.encode)return(new TextEncoder).encode(t);let e,a,i,n,s,r=t.length,l=0;for(n=0;n<r;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),l+=a<128?1:a<2048?2:a<65536?3:4;for(e=new Uint8Array(l),s=0,n=0;s<l;n++)a=t.charCodeAt(n),55296==(64512&a)&&n+1<r&&(i=t.charCodeAt(n+1),56320==(64512&i)&&(a=65536+(a-55296<<10)+(i-56320),n++)),a<128?e[s++]=a:a<2048?(e[s++]=192|a>>>6,e[s++]=128|63&a):a<65536?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},Kt=(t,e)=>{const a=e||t.length;if("function"==typeof TextDecoder&&TextDecoder.prototype.decode)return(new TextDecoder).decode(t.subarray(0,e));let i,n;const s=new Array(2*a);for(n=0,i=0;i<a;){let e=t[i++];if(e<128){s[n++]=e;continue}let r=Ht[e];if(r>4)s[n++]=65533,i+=r-1;else{for(e&=2===r?31:3===r?15:7;r>1&&i<a;)e=e<<6|63&t[i++],r--;r>1?s[n++]=65533:e<65536?s[n++]=e:(e-=65536,s[n++]=55296|e>>10&1023,s[n++]=56320|1023&e)}}return((t,e)=>{if(e<65534&&t.subarray&&Mt)return String.fromCharCode.apply(null,t.length===e?t:t.subarray(0,e));let a="";for(let i=0;i<e;i++)a+=String.fromCharCode(t[i]);return a})(s,n)},Pt=(t,e)=>{(e=e||t.length)>t.length&&(e=t.length);let a=e-1;for(;a>=0&&128==(192&t[a]);)a--;return a<0||0===a?e:a+Ht[t[a]]>e?a:e};var Yt=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0};const Gt=Object.prototype.toString,{Z_NO_FLUSH:Xt,Z_SYNC_FLUSH:Wt,Z_FULL_FLUSH:qt,Z_FINISH:Jt,Z_OK:Qt,Z_STREAM_END:Vt,Z_DEFAULT_COMPRESSION:$t,Z_DEFAULT_STRATEGY:te,Z_DEFLATED:ee}=j;function ae(t){this.options=Bt({level:$t,method:ee,chunkSize:16384,windowBits:15,memLevel:8,strategy:te},t||{});let e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new Yt,this.strm.avail_out=0;let a=Lt.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==Qt)throw new Error(H[a]);if(e.header&&Lt.deflateSetHeader(this.strm,e.header),e.dictionary){let t;if(t="string"==typeof e.dictionary?jt(e.dictionary):"[object ArrayBuffer]"===Gt.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,a=Lt.deflateSetDictionary(this.strm,t),a!==Qt)throw new Error(H[a]);this._dict_set=!0}}function ie(t,e){const a=new ae(e);if(a.push(t,!0),a.err)throw a.msg||H[a.err];return a.result}ae.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize;let n,s;if(this.ended)return!1;for(s=e===~~e?e:!0===e?Jt:Xt,"string"==typeof t?a.input=jt(t):"[object ArrayBuffer]"===Gt.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;)if(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),(s===Wt||s===qt)&&a.avail_out<=6)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else{if(n=Lt.deflate(a,s),n===Vt)return a.next_out>0&&this.onData(a.output.subarray(0,a.next_out)),n=Lt.deflateEnd(this.strm),this.onEnd(n),this.ended=!0,n===Qt;if(0!==a.avail_out){if(s>0&&a.next_out>0)this.onData(a.output.subarray(0,a.next_out)),a.avail_out=0;else if(0===a.avail_in)break}else this.onData(a.output)}return!0},ae.prototype.onData=function(t){this.chunks.push(t)},ae.prototype.onEnd=function(t){t===Qt&&(this.result=Ct(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var ne={Deflate:ae,deflate:ie,deflateRaw:function(t,e){return(e=e||{}).raw=!0,ie(t,e)},gzip:function(t,e){return(e=e||{}).gzip=!0,ie(t,e)},constants:j};var se=function(t,e){let a,i,n,s,r,l,o,h,d,_,f,c,u,w,b,g,p,m,k,v,y,x,z,A;const E=t.state;a=t.next_in,z=t.input,i=a+(t.avail_in-5),n=t.next_out,A=t.output,s=n-(e-t.avail_out),r=n+(t.avail_out-257),l=E.dmax,o=E.wsize,h=E.whave,d=E.wnext,_=E.window,f=E.hold,c=E.bits,u=E.lencode,w=E.distcode,b=(1<<E.lenbits)-1,g=(1<<E.distbits)-1;t:do{c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),p=u[f&b];e:for(;;){if(m=p>>>24,f>>>=m,c-=m,m=p>>>16&255,0===m)A[n++]=65535&p;else{if(!(16&m)){if(0==(64&m)){p=u[(65535&p)+(f&(1<<m)-1)];continue e}if(32&m){E.mode=12;break t}t.msg="invalid literal/length code",E.mode=30;break t}k=65535&p,m&=15,m&&(c<m&&(f+=z[a++]<<c,c+=8),k+=f&(1<<m)-1,f>>>=m,c-=m),c<15&&(f+=z[a++]<<c,c+=8,f+=z[a++]<<c,c+=8),p=w[f&g];a:for(;;){if(m=p>>>24,f>>>=m,c-=m,m=p>>>16&255,!(16&m)){if(0==(64&m)){p=w[(65535&p)+(f&(1<<m)-1)];continue a}t.msg="invalid distance code",E.mode=30;break t}if(v=65535&p,m&=15,c<m&&(f+=z[a++]<<c,c+=8,c<m&&(f+=z[a++]<<c,c+=8)),v+=f&(1<<m)-1,v>l){t.msg="invalid distance too far back",E.mode=30;break t}if(f>>>=m,c-=m,m=n-s,v>m){if(m=v-m,m>h&&E.sane){t.msg="invalid distance too far back",E.mode=30;break t}if(y=0,x=_,0===d){if(y+=o-m,m<k){k-=m;do{A[n++]=_[y++]}while(--m);y=n-v,x=A}}else if(d<m){if(y+=o+d-m,m-=d,m<k){k-=m;do{A[n++]=_[y++]}while(--m);if(y=0,d<k){m=d,k-=m;do{A[n++]=_[y++]}while(--m);y=n-v,x=A}}}else if(y+=d-m,m<k){k-=m;do{A[n++]=_[y++]}while(--m);y=n-v,x=A}for(;k>2;)A[n++]=x[y++],A[n++]=x[y++],A[n++]=x[y++],k-=3;k&&(A[n++]=x[y++],k>1&&(A[n++]=x[y++]))}else{y=n-v;do{A[n++]=A[y++],A[n++]=A[y++],A[n++]=A[y++],k-=3}while(k>2);k&&(A[n++]=A[y++],k>1&&(A[n++]=A[y++]))}break}}break}}while(a<i&&n<r);k=c>>3,a-=k,c-=k<<3,f&=(1<<c)-1,t.next_in=a,t.next_out=n,t.avail_in=a<i?i-a+5:5-(a-i),t.avail_out=n<r?r-n+257:257-(n-r),E.hold=f,E.bits=c};const re=15,le=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),oe=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78]),he=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),de=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]);var _e=(t,e,a,i,n,s,r,l)=>{const o=l.bits;let h,d,_,f,c,u,w=0,b=0,g=0,p=0,m=0,k=0,v=0,y=0,x=0,z=0,A=null,E=0;const R=new Uint16Array(16),Z=new Uint16Array(16);let U,S,D,T=null,O=0;for(w=0;w<=re;w++)R[w]=0;for(b=0;b<i;b++)R[e[a+b]]++;for(m=o,p=re;p>=1&&0===R[p];p--);if(m>p&&(m=p),0===p)return n[s++]=20971520,n[s++]=20971520,l.bits=1,0;for(g=1;g<p&&0===R[g];g++);for(m<g&&(m=g),y=1,w=1;w<=re;w++)if(y<<=1,y-=R[w],y<0)return-1;if(y>0&&(0===t||1!==p))return-1;for(Z[1]=0,w=1;w<re;w++)Z[w+1]=Z[w]+R[w];for(b=0;b<i;b++)0!==e[a+b]&&(r[Z[e[a+b]]++]=b);if(0===t?(A=T=r,u=19):1===t?(A=le,E-=257,T=oe,O-=257,u=256):(A=he,T=de,u=-1),z=0,b=0,w=g,c=s,k=m,v=0,_=-1,x=1<<m,f=x-1,1===t&&x>852||2===t&&x>592)return 1;for(;;){U=w-v,r[b]<u?(S=0,D=r[b]):r[b]>u?(S=T[O+r[b]],D=A[E+r[b]]):(S=96,D=0),h=1<<w-v,d=1<<k,g=d;do{d-=h,n[c+(z>>v)+d]=U<<24|S<<16|D|0}while(0!==d);for(h=1<<w-1;z&h;)h>>=1;if(0!==h?(z&=h-1,z+=h):z=0,b++,0==--R[w]){if(w===p)break;w=e[a+r[b]]}if(w>m&&(z&f)!==_){for(0===v&&(v=m),c+=g,k=w-v,y=1<<k;k+v<p&&(y-=R[k+v],!(y<=0));)k++,y<<=1;if(x+=1<<k,1===t&&x>852||2===t&&x>592)return 1;_=z&f,n[_]=m<<24|k<<16|c-s|0}}return 0!==z&&(n[c+z]=w-v<<24|64<<16|0),l.bits=m,0};const{Z_FINISH:fe,Z_BLOCK:ce,Z_TREES:ue,Z_OK:we,Z_STREAM_END:be,Z_NEED_DICT:ge,Z_STREAM_ERROR:pe,Z_DATA_ERROR:me,Z_MEM_ERROR:ke,Z_BUF_ERROR:ve,Z_DEFLATED:ye}=j,xe=12,ze=30,Ae=t=>(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24);function Ee(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}const Re=t=>{if(!t||!t.state)return pe;const e=t.state;return t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=1,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new Int32Array(852),e.distcode=e.distdyn=new Int32Array(592),e.sane=1,e.back=-1,we},Ze=t=>{if(!t||!t.state)return pe;const e=t.state;return e.wsize=0,e.whave=0,e.wnext=0,Re(t)},Ue=(t,e)=>{let a;if(!t||!t.state)return pe;const i=t.state;return e<0?(a=0,e=-e):(a=1+(e>>4),e<48&&(e&=15)),e&&(e<8||e>15)?pe:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=a,i.wbits=e,Ze(t))},Se=(t,e)=>{if(!t)return pe;const a=new Ee;t.state=a,a.window=null;const i=Ue(t,e);return i!==we&&(t.state=null),i};let De,Te,Oe=!0;const Ie=t=>{if(Oe){De=new Int32Array(512),Te=new Int32Array(32);let e=0;for(;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(_e(1,t.lens,0,288,De,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;_e(2,t.lens,0,32,Te,0,t.work,{bits:5}),Oe=!1}t.lencode=De,t.lenbits=9,t.distcode=Te,t.distbits=5},Fe=(t,e,a,i)=>{let n;const s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new Uint8Array(s.wsize)),i>=s.wsize?(s.window.set(e.subarray(a-s.wsize,a),0),s.wnext=0,s.whave=s.wsize):(n=s.wsize-s.wnext,n>i&&(n=i),s.window.set(e.subarray(a-i,a-i+n),s.wnext),(i-=n)?(s.window.set(e.subarray(a-i,a),0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0};var Le={inflateReset:Ze,inflateReset2:Ue,inflateResetKeep:Re,inflateInit:t=>Se(t,15),inflateInit2:Se,inflate:(t,e)=>{let a,i,n,s,r,l,o,h,d,_,f,c,u,w,b,g,p,m,k,v,y,x,z=0;const A=new Uint8Array(4);let E,R;const Z=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return pe;a=t.state,a.mode===xe&&(a.mode=13),r=t.next_out,n=t.output,o=t.avail_out,s=t.next_in,i=t.input,l=t.avail_in,h=a.hold,d=a.bits,_=l,f=o,x=we;t:for(;;)switch(a.mode){case 1:if(0===a.wrap){a.mode=13;break}for(;d<16;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(2&a.wrap&&35615===h){a.check=0,A[0]=255&h,A[1]=h>>>8&255,a.check=M(a.check,A,2,0),h=0,d=0,a.mode=2;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&h)<<8)+(h>>8))%31){t.msg="incorrect header check",a.mode=ze;break}if((15&h)!==ye){t.msg="unknown compression method",a.mode=ze;break}if(h>>>=4,d-=4,y=8+(15&h),0===a.wbits)a.wbits=y;else if(y>a.wbits){t.msg="invalid window size",a.mode=ze;break}a.dmax=1<<a.wbits,t.adler=a.check=1,a.mode=512&h?10:xe,h=0,d=0;break;case 2:for(;d<16;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(a.flags=h,(255&a.flags)!==ye){t.msg="unknown compression method",a.mode=ze;break}if(57344&a.flags){t.msg="unknown header flags set",a.mode=ze;break}a.head&&(a.head.text=h>>8&1),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,a.check=M(a.check,A,2,0)),h=0,d=0,a.mode=3;case 3:for(;d<32;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}a.head&&(a.head.time=h),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,A[2]=h>>>16&255,A[3]=h>>>24&255,a.check=M(a.check,A,4,0)),h=0,d=0,a.mode=4;case 4:for(;d<16;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}a.head&&(a.head.xflags=255&h,a.head.os=h>>8),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,a.check=M(a.check,A,2,0)),h=0,d=0,a.mode=5;case 5:if(1024&a.flags){for(;d<16;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}a.length=h,a.head&&(a.head.extra_len=h),512&a.flags&&(A[0]=255&h,A[1]=h>>>8&255,a.check=M(a.check,A,2,0)),h=0,d=0}else a.head&&(a.head.extra=null);a.mode=6;case 6:if(1024&a.flags&&(c=a.length,c>l&&(c=l),c&&(a.head&&(y=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Uint8Array(a.head.extra_len)),a.head.extra.set(i.subarray(s,s+c),y)),512&a.flags&&(a.check=M(a.check,i,c,s)),l-=c,s+=c,a.length-=c),a.length))break t;a.length=0,a.mode=7;case 7:if(2048&a.flags){if(0===l)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.name+=String.fromCharCode(y))}while(y&&c<l);if(512&a.flags&&(a.check=M(a.check,i,c,s)),l-=c,s+=c,y)break t}else a.head&&(a.head.name=null);a.length=0,a.mode=8;case 8:if(4096&a.flags){if(0===l)break t;c=0;do{y=i[s+c++],a.head&&y&&a.length<65536&&(a.head.comment+=String.fromCharCode(y))}while(y&&c<l);if(512&a.flags&&(a.check=M(a.check,i,c,s)),l-=c,s+=c,y)break t}else a.head&&(a.head.comment=null);a.mode=9;case 9:if(512&a.flags){for(;d<16;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(h!==(65535&a.check)){t.msg="header crc mismatch",a.mode=ze;break}h=0,d=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),t.adler=a.check=0,a.mode=xe;break;case 10:for(;d<32;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}t.adler=a.check=Ae(h),h=0,d=0,a.mode=11;case 11:if(0===a.havedict)return t.next_out=r,t.avail_out=o,t.next_in=s,t.avail_in=l,a.hold=h,a.bits=d,ge;t.adler=a.check=1,a.mode=xe;case xe:if(e===ce||e===ue)break t;case 13:if(a.last){h>>>=7&d,d-=7&d,a.mode=27;break}for(;d<3;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}switch(a.last=1&h,h>>>=1,d-=1,3&h){case 0:a.mode=14;break;case 1:if(Ie(a),a.mode=20,e===ue){h>>>=2,d-=2;break t}break;case 2:a.mode=17;break;case 3:t.msg="invalid block type",a.mode=ze}h>>>=2,d-=2;break;case 14:for(h>>>=7&d,d-=7&d;d<32;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if((65535&h)!=(h>>>16^65535)){t.msg="invalid stored block lengths",a.mode=ze;break}if(a.length=65535&h,h=0,d=0,a.mode=15,e===ue)break t;case 15:a.mode=16;case 16:if(c=a.length,c){if(c>l&&(c=l),c>o&&(c=o),0===c)break t;n.set(i.subarray(s,s+c),r),l-=c,s+=c,o-=c,r+=c,a.length-=c;break}a.mode=xe;break;case 17:for(;d<14;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(a.nlen=257+(31&h),h>>>=5,d-=5,a.ndist=1+(31&h),h>>>=5,d-=5,a.ncode=4+(15&h),h>>>=4,d-=4,a.nlen>286||a.ndist>30){t.msg="too many length or distance symbols",a.mode=ze;break}a.have=0,a.mode=18;case 18:for(;a.have<a.ncode;){for(;d<3;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}a.lens[Z[a.have++]]=7&h,h>>>=3,d-=3}for(;a.have<19;)a.lens[Z[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,E={bits:a.lenbits},x=_e(0,a.lens,0,19,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid code lengths set",a.mode=ze;break}a.have=0,a.mode=19;case 19:for(;a.have<a.nlen+a.ndist;){for(;z=a.lencode[h&(1<<a.lenbits)-1],b=z>>>24,g=z>>>16&255,p=65535&z,!(b<=d);){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(p<16)h>>>=b,d-=b,a.lens[a.have++]=p;else{if(16===p){for(R=b+2;d<R;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(h>>>=b,d-=b,0===a.have){t.msg="invalid bit length repeat",a.mode=ze;break}y=a.lens[a.have-1],c=3+(3&h),h>>>=2,d-=2}else if(17===p){for(R=b+3;d<R;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}h>>>=b,d-=b,y=0,c=3+(7&h),h>>>=3,d-=3}else{for(R=b+7;d<R;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}h>>>=b,d-=b,y=0,c=11+(127&h),h>>>=7,d-=7}if(a.have+c>a.nlen+a.ndist){t.msg="invalid bit length repeat",a.mode=ze;break}for(;c--;)a.lens[a.have++]=y}}if(a.mode===ze)break;if(0===a.lens[256]){t.msg="invalid code -- missing end-of-block",a.mode=ze;break}if(a.lenbits=9,E={bits:a.lenbits},x=_e(1,a.lens,0,a.nlen,a.lencode,0,a.work,E),a.lenbits=E.bits,x){t.msg="invalid literal/lengths set",a.mode=ze;break}if(a.distbits=6,a.distcode=a.distdyn,E={bits:a.distbits},x=_e(2,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,E),a.distbits=E.bits,x){t.msg="invalid distances set",a.mode=ze;break}if(a.mode=20,e===ue)break t;case 20:a.mode=21;case 21:if(l>=6&&o>=258){t.next_out=r,t.avail_out=o,t.next_in=s,t.avail_in=l,a.hold=h,a.bits=d,se(t,f),r=t.next_out,n=t.output,o=t.avail_out,s=t.next_in,i=t.input,l=t.avail_in,h=a.hold,d=a.bits,a.mode===xe&&(a.back=-1);break}for(a.back=0;z=a.lencode[h&(1<<a.lenbits)-1],b=z>>>24,g=z>>>16&255,p=65535&z,!(b<=d);){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(g&&0==(240&g)){for(m=b,k=g,v=p;z=a.lencode[v+((h&(1<<m+k)-1)>>m)],b=z>>>24,g=z>>>16&255,p=65535&z,!(m+b<=d);){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,a.back+=m}if(h>>>=b,d-=b,a.back+=b,a.length=p,0===g){a.mode=26;break}if(32&g){a.back=-1,a.mode=xe;break}if(64&g){t.msg="invalid literal/length code",a.mode=ze;break}a.extra=15&g,a.mode=22;case 22:if(a.extra){for(R=a.extra;d<R;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}a.length+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=23;case 23:for(;z=a.distcode[h&(1<<a.distbits)-1],b=z>>>24,g=z>>>16&255,p=65535&z,!(b<=d);){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(0==(240&g)){for(m=b,k=g,v=p;z=a.distcode[v+((h&(1<<m+k)-1)>>m)],b=z>>>24,g=z>>>16&255,p=65535&z,!(m+b<=d);){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}h>>>=m,d-=m,a.back+=m}if(h>>>=b,d-=b,a.back+=b,64&g){t.msg="invalid distance code",a.mode=ze;break}a.offset=p,a.extra=15&g,a.mode=24;case 24:if(a.extra){for(R=a.extra;d<R;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}a.offset+=h&(1<<a.extra)-1,h>>>=a.extra,d-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){t.msg="invalid distance too far back",a.mode=ze;break}a.mode=25;case 25:if(0===o)break t;if(c=f-o,a.offset>c){if(c=a.offset-c,c>a.whave&&a.sane){t.msg="invalid distance too far back",a.mode=ze;break}c>a.wnext?(c-=a.wnext,u=a.wsize-c):u=a.wnext-c,c>a.length&&(c=a.length),w=a.window}else w=n,u=r-a.offset,c=a.length;c>o&&(c=o),o-=c,a.length-=c;do{n[r++]=w[u++]}while(--c);0===a.length&&(a.mode=21);break;case 26:if(0===o)break t;n[r++]=a.length,o--,a.mode=21;break;case 27:if(a.wrap){for(;d<32;){if(0===l)break t;l--,h|=i[s++]<<d,d+=8}if(f-=o,t.total_out+=f,a.total+=f,f&&(t.adler=a.check=a.flags?M(a.check,n,f,r-f):B(a.check,n,f,r-f)),f=o,(a.flags?h:Ae(h))!==a.check){t.msg="incorrect data check",a.mode=ze;break}h=0,d=0}a.mode=28;case 28:if(a.wrap&&a.flags){for(;d<32;){if(0===l)break t;l--,h+=i[s++]<<d,d+=8}if(h!==(4294967295&a.total)){t.msg="incorrect length check",a.mode=ze;break}h=0,d=0}a.mode=29;case 29:x=be;break t;case ze:x=me;break t;case 31:return ke;case 32:default:return pe}return t.next_out=r,t.avail_out=o,t.next_in=s,t.avail_in=l,a.hold=h,a.bits=d,(a.wsize||f!==t.avail_out&&a.mode<ze&&(a.mode<27||e!==fe))&&Fe(t,t.output,t.next_out,f-t.avail_out),_-=t.avail_in,f-=t.avail_out,t.total_in+=_,t.total_out+=f,a.total+=f,a.wrap&&f&&(t.adler=a.check=a.flags?M(a.check,n,f,t.next_out-f):B(a.check,n,f,t.next_out-f)),t.data_type=a.bits+(a.last?64:0)+(a.mode===xe?128:0)+(20===a.mode||15===a.mode?256:0),(0===_&&0===f||e===fe)&&x===we&&(x=ve),x},inflateEnd:t=>{if(!t||!t.state)return pe;let e=t.state;return e.window&&(e.window=null),t.state=null,we},inflateGetHeader:(t,e)=>{if(!t||!t.state)return pe;const a=t.state;return 0==(2&a.wrap)?pe:(a.head=e,e.done=!1,we)},inflateSetDictionary:(t,e)=>{const a=e.length;let i,n,s;return t&&t.state?(i=t.state,0!==i.wrap&&11!==i.mode?pe:11===i.mode&&(n=1,n=B(n,e,a,0),n!==i.check)?me:(s=Fe(t,e,a,a),s?(i.mode=31,ke):(i.havedict=1,we))):pe},inflateInfo:"pako inflate (from Nodeca project)"};var Ne=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1};const Be=Object.prototype.toString,{Z_NO_FLUSH:Ce,Z_FINISH:Me,Z_OK:He,Z_STREAM_END:je,Z_NEED_DICT:Ke,Z_STREAM_ERROR:Pe,Z_DATA_ERROR:Ye,Z_MEM_ERROR:Ge}=j;function Xe(t){this.options=Bt({chunkSize:65536,windowBits:15,to:""},t||{});const e=this.options;e.raw&&e.windowBits>=0&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(e.windowBits>=0&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),e.windowBits>15&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new Yt,this.strm.avail_out=0;let a=Le.inflateInit2(this.strm,e.windowBits);if(a!==He)throw new Error(H[a]);if(this.header=new Ne,Le.inflateGetHeader(this.strm,this.header),e.dictionary&&("string"==typeof e.dictionary?e.dictionary=jt(e.dictionary):"[object ArrayBuffer]"===Be.call(e.dictionary)&&(e.dictionary=new Uint8Array(e.dictionary)),e.raw&&(a=Le.inflateSetDictionary(this.strm,e.dictionary),a!==He)))throw new Error(H[a])}function We(t,e){const a=new Xe(e);if(a.push(t),a.err)throw a.msg||H[a.err];return a.result}Xe.prototype.push=function(t,e){const a=this.strm,i=this.options.chunkSize,n=this.options.dictionary;let s,r,l;if(this.ended)return!1;for(r=e===~~e?e:!0===e?Me:Ce,"[object ArrayBuffer]"===Be.call(t)?a.input=new Uint8Array(t):a.input=t,a.next_in=0,a.avail_in=a.input.length;;){for(0===a.avail_out&&(a.output=new Uint8Array(i),a.next_out=0,a.avail_out=i),s=Le.inflate(a,r),s===Ke&&n&&(s=Le.inflateSetDictionary(a,n),s===He?s=Le.inflate(a,r):s===Ye&&(s=Ke));a.avail_in>0&&s===je&&a.state.wrap>0&&0!==t[a.next_in];)Le.inflateReset(a),s=Le.inflate(a,r);switch(s){case Pe:case Ye:case Ke:case Ge:return this.onEnd(s),this.ended=!0,!1}if(l=a.avail_out,a.next_out&&(0===a.avail_out||s===je))if("string"===this.options.to){let t=Pt(a.output,a.next_out),e=a.next_out-t,n=Kt(a.output,t);a.next_out=e,a.avail_out=i-e,e&&a.output.set(a.output.subarray(t,t+e),0),this.onData(n)}else this.onData(a.output.length===a.next_out?a.output:a.output.subarray(0,a.next_out));if(s!==He||0!==l){if(s===je)return s=Le.inflateEnd(this.strm),this.onEnd(s),this.ended=!0,!0;if(0===a.avail_in)break}}return!0},Xe.prototype.onData=function(t){this.chunks.push(t)},Xe.prototype.onEnd=function(t){t===He&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=Ct(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg};var qe={Inflate:Xe,inflate:We,inflateRaw:function(t,e){return(e=e||{}).raw=!0,We(t,e)},ungzip:We,constants:j};const{Deflate:Je,deflate:Qe,deflateRaw:Ve,gzip:$e}=ne,{Inflate:ta,inflate:ea,inflateRaw:aa,ungzip:ia}=qe;var na=Je,sa=Qe,ra=Ve,la=$e,oa=ta,ha=ea,da=aa,_a=ia,fa=j,ca={Deflate:na,deflate:sa,deflateRaw:ra,gzip:la,Inflate:oa,inflate:ha,inflateRaw:da,ungzip:_a,constants:fa};t.Deflate=na,t.Inflate=oa,t.constants=fa,t.default=ca,t.deflate=sa,t.deflateRaw=ra,t.gzip=la,t.inflate=ha,t.inflateRaw=da,t.ungzip=_a,Object.defineProperty(t,"__esModule",{value:!0})}));
							/******************  initialization finish  *******************/
							// 先拆分B站gRPC校验头和protobuf数据体
							let header = rawBody.slice(0, 5);
							body = rawBody.slice(5);
							// 处理request压缩protobuf数据体
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
									var CodeType;!function(CodeType){CodeType[CodeType.NOCODE=0]="NOCODE",CodeType[CodeType.CODE264=1]="CODE264",CodeType[CodeType.CODE265=2]="CODE265",CodeType[CodeType.CODEAV1=3]="CODEAV1"}(CodeType||(CodeType={}));
									/******************  initialization finish  *******************/
									switch (PATHs?.[0]) {
										case "bilibili.app.playerunite.v1.Player":
											/******************  initialization start  *******************/
											// protobuf/bilibili/app/playershared/playershared.proto
											class VideoVod$Type extends MessageType{constructor(){super("bilibili.playershared.VideoVod",[{no:1,name:"aid",kind:"scalar",T:5},{no:2,name:"cid",kind:"scalar",T:5},{no:3,name:"qn",kind:"scalar",T:4,L:2},{no:4,name:"fnver",kind:"scalar",T:5},{no:5,name:"fnval",kind:"scalar",T:5},{no:6,name:"download",kind:"scalar",T:13},{no:7,name:"force_host",kind:"scalar",T:5},{no:8,name:"fourk",kind:"scalar",T:8},{no:9,name:"prefer_codec_type",kind:"enum",T:()=>["bilibili.playershared.CodeType",CodeType]},{no:10,name:"voice_balance",kind:"scalar",T:4,L:2}])}create(value){const message={aid:0,cid:0,qn:0,fnver:0,fnval:0,download:0,forceHost:0,fourk:false,preferCodecType:0,voiceBalance:0};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.aid=reader.int32();break;case 2:message.cid=reader.int32();break;case 3:message.qn=reader.uint64().toNumber();break;case 4:message.fnver=reader.int32();break;case 5:message.fnval=reader.int32();break;case 6:message.download=reader.uint32();break;case 7:message.forceHost=reader.int32();break;case 8:message.fourk=reader.bool();break;case 9:message.preferCodecType=reader.int32();break;case 10:message.voiceBalance=reader.uint64().toNumber();break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.aid!==0)writer.tag(1,WireType.Varint).int32(message.aid);if(message.cid!==0)writer.tag(2,WireType.Varint).int32(message.cid);if(message.qn!==0)writer.tag(3,WireType.Varint).uint64(message.qn);if(message.fnver!==0)writer.tag(4,WireType.Varint).int32(message.fnver);if(message.fnval!==0)writer.tag(5,WireType.Varint).int32(message.fnval);if(message.download!==0)writer.tag(6,WireType.Varint).uint32(message.download);if(message.forceHost!==0)writer.tag(7,WireType.Varint).int32(message.forceHost);if(message.fourk!==false)writer.tag(8,WireType.Varint).bool(message.fourk);if(message.preferCodecType!==0)writer.tag(9,WireType.Varint).int32(message.preferCodecType);if(message.voiceBalance!==0)writer.tag(10,WireType.Varint).uint64(message.voiceBalance);let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
											const VideoVod = new VideoVod$Type();
											/******************  initialization finish  *******************/
											switch (PATHs?.[1]) {
												case "PlayViewUnite": { // 播放地址
													/******************  initialization start  *******************/
													// protobuf/bilibili/app/playerunite/playerunite.proto
													class PlayViewUniteReq$Type extends MessageType{constructor(){super("bilibili.app.playerunite.v1.PlayViewUniteReq",[{no:1,name:"vod",kind:"message",T:()=>VideoVod},{no:2,name:"spmid",kind:"scalar",T:9},{no:3,name:"from_spmid",kind:"scalar",T:9},{no:4,name:"extra_content",kind:"map",K:9,V:{kind:"scalar",T:9}}])}create(value){const message={spmid:"",fromSpmid:"",extraContent:{}};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.vod=VideoVod.internalBinaryRead(reader,reader.uint32(),options,message.vod);break;case 2:message.spmid=reader.string();break;case 3:message.fromSpmid=reader.string();break;case 4:this.binaryReadMap4(message.extraContent,reader,options);break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}binaryReadMap4(map,reader,options){let len=reader.uint32(),end=reader.pos+len,key,val;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:key=reader.string();break;case 2:val=reader.string();break;default:throw new globalThis.Error("unknown map entry field for field bilibili.app.playerunite.v1.PlayViewUniteReq.extra_content")}}map[key??""]=val??""}internalBinaryWrite(message,writer,options){if(message.vod)VideoVod.internalBinaryWrite(message.vod,writer.tag(1,WireType.LengthDelimited).fork(),options).join();if(message.spmid!=="")writer.tag(2,WireType.LengthDelimited).string(message.spmid);if(message.fromSpmid!=="")writer.tag(3,WireType.LengthDelimited).string(message.fromSpmid);for(let k of Object.keys(message.extraContent))writer.tag(4,WireType.LengthDelimited).fork().tag(1,WireType.LengthDelimited).string(k).tag(2,WireType.LengthDelimited).string(message.extraContent[k]).join();let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
													const PlayViewUniteReq = new PlayViewUniteReq$Type();
													/******************  initialization finish  *******************/
													let data = PlayViewUniteReq.fromBinary(body);
													$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
													let UF = UnknownFieldHandler.list(data);
													//$.log(`🚧 ${$.name}`, `UF: ${JSON.stringify(UF)}`, "");
													if (UF) {
														UF = UF.map(uf => {
															//uf.no; // 22
															//uf.wireType; // WireType.Varint
															// use the binary reader to decode the raw data:
															let reader = new BinaryReader(uf.data);
															let addedNumber = reader.int32(); // 7777
															$.log(`🚧 ${$.name}`, `no: ${uf.no}, wireType: ${uf.wireType}, reader: ${reader}, addedNumber: ${addedNumber}`, "");
														});
													};
													data.vod.forceHost = Settings?.ForceHost ?? 1;
													body = PlayViewUniteReq.toBinary(data);
													// 判断线路
													let epId = data?.extraContent.ep_id;
													let seasonId = data?.extraContent?.season_id;
													if (Caches.ss.has(seasonId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ss.get(seasonId)));
													else if (Caches.ep.has(epId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ep.get(epId)));
													else ({ response: $response } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
													break;
												};
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
											// protobuf/bilibili/pgc/gateway/player/v2/playurl.proto
											var InlineScene;(function(InlineScene){InlineScene[InlineScene["UNKNOWN"]=0]="UNKNOWN";InlineScene[InlineScene["RELATED_EP"]=1]="RELATED_EP";InlineScene[InlineScene["HE"]=2]="HE";InlineScene[InlineScene["SKIP"]=3]="SKIP"})(InlineScene||(InlineScene={}));
											class DataControl$Type extends MessageType{constructor(){super("bilibili.pgc.gateway.player.v2.DataControl",[{no:1,name:"need_watch_progress",kind:"scalar",T:8}])}create(value){const message={needWatchProgress:false};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.needWatchProgress=reader.bool();break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.needWatchProgress!==false)writer.tag(1,WireType.Varint).bool(message.needWatchProgress);let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}};
											const DataControl = new DataControl$Type();
											class SceneControl$Type extends MessageType{constructor(){super("bilibili.pgc.gateway.player.v2.SceneControl",[{no:1,name:"fav_playlist",kind:"scalar",T:8},{no:2,name:"small_window",kind:"scalar",T:8},{no:3,name:"pip",kind:"scalar",T:8},{no:4,name:"was_he_inline",kind:"scalar",T:8},{no:5,name:"is_need_trial",kind:"scalar",T:8}])}create(value){const message={favPlaylist:false,smallWindow:false,pip:false,wasHeInline:false,isNeedTrial:false};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.favPlaylist=reader.bool();break;case 2:message.smallWindow=reader.bool();break;case 3:message.pip=reader.bool();break;case 4:message.wasHeInline=reader.bool();break;case 5:message.isNeedTrial=reader.bool();break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.favPlaylist!==false)writer.tag(1,WireType.Varint).bool(message.favPlaylist);if(message.smallWindow!==false)writer.tag(2,WireType.Varint).bool(message.smallWindow);if(message.pip!==false)writer.tag(3,WireType.Varint).bool(message.pip);if(message.wasHeInline!==false)writer.tag(4,WireType.Varint).bool(message.wasHeInline);if(message.isNeedTrial!==false)writer.tag(5,WireType.Varint).bool(message.isNeedTrial);let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
											const SceneControl = new SceneControl$Type();
											/******************  initialization finish  *******************/
											switch (PATHs?.[1]) {
												case "PlayView": { // 播放地址
													/******************  initialization start  *******************/
													class PlayViewReq$Type extends MessageType{constructor(){super("bilibili.pgc.gateway.player.v2.PlayViewReq",[{no:1,name:"ep_id",kind:"scalar",opt:true,T:3,L:2},{no:2,name:"cid",kind:"scalar",opt:true,T:3,L:2},{no:3,name:"qn",kind:"scalar",T:3,L:2},{no:4,name:"fnver",kind:"scalar",opt:true,T:5},{no:5,name:"fnval",kind:"scalar",T:5},{no:6,name:"download",kind:"scalar",opt:true,T:13},{no:7,name:"force_host",kind:"scalar",opt:true,T:5},{no:8,name:"fourk",kind:"scalar",opt:true,T:8},{no:9,name:"spmid",kind:"scalar",opt:true,T:9},{no:10,name:"from_spmid",kind:"scalar",opt:true,T:9},{no:11,name:"teenagers_mode",kind:"scalar",opt:true,T:5},{no:12,name:"prefer_codec_type",kind:"enum",T:()=>["bilibili.pgc.gateway.player.v2.CodeType",CodeType]},{no:13,name:"is_preview",kind:"scalar",opt:true,T:8},{no:14,name:"room_id",kind:"scalar",opt:true,T:3,L:2},{no:15,name:"is_need_view_info",kind:"scalar",opt:true,T:8},{no:16,name:"scene_control",kind:"message",T:()=>SceneControl},{no:17,name:"inline_scene",kind:"enum",opt:true,T:()=>["bilibili.pgc.gateway.player.v2.InlineScene",InlineScene]},{no:18,name:"material_no",kind:"scalar",opt:true,T:3,L:2},{no:19,name:"security_level",kind:"scalar",opt:true,T:5},{no:20,name:"season_id",kind:"scalar",T:3,L:2},{no:21,name:"data_control",kind:"message",T:()=>DataControl}])}create(value){const message={qn:0,fnval:0,preferCodecType:0,seasonId:0};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.epId=reader.int64().toNumber();break;case 2:message.cid=reader.int64().toNumber();break;case 3:message.qn=reader.int64().toNumber();break;case 4:message.fnver=reader.int32();break;case 5:message.fnval=reader.int32();break;case 6:message.download=reader.uint32();break;case 7:message.forceHost=reader.int32();break;case 8:message.fourk=reader.bool();break;case 9:message.spmid=reader.string();break;case 10:message.fromSpmid=reader.string();break;case 11:message.teenagersMode=reader.int32();break;case 12:message.preferCodecType=reader.int32();break;case 13:message.isPreview=reader.bool();break;case 14:message.roomId=reader.int64().toNumber();break;case 15:message.isNeedViewInfo=reader.bool();break;case 16:message.sceneControl=SceneControl.internalBinaryRead(reader,reader.uint32(),options,message.sceneControl);break;case 17:message.inlineScene=reader.int32();break;case 18:message.materialNo=reader.int64().toNumber();break;case 19:message.securityLevel=reader.int32();break;case 20:message.seasonId=reader.int64().toNumber();break;case 21:message.dataControl=DataControl.internalBinaryRead(reader,reader.uint32(),options,message.dataControl);break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.epId!==undefined)writer.tag(1,WireType.Varint).int64(message.epId);if(message.cid!==undefined)writer.tag(2,WireType.Varint).int64(message.cid);if(message.qn!==0)writer.tag(3,WireType.Varint).int64(message.qn);if(message.fnver!==undefined)writer.tag(4,WireType.Varint).int32(message.fnver);if(message.fnval!==0)writer.tag(5,WireType.Varint).int32(message.fnval);if(message.download!==undefined)writer.tag(6,WireType.Varint).uint32(message.download);if(message.forceHost!==undefined)writer.tag(7,WireType.Varint).int32(message.forceHost);if(message.fourk!==undefined)writer.tag(8,WireType.Varint).bool(message.fourk);if(message.spmid!==undefined)writer.tag(9,WireType.LengthDelimited).string(message.spmid);if(message.fromSpmid!==undefined)writer.tag(10,WireType.LengthDelimited).string(message.fromSpmid);if(message.teenagersMode!==undefined)writer.tag(11,WireType.Varint).int32(message.teenagersMode);if(message.preferCodecType!==0)writer.tag(12,WireType.Varint).int32(message.preferCodecType);if(message.isPreview!==undefined)writer.tag(13,WireType.Varint).bool(message.isPreview);if(message.roomId!==undefined)writer.tag(14,WireType.Varint).int64(message.roomId);if(message.isNeedViewInfo!==undefined)writer.tag(15,WireType.Varint).bool(message.isNeedViewInfo);if(message.sceneControl)SceneControl.internalBinaryWrite(message.sceneControl,writer.tag(16,WireType.LengthDelimited).fork(),options).join();if(message.inlineScene!==undefined)writer.tag(17,WireType.Varint).int32(message.inlineScene);if(message.materialNo!==undefined)writer.tag(18,WireType.Varint).int64(message.materialNo);if(message.securityLevel!==undefined)writer.tag(19,WireType.Varint).int32(message.securityLevel);if(message.seasonId!==0)writer.tag(20,WireType.Varint).int64(message.seasonId);if(message.dataControl)DataControl.internalBinaryWrite(message.dataControl,writer.tag(21,WireType.LengthDelimited).fork(),options).join();let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
													const PlayViewReq = new PlayViewReq$Type();
													/******************  initialization finish  *******************/
													let data = PlayViewReq.fromBinary(body);
													$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
													let UF = UnknownFieldHandler.list(data);
													//$.log(`🚧 ${$.name}`, `UF: ${JSON.stringify(UF)}`, "");
													if (UF) {
														UF = UF.map(uf => {
															//uf.no; // 22
															//uf.wireType; // WireType.Varint
															// use the binary reader to decode the raw data:
															let reader = new BinaryReader(uf.data);
															let addedNumber = reader.int32(); // 7777
															$.log(`🚧 ${$.name}`, `no: ${uf.no}, wireType: ${uf.wireType}, reader: ${reader}, addedNumber: ${addedNumber}`, "");
														});
													};
													data.forceHost = Settings?.ForceHost ?? 1;
													body = PlayViewReq.toBinary(data);
													// 判断线路
													let epId = data?.epId;
													let seasonId = data?.seasonId;
													if (Caches.ss.has(seasonId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ss.get(seasonId)));
													else if (Caches.ep.has(epId)) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, Caches.ep.get(epId)));
													else ({ response: $response } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
													break;
												};
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
													class SearchAllRequest$Type extends MessageType{constructor(){super("bilibili.polymer.app.search.v1.SearchAllRequest",[{no:1,name:"keyword",kind:"scalar",T:9}])}create(value){const message={keyword:""};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.keyword=reader.string();break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.keyword!=="")writer.tag(1,WireType.LengthDelimited).string(message.keyword);let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
													const SearchAllRequest = new SearchAllRequest$Type();
													/******************  initialization finish  *******************/
													let data = SearchAllRequest.fromBinary(body);
													$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
													let UF = UnknownFieldHandler.list(data);
													//$.log(`🚧 ${$.name}`, `UF: ${JSON.stringify(UF)}`, "");
													if (UF) {
														UF = UF.map(uf => {
															//uf.no; // 22
															//uf.wireType; // WireType.Varint
															// use the binary reader to decode the raw data:
															let reader = new BinaryReader(uf.data);
															let addedNumber = reader.int32(); // 7777
															$.log(`🚧 ${$.name}`, `no: ${uf.no}, wireType: ${uf.wireType}, addedNumber: ${addedNumber}`, "");
														});
													};
													let { keyword, locale } = checkKeyword(data.keyword);
													data.keyword = keyword;
													$request = ReReqeust($request, Settings.Proxies[locale]);
													$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
													body = SearchAllRequest.toBinary(data);
													break;
												};
												case "SearchByType": { // 分类结果（番剧、用户、影视、专栏）
													/******************  initialization start  *******************/
													class SearchByTypeRequest$Type extends MessageType{constructor(){super("bilibili.polymer.app.search.v1.SearchByTypeRequest",[{no:1,name:"type",kind:"scalar",T:5},{no:2,name:"keyword",kind:"scalar",T:9}])}create(value){const message={type:0,keyword:""};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.type=reader.int32();break;case 2:message.keyword=reader.string();break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.type!==0)writer.tag(1,WireType.Varint).int32(message.type);if(message.keyword!=="")writer.tag(2,WireType.LengthDelimited).string(message.keyword);let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
													const SearchByTypeRequest = new SearchByTypeRequest$Type();
													/******************  initialization finish  *******************/
													let data = SearchByTypeRequest.fromBinary(body);
													$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
													let UF = UnknownFieldHandler.list(data);
													//$.log(`🚧 ${$.name}`, `UF: ${JSON.stringify(UF)}`, "");
													if (UF) {
														UF = UF.map(uf => {
															//uf.no; // 22
															//uf.wireType; // WireType.Varint
															// use the binary reader to decode the raw data:
															let reader = new BinaryReader(uf.data);
															let addedNumber = reader.int32(); // 7777
															$.log(`🚧 ${$.name}`, `no: ${uf.no}, wireType: ${uf.wireType}, addedNumber: ${addedNumber}`, "");
														});
													};
													let { keyword, locale } = checkKeyword(data.keyword);
													data.keyword = keyword;
													$request = ReReqeust($request, Settings.Proxies[locale]);
													$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
													body = SearchByTypeRequest.toBinary(data);
													break;
												};
											};
											break;
									};
									break;
							};
							// protobuf部分处理完后，重新计算并添加B站gRPC校验头
							rawBody = newRawBody({ header, body }); // gzip压缩有问题，别用
							break;
						case "application/x-protobuf":
							//$request.body = Player.fromBinary($request.bodyBinary);
							//$.log(`🚧 ${$.name}`, `$request.body: ${JSON.stringify($request.body)}`, "");
							break;
					};
					// 写入二进制数据
					if ($.isQuanX()) $request.bodyBytes = rawBody;
					else $request.body = rawBody;
					break;
			};
			// 兼容性处理
			if (!$response) { // 无（构造）回复数据
				switch ($.getEnv()) {
					case "Loon":
					case "Stash":
					case "Surge":
					default:
						break;
					case "Shadowrocket":
						// 已有指定策略的请求，根据策略fetch
						if ($request?.policy) $response = await Fetch($request);
						break;
					case "Quantumult X":
						// 已有指定策略的请求，根据策略fetch
						if ($request?.opts?.policy) $response = await Fetch($request);
						break;
				};
			};
			break;
		case "false":
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
				delete $response?.headers?.["Content-Length"];
				delete $response?.headers?.["content-length"];
				delete $response?.headers?.["Transfer-Encoding"];
				if ($.isQuanX()) {
					$response.status = "HTTP/1.1 200 OK";
					switch (FORMAT) {
						case "application/x-www-form-urlencoded":
						case "application/json":
						case "text/xml":
						default:
							// 返回普通数据
							$.done({ status: $response.status, headers: $response.headers, body: $response.body });
							break;
						case "application/x-protobuf":
						case "application/grpc":
							//$.log("$response.bodyBytes instanceof ArrayBuffer: " + ($response.bodyBytes instanceof ArrayBuffer));
							//$.log("ArrayBuffer.isView($response.bodyBytes): " + ArrayBuffer.isView($response.bodyBytes));
							// 返回二进制数据
							$.done({ status: $response.status, headers: $response.headers, bodyBytes: $response.bodyBytes });
							break;
						case undefined: // 视为无body
							// 返回普通数据
							$.done({ status: $response.status, headers: $response.headers });
							break;

					};
				} else $.done({ response: $response });
				break;
			};
			case undefined: { // 无构造回复数据，发送修改的请求数据
				const FORMAT = ($request?.headers?.["Content-Type"] ?? $request?.headers?.["content-type"])?.split(";")?.[0];
				$.log(`🎉 ${$.name}, finally`, `$request`, `FORMAT: ${FORMAT}`, "");
				//$.log(`🚧 ${$.name}, finally`, `$request:${JSON.stringify($request)}`, "");
				switch (FORMAT) {
					case "application/json":
					case "text/xml":
					default:
						// 返回普通数据
						if ($.isQuanX()) $.done({ headers: $request.headers, body: $request.body })
						else $.done($request)
						break;
					case "application/x-protobuf":
					case "application/grpc":
						// 返回二进制数据
						//if ($.isQuanX()) $.log(`${$request.bodyBytes.byteLength}---${$request.bodyBytes.buffer.byteLength}`);
						//else $.log(`${$request.body.byteLength}---${$request.body.buffer.byteLength}`);
						if ($.isQuanX()) $.done({ headers: $request.headers, bodyBytes: $request.bodyBytes.buffer.slice($request.bodyBytes.byteOffset, $request.bodyBytes.byteLength + $request.bodyBytes.byteOffset) });
						else $.done($request);
						break;
					case undefined: // 视为无body
						// 返回普通数据
						if ($.isQuanX()) $.done({ headers: $request.headers })
						else $.done($request)
						break;
				};
				break;
			};
		};
	})

/***************** Function *****************/
/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {String} platform - Platform Name
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
function setENV(name, platform, database) {
	$.log(`⚠ ${$.name}, Set Environment Variables`, "");
	let { Settings, Caches, Configs } = getENV(name, platform, database);
	/***************** Prase *****************/
	//Settings.Switch = JSON.parse(Settings.Switch) // BoxJs字符串转Boolean
	Settings.ForceHost = parseInt(Settings.ForceHost, 10) // BoxJs字符串转Number
	if (typeof Settings.Locales === "string") Settings.Locales = Settings.Locales.split(",") // BoxJs字符串转数组
	$.log(`🎉 ${$.name}, Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	if (!Array.isArray(Caches?.ss)) Caches.ss = [];
	if (!Array.isArray(Caches?.ep)) Caches.ep = [];
	$.log(`🎉 ${$.name}, Set Environment Variables`, `Caches: ${typeof Caches}`, `Caches内容: ${JSON.stringify(Caches)}`, "");
	Caches.ss = new Map(Caches?.ss ?? []); // Array转Map
	Caches.ep = new Map(Caches?.ep ?? []); // Array转Map
	return { Settings, Caches, Configs };
};

/**
 * Construct Redirect Reqeusts
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @param {Object} proxyName - Proxies Name
 * @return {Object} Modify Request Content with Policy
 */
function ReReqeust(request = {}, proxyName = undefined) {
	$.log(`⚠ ${$.name}, Construct Redirect Reqeusts`, "");
	if (proxyName) {
		switch ($.getEnv()) {
			case "Loon":
				request.node = proxyName;
				break;
			case "Stash":
				request.headers["X-Stash-Selected-Proxy"] = encodeURI(proxyName);
				break;
			case "Surge":
				delete request.id;
				request.headers["X-Surge-Policy"] = proxyName;
				//break; // 无需break
			case "Shadowrocket":
				request.policy = proxyName;
				break;
			case "Quantumult X":
				delete request.method;
				delete request.scheme;
				delete request.sessionIndex;
				delete request.charset;
				//if (request.opts) request.opts.policy = proxyName;
				//else request.opts = { "policy": proxyName };
				$.lodash_set(request, "opts.policy", proxyName);
				break;
			default:
				break;
		};
	};
	delete request?.headers?.["Content-Length"];
	delete request?.headers?.["content-length"];
	if (ArrayBuffer.isView(request?.body)) request["binary-mode"] = true;
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
	const FORMAT = (request?.headers?.["Content-Type"] ?? request?.headers?.["content-type"])?.split(";")?.[0];
	$.log(`⚠ ${$.name}, Fetch Ruled Reqeust`, `FORMAT: ${FORMAT}`, "");
	if ($.isQuanX()) {
		switch (FORMAT) {
			case "application/json":
			case "text/xml":
			default:
				// 返回普通数据
				delete request.bodyBytes;
				break;
			case "application/x-protobuf":
			case "application/grpc":
				// 返回二进制数据
				delete request.body;
				if (ArrayBuffer.isView(request.bodyBytes)) request.bodyBytes = request.bodyBytes.buffer.slice(request.bodyBytes.byteOffset, request.bodyBytes.byteLength + request.bodyBytes.byteOffset);
				break;
			case undefined: // 视为无body
				// 返回普通数据
				break;
		};
	};
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
	const FORMAT = (response?.headers?.["Content-Type"] ?? response?.headers?.["content-type"])?.split(";")?.[0];
	$.log(`🚧 ${$.name}, Determine Response Availability`, `FORMAT: ${FORMAT}`, "");
	let isAvailable = true;
	switch (response?.statusCode) {
		case 200:
			switch (FORMAT) {
				case "application/grpc":
					switch (response?.headers?.["Grpc-Message"] ?? response?.headers?.["grpc-message"]) {
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
 * Process Strategy
 * @author VirgilClyne
 * @param {string} type - Strategy Type
 * @param {Object} request - Original Request Content
 * @param {Object} proxies - Proxies Name
 * @param {Array} locales - Locales Names
 * @param {array} availableLocales - Available Locales @ Caches
 * @return {Promise<{request, response}>} modified { request, response }
 */
async function processStrategy(type = undefined, request = {}, proxies = {}, locales = [], availableLocales = []) {
	$.log(`⚠ ${$.name}, Process Strategy`, `type: ${type}`, "");
	let response = {};
	let randomLocale = "";
	switch (type) {
		case "locales": // 本地已有可用地区缓存
			availableLocales = availableLocales.filter(locale => locales.includes(locale));
			$.log(`🚧 ${$.name}`, `availableLocales: ${availableLocales}`, "");
			randomLocale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
			request = ReReqeust(request, proxies[randomLocale]); // 随机用一个
			break;
		case "mutiFetch": // 本地无可用地区缓存，并发请求
			let responses = await mutiFetch(request, proxies, locales);
			availableLocales = checkLocales(responses);
			$.log(`🚧 ${$.name}`, `availableLocales: ${availableLocales}`, "");
			randomLocale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
			request = ReReqeust(request, proxies[randomLocale]); // 随机用一个
			response = responses[randomLocale]; // 随机用一个
			break;
		case "random": // 随机用一个
			availableLocales = locales;
			$.log(`🚧 ${$.name}`, `availableLocales: ${availableLocales}`, "");
			randomLocale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
			request = ReReqeust(request, proxies[randomLocale]); // 随机用一个
			break;
		case "randomwithoutCHN": // 随机用一个，但不用CHN
			availableLocales = locales.filter(locale => locale !== "CHN");
			$.log(`🚧 ${$.name}`, `availableLocales: ${availableLocales}`, "");
			randomLocale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
			request = ReReqeust(request, proxies[randomLocale]); // 随机用一个
			break;
		case undefined:
		default:
			break;
	};
	$.log(`🎉 ${$.name}, Process Strategy`, `Available Locales: ${availableLocales}`, `Random Locale: ${randomLocale}`, "");
	return { request, response };
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

/**
 * Create New Raw Body
 * @author app2smile
 * @param {ArrayBuffer} header - unGzip Header
 * @param {ArrayBuffer} body - unGzip Body
 * @param {String} type - encoding type
 * @return {ArrayBuffer} new raw Body with Checksum Header
 */
function newRawBody({ header, body }, encoding = undefined) {
	$.log(`⚠ ${$.name}, Create New Raw Body`, "");
	// Header: 1位：是否校验数据 （0或者1） + 4位:校验值（数据长度）
	const flag = (encoding == "gzip") ? 1 : (encoding == "identity") ? 0 : (encoding == undefined) ? 0 : header?.[0] ?? 0; // encoding flag
	const checksum = Checksum(body.length); // 校验值为未压缩情况下的数据长度, 不是压缩后的长度
	if (encoding == "gzip") body = pako.gzip(body); // gzip压缩（有问题，别压）
	let rawBody = new Uint8Array(header.length + body.length);
	rawBody.set([flag], 0) // 0位：Encoding类型，当为1的时候, app会校验1-4位的校验值是否正确
	rawBody.set(checksum, 1) // 1-4位： 校验值(4位)
	rawBody.set(body, 5); // 5-end位：protobuf数据
	$.log(`🎉 ${$.name}, Create New Raw Body`, "");
	return rawBody;

	// 计算校验和 (B站为数据本体字节数)
	function Checksum(num) {
		let arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
		let view = new DataView(arr);
		// 首位填充计算过的新数据长度
		view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
		return new Uint8Array(arr);
	};
};

/***************** Env *****************/
// prettier-ignore
// https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t);break;case"Node.js":this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}

// https://github.com/DualSubs/URL/blob/main/URLs.embedded.min.js
function URLs(s){return new class{constructor(s=[]){this.name="URL v1.0.2",this.opts=s,this.json={scheme:"",host:"",path:"",params:{}}}parse(s){let t=s.match(/(?<scheme>.+):\/\/(?<host>[^/]+)\/?(?<path>[^?]+)?\??(?<params>.*)?/)?.groups??null;return t?.path||(t.path=""),t?.params&&(t.params=Object.fromEntries(t.params.split("&").map((s=>s.split("="))))),t}stringify(s=this.json){return s?.params?s.scheme+"://"+s.host+"/"+s.path+"?"+Object.entries(s.params).map((s=>s.join("="))).join("&"):s.scheme+"://"+s.host+"/"+s.path}}(s)}

/**
 * Get Environment Variables
 * @link https://github.com/VirgilClyne/VirgilClyne/blob/main/function/getENV/getENV.min.js
 * @author VirgilClyne
 * @param {String} t - Persistent Store Key
 * @param {String} e - Platform Name
 * @param {Object} n - Default Database
 * @return {Object} { Settings, Caches, Configs }
 */
function getENV(t,e,n){let i=$.getjson(t,n),s={};if("undefined"!=typeof $argument&&Boolean($argument)){let t=Object.fromEntries($argument.split("&").map((t=>t.split("="))));for(let e in t)l(s,e,t[e])}let g={...n?.Default?.Settings,...n?.[e]?.Settings,...i?.[e]?.Settings,...s},f={...n?.Default?.Configs,...n?.[e]?.Configs,...i?.[e]?.Configs},o=i?.[e]?.Caches||{};return"string"==typeof o&&(o=JSON.parse(o)),{Settings:g,Caches:o,Configs:f};function l(t,e,n){e.split(".").reduce(((t,i,s)=>t[i]=e.split(".").length===++s?n:t[i]||{}),t)}}
