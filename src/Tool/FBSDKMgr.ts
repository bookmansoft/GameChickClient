/**
 * fbSDK接口实现
 */
class FBSDKMgr {
	/**
     * 初始化
     */
    public static Init(){
        if (Main.IsLocationDebug) return;
        // SetOnShareHandler(FBSDKMgr._OnShareReturn);
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
        return FBSDKMgr._Share(desc, imageUrl, "", shareType, callback);
    }

	/**
     * QQ分享
     * @param   desc        描述文本（默认：我爱跑、爱跳、爱吃！我胖但我自豪！我就是鸡小德~）
     * @param   imageUrl    分享图片（默认：http://res.cdn.173kw.com/jxd/100px.png）
     * @param   openId      好友OpenID，不为""时向好友发送消息，不拉起弹窗
     * @param   callback    分享成功回调
     */
    private static _Share(desc: string, imageUrl: string, openId: string, shareType:number = 0, callback: Function){
        FBSDKMgr._shareCallback = callback;
        var data : JSON = JSON.parse("{}");
        data["title"] = StringMgr.GetText("sharetext3");
        data["desc"] = desc != ""? desc : StringMgr.GetText("sharetext4");
        data["share_type"] = shareType;     // 分享类型0 QQ好友，1 QQ空间, 2 微信好友,3 微信朋友圈
        data["share_url"] = "window.OPEN_DATA && window.OPEN_DATA.shareurl || window.location.href";
        data["image_url"] = imageUrl != ""? imageUrl : "https://res.cdn.173kw.com/jxd/100px.png";
        data["back"] = true;
        // if (openId != ""){
        //     data["toUin"] = openId;
        //     data["uinType"] = 0;
        //     FBSDKMgr._shareCallback = null;
        //     ShareMessage(data, null);
        // }
        // else{
        //     ShareMessage(data, FBSDKMgr._OnShareReturn);
        // }
        return data["desc"];
    }

    /**
     * 分享回调
     */
    private static _OnShareReturn(o: Object){
        if (Main.IsLocationDebug) return;
        if (o["retCode"] == "0"){ // 成功
            // FBSDKMgr._ShareTask();      // 检测当日分享任务是否完成
            if (FBSDKMgr._shareCallback != null){
                FBSDKMgr._shareCallback(); 
            }
        }
        else{ // 失败
            PromptManager.CreatCenterTip(false,true,"分享失败");
        }
        FBSDKMgr._shareCallback = null;
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
     * 设备是否在后台
     */
    public static get AppInBackground(): boolean{
        if (Main.IsLocationDebug) 
            return false;
        return false;
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
        if (FBSDKMgr._htmlParser == null){
            FBSDKMgr._htmlParser = new egret.HtmlTextParser();
        }
        return FBSDKMgr._htmlParser.parse(text);
    }

    /**
     * 登入，异步获取Openid和Openkey（当下有效Openkey）
     */
    public static Login(){
        if (Main.IsLocationDebug){
            LoginMgr.Login();
            return;
        }
    }

    /**
     * 登入返回
     */
    private static _LoginReturn(d){
        var json: Object = d;
        var code: number = json["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("登入腾讯出错，code=" + code);
            FBSDKMgr.Login();
            return;
        }
        var openid: string = json["data"]["openid"];
        var openkey: string = json["data"]["openkey"];
        FBSDKMgr._openid = openid;
        FBSDKMgr._openkey = openkey;
        // FBSDKMgr._banbenNum = json["data"]["qua"]["version"];//json["data"]["qua"]["subVersion"];
        // Main.AddDebug("版本号:" + FBSDKMgr._banbenNum);
        LoginMgr.Login();
    }

    /**
     * 版本号
     */
    public static get BanBenNum(): string{
        return FBSDKMgr._banbenNum;
    }

    /**
     * openid
     */
    public static get OpenID(): string{
        if (Main.IsLocationDebug) return "118935915563834";
        return FBSDKMgr._openid;
    }

    /**
     * openkey
     */
    public static get OpenKey(): string{
        if (Main.IsLocationDebug) return "EAAEbE7cMEpABAJJbg18ocHCiXJASIZCYQ71vNcoUnjeGAL9sfN047jna6XxEJPOhqx8BDXeq00a0KcttAJx45WC8LqaVZBB8zuxbJBPgZA6TnB2bT5fGwbFRbIcqQmYOGqkBtuufpSGjk3AgKMeZBVQNEMtOUg0oOjk1y6ZA6nYs4kNUdP6fizqzDQQXpbJZBm0LXzZCXK4GkP3Mx16ZAfUMpBAPURvWvGEGuCKbxuQjBn94IXfdTkDd";
        return FBSDKMgr._openkey;
    }

    /**
     * 获取openid
     */
    public static GetOpenid(): string{
        // if (Main.IsLocationDebug) return "111";
        // if (Main.IsLocationDebug) return "54646415646";
        if (Main.IsLocationDebug) return "118935915563834";
        return GetOpenid();
    }


    /**
     * 获取openkey
     */
    public static GetOpenkey(): string{
        if (Main.IsLocationDebug) return "EAAEbE7cMEpABAJJbg18ocHCiXJASIZCYQ71vNcoUnjeGAL9sfN047jna6XxEJPOhqx8BDXeq00a0KcttAJx45WC8LqaVZBB8zuxbJBPgZA6TnB2bT5fGwbFRbIcqQmYOGqkBtuufpSGjk3AgKMeZBVQNEMtOUg0oOjk1y6ZA6nYs4kNUdP6fizqzDQQXpbJZBm0LXzZCXK4GkP3Mx16ZAfUMpBAPURvWvGEGuCKbxuQjBn94IXfdTkDd";
        return GetOpenkey();
    }

    // 变量
    private static _shareCallback: Function = null;             // 分享回调
    private static _openid: string;                             // openid
    private static _openkey: string;                            // openkey
    private static _banbenNum: string = "";                     // 版本号
    private static _htmlParser: egret.HtmlTextParser;           // Html解析
}