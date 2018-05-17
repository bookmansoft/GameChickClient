/**
 * 活动管理
 */
class ActiveManager{
    /**
     * 初始化活动信息
     */
    public static Init(){
        NetManager.SendRequest(["func=" + NetNumber.ActiveInfo + "&id=1055"], ActiveManager._GuoQing);
    }

    /**
     * 领取活动奖励返回
     */
    private static _ReceiveActiveBonus(json: Object){
        var code: number = json["code"];
        if (code == NetManager.SuccessCode){
            if (json["data"] != null && json["data"]["bonus"] != null){
                ActiveManager._activeBonus = json["data"]["bonus"];
                if (ActiveManager._activeBonus != null){
                    if (WindowManager.ActiveBonusWindow() != null){
                        ActiveManager._ShowActiveGift([StringMgr.GetText("guoqinguitext2"), ActiveManager._activeBonus]);
                    }
                    else {
                        WindowManager.SetWindowFunction(ActiveManager._ShowActiveGift, [StringMgr.GetText("guoqinguitext2"), ActiveManager._activeBonus], WindowManager.ActiveBonusWindow);
                    }
                }
            }
        }
    }

    /**
     * 显示活动奖励
     */
    private static _ShowActiveGift(params: any[]){
        WindowManager.ActiveBonusWindow().Show(params[0], params[1]);
    }

    /**
     * 检测活动礼包
     */
    public static CheckBonus(){
        if (!UnitStatusMgr.IsGetNinjaGift){
            NetManager.SendRequest(["func=" + NetNumber.ActiveBonus + "&type=1"], ActiveManager._ReceiveActiveBonus);
        }
    }

    /**
     * 接收国庆活动信息
     */
    private static _GuoQing(json: Object){
        var code: number = json["code"];
        if (code == NetManager.SuccessCode){
            var data: Object = json["data"];
            if (data == null) ActiveManager._gqValue = 0;
            else {
                if (data["conditionMgr"] != null && data["conditionMgr"]["conList"] != null &&
                    data["conditionMgr"]["conList"]["38"] != null){
                    ActiveManager._gqValue = data["conditionMgr"]["conList"]["38"]["value"];
                }
            }
        }
    }

    /**
     * 国庆活动当前进度值
     */
    public static get GuoQingValue(): number{
        return ActiveManager._gqValue;
    }

    /**
     * 国庆活动当前进度值
     */
    public static set GuoQingValue(value: number){
        ActiveManager._gqValue = value;
    }

    // 变量
    private static _gqValue: number = 0;
    private static _activeBonus: Object[];
}