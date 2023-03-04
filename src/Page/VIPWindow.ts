/**
 * VIP页面
 */
class VIPWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/VIPPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this.updateButton();
        this._buyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBuyClick, this);
        this._rewardButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRewardClcik, this);
        this._giftTip.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._TipBegin, this);
        this._giftTip.addEventListener(egret.TouchEvent.TOUCH_END, this._TipEnd, this);
        GameEvent.AddEventListener(EventType.VIPTimeUpdate, this._UpdateTime, this);
        GameEvent.AddEventListener(EventType.VIPRewardTimesChange, this._UpdateMovie, this);
        this._vipGroup.visible = false;
        this._tipGroup.visible = false;
        this._UpdateTime();
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "vipyueka_di" + lg + "_png";
        this._buyButton.skinName = SkinCreateMgr.CreateButton("vipyueka_an_goumaiyueka_l" + lg + "_png", "vipyueka_an_goumaiyueka_a" + lg + "_png");
        this._rewardButton.skinName = SkinCreateMgr.CreateButton("vipyueka_an_dianjilingqu_l" + lg + "_png", "vipyueka_an_dianjilingqu_a" + lg + "_png");
        if (StringMgr.Language == StringMgr.CN){
            this._tipLabel.text = "爱的鞭子*3\n过期蛋糕*3\n小丑面具*3";
            this._noRewardText.text = "明日可领取";
        }
        else if (StringMgr.Language == StringMgr.EN){
            this._tipLabel.text = "Whip of Love*3\nExpired Cake*3\nClown Mask*3";
            this._noRewardText.text = "Can receive tomorrow";
        }
    }

    /**
     * Tip开始
     */
    private _TipBegin(){
        this._tipGroup.visible = true;
    }

    /**
     * Tip结束
     */
    private _TipEnd(){
        this._tipGroup.visible = false;
    }

    /**
     * 领奖按钮点击响应
     */
    private _OnRewardClcik(){
        var fre: Frequency = FrequencyManager.GetFrequency(FrequencyType.VipDaily);
        if (fre != null && fre.Value >= fre.MaxValue){
            PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext8"));
            return;
        }
        NetManager.SendRequest(["func=" + NetNumber.VipDayGift], this._ReceiveDayGift.bind(this));
    }

    /**
     * 接收每日礼包消息
     */
    private _ReceiveDayGift(jsonData: Object){
        var code: number = jsonData["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("Vip每日领取返回错误：code=" + code);
            return;
        }
        var data: Object = jsonData["data"];
        var bonus: Object[] = data["bonus"];
        PromptManager.GetBonusResData(bonus, true);
        PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext9"));
        this.updateButton();
    }

    /** 
     * 购买按钮点击响应
     */
    private _OnBuyClick(){
        PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext10"), null, this._BuyVIP.bind(this));
    }

    /**
     * 购买VIP
     */
    private _BuyVIP(){
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;
        var shopID: number = Game.IsIos? 13161 : 13160;
        NetManager.SendRequest(["func=" + NetNumber.BuyGold + "&mode=2&itemid=" + shopID + "&count=1"
                            + "&oemInfo=" + JSON.stringify(data)],
                                this._OnBuyVIPCom.bind(this));
    }

	/**
     * 积分购买回调
     */
    private _OnBuyVIPCom(jsonData: Object){
        var code: number = jsonData["code"];
        var data: Object = jsonData["data"];
        if (jsonData["code"] != NetManager.SuccessCode){
            if (code == 1004){ // 积分不足
                PromptManager.CreatCenterTip(false, false, StringMgr.GetText("vippagetext6"), null, this._OnPayClick.bind(this));
            }
        }
        else if (jsonData["code"] == NetManager.SuccessCode){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("vippagetext11"));
            var bonus: string = jsonData["data"]["bonus"];
            if (bonus != null){
                var strSet: string[] = bonus.split(",");
                if (strSet[0] == "V"){
                    var day: number = parseInt(strSet[1]);
                    var time: number = day * 24 * 60 * 60;
                    UnitManager.Player.VIPTime += time;
                }
            }
            this._UpdateMovie();
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
        this._BuyVIP();
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
     * 更新时间
     */
    private _UpdateTime(){
        if (!this.IsVisibled) return;
        var time: number = UnitManager.Player.VIPTime;
        if (time == 0) return;
        var d: number = Math.floor(time / (3600 * 24));
        var h: number = Math.floor(time / 3600 % 24);
        var m: number = Math.floor((time % 3600) / 60);
        var s: number = time % 60;
        var hStr: string = h < 10? "0" + h.toString() : h.toString();
        var mStr: string = m < 10? "0" + m.toString() : m.toString();
        var sStr: string = s < 10? "0" + s.toString() : s.toString();
        this._dayLabel.text = d.toString();
        this._hourLabel.text = hStr;
        this._minLabel.text = mStr;
    }

    /**
     * 更新光效
     */
    private _UpdateMovie(){
        var isVip: boolean = UnitManager.Player.IsVIP;
        this._buyButton.visible = !isVip;
        this._rewardButton.visible = isVip;
        this._vipGroup.visible = isVip;
        if (isVip && this._vipMovieSet == null){
            this._vipMovieSet = [];
            var movieData: egret.MovieClipData = MovieManager.GetMovieClipData("vipmovie_json", "vipmovie_png", "vipyueka_quangyiytx");
            var movieX: number = 40;
            var MovieY: number = 40;
            for (var i = 0; i < 6; i++){
                var movie: egret.MovieClip = new egret.MovieClip(movieData);
                movie.x = movieX + (i % 2) * 252;
                movie.y = MovieY + Math.floor(i / 2) * 90;
                movie.play(-1);
                this._vipGroup.addChild(movie);
                this._vipMovieSet.push(movie);
            }
        }
        else if (!isVip && this._vipMovieSet != null && this._vipMovieSet.length > 0){
            for (var i = 0; i < this._vipMovieSet.length; i++){
                this._vipMovieSet[i].stop();
                this._vipGroup.removeChild(this._vipMovieSet[i]);
            }
            this._vipMovieSet = null;
        }
        var fre: Frequency = FrequencyManager.GetFrequency(FrequencyType.VipDaily);
        if (fre.Value < fre.MaxValue && this._rewardMovie == null){
            var movieData: egret.MovieClipData = MovieManager.GetMovieClipData("boxmovie_json", "boxmovie_png", "vipyueka_baoxiangtx");
            this._rewardMovie = new egret.MovieClip(movieData);
            this._rewardMovie.x = this._giftTip.x + this._giftTip.width / 2;
            this._rewardMovie.y = this._giftTip.y + this._giftTip.height / 2 + 3;
            this._rewardMovie.play(-1);
            this.addChild(this._rewardMovie);
        }
        else if (fre.Value >= fre.MaxValue && this._rewardMovie != null && this.contains(this._rewardMovie)){
            this._rewardMovie.stop();
            this.removeChild(this._rewardMovie);
            this._rewardMovie = null;
        }
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            if (this._vipMovieSet != null){
                for (var i = 0; i < this._vipMovieSet.length; i++){
                    this._vipMovieSet[i].play(-1);
                }
            }
            if (this._rewardMovie != null){
                this._rewardMovie.play(-1);
            }
            this._UpdateMovie();
            this.updateButton();
        }
        else{
            Main.Instance.WindowBottomLayer.removeChild(this);
            if (this._vipMovieSet != null){
                for (var i = 0; i < this._vipMovieSet.length; i++){
                    this._vipMovieSet[i].stop();
                }
            }
            if (this._rewardMovie != null){
                this._rewardMovie.stop();
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
     * 更新每日领奖按钮页面
     */
    private updateButton(){
        var fre: Frequency = FrequencyManager.GetFrequency(FrequencyType.VipDaily);
        if (fre != null && fre.Value >= fre.MaxValue){
            this._rewardButton.visible = false;
            this._noRewardText.visible = true;
            this._giftTip.filters = [FilterManage.HuiDu];
        }
        else{
            this._rewardButton.visible = UnitManager.Player.IsVIP;
            this._giftTip.filters = [];
            this._noRewardText.visible = false;
        }
    }

    // 变量
    private _bg: eui.Image;                                     // 背景图片
	private _isVisibled: boolean = false;                       // 是否显示
    private _buyButton: eui.Button;                             // 购买按钮
    private _dayLabel: eui.Label;                               // 天数文本
    private _hourLabel: eui.Label;                              // 小时文本
    private _minLabel: eui.Label;                               // 分钟文本
    private _rewardButton: eui.Button;                          // 领奖按钮
    private _vipGroup: eui.Group;                               // 对勾容器
    private _tipGroup: eui.Group;                               // tip容器
    private _giftTip: eui.Image;                                // 奖励图片
    private _price: number = 100;                               // 购买VIP消耗积分
    private _vipMovieSet: egret.MovieClip[];                    // VIP光效集合
    private _rewardMovie: egret.MovieClip;                      // 奖励光效
    private _noRewardText: eui.Label;                           // 明日领奖文本
    private _tipLabel: eui.Label;
}