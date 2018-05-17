/**
 * 中间提示框
 */
class CenterPromptPage extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/CenterPromptPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        ProcessManager.AddProcess(this._Process.bind(this));
        CenterPromptPage._instance = this;
        this._noButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnNoButtonClick, this);
        this._shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnNoButtonClick, this);
        this._yesButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnYesButtonClick, this);
        this._daojishiBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnYesButtonClick, this);
        this._daojishiLabel.touchEnabled = false;
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._noButton.skinName = SkinCreateMgr.CreateButton("anniu_quxiao_l" + lg + "_png", "anniu_quxiao_a" + lg + "_png");
        this._yesButton.skinName = SkinCreateMgr.CreateButton("anniu_queding_l" + lg + "_png", "anniu_queding_a" + lg + "_png");
        this._daojishiBtn.skinName = SkinCreateMgr.CreateButton("anniu_queding_time_l" + lg + "_png", "anniu_queding_time_a" + lg + "_png");
        this._shareButton.skinName = SkinCreateMgr.CreateButton("anniu_fenxiang_l" + lg + "_png", "anniu_fenxiang_a" + lg + "_png");
    }

    /**
     * 显示提示框
     * $ifFuHuo 是否是复活的框
     * $ifAuto 是否自动消失
     * $msg 显示文本的内容
     * $ImaRes 图标资源
     * $yesFun yes按钮执行的函数
     * $noFun no按钮执行的函数
     */
    public ShowPrompt($ifFuHuo: boolean = false, $ifAuto: boolean = false, $msg: string = null,
                      $ImaRes = null, $yesFun = null, $noFun = null, $yesParam = null, $noParam = null, $ifShare: boolean = false){
        if (this.IsVisibled){
            this._showParam = [$ifFuHuo, $ifAuto, $msg, $ImaRes, $yesFun, $noFun, $yesParam, $noParam, $ifShare];
            return;
        }
        this.IsVisibled = true;
        this._yesFun = $yesFun;
        this._noFun = $noFun;
        this._yesParam = $yesParam;
        this._noParam = $noParam;
        if($ifFuHuo){
            // this.skin.currentState = "revive";
        }
        else{
            if($ifAuto){
                this.skin.currentState = "auto";

                if($ImaRes!=null){
                    this._iconIma.visible = true;
                    this._iconIma.texture = RES.getRes($ImaRes);
                    this._msgLabel.y = 500;
                }else {
                    this._iconIma.visible = false;
                    this._msgLabel.y = 483;
                }

                this._msgLabel.text = $msg;
                this._closeTime = 3;
                this._daojishiLabel.text = "(" + this._closeTime + ")";
            }
            else{
                if($ifShare){
                    this._shareButton.visible = true;
                    this._noButton.visible = false;
                }else{
                    this._shareButton.visible = false;
                    this._noButton.visible = true;
                }

                this._closeTime = 0;
                this.skin.currentState = "normal";
                this._msgLabel.text = $msg;
            }
        }

    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        if (!this.IsVisibled && this._closeTime != 0) return;
        var time: number = 1000;
        this._timer += frameTime;
        if (this._timer >= time){
            this._timer -= time;
            this._closeTime -= 1;
            if (this._closeTime != 0){
                this._daojishiLabel.text = "(" + this._closeTime + ")";
            }
            else {
                this._OnYesButtonClick();
            }
        }
    }

	/**
     * 点击取消按钮响应
     */
    private _OnNoButtonClick(){
        SoundManager.PlayButtonMusic();
        if(this._noFun != null){
            this._noFun(this._noParam);
            this._noFun = null;
            this._noParam = null;
        }
        this.IsVisibled = false;
    }

	/**
     * 点击确认按钮响应
     */
    private _OnYesButtonClick(){
        SoundManager.PlayButtonMusic();
        if(this._yesFun != null){
            this._yesFun(this._yesParam);
            this._yesFun = null;
            this._yesParam = null;
        }
        this.IsVisibled = false;
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
            if (this._showParam != null){
                this.ShowPrompt(this._showParam[0],this._showParam[1],this._showParam[2],this._showParam[3],
                                this._showParam[4],this._showParam[5],this._showParam[6],this._showParam[7],this._showParam[8]);
                this._showParam = null;
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
     * 游戏实例
     */
    public static get Instance(): CenterPromptPage{return CenterPromptPage._instance;}

    // 变量
    private _isVisibled: boolean = false;           // 是否显示

    private _msgLabel: eui.Label;                   // 内容文本
    private _daojishiLabel: eui.Label;              // 倒计时文本   

    private _noButton: eui.Button;                  // 取消按钮
    private _yesButton: eui.Button;                 // 确定按钮
    private _shareButton: eui.Button;               // 分享按钮
    private _daojishiBtn: eui.Button;               // 自动消失的确定按钮


    private _iconIma: eui.Image;                    // 物品图标

    private _yesFun: Function;                      // 确认函数
    private _noFun: Function;                       // 取消函数
    private _yesParam: any = null;                  // 确认参数
    private _noParam: any = null;                   // 取消参数
    private static _instance: CenterPromptPage;     // 游戏本体

    private _closeTime: number = 0;                 // 关闭时间
    private _timer: number = 0;                     // 计时器

    private _showParam: any[] = null;               // 显示参数
}