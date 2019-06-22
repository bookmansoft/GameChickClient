/**
 * 结束咖啡界面
 */
class ReviveWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RevivePageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._noButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnNoButtonClick, this);
        this._yesButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnYesButtonClick, this);

        GameEvent.AddEventListener(EventType.ReviveItemUpdate, this._UpdateItemCount, this);
        this._UpdateItemCount();
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._textLabel1.text = StringMgr.GetText("revivepagetext1");
        this._textLabel2.text = StringMgr.GetText("revivepagetext2");
        this._yesButton.skinName = SkinCreateMgr.CreateButton("anniu_kaishi_l" + lg + "_png", "anniu_kaishi_a" + lg + "_png");
        this._noButton.skinName = SkinCreateMgr.CreateButton("anniu_quxiao_l" + lg + "_png", "anniu_quxiao_a" + lg + "_png");
    }

	/**
     * 点击取消按钮响应
     */
    private _OnNoButtonClick(){
        this.IsVisibled = false;
        GameEvent.DispatchEvent(EventType.GameEnd);
        // WindowManager.EndWindow.Show();
    }

	/**
     * 点击确认按钮响应
     */
    private _OnYesButtonClick(){
        if (ItemManager.GetItemCount(ItemManager.ReviveItemID) <= 0){
            var fre: Frequency = FrequencyManager.GetFrequency(FrequencyType.DieShareType);
            if (fre == null){
                Main.AddDebug("获取不到次数信息，type=" + FrequencyType.DieShareType);
                return;
            }
            var maxTime: number = fre.MaxValue + fre.ExtValue;
            var time: number = fre.Value;
            time = maxTime - time;
            if (time > 0){
                var text: string = time + "/" + maxTime;
                
                var des: string = StringMgr.GetText("revivepagetext3").replace("&num", text);
                PromptManager.CreatCenterTip(false,false,des,null,
                                            this._OnShareTipYes.bind(this), this._OnShareTipNo.bind(this));
            }
            else{
                this.IsVisibled = false;
                PromptManager.CreatCenterTip(false,false,StringMgr.GetText("revivepagetext5"),null,
                                            function(){GameEvent.DispatchEvent(EventType.GameEnd);},
                                            function(){GameEvent.DispatchEvent(EventType.GameEnd);});
            }
            return;
        }
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;
        NetManager.SendRequest(["func=" + NetNumber.UseItem + "&id=" + ItemManager.ReviveItemID + "&num=1"
                                 + "&oemInfo=" + JSON.stringify(data)],
                                 this._UseReviveItemCom.bind(this));
    }

	/**
     * 分享提示No
     */
    private _OnShareTipNo(){
        this.IsVisibled = false;
        GameEvent.DispatchEvent(EventType.GameEnd);
    }

	/**
     * 分享提示Yes
     */
    private _OnShareTipYes(){
        if (Main.IsLocationDebug){
            this._ShareTask();
        }
        else{
            var textSet: string[] = GameConstData.ShareContent;
            if (textSet.length == 2){
                window["shareCont"] = FBSDKMgr.Share(textSet[0], textSet[1]);
                window["share"]();
                // FBSDKMgr.Share(textSet[0], textSet[1]);
            }
            else{
                window["shareCont"] = FBSDKMgr.Share();
                window["share"]();
                // FBSDKMgr.Share();
            }
            this._ShareTask();
        }
    }

    /**
     * 分享任务
     */
    private _ShareTask(){
        NetManager.SendRequest(["func=" + NetNumber.ShareEnd + "&type=" + UnitManager.DieShareType],
                            this._OnShareTaskReturn.bind(this));
    }

    /**
     * 分享任务完成返回
     */
    private _OnShareTaskReturn(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("分享任务返回错误，错误码：" + jsonData["code"]);
            return;
        }
        let items = jsonData["data"]["items"];
        Object.keys(items).map(function(key){
            ItemManager.SetItemCount(parseInt(key), items[key]["num"]);
        });
        if (WindowManager.GetItemTip() == null){
            WindowManager.SetWindowFunction(this._OpenGetItemTip.bind(this));
        }
        else{
            this._OpenGetItemTip();
        }
    }

    /**
     * 显示物品提示框
     */
    private _OpenGetItemTip(){
        WindowManager.GetItemTip().IsVisibled = true;
    }

	/**
     * 使用道具返回
     */
    private _UseReviveItemCom(jsonData: Object){
        if (jsonData["code"] == NetManager.SuccessCode){
            this.IsVisibled = false;
            ItemManager.UseItem(ItemManager.ReviveItemID, 1);
            if (UnitManager.CurrentRole != null){
                // UnitManager.CurrentRole.CurrentLife = Math.floor(UnitManager.CurrentRole.MaxLife * 0.3);
                WindowManager.GameUI().BuckleBlood(-Math.floor(UnitManager.CurrentRole.MaxLife * 0.3))
            }
            Game.Instance.GameRevive();
        }
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.GameLayer.addChild(this);
        }
        else{
            Main.Instance.GameLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
     * 更新物品数量
     */
    private _UpdateItemCount(){
        this._countLabel.text = ItemManager.GetItemCount(ItemManager.ReviveItemID).toString();
    }

    // 变量
    private _isVisibled: boolean = false;           // 是否显示
    private _countLabel: eui.BitmapLabel;           // 数量文本
    private _noButton: eui.Button;                  // 取消按钮
    private _yesButton: eui.Button;                 // 确定按钮
    private _textLabel1: eui.Label;
    private _textLabel2: eui.Label;
}