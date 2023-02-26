/**
 * 成就管理
 */
class AchievementManager{
    /**
     * 成就初始化
     */
    public static Init(){
        var jsonData: JSON = RES.getRes("achievedata_json");
        Object.keys(jsonData).map((key)=>{
            var data: Object = jsonData[key];
            var id: number = parseInt(data["id"]);
            if (Math.floor(id / 1000) == 1){
                var ach: Achievement = new Achievement(data);
                AchievementManager._achSet.push(ach);
            }
        });
        AchievementManager._achSet = AchievementManager._achSet.sort(function(ach1: Achievement, ach2: Achievement): number{
                                                                            return ach1.Priority - ach2.Priority;});
        Achievement.AchTypeData = RES.getRes("achievetype_json");
        
        AchievementManager.GetAchievementData();
        Facade.instance().watch(AchievementManager._AchievementComplete, NetNumber.AchievementComplete);
        Facade.instance().watch(AchievementManager._UpdateAchievement, NetNumber.AchievementUpdate);
    }

    /**
     * 从服务端获取成就数据
     */
    public static GetAchievementData(){
        NetManager.SendRequest(["func=" + NetNumber.AchievementList + "&typ=0&status=-1"],
                                AchievementManager._AchievementInfo.bind(AchievementManager));

    }

    /**
     * 获取成就数据
     */
    private static _AchievementInfo(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            return;
        }
        var data: Object = jsonData["data"];
        for (var i = 0; i < data["length"]; i++){
            var achData = data[i];
            var id: number = achData["id"];
            var status: number = achData["status"];
            var time: number = achData["time"];
            var value: number = achData["value"];
            var ach: Achievement = AchievementManager.GetAchievementByID(id);
            if (ach != null){
                ach.Status = status;
                ach.CurCondition = value;
                ach.Time = time;
            }
        }
        GameEvent.DispatchEvent(EventType.AchieveUpdata);
    }

    /**
     * 成就完成监听
     */
    private static _AchievementComplete(jsonData: Object){
        var id: number = jsonData["info"]["id"];
        if (id == 1055){
            ActiveManager.GuoQingValue = 100;
        }
        var ach: Achievement = AchievementManager.GetAchievementByID(id);
        if (ach != null){
            ach.CurCondition = ach.Condition;
            ach.Status = 1;
        }
        if (!Game.IsShowTopTip){
            AchievementManager._lastCompleteID = id;
            return;
        }
        if (WindowManager.AchievementTip() == null){
            WindowManager.SetWindowFunction(AchievementManager._ShowAchievementTip.bind(AchievementManager),
                                            jsonData);
            return;
        }
        AchievementManager._ShowAchievementTip(jsonData);
    }

    /**
     * 显示成就Tip
     */
    private static _ShowAchievementTip(jsonData: Object){
        var id: number = jsonData["info"]["id"];
        var ach: Achievement = AchievementManager.GetAchievementByID(id);
        if (ach != null && !WindowManager.AchievementTip().IsVisibled){
            ach.CurCondition = ach.Condition;
            ach.Status = 1;
            var text: string = StringMgr.GetText("achievementtext3");
            text = text.replace("&achievement", ach.Name);
            
            var lg: string = StringMgr.LanguageSuffix;

            let res = ach.ImageRes + "_jpg";
            if(RES.getRes(ach.ImageRes + lg + "_png") != null){
                res = ach.ImageRes + lg + "_png";
            }
            WindowManager.AchievementTip().Show(res, text);
        }
        AchievementManager._lastCompleteID = id;
    }

    /**
     * 获得成就集合
     */
    public static get AchievementSet(): Achievement[]{
        return AchievementManager._achSet;
    }

    /**
     * 通过ID获得成就
     */
    public static GetAchievementByID(id: number): Achievement{
        for (var i = 0; i < AchievementManager._achSet.length; i++){
            if (AchievementManager._achSet[i].ID == id){
                return AchievementManager._achSet[i];
            }
        }
        return null;
    }

    /**
     * 成就领奖
     */
    public static AchievementGetBonus(id: number){
        NetManager.SendRequest(["func=" + NetNumber.AchGetBonus + "&id=" + id],
                                AchievementManager._GetBonusReturn.bind(AchievementManager));
    }

    /**
     * 成就数值更新
     */
    private static _UpdateAchievement(jsonData: Object){
        var id: number = parseInt(jsonData["info"]["id"]);
        var count: number = parseInt(jsonData["info"]["data"][0]["num"]);
        var ach: Achievement = AchievementManager.GetAchievementByID(id);
        if (ach != null){
            ach.CurCondition = count;
            GameEvent.DispatchEvent(EventType.AchieveUpdata);
        }
        if (id == 1055){
            ActiveManager.GuoQingValue = count;
        }
    }

    /**
     * 成就领奖
     */
    private static _GetBonusReturn(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            return;
        }
        var data: string = jsonData["data"];
        var dataSet: string[] = data.split(",");
        switch (ItemManager.GetItemCode(dataSet[0])) {
            case "M":
                var count: number = parseInt(dataSet[1]);
                // UnitManager.Player.Money += count;
                PromptManager.CreatTopTip(StringMgr.GetText("achievementtext5") + count);
                break;
            case "item":
            case "role":
            case "scene":
            case "road":
            case "C":
            case "I":
                var id: number = parseInt(dataSet[1]);
                var count: number = parseInt(dataSet[2]);
                let xid = ItemManager.GetXID(dataSet[0], id);
                ItemManager.AddItem(xid, count);
                var item: Item = ItemManager.GetItemByID(xid);
                if (item != null){
                    PromptManager.CreatTopTip(StringMgr.GetText("achievementtext6") + item.Name + "x" + count, item.ImageRes);
                }
                break;
        }
        GameEvent.DispatchEvent(EventType.AchieveUpdata);
    }

    /**
     * 显示最后一个成就的详情页
     */
    public static ShowLastCompleteAch(){
        if (AchievementManager._lastCompleteID == 0) return;
        if (WindowManager.AchievementDetailPage() == null){
            WindowManager.SetWindowFunction(AchievementManager._ShowLastCompleteAch);
            return;
        }
        AchievementManager._ShowLastCompleteAch();
    }

    /**
     * 显示最后一个成就的详情页
     */
    private static _ShowLastCompleteAch(){
        var ach: Achievement = AchievementManager.GetAchievementByID(AchievementManager._lastCompleteID);
        if (ach != null){
            WindowManager.AchievementDetailPage().ShowPage(ach);
        }
        AchievementManager._lastCompleteID = 0;
    }

    // 变量
    private static _achSet: Achievement[] = [];         // 成就集合
    private static _lastCompleteID: number = 0;         // 最后一个完成的成就
}