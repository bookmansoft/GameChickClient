/**
 * 国庆活动页面
 */
class GuoQingActiveWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/GuoQingSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._button1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick1, this);
        this._button2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick2, this);
        this._image1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnenRoleDetail, this);
        this._image2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnenRoleDetail, this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        this._textLabel.text = StringMgr.GetText("guoqinguitext1");
    }

    /**
     * 关闭按钮点击响应
     */
    private _OnCloseClick(){
        SoundManager.PlayButtonMusic();
        this.IsVisibled = false;
    }

    /**
     * 打卡角色详情
     */
    private _OnenRoleDetail(e: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        let _curDetail = WindowManager.RoleDetailWindow();
        let _curRole = e.target == this._image1? UnitManager.GetRole(UnitManager.ZuoZuID):UnitManager.GetRole(UnitManager.XiaoYingID);
		_curDetail.UpdataShow(_curRole);
		_curDetail.IsVisibled = true;
    }

    /**
     * 佐助按钮点击
     */
    private _OnButtonClick1(){
        SoundManager.PlayButtonMusic();
        var mrRole: Role = UnitManager.GetRole(UnitManager.MingRenID);
        var zzRole: Role = UnitManager.GetRole(UnitManager.ZuoZuID);
        if (mrRole. Level >= 3 && !zzRole.IsHave){
            NetManager.SendRequest(["func=" + NetNumber.ActiveBonus + "&type=3"], this._ReceiveActiveBonus.bind(this));
        }
    }

    /**
     * 小樱按钮点击
     */
    private _OnButtonClick2(){
        SoundManager.PlayButtonMusic();
        var xyRole: Role = UnitManager.GetRole(UnitManager.XiaoYingID);
        var value: number = ActiveManager.GuoQingValue;
        if (!xyRole.IsHave && value >= 100){
            NetManager.SendRequest(["func=" + NetNumber.ActiveBonus + "&type=2"], this._ReceiveActiveBonus.bind(this));
        }
    }

    /**
     * 领取活动奖励返回
     */
    private _ReceiveActiveBonus(json: Object){
        var code: number = json["code"];
        if (code == NetManager.SuccessCode){
            if (json["data"] != null && json["data"]["bonus"] != null){
                var text: string = StringMgr.GetText("guoqinguitext2");
                if (WindowManager.ActiveBonusWindow() != null){
                    this._ShowActiveGift([text, json["data"]["bonus"]]);
                }
                else {
                    WindowManager.SetWindowFunction(this._ShowActiveGift, [text, json["data"]["bonus"]], WindowManager.ActiveBonusWindow);
                }
            }
        }
    }

    /**
     * 显示活动奖励
     */
    private _ShowActiveGift(params: any[]){
        WindowManager.ActiveBonusWindow().Show(params[0], params[1]);
        WindowManager.GuoQingActiveWindow()._UpdateShow();
    }

    /**
     * 更新显示
     */
    public _UpdateShow(){
        var mrRole: Role = UnitManager.GetRole(UnitManager.MingRenID);
        var zzRole: Role = UnitManager.GetRole(UnitManager.ZuoZuID);
        var xyRole: Role = UnitManager.GetRole(UnitManager.XiaoYingID);
        var value: number = ActiveManager.GuoQingValue;
        var text: string = StringMgr.GetText("guoqinguitext3");
        this._label1.text = text + mrRole.Level + "/3";
        this._label2.text = text + value + "/100RMB";
        var time: number = UnitManager.FuwuduanTime;
        if (time >= 1507478400){
            this._button1.enabled = false;
            this._button1.visible = true;
            this._button2.enabled = false;
            this._button2.visible = true;
            this._getImage1.visible = false;
            this._getImage2.visible = false;
        }
        else if (time < 1506787200){
            this._button1.enabled = false;
            this._button1.visible = true;
            this._button2.enabled = false;
            this._button2.visible = true;
            this._getImage1.visible = false;
            this._getImage2.visible = false;
        }
        else {
            if (zzRole != null){
                if (!zzRole.IsHave && mrRole.Level >= 3){
                    this._button1.enabled = true;
                    this._button1.visible = true;
                    this._getImage1.visible = false;
                    if(ItemManager.GetItemCount(zzRole.Pieceid) >= 10){
                        this._button1.enabled = false;
                        this._button1.visible = false;
                        this._getImage1.visible = true;
                    }
                }
                else if (mrRole.Level < 3){
                    this._button1.enabled = false;
                    this._button1.visible = true;
                    this._getImage1.visible = false;
                }
                else{
                    this._button1.enabled = false;
                    this._button1.visible = false;
                    this._getImage1.visible = true;
                }
            }
            if (xyRole != null){
                if (!xyRole.IsHave && value >= 100){
                    this._button2.enabled = true;
                    this._button2.visible = true;
                    this._getImage2.visible = false;
                    if(ItemManager.GetItemCount(xyRole.Pieceid) >= 10){
                        this._button2.enabled = false;
                        this._button2.visible = false;
                        this._getImage2.visible = true;
                    }
                }
                else if (value < 100){
                    this._button2.enabled = false;
                    this._button2.visible = true;
                    this._getImage2.visible = false;
                }
                else {
                    this._button2.enabled = false;
                    this._button2.visible = false;
                    this._getImage2.visible = true;
                }
            }
        }
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
            this._UpdateShow();
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

    // 变量
	private _isVisibled: boolean = false;                       // 是否显示
    private _closeButton: eui.Button;                           // 关闭按钮
    private _image1: eui.Image;                                 // 图片1
    private _image2: eui.Image;                                 // 图片2
    private _button1: eui.Button;                               // 按钮1
    private _button2: eui.Button;                               // 按钮2
    private _label1: eui.Label;                                 // 文本1
    private _label2: eui.Label;                                 // 文本2
    private _getImage1: eui.Image;                              // 已获得图片1
    private _getImage2: eui.Image;                              // 已获得图片2
    private _textLabel: eui.Label;
}