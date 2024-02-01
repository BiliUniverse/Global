import ENVs from "./ENV/ENV.mjs";
import URIs from "./URI/URI.mjs";

import Database from "./database/BiliBili.mjs";
import setENV from "./function/setENV.mjs";
import pako from "./pako/dist/pako.esm.mjs";
import addgRPCHeader from "./function/addgRPCHeader.mjs";
import { TextEncoder , TextDecoder } from "./text-encoding/index.js";

const $ = new ENVs("📺 BiliBili: 🌐 Global v0.5.4(1) request");
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
	const { Settings, Caches, Configs } = setENV($, "BiliBili", "Global", Database);
	$.log(`⚠ ${$.name}`, `Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			// 创建空数据
			let body = { "code": 0, "message": "0", "data": {} };
			// 信息组
			let infoGroup = {
				"seasonTitle": URL.query?.season_title,
				"seasonId": parseInt(URL.query?.season_id, 10) || undefined,
				"epId": parseInt(URL.query?.ep_id, 10) || undefined,
				"mId": parseInt(URL.query?.mid || URL.query?.vmid, 10) || undefined,
				"evaluate": undefined,
				"keyword": decodeURIComponent(URL.query?.keyword),
				"locale": URL.query?.locale,
				"locales": [],
				"isPGC": true, // 是否PGC内容
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
						case "text/html":
						default:
							break;
						case "application/x-mpegURL":
						case "application/x-mpegurl":
						case "application/vnd.apple.mpegurl":
						case "audio/mpegurl":
							break;
						case "text/xml":
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
						case "applecation/octet-stream":
							//$.log(`🚧 ${$.name}`, `$request.body: ${JSON.stringify($request.body)}`, "");
							let rawBody = $.isQuanX() ? new Uint8Array($request.bodyBytes ?? []) : $request.body ?? new Uint8Array();
							//$.log(`🚧 ${$.name}`, `isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`, "");
							/******************  initialization start  *******************/
							// timostamm/protobuf-ts 2.9.0
							// @protobuf-ts/runtime
							(i=>{i.symbol=Symbol.for("protobuf-ts/unknown"),i.onRead=(e,r,t,a,n)=>{(s(r)?r[i.symbol]:r[i.symbol]=[]).push({no:t,wireType:a,data:n})},i.onWrite=(e,r,t)=>{for(var{no:a,wireType:n,data:s}of i.list(r))t.tag(a,n).raw(s)},i.list=(e,r)=>{return s(e)?(e=e[i.symbol],r?e.filter(e=>e.no==r):e):[]},i.last=(e,r)=>(0,i.list)(e,r).slice(-1)[0];const s=e=>e&&Array.isArray(e[i.symbol])})(UnknownFieldHandler=UnknownFieldHandler||{});
							var UnknownFieldHandler,WireType=(e=>(e[e.Varint=0]="Varint",e[e.Bit64=1]="Bit64",e[e.LengthDelimited=2]="LengthDelimited",e[e.StartGroup=3]="StartGroup",e[e.EndGroup=4]="EndGroup",e[e.Bit32=5]="Bit32",e))(WireType||{});const MESSAGE_TYPE=Symbol.for("protobuf-ts/message-type");function lowerCamelCase(r){let t=!1;var a=[];for(let e=0;e<r.length;e++){var n=r.charAt(e);"_"==n?t=!0:/\d/.test(n)?(a.push(n),t=!0):t?(a.push(n.toUpperCase()),t=!1):0==e?a.push(n.toLowerCase()):a.push(n)}return a.join("")}var ScalarType=(e=>(e[e.DOUBLE=1]="DOUBLE",e[e.FLOAT=2]="FLOAT",e[e.INT64=3]="INT64",e[e.UINT64=4]="UINT64",e[e.INT32=5]="INT32",e[e.FIXED64=6]="FIXED64",e[e.FIXED32=7]="FIXED32",e[e.BOOL=8]="BOOL",e[e.STRING=9]="STRING",e[e.BYTES=12]="BYTES",e[e.UINT32=13]="UINT32",e[e.SFIXED32=15]="SFIXED32",e[e.SFIXED64=16]="SFIXED64",e[e.SINT32=17]="SINT32",e[e.SINT64=18]="SINT64",e))(ScalarType||{}),LongType=(e=>(e[e.BIGINT=0]="BIGINT",e[e.STRING=1]="STRING",e[e.NUMBER=2]="NUMBER",e))(LongType||{}),RepeatType=(e=>(e[e.NO=0]="NO",e[e.PACKED=1]="PACKED",e[e.UNPACKED=2]="UNPACKED",e))(RepeatType||{});function normalizeFieldInfo(e){return e.localName=e.localName??lowerCamelCase(e.name),e.jsonName=e.jsonName??lowerCamelCase(e.name),e.repeat=e.repeat??0,e.opt=e.opt??(!e.repeat&&(!e.oneof&&"message"==e.kind)),e}function isOneofGroup(e){if("object"!=typeof e||null===e||!e.hasOwnProperty("oneofKind"))return!1;switch(typeof e.oneofKind){case"string":return void 0===e[e.oneofKind]?!1:2==Object.keys(e).length;case"undefined":return 1==Object.keys(e).length;default:return!1}}class ReflectionTypeCheck{constructor(e){this.fields=e.fields??[]}prepare(){if(!this.data){var e,r=[],t=[],a=[];for(e of this.fields)if(e.oneof)a.includes(e.oneof)||(a.push(e.oneof),r.push(e.oneof),t.push(e.oneof));else switch(t.push(e.localName),e.kind){case"scalar":case"enum":e.opt&&!e.repeat||r.push(e.localName);break;case"message":e.repeat&&r.push(e.localName);break;case"map":r.push(e.localName)}this.data={req:r,known:t,oneofs:Object.values(a)}}}is(e,a,n=!1){if(!(a<0)){if(null==e||"object"!=typeof e)return!1;this.prepare();let r=Object.keys(e),t=this.data;if(r.length<t.req.length||t.req.some(e=>!r.includes(e)))return!1;if(!n&&r.some(e=>!t.known.includes(e)))return!1;if(!(a<1)){for(const i of t.oneofs){const o=e[i];if(!isOneofGroup(o))return!1;if(void 0!==o.oneofKind){var s=this.fields.find(e=>e.localName===o.oneofKind);if(!s)return!1;if(!this.field(o[o.oneofKind],s,n,a))return!1}}for(const l of this.fields)if(void 0===l.oneof&&!this.field(e[l.localName],l,n,a))return!1}}return!0}field(e,r,t,a){var n=r.repeat;switch(r.kind){case"scalar":return void 0===e?r.opt:n?this.scalars(e,r.T,a,r.L):this.scalar(e,r.T,r.L);case"enum":return void 0===e?r.opt:n?this.scalars(e,ScalarType.INT32,a):this.scalar(e,ScalarType.INT32);case"message":return void 0===e?!0:n?this.messages(e,r.T(),t,a):this.message(e,r.T(),t,a);case"map":if("object"!=typeof e||null===e)return!1;if(a<2)return!0;if(!this.mapKeys(e,r.K,a))return!1;switch(r.V.kind){case"scalar":return this.scalars(Object.values(e),r.V.T,a,r.V.L);case"enum":return this.scalars(Object.values(e),ScalarType.INT32,a);case"message":return this.messages(Object.values(e),r.V.T(),t,a)}}return!0}message(e,r,t,a){return t?r.isAssignable(e,a):r.is(e,a)}messages(r,t,e,a){if(!Array.isArray(r))return!1;if(!(a<2))if(e){for(let e=0;e<r.length&&e<a;e++)if(!t.isAssignable(r[e],a-1))return!1}else for(let e=0;e<r.length&&e<a;e++)if(!t.is(r[e],a-1))return!1;return!0}scalar(e,r,t){var a=typeof e;switch(r){case ScalarType.UINT64:case ScalarType.FIXED64:case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:switch(t){case LongType.BIGINT:return"bigint"==a;case LongType.NUMBER:return"number"==a&&!isNaN(e);default:return"string"==a}case ScalarType.BOOL:return"boolean"==a;case ScalarType.STRING:return"string"==a;case ScalarType.BYTES:return e instanceof Uint8Array;case ScalarType.DOUBLE:case ScalarType.FLOAT:return"number"==a&&!isNaN(e);default:return"number"==a&&Number.isInteger(e)}}scalars(r,t,a,n){if(!Array.isArray(r))return!1;if(!(a<2)&&Array.isArray(r))for(let e=0;e<r.length&&e<a;e++)if(!this.scalar(r[e],t,n))return!1;return!0}mapKeys(e,r,t){var a=Object.keys(e);switch(r){case ScalarType.INT32:case ScalarType.FIXED32:case ScalarType.SFIXED32:case ScalarType.SINT32:case ScalarType.UINT32:return this.scalars(a.slice(0,t).map(e=>parseInt(e)),r,t);case ScalarType.BOOL:return this.scalars(a.slice(0,t).map(e=>"true"==e||"false"!=e&&e),r,t);default:return this.scalars(a,r,t,LongType.STRING)}}}function typeofJsonValue(e){var r=typeof e;if("object"==r){if(Array.isArray(e))return"array";if(null===e)return"null"}return r}function isJsonObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}let encTable="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),decTable=[];for(let e=0;e<encTable.length;e++)decTable[encTable[e].charCodeAt(0)]=e;function base64decode(r){let e=3*r.length/4,t=("="==r[r.length-2]?e-=2:"="==r[r.length-1]&&--e,new Uint8Array(e)),a=0,n=0,s,i=0;for(let e=0;e<r.length;e++){if(void 0===(s=decTable[r.charCodeAt(e)]))switch(r[e]){case"=":n=0;case"\n":case"\r":case"\t":case" ":continue;default:throw Error("invalid base64 string.")}switch(n){case 0:i=s,n=1;break;case 1:t[a++]=i<<2|(48&s)>>4,i=s,n=2;break;case 2:t[a++]=(15&i)<<4|(60&s)>>2,i=s,n=3;break;case 3:t[a++]=(3&i)<<6|s,n=0}}if(1==n)throw Error("invalid base64 string.");return t.subarray(0,a)}function base64encode(r){let t="",a=0,n,s=0;for(let e=0;e<r.length;e++)switch(n=r[e],a){case 0:t+=encTable[n>>2],s=(3&n)<<4,a=1;break;case 1:t+=encTable[s|n>>4],s=(15&n)<<2,a=2;break;case 2:t=(t+=encTable[s|n>>6])+encTable[63&n],a=0}return a&&(t=t+encTable[s]+"=",1==a&&(t+="=")),t}function varint64read(){let r=0,t=0;for(let e=0;e<28;e+=7){var a=this.buf[this.pos++];if(r|=(127&a)<<e,0==(128&a))return this.assertBounds(),[r,t]}var e=this.buf[this.pos++];if(r|=(15&e)<<28,t=(112&e)>>4,0==(128&e))return this.assertBounds(),[r,t];for(let e=3;e<=31;e+=7){var n=this.buf[this.pos++];if(t|=(127&n)<<e,0==(128&n))return this.assertBounds(),[r,t]}throw new Error("invalid varint")}function varint64write(r,t,a){for(let e=0;e<28;e+=7){var n=r>>>e,s=!(n>>>7==0&&0==t);if(a.push(255&(s?128|n:n)),!s)return}var e=r>>>28&15|(7&t)<<4,i=!(t>>3==0);if(a.push(255&(i?128|e:e)),i){for(let e=3;e<31;e+=7){var o=t>>>e,l=!(o>>>7==0);if(a.push(255&(l?128|o:o)),!l)return}a.push(t>>>31&1)}}decTable["-".charCodeAt(0)]=encTable.indexOf("+"),decTable["_".charCodeAt(0)]=encTable.indexOf("/");const TWO_PWR_32_DBL$1=4294967296;function int64fromString(t){var e="-"==t[0];e&&(t=t.slice(1));let a=0,n=0;function r(e,r){e=Number(t.slice(e,r));n*=1e6,(a=1e6*a+e)>=TWO_PWR_32_DBL$1&&(n+=a/TWO_PWR_32_DBL$1|0,a%=TWO_PWR_32_DBL$1)}return r(-24,-18),r(-18,-12),r(-12,-6),r(-6),[e,a,n]}function int64toString(e,r){if(r<=2097151)return""+(TWO_PWR_32_DBL$1*r+(e>>>0));var t=(e>>>24|r<<8)>>>0&16777215,r=r>>16&65535;let a=(16777215&e)+6777216*t+6710656*r,n=t+8147497*r,s=2*r;function i(e,r){e=e?String(e):"";return r?"0000000".slice(e.length)+e:e}return 1e7<=a&&(n+=Math.floor(a/1e7),a%=1e7),1e7<=n&&(s+=Math.floor(n/1e7),n%=1e7),i(s,0)+i(n,s)+i(a,1)}function varint32write(r,t){if(0<=r){for(;127<r;)t.push(127&r|128),r>>>=7;t.push(r)}else{for(let e=0;e<9;e++)t.push(127&r|128),r>>=7;t.push(1)}}function varint32read(){let r=this.buf[this.pos++];var e=127&r;if(0==(128&r))return this.assertBounds(),e;if(e|=(127&(r=this.buf[this.pos++]))<<7,0==(128&r))return this.assertBounds(),e;if(e|=(127&(r=this.buf[this.pos++]))<<14,0==(128&r))return this.assertBounds(),e;if(e|=(127&(r=this.buf[this.pos++]))<<21,0==(128&r))return this.assertBounds(),e;e|=(15&(r=this.buf[this.pos++]))<<28;for(let e=5;0!=(128&r)&&e<10;e++)r=this.buf[this.pos++];if(0!=(128&r))throw new Error("invalid varint");return this.assertBounds(),e>>>0}function detectBi(){var e=new DataView(new ArrayBuffer(8));return void 0!==globalThis.BigInt&&"function"==typeof e.getBigInt64&&"function"==typeof e.getBigUint64&&"function"==typeof e.setBigInt64&&"function"==typeof e.setBigUint64?{MIN:BigInt("-9223372036854775808"),MAX:BigInt("9223372036854775807"),UMIN:BigInt("0"),UMAX:BigInt("18446744073709551615"),C:BigInt,V:e}:void 0}const BI=detectBi();function assertBi(e){if(!e)throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support")}const RE_DECIMAL_STR=/^-?[0-9]+$/,TWO_PWR_32_DBL=4294967296;class SharedPbLong{constructor(e,r){this.lo=0|e,this.hi=0|r}isZero(){return 0==this.lo&&0==this.hi}toNumber(){var e=this.hi*TWO_PWR_32_DBL+(this.lo>>>0);if(Number.isSafeInteger(e))return e;throw new Error("cannot convert to safe number")}}const _PbULong=class extends SharedPbLong{static from(e){if(BI)switch(typeof e){case"string":if("0"==e)return this.ZERO;if(""==e)throw new Error("string is no integer");e=BI.C(e);case"number":if(0===e)return this.ZERO;e=BI.C(e);case"bigint":if(!e)return this.ZERO;if(e<BI.UMIN)throw new Error("signed value for ulong");if(e>BI.UMAX)throw new Error("ulong too large");return BI.V.setBigUint64(0,e,!0),new _PbULong(BI.V.getInt32(0,!0),BI.V.getInt32(4,!0))}else switch(typeof e){case"string":if("0"==e)return this.ZERO;if(e=e.trim(),!RE_DECIMAL_STR.test(e))throw new Error("string is no integer");var[r,t,a]=int64fromString(e);if(r)throw new Error("signed value");return new _PbULong(t,a);case"number":if(0==e)return this.ZERO;if(!Number.isSafeInteger(e))throw new Error("number is no integer");if(e<0)throw new Error("signed value for ulong");return new _PbULong(e,e/TWO_PWR_32_DBL)}throw new Error("unknown value "+typeof e)}toString(){return BI?this.toBigInt().toString():int64toString(this.lo,this.hi)}toBigInt(){return assertBi(BI),BI.V.setInt32(0,this.lo,!0),BI.V.setInt32(4,this.hi,!0),BI.V.getBigUint64(0,!0)}};let PbULong=_PbULong;PbULong.ZERO=new _PbULong(0,0);const _PbLong=class extends SharedPbLong{static from(e){if(BI)switch(typeof e){case"string":if("0"==e)return this.ZERO;if(""==e)throw new Error("string is no integer");e=BI.C(e);case"number":if(0===e)return this.ZERO;e=BI.C(e);case"bigint":if(!e)return this.ZERO;if(e<BI.MIN)throw new Error("ulong too small");if(e>BI.MAX)throw new Error("ulong too large");return BI.V.setBigInt64(0,e,!0),new _PbLong(BI.V.getInt32(0,!0),BI.V.getInt32(4,!0))}else switch(typeof e){case"string":if("0"==e)return this.ZERO;var r,t,a;if(e=e.trim(),RE_DECIMAL_STR.test(e))return[r,a,t]=int64fromString(e),a=new _PbLong(a,t),r?a.negate():a;throw new Error("string is no integer");case"number":if(0==e)return this.ZERO;if(Number.isSafeInteger(e))return 0<e?new _PbLong(e,e/TWO_PWR_32_DBL):new _PbLong(-e,-e/TWO_PWR_32_DBL).negate();throw new Error("number is no integer")}throw new Error("unknown value "+typeof e)}isNegative(){return 0!=(2147483648&this.hi)}negate(){let e=~this.hi,r=this.lo;return r?r=1+~r:e+=1,new _PbLong(r,e)}toString(){var e;return BI?this.toBigInt().toString():this.isNegative()?"-"+int64toString((e=this.negate()).lo,e.hi):int64toString(this.lo,this.hi)}toBigInt(){return assertBi(BI),BI.V.setInt32(0,this.lo,!0),BI.V.setInt32(4,this.hi,!0),BI.V.getBigInt64(0,!0)}};let PbLong=_PbLong;function assert(e,r){if(!e)throw new Error(r)}PbLong.ZERO=new _PbLong(0,0);const FLOAT32_MAX=34028234663852886e22,FLOAT32_MIN=-34028234663852886e22,UINT32_MAX=4294967295,INT32_MAX=2147483647,INT32_MIN=-2147483648;function assertInt32(e){if("number"!=typeof e)throw new Error("invalid int 32: "+typeof e);if(!Number.isInteger(e)||e>INT32_MAX||e<INT32_MIN)throw new Error("invalid int 32: "+e)}function assertUInt32(e){if("number"!=typeof e)throw new Error("invalid uint 32: "+typeof e);if(!Number.isInteger(e)||e>UINT32_MAX||e<0)throw new Error("invalid uint 32: "+e)}function assertFloat32(e){if("number"!=typeof e)throw new Error("invalid float 32: "+typeof e);if(Number.isFinite(e)&&(e>FLOAT32_MAX||e<FLOAT32_MIN))throw new Error("invalid float 32: "+e)}function reflectionLongConvert(e,r){switch(r){case LongType.BIGINT:return e.toBigInt();case LongType.NUMBER:return e.toNumber();default:return e.toString()}}class ReflectionJsonReader{constructor(e){this.info=e}prepare(){if(void 0===this.fMap){this.fMap={};for(const e of this.info.fields??[])this.fMap[e.name]=e,this.fMap[e.jsonName]=e,this.fMap[e.localName]=e}}assert(e,r,t){if(!e){let e=typeofJsonValue(t);throw"number"!=e&&"boolean"!=e||(e=t.toString()),new Error(`Cannot parse JSON ${e} for ${this.info.typeName}#`+r)}}read(e,r,t){this.prepare();var a,n,s=[];for([a,n]of Object.entries(e)){var i=this.fMap[a];if(!i){if(t.ignoreUnknownFields)continue;throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: `+a)}var o=i.localName;let e;if(i.oneof){if(s.includes(i.oneof))throw new Error(`Multiple members of the oneof group "${i.oneof}" of ${this.info.typeName} are present in JSON.`);s.push(i.oneof),e=r[i.oneof]={oneofKind:o}}else e=r;if("map"==i.kind){if(null!==n){this.assert(isJsonObject(n),i.name,n);var l,c,f=e[o];for([l,c]of Object.entries(n)){this.assert(null!==c,i.name+" map value",null);let e;switch(i.V.kind){case"message":e=i.V.T().internalJsonRead(c,t);break;case"enum":if(!1===(e=this.enum(i.V.T(),c,i.name,t.ignoreUnknownFields)))continue;break;case"scalar":e=this.scalar(c,i.V.T,i.V.L,i.name)}this.assert(void 0!==e,i.name+" map value",c);let r=l;i.K==ScalarType.BOOL&&(r="true"==r||"false"!=r&&r),f[r=this.scalar(r,i.K,LongType.STRING,i.name).toString()]=e}}}else if(i.repeat){if(null!==n){this.assert(Array.isArray(n),i.name,n);var u=e[o];for(const p of n){this.assert(null!==p,i.name,null);let e;switch(i.kind){case"message":e=i.T().internalJsonRead(p,t);break;case"enum":if(!1===(e=this.enum(i.T(),p,i.name,t.ignoreUnknownFields)))continue;break;case"scalar":e=this.scalar(p,i.T,i.L,i.name)}this.assert(void 0!==e,i.name,n),u.push(e)}}}else switch(i.kind){case"message":null===n&&"google.protobuf.Value"!=i.T().typeName?this.assert(void 0===i.oneof,i.name+" (oneof member)",null):e[o]=i.T().internalJsonRead(n,t,e[o]);break;case"enum":var h=this.enum(i.T(),n,i.name,t.ignoreUnknownFields);!1!==h&&(e[o]=h);break;case"scalar":e[o]=this.scalar(n,i.T,i.L,i.name)}}}enum(r,t,a,n){if("google.protobuf.NullValue"==r[0]&&assert(null===t,`Unable to parse field ${this.info.typeName}#${a}, enum ${r[0]} only accepts null.`),null===t)return 0;switch(typeof t){case"number":return assert(Number.isInteger(t),`Unable to parse field ${this.info.typeName}#${a}, enum can only be integral number, got ${t}.`),t;case"string":let e=t;r[2]&&t.substring(0,r[2].length)===r[2]&&(e=t.substring(r[2].length));var s=r[1][e];return void 0===s&&n?!1:(assert("number"==typeof s,`Unable to parse field ${this.info.typeName}#${a}, enum ${r[0]} has no value for "${t}".`),s)}assert(!1,`Unable to parse field ${this.info.typeName}#${a}, cannot parse enum value from ${typeof t}".`)}scalar(r,t,a,e){let n;try{switch(t){case ScalarType.DOUBLE:case ScalarType.FLOAT:if(null===r)return 0;if("NaN"===r)return Number.NaN;if("Infinity"===r)return Number.POSITIVE_INFINITY;if("-Infinity"===r)return Number.NEGATIVE_INFINITY;if(""===r)n="empty string";else if("string"==typeof r&&r.trim().length!==r.length)n="extra whitespace";else if("string"==typeof r||"number"==typeof r){var s=Number(r);if(Number.isNaN(s))n="not a number";else{if(Number.isFinite(s))return t==ScalarType.FLOAT&&assertFloat32(s),s;n="too large or small"}}break;case ScalarType.INT32:case ScalarType.FIXED32:case ScalarType.SFIXED32:case ScalarType.SINT32:case ScalarType.UINT32:if(null===r)return 0;let e;if("number"==typeof r?e=r:""===r?n="empty string":"string"==typeof r&&(r.trim().length!==r.length?n="extra whitespace":e=Number(r)),void 0===e)break;return(t==ScalarType.UINT32?assertUInt32:assertInt32)(e),e;case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:if(null===r)return reflectionLongConvert(PbLong.ZERO,a);if("number"!=typeof r&&"string"!=typeof r)break;return reflectionLongConvert(PbLong.from(r),a);case ScalarType.FIXED64:case ScalarType.UINT64:if(null===r)return reflectionLongConvert(PbULong.ZERO,a);if("number"!=typeof r&&"string"!=typeof r)break;return reflectionLongConvert(PbULong.from(r),a);case ScalarType.BOOL:if(null===r)return!1;if("boolean"!=typeof r)break;return r;case ScalarType.STRING:if(null===r)return"";if("string"!=typeof r){n="extra whitespace";break}try{encodeURIComponent(r)}catch(e){0;break}return r;case ScalarType.BYTES:if(null===r||""===r)return new Uint8Array(0);if("string"!=typeof r)break;return base64decode(r)}}catch(e){n=e.message}this.assert(!1,e+(n?" - "+n:""),r)}}class ReflectionJsonWriter{constructor(e){this.fields=e.fields??[]}write(e,r){var t,a,n={},s=e;for(const i of this.fields)i.oneof?(t=s[i.oneof]).oneofKind===i.localName&&(a="scalar"==i.kind||"enum"==i.kind?{...r,emitDefaultValues:!0}:r,assert(void 0!==(t=this.field(i,t[i.localName],a))),n[r.useProtoFieldName?i.name:i.jsonName]=t):void 0!==(a=this.field(i,s[i.localName],r))&&(n[r.useProtoFieldName?i.name:i.jsonName]=a);return n}field(r,t,a){let e=void 0;if("map"==r.kind){assert("object"==typeof t&&null!==t);var n={};switch(r.V.kind){case"scalar":for(var[s,i]of Object.entries(t)){i=this.scalar(r.V.T,i,r.name,!1,!0);assert(void 0!==i),n[s.toString()]=i}break;case"message":var o,l,c=r.V.T();for([o,l]of Object.entries(t)){var f=this.message(c,l,r.name,a);assert(void 0!==f),n[o.toString()]=f}break;case"enum":var u,h,p=r.V.T();for([u,h]of Object.entries(t)){assert(void 0===h||"number"==typeof h);var T=this.enum(p,h,r.name,!1,!0,a.enumAsInteger);assert(void 0!==T),n[u.toString()]=T}}(a.emitDefaultValues||0<Object.keys(n).length)&&(e=n)}else if(r.repeat){assert(Array.isArray(t));var d=[];switch(r.kind){case"scalar":for(let e=0;e<t.length;e++){var y=this.scalar(r.T,t[e],r.name,r.opt,!0);assert(void 0!==y),d.push(y)}break;case"enum":var g=r.T();for(let e=0;e<t.length;e++){assert(void 0===t[e]||"number"==typeof t[e]);var b=this.enum(g,t[e],r.name,r.opt,!0,a.enumAsInteger);assert(void 0!==b),d.push(b)}break;case"message":var m=r.T();for(let e=0;e<t.length;e++){var I=this.message(m,t[e],r.name,a);assert(void 0!==I),d.push(I)}}(a.emitDefaultValues||0<d.length||a.emitDefaultValues)&&(e=d)}else switch(r.kind){case"scalar":e=this.scalar(r.T,t,r.name,r.opt,a.emitDefaultValues);break;case"enum":e=this.enum(r.T(),t,r.name,r.opt,a.emitDefaultValues,a.enumAsInteger);break;case"message":e=this.message(r.T(),t,r.name,a)}return e}enum(e,r,t,a,n,s){if("google.protobuf.NullValue"==e[0])return null;if(void 0===r)assert(a);else if(0!==r||n||a)return assert("number"==typeof r),assert(Number.isInteger(r)),s||!e[1].hasOwnProperty(r)?r:e[2]?e[2]+e[1][r]:e[1][r]}message(e,r,t,a){return void 0===r?a.emitDefaultValues?null:void 0:e.internalJsonWrite(r,a)}scalar(e,r,t,a,n){if(void 0===r)assert(a);else{var s=n||a;switch(e){case ScalarType.INT32:case ScalarType.SFIXED32:case ScalarType.SINT32:return 0===r?s?0:void 0:(assertInt32(r),r);case ScalarType.FIXED32:case ScalarType.UINT32:return 0===r?s?0:void 0:(assertUInt32(r),r);case ScalarType.FLOAT:assertFloat32(r);case ScalarType.DOUBLE:return 0===r?s?0:void 0:(assert("number"==typeof r),Number.isNaN(r)?"NaN":r===Number.POSITIVE_INFINITY?"Infinity":r===Number.NEGATIVE_INFINITY?"-Infinity":r);case ScalarType.STRING:return""===r?s?"":void 0:(assert("string"==typeof r),r);case ScalarType.BOOL:return!1===r?!s&&void 0:(assert("boolean"==typeof r),r);case ScalarType.UINT64:case ScalarType.FIXED64:assert("number"==typeof r||"string"==typeof r||"bigint"==typeof r);var i=PbULong.from(r);return i.isZero()&&!s?void 0:i.toString();case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:assert("number"==typeof r||"string"==typeof r||"bigint"==typeof r);i=PbLong.from(r);return i.isZero()&&!s?void 0:i.toString();case ScalarType.BYTES:return(assert(r instanceof Uint8Array),r.byteLength)?base64encode(r):s?"":void 0}}}}function reflectionScalarDefault(e,r=LongType.STRING){switch(e){case ScalarType.BOOL:return!1;case ScalarType.UINT64:case ScalarType.FIXED64:return reflectionLongConvert(PbULong.ZERO,r);case ScalarType.INT64:case ScalarType.SFIXED64:case ScalarType.SINT64:return reflectionLongConvert(PbLong.ZERO,r);case ScalarType.DOUBLE:case ScalarType.FLOAT:return 0;case ScalarType.BYTES:return new Uint8Array(0);case ScalarType.STRING:return"";default:return 0}}class ReflectionBinaryReader{constructor(e){this.info=e}prepare(){var e;this.fieldNoToField||(e=this.info.fields??[],this.fieldNoToField=new Map(e.map(e=>[e.no,e])))}read(a,n,s,e){this.prepare();for(var r=void 0===e?a.len:a.pos+e;a.pos<r;){var[t,i]=a.tag(),o=this.fieldNoToField.get(t);if(o){let e=n,r=o.repeat,t=o.localName;switch(o.oneof&&(e=e[o.oneof]).oneofKind!==t&&(e=n[o.oneof]={oneofKind:t}),o.kind){case"scalar":case"enum":var l="enum"==o.kind?ScalarType.INT32:o.T,c="scalar"==o.kind?o.L:void 0;if(r){var f=e[t];if(i==WireType.LengthDelimited&&l!=ScalarType.STRING&&l!=ScalarType.BYTES)for(var u=a.uint32()+a.pos;a.pos<u;)f.push(this.scalar(a,l,c));else f.push(this.scalar(a,l,c))}else e[t]=this.scalar(a,l,c);break;case"message":r?(h=e[t],p=o.T().internalBinaryRead(a,a.uint32(),s),h.push(p)):e[t]=o.T().internalBinaryRead(a,a.uint32(),s,e[t]);break;case"map":var[h,p]=this.mapEntry(o,a,s);e[t][h]=p}}else{var T=s.readUnknownField;if("throw"==T)throw new Error(`Unknown field ${t} (wire type ${i}) for `+this.info.typeName);var d=a.skip(i);!1!==T&&(!0===T?UnknownFieldHandler.onRead:T)(this.info.typeName,n,t,i,d)}}}mapEntry(e,r,t){var a=r.uint32(),n=r.pos+a;let s=void 0,i=void 0;for(;r.pos<n;){var[o,l]=r.tag();switch(o){case 1:s=e.K==ScalarType.BOOL?r.bool().toString():this.scalar(r,e.K,LongType.STRING);break;case 2:switch(e.V.kind){case"scalar":i=this.scalar(r,e.V.T,e.V.L);break;case"enum":i=r.int32();break;case"message":i=e.V.T().internalBinaryRead(r,r.uint32(),t)}break;default:throw new Error(`Unknown field ${o} (wire type ${l}) in map entry for ${this.info.typeName}#`+e.name)}}if(void 0===s&&(a=reflectionScalarDefault(e.K),s=e.K==ScalarType.BOOL?a.toString():a),void 0===i)switch(e.V.kind){case"scalar":i=reflectionScalarDefault(e.V.T,e.V.L);break;case"enum":i=0;break;case"message":i=e.V.T().create()}return[s,i]}scalar(e,r,t){switch(r){case ScalarType.INT32:return e.int32();case ScalarType.STRING:return e.string();case ScalarType.BOOL:return e.bool();case ScalarType.DOUBLE:return e.double();case ScalarType.FLOAT:return e.float();case ScalarType.INT64:return reflectionLongConvert(e.int64(),t);case ScalarType.UINT64:return reflectionLongConvert(e.uint64(),t);case ScalarType.FIXED64:return reflectionLongConvert(e.fixed64(),t);case ScalarType.FIXED32:return e.fixed32();case ScalarType.BYTES:return e.bytes();case ScalarType.UINT32:return e.uint32();case ScalarType.SFIXED32:return e.sfixed32();case ScalarType.SFIXED64:return reflectionLongConvert(e.sfixed64(),t);case ScalarType.SINT32:return e.sint32();case ScalarType.SINT64:return reflectionLongConvert(e.sint64(),t)}}}class ReflectionBinaryWriter{constructor(e){this.info=e}prepare(){var e;this.fields||(e=this.info.fields?this.info.fields.concat():[],this.fields=e.sort((e,r)=>e.no-r.no))}write(n,s,i){this.prepare();for(const u of this.fields){let e,r,t=u.repeat,a=u.localName;if(u.oneof){var o=n[u.oneof];if(o.oneofKind!==a)continue;e=o[a],r=!0}else e=n[a],r=!1;switch(u.kind){case"scalar":case"enum":var l="enum"==u.kind?ScalarType.INT32:u.T;if(t)if(assert(Array.isArray(e)),t==RepeatType.PACKED)this.packed(s,l,u.no,e);else for(const h of e)this.scalar(s,l,u.no,h,!0);else void 0===e?assert(u.opt):this.scalar(s,l,u.no,e,r||u.opt);break;case"message":if(t){assert(Array.isArray(e));for(const p of e)this.message(s,i,u.T(),u.no,p)}else this.message(s,i,u.T(),u.no,e);break;case"map":assert("object"==typeof e&&null!==e);for(var[c,f]of Object.entries(e))this.mapEntry(s,i,u,c,f)}}var e=i.writeUnknownFields;!1!==e&&(!0===e?UnknownFieldHandler.onWrite:e)(this.info.typeName,n,s)}mapEntry(e,r,t,a,n){e.tag(t.no,WireType.LengthDelimited),e.fork();let s=a;switch(t.K){case ScalarType.INT32:case ScalarType.FIXED32:case ScalarType.UINT32:case ScalarType.SFIXED32:case ScalarType.SINT32:s=Number.parseInt(a);break;case ScalarType.BOOL:assert("true"==a||"false"==a),s="true"==a}switch(this.scalar(e,t.K,1,s,!0),t.V.kind){case"scalar":this.scalar(e,t.V.T,2,n,!0);break;case"enum":this.scalar(e,ScalarType.INT32,2,n,!0);break;case"message":this.message(e,r,t.V.T(),2,n)}e.join()}message(e,r,t,a,n){void 0!==n&&(t.internalBinaryWrite(n,e.tag(a,WireType.LengthDelimited).fork(),r),e.join())}scalar(e,r,t,a,n){var[r,s,i]=this.scalarInfo(r,a);i&&!n||(e.tag(t,r),e[s](a))}packed(r,e,t,a){if(a.length){assert(e!==ScalarType.BYTES&&e!==ScalarType.STRING),r.tag(t,WireType.LengthDelimited),r.fork();var[,n]=this.scalarInfo(e);for(let e=0;e<a.length;e++)r[n](a[e]);r.join()}}scalarInfo(e,r){let t=WireType.Varint,a;var n=void 0===r;let s=0===r;switch(e){case ScalarType.INT32:a="int32";break;case ScalarType.STRING:s=n||!r.length,t=WireType.LengthDelimited,a="string";break;case ScalarType.BOOL:s=!1===r,a="bool";break;case ScalarType.UINT32:a="uint32";break;case ScalarType.DOUBLE:t=WireType.Bit64,a="double";break;case ScalarType.FLOAT:t=WireType.Bit32,a="float";break;case ScalarType.INT64:s=n||PbLong.from(r).isZero(),a="int64";break;case ScalarType.UINT64:s=n||PbULong.from(r).isZero(),a="uint64";break;case ScalarType.FIXED64:s=n||PbULong.from(r).isZero(),t=WireType.Bit64,a="fixed64";break;case ScalarType.BYTES:s=n||!r.byteLength,t=WireType.LengthDelimited,a="bytes";break;case ScalarType.FIXED32:t=WireType.Bit32,a="fixed32";break;case ScalarType.SFIXED32:t=WireType.Bit32,a="sfixed32";break;case ScalarType.SFIXED64:s=n||PbLong.from(r).isZero(),t=WireType.Bit64,a="sfixed64";break;case ScalarType.SINT32:a="sint32";break;case ScalarType.SINT64:s=n||PbLong.from(r).isZero(),a="sint64"}return[t,a,n||s]}}function reflectionCreate(e){var r,t={};Object.defineProperty(t,MESSAGE_TYPE,{enumerable:!1,value:e});for(r of e.fields){var a=r.localName;if(!r.opt)if(r.oneof)t[r.oneof]={oneofKind:void 0};else if(r.repeat)t[a]=[];else switch(r.kind){case"scalar":t[a]=reflectionScalarDefault(r.T,r.L);break;case"enum":t[a]=0;break;case"map":t[a]={}}}return t}function reflectionMergePartial(e,r,t){let a,n=t,s;for(var i of e.fields){var o=i.localName;if(i.oneof){var l=n[i.oneof];if(null==(null==l?void 0:l.oneofKind))continue;if(a=l[o],(s=r[i.oneof]).oneofKind=l.oneofKind,null==a){delete s[o];continue}}else if(a=n[o],s=r,null==a)continue;switch(i.repeat&&(s[o].length=a.length),i.kind){case"scalar":case"enum":if(i.repeat)for(let e=0;e<a.length;e++)s[o][e]=a[e];else s[o]=a;break;case"message":var c=i.T();if(i.repeat)for(let e=0;e<a.length;e++)s[o][e]=c.create(a[e]);else void 0===s[o]?s[o]=c.create(a):c.mergePartial(s[o],a);break;case"map":switch(i.V.kind){case"scalar":case"enum":Object.assign(s[o],a);break;case"message":var f,u=i.V.T();for(f of Object.keys(a))s[o][f]=u.create(a[f])}}}}const defaultsWrite$1={emitDefaultValues:!1,enumAsInteger:!1,useProtoFieldName:!1,prettySpaces:0},defaultsRead$1={ignoreUnknownFields:!1};function jsonReadOptions(e){return e?{...defaultsRead$1,...e}:defaultsRead$1}function jsonWriteOptions(e){return e?{...defaultsWrite$1,...e}:defaultsWrite$1}function reflectionEquals(e,r,t){if(r!==t){if(!r||!t)return!1;for(var a of e.fields){var n=a.localName,s=(a.oneof?r[a.oneof]:r)[n],i=(a.oneof?t[a.oneof]:t)[n];switch(a.kind){case"enum":case"scalar":var o="enum"==a.kind?ScalarType.INT32:a.T;if((a.repeat?repeatedPrimitiveEq:primitiveEq)(o,s,i))break;return!1;case"map":if("message"==a.V.kind?repeatedMsgEq(a.V.T(),objectValues(s),objectValues(i)):repeatedPrimitiveEq("enum"==a.V.kind?ScalarType.INT32:a.V.T,objectValues(s),objectValues(i)))break;return!1;case"message":o=a.T();if(a.repeat?repeatedMsgEq(o,s,i):o.equals(s,i))break;return!1}}}return!0}const objectValues=Object.values;function primitiveEq(e,r,t){if(r!==t){if(e!==ScalarType.BYTES)return!1;var a=r,n=t;if(a.length!==n.length)return!1;for(let e=0;e<a.length;e++)if(a[e]!=n[e])return!1}return!0}function repeatedPrimitiveEq(r,t,a){if(t.length!==a.length)return!1;for(let e=0;e<t.length;e++)if(!primitiveEq(r,t[e],a[e]))return!1;return!0}function repeatedMsgEq(r,t,a){if(t.length!==a.length)return!1;for(let e=0;e<t.length;e++)if(!r.equals(t[e],a[e]))return!1;return!0}const defaultsWrite={writeUnknownFields:!0,writerFactory:()=>new BinaryWriter};function binaryWriteOptions(e){return e?{...defaultsWrite,...e}:defaultsWrite}class BinaryWriter{constructor(e){this.stack=[],this.textEncoder=e??new TextEncoder,this.chunks=[],this.buf=[]}finish(){this.chunks.push(new Uint8Array(this.buf));let r=0;for(let e=0;e<this.chunks.length;e++)r+=this.chunks[e].length;var t=new Uint8Array(r);let a=0;for(let e=0;e<this.chunks.length;e++)t.set(this.chunks[e],a),a+=this.chunks[e].length;return this.chunks=[],t}fork(){return this.stack.push({chunks:this.chunks,buf:this.buf}),this.chunks=[],this.buf=[],this}join(){var e=this.finish(),r=this.stack.pop();if(r)return this.chunks=r.chunks,this.buf=r.buf,this.uint32(e.byteLength),this.raw(e);throw new Error("invalid state, fork stack empty")}tag(e,r){return this.uint32((e<<3|r)>>>0)}raw(e){return this.buf.length&&(this.chunks.push(new Uint8Array(this.buf)),this.buf=[]),this.chunks.push(e),this}uint32(e){for(assertUInt32(e);127<e;)this.buf.push(127&e|128),e>>>=7;return this.buf.push(e),this}int32(e){return assertInt32(e),varint32write(e,this.buf),this}bool(e){return this.buf.push(e?1:0),this}bytes(e){return this.uint32(e.byteLength),this.raw(e)}string(e){e=this.textEncoder.encode(e);return this.uint32(e.byteLength),this.raw(e)}float(e){assertFloat32(e);var r=new Uint8Array(4);return new DataView(r.buffer).setFloat32(0,e,!0),this.raw(r)}double(e){var r=new Uint8Array(8);return new DataView(r.buffer).setFloat64(0,e,!0),this.raw(r)}fixed32(e){assertUInt32(e);var r=new Uint8Array(4);return new DataView(r.buffer).setUint32(0,e,!0),this.raw(r)}sfixed32(e){assertInt32(e);var r=new Uint8Array(4);return new DataView(r.buffer).setInt32(0,e,!0),this.raw(r)}sint32(e){return assertInt32(e),varint32write(e=(e<<1^e>>31)>>>0,this.buf),this}sfixed64(e){var r=new Uint8Array(8),t=new DataView(r.buffer),e=PbLong.from(e);return t.setInt32(0,e.lo,!0),t.setInt32(4,e.hi,!0),this.raw(r)}fixed64(e){var r=new Uint8Array(8),t=new DataView(r.buffer),e=PbULong.from(e);return t.setInt32(0,e.lo,!0),t.setInt32(4,e.hi,!0),this.raw(r)}int64(e){e=PbLong.from(e);return varint64write(e.lo,e.hi,this.buf),this}sint64(e){var e=PbLong.from(e),r=e.hi>>31;return varint64write(e.lo<<1^r,(e.hi<<1|e.lo>>>31)^r,this.buf),this}uint64(e){e=PbULong.from(e);return varint64write(e.lo,e.hi,this.buf),this}}const defaultsRead={readUnknownField:!0,readerFactory:e=>new BinaryReader(e)};function binaryReadOptions(e){return e?{...defaultsRead,...e}:defaultsRead}class BinaryReader{constructor(e,r){this.varint64=varint64read,this.uint32=varint32read,this.buf=e,this.len=e.length,this.pos=0,this.view=new DataView(e.buffer,e.byteOffset,e.byteLength),this.textDecoder=r??new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0})}tag(){var e=this.uint32(),r=e>>>3,e=7&e;if(r<=0||e<0||5<e)throw new Error("illegal tag: field no "+r+" wire type "+e);return[r,e]}skip(e){var r,t=this.pos;switch(e){case WireType.Varint:for(;128&this.buf[this.pos++];);break;case WireType.Bit64:this.pos+=4;case WireType.Bit32:this.pos+=4;break;case WireType.LengthDelimited:var a=this.uint32();this.pos+=a;break;case WireType.StartGroup:for(;(r=this.tag()[1])!==WireType.EndGroup;)this.skip(r);break;default:throw new Error("cant skip wire type "+e)}return this.assertBounds(),this.buf.subarray(t,this.pos)}assertBounds(){if(this.pos>this.len)throw new RangeError("premature EOF")}int32(){return 0|this.uint32()}sint32(){var e=this.uint32();return e>>>1^-(1&e)}int64(){return new PbLong(...this.varint64())}uint64(){return new PbULong(...this.varint64())}sint64(){var[e,r]=this.varint64(),t=-(1&e),e=(e>>>1|(1&r)<<31)^t,r=r>>>1^t;return new PbLong(e,r)}bool(){var[e,r]=this.varint64();return 0!==e||0!==r}fixed32(){return this.view.getUint32((this.pos+=4)-4,!0)}sfixed32(){return this.view.getInt32((this.pos+=4)-4,!0)}fixed64(){return new PbULong(this.sfixed32(),this.sfixed32())}sfixed64(){return new PbLong(this.sfixed32(),this.sfixed32())}float(){return this.view.getFloat32((this.pos+=4)-4,!0)}double(){return this.view.getFloat64((this.pos+=8)-8,!0)}bytes(){var e=this.uint32(),r=this.pos;return this.pos+=e,this.assertBounds(),this.buf.subarray(r,r+e)}string(){return this.textDecoder.decode(this.bytes())}}class MessageType{constructor(e,r,t){this.defaultCheckDepth=16,this.typeName=e,this.fields=r.map(normalizeFieldInfo),this.options=t??{},this.refTypeCheck=new ReflectionTypeCheck(this),this.refJsonReader=new ReflectionJsonReader(this),this.refJsonWriter=new ReflectionJsonWriter(this),this.refBinReader=new ReflectionBinaryReader(this),this.refBinWriter=new ReflectionBinaryWriter(this)}create(e){var r=reflectionCreate(this);return void 0!==e&&reflectionMergePartial(this,r,e),r}clone(e){var r=this.create();return reflectionMergePartial(this,r,e),r}equals(e,r){return reflectionEquals(this,e,r)}is(e,r=this.defaultCheckDepth){return this.refTypeCheck.is(e,r,!1)}isAssignable(e,r=this.defaultCheckDepth){return this.refTypeCheck.is(e,r,!0)}mergePartial(e,r){reflectionMergePartial(this,e,r)}fromBinary(e,r){r=binaryReadOptions(r);return this.internalBinaryRead(r.readerFactory(e),e.byteLength,r)}fromJson(e,r){return this.internalJsonRead(e,jsonReadOptions(r))}fromJsonString(e,r){e=JSON.parse(e);return this.fromJson(e,r)}toJson(e,r){return this.internalJsonWrite(e,jsonWriteOptions(r))}toJsonString(e,r){e=this.toJson(e,r);return JSON.stringify(e,null,(null==r?void 0:r.prettySpaces)??0)}toBinary(e,r){r=binaryWriteOptions(r);return this.internalBinaryWrite(e,r.writerFactory(),r).finish()}internalJsonRead(e,r,t){if(null===e||"object"!=typeof e||Array.isArray(e))throw new Error(`Unable to parse message ${this.typeName} from JSON ${typeofJsonValue(e)}.`);return t=t??this.create(),this.refJsonReader.read(e,t,r),t}internalJsonWrite(e,r){return this.refJsonWriter.write(e,r)}internalBinaryWrite(e,r,t){return this.refBinWriter.write(e,r,t),r}internalBinaryRead(e,r,t,a){a=a??this.create();return this.refBinReader.read(e,a,t,r),a}}
							/******************  initialization finish  *******************/
							switch (FORMAT) {
								case "application/protobuf":
								case "application/x-protobuf":
								case "application/vnd.google.protobuf":
									break;
								case "application/grpc":
								case "application/grpc+proto":
									/******************  initialization start  *******************/
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
												case "bilibili.app.viewunite.v1.View":
													/******************  initialization start  *******************/
													// protobuf/bilibili/app/viewunite/v1/viewunite.proto
													/******************  initialization finish  *******************/
													switch(PATHs?.[1]) {
														case "View": // 播放页
															/******************  initialization start  *******************/
															// protobuf/bilibili/app/viewunite/v1/viewunite.proto
															class ViewReq$Type extends MessageType{constructor(){super("bilibili.app.viewunite.v1.ViewReq",[{no:1,name:"aid",kind:"scalar",T:4,L:2},{no:2,name:"bvid",kind:"scalar",T:9},{no:3,name:"from",kind:"scalar",T:9},{no:4,name:"spmid",kind:"scalar",T:9},{no:5,name:"from_spmid",kind:"scalar",T:9},{no:6,name:"session_id",kind:"scalar",T:9},{no:8,name:"track_id",kind:"scalar",T:9},{no:9,name:"extra_content",kind:"map",K:9,V:{kind:"scalar",T:9}},{no:10,name:"play_mode",kind:"scalar",T:9},{no:12,name:"biz_extra",kind:"scalar",T:9},{no:13,name:"ad_extra",kind:"scalar",T:9}])}}
															const ViewReq = new ViewReq$Type();
															/******************  initialization finish  *******************/
															let data = ViewReq.fromBinary(body);
															$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
															body = ViewReq.toBinary(data);
															// 判断线路
															infoGroup.seasonId = parseInt(data?.extraContent?.season_id, 10) || infoGroup.seasonId;
															infoGroup.epId = parseInt(data?.extraContent.ep_id, 10) || infoGroup.epId;
															if (!infoGroup.seasonId && !infoGroup.epId) infoGroup.isPGC = false;
															if (Caches.ss.has(infoGroup?.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup?.seasonId)
															else if (Caches.ep.has(infoGroup?.epId)) infoGroup.locales = Caches.ep.get(infoGroup?.epId);
															break;
														};
														break;
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
															data.vod.forceHost = Settings?.ForceHost ?? 1;
															body = PlayViewUniteReq.toBinary(data);
															// 判断线路
															infoGroup.seasonId = parseInt(data?.extraContent?.season_id, 10) || infoGroup.seasonId;
															infoGroup.epId = parseInt(data?.extraContent.ep_id, 10) || infoGroup.epId;
															if (!infoGroup.seasonId && !infoGroup.epId) infoGroup.isPGC = false;
															if (Caches.ss.has(infoGroup?.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup?.seasonId)
															else if (Caches.ep.has(infoGroup?.epId)) infoGroup.locales = Caches.ep.get(infoGroup?.epId);
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
															data.forceHost = Settings?.ForceHost ?? 1;
															body = PlayViewReq.toBinary(data);
															// 判断线路
															infoGroup.seasonId = data?.seasonId;
															infoGroup.epId = data?.epId;
															if (Caches.ss.has(infoGroup?.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup?.seasonId)
															else if (Caches.ep.has(infoGroup?.epId)) infoGroup.locales = Caches.ep.get(infoGroup?.epId);
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
													/******************  initialization finish  ******************/
													switch (PATHs?.[1]) {
														case "SearchAll": { // 全部结果（综合）
															/******************  initialization start  *******************/
															class SearchAllRequest$Type extends MessageType{constructor(){super("bilibili.polymer.app.search.v1.SearchAllRequest",[{no:1,name:"keyword",kind:"scalar",T:9}])}create(value){const message={keyword:""};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.keyword=reader.string();break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.keyword!=="")writer.tag(1,WireType.LengthDelimited).string(message.keyword);let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
															const SearchAllRequest = new SearchAllRequest$Type();
															/******************  initialization finish  ******************/
															let data = SearchAllRequest.fromBinary(body);
															$.log(`🚧 ${$.name}`, `data: ${JSON.stringify(data)}`, "");
															({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(data?.keyword));
															data.keyword = infoGroup?.keyword;
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
															({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(data?.keyword));
															data.keyword = infoGroup?.keyword;
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
									rawBody = addgRPCHeader({ header, body }); // gzip压缩有问题，别用
									break;
							};
							// 写入二进制数据
							if ($.isQuanX()) $request.bodyBytes = rawBody;
							else $request.body = rawBody;
							break;
					};
					//break; // 不中断，继续处理URL
				case "GET":
				case "HEAD":
				case "OPTIONS":
				case undefined: // QX牛逼，script-echo-response不返回method
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
											if (Caches.ss.has(infoGroup?.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup?.seasonId)
											else if (Caches.ep.has(infoGroup?.epId)) infoGroup.locales = Caches.ep.get(infoGroup?.epId);
											break;
									};
									break;
							};
							break;
						case "search.bilibili.com":
							switch (PATH) {
								case "all": // 搜索-全部结果-web（综合）
									({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup?.keyword));
									URL.query.keyword = encodeURIComponent(infoGroup?.keyword);
									break;
							};
							break;
						case "app.bilibili.com":
						case "app.biliapi.net":
							switch (PATH) {
								case "x/v2/splash/show": // 开屏页
								case "x/v2/splash/list": // 开屏页
								case "x/v2/splash/brand/list": // 开屏页
								case "x/v2/splash/event/list2": // 开屏页
									break;
								case "x/v2/feed/index": // 推荐页
									break;
								case "x/v2/feed/index/story": // 首页短视频流
									break;
								case "x/v2/search/square": // 搜索页
									break;
								case "x/v2/search": // 搜索-全部结果-api（综合）
								case "x/v2/search/type": // 搜索-分类结果-api（番剧、用户、影视、专栏）
									({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup?.keyword));
									URL.query.keyword = encodeURIComponent(infoGroup?.keyword);
									break;
								case "x/v2/space": // 用户空间
									switch (infoGroup?.mId) {
										case 11783021: // 哔哩哔哩番剧出差
										case 1988098633: // b站_戲劇咖
										case 2042149112: // b站_綜藝咖
											infoGroup.locales = Settings.Locales.filter(locale => locale !== "CHN");
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
								case "pgc/player/web/v2/playurl": // 番剧-播放地址-web-v2
								case "/pgc/player/web/v2/playurl": // 番剧-播放地址-web-v2
								case "pgc/player/web/playurl/html5": // 番剧-播放地址-web-HTML5
									if (Caches.ss.has(infoGroup?.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup?.seasonId)
									else if (Caches.ep.has(infoGroup?.epId)) infoGroup.locales = Caches.ep.get(infoGroup?.epId);
									break;
								case "pgc/page/bangumi": // 追番页
								case "pgc/page/cinema/tab": // 观影页
									break;
								case "x/player/wbi/playurl": // UGC-用户生产内容-播放地址
									break;
								case "x/space/acc/info": // 用户空间-账号信息-pc
								case "x/space/wbi/acc/info": // 用户空间-账号信息-wbi
									switch (infoGroup?.mId) {
										case 11783021: // 哔哩哔哩番剧出差
										case 1988098633: // b站_戲劇咖
										case 2042149112: // b站_綜藝咖
											infoGroup.locales = Settings.Locales.filter(locale => locale !== "CHN");
											break;
										default:
											break;
									};
									break;
								case "pgc/view/v2/app/season": // 番剧页面-内容-app
								case "pgc/view/web/season": // 番剧-内容-web
								case "pgc/view/pc/season": // 番剧-内容-pc
									if (Caches.ss.has(infoGroup?.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup?.seasonId)
									else if (Caches.ep.has(infoGroup?.epId)) infoGroup.locales = Caches.ep.get(infoGroup?.epId);
									break;
								case "x/web-interface/search": // 搜索-全部结果-web（综合）
								case "x/web-interface/search/all/v2": // 搜索-全部结果-web（综合）
								case "x/web-interface/search/type": // 搜索-分类结果-web（番剧、用户、影视、专栏）
									({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup?.keyword));
									URL.query.keyword = encodeURIComponent(infoGroup.keyword);
									break;
								case "x/web-interface/wbi/search/all/v2": // 搜索-全部结果-wbi（综合）
								case "x/web-interface/wbi/search/type": // 搜索-分类结果-wbi（番剧、用户、影视、专栏）
									({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(infoGroup?.keyword, "+"));
									URL.query.keyword = encodeURIComponent(infoGroup.keyword);
									break;
							};
							break;
						case "api.live.bilibili.com":
							switch (PATH) {
								case "xlive/app-room/v1/index/getInfoByRoom": // 直播
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
			$.log(`🚧 ${$.name}，信息组, infoGroup: ${JSON.stringify(infoGroup)}`, "");
			// 请求策略
			switch (PATH) {
				case "bilibili.app.viewunite.v1.View/View": //
				case "pgc/view/v2/app/season": // 番剧页面-内容-app
				case "pgc/view/web/season": // 番剧-内容-web
				case "pgc/view/pc/season": // 番剧-内容-pc
					if (!infoGroup?.isPGC) $.log(`⚠ ${$.name}, 不是 PGC, 跳过`, "")
					else if (infoGroup?.locales.length !== 0) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, infoGroup?.locales));
					else ({ request: $request, response: $response } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
					$response = undefined; // 需要http-response，所以不能echo response
					switch ($.platform()) { // 兼容性处理
						case "Loon":
						case "Stash":
						case "Surge":
						default:
							break;
						case "Shadowrocket":
							// 直通模式，不处理，否则无法进http-response
							delete $request?.policy;
							break;
						case "Quantumult X":
							// 直通模式，不处理，否则无法进http-response
							delete $request?.opts?.policy;
							break;
					};
					break;
				case "all": // 搜索-全部结果-html（综合）
				case "bilibili.polymer.app.search.v1.Search/SearchAll": // 搜索-全部结果-proto（综合）
				case "bilibili.polymer.app.search.v1.Search/SearchByType": // 搜索-分类结果-proto（番剧、用户、影视、专栏）
				case "x/web-interface/search": // 搜索-全部结果-web（综合）
				case "x/web-interface/search/all/v2": // 搜索-全部结果-web（综合）
				case "x/web-interface/search/type": // 搜索-分类结果-web（番剧、用户、影视、专栏）
				case "x/web-interface/wbi/search/all/v2": // 搜索-全部结果-wbi（综合）
				case "x/web-interface/wbi/search/type": // 搜索-分类结果-wbi（番剧、用户、影视、专栏）
				case "x/v2/search": // 搜索-全部结果-api（综合）
				case "x/v2/search/type": // 搜索-分类结果-api（番剧、用户、影视、专栏）
					if (infoGroup?.locale) $request = ReReqeust($request, Settings.Proxies[infoGroup?.locale]);
					break;
				default:
					if (!infoGroup?.isPGC) $.log(`⚠ ${$.name}, 不是 PGC, 跳过`, "")
					else if (infoGroup?.locales.length !== 0) ({ request: $request } = await processStrategy("locales", $request, Settings.Proxies, Settings.Locales, infoGroup?.locales));
					else ({ request: $request, response: $response } = await processStrategy("mutiFetch", $request, Settings.Proxies, Settings.Locales));
					break;
			};
			if (!$response) { // 无（构造）回复数据
				switch ($.platform()) { // 兼容性处理
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
		case false:
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
						case "applecation/octet-stream":
							// 返回二进制数据
							//$.log(`${$response.bodyBytes.byteLength}---${$response.bodyBytes.buffer.byteLength}`);
							$.done({ status: $response.status, headers: $response.headers, bodyBytes: $response.bodyBytes });
							break;
					};
				} else $.done({ response: $response });
				break;
			};
			case undefined: { // 无构造回复数据，发送修改的请求数据
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
						case "applecation/octet-stream":
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
function ReReqeust(request = {}, proxyName = undefined) {
	$.log(`⚠ ${$.name}, Construct Redirect Reqeusts`, "");
	if (proxyName) {
		switch ($.platform()) {
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
			default:
				// 返回普通数据
				delete request.bodyBytes;
				break;
			case "application/protobuf":
			case "application/x-protobuf":
			case "application/vnd.google.protobuf":
			case "application/grpc":
			case "application/grpc+proto":
			case "applecation/octet-stream":
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
    $.log(`☑️ ${$.name}, Determine Response Availability`, "");
	const FORMAT = (response?.headers?.["Content-Type"] ?? response?.headers?.["content-type"])?.split(";")?.[0];
	$.log(`🚧 ${$.name}, Determine Response Availability`, `FORMAT: ${FORMAT}`, "");
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
	$.log(`✅ ${$.name}, Determine Response Availability`, `isAvailable:${isAvailable}`, "");
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
	$.log(`☑️ ${$.name}, Process Strategy, type: ${type}`, "");
	let response = undefined;
	let locale = undefined;
	let responses = undefined;
	switch (type) {
		case "locales": // 本地已有可用地区缓存
			availableLocales = availableLocales.filter(locale => locales.includes(locale));
			break;
		case "mutiFetch": // 本地无可用地区缓存，并发请求
			responses = await mutiFetch(request, proxies, locales);
			availableLocales = checkLocales(responses);
			break;
		case "random": // 随机用一个
			availableLocales = locales;
			break;
		case "randomwithoutCHN": // 随机用一个，但不用CHN
			availableLocales = locales.filter(locale => locale !== "CHN");
			break;
		case undefined:
		default:
			availableLocales = [];
			break;
	};
	$.log(`🚧 ${$.name}, Process Strategy, availableLocales: ${availableLocales}`, "");
	locale = availableLocales[0]; // 用第一个
	request = ReReqeust(request, proxies[locale]); // 用第一个
	response = responses?.[locale]; // 随机用一个
	$.log(`✅ ${$.name}, Process Strategy, Available Locales: ${availableLocales}, Locale: ${locale}`, "");
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
	$.log(`🎉 ${$.name}, Check Search Keyword`, `Keyword: ${keyword}, Locale: ${locale}`, "");
	return { keyword, locale };
};
