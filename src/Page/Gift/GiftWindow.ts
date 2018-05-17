/**
 * 每日登入奖励界面
 */
class GiftWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/GiftPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._lqButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this._isCreated = true;
        if (this._bonus != null){
            this.Show(this._isGet, this._bonus);
        }
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._lqButton.skinName = SkinCreateMgr.CreateButton("denglulb_an_lingqu" + lg + "_png", "denglulb_an_lingqu_a" + lg + "_png");
    }

    /**
     * 按钮点击响应
     */
    private _OnClick(){
        this.IsVisibled = false;
        // UnitManager.CheckPlayGift();
        // 引导检测
        // GuideManager.GuideCheck();
    }

    /**
     * 显示界面
     */
    public Show(isGet: boolean, bonus: Object[]){
        if (!this._isCreated){
            this._bonus = bonus;
            this._isGet = isGet;
            this.IsVisibled = true;
            return;
        }
        this._bonus = null;
        this._isGet = false;
        var bonusCount: number = 0;
        if (bonus != null){
            bonusCount = bonus.length;
            var index: number = 1;
            for (var i = 0; i < bonus.length && i < 2; i++){
                var data: Object = bonus[i];
                var type: string = data["type"];
                if (type == "M"){
                    this["_rewardImage" + index].source = "fenxiang_jinbi_png";
                    this["_countLabel" + index].text = data["num"];
                    this["_nameLabel" + index].text = StringMgr.GetText("rewardtext1");
                    // if (!isGet) UnitManager.Player.Money += data["num"];;
                }
                else if (type == "I" || type == "C"){
                    var item: Item = ItemManager.GetItemByID(data["id"]);
                    if (item != null){
                        this["_rewardImage" + index].source = item.ImageRes;
                        this["_countLabel" + index].text = data["num"];
                        this["_nameLabel" + index].text = item.Name;
                        if (!isGet) ItemManager.AddItem(data["id"], data["num"]);
                    }
                }
                else if(type == "A"){
                    this["_rewardImage" + index].source = "fenxiang_daoju_tili_png";
                    this["_countLabel" + index].text = data["num"];
                    this["_nameLabel" + index].text = StringMgr.GetText("rewardtext3");
                }
                else if(type == "D"){
                    this["_rewardImage" + index].source = "fenxiang_jifen_png";
                    this["_countLabel" + index].text = data["num"];
                    this["_nameLabel" + index].text = StringMgr.GetText("rewardtext2");
                }
                index += 1;
            }
        }
        var isVip: boolean = UnitManager.Player.IsVIP;
        this._vipImage1.visible = isVip;
        this._vipImage2.visible = isVip;
        this._lqButton.visible = !isGet;
        this._titleLabel.text = isGet? StringMgr.GetText("giftpagetext1") : StringMgr.GetText("giftpagetext2");
        var lg: string = StringMgr.LanguageSuffix;
        if (isVip){
            this._bgImage.source = "denglulb_hongdi" + lg + "_png";
            this._borderImage1.source = "denglulb_hong_wupinlan"+"_png";// + lg + "_png";
            this._borderImage2.source = "denglulb_hong_wupinlan"+"_png";// + lg + "_png";
            this._titleImage.source = isGet? "denglulb_hong_yilingqu" + lg + "_png" : "denglulb_hong_lingqu" + lg + "_png";
            this._nameLabel1.textColor = 0x854500;
            this._nameLabel2.textColor = 0x854500;
            this._countLabel1.textColor = 0x854500;
            this._countLabel2.textColor = 0x854500;
            this._titleLabel.textColor = 0x854500;
        }
        else{
            this._bgImage.source = "denglulb_landi" + lg + "_png";
            this._borderImage1.source = "denglulb_lan_wupinlan"+"_png";// + lg + "_png";
            this._borderImage2.source = "denglulb_lan_wupinlan"+"_png";// + lg + "_png";
            this._titleImage.source = isGet? "denglulb_lan_yilingqu" + lg + "_png" : "denglulb_lan_lingqu" + lg + "_png";
            this._nameLabel1.textColor = 0x245f9d;
            this._nameLabel2.textColor = 0x245f9d;
            this._countLabel1.textColor = 0x245f9d;
            this._countLabel2.textColor = 0x245f9d;
            this._titleLabel.textColor = 0x245f9d;
        }

        this._rewardGroup1.visible = bonusCount > 0;
        this._rewardGroup2.visible = bonusCount > 1;
        this._rewardGroup1.x = bonusCount < 2? 265 : 160;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.TopLayer.addChild(this);
        }
        else{
            Main.Instance.TopLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }


    // 变量
	private _isVisibled: boolean = false;                       // 是否显示
    private _isCreated: boolean = false;                        // 是否创建完成
    private _bonus: Object[];                                   // 奖励
    private _isGet: boolean = false;                            // 是否已领取
	private _bgImage: eui.Image;                                // 背景图片
    private _titleImage: eui.Image;                             // 标题图片
    private _lqButton: eui.Button;                              // 领取按钮
    private _closeButton: eui.Button;                           // 关闭按钮
    private _titleLabel: eui.Label;                             // 标题文本
    private _rewardGroup1: eui.Group;                           // 奖励组1
    private _borderImage1: eui.Image;                           // 边框图片1
    private _rewardImage1: eui.Image;                           // 奖励图片1
    private _vipImage1: eui.Image;                              // VIP图片1
    private _countLabel1: eui.Label;                            // 数量文本1
    private _nameLabel1: eui.Label;                             // 名字文本1
    private _rewardGroup2: eui.Group;                           // 奖励组2
    private _borderImage2: eui.Image;                           // 边框图片2
    private _rewardImage2: eui.Image;                           // 奖励图片2
    private _vipImage2: eui.Image;                              // VIP图片2
    private _countLabel2: eui.Label;                            // 数量文本2
    private _nameLabel2: eui.Label;                             // 名字文本2
}