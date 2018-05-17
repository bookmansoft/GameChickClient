/**
 * 关卡管理器
 */
class CheckpointManager{
    /**
     * 无尽模式关卡ID号
     */
    public static EndlessCheckpointID: number = 10001;

    /**
     * 日常活动模式关卡ID号
     */
    public static DailyActiveActiveCheckpointID: number = 20001;

    /**
     * 读取关卡信息
     */
    public static Init(){
        var jsonData: JSON = RES.getRes("chapterdata_json");
        Object.keys(jsonData).map((id)=>{
            var data: JSON = jsonData[id];
            var check: Checkpoint = new Checkpoint(data);
            CheckpointManager._checkpointSet.push(check);
        });
        NetManager.SendRequest(["func=" + NetNumber.CheckpointList],
                                CheckpointManager._ReceiveChecpointList.bind(CheckpointManager));

        ProcessManager.AddProcess(CheckpointManager._Process.bind(CheckpointManager));
    }

    /**
     * 接收关卡初始化消息
     */
    private static _ReceiveChecpointList(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode) return;
        // 战斗状态数据
        var battleData: Object = jsonData["data"]["battle"];
        var state: number = battleData["state"];
        CheckpointManager.BattleStatus = state;
        CheckpointManager.RaidCheckpointID = (state == 2 || state == 3)? battleData["id"] : 0;
        CheckpointManager.RaidTime = state == 2? battleData["time"] : 0;
        // 关卡列表
        var dataList: Object[] = jsonData["data"]["list"];
        var hisGateNo: number = 1;
        if (!!jsonData["data"]["hisGateNo"]){
            hisGateNo = jsonData["data"]["hisGateNo"];
        }
        for (var i = 0; i < dataList.length; i++){
            var data: Object = dataList[i];
            var id: number = parseInt(data["id"]);
            var score: number = data["score"];
            var star: number = data["star"];
            var state: number = data["state"];
            var time: number = data["time"];
            if (id >= hisGateNo) star = 0;
            var checkpoint: Checkpoint = CheckpointManager.GetCheckpointByID(id);
            if (checkpoint != null){
                checkpoint.MaxScore = score;
                checkpoint.Star = star;
                checkpoint.IsPass = star > 0;
            }
        }
        CheckpointManager._isRevice = true;
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 通过ID获取关卡
     */
    public static GetCheckpointByID(id: number): Checkpoint{
        for (var i = 0; i < CheckpointManager._checkpointSet.length; i++){
            if (CheckpointManager._checkpointSet[i].ID == id){
                return CheckpointManager._checkpointSet[i];
            }
        }
        return null;
    }

    /**
     * 是否是无尽模式
     */
    public static get IsEndless(): boolean{
        return CheckpointManager._currentCheckpointID == CheckpointManager.EndlessCheckpointID;
    }

    /**
     * 是否是日常活动无尽模式
     */
    public static get IsDailyActive(): boolean{
        return CheckpointManager._currentCheckpointID == CheckpointManager.DailyActiveActiveCheckpointID;
    }

    /**
     * 获得关卡集合
     */
    public static GetCheckpointSet(): Checkpoint[]{
        return CheckpointManager._checkpointSet;
    }

    /**
     * 当前闯关的关卡
     */
    public static get CurrentCheckpoint(): Checkpoint{
        if (CheckpointManager.IsEndless){
            return null;
        }
        return CheckpointManager.GetCheckpointByID(CheckpointManager._currentCheckpointID);
    }

    /**
     * 当前闯关的关卡ID
     */
    public static set CurrentCheckpointID(id: number){
        CheckpointManager._currentCheckpointID = id;
    }

    /**
     * 当前闯关的关卡ID
     */
    public static get CurrentCheckpointID(): number{
        return CheckpointManager._currentCheckpointID;
    }

    /**
     * 战斗状态(0空闲,1战斗中,2扫荡中,3等待领取扫荡收益)
     */
    public static set BattleStatus(value: number){
        if (value == CheckpointManager._battleStats) return;
        CheckpointManager._battleStats = value;
        if (value == 2){
            CheckpointManager._timer = 0;
        }
    }

    /**
     * 战斗状态(0空闲,1战斗中,2扫荡中,3等待领取扫荡收益)
     */
    public static get BattleStatus(): number{
        return CheckpointManager._battleStats;
    }

    /**
     * 扫荡时间
     */
    public static set RaidTime(value: number){
        if (value < 0) value = 0;
        if (CheckpointManager._raidTime == value) return;
        CheckpointManager._raidTime = value;
        GameEvent.DispatchEvent(EventType.CheckpointRaidTimeUpdate);
    }

    /**
     * 扫荡时间
     */
    public static get RaidTime(): number{
        return CheckpointManager._raidTime;
    }

    /**
     * 当前关卡获得总星数
     */
    public static get StarCount(): number{
        var count: number = 0;
        for (var i = 0; i < CheckpointManager._checkpointSet.length; i++){
            if (CheckpointManager._checkpointSet[i].IsPass){
                count += CheckpointManager._checkpointSet[i].Star;
            }
            else break;
        }
        return count;
    }

    /**
     * 通过关卡
     */
    public static PassCheckpoint(id: number){
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 获得当前已过关的最大关卡数
     */
    public static get MaxCheckpointID(): number{
        var id: number = 1;
        for (var i = 0; i < CheckpointManager._checkpointSet.length; i++){
            if (CheckpointManager._checkpointSet[i].IsPass){
                id = CheckpointManager._checkpointSet[i].ID;
            }
            else break;
        }
        return id;
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private static _Process(frameTime: number){
        if (CheckpointManager.RaidTime == 0) return;
        CheckpointManager._timer += frameTime;
        var time: number = 1000;
        if (CheckpointManager._timer >= time){
            CheckpointManager._timer -= time;
            CheckpointManager.RaidTime -= 1;
        }
    }

    /**
     * 是否是抓捕
     */
    public static set IsCatch(value: boolean){
        CheckpointManager._isCatch = value;
    }

    /**
     * 是否是抓捕
     */
    public static get IsCatch(): boolean{
        return CheckpointManager._isCatch;
    }

    /**
     * 是否逃跑
     */
    public static set IsRunaway(value: boolean){
        CheckpointManager._isRunaway = value;
    }

    /**
     * 是否逃跑
     */
    public static get IsRunaway(): boolean{
        return CheckpointManager._isRunaway;
    }

    /**
     * 选择哪一关
     */
    public static get ChooseCheckPointId(): number{
        return CheckpointManager._chooseCheckPointId;
    }

    /**
     * 选择哪一关
     */
    public static set ChooseCheckPointId(id : number){
        CheckpointManager._chooseCheckPointId = id;
        GameEvent.DispatchEvent(EventType.ChooseCheckPonit);
    }

    /**
     * 是否已经初始化
     */
    public static get IsRevice(): boolean{
        return CheckpointManager._isRevice;
    }

    /**
     * 当前在扫荡的关卡
     */
    public static RaidCheckpointID: number = 0;

    // 变量
    private static _checkpointSet: Checkpoint[] = [];           // 关卡集合
    private static _currentCheckpointID: number = 0;            // 当前闯关的关卡ID
    private static _raidTime: number = 0;                       // 扫荡时间
    private static _battleStats: number = 0;                    // 战斗状态
    private static _timer: number = 0;                          // 计时器
    private static _isCatch: boolean = false;                   // 是否是抓捕
    private static _isRunaway: boolean = false;                 // 是否是逃跑

    private static _chooseCheckPointId: number = -1;             // 选择的关卡

    private static _isRevice: boolean = false;                  // 是否接受信息
}