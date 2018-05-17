/**
 * 商店购买提示
 */
class GetItemTip extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/GetItemTipSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._timeLabel.touchEnabled = false;
        this._button.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        ProcessManager.AddProcess(this._Process.bind(this));
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "huodedaoju" + lg + "_png";
        this._button.skinName = SkinCreateMgr.CreateButton("anniu_queding_time_l" + lg + "_png", "anniu_queding_time_a" + lg + "_png");
    }

	/**
     * 点击响应
     */
    private _OnClick(){
        this.IsVisibled = false;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        if (value){
            var tw = egret.Tween.get(this);
            tw.wait(3000).call(this._OnAdd.bind(this));
        }
        else{
            Main.Instance.WindowTopLayer.removeChild(this);
            this._isVisibled = value;
        }
    }

	/**
     * 添加界面
     */
    private _OnAdd(){
        egret.Tween.removeTweens(this);
        this._isVisibled = true;
        Main.Instance.WindowTopLayer.addChild(this);
        this._closeTime = 3;
        this._timer = 0;
        this._timeLabel.text = "(" + this._closeTime + ")";
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
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
                this._timeLabel.text = "(" + this._closeTime + ")";
            }
            else {
                this.IsVisibled = false;
            }
        }
    }

    // 变量
    private _isVisibled: boolean = false;                       // 是否显示
    private _bg: eui.Image;                                     // 背景图片
    private _timeLabel: eui.Label;                              // 时间文本
    private _button: eui.Button;                                // 确认按钮
    private _closeTime: number = 0;                             // 关闭时间
    private _timer: number = 0;                                 // 计时器
}