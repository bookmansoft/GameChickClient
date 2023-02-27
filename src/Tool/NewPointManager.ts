/**
 * 新消息管理。可操作红点管理
 */
class NewPointManager {
	public constructor() {
	}

	/**
	 * 好友列表的红点是否显示
	 */
	public static friendRedPointIsVisible(): boolean{
		for(let i = 0; i< FriendManager.AllFrienSet.length; i++){
			if(FriendManager.AllFrienSet[i].ShouZan > 0){
				return true;
			}
		}
		return false;
	}

	/**
	 * 角色列表的红点是否显示
	 */
	public static RoleRedPointIsVisible(): boolean{
		for(let i = 0; i< UnitManager.GetRoleSet().length; i++){
			if(UnitManager.GetRoleSet()[i].IsHave){
				if(UnitManager.GetRoleSet()[i].Level < GameConstData.RoleMaxLevel &&
				   UnitManager.GetRoleSet()[i].GetCurRoleNum >= UnitManager.GetRoleSet()[i].UpLevelDebrisNum){
					return true;
				}else{
					let skillSet = UnitManager.GetRoleSet()[i].UseSkillSet;
					for(let i=0; i<skillSet.length; i++){
						let _moneyNum = Math.ceil( GameConstData.SkillMoneyBase * Math.pow(skillSet[i].Level,1.6) );
						if(skillSet[i].IsCanUp && UnitManager.Player.Money >= _moneyNum){
							return true;
						}
					}
				}
			}else{
				if(UnitManager.GetRoleSet()[i].Level < GameConstData.RoleMaxLevel &&
				   UnitManager.GetRoleSet()[i].GetCurRoleNum >= UnitManager.GetRoleSet()[i].GetRoleNum){
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 成就列表的红点是否显示
	 */
	public static AchiRedPointIsVisible(): boolean{
		for(let i = 0; i< AchievementManager.AchievementSet.length; i++){
			if(AchievementManager.AchievementSet[i].Status == 1){
				return true;
			}
		}
		return false;
	}

	/**
	 * 活动红点是否显示
	 */
	public static ActivityRedPointIsVisible(): boolean{
		let _IntegralExchangeDataSet = IntegralManager.IntegralExchangeRewardsData();

		if(_IntegralExchangeDataSet.length > 0){
			for(let i = 0; i< IntegralManager.GitState.length; i++){
				if(IntegralManager.GitState[i + 1] == 0){
					if(IntegralManager.Score >= _IntegralExchangeDataSet[i]["condition"]){
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * 是否出现活动领奖按钮
	 */
	public static ReceiveButtonIsVisible(): boolean{
		let _IntegralExchangeDataSet = IntegralManager.IntegralExchangeRewardsData();

		if(_IntegralExchangeDataSet.length > 0){
			if(IntegralManager.GitState[0] == 0 && IntegralManager.RankNum != 0){
				return true;
			}
		}
		return false;
	}

	/**
	 * 消息红点是否显示
	 */
	public static NoticeRedPointIsVisible(): boolean{
		let _noticeSet = NoticeManager.AllNoticeSet;

		if(_noticeSet.length > 0){
			for(let i = 0; i< _noticeSet.length; i++){
				if(_noticeSet[i].IsRead == false){
						return true;
				}
			}
		}
		return false;
	}

	/**
	 * 奴隶是否显示红点
	 */
	public static get SlaveRedIsVisible(): boolean{
		if (CheckpointManager.MaxCheckpointID < 5) return false;
		if (SlaveManager.HasSpace) return true;
        var level: number = SlaveManager.Level;
		var max: number = 0;
		if (UnitStatusMgr.IsMaster && SlaveManager.SlaveList.length > 0){
			var praiseFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.PraiseType);
			var lashFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.LashType);
			var foodFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.FoodType);
			if (praiseFre != null){
            	max = Math.floor(praiseFre.MaxValue * 0.25 * level);
				if (praiseFre.CD <= 0){
					if ((max + praiseFre.ExtValue - praiseFre.Value) > 0) return true;
				}
			}
			if (lashFre != null){
            	max = Math.floor(lashFre.MaxValue * 0.25 * level);
				if ((max + lashFre.ExtValue - lashFre.Value) > 0){
					if (ItemManager.GetItemCount(40401) > 0) return true;
				} 
			}
			if (foodFre != null){
            	max = Math.floor(foodFre.MaxValue * 0.25 * level);
				if ((max + foodFre.ExtValue - foodFre.Value) > 0){
					if (ItemManager.GetItemCount(40402) > 0) return true;
				} 
			}
		}
		if (UnitStatusMgr.IsSlave){
			var fawnFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.FawnType);
			var avengeFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.RevengeType);
			if (avengeFre != null){
            	max = Math.floor(avengeFre.MaxValue * 0.25 * level);
				if (avengeFre.CD <= 0){
					if ((max + avengeFre.ExtValue - avengeFre.Value) > 0) return true;
				}
			}
			if (fawnFre != null){
            	max = Math.floor(fawnFre.MaxValue * 0.25 * level);
				if ((max + fawnFre.ExtValue - fawnFre.Value) > 0){
					if (ItemManager.GetItemCount(40403) > 0) return true;
				} 
			}
		}
		return false;
	}

	/**
	 * VIP红点
	 */
	public static get VIPRedIsVisible(): boolean{
		if (!UnitManager.Player.IsVIP) return true;
        var fre: Frequency = FrequencyManager.GetFrequency(FrequencyType.VipDaily);
		if (fre != null && fre.Value < fre.MaxValue) return true;
		return false;
	}
	
}