import { Console } from "@nsnanocat/util";

/**
 * Determine Response Availability
 * @author VirgilClyne
 * @param {Object} response - Original Response Content
 * @return {Boolean} is Available
 */
export default function isResponseAvailability(response = {}) {
	Console.log("☑️ Determine Response Availability");
	//Console.debug(`statusCode: ${response.statusCode}`, `headers: ${JSON.stringify(response.headers, null, 2)}`);
	const FORMAT = (response?.headers?.["Content-Type"] ?? response?.headers?.["content-type"])?.split(";")?.[0];
	Console.debug(`FORMAT: ${FORMAT}`);
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
						case "": // 无内容
							switch (response?.headers?.["content-length"] ?? response?.headers?.["Content-Length"]) {
								case undefined:
									isAvailable = true;
									break;
								default:
									if (Number.parseInt(response?.headers?.["content-length"] ?? response?.headers?.["Content-Length"]) < 1400) isAvailable = false;
									break;
							}
							break;
						case "-404":
						default:
							isAvailable = false;
							break;
					}
					break;
				case "text/json":
				case "application/json":
					switch (response?.headers?.["bili-status-code"]) {
						case "0":
						case undefined: {
							const body = JSON.parse(response?.body);
							if (body?.result) {
								switch (body?.result?.play_check?.play_detail) {
									case "PLAY_NONE":
										isAvailable = false;
										break;
									case "PLAY_WHOLE":
										isAvailable = true;
										break;
								}
								switch (body?.result?.play_check?.limit_play_reason) {
									case "AREA_LIMIT":
										isAvailable = false;
										break;
									case undefined:
										isAvailable = true;
										break;
								}
							}
							if (body?.data) {
								switch (response?.headers?.idc) {
									case "sgp001":
									case "sgp002":
										switch (body?.data?.limit) {
											case "":
											case undefined:
												isAvailable = true;
												break;
											default:
												isAvailable = false;
												break;
										}
										break;
									case "shjd":
									case undefined:
									default:
										switch (body?.data?.video_info?.code) {
											case 0:
											default:
												isAvailable = true;
												break;
											case undefined:
												isAvailable = false;
												break;
										}
										switch (body?.data?.dialog?.code) {
											case undefined:
												isAvailable = true;
												break;
											case 6010001:
											default:
												isAvailable = false;
												break;
										}
										break;
								}
							}
							break;
						}
						case "-404": // 啥都木有
						case "-10403":
						case "10015001": // 版权地区受限
						default:
							isAvailable = false;
							break;
					}
					break;
				case "text/html":
					isAvailable = true;
					break;
			}
			break;
		case 403:
		case 404:
		case 415:
		default:
			isAvailable = false;
			break;
	}
	Console.log("✅ Determine Response Availability", `isAvailable:${isAvailable}`);
	return isAvailable;
}
