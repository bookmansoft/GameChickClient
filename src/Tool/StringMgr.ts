/**
 * 字符串管理
 */
class StringMgr{
    /**
     * 简体中文
     */
    public static CN: string = "cn";

    /**
     * 繁体中文
     */
    public static TCN: string = "tcn";

    /**
     * 英文
     */
    public static EN: string = "en";

    /**
     * 设置语言
     */
    public static set Language(value: string){
        if (StringMgr._type == value) return;
        StringMgr._data = null;
        StringMgr._type = value;
        StringMgr._JsonData;
        GameEvent.DispatchEvent(EventType.LanguageChange);
    }

    /**
     * 设置语言
     */
    public static get Language(): string{
        return StringMgr._type;
    }

    /**
     * 语言后缀
     */
    public static get LanguageSuffix(): string{
        var lg: string = "_" + StringMgr.Language;
        if (StringMgr.Language != StringMgr.EN) lg = "";
        return lg;
    }

    /**
     * 获取数据JSON
     */
    private static get _JsonData(): JSON{
        if (StringMgr._data == null){
            StringMgr._data = RES.getRes("textcfg_" + StringMgr._type + "_json");
        }
        return StringMgr._data;
    }

    /**
     * 获取常量配置
     * @param key 键
     */
    public static GetText(key: string): string{
        var data: JSON = StringMgr._JsonData[key];
        if (data != null){
            return data["text"];
        }
        return "";
    }
    

    // 变量
    private static _data: JSON;                         // 常量数据JSON
    private static _type: string = StringMgr.CN;        // 语言版本类型
}