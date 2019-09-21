/**
 * 网络管理器
 */
class NetManager {
    /**
     * 索引服务器地址
     */
    public static IndexServer: string = Main.IsLocationDebug ? "http://127.0.0.1:9901" : "http://w.gamegold.xin:9901";

    public static get IndexServerInfo() {
        return Main.IsLocationDebug? {host:'127.0.0.1', port:9901} : {host:'w.gamegold.xin', port:9901};
    }
    
    /**
     * 游服地址
     */
    public static ServerUrl: string = "";

    /**
     * 游服端口号
     */
    public static ServerPort: string = "";

    /**
     * 发送请求
     * @param reqSet        网络请求,为URL拼接字
     * @param fun           网络请求方法(默认为null)
     * @param isPriority    优先级（默认优先）
     */
    public static SendRequest(reqSet: any, fun: Function = null, isPriority: boolean = true) {
        if (!Main.IsNeedNetDebug) return;
        Facade.instance().fetch(reqSet, fun);
        if (NetManager._errorCodeSet == null){
            NetManager._InitErrorCode();
        }
    }

    /**
     * 发送下一条
     */
    private static _NextSend() {
        NetManager._currentNetCon = null;
        NetManager._reconnectionTime = 0;
        if (NetManager._requestFirstSet.length > 0) {
            NetManager._currentNetCon = NetManager._requestFirstSet.shift();
        }
        else if (NetManager._requestSecondSet.length > 0) {
            NetManager._currentNetCon = NetManager._requestSecondSet.shift();
        }
        if (NetManager._currentNetCon != null) {
            NetManager._GetData(NetManager._currentNetCon.ReqSet, NetManager._currentNetCon.CompleteFun);
        }
    }

    /**
     * 从服务器获取参数到本地
     * @param setFunc       参数方法
     * @param paramSet      参数集合
     */
    private static _GetData(paramSet: any[], setFunc: Function = null) {
        var url_Server: string = "";
        if (NetManager.ServerUrl == ""){
            url_Server = NetManager.IndexServer + "/index.html?";
        }
        else {
            url_Server = "https://" + NetManager.ServerUrl + ":" + NetManager.ServerPort + "/index.html?";
        }
        
        //创建GET请求
        var output: string;
        var url_base: string = "";
        output = url_base;
        if (paramSet != null){
            for (var i = 0; i < paramSet.length; i++){
                url_base += paramSet[i];
                output += paramSet[i];
            }
        }
        var url = url_Server + url_base;
        output = url_Server + output;
        
        NetManager._currentSendUrl = url;
        var loader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var request = new egret.URLRequest(url); 
        request.method = egret.URLRequestMethod.GET;
        loader._request = request;
        JsonpReq.process(loader);
        NetManager._timer = 0;
    }
    
    /**
     * GET请求完成
     */
    public static OnGetComplete(data: Object): void {
        if (data == null) {
            NetManager._NextSend();
        }
        else if (NetManager._currentNetCon.CompleteFun != null) {
            try {
                if (data["code"] != NetManager.SuccessCode){
                    // console.log(NetManager._errorCodeSet[data["code"].toString()]);
                    // console.log("发送链接：" + NetManager._currentSendUrl);
                    // console.log("错误代码:" + data["code"] + "    发送链接：" + NetManager._currentSendUrl);
                }
                // Main.Instance.PromptWindow.showPrompt(true, "错误代码:" + data["code"] + "    发送链接：" + NetManager._currentSendUrl);
                NetManager._currentNetCon.CompleteFun(data);
                NetManager._NextSend();
            }
            catch (e) {
                Main.AddDebug("消息处理出错,发送链接：" + NetManager._currentSendUrl);
                Main.AddDebug(e);
                NetManager._NextSend();
            }
        }
    }
    
    /**
     * 帧响应
     * @param frameTime     两次调用间隔时间
     */
    public static Process(frameTime: number) {
        if (NetManager._currentNetCon != null) {
            var timeOut: number = 1000 * 15;
            NetManager._timer += frameTime;
            if (NetManager._timer >= timeOut) {
                console.log("消息处理超时,链接：" + NetManager._currentSendUrl);
                NetManager._NextSend();
            }
        }
    }

    /**
     * 初始化错误代码
     */
    private static _InitErrorCode(){
        NetManager._errorCodeSet = [];
        // NetManager._errorCodeSet["-2"] = "活动未开始";
        // NetManager._errorCodeSet["-1"] = "活动已结束";
        // NetManager._errorCodeSet["1001"] = "参数不匹配";
        // NetManager._errorCodeSet["101"] = "当前关卡ID错误";
        // NetManager._errorCodeSet["102"] = "消灭怪物不足";
        // NetManager._errorCodeSet["103"] = "战斗结果异常";
        // NetManager._errorCodeSet["104"] = "战斗超时";
        // NetManager._errorCodeSet["105"] = "战斗用时太短";
        // NetManager._errorCodeSet["901"] = "元宝不足";
        // NetManager._errorCodeSet["902"] = "金币不足";
        // NetManager._errorCodeSet["903"] = "专属碎片不足";
        // NetManager._errorCodeSet["904"] = "达到最大等级";
        // NetManager._errorCodeSet["905"] = "数量不足";
        // NetManager._errorCodeSet["501"] = "冷却时间未结束";
        // NetManager._errorCodeSet["601"] = "商品不存在";
        // NetManager._errorCodeSet["602"] = "达到数量限制";
        // NetManager._errorCodeSet["999"] = "挂机中...";
    }

    /**
     * 正确代码
     */
    public static SuccessCode: number = 0;

    // 变量
    private static _requestFirstSet: NetContent[] = [];                     // 网络请求集合(优先级高)
    private static _requestSecondSet: NetContent[] = [];                    // 网络请求集合(优先级低)
    private static _currentNetCon: NetContent = null;                       // 当前请求内容
    private static _currentSendUrl: string;                                 // 当前发送链接
    private static _timer: number = 0;                                      // 计时器
    private static _errorCodeSet: Array<string>;                            // 错误代码
    private static _reconnectionTime: number = 0;                           // 重连次数
}

/**
 * 网络请求数据
 */
class NetContent {
    /**
     * 构造方法
     */
    public constructor(reqSet: any, fun: Function) {
        this._reqSet = reqSet;
        this._completeFun = fun;
    }
    
    /**
     * 请求集合
     */
    public get ReqSet(): any {
        return this._reqSet;
    }
    
    /**
     * 完成回调
     */
    public get CompleteFun(): Function {
        return this._completeFun;
    }


    // 变量
    private _reqSet: any;                       // 请求集合（用于参数拼接）
    private _completeFun: Function;             // 完成回调
}