/**
 * 国庆解锁场景页面
 */
class GuoQingSceneWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/GuoQingSceneSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._button1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this._button2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this._button3.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);
        this._getButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGetButtonClick, this);
	}

    /**
     * 关闭按钮点击响应
     */
    private _OnCloseClick(){
        SoundManager.PlayButtonMusic();
        this.IsVisibled = false;
    }

    /**
     * 按钮点击响应
     */
    private _OnButtonClick(){
        SoundManager.PlayButtonMusic();
		this.IsVisibled = false;
		if (WindowManager.GuoQingActiveWindow() != null){
            this._OpenGuoQingActive();
            return;
        }
        WindowManager.SetWindowFunction(this._OpenGuoQingActive.bind(this));
    }

    /**
     * 打开国庆活动界面
     */
    private _OpenGuoQingActive(){
        WindowManager.GuoQingActiveWindow().IsVisibled = true;
    }

    /**
     * 获得按钮点击响应
     */
    private _OnGetButtonClick(){
        SoundManager.PlayButtonMusic();
        if (!UnitStatusMgr.IsUnlockNinjaScene){
            var mrRole: Role = UnitManager.GetRole(UnitManager.MingRenID);
            var zzRole: Role = UnitManager.GetRole(UnitManager.ZuoZuID);
            var xyRole: Role = UnitManager.GetRole(UnitManager.XiaoYingID);
            var time: number = Math.floor(new Date().getTime()/1000);
            if (time < 1507478400){
                if (!UnitStatusMgr.IsUnlockNinjaScene && mrRole.IsHave && zzRole.IsHave && xyRole.IsHave){
                    NetManager.SendRequest(["func=" + NetNumber.NinjaSceneUnlock], this._ReceiveUnlock.bind(this));
                }
            }
        }
    }

    /**
     * 解锁场景返回
     */
    private _ReceiveUnlock(json: Object){
        var code: number = json["code"];
        if (code != NetManager.SuccessCode){
            var text: string = "";
            if (code == 102){
                text = StringMgr.GetText("guoqinguitext4");
            }
            else if (code = 103){
                text = StringMgr.GetText("guoqinguitext5");
            }
            PromptManager.CreatCenterTip(false, false, text);
            return;
        }
        var imageName: string = "changjinghuode_cj_huoying_png";
        if (WindowManager.RoleGetPage() != null){
            this._ShowGetWinodw([imageName]);
        }
        else{
            WindowManager.SetWindowFunction(this._ShowGetWinodw.bind(this), [imageName]);
        }
    }

    /**
     * 显示获得界面
     */
    private _ShowGetWinodw(params: any[]){
        WindowManager.RoleGetPage().ShowImage(params[0]);
        this.IsVisibled = false;
        // WindowManager.StarWindow().GetNinjaScene();
    }

    /**
     * 更新界面
     */
    private _UpdateShow(){
        var mrRole: Role = UnitManager.GetRole(UnitManager.MingRenID);
        var zzRole: Role = UnitManager.GetRole(UnitManager.ZuoZuID);
        var xyRole: Role = UnitManager.GetRole(UnitManager.XiaoYingID);
        var time: number = Math.floor(new Date().getTime()/1000);
        this._image1.visible = mrRole.IsHave;
        this._button1.visible = !this._image1.visible;
        this._image2.visible = zzRole.IsHave;
        this._button2.visible = !this._image2.visible;
        this._image3.visible = xyRole.IsHave;
        this._button3.visible = !this._image3.visible;
        if (time >= 1507478400){
            this._getButton.enabled = false;
        }
        else {
            if (!UnitStatusMgr.IsUnlockNinjaScene && mrRole.IsHave && zzRole.IsHave && xyRole.IsHave){
                this._getButton.enabled = true;
            }
            else this._getButton.enabled = false;
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

	private _isVisibled: boolean = false;                       // 是否显示
    private _closeButton: eui.Button;                           // 关闭按钮
    private _image1: eui.Image;                                 // 图片1
    private _image2: eui.Image;                                 // 图片2
    private _image3: eui.Image;                                 // 图片3
    private _button1: eui.Button;                               // 按钮1
    private _button2: eui.Button;                               // 按钮2
    private _button3: eui.Button;                               // 按钮3
    private _getButton: eui.Button;                             // 获得按钮
}