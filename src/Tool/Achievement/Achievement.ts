/**
 * 成就
 */
class Achievement{
    /**
     * 奖励数据
     */
    public static RewardData: Object = null;

    /**
     * 成就类型数据
     */
    public static AchTypeData: Object = null;

    /**
     *  分享内容
     */
    public static ShareData: Object = null;

    /**
     * 构造方法
     */
    public constructor(data: Object){
        this._id = data["id"];
        this._name = data["name"];
        this._res = data["res"];
        this._achType = data["sharetype"];
        this._achValue = data["sharevalue"];
        this._desc = data["desc"];
        this._rarity = data["rarity"];
        this._priority = parseInt(data["priority"])
        this.rewardStr = data["rewardtype"];
        this._ParseReward( this.rewardStr);
        var con: string = data["condition"];
        var conStr: string[] = con.split(",");
        if (conStr.length == 1){
            this._conditionType = "";
            this._condition = parseInt(conStr[0]);
        }
        else if (conStr.length == 2){
            this._conditionType = conStr[0];
            this._condition = parseInt(conStr[1]);
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
        return StringMgr.GetText(this._name);
    }

    /**
     * 图片资源
     */
    public get ImageRes(): string{
        return this._res;
    }

    /**
     * 描述
     */
    public get Description(): string{
        return StringMgr.GetText(this._desc);
    }

    /**
     * 稀有度
     */
    public get Rarity(): number{
        return this._rarity;
    }

    /**
     * 设置完成时间
     */
    public set Time(value: number){
        this._time = value;
    }

    /**
     * 完成时间
     */
    public get CompleteTime(): string{
        if (!this.IsCompleted) return "";
        if (this._completeTime == ""){
            var date: Date = new Date(this._time * 1000);
            this._completeTime += date.getFullYear() + ".";
            this._completeTime += (date.getMonth() + 1) + ".";
            this._completeTime += date.getDate();
        }
        return this._completeTime;
    }

    /**
     * 是否完成
     */
    public get IsCompleted(): boolean{
        return this._status != 0;
    }

    /**
     * 成就进度值
     */
    public get Condition(): number{
        return this._condition;
    }

    /**
     * 设置成就进度
     */
    public set CurCondition(value: number){
        this._curCon = value;
        if (this.IsCompleted || this._curCon > this._condition){
            this._curCon = this._condition;
        }
    }

    /**
     * 成就状态（0未完成，1完成，2已领取）
     */
    public set Status(value: number){
        this._status = value;
    }

    /**
     * 成就状态（0未完成，1完成，2已领取）
     */
    public get Status(): number{
        return this._status;
    }

    /**
     * 解析奖励
     */
    private _ParseReward(str: string){
        var dataStr: string[] = str.split(",");
        var type: string = dataStr[0];
        switch (ItemManager.GetItemCode(type)) {
            case "M":
                this._rewardImageRes = "fenxiang_jinbi_png";
                this._rewardNum = parseInt(dataStr[1]);
                this._rewardDesc = StringMgr.GetText("rewardtext1") + "*" + this._rewardNum;
                break;
            case "D":
                this._rewardImageRes = "fenxiang_jifen_png";
                this._rewardNum = parseInt(dataStr[1]);
                this._rewardDesc = StringMgr.GetText("rewardtext2") + "*" + this._rewardNum;
                break;
            case "I":
            case "C":
                var id: number = parseInt(dataStr[1]);
                this._rewardNum = parseInt(dataStr[2]);
                var item: Item = ItemManager.GetItemByID(ItemManager.GetXID(type, id));
                if (item != null){
                    this._rewardImageRes = item.ImageRes;
                    this._rewardDesc = item.TypeDesc + ":" + item.Name + "*" + this._rewardNum;
                }
                break;
            case "scene":
            case "road":
                var id: number = parseInt(dataStr[1]);
                this._rewardNum = parseInt(dataStr[2]);
                var item: Item = ItemManager.GetItemByID(ItemManager.GetXID(type, id));
                if (item != null){
                    this._rewardImageRes = item.ImageRes;
                    this._rewardDesc = item.TypeDesc + ":" + item.Name;
                }
                break;
        }
    }

    /**
     * 获取奖励图片
     */
    public get RewardImageRes(): string{
        return this._rewardImageRes;
    }

    /**
     * 奖励描述
     */
    public get RewardDesc(): string{
        this._ParseReward( this.rewardStr);
        return this._rewardDesc;
    }

    /**
     * 条件描述
     */
    public get ConditionDesc(){
        if (Achievement.AchTypeData == null){
            Achievement.AchTypeData = RES.getRes("achievetype_json");
        }
        var data = Achievement.AchTypeData[this._achType];
        if (data != null){
            var text: string = StringMgr.GetText(data["desc"]);
            text = text.replace("&data", this._condition.toString());
            // 成就类型替换文本
            var achStr: string[] = this._achValue.split(",");
            var role: Role = null;
            var item: Item = null;
            if (achStr.length == 1){
                role = UnitManager.GetRole(parseInt(achStr[0]));
                item = ItemManager.GetItemByID(parseInt(achStr[0]));
            }
            else if (achStr.length == 2){
                role = UnitManager.GetRole(parseInt(achStr[1]));
                item = ItemManager.GetItemByID(parseInt(achStr[1]));
            }
            text = text.replace("&role", role == null? "" : role.Name);
            text = text.replace("&sence", item == null? "" : item.Name);
            text = text.replace("&road", item == null? "" : item.Name);
            // 替换条件文本
            var conRole: Role = null;
            var conItem: Item = null;
            if (this._conditionType != ""){
                if (this._conditionType == "role"){
                    conRole = UnitManager.GetRole(this._condition);
                }
                else if (this._conditionType == "I" || this._conditionType == "role" || this._conditionType == "scene"){
                    conItem = ItemManager.GetItemByID(this._condition);
                }
            }
            else {
                conRole = UnitManager.GetRole(this._condition);
                conItem = ItemManager.GetItemByID(this._condition);
            }
            if (conRole != null){
                text = text.replace("&name", conRole.Name);
            }
            else if (conItem != null){
                text = text.replace("&name", conItem.Name);
            }
            else{
                text = text.replace("&name", "");
            }
            if (this._achType != 16 && this._achType != 17 && this._achType != 18 &&
                this._achType != 25 && this._achType != 26 && this._achType != 27){
                text += ":" + this._curCon.toString() + "/" + this._condition.toString();
            }
            return text;
        }
        return "";
    }

    /**
     * 分享内容
     */
    public get ShareContent(): string[]{
        if (Achievement.ShareData == null) {
            Achievement.ShareData = RES.getRes("sharetext_json");
        }
        if (Achievement.AchTypeData == null){
            Achievement.AchTypeData = RES.getRes("achievetype_json");
        }
        var data = Achievement.AchTypeData[this._achType];
        if (data != null){
            var idStr: string = data["textid"];
            var idSet: string[] = idStr.split(",");
            var index: number = Math.floor(Math.random() * idSet.length);
            var id: number = parseInt(idSet[index]);
            var shareData: Object = Achievement.ShareData[id];
            var text: string = StringMgr.GetText(shareData["desc"]);
            if (text != null){
                text = text.replace("&star", CheckpointManager.StarCount.toString());
                text = text.replace("&chapter", CheckpointManager.MaxCheckpointID.toString());
            }
            return [text == null? "":text,
                    shareData["pic"] == null? "" : shareData["pic"]];
        }
        return [];
    }

    /**
     * 优先级
     */
    public get Priority(): number{
        return this._priority;
    }

    // 变量
    private _id: number;                    // ID
    private _name: string;                  // 名字
    private _res: string;                   // 图标资源
    private _achType: number;               // 成就类型
    private _achValue: string;              // 指定成就数据
    private _conditionType: string;         // 条件类型
    private _condition: number;             // 成就条件
    private _desc: string;                  // 描述
    private _rewardImageRes: string;        // 奖励图片
    private _rewardDesc: string;            // 奖励描述
    private _rewardNum: number;             // 奖励数量
    private _rarity: number;                // 稀有度
    private _completeTime: string = "";     // 完成时间
    private _curCon: number = 0;            // 当前完成次数
    private _status: number = 0;            // 成就状态（0未完成，1完成，2已领取）
    private _time: number = 0;              // 完成的时间戳
    private _priority: number = 0;          // 排序优先级
    private rewardStr: string;              // 奖励
}