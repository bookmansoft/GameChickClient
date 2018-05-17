/**
 * 关卡开始游戏帮助提示框
 */
class CheckpointTip extends AWindow{
    /**
     * 倒计时时间
     */
    private static _Time: number = 5;
    
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/CheckpointTipSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        CheckpointTip._instance = this;
        this._daojishiLabel.touchEnabled = false;
        this._yesButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnYesButtonClick, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._yesButton.skinName = SkinCreateMgr.CreateButton("anniu_jixu_time_l" + lg + "_png" ,"anniu_jixu_time_a" + lg + "_png");
    }

    /**
     * 显示提示框
     * $msg 显示文本的内容
     * $ImaRes 图标资源
     * $yesFun yes按钮执行的函数
     */
    public ShowPrompt($msg: string = "", $ImaRes: string = "", $yesFun = null){

        this.IsVisibled = true;
        this._yesFun = $yesFun;

		this.skin.currentState = "firstTip";
		if($ImaRes!=null){
			this._iconIma.visible = true;
			this._iconIma.texture = RES.getRes($ImaRes);
		}else {
			this._iconIma.visible = false;
		}

		this._msgLabel.text = $msg;

		this._timeOutNum = CheckpointTip._Time;
		this._daojishiLabel.text = "("+this._timeOutNum.toString() + "s)";
		this._timeOutFun = setTimeout(this.TimeOutFun.bind(this),1000);
    }

    /**
     * 倒计时函数
     */
    private TimeOutFun(){
        clearTimeout(this._timeOutFun);
        this._timeOutNum -= 1;
        this._daojishiLabel.text = "("+this._timeOutNum.toString() + "s)";

        if(this._timeOutNum>0)
            this._timeOutFun = setTimeout(this.TimeOutFun.bind(this),1000);
        else
            this._OnYesButtonClick();
    }


	/**
     * 点击确认按钮响应
     */
    private _OnYesButtonClick(){
        this.IsVisibled = false;
        if(this._yesFun != null){
            this._yesFun();
            this._yesFun = null;
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
     * 游戏实例
     */
    public static get Instance(): CheckpointTip{return CheckpointTip._instance;}

    // 变量
    private _isVisibled: boolean = false;           // 是否显示
    private _timeOutFun: number = -1;               // 倒计时函数
    private _timeOutNum: number = 0;                // 倒计时时间

    private _msgLabel: eui.Label;                   // 内容文本
    private _daojishiLabel: eui.Label;              // 倒计时文本   
    private _yesButton: eui.Button;                 // 确定按钮
    private _iconIma: eui.Image;                    // 物品图标
    private _yesFun: Function;                      // 确认函数
    private static _instance: CheckpointTip;                             // 游戏本体
}