/**
 * 关卡
 */
class Checkpoint{
    /**
     * 构造方法
     * @param data  数据Json
     */
    public constructor(data: JSON){
        this._id = data["id"];
        this._name = data["name"];
        this._passTime = data["time"];
        this._difficulty = data["difficulty"];
        var reward: string = data["award"];
        var rewardStr: string[] = reward.split(",");
        if (rewardStr.length == 3 && rewardStr[0] == "I" || rewardStr[0] == "C"){
            this._rewardItemID = parseInt(rewardStr[1]);
            this._rewardCount = parseInt(rewardStr[2]);
        }
        this._baseScore = data["basescore"];
        this._shouyilv = data["moneyplus"];
        this._baseeffect = data["baseeffect"];
        this._tipID = data["tipid"];
        this._consumePhy = data["costap"];
        this._isbubble = data["isbubble"];
        this._sceneId = data["scene"];
        this._roadRes = data["road"];

        var rate: string = data["randomeventrate"];
        if (rate != null && rate != ""){
            var rateStr: string[] = rate.split(";");
            for (var i = 0; i < rateStr.length; i++){
                if (rateStr[i] == "") continue;
                var rateData: string[] = rateStr[i].split(",");
                if (rateData != null && rateData.length == 2){
                    var type: string = rateData[0];
                    var rateNum: number = parseFloat(rateData[1]) / 100;
                    switch (type) {
                        case "E1":
                            this._airRate = rateNum;
                            break;
                        case "E2":
                            this._bombRate = rateNum;
                            break;
                        case "E3":
                            this._luckyRate = rateNum;
                            break;
                        case "E4":
                            this._randomRate = rateNum;
                            break;
                    }
                }
            }
        }
    }

    /**
     * ID
     */
    public get ID(): number{
        return this._id;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return this._name;
    }

    /**
     * 过关时间
     */
    public get PassTime(): number{
        return this._passTime;
    }

    /**
     * 难度
     */
    public get Difficulty(): number{
        return this._difficulty;
    }

    /**
     * 天气特效
     */
    public get Effect(): number{
        return this._baseeffect;
    }

    /**
     * 场景id
     */
    public get SceneId(): number{
        return this._sceneId;
    }

    /**
     * 道路资源名称前缀
     */
    public get RoadRes(): string{
        return this._roadRes;
    }

    /**
     * 幸运宝箱概率
     */
    public get LuckyRate(): number{
        return this._luckyRate;
    }

    /**
     * 随机宝箱概率
     */
    public get RandomRate(): number{
        return this._randomRate;
    }

    /**
     * 飞机概率
     */
    public get AirRate(): number{
        return this._airRate;
    }

    /**
     * 炸弹概率
     */
    public get BombRate(): number{
        return this._bombRate;
    }

    /**
     * 基础分
     */
    public get BaseScore(): number{
        return this._baseScore;
    }

    /**
     * 收益率
     */
    public get ShouYiLv(): number{
        return this._shouyilv;
    }

    /**
     * 最高分数
     */
    public set MaxScore(value: number){
        this._maxScore = value;
    }

    /**
     * 最高分数
     */
    public get MaxScore(): number{
        return this._maxScore;
    }

    /**
     * 闯关消耗体力
     */
    public get ConsumePhy(): number{
        return this._consumePhy;
    }

    /**
     * 奖励图片资源
     */
    public get RewardImage(): string{
        var item: Item = ItemManager.GetItemByID(this._rewardItemID);
        if (item != null){
            return item.ImageRes;
        }
        return "";
    }

    /**
     * 奖励说明
     */
    public get RewardDes(): string{
        return "";
    }

    /**
     * 是否已过关
     */
    public set IsPass(value: boolean){
        if (this._isPass) return;
        this._isPass = value;
        GameEvent.DispatchEvent(EventType.CheckpointPass);
    }

    /**
     * 是否已过关
     */
    public get IsPass(): boolean{
        return this._isPass;
    }

    /**
     * 关卡星级
     */
    public set Star(value: number){
        if (value < 0) value = 0;
        if (value > 3) value = 3;
        this._star = value;
        GameEvent.DispatchEvent(EventType.CheckpointStarUpdata);
    }

    /**
     * 关卡星级
     */
    public get Star(): number{
        if (!this._isPass) return 0;
        return this._star;
    }

    /**
     * 关卡能否挑战
     */
    public get CanChallenge(): boolean{
        if (this._id == 1) return true;
        var checkpoint: Checkpoint = CheckpointManager.GetCheckpointByID(this._id - 1);
        if (checkpoint.IsPass) return true;
        else return false;
    }

    /**
     * 关卡提示ID（0未无提示）
     */
    public get TipID(): string{
        return this._tipID;
    }

    /**
     * 是否显示道具提示
     */
    public get Isbubble(): boolean{
        return this._isbubble == 1? true: false;
    }

    // 变量
    private _id: number;                    // ID
    private _name: string;                  // 名字
    private _passTime: number;              // 过关时间
    private _difficulty: number;            // 难度
    private _rewardItemID: number;          // 奖励物品
    private _rewardCount: number;           // 奖励数量
    private _baseScore: number;             // 基础分
    private _shouyilv: number;              // 收益率
    private _maxScore: number = 0;          // 最高分数
    private _isPass: boolean = false;       // 是否过关
    private _star: number = 0;              // 关卡星级
    private _timer: number = 0;             // 计时器
    private _baseeffect:number;             // 关卡天气
    private _tipID: string;                 // 关卡提示
    private _isbubble: number;              // 碰到道具是否提示
    private _luckyRate: number = 0;         // 幸运宝箱概率
    private _randomRate: number = 0;        // 随机宝箱概率
    private _airRate: number = 0;           // 飞机概率
    private _bombRate: number = 0;          // 炸弹概率
    private _consumePhy: number =0;         // 体力消耗
    private _sceneId: number =0;            // 场景id
    private _roadRes: string = "k";         // 道路名称
}