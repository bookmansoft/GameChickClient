/**
 * 次数管理
 */
class FrequencyManager{
    /**
     * 更新玩家次数
     */
    public static UpdateShareTime(jsonData: Object){
        if (!FrequencyManager._isInit){
            ProcessManager.AddProcess(FrequencyManager._Process.bind(ProcessManager));
        }
        FrequencyManager._isInit = true;
        var data: JSON = jsonData["info"];
        var max: JSON = data["max"];
        var num: JSON = data["num"];
        var extNum: JSON = data["extNum"];
        var time: JSON = data["time"];
        Object.keys(max).map((key)=>{
            var type: number = parseInt(key);
            if (FrequencyManager._frequencySet[type] == null){
                FrequencyManager._frequencySet[type] = new Frequency(type);
            }
            var fre: Frequency = FrequencyManager._frequencySet[type];
            fre.MaxValue = max[key]["num"];
            fre.MaxCD = max[key]["cd"];
        });
        Object.keys(num).map((key)=>{
            var type: number = parseInt(key);
            if (FrequencyManager._frequencySet[type] == null){
                FrequencyManager._frequencySet[type] = new Frequency(type);
            }
            var fre: Frequency = FrequencyManager._frequencySet[type];
            fre.Value = num[key];
        });
        Object.keys(extNum).map((key)=>{
            var type: number = parseInt(key);
            if (FrequencyManager._frequencySet[type] == null){
                FrequencyManager._frequencySet[type] = new Frequency(type);
            }
            var fre: Frequency = FrequencyManager._frequencySet[type];
            fre.ExtValue = extNum[key];
        });
        Object.keys(time).map((key)=>{
            var type: number = parseInt(key);
            if (FrequencyManager._frequencySet[type] == null){
                FrequencyManager._frequencySet[type] = new Frequency(type);
            }
            var fre: Frequency = FrequencyManager._frequencySet[type];
            fre.CD = time[key];
        });
        if (Main.Instance != null && Main.Instance.IsResourceLoadEnd && WindowManager.WaitPage().IsVisibled){
            WindowManager.WaitPage().IsVisibled = false;
        }
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 获取次数数据
     */
    public static GetFrequency(type: number): Frequency{
        return FrequencyManager._frequencySet[type];
    }

    /**
     * 购买次数
     * @param type      次数类型
     */
    public static AddShareTime(type: string){
        WindowManager.WaitPage().IsVisibled = true;
        NetManager.SendRequest(["func=" + NetNumber.SendHello, "&actionType=" + NetNumber.BuyTimes,
                                "&act=" + type],
                                FrequencyManager._BuyTimeReturn);
    }

    /**
     * 购买次数返回
     * @param type      次数类型
     */
    private static _BuyTimeReturn(jsonData: Object){
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private static _Process(frameTime: number){
        FrequencyManager._timer += frameTime;
        var time: number = 1000;
        var isChange: boolean = false;
        if (FrequencyManager._timer >= time){
            FrequencyManager._timer -= time;
            var isSlaveHDChange: boolean = false;
            Object.keys(FrequencyManager._frequencySet).map((key)=>{
                var fre: Frequency = FrequencyManager._frequencySet[key];
                if (fre.CD > 0){
                    fre.CD -= 1;
                    if (fre.Type == FrequencyType.PraiseType || fre.Type == FrequencyType.RevengeType){
                        isSlaveHDChange = true;
                    }
                }
            });
            if (isSlaveHDChange){
                GameEvent.DispatchEvent(EventType.SlaveHDCDChange);
            }
        }
    }

    // 变量
    private static _isInit: boolean = false;                // 是否初始化
    private static _frequencySet: Frequency[] = [];         // 次数数据集合
    private static _timer: number = 0;                      // 计时器
}

/**
 * 次数数据结构
 */
class Frequency{
    /**
     * 构造方法
     */
    public constructor(type: number) {
        this._type = type;
    }

    /**
     * 次数类型
     */
    public get Type(): number{
        return this._type;
    }

    /**
     * 最大次数限制
     */
    public set MaxValue(value: number) {
        if (this._maxValue == value) return;
        this._maxValue = value;
        if (this._type == FrequencyType.CatchType || this._type == FrequencyType.EscapeType){
            GameEvent.DispatchEvent(EventType.SlaveTimesUpdate);
        }
        if (this._type == FrequencyType.PraiseType ||
            this._type == FrequencyType.LashType ||
            this._type == FrequencyType.FoodType ||
            this._type == FrequencyType.RevengeType ||
            this._type == FrequencyType.FawnType){
                GameEvent.DispatchEvent(EventType.SlaveHDTimesUpdate);
        }
        if (this._type == FrequencyType.VipDaily){
            GameEvent.DispatchEvent(EventType.VIPRewardTimesChange);
        }
    }

    /**
     * 最大次数限制
     */
    public get MaxValue(): number{
        return this._maxValue;
    }

    /**
     * 当前使用次数
     */
    public set Value(value: number){
        if (this._value == value) return;
        this._value = value;
        if (this._type == FrequencyType.CatchType || this._type == FrequencyType.EscapeType){
            GameEvent.DispatchEvent(EventType.SlaveTimesUpdate);
        }
        if (this._type == FrequencyType.PraiseType ||
            this._type == FrequencyType.LashType ||
            this._type == FrequencyType.FoodType ||
            this._type == FrequencyType.RevengeType ||
            this._type == FrequencyType.FawnType){
                GameEvent.DispatchEvent(EventType.SlaveHDTimesUpdate);
        }
        if (this._type == FrequencyType.VipDaily){
            GameEvent.DispatchEvent(EventType.VIPRewardTimesChange);
        }
    }

    /**
     * 当前使用次数
     */
    public get Value(): number{
        return this._value;
    }

    /**
     * 增加次数
     */
    public set ExtValue(value: number){
        if (this._extValue == value) return;
        this._extValue = value;
        if (this._type == FrequencyType.CatchType || this._type == FrequencyType.EscapeType){
            GameEvent.DispatchEvent(EventType.SlaveTimesUpdate);
        }
        if (this._type == FrequencyType.PraiseType ||
            this._type == FrequencyType.LashType ||
            this._type == FrequencyType.FoodType ||
            this._type == FrequencyType.RevengeType ||
            this._type == FrequencyType.FawnType){
                GameEvent.DispatchEvent(EventType.SlaveHDTimesUpdate);
        }
        if (this._type == FrequencyType.VipDaily){
            GameEvent.DispatchEvent(EventType.VIPRewardTimesChange);
        }
    }

    /**
     * 增加次数
     */
    public get ExtValue(): number{
        return this._extValue;
    }

    /**
     * 最大CD
     */
    public set MaxCD(value: number){
        if (value == this._maxCD) return;
        this._maxCD = value;
    }

    /**
     * 最大CD
     */
    public get MaxCD(): number{
        return this._maxCD;
    }

    /**
     * 当前CD
     */
    public set CD(value: number){
        if (this._cd == value) return;
        this._cd = value;
    }

    /**
     * 当前CD
     */
    public get CD(): number{
        return this._cd;
    }

    // 变量
    private _type: number = 0;                      // 次数类型
    private _maxValue: number = 0;                  // 最大次数限制
    private _value: number = 0;                     // 当前使用次数
    private _extValue: number = 0;                  // 增加次数
    private _maxCD: number = 0;                     // 最大CD
    private _cd: number = 0;                        // 当前CD
}

/**
 * 次数类型枚举
 */
const enum FrequencyType{
    DieShareType = 2,
    PhyShareType = 3,
    CatchType = 5,
    EscapeType = 6,
    FoodType = 7,
    RevengeType = 8,
    FawnType = 9,
    PraiseType = 10,
    LashType = 12,
    VipDaily = 21,
}