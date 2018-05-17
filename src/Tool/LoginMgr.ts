/**
 * 登入管理
 */
class LoginMgr {
    /**
     * 登入是否成功
     */
    public static LoginSuccess: boolean = false;
    /**
     * 本地数据时间
     */
    private static LocalTimeKey: string = "localtime";
    /**
     * 本地数据token
     */
    private static LocalTokenKey: string = "localtoken";
    /**
     * 本地数据保存Openkey
     */
    private static LocalOpenid: string = "localopenid";

    /**
     * 登录流程
     */
    public static Login(){
        if (!Main.IsNeedNetDebug){
            LoginMgr.LoginSuccess = true;
            UnitManager.CreatePlayer("1", "测试", 1000000, 1000000, 0, "", "resource/res/common/anniu_off.png");
            UnitManager.Player.VIPTime = 2592000;
            if (Main.Instance != null){
                Main.Instance.StartCreateScene();
            }
        }

        //console.log(window["FBData"].userID, window["FBData"].accessToken);
        
        var openid: string = '15588882222'; //window["FBData"]["userID"];//FBSDKMgr.OpenID;
        var openkey: string = '123456'; //window["FBData"]["accessToken"];//FBSDKMgr.OpenKey;
        var pf: string = "wanba_ts";//FBSDKMgr.GetPF();

        Game.IsIos = true;//FBSDKMgr.GetPlatform() == 2;        // 获取设备信息
        // 获取本地token
        var time: number = Math.floor(new Date().getTime()/1000);
        var localOpenid: string = egret.localStorage.getItem(LoginMgr.LocalOpenid);
        var localTime: number = 0;
        let localToken = "";
        if (openid == localOpenid){
            if (egret.localStorage.getItem(LoginMgr.LocalTokenKey) != null){
                localTime = parseInt(egret.localStorage.getItem(LoginMgr.LocalTimeKey));
                if (time - localTime < 5400){
                    localToken = egret.localStorage.getItem(LoginMgr.LocalTokenKey);
                }
            }
        }

        // // 测试使用=>
        // if (localOpenid != null && localOpenid != "") openid = localOpenid;
        // else{
        //     openid = Math.floor(Math.random() * 1000000000000000).toString();
        // }
        // egret.localStorage.setItem(LoginMgr.LocalOpenid, openid);

        var data : JSON = JSON.parse("{}");
        data["openid"] = openid;
        data["domain"] = Game.IsIos? "tx.IOS" : "tx.Android";

        LoginMgr._openid = openid;

        // Main.AddDebug(openid+","+data["domain"]);

        // 监听消息
        Facade.instance().watch(UnitManager.ReceivePhysical, NetNumber.ReciviePhysical);
        Facade.instance().watch(FriendManager.FriendInfo, NetNumber.FriendInfor.toString());
        Facade.instance().watch(FriendManager.ShouHello, NetNumber.SendHelloNum.toString());
        Facade.instance().watch(FriendManager.UpDataFriendState, NetNumber.FriendUserStatus.toString());
        Facade.instance().watch(FrequencyManager.UpdateShareTime, NetNumber.ShareTimeUpdate);
        Facade.instance().watch(IntegralManager.UpDataScore, NetNumber.ActivityScore.toString());
        Facade.instance().watch(UnitStatusMgr.UpdateStatus, NetNumber.UserStatusUpdate);
        Facade.instance().watch(UnitManager.ReveiceDailyActiveState, NetNumber.DailyActiveButtonVisible);
        Facade.instance().watch(RollingNoticeManager.ReceiveRollingNotice, NetNumber.RollingNotice);
        Facade.instance().watch(UnitManager.ReceiveBonus, NetNumber.ReceiveBonus);
        Facade.instance().watch(UnitManager.ReceiveBonus, NetNumber.ReceiveShareScenceBonus);

        SlaveManager.InitWatch();

        //首先登录索引服，获取其分配的游戏服地址
        // Main.AddDebug("登入index服务器");
        NetManager.SendRequest(
            ["func=getServerInfo&oemInfo=" + JSON.stringify(data) + "&control=config"],
            LoginMgr._LoginReturn
        );
    }

    /**
     * 登入服务器返回
     */
    private static _LoginReturn(jsonData: Object){
        // Main.AddDebug("Index服务器返回:" + jsonData["code"]);
        if (jsonData["code"] != NetManager.SuccessCode){
            if (LoginMgr._reLoginTime < 3){
                LoginMgr.Login();
                LoginMgr._reLoginTime += 1;
            }
            return;
        }
        LoginMgr._isLoginIpSer = true;
        var ip: string = jsonData["data"]["ip"];
        var port: string = jsonData["data"]["port"];
        NetManager.ServerUrl = ip;
        NetManager.ServerPort = port;
        Facade.instance().SocketInit(ip, port);

        //开始登录游戏服
        // Main.AddDebug(ip + ":" + port + "    设备信息:" + FBSDKMgr.GetPlatform());
        LoginMgr.RealLogin();
    }

    /**
     * 登入游服
     * @param isUseToken    是否使用本地Token登入
     */
    public static RealLogin(isUseToken: boolean = true){
        if (!LoginMgr._isLoginIpSer) 
            return;

        // 正式游戏信息
        var openkey: string = '123456'; //window["FBData"]["accessToken"];//FBSDKMgr.OpenKey;
        var pf: string = "wanba_ts";//FBSDKMgr.GetPF();
        Game.IsIos = true;//FBSDKMgr.GetPlatform() == 2;        // 获取设备信息
        // 获取本地token
        var time: number = Math.floor(new Date().getTime()/1000);
        var localTime: number = 0;
        let localToken = "";
        if (!isUseToken){
            localToken = "";
        }
        // Main.AddDebug("Openid:" + LoginMgr._openid + "");
        // 登入
        var data : JSON = JSON.parse("{}");
        data["domain"] = Game.IsIos? "tx.IOS" : "tx.Android";
        data["openid"] = LoginMgr._openid;
        data["openkey"] = openkey;
        data["pf"] = pf;
        data["token"] = localToken;
        NetManager.SendRequest(
            ["func=" + NetNumber.Logoin + "&oemInfo=" + JSON.stringify(data)],
            LoginMgr._ReceiveInit
        );
        
        var date = new Date();
        LoginMgr._time = date.getTime();
    }
    private static _time: number;

    /**
     * 接收初始化消息
     */
    public static _ReceiveInit(jsonData: Object) {
        var date = new Date();
        // Main.AddDebug("登入游服返回" + jsonData["code"])
        // Main.AddDebug("时间间隔:" + (LoginMgr._time - date.getTime()));
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("游服返回:" + jsonData["code"]);
            LoginMgr.RealLogin(false);
            return;
        }
        LoginMgr.LoginSuccess = true;
        var data: Object = jsonData["data"];
        var id: string = data["openid"];

        var money: number = data["info"]["money"];
        if (money == null || money < 0){
            Main.AddDebug("金钱数据异常：money=" + money);
        }
        let pinggai: number = data["info"]["diamond"];
        if (pinggai == null || pinggai < 0){
            Main.AddDebug("瓶盖数据异常：pinggai=" + pinggai);
        }
        var maxScore: number = data["info"]["score"];
        if (maxScore == null || maxScore < 0){
            Main.AddDebug("分数数据异常：maxScore=" + maxScore);
        }
        else maxScore = 0;
        var name: string = decodeURIComponent(data["name"]);
        if (!name){
            Main.AddDebug("名字异常：name=" + name);
        }
        var token: string = data["token"];
        if (!token){
            Main.AddDebug("Token异常：token=" + token);
        }
        var time: number = data["time"];
        if (!time || time < 0){
            Main.AddDebug("时间异常：time=" + time);
        }
        var itemData: Object = data["item"];
        if (!itemData){
            Main.AddDebug("道具异常：itemData=" + itemData);
        }
        var status: number = data["info"]["status"];
        if (status != null){
            UnitStatusMgr.Status = status;
            if (UnitStatusMgr.IsNewPlay){
                QQSDKMgr.ReportRegister();
                UnitStatusMgr.SetValue(UserStatus.IsNewbie, false);
            }
        }
        QQSDKMgr.ReportLogin();
        Object.keys(itemData).map(function(key){
            ItemManager.SetItemCount(parseInt(key), itemData[key]["num"]);
        });
        var roleID: number = data["info"]["role"];
        if (!!roleID){
            UnitManager.ChangeRole(data["info"]["role"]);
        }
        else{
            Main.AddDebug("角色形象异常：roleID=" + roleID);
            UnitManager.ChangeRole(1001);
        }

        var imaUrl = data["info"]["headIcon"];
        UnitManager.CreatePlayer(id, name, money, pinggai, maxScore, token, imaUrl);
        egret.localStorage.setItem(LoginMgr.LocalTimeKey, time.toString());
        egret.localStorage.setItem(LoginMgr.LocalTokenKey, token);
        if (Main.Instance != null){
            Main.Instance.StartCreateScene();
        }

        // 检测VIP
        NetManager.SendRequest(["func=" + NetNumber.VIPCheck],
                            LoginMgr._VIPCom);

        // 获取奴隶系统消息
        NetManager.SendRequest(["func=" + NetNumber.GetSlaveList]);
        
        // 获取活动信息
        NetManager.SendRequest(["func=" + NetNumber.ActivityInfo], IntegralManager._ReceiveActivityInfo);

        // 获取服务器时间
        NetManager.SendRequest(["func=" + "getTime"], UnitManager.ReceiveFuwuduanTime);

        // 初始化引导信息
        GuideManager.Init();
        // 初始化活动
        ActiveManager.Init();
    }

    /**
     * 接受服务器
     */

    /**
     * 接收VIP初始化消息
     */
    private static _VIPCom(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("VIP查询出错:" + jsonData["code"]);
            return;
        }
        var time: number = jsonData["data"]["time"];
        UnitManager.Player.VIPTime = time;
    }

    // 变量
    private static _reLoginTime: number = 0;            // 重连次数
    private static _isLoginIpSer: boolean = false;      // 是否登入账号服务器
    private static _openid: string;
}