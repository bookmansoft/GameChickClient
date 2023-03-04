/**
 * VIP页面
 */
class FirstChargeWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/FirstChargePageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._buyButton.visible = true;
        this._rewardButton.visible = false;
        this._tipGroup.visible = false;
        this._yujieTip.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._TipBegin, this);
        this._yujieTip.addEventListener(egret.TouchEvent.TOUCH_END, this._TipEnd, this);
        this._giftTip.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._TipBegin, this);
        this._giftTip.addEventListener(egret.TouchEvent.TOUCH_END, this._TipEnd, this);
        this._moneyTip.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._TipBegin, this);
        this._moneyTip.addEventListener(egret.TouchEvent.TOUCH_END, this._TipEnd, this);
        this._buyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBuyClick, this);
        this._rewardButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRewardClcik, this);
        this._InitMovie();
        GameEvent.AddEventListener(EventType.UserStatusChange, this._UpdateButton, this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "shouchong_di" + lg + "_png";
        this._buyButton.skinName = SkinCreateMgr.CreateButton("shouchong_an_lijigoumai_l" + lg + "_png", "shouchong_an_lijigoumai_a" + lg + "_png");
        this._rewardButton.skinName = SkinCreateMgr.CreateButton("shouchong_an_lingqujiangli_l" + lg + "_png", "shouchong_an_lingqujiangli_a" + lg + "_png");
    }

    /**
     * 初始化光效
     */
    private _InitMovie(){
        this._movieSet = [];
        var movieData: egret.MovieClipData = MovieManager.GetMovieClipData("boxmovie_json", "boxmovie_png", "vipyueka_baoxiangtx");
        for (var i = 0; i < 3; i++){
            var movie: egret.MovieClip = new egret.MovieClip(movieData);
            movie.play(-1);
            this.addChild(movie);
            this._movieSet.push(movie);
        }
        this._movieSet[0].x = this._yujieTip.x + this._yujieTip.width / 2 + 2;
        this._movieSet[0].y = this._yujieTip.y + this._yujieTip.height / 2 + 7;
        this._movieSet[1].x = this._giftTip.x + this._giftTip.width / 2 + 2;
        this._movieSet[1].y = this._giftTip.y + this._giftTip.height / 2 + 7;
        this._movieSet[2].x = this._moneyTip.x + this._moneyTip.width / 2 + 2;
        this._movieSet[2].y = this._moneyTip.y + this._moneyTip.height / 2 + 7;
    }

    /**
     * 领奖按钮点击响应
     */
    private _OnRewardClcik(){
        var isFirst: boolean = UnitStatusMgr.IsFirstChargeReward;
        if (isFirst){
            PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext1"));
            return;
        }
        NetManager.SendRequest(["func=" + NetNumber.FirstChargeGift], this._ReceiveReward.bind(this));
    }

    /**
     * 接收每日礼包消息
     */
    private _ReceiveReward(jsonData: Object){
        var code: number = jsonData["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("首充领取返回错误：code=" + code);
            return;
        }
        var data: Object = jsonData["data"];
        var bonus: Object[] = data["bonus"];
        PromptManager.GetBonusResData(bonus, true);
        PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext2"));
        WindowManager.StarWindow().CloseWindow();
    }

    /**
     * Tip开始
     */
    private _TipBegin(event: egret.TouchEvent){
        var des: string = "";
        if (event.currentTarget == this._yujieTip){
            this._tipGroup.x = this._yujieTip.x;
            des = StringMgr.GetText("vippagetext3");
        }
        else if (event.currentTarget == this._giftTip){
            this._tipGroup.x = this._giftTip.x;
            des = StringMgr.GetText("vippagetext4");
        }
        else if (event.currentTarget == this._moneyTip){
            this._tipGroup.x = this._moneyTip.x;
            des = "\n20000" + StringMgr.GetText("rewardtext1");
        }
        this._tipLabel.text = des;
        this._tipGroup.visible = true;
    }

    /**
     * Tip结束
     */
    private _TipEnd(event: egret.TouchEvent){
        this._tipGroup.visible = false;
    }

    /** 
     * 购买按钮点击响应
     */
    private _OnBuyClick(){
        PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext5"), null, this._BuyToken.bind(this));
    }

    /**
     * 购买瓶盖
     */
    private _BuyToken(){
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;
        var shopID: number = Game.IsIos? 14079 : 14071;
        NetManager.SendRequest(["func=" + NetNumber.BuyGold + "&mode=2&itemid=" + shopID + "&count=1"
                            + "&oemInfo=" + JSON.stringify(data)],
                                this._OnBuyVIPCom.bind(this));
    }

	/**
     * 积分购买回调
     */
    private _OnBuyVIPCom(jsonData: Object){
        var code: number = jsonData["data"]["code"];
        var data: Object = jsonData["data"];
        if (jsonData["code"] != NetManager.SuccessCode){
            if (code == 1004){ // 积分不足
                PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext6"), null, this._OnPayClick.bind(this));
            }
        }
        else if (jsonData["code"] == NetManager.SuccessCode){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("vippagetext7"));
            this._buyButton.visible = false;
            this._rewardButton.visible = true;
            WindowManager.StarWindow().CloseWindow();
        }
    }

	/**
     * 确认支付
     */
    private _OnPayClick(){
        // Main.AddDebug("发起支付");
        FBSDKMgr.SetPaySuccess(this._OnPaySuccess.bind(this));
        FBSDKMgr.SetPayError(this._OnPayError.bind(this));
        FBSDKMgr.SetPayClose(this._OnPayClose.bind(this));
        FBSDKMgr.PopPayTips(this._price);
    }

	/**
     * 充值成功回调
     */
    private _OnPaySuccess(){
        // Main.AddDebug("支付成功");
        this._BuyToken();
    }

	/**
     * 重置出错回调
     */
    private _OnPayError(){
        // Main.AddDebug("支付出错误");
        PromptManager.CreatCenterTip(false,true,StringMgr.GetText("shopbuypagetext10"));
    }

	/**
     * 重置关闭回调
     */
    private _OnPayClose(){
        // Main.AddDebug("支付关闭");
         PromptManager.CreatCenterTip(false,true,StringMgr.GetText("shopbuypagetext10"));
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._UpdateButton();
            if (this._movieSet != null){
                for (var i = 0; i < this._movieSet.length; i++){
                    this._movieSet[i].play(-1);
                }
            }
        }
        else{
            Main.Instance.WindowBottomLayer.removeChild(this);
            if (this._movieSet != null){
                for (var i = 0; i < this._movieSet.length; i++){
                    this._movieSet[i].stop();
                }
            }
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

    /**
     * 更新按钮显示
     */
    private _UpdateButton(){
        this._buyButton.visible = !UnitStatusMgr.IsFirstCharge;
        this._rewardButton.visible = !this._buyButton.visible;
    }

    // 变量
    private _bg: eui.Image;                                     // 背景
	private _isVisibled: boolean = false;                       // 是否显示
    private _buyButton: eui.Button;                             // 购买按钮
    private _rewardButton: eui.Button;                          // 领奖按钮
    private _tipGroup: eui.Group;                               // tip容器
    private _tipLabel: eui.Label;                               // tip文本
    private _yujieTip: eui.Image;                               // 御姐tip
    private _giftTip: eui.Image;                                // 礼包tip
    private _moneyTip: eui.Image;                               // 金币tip
    private _price: number = 60;                                // 价格
    private _movieSet: egret.MovieClip[];                       // 光效集合
}