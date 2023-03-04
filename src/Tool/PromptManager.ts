/**
 * 提示界面管理
 */
class PromptManager extends egret.DisplayObjectContainer{
	public constructor() {
		super();
	}

	/**
	 * 创建关卡提示
	 * $msg 文本
	 * $ImaRes 图片
	 * $yesFun 继续函数
	 */
	public static ShowGameTip($msg: string, $ImaRes: string, $yesFun){
		if (WindowManager.GamePromptPage() == null){
			WindowManager.SetWindowFunction(PromptManager._ShowGameTip,
											[$msg,$ImaRes,$yesFun]);
			return;
		}
		PromptManager._ShowGameTip([$msg,$ImaRes,$yesFun]);
	}

	/**
     * 显示游戏提示
	 * @param param	参数
     */
	private static _ShowGameTip(param: any[]){
		WindowManager.GamePromptPage().ShowPrompt(param[0],param[1],param[2]);
	}

	/**
	 * 创建中部提示
	 * $ifFuHuo 是否是复活界面
	 * $ifAuto 是否自动消失
	 * $msg 文本
	 * $ImaRes 图片资源
	 * $yesFun 确认函数
	 * $noFun 取消函数
	 * $yesParam 确认函数参数
	 * $noParam 取消函数参数
	 * $ifShare 是否分享
	 */
	public static CreatCenterTip($ifFuHuo: boolean = false, $ifAuto: boolean = false, $msg: string = null,
								$ImaRes = null, $yesFun = null, $noFun = null, $yesParam = null, $noParam = null, $ifShare: boolean = false){
		if (Game.GameStatus) return;
		if (WindowManager.CenterPromptPage() == null){
			WindowManager.SetWindowFunction(PromptManager._ShowCenter,
											[$ifFuHuo, $ifAuto, $msg, $ImaRes, $yesFun, $noFun, $yesParam, $noParam, $ifShare]);
			return;
		}
		PromptManager._ShowCenter([$ifFuHuo, $ifAuto, $msg, $ImaRes, $yesFun, $noFun, $yesParam, $noParam, $ifShare]);
	}

	/**
     * 显示中部提示
	 * @param param	参数
     */
	private static _ShowCenter(param: any[]){
		WindowManager.CenterPromptPage().ShowPrompt(param[0], param[1], param[2], param[3], param[4], param[5], param[6], param[7], param[8]);
	}

	/**
	 * 创建顶部提示
	 * $msg 文本
	 * $ImaRes 图片资源 
	 */
	public static CreatTopTip($msg: string = null, $ImaRes = null){
		if (!Game.IsShowTopTip) return;
		if (WindowManager.TopPromptPage() == null){
			WindowManager.SetWindowFunction(PromptManager._ShowTop,
											[$msg,$ImaRes]);
			return;
		}
		PromptManager._ShowTop([$msg,$ImaRes]);
	}

	/**
     * 显示顶部提示
     * $msg 显示文本的内容
	 * $ImaRes 图标资源
     */
	private static _ShowTop(param: any[]){
		WindowManager.TopPromptPage().ShowPrompt(param[0], param[1]);
	}

	/**
	 * 创建购买弹框
	 * $shopId 商品id
	 * $buyFun 购买执行函数
	 * $buyGoldType 购买的货币类型
	 * $endPrice 价格
	 */
	public static CreatShopBuyPage($shopId: number, $buyFun: Function, $buyGoldType: string, $endPrice: number){
		if (WindowManager.ShopBuyPage() == null){
			WindowManager.SetWindowFunction(PromptManager.ShowShopBuyPage,
											[$shopId, $buyFun, $buyGoldType, $endPrice]);
			return;
		}
		PromptManager.ShowShopBuyPage([$shopId, $buyFun, $buyGoldType, $endPrice]);
	}

	/**
     * 显示购买弹框
     */
	private static ShowShopBuyPage(param: any[]){
		WindowManager.ShopBuyPage().Show(param[0], param[1], param[2], param[3]);
	}


	/**
	 * 获得奖励并且顶部提示
	 */
	public static ShowGit(bonus: Object[]){
        // 设置奖励
        if (bonus != null){
			let _allBonusData: Object[] = PromptManager.GetBonusResData(bonus, true);
			for(let i=0; i<_allBonusData.length; i++){
				if(_allBonusData[i]["type"] == "item"){
					PromptManager.CreatTopTip(StringMgr.GetText("prompttext1") + _allBonusData[i]["name"] + " X" + _allBonusData[i]["num"], _allBonusData[i]["res"]);
				}
				else{
					PromptManager.CreatTopTip(StringMgr.GetText("prompttext1") + _allBonusData[i]["name"] + " X" + _allBonusData[i]["num"]);
				}
			}
        }
    }

	/**
	 * 奴隶互动获得奖励并中部提示
	 */
	public static SlaveTip(bonus: Object[], des: string, shareDes: string){
		if (Game.GameStatus) return;
        // 设置奖励
		var tipDes: string = des;
        if (bonus != null && bonus.length > 0){
			let _allBonusData: Object[] = PromptManager.GetBonusResData(bonus, true);
			for(let i=0; i<1; i++){
				if(_allBonusData[i]["type"] == "item"){
					tipDes = des + StringMgr.GetText("prompttext2") + _allBonusData[i]["name"] + "X" + _allBonusData[i]["num"];
				}
				else{
					tipDes = des + StringMgr.GetText("prompttext2") + _allBonusData[i]["num"] + _allBonusData[i]["name"];
				}
			}
        }
		PromptManager.CreatCenterTip(false, false, tipDes, null, null, PromptManager.SlaveShareFun.bind(PromptManager), null, shareDes, true);
    }

	/**
	 * 互动分享函数
	 */
	private static SlaveShareFun(shareDes: string){
		window["shareCont"] = FBSDKMgr.Share(shareDes,"",1);
		window["share"]();
	}

	/**
	 * 获取奖励的资源
	 */
	public static GetBonusResData(bonus: Object[], $isAddItem: boolean = false): Object[]{
		let _bonusData: Object = null;
		let _endBonusData: Object[] = [];

        if (bonus != null){
			for (var i = 0; i < bonus.length; i++){
                let data: Object = bonus[i];
				let type: string = ItemManager.GetItemCode(data["type"]);
				if (type == "M"){
					_bonusData = {"type":"money", "res":"fenxiang_jinbi_png", "num":data["num"], "name":StringMgr.GetText("rewardtext1")};
					_endBonusData.push(_bonusData);
				}
				else if (type == "GAS"){
					_bonusData = {"type":"GAS", "res":"fenxiang_jinbi_png", "num":data["num"], "name":StringMgr.GetText("rewardtext5")};
					_endBonusData.push(_bonusData);
				}
				else if(type == "A"){
					_bonusData = {"type":"tili", "res":"fenxiang_daoju_tili_png", "num":data["num"], "name":StringMgr.GetText("rewardtext3")};
					_endBonusData.push(_bonusData);
				}
				else if(type == "D"){
					_bonusData = {"type":"pinggai", "res":"fenxiang_jifen_png", "num":data["num"], "name":StringMgr.GetText("rewardtext2")};
					_endBonusData.push(_bonusData);
				}
				else if (type == "I" || type == "C" || type == "NFT"){
					var item: Item = ItemManager.GetItemByID(ItemManager.GetXID(type, data["id"]));
					if (item != null){
						_bonusData = {"type":"item", "item":item, "res":item.ImageRes, "num":data["num"], "name":item.Name};
						_endBonusData.push(_bonusData);
						if($isAddItem){
							ItemManager.AddItem(ItemManager.GetXID(type, data["id"]), data["num"]);
						}
					}
				}
			}
        }

		return _endBonusData;
    }

	/**
	 * 显示日常活动奖励提示
     * @param bonus 奖励资源信息
	 */
	public static ShowDailyActiveRewardTip(bonus: Object[]){
		if (WindowManager.DailyActiveRewardTip() == null){
			WindowManager.SetWindowFunction(PromptManager._ShowDailyActiveRewardTip, [bonus]);
			return;
		}
		PromptManager._ShowDailyActiveRewardTip([bonus]);
	}

	/**
	 * 加载完成日常活动奖励提示
     * @param param 奖励资源信息
	 */
	private static _ShowDailyActiveRewardTip(param: any[]){
		if(!GuideManager.IsGuide){
			WindowManager.DailyActiveRewardTip().Show(param[0]);
		}
	}

	/**
	 * 检测是否显示更新公告
	 */
	public static CheckGenXin(){
		var json: JSON = Main.GonggaoJson;
		if (json == null) return;
		var data: JSON = json["genxingonggao"];
		if (data == null && !data["isshow"]) return;
        var time: number = Math.floor(new Date().getTime()/1000);
		var startTime: number = data["starttime"];
		var endTime: number = data["endtime"];
		if (time >= startTime && time <= endTime){
			var str: string = data["desc"];
			WindowManager.NoticeDetailWindow().ShowGenxin(str);
		}
	}

    /**
     * 显示更新公告
     */
    public static ShowGenXin(){
		var json: JSON = Main.GonggaoJson;
		if (json == null) return;
		var data: JSON = json["genxingonggao"];
		if (data == null) return;
		var str: string = data["desc"];
		WindowManager.NoticeDetailWindow().ShowGenxin(str);
    }

    /**
     * 显示维护公告
     */
    public static ShowWeihu(){
		var json: JSON = Main.GonggaoJson;
		if (json == null) return;
		var data: JSON = json["fuwuqiweihu"];
		if (data == null) return;
		var str: string = data["desc"];
		WindowManager.NoticeDetailWindow().ShowWeihu(str);
    }
}