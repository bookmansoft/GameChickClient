/**
 * 奴隶管理
 */
class SlaveManager{
    /**
     * 初始化奴隶系统监听
     */
    public static InitWatch(){
        ProcessManager.AddProcess(SlaveManager._Process.bind(SlaveManager));

        Facade.instance().watch(SlaveManager._ReceiveList, NetNumber.SlaveList);
        Facade.instance().watch(SlaveManager._CatchReturn, NetNumber.SlaveCatch);
        Facade.instance().watch(SlaveManager._ReceiveSlaveCatch, NetNumber.SlaveCatchEnd);
        Facade.instance().watch(SlaveManager._EscapeReturn, NetNumber.SlaveEscape);
        Facade.instance().watch(SlaveManager._ReceiveSlaveEscape, NetNumber.SlaveEscapeEnd);
        Facade.instance().watch(SlaveManager._ReceiveSlaveRansom, NetNumber.SlaveRansom);
        Facade.instance().watch(SlaveManager._ReceiveSlaveRelease, NetNumber.SlaveRelease);
        Facade.instance().watch(SlaveManager.SlaveFawnWatch, NetNumber.SlaveFawnWatch);
    }

    /**
     * 获取奴隶系统列表回调
     */
    public static SlaveFawnWatch(jsonData: Object){
        if (jsonData["info"]["code"] != NetManager.SuccessCode){
            return;
        }
        var master: string = jsonData["info"]["src"];
        var slave: string = jsonData["info"]["dst"];
        var time: number = jsonData["info"]["time"];
        if (UnitStatusMgr.IsMaster){
            for(let i=0; i<SlaveManager._slaveSet.length; i++){
                if(SlaveManager._slaveSet[i]["openid"] == slave){
                    SlaveManager._slaveSet[i]["time"] = time;
                    GameEvent.DispatchEvent(EventType.SlaveInfoChange);
                    break;
                }
            }
        }
        else if (UnitStatusMgr.IsSlave){
            SlaveManager.Master["time"] = time;
            GameEvent.DispatchEvent(EventType.SlaveInfoChange);
        }
    }

    /**
     * 抓捕消息返回
     */
    private static _CatchReturn(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("抓捕消息错误，code=" + code);
            return;
        }
        WindowManager.SlaveCatchWindow().IsVisibled = false;
        var id: number = jsonData["info"]["gid"];
        CheckpointManager.CurrentCheckpointID = Math.max(id - 1, 1);
        CheckpointManager.IsCatch = true;
        if (WindowManager.RoleSelectWindow() == null){
            WindowManager.SetWindowFunction(SlaveManager._OpenRoleSelect.bind(SlaveManager));
            return;
        }
        SlaveManager._OpenRoleSelect();
    }

    /**
     * 打开角色选择
     */
    private static _OpenRoleSelect(){
        WindowManager.RoleSelectWindow().IsVisibled = true;
    }

    /**
     * 监听奴隶赎身消息
     */
    private static _ReceiveSlaveRansom(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var messageType: string = jsonData["type"];
        var masterOpenid: string= jsonData["info"]["src"];
        var slaveOpenid: string = jsonData["info"]["dst"];
        var time: number = jsonData["info"]["time"];
        if (UnitManager.PlayerID == slaveOpenid){ // 自己是奴隶
            SlaveManager._masterSet = [];
        }
        else{ // 自己是主人
            for (var i = 0; i < SlaveManager._slaveSet.length; i++){
                if (SlaveManager._slaveSet[i]["openid"] == slaveOpenid){
                    SlaveManager._slaveSet.splice(i, 1);
                    break;
                }
            }
        }
        GameEvent.DispatchEvent(EventType.SlaveInfoChange);
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 监听奴隶释放消息
     */
    private static _ReceiveSlaveRelease(jsonData: Object){
        if (WindowManager.WaitPage() != null){
            WindowManager.WaitPage().IsVisibled = false;
        }
        var messageType: string = jsonData["type"];
        var masterOpenid: string= jsonData["info"]["src"];
        var slaveOpenid: string = jsonData["info"]["dst"];
        var time: number = jsonData["info"]["time"];
        if (UnitManager.PlayerID == slaveOpenid){ // 自己是奴隶
            SlaveManager._masterSet = [];
        }
        else{ // 自己是主人
            for (var i = 0; i < SlaveManager._slaveSet.length; i++){
                if (SlaveManager._slaveSet[i]["openid"] == slaveOpenid){
                    SlaveManager._slaveSet.splice(i, 1);
                    var friend: Friend = FriendManager.GetFriendByID(slaveOpenid);
                    if (friend != null){
                        friend.SetValue(UserStatus.Slave, false);
                    }
                    break;
                }
            }
        }
        GameEvent.DispatchEvent(EventType.SlaveInfoChange);
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 监听奴隶列表
     */
    private static _ReceiveList(jsonData: Object){
        var masterList: Object[] = jsonData["info"]["master"];
        var slaveList: Object[] = jsonData["info"]["slave"];
        if (masterList != null){
            SlaveManager._masterSet = masterList;
        }
        if (slaveList != null){
            SlaveManager._slaveSet = slaveList;
        }
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 监听奴隶抓捕
     */
    private static _ReceiveSlaveCatch(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        var isSucc: boolean = code == NetManager.SuccessCode;
        var isShowEnd: boolean = true;
        // 添加新获得的奴隶
        if (isSucc){
            var masterOpenid: string= jsonData["info"]["src"];
            var slaveOpenid: string = jsonData["info"]["dst"];
            var time: number = jsonData["info"]["time"];
            if (masterOpenid == UnitManager.PlayerID){
                var slave: Object = {};
                slave["openid"] = slaveOpenid;
                slave["time"] = time;
                SlaveManager._slaveSet.push(slave);
                isShowEnd = true;
                var friend: Friend = FriendManager.GetFriendByID(slaveOpenid);
                if (friend != null){
                    friend.SetValue(UserStatus.Slave, true);
                }
            }
            else {
                var master: Object = {};
                master["openid"] = masterOpenid;
                master["time"] = time;
                SlaveManager._masterSet.push(master);
                SlaveManager._slaveSet = [];
                isShowEnd = false;
                var friend: Friend = FriendManager.GetFriendByID(slaveOpenid);
                if (friend != null){
                    friend.SetValue(UserStatus.Master, true);
                }
            }
        }
        GameEvent.DispatchEvent(EventType.SlaveInfoChange);
        // 显示结算界面
        if (isShowEnd){
            var type: number = 1;
            if (CheckpointManager.IsCatch){
                type = 1;
                CheckpointManager.IsCatch = false;
            }
            WindowManager.StarWindow().IsVisibled = true;
            Main.Instance.BattleEnd();
            SoundManager.PlayBackgroundMusic();
            WindowManager.SlaveEndWindow().ShowWindow(type, isSucc);
        }
        else{
            if (!Game.GameStatus && Game.Instance != null && Main.Instance.GameLayer.contains(Game.Instance)){
                WindowManager.StarWindow().IsVisibled = true;
                Main.Instance.BattleEnd();
            }
        }
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 反抗返回
     */
    private static _EscapeReturn(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("反抗消息错误，code=" + code);
            return;
        }
        var id: number = jsonData["info"]["gid"];
        CheckpointManager.CurrentCheckpointID = Math.max(id - 1, 1);
        CheckpointManager.IsRunaway = true;
        if (WindowManager.RoleSelectWindow() == null){
            WindowManager.SetWindowFunction(SlaveManager._OpenRoleSelect.bind(SlaveManager));
            return;
        }
        SlaveManager._OpenRoleSelect();
    }

    /**
     * 接收奴隶反抗信息
     */
    private static _ReceiveSlaveEscape(jsonData){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        var isSucc: boolean = code == NetManager.SuccessCode;
        var isShowEnd: boolean = true;
        // 添加新获得的奴隶
        if (isSucc){
            var masterOpenid: string= jsonData["info"]["src"];
            var slaveOpenid: string = jsonData["info"]["dst"];
            var time: number = jsonData["info"]["time"];
            if (masterOpenid == UnitManager.Player.ID){
                for (var i = 0; i < SlaveManager._slaveSet.length; i++){
                    if (SlaveManager._slaveSet[i]["openid"] == slaveOpenid){
                        SlaveManager._slaveSet.splice(i, 1);
                        break;
                    }
                }
                isShowEnd = false;
            }
            else {
                SlaveManager._masterSet = [];
                isShowEnd = true;
            }
            GameEvent.DispatchEvent(EventType.SlaveInfoChange);
        }
        // 显示结算界面
        if (isShowEnd){
            var type: number = 2;
            if (CheckpointManager.IsRunaway){
                type = 2;
                CheckpointManager.IsRunaway = false;
            }
            WindowManager.StarWindow().IsVisibled = true;
            Main.Instance.BattleEnd();
            SoundManager.PlayBackgroundMusic();
            WindowManager.SlaveEndWindow().ShowWindow(type, isSucc);
        }
        else{
            if (!Game.GameStatus && Game.Instance != null && Main.Instance.GameLayer.contains(Game.Instance)){
                WindowManager.StarWindow().IsVisibled = true;
                Main.Instance.BattleEnd();
            }
        }
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 获取奴隶主信息
     */
    public static get Master(): Object{
        var id: Object = null;
        if (SlaveManager._masterSet.length > 0){
            return SlaveManager._masterSet[0];
        }
        return id;
    }

    /**
     * 奴隶列表
     */
    public static get SlaveList(): Object[]{
        return SlaveManager._slaveSet;
    }

    /**
     * 能否抓捕
     */
    public static get CanCatch(): boolean{
        var catchFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.CatchType);
        if (catchFre == null){
            Main.AddDebug("获取不到次数信息，type=" + FrequencyType.CatchType);
            return false;
        }
        return catchFre.Value < (catchFre.ExtValue + catchFre.MaxValue);
    }

    /**
     * 能否反抗
     */
    public static get CanEsvape(): boolean{
        var escapeFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.EscapeType);
        if (escapeFre == null){
            Main.AddDebug("获取不到次数信息，type=" + FrequencyType.EscapeType);
            return false;
        }
        return escapeFre.Value < (escapeFre.ExtValue + escapeFre.MaxValue);
    }

    /**
     * 等级
     */
    public static get Level(): number{
        var level: number = 1;
        var checkIDSet: number[] = [50, 35, 20, 5];
        var levelSet: number[] = [4, 3, 2, 1];
        var checkID: number = CheckpointManager.MaxCheckpointID;
        for (var i = 0; i < checkIDSet.length; i++){
            if (checkID >= checkIDSet[i]){
                level = levelSet[i];
                break;
            }
        }
        return level;
    }

    /**
     * 是否有空位
     */
    public static get HasSpace(): boolean{
        if (UnitStatusMgr.IsSlave) return false;
        var level: number = SlaveManager.Level;
        var slaveLength: number[] = [2,4,6,8];
        var count: number = slaveLength[level - 1];
        if (SlaveManager._slaveSet.length < count){
            return true;
        }
        return false;
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private static _Process(frameTime: number){
        SlaveManager._timer += frameTime;
        var time: number = 1000;
        var isChange: boolean = false;
        if (SlaveManager._timer >= time){
            SlaveManager._timer -= time;
            for (var i = 0; i < SlaveManager._masterSet.length; i++){
                SlaveManager._masterSet[i]["time"] -= 1;
                isChange = true;
            }
            for (var i = 0; i < SlaveManager._slaveSet.length; i++){
                SlaveManager._slaveSet[i]["time"] -= 1;
                isChange = true;
            }
            if (isChange){
                GameEvent.DispatchEvent(EventType.SlaveTimeChange);
            }
        }
    }

    // 变量
    private static _masterSet: Object[] = [];               // 奴隶主集合
    private static _slaveSet: Object[] = [];                // 奴隶集合
    private static _timer: number = 5;                      // 计时器
}