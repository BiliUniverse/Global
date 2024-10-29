export interface Settings {
    /**
     * 总功能开关
     *
     * 是否启用此APP修改
     *
     * @defaultValue true
     */
    Switch?: boolean;
    /**
     * 强制CDN主机名类型
     *
     * 请设置强制返回的CDN主机名类型。
     *
     * @remarks
     *
     * Possible values:
     * - `'0'` - IP: 返回远端DNS解析地址（强烈不推荐！严重影响域名分流规则与CDN重定向）
     * - `'1'` - HTTP: 返回HTTP域名（推荐，免去重定向时MitM操作）
     * - `'2'` - HTTPS: 返回HTTPS域名（不推荐，重定向时需对指定域名启用MitM）
     *
     * @defaultValue "1"
     */
    ForceHost?: '0' | '1' | '2';
    /**
     * 启用自动识别与分流功能的地区
     *
     * 请选择启用自动识别与分流功能的地区。
     *
     * @remarks
     *
     * Possible values:
     * - `'CHN'` - 🇨🇳中国大陆
     * - `'HKG'` - 🇭🇰中国香港
     * - `'MAC'` - 🇲🇴中国澳门
     * - `'TWN'` - 🇹🇼中国台湾
     *
     * @defaultValue ["CHN","HKG","TWN"]
     */
    Locales?: ('CHN' | 'HKG' | 'MAC' | 'TWN')[];
    Proxies?: {
    /**
         * [🇨🇳中国大陆] 代理策略名称
         *
         * 请填写此地区的代理或策略组名称。
         *
         * @defaultValue "DIRECT"
         */
        CHN?: string;
    /**
         * [🇭🇰中国香港] 代理策略名称
         *
         * 请填写此地区的代理或策略组名称。
         *
         * @defaultValue "🇭🇰香港"
         */
        HKG?: string;
    /**
         * [🇲🇴中国澳门] 代理策略名称
         *
         * 请填写此地区的代理或策略组名称。
         *
         * @defaultValue "🇲🇴澳门"
         */
        MAC?: string;
    /**
         * [🇹🇼中国台湾] 代理策略名称
         *
         * 请填写此地区的代理或策略组名称。
         *
         * @defaultValue "🇹🇼台湾"
         */
        TWN?: string;
};
}
