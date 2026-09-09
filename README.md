# 🪐 Biliverse: 🌐 Global

## 设置面板

接入模板同时包含版本对应的 BoxJS JSON Mock 与 PreferencePanes latest Release 的 api.js。dev 的 JSON、纯配置响应和订阅与业务脚本一次性发布到同一个 Gist；正式版 JSON 固定到对应 Release tag。设置页及 POST /api/get、set、delete 由通用 api.js 提供，业务脚本不再处理旧设置 API，也不再依赖网站托管的模块 HTML。更新模块即可使用，不需要独立设置插件。
