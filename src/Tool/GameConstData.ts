/**
 * 常量数值
 */
class GameConstData{
    /**
     * 获取数据JSON
     */
    private static get _JsonData(): JSON{
        if (GameConstData._data == null){
            GameConstData._data = RES.getRes("constdata_json");
        }
        return GameConstData._data;
    }

    /**
     * 期望防御值
     */
    public static get HopeDefense(): number{
        var data: JSON = GameConstData._JsonData["hopeDefense"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 免伤成长系数
     */
    public static get InjuryFreeRate(): number{
        var data: JSON = GameConstData._JsonData["injuryFreeRate"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 期望运气值
     */
    public static get HopeLucky(): number{
        var data: JSON = GameConstData._JsonData["hopeLucky"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 幸运成长系数
     */
    public static get LuckyRate(): number{
        var data: JSON = GameConstData._JsonData["luckyRate"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 扣血基础值
     */
    public static get BuckleBlood(): number{
        var data: JSON = GameConstData._JsonData["buckleBlood"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 角色碎片数量
     */
    public static get GetRoleNum(): number{
        var data: JSON = GameConstData._JsonData["getRoleNum"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 碎片成长系数
     */
    public static get DebrisConumRate(): number{
        var data: JSON = GameConstData._JsonData["debrisConumRate"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 角色技能1解锁等级
     */
    public static get SkillUnlockLev1(): number{
        var data: JSON = GameConstData._JsonData["skillUnlockLev1"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }
    /**
     * 角色技能2解锁等级
     */
    public static get SkillUnlockLev2(): number{
        var data: JSON = GameConstData._JsonData["skillUnlockLev2"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }
    /**
     * 角色技能3解锁等级
     */
    public static get SkillUnlockLev3(): number{
        var data: JSON = GameConstData._JsonData["skillUnlockLev3"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    public static get RoleMaxLevel(): number{
        var data: JSON = GameConstData._JsonData["maxLev"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 分享文本总数
     */
    public static get ShareTextCount(): number{
        var data: JSON = GameConstData._JsonData["shareTextCount"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 死亡分享次数上限
     */
    public static get DieShareMaxTime(): number{
        var data: JSON = GameConstData._JsonData["deadMaxShareTime"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 体力分享次数上限
     */
    public static get PhyShareMaxTime(): number{
        var data: JSON = GameConstData._JsonData["apMaxShareTime"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 获得分享类容
     */
    public static get ShareContent(): string[]{
        var textSet: string[] = [];
		var shareCount: number = GameConstData.ShareTextCount;
		var index: number = Math.ceil(Math.random() * shareCount);
		var shareJSON: JSON = RES.getRes("sharetext_json");
		var shareData: JSON = shareJSON[index.toString()];
		if (shareData != null){
            var text: string = StringMgr.GetText(shareData["desc"]);
			var imageUrl: string = shareData["pic"];
            text = text.replace("&star", CheckpointManager.StarCount.toString());
            text = text.replace("&chapter", CheckpointManager.MaxCheckpointID.toString());
            textSet.push(text);
            textSet.push(imageUrl);
		}
        return textSet;
    }

    /**
     *  通过ID获得分享类容
     */
    public static GetShareContentByID(shareID: number): string[]{
        var textSet: string[] = [];
		var shareJSON: JSON = RES.getRes("sharetext_json");
		var shareData: JSON = shareJSON[shareID.toString()];
		if (shareData != null){
            var text: string = StringMgr.GetText(shareData["desc"]);
			var imageUrl: string = shareData["pic"];
            text = text.replace("&star", CheckpointManager.StarCount.toString());
            text = text.replace("&chapter", CheckpointManager.MaxCheckpointID.toString());
            textSet.push(text);
            textSet.push(imageUrl);
		}
        return textSet;
    }

    /**
     * 技能金币基数
     */
    public static get SkillMoneyBase(): number{
        var data: JSON = GameConstData._JsonData["skillMoneyBase"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 小跳恢复能量
     */
    public static get EnergySmall(): number{
        var data: JSON = GameConstData._JsonData["energySmall"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 大跳恢复能量
     */
    public static get EnergyBig(): number{
        var data: JSON = GameConstData._JsonData["energyBig"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 随时间恢复能量
     */
    public static get EnergyTime(): number{
        var data: JSON = GameConstData._JsonData["energyTime"];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    /**
     * 获取常量配置
     * @param key 键
     */
    public static GetValue(key: string): number{
        var data: JSON = GameConstData._JsonData[key];
        if (data != null){
            return data["num"];
        }
        return 0;
    }

    public static GetTestString(): string{
        var data: JSON = GameConstData._JsonData["aaaa"];
        if (data != null){
            return data["des"];
        }
        return "";
    }
    

    // 变量
    private static _data: JSON;             // 常量数据JSON
}