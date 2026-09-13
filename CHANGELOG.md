### 🔄 Other Changes
  * 设置页面资源与模块 API 分离，分别使用 PreferencePanes 1.0.0 的 `web.js` 和 `api.js`

### 🆕 New Features
  * 新增 `评论区` 限制与可用性的修改
  * 新增 `[储存] 配置类型 (Storage)` 选项，支持 `Argument` / `PersistentStore` / `database` 三种配置源

### 🛠️ Bug Fixes
  * 修复 grpc 响应头缺失的问题 by @VirgilClyne

### 🔣 Dependencies
  * 升级了 `@nsnanocat/url`
  * 升级了 `@nsnanocat/util`
    * `Lodash` polyfill 新增 `merge` 能力
    * 现在来自 `$argument` （`插件选项`与`模块参数`）的设置将深层合并覆盖来自 `$persistentStore/$prefs (BoxJs)`  的配置
    * 用户在未更新 `$persistentStore/$prefs (BoxJs)` 的情况下也不会影响新选项与功能的应用
    * 使用过 `$persistentStore/$prefs (BoxJs)` 不会再导致 `$argument` （`插件选项`与`模块参数`）的设置无效
  * 添加了 `@nsnanocat/grpc`
  * 升级了 `@rspack/cli` 和 `@rspack/core` 至 `^1.7.6`
  * 降级了 `node-polyfill-webpack-plugin` 至 `^4.0.0`
  * 升级了 `@nsnanocat/util` 至 `^2.1.5`

### 🔄 Other Changes
  * 优化 `地区限制检测` 逻辑
  * 优化 `番剧许可与权利` 的修改
  * 优化 `强制CDN主机名类型` 的修改范围
