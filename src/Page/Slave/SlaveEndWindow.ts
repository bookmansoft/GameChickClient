/**
 * 奴隶结算界面
 */
class SlaveEndWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/SlaveEndSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        this._okButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._okButton.skinName = SkinCreateMgr.CreateButton("anniu_queding_l" + lg + "_png", "anniu_queding_a" + lg + "_png");
    }

    /**
     * 点击确认按钮响应
     */
    private _OnCloseClick(){
        this.IsVisibled = false;
    }

    /**
     * 显示结算界面
     * @param type      结算类型（1抓捕，2反抗）
     * @param isSucc    是否成功
     */
    public ShowWindow(type: number, isSucc: boolean){
        var res: string = "nulijs_zhuabuchenggong_png";
        this.IsVisibled = true;
        var lg: string = StringMgr.LanguageSuffix;
        if (type == 1) {
            if (isSucc){
                res = "nulijs_zhuabuchenggong" + lg + "_png";
            }
            else {
                res = "nulijs_zhuabushibai" + lg + "_png";
            }
        }
        else if (type == 2) {
            if (isSucc){
                res = "nulijs_taotuochenggong" + lg + "_png";
            }
            else {
                res = "nulijs_taotuoshibai" + lg + "_png";
            }
        }
        this._bgImage.source = res;
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


    // 变量
	private _isVisibled: boolean = false;                       // 是否显示
    private _isCreated: boolean = false;                        // 是否创建完成
    private _bgImage: eui.Image;                                // 背景图片
    private _okButton: eui.Button;                              // 确认按钮
}