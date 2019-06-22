/**
 * 日常活动预热界面
 */
class DailyActiveYuReWindow extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/DailyAcitveYuReWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseDown,this);
		this._chooseButton1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCanDown,this);
		// this._chooseButton2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onNoDown,this);
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._bg.source = "richangyure_di" + lg + "_png";
        this._chooseButton1.skinName = SkinCreateMgr.CreateButton("richangyure_an_jiayou_l" + lg + "_png", "richangyure_an_jiayou_a" + lg + "_png");
    }

	/**
	 * 点击关闭
	 */
	private onCloseDown(e){
		this.IsVisibled = false;
	}

	/**
	 * 点击按钮1
	 */
	private onCanDown(e){
		if(ItemManager.GetItemCount(this._itemId) > 0){
			NetManager.SendRequest(["func=" + NetNumber.AddDailyActiveProp + "&choose=1" + "&num=" + ItemManager.GetItemCount(this._itemId)],this._ReceiveAddJiangChi.bind(this));
		}
		else{
			PromptManager.CreatCenterTip(false,true,StringMgr.GetText("dailyactivetext7"));
		}
	}

	/**
	 * 点击按钮2
	 */
	// private onNoDown(e){
	// 	if(ItemManager.GetItemCount(this._itemId) > 0){
	// 		NetManager.SendRequest(["func=" + NetNumber.AddDailyActiveProp + "&choose=2" + "&num=" + ItemManager.GetItemCount(this._itemId)],this._ReceiveAddJiangChi.bind(this));
	// 	}else{
	// 		PromptManager.CreatCenterTip(false,true,"道具不足快去闯关吧！");
	// 	}
	// }

	/**
	 * 添加奖励返回
	 */
	private _ReceiveAddJiangChi(json: Object){
		if(json["code"] != NetManager.SuccessCode){
			switch(json["code"]){
				case 903:PromptManager.CreatCenterTip(false,true,StringMgr.GetText("dailyactivetext8"));break;
				case 904:PromptManager.CreatCenterTip(false,true,StringMgr.GetText("dailyactivetext9"));break;
				default:PromptManager.CreatCenterTip(false,true,StringMgr.GetText("dailyactivetext10"));break;
			}
			return;
		}

		// if(json["data"]["choose"]["groupA"])
		// 	this._blueNum = json["data"]["choose"]["groupA"];
		// if(json["data"]["choose"]["groupB"])
		// 	this._redNum = json["data"]["choose"]["groupB"];

		if(json["data"]["prop"])
			this._jiangchiNum = json["data"]["prop"];

		
		ItemManager.UseItem(this._itemId, ItemManager.GetItemCount(this._itemId));

		this.updataInfo();

		if(json["data"]["bonus"] && json["data"]["bonus"].length > 0)
			PromptManager.ShowDailyActiveRewardTip(json["data"]["bonus"]);
	}


	/**
	 * 显示界面
	 */
	public Show(json: Object){
		// if(json["data"]["choose"]["groupA"])
		// 	this._blueNum = json["data"]["choose"]["groupA"];
		// if(json["data"]["choose"]["groupB"])
		// 	this._redNum = json["data"]["choose"]["groupB"];
		if(json["data"]["prop"])
			this._jiangchiNum = json["data"]["prop"];

		this.updataInfo();
	}

	/**
	 * 更新页面
	 */
	private updataInfo(){
		// this._blueNumLabel.text = this._blueNum + "r";
		// this._redNumLabel.text = this._redNum + "r";
		this._pingGaiNumLabel.text = this._jiangchiNum.toString();

		this._itemNumLabel.text = "x" + ItemManager.GetItemCount(this._itemId);

		// if(Math.abs( this._blueNum - this._redNum) > 100){
		// if(this._blueNum < this._redNum){
		// 	egret.Tween.get(this._blueGroup).to({y:545},100);
		// 	egret.Tween.get(this._redGroup).to({y:575},100);
		// 	egret.Tween.get(this._lineIma).to({rotation:10},100);
		// }
		// else if(this._blueNum == this._redNum){
		// 	egret.Tween.get(this._blueGroup).to({y:559},100);
		// 	egret.Tween.get(this._redGroup).to({y:559},100);
		// 	egret.Tween.get(this._lineIma).to({rotation:0},100);
		// }
		// else{
		// 	egret.Tween.get(this._blueGroup).to({y:575},100);
		// 	egret.Tween.get(this._redGroup).to({y:545},100);
		// 	egret.Tween.get(this._lineIma).to({rotation:-10},100);
		// }
	}

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
        }
        else{
            Main.Instance.WindowTopLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	private _bg: eui.Image;									// 背景
	private _closeButton: eui.Button;						// 关闭按钮
	private _chooseButton1: eui.Button;						// 按钮1
	private _chooseButton2: eui.Button;						// 按钮2
	private _pingGaiNumLabel: eui.Label;					// 奖池瓶盖数量文本
	private _itemNumLabel: eui.Label;						// 道具数量文本
	// private _blueNumLabel: eui.BitmapLabel;					// 蓝色支持人数文本
	// private _redNumLabel: eui.BitmapLabel;					// 红色支持人数文本
	// private _lineIma: eui.Image;							// 秤线图片
	// private _blueGroup: eui.Group;							// 蓝色容器
	// private _redGroup: eui.Group;							// 红色容器

	private _isVisibled: boolean = false;                   // 是否显示

	// private _chooseANum: number = 0;						// 蓝色人数
	// private _chooseBNum: number = 0;						// 红色人数
	private _jiangchiNum: number = 0;						// 奖池数量
	private _itemId: number = 40702;						// 道具id
}