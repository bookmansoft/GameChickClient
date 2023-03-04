/**
 * 积分排名条
 */
class IntegralRankList extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/IntegralRankListSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._playerNameLabel.multiline = false;
		this._playerNameLabel.height = 30;
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
		if(this._isPlayer){
			this._xiaofeiLabel.textColor = 0x935102;
			this._playerNameLabel.textColor = 0x935102;
			this._integralNumLabel.textColor = 0x935102;
			this._itemNumLabel1.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
			this._itemNumLabel2.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
		}else{
			this._xiaofeiLabel.textColor = 0x245f9d;
			this._playerNameLabel.textColor = 0x245f9d;
			this._integralNumLabel.textColor = 0x245f9d;
			this._itemNumLabel1.font = "inteitemnumfont1"+ StringMgr.LanguageSuffix + "_fnt";
			this._itemNumLabel2.font = "inteitemnumfont1" + StringMgr.LanguageSuffix + "_fnt";
		}

		if(StringMgr.LanguageSuffix == ""){
			this._xiaofeiLabel.text = "积分:";
		}else{
			this._xiaofeiLabel.text = "Point:";
		}
	}

	/**
	 * 更新
	 */
	public upDataShow($ifPlayer, $playerInfo: Object, $rankBonusDataSet: Object[]){
		this._isPlayer = $ifPlayer;

		let _rankNum: number = $playerInfo["rank"]; //Math.random()*100|0 + 1;
		let rewards = null;
		let rewardsSet = [];

		// 根据排名获取排名奖励
		for(let i=0; i<$rankBonusDataSet.length; i++){
			if(_rankNum <= $rankBonusDataSet[i]["endrank"]){
				rewards = $rankBonusDataSet[i]["rewards"];
				break;
			}
		}


		this._integralNumLabel.text = $playerInfo["score"];
		this._playerNameLabel.text =  decodeURIComponent($playerInfo["name"]);

		this._playerIconIma.source = RES.getRes("touxiang_mr_jpg");
		// 加载资源
		if($playerInfo["icon"] != ""){
			let imaLoad = new egret.ImageLoader();
			imaLoad.load($playerInfo["icon"]);
			imaLoad.addEventListener(egret.Event.COMPLETE,
				function (){
					this._playerIconIma.source = imaLoad.data;
				},this);
		}

		// 解析奖励图片
		rewardsSet = rewards.split(";");
		for(let i = 0; i<rewardsSet.length; i++){
			let itemSet: string[] = rewardsSet[i].split(",");
			let resSet = this.showItemIma(itemSet);

			let _bonusNum = resSet[1];
			if(parseInt(resSet[1]) > 10000){
				let qian:number = parseInt(resSet[1])/1000;
				_bonusNum = qian + "k";
			}

			if(i==0){
				this._itemIcon1.source = resSet[0];
				this._itemNumLabel1.text = resSet[1];
			}else{
				this._itemIcon2.source = resSet[0];
				this._itemNumLabel2.text = resSet[1];
			}
		}

		// 设置排名头像框
		if(_rankNum <= 3){
        	var lg: string = StringMgr.LanguageSuffix;
			this._rankNumBgIma.texture = RES.getRes("jifen_paiming_" + _rankNum + lg + "_png");
			this._rankNumLabel.visible = false;
		}
		else{
			this._rankNumBgIma.texture = RES.getRes("jifen_paiming_mr_png");
			this._rankNumLabel.visible = true;
			this._rankNumLabel.text = "d" + _rankNum.toString() + "m";
		}

		// 是否是玩家自己
		this._rankListGroup.visible = !this._isPlayer;
		this._MyRankListGroup.visible = this._isPlayer;
		if(this._isPlayer){
			this._xiaofeiLabel.textColor = 0x935102;
			this._playerNameLabel.textColor = 0x935102;
			this._integralNumLabel.textColor = 0x935102;
			this._itemNumLabel1.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
			this._itemNumLabel2.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
		}else{
			this._xiaofeiLabel.textColor = 0x245f9d;
			this._playerNameLabel.textColor = 0x245f9d;
			this._integralNumLabel.textColor = 0x245f9d;
			this._itemNumLabel1.font = "inteitemnumfont1"+ StringMgr.LanguageSuffix + "_fnt";
			this._itemNumLabel2.font = "inteitemnumfont1" + StringMgr.LanguageSuffix + "_fnt";
		}

		if(StringMgr.LanguageSuffix == ""){
			this._xiaofeiLabel.text = "积分:";
		}else{
			this._xiaofeiLabel.text = "Point:";
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
			else if (ItemManager.GetItemCode(bonus[0]) == "GAS"){
				return ["fenxiang_jinbi_png",bonus[1]];
			}
			else if(ItemManager.GetItemCode(bonus[0]) == "A"){
				return ["fenxiang_daoju_tili_png",bonus[1]];
			}
			else if(ItemManager.GetItemCode(bonus[0]) == "D"){
				return ["fenxiang_jifen_png",bonus[1]];
			}
			else if (ItemManager.GetItemCode(bonus[0]) == "I" || ItemManager.GetItemCode(bonus[0]) == "C" || ItemManager.GetItemCode(bonus[0]) == "NFT") {
				var item: Item = ItemManager.GetItemByID(ItemManager.GetXID(bonus[0], parseInt(bonus[1])));
				if (item != null){
					return [item.ImageRes,bonus[2]];
				}
				if(item == null && ItemManager.GetItemCode(bonus[0]) == "C" && bonus[1] == "0"){
					return ["suipian_weizhi_png",bonus[2]];
				}
			}
        }
    }


	// 参数
	private _rankListGroup: eui.Group;								// 其他玩家排名容器
	private _MyRankListGroup: eui.Group;							// 玩家自己排名容器

	private _rankNumBgIma: eui.Image;								// 排名背景图
	private _playerIconIma: eui.Image;								// 玩家头像
	private _rankNumLabel: eui.BitmapLabel;							// 玩家排名文本

	private _integralNumLabel: eui.Label;							// 积分数量文本
	private _playerNameLabel: eui.Label;							// 名称文本

	private _itemIcon1: eui.Image;									// 奖励道具图标1
	private _itemIcon2: eui.Image;									// 奖励道具图标2
	private _itemNumLabel1: eui.BitmapLabel;						// 奖励道具数量文本1
	private _itemNumLabel2: eui.BitmapLabel;						// 奖励道具数量文本2

	private _isPlayer: boolean;										// 是否是玩家自己

	private _xiaofeiLabel: eui.Label;								// 积分


}