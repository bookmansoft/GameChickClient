/**
 * 等待页面
 */
class SlaveHDWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/SlaveHDPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._praiseButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnPraiseClick, this);
        this._lashButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnLashClick, this);
        this._snackButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSnackClick, this);
        this._fawnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnFawnClick, this);
        this._revengeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRevengeClick, this);
        this._addPraiseButton.visible = false;
        this._addRevengeButton.visible = false;
        this._addLashButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAddLashClick, this);
        this._addSnackButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAddSnackClick, this);
        this._addFawnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAddFawnClick, this);

        this._praiseTimeLabel.visible = false;
        this._lashTimeLabel.visible = false;
        this._snackTimeLabel.visible = false;
        this._revengeTimeLabel.visible = false;
        this._fawnTimeLabel.visible = false;

        Facade.instance().watch(this._PraiseReturn.bind(this), NetNumber.SlavePraise);
        Facade.instance().watch(this._LashReturn.bind(this), NetNumber.SlaveLash);
        Facade.instance().watch(this._SnackReturn.bind(this), NetNumber.SlaveFood);
        Facade.instance().watch(this._FawnReturn.bind(this), NetNumber.SlaveFawn);
        Facade.instance().watch(this._RevengeReturn.bind(this), NetNumber.SlaveAvenge);

        GameEvent.AddEventListener(EventType.SlaveHDTimesUpdate, this._UpdateTimes, this);
        GameEvent.AddEventListener(EventType.SlaveItemUpdate, this._UpdateSlaveItemNum, this);
        GameEvent.AddEventListener(EventType.SlaveHDCDChange, this._UpdateCDTime, this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._praiseButton.skinName = SkinCreateMgr.CreateButton("nuli_an_biaoyang_l" + lg + "_png", "nuli_an_biaoyang_a" + lg + "_png");
        this._lashButton.skinName = SkinCreateMgr.CreateButton("nuli_an_zema_l" + lg + "_png", "nuli_an_zema_a" + lg + "_png");
        this._snackButton.skinName = SkinCreateMgr.CreateButton("nuli_an_jiacan_l" + lg + "_png", "nuli_an_jiacan_a" + lg + "_png");
        this._revengeButton.skinName = SkinCreateMgr.CreateButton("nuli_an_baofu_l" + lg + "_png", "nuli_an_baofu_a" + lg + "_png");
        this._fawnButton.skinName = SkinCreateMgr.CreateButton("nuli_an_xianmei_l" + lg + "_png", "nuli_an_xianmei_a" + lg + "_png");
        this.updataCountentIma();
    }

    /**
     * 更新时间
     */
    private _UpdateCDTime(){
        var praiseFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.PraiseType);
        var avengeFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.RevengeType);
        if (praiseFre != null){
            if (praiseFre.CD > 0){
                this._praiseTimeLabel.text = FBSDKMgr.FormatTime(praiseFre.CD);
                this._praiseTimeLabel.visible = true;
            }
            else {
                this._praiseTimeLabel.visible = false;
            }
        }
        else {
            this._praiseTimeLabel.visible = false;
        }
        if (avengeFre != null){
            if (avengeFre.CD > 0){
                this._revengeTimeLabel.text = FBSDKMgr.FormatTime(avengeFre.CD);
                this._revengeTimeLabel.visible = true;
            }
            else {
                this._revengeTimeLabel.visible = false;
            }
        }
        else {
            this._revengeTimeLabel.visible = false;
        }
    }

    /**
     * 购买次数
     * @param type 类型
     */
    private _BuyTimes(type: number){
        var fre: Frequency = FrequencyManager.GetFrequency(type);
        if (fre == null) return;
        var consume: number[] = [10, 20, 50, 80 ,100];
        var buyTime: number = fre.ExtValue;
        var con: number = buyTime >= consume.length? consume[4] : consume[buyTime];
        var fun: Function = null;
        var des: string = "";
        if (type == FrequencyType.LashType){
            fun = this._BuyLashTimes.bind(this);
            des = StringMgr.GetText("slavepagetext6");
        }
        else if (type == FrequencyType.FoodType){
            fun = this._BuySnackTimes.bind(this);
            des = StringMgr.GetText("slavepagetext7");
        }
        else if (type == FrequencyType.FawnType){
            fun = this._BuyFawnTimes.bind(this);
            des = StringMgr.GetText("slavepagetext8");
        }
        if (UnitManager.Player.TestPingGai(con)){
            var text: string = StringMgr.GetText("slavepagetext9");
            text = text.replace("&token", con.toString());
            text = text.replace("&num", des);
            PromptManager.CreatCenterTip(false, false, text, "", fun);
        }
    }

    /**
     * 责骂购买次数点击响应
     */
    private _OnAddLashClick(){
        this._BuyTimes(FrequencyType.LashType);
    }

    /**
     * 购买责骂次数
     */
    private _BuyLashTimes(){
        FrequencyManager.AddShareTime(FrequencyType.LashType.toString());
    }

    /**
     * 加餐购买次数点击响应
     */
    private _OnAddSnackClick(){
        this._BuyTimes(FrequencyType.FoodType);
    }

    /**
     * 购买加餐次数
     */
    private _BuySnackTimes(){
        FrequencyManager.AddShareTime(FrequencyType.FoodType.toString());
    }

    /**
     * 谄媚购买次数点击响应
     */
    private _OnAddFawnClick(){
        this._BuyTimes(FrequencyType.FawnType);
    }

    /**
     * 购买谄媚次数
     */
    private _BuyFawnTimes(){
        FrequencyManager.AddShareTime(FrequencyType.FawnType.toString());
    }

    /**
     * 更新次数文本
     */
    private _UpdateTimes(){
        var praiseFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.PraiseType);
        var lashFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.LashType);
        var foodFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.FoodType);
        var fawnFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.FawnType);
        var avengeFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.RevengeType);
        var level: number = SlaveManager.Level;
        var max: number = 0;
        if (praiseFre != null){
            max = Math.floor(praiseFre.MaxValue * 0.25 * level);
            this._praiseCountLabel.text = Math.max(max + praiseFre.ExtValue - praiseFre.Value, 0) + "/" + (max + praiseFre.ExtValue);
        }
        if (lashFre != null){
            max = Math.floor(lashFre.MaxValue * 0.25 * level);
            this._lashCountLabel.text = Math.max(max + lashFre.ExtValue - lashFre.Value, 0) + "/" + (max + lashFre.ExtValue);
        }
        if (foodFre != null){
            max = Math.floor(foodFre.MaxValue * 0.25 * level);
            this._snackCountLabel.text = Math.max(max + foodFre.ExtValue - foodFre.Value, 0) + "/" + (max + foodFre.ExtValue);
        }
        if (fawnFre != null){
            max = Math.floor(fawnFre.MaxValue * 0.25 * level);
            this._fawnCountLabel.text = Math.max(max + fawnFre.ExtValue - fawnFre.Value, 0) + "/" + (max + fawnFre.ExtValue);
        }
        if (avengeFre != null){
            max = Math.floor(avengeFre.MaxValue * 0.25 * level);
            this._revengeCountLabel.text = Math.max(max + avengeFre.ExtValue - avengeFre.Value, 0) + "/" + (max + avengeFre.ExtValue);
        }
    }
    /**
     * 更新次数文本
     */
    private _UpdateSlaveItemNum(){
        var snackCount: number = Math.min(99, ItemManager.GetItemCount(402));
        this._snackNumLabel.text = snackCount.toString();
        var lashCount: number = Math.min(99, ItemManager.GetItemCount(401));
        this._lashNumLabel.text = lashCount.toString();
        var fawnCount: number = Math.min(99, ItemManager.GetItemCount(403));
        this._fawnNumLabel.text = fawnCount.toString();
    }

    /**
     * 表扬按钮点击响应
     */
    private _OnPraiseClick(){
        SoundManager.PlayButtonMusic();
        var praiseFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.PraiseType);
        if (praiseFre == null) return;
        if (praiseFre.CD > 0){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext12"));
            return;
        }
        var level: number = SlaveManager.Level;
        var max: number = Math.floor(praiseFre.MaxValue * 0.25 * level);
        if (praiseFre.Value >= (max + praiseFre.ExtValue)){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext13"));
            return;
        }
        this._HuDong(NetNumber.SlavePraise, this._slaveOpenid);
    }

    /**
     * 表扬返回
     */
    private _PraiseReturn(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("表扬返回错误,code=" + code);
            return;
        }

        this._contentImageRes = "nulihudong_tu_biaoyang";
        this.updataCountentIma();

        let bonus: Object[] = jsonData["info"]["bonus"];

        let name: string = StringMgr.GetText("slavepagetext14");
        let friend: Friend = FriendManager.GetFriendByID(this._slaveOpenid);
        if (friend != null){
            name = friend.Name;
        }
        if (Game.GameStatus) return;
        PromptManager.SlaveTip(bonus,StringMgr.GetText("slavepagetext15"), name + StringMgr.GetText("slavepagetext16"));
    }

    /**
     * 责骂按钮点击响应
     */
    private _OnLashClick(){
        SoundManager.PlayButtonMusic();
        var lashFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.LashType);
        if (lashFre == null) return;
        var level: number = SlaveManager.Level;
        var max: number = Math.floor(lashFre.MaxValue * 0.25 * level);
        if (lashFre.Value >= (max + lashFre.ExtValue)){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext17"));
            return;
        }
        if (ItemManager.GetItemCount(401) <= 0){
            this._shopID = 4021;
            PromptManager.CreatCenterTip(false, false, StringMgr.GetText("slavepagetext18"), "", this._OnBuyItem.bind(this));
            return;
        }
        var item: Item = ItemManager.GetItemByID(401);
        if (item == null) return;
        var text: string = StringMgr.GetText("slavepagetext19");
        text = text.replace("&item", item.Name);
        PromptManager.CreatCenterTip(false, false, text, "", this._Lash.bind(this));
    }

    /**
     * 责骂
     */
    private _Lash(){
        this._HuDong(NetNumber.SlaveLash, this._slaveOpenid);
    }

    /**
     * 责骂返回
     */
    private _LashReturn(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("责骂返回错误,code=" + code);
            if (code == 501){
                ItemManager.SetItemCount(401, 0);
                this._shopID = 4021;
                PromptManager.CreatCenterTip(false, false, StringMgr.GetText("slavepagetext21"), "", this._OnBuyItem.bind(this));
            }
            return;
        }
        ItemManager.UseItem(401, 1);

        this._contentImageRes = "nulihudong_tu_zema";
        this.updataCountentIma();

        let bonus: Object[] = jsonData["info"]["bonus"];

        let name: string = StringMgr.GetText("slavepagetext14");
        let friend: Friend = FriendManager.GetFriendByID(this._slaveOpenid);
        if (friend != null){
            name = friend.Name;
        }
        if (Game.GameStatus) return;
        var text: string = StringMgr.GetText("slavepagetext23");
        text = text.replace("&slave", name);
        PromptManager.SlaveTip(bonus,StringMgr.GetText("slavepagetext22"), text);
    }

    /**
     * 加餐按钮点击响应
     */
    private _OnSnackClick(){
        SoundManager.PlayButtonMusic();
        var foodFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.FoodType);
        if (foodFre == null) return;
        var level: number = SlaveManager.Level;
        var max: number = Math.floor(foodFre.MaxValue * 0.25 * level);
        if (foodFre.Value >= (max + foodFre.ExtValue)){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext17"));
            return;
        }
        if (ItemManager.GetItemCount(402) <= 0){
            this._shopID = 4022;
            PromptManager.CreatCenterTip(false, false, StringMgr.GetText("slavepagetext25"), this._OnBuyItem.bind(this));
            return;
        }
        var item: Item = ItemManager.GetItemByID(402);
        if (item == null) return;
        var text: string = StringMgr.GetText("slavepagetext26");
        text = text.replace("&item", item.Name);
        PromptManager.CreatCenterTip(false, false, text, "", this._Snack.bind(this));
    }

    /**
     * 加餐
     */
    private _Snack(){
        this._HuDong(NetNumber.SlaveFood, this._slaveOpenid);
    }

    /**
     * 加餐返回
     */
    private _SnackReturn(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("加餐返回错误,code=" + code);
            if (code == 501){
                ItemManager.SetItemCount(402, 0);
                this._shopID = 4022;
                PromptManager.CreatCenterTip(false, false, StringMgr.GetText("slavepagetext25"), "", this._OnBuyItem.bind(this));
            }
            return;
        }
        ItemManager.UseItem(402, 1);

        this._contentImageRes = "nulihudong_tu_jiacan";
        this.updataCountentIma();

        let bonus: Object[] = jsonData["info"]["bonus"];

        let name: string = StringMgr.GetText("slavepagetext14");
        let friend: Friend = FriendManager.GetFriendByID(this._slaveOpenid);
        if (friend != null){
            name = friend.Name;
        }
        if (Game.GameStatus) return;
        PromptManager.SlaveTip(bonus,StringMgr.GetText("slavepagetext28"), StringMgr.GetText("slavepagetext29") + name);
    }

    /**
     * 谄媚按钮点击响应
     */
    private _OnFawnClick(){
        SoundManager.PlayButtonMusic();
        var fawnFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.FawnType);
        if (fawnFre == null) return;
        var level: number = SlaveManager.Level;
        var max: number = Math.floor(fawnFre.MaxValue * 0.25 * level);
        if (fawnFre.Value >= (max + fawnFre.ExtValue)){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext17"));
            return;
        }
        if (ItemManager.GetItemCount(403) <= 0){
            this._shopID = 4023;
            PromptManager.CreatCenterTip(false, false, StringMgr.GetText("slavepagetext21"), "", this._OnBuyItem.bind(this));
            return;
        }
        var item: Item = ItemManager.GetItemByID(403);
        if (item == null) return;
        var text: string = StringMgr.GetText("slavepagetext26");
        text = text.replace("&item", item.Name);
        PromptManager.CreatCenterTip(false, false, text, "", this._Fawn.bind(this));
    }

    /**
     * 谄媚
     */
    private _Fawn(){
        var master: Object = SlaveManager.Master;
        if (master == null) return;
        this._HuDong(NetNumber.SlaveFawn, master["openid"]);
    }

    /**
     * 谄媚返回
     */
    private _FawnReturn(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("谄媚返回错误,code=" + code);
            if (code == 501){
                ItemManager.SetItemCount(403, 0);
                this._shopID = 4023;
                PromptManager.CreatCenterTip(false, false, StringMgr.GetText("slavepagetext21"), "", this._OnBuyItem.bind(this));
            }
            return;
        }
        ItemManager.UseItem(403, 1);

        this._contentImageRes = "nulihudong_tu_xianmei";
        this.updataCountentIma();

        let bonus: Object[] = jsonData["info"]["bonus"];

        let name: string = "";
        if (SlaveManager.Master != null){
            var friend: Friend = FriendManager.GetFriendByID(SlaveManager.Master["openid"]);
        }
        if (friend != null){
            name = friend.Name;
        }
        if (Game.GameStatus) return;
        var text: string = StringMgr.GetText("slavepagetext31");
        text = text.replace("&master", name);
        PromptManager.SlaveTip(bonus,StringMgr.GetText("slavepagetext30"),text);
    }

    /**
     * 报复按钮点击响应
     */
    private _OnRevengeClick(){
        SoundManager.PlayButtonMusic();
        var avengeFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.RevengeType);
        if (avengeFre == null) return;
        if (avengeFre.CD > 0){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext12"));
            return;
        }
        var level: number = SlaveManager.Level;
        var max: number = Math.floor(avengeFre.MaxValue * 0.25 * level);
        if (avengeFre.Value >= (max + avengeFre.ExtValue)){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext13"));
            return;
        }
        var master: Object = SlaveManager.Master;
        if (master == null) return;
        this._HuDong(NetNumber.SlaveAvenge, master["openid"]);
    }

    /**
     * 报复返回
     */
    private _RevengeReturn(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var code: number = jsonData["info"]["code"];
        if (code != NetManager.SuccessCode){
            Main.AddDebug("报复返回错误,code=" + code);
            return;
        }

        this._contentImageRes = "nulihudong_tu_baofu";
        this.updataCountentIma();

        var bonus: Object[] = jsonData["info"]["bonus"];
        let name: string = "";
        if (SlaveManager.Master != null){
            var friend: Friend = FriendManager.GetFriendByID(SlaveManager.Master["openid"]);
        }
        if (friend != null){
            name = friend.Name;
        }
        if (Game.GameStatus) return;
        var text: string = StringMgr.GetText("slavepagetext34");
        text = text.replace("&master", name);
        PromptManager.SlaveTip(bonus,StringMgr.GetText("slavepagetext33"), text);
    }

    /**
     * 互动
     */
    private _HuDong(type: string, openid: string){
        WindowManager.WaitPage().IsVisibled = true;
        NetManager.SendRequest(["func=" + NetNumber.SendHello, "&actionType=" + type,
                                "&openid=" + openid]);
    }

    /**
     * 责骂道具不足提示确认点击
     */
    private _OnBuyItem(){
        let _testIfZuGou: boolean = false;
        if(this._shopID == 4021){
            _testIfZuGou = UnitManager.Player.TestMoney(1000);
        }
        else if(this._shopID == 4022){
            _testIfZuGou = UnitManager.Player.TestPingGai(20);
        }
        else if(this._shopID == 4023){
            _testIfZuGou = UnitManager.Player.TestMoney(1000);
        }
        
        if (_testIfZuGou){
            var data : JSON = JSON.parse("{}");
            data["token"] = UnitManager.Player.GameToken;
            NetManager.SendRequest(["func=" + NetNumber.BuyItem + "&id=" + this._shopID + "&num=1"
                                + "&oemInfo=" + JSON.stringify(data)],
                                    this._OnBuyItemReturn.bind(this));
        }
    }

    /**
     * 购买互动道具返回
     */
    private _OnBuyItemReturn(jsonData: Object){
        var code: number = jsonData["code"];
        if (code != NetManager.SuccessCode){
            if (code == 9009){
                PromptManager.CreatCenterTip(false, true, StringMgr.GetText("commontext1"));
            }
            return;
        }
        if (this._shopID == 4021){
            ItemManager.AddItem(401, 1);
            this._HuDong(NetNumber.SlaveLash, this._slaveOpenid);
        }
        else if (this._shopID == 4022){
            ItemManager.AddItem(402, 1);
            this._HuDong(NetNumber.SlaveFood, this._slaveOpenid);
        }
        else if (this._shopID == 4023){
            ItemManager.AddItem(402, 1);
            var master: Object = SlaveManager.Master;
            if (master == null) return;
            this._HuDong(NetNumber.SlaveFawn, master["openid"]);
        }
    }

    /**
     * 关闭按钮点击响应
     */
    private _OnCloseClick(){
        this.IsVisibled = false;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
            this._UpdateTimes();
            this._UpdateCDTime();
            this._UpdateSlaveItemNum();
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

    /**
     * 显示
     * @param isMaster          是否是奴隶主
     * @param slaveOpenid       奴隶openid
     */
    public Show(isMaster: boolean, slaveOpenid: string = ""){
        this.IsVisibled = true;
        this._slaveOpenid = slaveOpenid;
        if (isMaster){
            this._masterGroup.visible = true;
            this._slaveGroup.visible = false;
        }
        else {
            this._masterGroup.visible = false;
            this._slaveGroup.visible = true;
        }
    }

    /**
     * 更新显示内容
     */
    private updataCountentIma(){
        let lg: string = StringMgr.LanguageSuffix;
        if(this._contentImageRes){
            let res = this._contentImageRes + "_png";
            if(RES.getRes(this._contentImageRes + lg + "_png")){
                res = this._contentImageRes + lg + "_png";
            }
            this._contentImage.source = res;
        }
    }


    // 变量
	private _isVisibled: boolean = false;                       // 是否显示
    private _isCreated: boolean = false;                        // 是否创建完成
    private _closeButton: eui.Button;                           // 关闭按钮
    private _contentImage: eui.Image;                           // 内容图片
    private _masterGroup: eui.Group;                            // 奴隶主容器
    private _praiseButton: eui.Button;                          // 表扬按钮
    private _lashButton: eui.Button;                            // 责骂按钮
    private _snackButton: eui.Button;                           // 加餐按钮
    private _praiseCountLabel: eui.BitmapLabel;                 // 表扬次数文本
    private _lashCountLabel: eui.BitmapLabel;                   // 责骂次数文本
    private _snackCountLabel: eui.BitmapLabel;                  // 加餐次数文本
    private _praiseTimeLabel: eui.BitmapLabel;                  // 表扬倒计时文本
    private _lashTimeLabel: eui.BitmapLabel;                    // 责骂倒计时文本
    private _snackTimeLabel: eui.BitmapLabel;                   // 加餐倒计时文本
    private _slaveGroup: eui.Group;                             // 奴隶容器
    private _fawnButton: eui.Button;                            // 谄媚按钮
    private _revengeButton: eui.Button;                         // 报复按钮
    private _fawnCountLabel: eui.BitmapLabel;                   // 谄媚次数文本
    private _revengeCountLabel: eui.BitmapLabel;                // 报复次数文本
    private _fawnTimeLabel: eui.BitmapLabel;                    // 谄媚倒计时文本
    private _revengeTimeLabel: eui.BitmapLabel;                 // 报复倒计时文本
    private _addPraiseButton: eui.Button;                       // 表扬次数增加按钮
    private _addLashButton: eui.Button;                         // 责骂次数增加按钮
    private _addSnackButton: eui.Button;                        // 加餐次数增加按钮
    private _addFawnButton: eui.Button;                         // 谄媚次数增加按钮
    private _addRevengeButton: eui.Button;                      // 复仇次数增加按钮

    private _slaveOpenid: string;                               // 奴隶openid

    private _lashNumLabel: eui.Label;                           // 责骂道具数量
    private _snackNumLabel: eui.Label;                          // 加餐道具数量
    private _fawnNumLabel: eui.Label;                           // 谄媚道具数量
    private _shopID: number = 0;                                // 商品ID

    private _contentImageRes: string = "nulihudong_tu_biaoyang";                           // 内容图片
}