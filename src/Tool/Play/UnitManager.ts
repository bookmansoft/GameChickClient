/**
 * 角色管理
 */
class UnitManager{
    /**
     * 死亡分享类型
     */
    public static DieShareType: string = "2";

    /**
     * 体力分享类型
     */
    public static PhyShareType: string = "3";

    /**
     * 抓捕次数类型
     */
    public static CatchType: string = "5";

    /**
     * 反抗次数类型
     */
    public static EscapeType: string = "6";

    /**
     * 超越好友分享类型
     */
    public static ChaoYueFriendShareType: string = "4";

    /**
     * 鸣人ID
     */
    public static MingRenID: number = 21031;

    /**
     * 佐助ID
     */
    public static ZuoZuID: number = 21032;

    /**
     * 小樱ID
     */
    public static XiaoYingID: number = 21033;

    /**
     * 初始化
     */
    public static Init(){
        // 加载角色配置
        UnitManager._LoadRole();
    }

    /**
     * 创建角色
     */
    public static CreatePlayer(id, name, money, pinggai, maxScore, token, imaUrl){
        if(UnitManager._player == null){
            UnitManager._player = new Player(id, name, money, pinggai, maxScore, token, imaUrl);
            UnitManager._UpdatePlayerPhysical();
            NetManager.SendRequest(["func=" + NetNumber.DayGift], UnitManager._ReceiveDayGift.bind(UnitManager));
            Facade.instance().watch(UnitManager._ReceiveFirstShare.bind(UnitManager), NetNumber.ShareFirstBonus);
        }else{
            UnitManager._player.Money = money;
            UnitManager._player.PingGai = pinggai;
            UnitManager._player.Name = name;
            UnitManager._player.MaxScore = maxScore;
            UnitManager._player.HearUrl = imaUrl;
        }
    }

    /**
     * 读取角色信息
     */
    private static _LoadRole(){
        UnitManager._roleSet = [];
        var jsonData = RES.getRes("roledata_json");
        Object.keys(jsonData).map((key)=>{
            var data: JSON = jsonData[key];
            var role: Role = new Role(data);
            if (UnitManager._currentRoleID == -1) {
                role.Level = 1;
                UnitManager._currentRoleID = role.ID;
            }
            UnitManager._roleSet.push(role);
        });
        NetManager.SendRequest(["func=" + NetNumber.RoleList], UnitManager.updataRoleReturn.bind(UnitManager));
    }

    /**
     * 获取角色信息返回
     */
    private static updataRoleReturn(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("获取角色列表出错：" + jsonData["code"])
            return;
        }
        var data: Object = jsonData["data"];
        Object.keys(data).map((key)=>{
            var obj: Object = data[key];
            var id: number = parseInt(obj["id"]);
            var level: number = obj["lv"];
            var sk1: number = obj["sk1"];
            var sk2: number = obj["sk2"];
            var sk3: number = obj["sk3"];
            var role: Role = UnitManager.GetRole(id);
            if (role != null){
                role.Level= level;
                role.SetSkillLevelByNum(sk1,1);
                role.SetSkillLevelByNum(sk2,2);
                role.SetSkillLevelByNum(sk3,3);
            }
        });
        GameEvent.DispatchEvent(EventType.RoleUpLevel);
    }

    /**
     * 获取角色
     */
    public static GetRole(id: number): Role{
        for (var i = 0; i < UnitManager._roleSet.length; i++){
            if (id == UnitManager._roleSet[i].ID){
                return UnitManager._roleSet[i];
            }
        }
        return null;
    }

    /**
     * 获取角色 by pieceid
     */
    public static GetRoleByPiece(id: number): Role{
        for (var i = 0; i < UnitManager._roleSet.length; i++){
            if (id == UnitManager._roleSet[i].Pieceid){
                return UnitManager._roleSet[i];
            }
        }
        return null;
    }

    /**
     * 接收每日礼包消息
     */
    private static _ReceiveDayGift(jsonData: Object){
        var code: number = jsonData["code"];
        if (code == NetManager.SuccessCode || code == 801){
            UnitManager._dayGiftData = jsonData;
            var time: number = jsonData["data"]["time"];
            if (UnitManager.Player != null){
                UnitManager.Player.VIPTime = time;
            }
            if (Main.IsCreated){
                UnitManager.CheckDayGift();
            }
        }
    }

    /**
     * 检测每日礼包
     */
    public static CheckDayGift(){
        if (UnitManager._dayGiftData == null){
            // 引导检测
            // GuideManager.GuideCheck();
            return;
        } 
        var giftID: number = -1;
        var id: string = egret.getOption("GIFT");
        if (id != null && id != ""){
            giftID = parseInt(id);
        }
        var code: number = UnitManager._dayGiftData["code"];
        if (code == NetManager.SuccessCode || (code == 801 && giftID != -1)){
            var data: Object = UnitManager._dayGiftData["data"];
            var isGet: boolean = code == 801;
            var bonus: Object[] = data["bonus"];
            if (code == 801 && giftID != -1 || code == NetManager.SuccessCode){
                if (WindowManager.GiftWindow() == null){
                    WindowManager.SetWindowFunction(UnitManager._ShowGiftWindow, [isGet, bonus], WindowManager.GiftWindow);
                    return;
                }
                UnitManager._ShowGiftWindow([isGet, bonus]);
            }
            else {
                // 引导检测
                // GuideManager.GuideCheck();
            }
        }
        else{
            // 引导检测
            // GuideManager.GuideCheck();
        }
        UnitManager._dayGiftData = null;
    }

    /**
     * 显示每日礼包界面
     */
    private static _ShowGiftWindow(param: any[]){
        WindowManager.GiftWindow().Show(param[0], param[1]);
        // GuideManager.GuideCheck();
    }

    /**
     * 检测玩家的新手礼包和7日礼包
     */
    public static CheckPlayGift(){
        var giftID: string = egret.getOption("GIFT");
        if (giftID == null || giftID == ""){
            // 检测活动礼包
            // ActiveManager.CheckBonus();
            return;
        } 
        switch (giftID) {
            case "20001":// 新手礼包
                UnitManager._playGiftType = 1;
                break;
            case "30001"://7日礼包
                UnitManager._playGiftType = 2;
                break;
            case "40001"://中秋礼包
                UnitManager._playGiftType = 3;
                break;
            default:
                // ActiveManager.CheckBonus();
                break;
        }
        NetManager.SendRequest(["func=" + NetNumber.PlayGift + "&type=" + UnitManager._playGiftType],
                                UnitManager.ReceivePlayGift.bind(UnitManager));
    }

    /**
     * 接收玩家礼包
     */
    public static ReceivePlayGift(jsonData: Object){
        var code: number = jsonData["code"];
        if (code != NetManager.SuccessCode){
            if (code == 102){
                var text: string = "";
                switch (UnitManager._playGiftType) {
                    case 1:
                        text = StringMgr.GetText("giftpagetext3");
                        break;
                    case 2:
                        text = StringMgr.GetText("giftpagetext4");
                        break;
                    case 3:
                        text = StringMgr.GetText("giftpagetext5");
                        break;
                }
                text += StringMgr.GetText("giftpagetext6");
                PromptManager.CreatCenterTip(false, false, text);
            }
            if (code == 103){
                var text: string = StringMgr.GetText("giftpagetext7");
                PromptManager.CreatCenterTip(false, false, text);
            }
            // 检测活动礼包
            // ActiveManager.CheckBonus();
            return;
        }
        var bonus: Object[] = jsonData["data"]["bonus"];
        if (WindowManager.PlayGiftWindow() != null){
            UnitManager._ShowPlayGift([UnitManager._playGiftType, bonus]);
        }
        else {
            WindowManager.SetWindowFunction(UnitManager._ShowPlayGift, [UnitManager._playGiftType, bonus], WindowManager.PlayGiftWindow);
        }
    }

    /**
     * 显示玩家礼包界面（新手礼包和7日礼包）
     */
    private static _ShowPlayGift(params: any[]){
        WindowManager.PlayGiftWindow().Show(params[0], params[1]);
        // 检测活动礼包
        // ActiveManager.CheckBonus();
    }

    /**
     * 当前使用角色
     */
    public static get CurrentRole(): Role{
        return UnitManager.GetRole(UnitManager._currentRoleID);
    }

    /**
     * 获取游戏角色集合
     */
    public static GetRoleSet(): Role[]{
        return UnitManager._roleSet;
    }

    /**
     * 更改当前角色
     */
    public static ChangeRole(id: number){
        UnitManager._currentRoleID = id;
    }

    /**
     * 玩家ID
     */
    public static get PlayerID(): string{
        if (UnitManager._player == null) return "";
        return UnitManager._player.ID;
    }

    /**
     * 玩家
     */
    public static get Player(): Player{
        return UnitManager._player;
    }

    /**
     * 接收首次分享奖励
     */
    private static _ReceiveFirstShare(jsonData: Object){
        var data: number = jsonData["info"];
        if (data != null){
            var bonus: Object[] = data["bonus"];
            PromptManager.ShowGit(bonus);
            UnitStatusMgr.SetValue(UserStatus.IsFirstShare, true);
            WindowManager.StarWindow().UpdateFirstShare();
        }
    }

    /**
     * 接收体力更新
     */
    public static ReceivePhysical(jsonData: Object){
        var data: Object = jsonData["info"];
        // Main.AddDebug("接受体力更新");
        data["refreshTime"] = Math.floor(data["refreshTime"]);
        UnitManager._physicalData[0] = data["cur"];
        UnitManager._physicalData[1] = data["max"];
        UnitManager._physicalData[2] = data["refreshTime"];
        UnitManager._physicalData[3] = data["peroid"];
        UnitManager._moneyData[0] = data["diamond"];
        UnitManager._moneyData[1] = data["money"];
        if (UnitManager._player != null){
            UnitManager._UpdatePlayerPhysical();
        }
    }

    /**
     * 更新玩家体力
     */
    private static _UpdatePlayerPhysical(){
        UnitManager._player.MaxPhysical = UnitManager._physicalData[1];
        UnitManager._player.Physical = UnitManager._physicalData[0];
        UnitManager._player.PhysicalTime = UnitManager._physicalData[2];
        UnitManager._player.PhysicalMaxTime = UnitManager._physicalData[3];
        UnitManager._player.PingGai = UnitManager._moneyData[0];
        UnitManager._player.Money = UnitManager._moneyData[1];
    }

    /**
     * 体力不足
     */
    public static PhysicalNoEnough(){
        var fre: Frequency = FrequencyManager.GetFrequency(FrequencyType.PhyShareType);
        if (fre == null){
            Main.AddDebug("获取不到次数信息，type=" + FrequencyType.PhyShareType);
            return;
        }
        var time: number = fre.Value;
        var maxTime: number = fre.MaxValue + fre.ExtValue;
        time = maxTime - time;
        if (time > 0){
            var des: string = StringMgr.GetText("sharetext1") + time + "/" + maxTime;
            PromptManager.CreatCenterTip(false,false,des,null,UnitManager._OnShareTipYes.bind(UnitManager));
        }
        else{
            PromptManager.CreatCenterTip(false,false,StringMgr.GetText("sharetext2"));
        }
    }

	/**
     * 分享提示Yes
     */
    private static _OnShareTipYes(){
        if (Main.IsLocationDebug){
            UnitManager._ShareTask();
        }
        else {
            var textSet: string[] = GameConstData.ShareContent;
            if (textSet.length == 2){
                window["shareCont"] = FBSDKMgr.Share(textSet[0], textSet[1]);
                window["share"]();
                // FBSDKMgr.Share(textSet[0], textSet[1]);
            }
            else{
                window["shareCont"] = FBSDKMgr.Share();
                window["share"]();
                // FBSDKMgr.Share();
            }
            UnitManager._ShareTask();
        }
    }

    /**
     * 分享任务
     */
    private static _ShareTask(){
        NetManager.SendRequest(["func=" + NetNumber.ShareEnd + "&type=" + UnitManager.PhyShareType],
                                UnitManager._OnShareTaskReturn);
    }

    /**
     * 分享任务完成返回
     */
    private static _OnShareTaskReturn(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("分享任务返回错误，错误码：" + jsonData["code"]);
            return;
        }
        let items = jsonData["data"];
        Object.keys(items).map(function(key){
            ItemManager.SetItemCount(parseInt(key), items[key]["num"]);
        });
    }

    /**
     * 日常活动状态监听
     */
    public static ReveiceDailyActiveState(json: Object){
        if(json["info"]["cd"]){
            UnitManager.DailyActiveStartTimeNum = json["info"]["cd"];
        }else{
            UnitManager.DailyActiveStartTimeNum = 0;
        }

        UnitManager.SetDailyActiveState(json["info"]["status"]);
    }

    /**
     * 日常活动状态
     */
    public static SetDailyActiveState(value: string){
        this._dailyActiveState = value == "open"? true:false;
        GameEvent.DispatchEvent(EventType.DailyAcitveStateUpData);
    }

    /**
     * 日常活动状态
     */
    public static get DailyActiveState(): boolean{
        return this._dailyActiveState;
    }

    /**
     *  距离日常活动正式开始剩余时间
     */
    public static set DailyActiveStartTimeNum(num: number){
        this._dailyActiveStartTimeNum = num;
    }

    /**
     *  距离日常活动正式开始剩余时间
     */
    public static get DailyActiveStartTimeNum(): number{
        return this._dailyActiveStartTimeNum;
    }

    /**
     *  日常活动当前分数
     */
    public static set DailyActiveCurScore(num: number){
        this._dailyActiveScore = num;
    }

    /**
     * 下发奖励侦听
     */
    public static ReceiveBonus(json: Object){
        PromptManager.ShowGit(json["info"]["bonus"]);
    }

    /**
     * 接收服务端时间
     */
    public static ReceiveFuwuduanTime(json: Object){
        UnitManager._fuwuduanTime = json["data"]["time"];
        ProcessManager.AddProcess(UnitManager._Process);
    }

    /**
     * 服务端时间
     */
    public static get FuwuduanTime(){
        return UnitManager._fuwuduanTime;
    }

    /**
     * 服务端时间
     */
    public static set FuwuduanTime(value: number){
        UnitManager._fuwuduanTime = value;
    }

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    public static _Process(frameTime: number){
        if(UnitManager.FuwuduanTime != 0){
            UnitManager._timer += frameTime;
            var time:number = 1000;
            if (UnitManager._timer >= time){
                UnitManager._timer -= time;
                UnitManager.FuwuduanTime += 1;
            }
        }
    }



    // 变量
    private static _player: Player;                                 // 玩家
    private static _roleSet: Role[] = [];                           // 角色集合
    private static _currentRoleID: number = -1;                     // 当前角色ID
    private static _physicalData: number[] = [100, 100, 0, 360];    // 体力数据
    private static _moneyData: number[] = [0,0];                    // 货币
    private static _dayGiftData: Object;                            // 每日登入的奖励数据
    private static _playGiftType: number = 0;                       // 玩家礼包类型（新手礼包和7日礼包）

    private static _dailyActiveStartTimeNum: number = 0;            // 距离日常活动正式开始剩余时间 s

    private static _dailyActiveState: boolean = true;               // 日常活动是否开启
    private static _dailyActiveScore: number = 0;                   // 日常活动分数
    public static _dailyActiveMaxScore: number = 300000000;         // 日常活动分数

    private static _fuwuduanTime: number = 0;                       // 服务端时间
    private static _timer:number = 0;
}