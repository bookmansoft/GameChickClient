/**
 * 积分规则提示框
 */
class IntegralRuleWindow extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/IntegralRulePageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseClick,this);
    }

	/**
	 * 显示内容
	 * $der 规则内容
	 */
	public upDataShow($der: string){
		this.IsVisibled = true;
		this._ruleLabel.text = $der;
        this._bg.source = "huodongguize_di" + StringMgr.LanguageSuffix + "_png";
	}

	/**
     * 点击关闭按钮响应
     */
    private onCloseClick(){
        SoundManager.PlayButtonMusic();
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
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	private _isVisibled: boolean = false;                       // 是否显示
	private _ruleLabel: eui.Label;								// 规则内容
	private _closeButton: eui.Button;							// 关闭按钮
    private _bg: eui.Image;                                     // 背景
}