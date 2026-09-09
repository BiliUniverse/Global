# 🪐 Biliverse: 🌐 Global

## 设置面板

接入模板同时包含版本对应的 BoxJS JSON Mock 与 PreferencePanes latest Release 的 api.js。dev 的 JSON、纯配置响应和订阅与业务脚本一次性发布到同一个 Gist；正式版 JSON 固定到对应 Release tag。设置页及 POST /api/get、set、delete 由通用 api.js 提供，业务脚本不再处理旧设置 API，也不再依赖网站托管的模块 HTML。更新模块即可使用，不需要独立设置插件。

配置探测的响应头 `X-PreferencePanes-Version` 与本次脚本构建版本一致：dev 为 `dev.<commit>`，正式版为发布版本。主页只发送 HEAD，不读取设置。Loon 使用原生 `rewrite_v2` Mock 与响应头动作，需要 Loon 3.5.1 或更新版本。
