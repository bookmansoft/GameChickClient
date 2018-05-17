/**
 * 公告页面
 */
class NoticeDetailPage extends eui.Component{

    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/NoticeDetailPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._neirongLabel.touchEnabled = true;
        this._weihuLabel.touchEnabled = true;
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseDown,this);
        this._weihuButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onWeiHuDown,this);
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        
        this._closeButton.skinName = SkinCreateMgr.CreateButton("anniu_queding_l" + lg + "_png", "anniu_queding_a" + lg + "_png");
        this._nameImage.source = "wenzi_xitongonggao" + lg + "_png";

        if(this._bg){
            this._weihuButton.skinName = SkinCreateMgr.CreateButton("anniu_queding_l" + lg + "_png", "anniu_queding_a" + lg + "_png");
            this._bg.source = "tishi_di" + lg + "_png";
        }
            
        // }
    }

    /**
	 * 点击关闭
	 */
	private onCloseDown(e){
		this.IsVisibled = false;
	}

    /**
     * 点击维护，强制刷新
     */
    private onWeiHuDown(e){
		this.IsVisibled = false;
        document.location.reload();
	}

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.MainTopLayer.addChild(this);
        }
        else{
            Main.MainTopLayer.removeChild(this);
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
     * @param type      显示类型(0更新公告,1挂机公告,2系统公告)
     * @param text      显示文本
	 */
	public Show(type: number, text: string){
        this.IsVisibled = true;
        if (text == null) text = ""

		this._neirongLabel.text = text;
	}

    /**
     * 显示维护公告
     */
    public ShowWeihu(text: string){
        this.IsVisibled = true;
        this._weihuLabel.lineSpacing = 10;
        this._weihuLabel.text = text;
        this.skin.currentState = "weihu";
        this._weihuLabel.height = this._weihuLabel.textHeight;
    }

    /**
     * 显示维护更新公告
     */
    public ShowGenxin(text: string){
        this.IsVisibled = true;
        this._neirongLabel.lineSpacing = 10;
        this._neirongLabel.text = text;
        this.skin.currentState = "genxin";
        this._neirongLabel.height = this._neirongLabel.textHeight;
    }

	// 变量
    private _isVisibled: boolean = false;       				// 是否显示
	private _neirongLabel: eui.Label;							// 公告内容
    private _closeButton: eui.Button;							// 关闭按钮
    private _weihuLabel: eui.Label;                             // 维护文本
    private _weihuButton: eui.Button;                           // 维护按钮
    private _nameImage: eui.Image;
    private _bg: eui.Image;                                     // 维护背景
}