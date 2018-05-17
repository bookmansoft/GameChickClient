/**
 * 收藏有礼界面
 */
class KeepRewardTip extends AWindow{
	public constructor() {
		super();
		this.skinName = "resource/game_skins/KeepRewardTipSkins.exml";
	}

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._addButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        this.AddShouCangGuide2();
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "shoucang_di" + lg + "_png";
        this._addButton.skinName = SkinCreateMgr.CreateButton("shoucang_an_liji_l" + lg + "_png", "shoucang_an_liji_a" + lg + "_png");
    }

	private onTap(e){
		// FBSDKMgr.AddShortcut();
		this.IsVisibled = false;
		GuideManager.GuideFinish(8);
	}

    /**
     * 收藏按钮引导
     */
    public AddShouCangGuide2(){
        var x: number = this._addButton.x;
        var y: number = this._addButton.y;
        var width: number = this._addButton.width;
        var height: number = this._addButton.height;
        GuideManager.ShowGuideWindow(0, x, y, width, height);
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

    private _bg: eui.Image;                                     // 背景
	private _addButton: eui.Button;								// 添加按钮
	private _isVisibled: boolean = false;                       // 是否显示
}