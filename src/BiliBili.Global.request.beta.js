import _ from './ENV/Lodash.mjs'
import $Storage from './ENV/$Storage.mjs'
import ENV from "./ENV/ENV.mjs";

import Database from "./database/BiliBili.mjs";
import setENV from "./function/setENV.mjs";
import pako from "./pako/dist/pako.esm.mjs";
import addgRPCHeader from "./function/addgRPCHeader.mjs";

import { WireType, UnknownFieldHandler, reflectionMergePartial, MESSAGE_TYPE, MessageType, BinaryReader, isJsonObject, typeofJsonValue, jsonWriteOptions } from "../node_modules/@protobuf-ts/runtime/build/es2015/index.js";

const $ = new ENV("📺 BiliBili: 🌐 Global v0.7.0(1008) request.beta");

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
							//$.log(`🚧 $request.body: ${JSON.stringify($request.body)}`, "");
							let rawBody = $.isQuanX() ? new Uint8Array($request.bodyBytes ?? []) : $request.body ?? new Uint8Array();
							//$.log(`🚧 isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`, "");
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
															$.log(`🚧 data: ${JSON.stringify(data)}`, "");
															let UF = UnknownFieldHandler.list(data);
															//$.log(`🚧 UF: ${JSON.stringify(UF)}`, "");
															if (UF) {
																UF = UF.map(uf => {
																	//uf.no; // 22
																	//uf.wireType; // WireType.Varint
																	// use the binary reader to decode the raw data:
																	let reader = new BinaryReader(uf.data);
																	let addedNumber = reader.int32(); // 7777
																	$.log(`🚧 no: ${uf.no}, wireType: ${uf.wireType}, reader: ${JSON.stringify(reader)}, addedNumber: ${addedNumber}`, "");
																});
															};
															body = ViewReq.toBinary(data);
															// 判断线路
															infoGroup.seasonId = parseInt(data?.extraContent?.season_id, 10) || infoGroup.seasonId;
															infoGroup.epId = parseInt(data?.extraContent.ep_id, 10) || infoGroup.epId;
															if (infoGroup.seasonId || infoGroup.epId) infoGroup.type = "PGC";
															if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
															else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
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
															$.log(`🚧 data: ${JSON.stringify(data)}`, "");
															let UF = UnknownFieldHandler.list(data);
															//$.log(`🚧 UF: ${JSON.stringify(UF)}`, "");
															if (UF) {
																UF = UF.map(uf => {
																	//uf.no; // 22
																	//uf.wireType; // WireType.Varint
																	// use the binary reader to decode the raw data:
																	let reader = new BinaryReader(uf.data);
																	let addedNumber = reader.int32(); // 7777
																	$.log(`🚧 no: ${uf.no}, wireType: ${uf.wireType}, reader: ${reader}, addedNumber: ${addedNumber}`, "");
																});
															};
															data.vod.forceHost = Settings?.ForceHost ?? 1;
															body = PlayViewUniteReq.toBinary(data);
															// 判断线路
															infoGroup.seasonId = parseInt(data?.extraContent?.season_id, 10) || infoGroup.seasonId;
															infoGroup.epId = parseInt(data?.extraContent.ep_id, 10) || infoGroup.epId;
															if (infoGroup.seasonId || infoGroup.epId) infoGroup.type = "PGC";
															if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
															else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
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
															$.log(`🚧 data: ${JSON.stringify(data)}`, "");
															let UF = UnknownFieldHandler.list(data);
															//$.log(`🚧 UF: ${JSON.stringify(UF)}`, "");
															if (UF) {
																UF = UF.map(uf => {
																	//uf.no; // 22
																	//uf.wireType; // WireType.Varint
																	// use the binary reader to decode the raw data:
																	let reader = new BinaryReader(uf.data);
																	let addedNumber = reader.int32(); // 7777
																	$.log(`🚧 no: ${uf.no}, wireType: ${uf.wireType}, reader: ${reader}, addedNumber: ${addedNumber}`, "");
																});
															};
															data.forceHost = Settings?.ForceHost ?? 1;
															body = PlayViewReq.toBinary(data);
															// 判断线路
															infoGroup.seasonId = data?.seasonId;
															infoGroup.epId = data?.epId;
															infoGroup.type = "PGC";
															if (Caches.ss.has(infoGroup.seasonId)) infoGroup.locales = Caches.ss.get(infoGroup.seasonId)
															else if (Caches.ep.has(infoGroup.epId)) infoGroup.locales = Caches.ep.get(infoGroup.epId);
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
															$.log(`🚧 data: ${JSON.stringify(data)}`, "");
															let UF = UnknownFieldHandler.list(data);
															//$.log(`🚧 UF: ${JSON.stringify(UF)}`, "");
															if (UF) {
																UF = UF.map(uf => {
																	//uf.no; // 22
																	//uf.wireType; // WireType.Varint
																	// use the binary reader to decode the raw data:
																	let reader = new BinaryReader(uf.data);
																	let addedNumber = reader.int32(); // 7777
																	$.log(`🚧 no: ${uf.no}, wireType: ${uf.wireType}, addedNumber: ${addedNumber}`, "");
																});
															};
															({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(data?.keyword));
															data.keyword = infoGroup.keyword;
															$.log(`🚧 data: ${JSON.stringify(data)}`, "");
															body = SearchAllRequest.toBinary(data);
															break;
														};
														case "SearchByType": { // 分类结果（番剧、用户、影视、专栏）
															/******************  initialization start  *******************/
															class SearchByTypeRequest$Type extends MessageType{constructor(){super("bilibili.polymer.app.search.v1.SearchByTypeRequest",[{no:1,name:"type",kind:"scalar",T:5},{no:2,name:"keyword",kind:"scalar",T:9}])}create(value){const message={type:0,keyword:""};globalThis.Object.defineProperty(message,MESSAGE_TYPE,{enumerable:false,value:this});if(value!==undefined)reflectionMergePartial(this,message,value);return message}internalBinaryRead(reader,length,options,target){let message=target??this.create(),end=reader.pos+length;while(reader.pos<end){let[fieldNo,wireType]=reader.tag();switch(fieldNo){case 1:message.type=reader.int32();break;case 2:message.keyword=reader.string();break;default:let u=options.readUnknownField;if(u==="throw")throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);let d=reader.skip(wireType);if(u!==false)(u===true?UnknownFieldHandler.onRead:u)(this.typeName,message,fieldNo,wireType,d)}}return message}internalBinaryWrite(message,writer,options){if(message.type!==0)writer.tag(1,WireType.Varint).int32(message.type);if(message.keyword!=="")writer.tag(2,WireType.LengthDelimited).string(message.keyword);let u=options.writeUnknownFields;if(u!==false)(u==true?UnknownFieldHandler.onWrite:u)(this.typeName,message,writer);return writer}}
															const SearchByTypeRequest = new SearchByTypeRequest$Type();
															/******************  initialization finish  *******************/
															let data = SearchByTypeRequest.fromBinary(body);
															$.log(`🚧 data: ${JSON.stringify(data)}`, "");
															let UF = UnknownFieldHandler.list(data);
															//$.log(`🚧 UF: ${JSON.stringify(UF)}`, "");
															if (UF) {
																UF = UF.map(uf => {
																	//uf.no; // 22
																	//uf.wireType; // WireType.Varint
																	// use the binary reader to decode the raw data:
																	let reader = new BinaryReader(uf.data);
																	let addedNumber = reader.int32(); // 7777
																	$.log(`🚧 no: ${uf.no}, wireType: ${uf.wireType}, addedNumber: ${addedNumber}`, "");
																});
															};
															({ keyword: infoGroup.keyword, locale: infoGroup.locale } = checkKeyword(data?.keyword));
															data.keyword = infoGroup.keyword;
															$.log(`🚧 data: ${JSON.stringify(data)}`, "");
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
								//case "pgc/view/web/season": // 番剧-内容-web
									//infoGroup.type = "PGC";
									//if (Caches.AccessKey) {
									// https://github.com/ipcjs/bilibili-helper/blob/user.js/packages/unblock-area-limit/src/api/biliplus.ts
									//};
									//break;
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
			//url.searchParams.set("type", infoGroup.type);
			$request.url = url.toString();
			$.log(`🚧 调试信息`, `$request.url: ${$request.url}`, "");
			$.log(`🚧 ${$.name}，信息组, infoGroup: ${JSON.stringify(infoGroup)}`, "");
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
							$.log(`⚠ 不是 PGC, 跳过`, "")
							break;
					};
					switch ($.platform()) { // 直通模式，不处理，否则无法进http-response
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
							$.log(`⚠ 不是 PGC, 跳过`, "")
							break;
					};
					break;
			};
			if (!$response) { // 无（构造）回复数据
				switch ($.platform()) { // 已有指定策略的请求，根据策略fetch
					case "Shadowrocket":
					case "Quantumult X":
						if ($request.policy) $response = await $.fetch($request);
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
 * Fetch
 * @author VirgilClyne
 * @param {Object} request - Original Request Content
 * @param {Object} proxies - Proxies Name
 * @param {Array} locales - Locales Names
 * @param {array} availableLocales - Available Locales @ Caches
 * @return {Promise<request>} modified request
 */
async function availableFetch(request = {}, proxies = {}, locales = [], availableLocales = []) {
	$.log(`☑️ availableFetch`, `availableLocales: ${availableLocales}`, "");
	availableLocales = availableLocales.filter(locale => locales.includes(locale));
	let locale = "";
	locale = availableLocales[Math.floor(Math.random() * availableLocales.length)];
	request.policy = proxies[locale];
	$.log(`✅ availableFetch`, `locale: ${locale}`, "");
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
	$.log(`☑️ mutiFetch`, `locales: ${locales}`, "");
	let responses = {};
	await Promise.allSettled(locales.map(async locale => {
		request["policy"] = proxies[locale];
		if ($.isQuanX()) request.body = request.bodyBytes;
		responses[locale] = await $.fetch(request);
	}));
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
