/**
 * 积分兑换条
 */
class IntegralExchangeList extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/IntegralExchangeListSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

		GameEvent.AddEventListener(EventType.ActivityScore, this.upDataScore.bind(this), this);
		this._receiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onReceiveClick,this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._haveReceiveIma.source = "jifen_yilingqu" + lg + "_png";
        this._textLabel.text = StringMgr.GetText("integraltext1");
        this._receiveButton.skinName = SkinCreateMgr.CreateButton("jifen_an_lingqu_l" + lg + "_png", "jifen_an_lingqu_l" + lg + "_png", "jifen_an_lingqu_h" + lg + "_png");
		
		this._receiveButton.enabled = true;
		// 领奖按钮状态
		if(this._exchangInfo["condition"] && IntegralManager.Score >= this._exchangInfo["condition"]){
			this._receiveButton.enabled = true;
		}else{
			this._receiveButton.enabled = false;
		}
	}

	/**
	 * 点击领奖
	 */
	private onReceiveClick(){
        SoundManager.PlayButtonMusic();
		// 领奖
        NetManager.SendRequest(["func=" + NetNumber.ActivityGetBonus + "&id=" + this._gitId], this._ReveiveActivityGetBonus.bind(this));
	}

	/**
     * 领奖返回
     */
    private _ReveiveActivityGetBonus(jsonData: Object){
        let code: number = jsonData["code"];
		let data: Object = jsonData["data"];

        if(code == NetManager.SuccessCode){
			IntegralManager.GitStateById(this._gitId, 1);
			PromptManager.ShowGit(data["bonus"]);
        }

        this.upDataShow(null);
    }

	/**
	 * 更新
	 */
	public upDataShow($info: Object){
		if($info){
			this._exchangInfo = $info;
			this._gitId = this._exchangInfo["stageid"];
		}

		this.upDataScore();

		// 显示奖励
		let rewardsSet = this._exchangInfo["rewards"].split(";");
		for(let i = 0; i<rewardsSet.length; i++){
			let itemSet: string[] = rewardsSet[i].split(",");
			let resSet = this.showItemIma(itemSet);

			let _bonusNum = resSet[1];
			if(parseInt(resSet[1]) > 10000){
				let qian:number = parseInt(resSet[1])/1000;
				_bonusNum = qian + "k";
			}

			if(i == 0){
				this._itemIcon1.source = resSet[0];
				this._itemNumLabel1.text = _bonusNum;
			}else{
				this._itemIcon2.source = resSet[0];
				this._itemNumLabel2.text = _bonusNum;
			}
		}
	}

	/**
	 * 更新积分
	 */
	private upDataScore(){
		
		this._integralNumLabel.text = IntegralManager.Score + "/" + this._exchangInfo["condition"];

		// 领奖按钮状态
		if(IntegralManager.Score >= this._exchangInfo["condition"]){
			this._receiveButton.enabled = true;
		}else{
			this._receiveButton.enabled = false;
		}
		// 已领取状态
		if( IntegralManager.GitState[ this._gitId ] == 1){
			this._haveReceiveIma.visible = true;
			this._receiveButton.visible = false;
			this._integralNumLabel.visible = false;
		}
		else{
			this._haveReceiveIma.visible = false;
			this._receiveButton.visible = true;
			this._integralNumLabel.visible = true;
		}
	}

	/**
	 * 获得奖励并且提示
	 */
	private showItemIma(bonus: string[]){
        if (bonus != null){
			if (ItemManager.GetItemCode(bonus[0]) == "M"){
				return ["fenxiang_jinbi_png",bonus[1]];
			}
			else if(ItemManager.GetItemCode(bonus[0]) == "A"){
				return ["fenxiang_daoju_tili_png",bonus[1]];
			}
			else if(ItemManager.GetItemCode(bonus[0]) == "D"){
				return ["fenxiang_jifen_png",bonus[1]];
			}
			else if (ItemManager.GetItemCode(bonus[0]) == "I" || ItemManager.GetItemCode(bonus[0]) == "C"){
				var item: Item = ItemManager.GetItemByID(ItemManager.GetXID(bonus[0], parseInt(bonus[1])));
				if (item != null) {
					return [item.ImageRes, bonus[2]];
				}
				if(item == null && ItemManager.GetItemCode(bonus[0]) == "C" && bonus[1] == "0") {
					return ["suipian_weizhi_png",bonus[2]];
				}
			}
        }
    }


	// 参数
	private _haveReceiveIma: eui.Image;								// 已领取图标
	private _integralNumLabel: eui.Label;							// 积分数量文本
	private _receiveButton: eui.Button;								// 领取奖励按钮
	private _itemIcon1: eui.Image;									// 奖励道具图标1
	private _itemIcon2: eui.Image;									// 奖励道具图标2
	private _itemNumLabel1: eui.BitmapLabel;						// 奖励道具数量文本1
	private _itemNumLabel2: eui.BitmapLabel;						// 奖励道具数量文本2

	private _exchangInfo: Object;									// 兑换礼包数据数据
	private _gitId: number = 0;										// 礼包编号
	private _textLabel: eui.Label;
}