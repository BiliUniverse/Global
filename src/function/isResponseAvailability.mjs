import { log } from "@nsnanocat/util";

/**
 * Determine Response Availability
 * @author VirgilClyne
 * @param {Object} response - Original Response Content
 * @return {Boolean} is Available
 */
export default function isResponseAvailability(response = {}) {
	log("☑️ Determine Response Availability", "");
	//log(`statusCode: ${response.statusCode}`, `headers: ${JSON.stringify(response.headers, null, 2)}`, "");
	const FORMAT = (response?.headers?.["Content-Type"] ?? response?.headers?.["content-type"])?.split(";")?.[0];
	log("🚧 Determine Response Availability", `FORMAT: ${FORMAT}`, "");
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
							const data = JSON.parse(response?.body).data;
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
									}
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
									}
									switch (data?.dialog?.code) {
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
	log("✅ Determine Response Availability", `isAvailable:${isAvailable}`, "");
	return isAvailable;
}
