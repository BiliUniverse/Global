/* README: https://github.com/BiliUniverse */
class ENV {
	constructor(name, opts) {
		this.name = name;
		this.version = '1.2.0';
		this.http = new Http(this);
		this.data = null;
		this.dataFile = 'box.dat';
		this.logs = [];
		this.isMute = false;
		this.isNeedRewrite = false;
		this.logSeparator = '\n';
		this.encoding = 'utf-8';
		this.startTime = new Date().getTime();
		Object.assign(this, opts);
		this.log('', `🏁 开始! ENV v${this.version}, ${this.name}`, '');
	}

	platform() {
		if ('undefined' !== typeof $environment && $environment['surge-version'])
			return 'Surge'
		if ('undefined' !== typeof $environment && $environment['stash-version'])
			return 'Stash'
		if ('undefined' !== typeof module && !!module.exports) return 'Node.js'
		if ('undefined' !== typeof $task) return 'Quantumult X'
		if ('undefined' !== typeof $loon) return 'Loon'
		if ('undefined' !== typeof $rocket) return 'Shadowrocket'
	}

	isNode() {
		return 'Node.js' === this.platform()
	}

	isQuanX() {
		return 'Quantumult X' === this.platform()
	}

	isSurge() {
		return 'Surge' === this.platform()
	}

	isLoon() {
		return 'Loon' === this.platform()
	}

	isShadowrocket() {
		return 'Shadowrocket' === this.platform()
	}

	isStash() {
		return 'Stash' === this.platform()
	}

	toObj(str, defaultValue = null) {
		try {
			return JSON.parse(str)
		} catch {
			return defaultValue
		}
	}

	toStr(obj, defaultValue = null) {
		try {
			return JSON.stringify(obj)
		} catch {
			return defaultValue
		}
	}

	getjson(key, defaultValue) {
		let json = defaultValue;
		const val = this.getdata(key);
		if (val) {
			try {
				json = JSON.parse(this.getdata(key));
			} catch { }
		}
		return json
	}

	setjson(val, key) {
		try {
			return this.setdata(JSON.stringify(val), key)
		} catch {
			return false
		}
	}

	getScript(url) {
		return new Promise((resolve) => {
			this.get({ url }, (error, response, body) => resolve(body));
		})
	}

	runScript(script, runOpts) {
		return new Promise((resolve) => {
			let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi');
			httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi;
			let httpapi_timeout = this.getdata(
				'@chavy_boxjs_userCfgs.httpapi_timeout'
			);
			httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20;
			httpapi_timeout =
				runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout;
			const [key, addr] = httpapi.split('@');
			const opts = {
				url: `http://${addr}/v1/scripting/evaluate`,
				body: {
					script_text: script,
					mock_type: 'cron',
					timeout: httpapi_timeout
				},
				headers: { 'X-Key': key, 'Accept': '*/*' },
				timeout: httpapi_timeout
			};
			this.post(opts, (error, response, body) => resolve(body));
		}).catch((e) => this.logErr(e))
	}

	loaddata() {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(this.dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				this.dataFile
			);
			const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
			const isRootDirDataFile =
				!isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
			if (isCurDirDataFile || isRootDirDataFile) {
				const datPath = isCurDirDataFile
					? curDirDataFilePath
					: rootDirDataFilePath;
				try {
					return JSON.parse(this.fs.readFileSync(datPath))
				} catch (e) {
					return {}
				}
			} else return {}
		} else return {}
	}

	writedata() {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(this.dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				this.dataFile
			);
			const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
			const isRootDirDataFile =
				!isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
			const jsondata = JSON.stringify(this.data);
			if (isCurDirDataFile) {
				this.fs.writeFileSync(curDirDataFilePath, jsondata);
			} else if (isRootDirDataFile) {
				this.fs.writeFileSync(rootDirDataFilePath, jsondata);
			} else {
				this.fs.writeFileSync(curDirDataFilePath, jsondata);
			}
		}
	}

	lodash_get(object = {}, path = "", defaultValue = undefined) {
		// translate array case to dot case, then split with .
		// a[0].b -> a.0.b -> ['a', '0', 'b']
		if (!Array.isArray(path)) path = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
		
		const result = path.reduce((previousValue, currentValue) => {
			return Object(previousValue)[currentValue]; // null undefined get attribute will throwError, Object() can return a object 
		}, object);
		return (result === undefined) ? defaultValue : result;
	}

	lodash_set(object = {}, path = "", value) {
		if (!Array.isArray(path)) path = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
		path
			.slice(0, -1)
			.reduce(
				(previousValue, currentValue, currentIndex) =>
					(Object(previousValue[currentValue]) === previousValue[currentValue])
						? previousValue[currentValue]
						: previousValue[currentValue] = (/^\d+$/.test(path[currentIndex + 1]) ? [] : {}),
				object
			)[path[path.length - 1]] = value;
		return object
	}

	getdata(key) {
		let val = this.getval(key);
		// 如果以 @
		if (/^@/.test(key)) {
			const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
			const objval = objkey ? this.getval(objkey) : '';
			if (objval) {
				try {
					const objedval = JSON.parse(objval);
					val = objedval ? this.lodash_get(objedval, paths, '') : val;
				} catch (e) {
					val = '';
				}
			}
		}
		return val
	}

	setdata(val, key) {
		let issuc = false;
		if (/^@/.test(key)) {
			const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
			const objdat = this.getval(objkey);
			const objval = objkey
				? objdat === 'null'
					? null
					: objdat || '{}'
				: '{}';
			try {
				const objedval = JSON.parse(objval);
				this.lodash_set(objedval, paths, val);
				issuc = this.setval(JSON.stringify(objedval), objkey);
			} catch (e) {
				const objedval = {};
				this.lodash_set(objedval, paths, val);
				issuc = this.setval(JSON.stringify(objedval), objkey);
			}
		} else {
			issuc = this.setval(val, key);
		}
		return issuc
	}

	getval(key) {
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Shadowrocket':
				return $persistentStore.read(key)
			case 'Quantumult X':
				return $prefs.valueForKey(key)
			case 'Node.js':
				this.data = this.loaddata();
				return this.data[key]
			default:
				return (this.data && this.data[key]) || null
		}
	}

	setval(val, key) {
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Shadowrocket':
				return $persistentStore.write(val, key)
			case 'Quantumult X':
				return $prefs.setValueForKey(val, key)
			case 'Node.js':
				this.data = this.loaddata();
				this.data[key] = val;
				this.writedata();
				return true
			default:
				return (this.data && this.data[key]) || null
		}
	}

	initGotEnv(opts) {
		this.got = this.got ? this.got : require('got');
		this.cktough = this.cktough ? this.cktough : require('tough-cookie');
		this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
		if (opts) {
			opts.headers = opts.headers ? opts.headers : {};
			if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
				opts.cookieJar = this.ckjar;
			}
		}
	}

	get(request, callback = () => { }) {
		delete request?.headers?.['Content-Length'];
		delete request?.headers?.['content-length'];

		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Shadowrocket':
			default:
				if (this.isSurge() && this.isNeedRewrite) {
					this.lodash_set(request, 'headers.X-Surge-Skip-Scripting', false);
				}
				$httpClient.get(request, (error, response, body) => {
					if (!error && response) {
						response.body = body;
						response.statusCode = response.status ? response.status : response.statusCode;
						response.status = response.statusCode;
					}
					callback(error, response, body);
				});
				break
			case 'Quantumult X':
				if (this.isNeedRewrite) {
					this.lodash_set(request, 'opts.hints', false);
				}
				$task.fetch(request).then(
					(response) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body,
							bodyBytes
						} = response;
						callback(
							null,
							{ status, statusCode, headers, body, bodyBytes },
							body,
							bodyBytes
						);
					},
					(error) => callback((error && error.error) || 'UndefinedError')
				);
				break
			case 'Node.js':
				let iconv = require('iconv-lite');
				this.initGotEnv(request);
				this.got(request)
					.on('redirect', (response, nextOpts) => {
						try {
							if (response.headers['set-cookie']) {
								const ck = response.headers['set-cookie']
									.map(this.cktough.Cookie.parse)
									.toString();
								if (ck) {
									this.ckjar.setCookieSync(ck, null);
								}
								nextOpts.cookieJar = this.ckjar;
							}
						} catch (e) {
							this.logErr(e);
						}
						// this.ckjar.setCookieSync(response.headers['set-cookie'].map(Cookie.parse).toString())
					})
					.then(
						(response) => {
							const {
								statusCode: status,
								statusCode,
								headers,
								rawBody
							} = response;
							const body = iconv.decode(rawBody, this.encoding);
							callback(
								null,
								{ status, statusCode, headers, rawBody, body },
								body
							);
						},
						(err) => {
							const { message: error, response: response } = err;
							callback(
								error,
								response,
								response && iconv.decode(response.rawBody, this.encoding)
							);
						}
					);
				break
		}
	}

	post(request, callback = () => { }) {
		const method = request.method
			? request.method.toLocaleLowerCase()
			: 'post';

		// 如果指定了请求体, 但没指定 `Content-Type`、`content-type`, 则自动生成。
		if (
			request.body &&
			request.headers &&
			!request.headers['Content-Type'] &&
			!request.headers['content-type']
		) {
			// HTTP/1、HTTP/2 都支持小写 headers
			request.headers['content-type'] = 'application/x-www-form-urlencoded';
		}
		// 为避免指定错误 `content-length` 这里删除该属性，由工具端 (HttpClient) 负责重新计算并赋值
		delete request?.headers?.['Content-Length'];
		delete request?.headers?.['content-length'];
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Shadowrocket':
			default:
				if (this.isSurge() && this.isNeedRewrite) {
					this.lodash_set(request, 'headers.X-Surge-Skip-Scripting', false);
				}
				$httpClient[method](request, (error, response, body) => {
					if (!error && response) {
						response.body = body;
						response.statusCode = response.status ? response.status : response.statusCode;
						response.status = response.statusCode;
					}
					callback(error, response, body);
				});
				break
			case 'Quantumult X':
				request.method = method;
				if (this.isNeedRewrite) {
					this.lodash_set(request, 'opts.hints', false);
				}
				$task.fetch(request).then(
					(response) => {
						const {
							statusCode: status,
							statusCode,
							headers,
							body,
							bodyBytes
						} = response;
						callback(
							null,
							{ status, statusCode, headers, body, bodyBytes },
							body,
							bodyBytes
						);
					},
					(error) => callback((error && error.error) || 'UndefinedError')
				);
				break
			case 'Node.js':
				let iconv = require('iconv-lite');
				this.initGotEnv(request);
				const { url, ..._request } = request;
				this.got[method](url, _request).then(
					(response) => {
						const { statusCode: status, statusCode, headers, rawBody } = response;
						const body = iconv.decode(rawBody, this.encoding);
						callback(
							null,
							{ status, statusCode, headers, rawBody, body },
							body
						);
					},
					(err) => {
						const { message: error, response: response } = err;
						callback(
							error,
							response,
							response && iconv.decode(response.rawBody, this.encoding)
						);
					}
				);
				break
		}
	}
	/**
	 *
	 * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
	 *    :$.time('yyyyMMddHHmmssS')
	 *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
	 *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
	 * @param {string} format 格式化参数
	 * @param {number} ts 可选: 根据指定时间戳返回格式化日期
	 *
	 */
	time(format, ts = null) {
		const date = ts ? new Date(ts) : new Date();
		let o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'H+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds(),
			'q+': Math.floor((date.getMonth() + 3) / 3),
			'S': date.getMilliseconds()
		};
		if (/(y+)/.test(format))
			format = format.replace(
				RegExp.$1,
				(date.getFullYear() + '').substr(4 - RegExp.$1.length)
			);
		for (let k in o)
			if (new RegExp('(' + k + ')').test(format))
				format = format.replace(
					RegExp.$1,
					RegExp.$1.length == 1
						? o[k]
						: ('00' + o[k]).substr(('' + o[k]).length)
				);
		return format
	}

	/**
	 * 系统通知
	 *
	 * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
	 *
	 * 示例:
	 * $.msg(title, subt, desc, 'twitter://')
	 * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
	 * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
	 *
	 * @param {*} title 标题
	 * @param {*} subt 副标题
	 * @param {*} desc 通知详情
	 * @param {*} opts 通知参数
	 *
	 */
	msg(title = name, subt = '', desc = '', opts) {
		const toEnvOpts = (rawopts) => {
			switch (typeof rawopts) {
				case undefined:
					return rawopts
				case 'string':
					switch (this.platform()) {
						case 'Surge':
						case 'Stash':
						default:
							return { url: rawopts }
						case 'Loon':
						case 'Shadowrocket':
							return rawopts
						case 'Quantumult X':
							return { 'open-url': rawopts }
						case 'Node.js':
							return undefined
					}
				case 'object':
					switch (this.platform()) {
						case 'Surge':
						case 'Stash':
						case 'Shadowrocket':
						default: {
							let openUrl =
								rawopts.url || rawopts.openUrl || rawopts['open-url'];
							return { url: openUrl }
						}
						case 'Loon': {
							let openUrl =
								rawopts.openUrl || rawopts.url || rawopts['open-url'];
							let mediaUrl = rawopts.mediaUrl || rawopts['media-url'];
							return { openUrl, mediaUrl }
						}
						case 'Quantumult X': {
							let openUrl =
								rawopts['open-url'] || rawopts.url || rawopts.openUrl;
							let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl;
							let updatePasteboard =
								rawopts['update-pasteboard'] || rawopts.updatePasteboard;
							return {
								'open-url': openUrl,
								'media-url': mediaUrl,
								'update-pasteboard': updatePasteboard
							}
						}
						case 'Node.js':
							return undefined
					}
				default:
					return undefined
			}
		};
		if (!this.isMute) {
			switch (this.platform()) {
				case 'Surge':
				case 'Loon':
				case 'Stash':
				case 'Shadowrocket':
				default:
					$notification.post(title, subt, desc, toEnvOpts(opts));
					break
				case 'Quantumult X':
					$notify(title, subt, desc, toEnvOpts(opts));
					break
				case 'Node.js':
					break
			}
		}
		if (!this.isMuteLog) {
			let logs = ['', '==============📣系统通知📣=============='];
			logs.push(title);
			subt ? logs.push(subt) : '';
			desc ? logs.push(desc) : '';
			console.log(logs.join('\n'));
			this.logs = this.logs.concat(logs);
		}
	}

	log(...logs) {
		if (logs.length > 0) {
			this.logs = [...this.logs, ...logs];
		}
		console.log(logs.join(this.logSeparator));
	}

	logErr(error) {
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Shadowrocket':
			case 'Quantumult X':
			default:
				this.log('', `❗️ ${this.name}, 错误!`, error);
				break
			case 'Node.js':
				this.log('', `❗️${this.name}, 错误!`, error.stack);
				break
		}
	}

	wait(time) {
		return new Promise((resolve) => setTimeout(resolve, time))
	}

	done(val = {}) {
		const endTime = new Date().getTime();
		const costTime = (endTime - this.startTime) / 1000;
		this.log('', `🚩 ${this.name}, 结束! 🕛 ${costTime} 秒`);
		this.log();
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Shadowrocket':
			case 'Quantumult X':
			default:
				$done(val);
				break
			case 'Node.js':
				process.exit(1);
				break
		}
	}

	/**
	 * Get Environment Variables
	 * @link https://github.com/VirgilClyne/GetSomeFries/blob/main/function/getENV/getENV.js
	 * @author VirgilClyne
	 * @param {String} key - Persistent Store Key
	 * @param {Array} names - Platform Names
	 * @param {Object} database - Default Database
	 * @return {Object} { Settings, Caches, Configs }
	 */
	getENV(key, names, database) {
		//this.log(`☑️ ${this.name}, Get Environment Variables`, "");
		/***************** BoxJs *****************/
		// 包装为局部变量，用完释放内存
		// BoxJs的清空操作返回假值空字符串, 逻辑或操作符会在左侧操作数为假值时返回右侧操作数。
		let BoxJs = this.getjson(key, database);
		//this.log(`🚧 ${this.name}, Get Environment Variables`, `BoxJs类型: ${typeof BoxJs}`, `BoxJs内容: ${JSON.stringify(BoxJs)}`, "");
		/***************** Argument *****************/
		let Argument = {};
		if (typeof $argument !== "undefined") {
			if (Boolean($argument)) {
				//this.log(`🎉 ${this.name}, $Argument`);
				let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=").map(i => i.replace(/\"/g, ''))));
				//this.log(JSON.stringify(arg));
				for (let item in arg) this.lodash_set(Argument, item, arg[item]);
				//this.log(JSON.stringify(Argument));
			}			//this.log(`✅ ${this.name}, Get Environment Variables`, `Argument类型: ${typeof Argument}`, `Argument内容: ${JSON.stringify(Argument)}`, "");
		}		/***************** Store *****************/
		const Store = { Settings: database?.Default?.Settings || {}, Configs: database?.Default?.Configs || {}, Caches: {} };
		if (!Array.isArray(names)) names = [names];
		//this.log(`🚧 ${this.name}, Get Environment Variables`, `names类型: ${typeof names}`, `names内容: ${JSON.stringify(names)}`, "");
		for (let name of names) {
			Store.Settings = { ...Store.Settings, ...database?.[name]?.Settings, ...Argument, ...BoxJs?.[name]?.Settings };
			Store.Configs = { ...Store.Configs, ...database?.[name]?.Configs };
			if (BoxJs?.[name]?.Caches && typeof BoxJs?.[name]?.Caches === "string") BoxJs[name].Caches = JSON.parse(BoxJs?.[name]?.Caches);
			Store.Caches = { ...Store.Caches, ...BoxJs?.[name]?.Caches };
		}		//this.log(`🚧 ${this.name}, Get Environment Variables`, `Store.Settings类型: ${typeof Store.Settings}`, `Store.Settings: ${JSON.stringify(Store.Settings)}`, "");
		this.traverseObject(Store.Settings, (key, value) => {
			//this.log(`🚧 ${this.name}, traverseObject`, `${key}: ${typeof value}`, `${key}: ${JSON.stringify(value)}`, "");
			if (value === "true" || value === "false") value = JSON.parse(value); // 字符串转Boolean
			else if (typeof value === "string") {
				if (value.includes(",")) value = value.split(",").map(item => this.string2number(item)); // 字符串转数组转数字
				else value = this.string2number(value); // 字符串转数字
			}			return value;
		});
		//this.log(`✅ ${this.name}, Get Environment Variables`, `Store: ${typeof Store.Caches}`, `Store内容: ${JSON.stringify(Store)}`, "");
		return Store;
	};

	/***************** function *****************/
	traverseObject(o, c) { for (var t in o) { var n = o[t]; o[t] = "object" == typeof n && null !== n ? this.traverseObject(n, c) : c(t, n); } return o }
	string2number(string) { if (string && !isNaN(string)) string = parseInt(string, 10); return string }
}

class Http {
	constructor(env) {
		this.env = env;
	}

	send(opts, method = 'GET') {
		opts = typeof opts === 'string' ? { url: opts } : opts;
		let sender = this.get;
		if (method === 'POST') {
			sender = this.post;
		}
		return new Promise((resolve, reject) => {
			sender.call(this, opts, (error, response, body) => {
				if (error) reject(error);
				else resolve(response);
			});
		})
	}

	get(opts) {
		return this.send.call(this.env, opts)
	}

	post(opts) {
		return this.send.call(this.env, opts, 'POST')
	}
}

let URI$1 = class URI {
	constructor(opts = []) {
		this.name = "URI v1.2.6";
		this.opts = opts;
		this.json = { scheme: "", host: "", path: "", query: {} };
	};

	parse(url) {
		const URLRegex = /(?:(?<scheme>.+):\/\/(?<host>[^/]+))?\/?(?<path>[^?]+)?\??(?<query>[^?]+)?/;
		let json = url.match(URLRegex)?.groups ?? null;
		if (json?.path) json.paths = json.path.split("/"); else json.path = "";
		//if (json?.paths?.at(-1)?.includes(".")) json.format = json.paths.at(-1).split(".").at(-1);
		if (json?.paths) {
			const fileName = json.paths[json.paths.length - 1];
			if (fileName?.includes(".")) {
				const list = fileName.split(".");
				json.format = list[list.length - 1];
			}
		}
		if (json?.query) json.query = Object.fromEntries(json.query.split("&").map((param) => param.split("=")));
		return json
	};

	stringify(json = this.json) {
		let url = "";
		if (json?.scheme && json?.host) url += json.scheme + "://" + json.host;
		if (json?.path) url += (json?.host) ? "/" + json.path : json.path;
		if (json?.query) url += "?" + Object.entries(json.query).map(param => param.join("=")).join("&");
		return url
	};
};

var Settings$1 = {
	Switch: true
};
var Default = {
	Settings: Settings$1
};

var Default$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Settings: Settings$1,
	default: Default
});

var Settings = {
	Switch: true,
	ForceHost: "1",
	Locales: [
		"HKG",
		"TWN",
		"USA",
		"SGP"
	],
	Proxies: {
		HKG: "🇭🇰香港",
		MAC: "🇲🇴澳门",
		TWN: "🇹🇼台湾",
		USA: "🇺🇸美国",
		SGP: "🇸🇬新加坡",
		MYA: "🇲🇾马来西亚",
		THA: "🇹🇭泰国"
	}
};
var Configs = {
	Locale: {
		CHN: "",
		HKG: "（僅限港.*地區）",
		MAC: "（僅限.*澳.*地區）",
		TWN: "（僅限.*台地區）",
		INTL: "（僅限.*其他地區）"
	},
	SearchNav: {
		HKG: {
			name: "动画🇭🇰",
			total: 0,
			pages: 0,
			type: 27
		},
		MAC: {
			name: "动画🇲🇴",
			total: 0,
			pages: 0,
			type: 37
		},
		TWN: {
			name: "动画🇹🇼",
			total: 0,
			pages: 0,
			type: 47
		},
		INTL: {
			name: "动画🇺🇳",
			total: 0,
			pages: 0,
			type: 57
		}
	}
};
var BiliIntl_Global = {
	Settings: Settings,
	Configs: Configs
};

var Global = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Configs: Configs,
	Settings: Settings,
	default: BiliIntl_Global
});

var Database$1 = Database = {
	"Default": Default$1,
	"Global": Global,
};

/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {Object} $ - ENV
 * @param {String} name - Persistent Store Key
 * @param {Array} platforms - Platform Names
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
function setENV($, name, platforms, database) {
	console.log(`☑️ Set Environment Variables`, "");
	let { Settings, Caches, Configs } = $.getENV(name, platforms, database);
	/***************** Settings *****************/
	if (!Array.isArray(Settings?.Locales)) Settings.Locales = (Settings.Locales) ? [Settings.Locales] : []; // 只有一个选项时，无逗号分隔
	console.log(`✅ Set Environment Variables, Settings: ${typeof Settings}, Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	if (!Array.isArray(Caches?.ss)) Caches.ss = [];
	if (!Array.isArray(Caches?.ep)) Caches.ep = [];
	//console.log(`✅ Set Environment Variables, Caches: ${typeof Caches}, Caches内容: ${JSON.stringify(Caches)}`, "");
	Caches.ss = new Map(Caches?.ss ?? []); // Array转Map
	Caches.ep = new Map(Caches?.ep ?? []); // Array转Map
	/***************** Configs *****************/
	return { Settings, Caches, Configs };
}

const $ = new ENV("📺 BiliIntl: 🌐 Global v0.4.0(1) request.beta");
const URI = new URI$1();

// 构造回复数据
let $response = undefined;

/***************** Processing *****************/
// 解构URL
const URL = URI.parse($request.url);
$.log(`⚠ ${$.name}`, `URL: ${JSON.stringify(URL)}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = URL.host, PATH = URL.path; URL.paths;
$.log(`⚠ ${$.name}`, `METHOD: ${METHOD}`, "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ ${$.name}`, `FORMAT: ${FORMAT}`, "");
(async () => {
	// 读取设置
	const { Settings, Caches, Configs } = setENV($, "BiliIntl", "Global", Database$1);
	switch (Settings.Switch) {
		case true:
		default:
			// 方法判断
			switch (METHOD) {
				case "POST":
				case "PUT":
				case "PATCH":
				case "DELETE":
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
								}							}							break;
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
									}									break;
								}							}							break;
						case "app.biliintl.com": // app
						case "passport.biliintl.com": // 登录
							if (URL.query?.s_locale) { // 处理系统语言_地区代码
								let s_locale = URL.query.s_locale.split("_");
								if (s_locale.length === 2) {
									URL.query.s_locale = `${s_locale[0]}_${"SG"}`;
								}							}							if (URL.query?.sim_code) { // 处理MNC
								URL.query.sim_code = "";
							}							$request.url = URI.stringify(URL);
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
											}											break;
										}										case "intl/gateway/v2/app/search/v2": // 搜索-全部结果-app
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
									}									break;
							}							break;
					}					break;
				case "CONNECT":
				case "TRACE":
					break;
			}			if ($request.headers?.Host) $request.headers.Host = URL.host;
			$request.url = URI.stringify(URL);
			$.log(`🚧 ${$.name}, 调试信息`, `$request.url: ${$request.url}`, "");
			break;
		case false:
			$.log(`⚠ ${$.name}, 功能关闭`, "");
			break;
	}})()
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
				}			} else $.done({ response: $response });
			break;
		}		case undefined: { // 无构造回复数据，发送修改的请求数据
			//const FORMAT = ($request?.headers?.["Content-Type"] ?? $request?.headers?.["content-type"])?.split(";")?.[0];
			$.log(`🎉 ${$.name}, finally`, `$request`, `FORMAT: ${FORMAT}`, "");
			//$.log(`🚧 ${$.name}, finally`, `$request: ${JSON.stringify($request)}`, "");
			if ($.isQuanX()) {
				switch (FORMAT) {
					case undefined: // 视为无body
						// 返回普通数据
						$.done({ url: $request.url, headers: $request.headers });
						break;
					default:
						// 返回普通数据
						$.done({ url: $request.url, headers: $request.headers, body: $request.body });
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
				}			} else $.done($request);
			break;
		}	}});

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
		}		if ($.isSurge()) {
			delete request.id;
			request.headers["X-Surge-Policy"] = proxyName;
			request.policy = proxyName;
		}		if ($.isStash()) request.headers["X-Stash-Selected-Proxy"] = encodeURI(proxyName);
		if ($.isShadowrocket()) $.logErr(`❗️${$.name}, ${Fetch.name}执行失败`, `不支持的app: Shadowrocket`, "");
	}
	$.log(`🎉 ${$.name}, Construct Redirect Reqeusts`, "");
	//$.log(`🚧 ${$.name}, Construct Redirect Reqeusts`, `Request:${JSON.stringify(request)}`, "");
	return request;
}
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
}
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
	await Promise.allSettled(locales.map(async locale => { responses[locale] = await Fetch(ReReqeust(request, proxies[locale])); }));
	$.log(`🎉 ${$.name}, Fetch Muti-Locales Reqeusts`, "");
	//$.log(`🚧 ${$.name}, Fetch Muti-Locales Reqeusts`, `Responses:${JSON.stringify(responses)}`, "");
    return responses;
}
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
					}					break;
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
									}									break;
								case undefined:
								default:
									isAvailable = true;
									break;
							}							break;
						case "-10403":
						case "10015001": // 版权地区受限
						default:
							isAvailable = false;
							break;
					}					break;
				case "text/html":
					isAvailable = true;
					break;
			}			break;
		case 403:
		case 404:
		case 415:
		default:
			isAvailable = false;
			break;
	}	$.log(`🎉 ${$.name}, Determine Response Availability`, `isAvailable:${isAvailable}`, "");
    return isAvailable;
}
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
	}	let availableLocales = Object.keys(responses);
	$.log(`🎉 ${$.name}, Check Locales Availability`, `Available Locales: ${availableLocales}`, "");
	return availableLocales;
}
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
	}	$.log(`🎉 ${$.name}, Check Search Keyword`, `Keyword: ${keyword}, Locale: ${locale}`, "");
	return { keyword, locale };
}
