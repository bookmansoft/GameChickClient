/**
 * qqSDK接口实现
 */
class QQSDKMgr{
    /**
     * 初始化
     */
    public static Init(){
        if (Main.IsLocationDebug) return;
        // SetOnShareHandler(QQSDKMgr._OnShareReturn);
    }

    /**
     * 打开连接
     */
    public static OpenURL(url: string){
        if (Main.IsLocationDebug) return;
        // openUrl(url);
    }

    /**
     * 弹出支付接口
     */
    public static PopPayTips(score){
        if (Main.IsLocationDebug) return;
        PopPayTips(score);
    }

    /**
     * 分享
     * @param   desc        描述文本（默认：我爱跑、爱跳、爱吃！我胖但我自豪！我就是鸡小德~）
     * @param   imageUrl    分享图片（默认：http://res.cdn.173kw.com/jxd/100px.png）
     * @param   callback    分享成功回调
     */
    public static Share(desc: string = "", imageUrl: string = "", shareType: number = 0, callback: Function = null){
        if (Main.IsLocationDebug) return;
        QQSDKMgr._Share(desc, imageUrl, "", shareType, callback);
    }

    /**
     * 分享给指定好友
     * @param   openId      好友OpenID，不为""时向好友发送消息，不拉起弹窗
     * @param   desc        描述文本（默认：我爱跑、爱跳、爱吃！我胖但我自豪！我就是鸡小德~）
     * @param   imageUrl    分享图片（默认：http://res.cdn.173kw.com/jxd/100px.png）
     */
    public static ShareFriend(openId: string, desc: string = "", shareType:number = 0, imageUrl: string = ""){
        if (Main.IsLocationDebug) return;
        QQSDKMgr._Share(desc, imageUrl, openId, shareType, null);
    }

    /**
     * QQ分享
     * @param   desc        描述文本（默认：我爱跑、爱跳、爱吃！我胖但我自豪！我就是鸡小德~）
     * @param   imageUrl    分享图片（默认：http://res.cdn.173kw.com/jxd/100px.png）
     * @param   openId      好友OpenID，不为""时向好友发送消息，不拉起弹窗
     * @param   callback    分享成功回调
     */
    private static _Share(desc: string, imageUrl: string, openId: string, shareType:number = 0, callback: Function){
        QQSDKMgr._shareCallback = callback;
        var data : JSON = JSON.parse("{}");
        data["title"] = StringMgr.GetText("sharetext3");
        data["desc"] = desc != ""? desc : StringMgr.GetText("sharetext4");
        data["share_type"] = shareType;     // 分享类型0 QQ好友，1 QQ空间, 2 微信好友,3 微信朋友圈
        data["share_url"] = "window.OPEN_DATA && window.OPEN_DATA.shareurl || window.location.href";
        data["image_url"] = imageUrl != ""? imageUrl : "https://res.cdn.173kw.com/jxd/100px.png";
        data["back"] = true;
        if (openId != ""){
            data["toUin"] = openId;
            data["uinType"] = 0;
            QQSDKMgr._shareCallback = null;
            ShareMessage(data, null);
        }
        else{
            ShareMessage(data, QQSDKMgr._OnShareReturn);
        }
    }

    /**
     * 分享回调
     */
    private static _OnShareReturn(o: Object){
        if (Main.IsLocationDebug) return;
        if (o["retCode"] == "0"){ // 成功
            // QQSDKMgr._ShareTask();      // 检测当日分享任务是否完成
            if (QQSDKMgr._shareCallback != null){
                QQSDKMgr._shareCallback(); 
            }
        }
        else{ // 失败
            PromptManager.CreatCenterTip(false,true,"分享失败");
        }
        QQSDKMgr._shareCallback = null;
        if (WindowManager.WaitPage().IsVisibled){
            // Main.AddDebug("分享返回");
            ResReadyMgr.IsReady("prompt");
        }
    }

    /**
     * 注册
     */
    public static ReportRegister(){
        if (Main.IsLocationDebug) return;
        ReportRegister();
    }

    /**
     * 登入
     */
    public static ReportLogin(){
        if (Main.IsLocationDebug) return;
        ReportLogin();
    }

    /**
     * 设置支付成功回调
     */
    public static SetPaySuccess(callback: Function){
        if (Main.IsLocationDebug) return;
        SetPaySuccess(callback);
    }

    /**
     * 设置支付出错回调
     */
    public static SetPayError(callback: Function){
        if (Main.IsLocationDebug) return;
        SetPayError(callback);
    }

    /**
     * 设置支付关闭回调
     */
    public static SetPayClose(callback: Function){
        if (Main.IsLocationDebug) return;
        SetPayClose(callback);
    }

    /**
     * 获取pf
     */
    public static GetPF(): string{
        if (Main.IsLocationDebug) return "wanba_ts";
        return GetPF();
    }

    /**
     * 获取设备信息
     */
    public static GetPlatform(): number{
        if (Main.IsLocationDebug) return 2;
        return GetPlatform();
    }

    /**
     * 添加桌面快捷方式
     */
    public static AddShortcut(title: string = "", icon: string = ""){
        if (Main.IsLocationDebug) return;
        if (title == "") title = StringMgr.GetText("sharetext3");
        if (icon == "") icon = "http://res.cdn.173kw.com/jxd/icon100-old.png";
        
        //AddShortcut(title, icon);
    }

    /**
     * 设备是否在后台
     */
    public static get AppInBackground(): boolean{
        if (Main.IsLocationDebug) return false;
        return false;
    }

    /**
     * 显示生成桌面快捷方式图标浮点按钮
     */
    public static SetOnAddShortcutHandler(){
        if (Main.IsLocationDebug) return;
        
        //SetOnAddShortcutHandler(QQSDKMgr.AddShortcut);
    }

    /**
     * 设置应用图标
     */
    public static SetAppicon(icon: string = ""){
        if (Main.IsLocationDebug) return;
        if (icon == ""){
            icon = "http://res.cdn.173kw.com/jxd/100px.png";
        }
        
        //SetAppicon(icon);
    }

    /**
     * 格式化时间，返回00:00:00
     */
    public static FormatTime(time: number): string{
        var text: string = "";
        if (time < 0) time = 0;
        var h: number = Math.floor(time / 3600);
        var m: number = Math.floor((time % 3600) / 60);
        var s: number = time % 60 | 0;
        var hStr: string = h < 10? "0" + h.toString() : h.toString();
        var mStr: string = m < 10? "0" + m.toString() : m.toString();
        var sStr: string = s < 10? "0" + s.toString() : s.toString();
        text = hStr + ":" + mStr + ":" + sStr;
        return text;
    }

    /**
     * 解析HTML文本
     */
    public static HtmlParser(text: string): egret.ITextElement[]{
        if (QQSDKMgr._htmlParser == null){
            QQSDKMgr._htmlParser = new egret.HtmlTextParser();
        }
        return QQSDKMgr._htmlParser.parse(text);
    }

    /**
     * 登入，异步获取Openid和Openkey（当下有效Openkey）
     */
    public static Login(){
        if (Main.IsLocationDebug){
            LoginMgr.Login();
            return;
        }
        
        //GetRealOpenkey(QQSDKMgr._LoginReturn.bind(QQSDKMgr));
    }

    /**
     * 登入返回
     */
    private static _LoginReturn(d){
        var json: Object = d;
        var code: number = json["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("登入腾讯出错，code=" + code);
            QQSDKMgr.Login();
            return;
        }
        var openid: string = json["data"]["openid"];
        var openkey: string = json["data"]["openkey"];
        QQSDKMgr._openid = openid;
        QQSDKMgr._openkey = openkey;
        // QQSDKMgr._banbenNum = json["data"]["qua"]["version"];//json["data"]["qua"]["subVersion"];
        // Main.AddDebug("版本号:" + QQSDKMgr._banbenNum);
        LoginMgr.Login();
    }

    /**
     * 版本号
     */
    public static get BanBenNum(): string{
        return QQSDKMgr._banbenNum;
    }

    /**
     * openid
     */
    public static get OpenID(): string{
        if (Main.IsLocationDebug) return "BA6EE39A439DCCA6920FCC7719A0EE7D";
        return QQSDKMgr._openid;
    }

    /**
     * openkey
     */
    public static get OpenKey(): string{
        if (Main.IsLocationDebug) return "0000000";
        return QQSDKMgr._openkey;
    }

    /**
     * 获取openid
     */
    public static GetOpenid(): string{
        // if (Main.IsLocationDebug) return "111";
        // if (Main.IsLocationDebug) return "54646415646";
        if (Main.IsLocationDebug) return "BA6EE39A439DCCA6920FCC7719A0EE7D";
        return GetOpenid();
    }


    /**
     * 获取openkey
     */
    public static GetOpenkey(): string{
        if (Main.IsLocationDebug) return "36C9AA1A751088761BA1D54C8DFDF0D0";
        return GetOpenkey();
    }

    // 变量
    private static _shareCallback: Function = null;             // 分享回调
    private static _openid: string;                             // openid
    private static _openkey: string;                            // openkey
    private static _banbenNum: string = "";                     // 版本号
    private static _htmlParser: egret.HtmlTextParser;           // Html解析
}