/**
 * 设置界面
 */
class SetWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/SetWindowSkin.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._lgGroup.visible = false;
        this._musicGroup.visible = false;
        // this._cnImage.alpha = 1;
        // this._enImage.alpha = 0;
        this._moImage.alpha = 0;
        this._mcImage.alpha = 1;
        this._yingxiao =2;
        this._musicImage.source = this._musicCloseImage.source;

        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._lgImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnYuyanClick, this);
        this._cnImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCNClick, this);
        this._enImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnENClick, this);
        this._mImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnMusicClick, this);
        this._moImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnMusicOpenClick, this);
        this._mcImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnMusicCloseClick, this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "xitongsz_di" + lg + "_png";
        if (this._yingxiao == 1){
            this._musicImage.source = "xitongsz_wz_on" + lg + "_png";
        }
        else{
            this._musicImage.source = "xitongsz_wz_off" + lg + "_png";
        }
        this._musicOpenImage.source = "xitongsz_wz_on" + lg + "_png";
        this._musicCloseImage.source = "xitongsz_wz_off" + lg + "_png";
        if (StringMgr.Language == StringMgr.CN){
            this._yuyan = 1;
            this._yuyanImage.source = "xitongsz_wz_zhongwen_png";
            this._cnImage.alpha = 1;
            this._enImage.alpha = 0;
        }
        else {
            this._yuyan = 2;
            this._yuyanImage.source = "xitongsz_wz_yingwen_en_png";
            this._cnImage.alpha = 0;
            this._enImage.alpha = 1;
        }
    }

    /**
     * 语言选择点击响应
     */
    private _OnYuyanClick(){
        SoundManager.PlayButtonMusic();
        this._lgGroup.visible = !this._lgGroup.visible;
        this._musicGroup.visible = false;
    }

    /**
     * 中文选中响应
     */
    private _OnCNClick(){
        SoundManager.PlayButtonMusic();
        this._lgGroup.visible = false;
        if (this._yuyan == 1) return;
        this._yuyan = 1;
        this._yuyanImage.source = "xitongsz_wz_zhongwen_png";
        this._cnImage.alpha = 1;
        this._enImage.alpha = 0;
        StringMgr.Language = StringMgr.CN;
    }

    /**
     * 英文选中响应
     */
    private _OnENClick(){
        SoundManager.PlayButtonMusic();
        this._lgGroup.visible = false;
        if (this._yuyan == 2) return;
        this._yuyan = 2;
        this._yuyanImage.source = "xitongsz_wz_yingwen_en_png";
        this._cnImage.alpha = 0;
        this._enImage.alpha = 1;
        StringMgr.Language = StringMgr.EN;
    }

    /**
     * 音效选择点击响应
     */
    private _OnMusicClick(){
        SoundManager.PlayButtonMusic();
        this._musicGroup.visible = !this._musicGroup.visible;
        this._lgGroup.visible = false;
    }

    /**
     * 音效开点击响应
     */
    private _OnMusicOpenClick(){
        SoundManager.PlayButtonMusic();
        this._musicGroup.visible = false;
        if (this._yingxiao == 1) return;
        this._yingxiao = 1;
        var lg: string = StringMgr.LanguageSuffix;
        this._musicImage.source = "xitongsz_wz_on" + lg + "_png";
        this._moImage.alpha = 1;
        this._mcImage.alpha = 0;
        SoundManager.YinYue = true;
        SoundManager.PlayBackgroundMusic();
    }

    /**
     * 音效关点击响应
     */
    private _OnMusicCloseClick(){
        SoundManager.PlayButtonMusic();
        this._musicGroup.visible = false;
        if (this._yingxiao == 2) return;
        this._yingxiao = 2;
        var lg: string = StringMgr.LanguageSuffix;
        this._musicImage.source = "xitongsz_wz_off" + lg + "_png";
        this._moImage.alpha = 0;
        this._mcImage.alpha = 1;
        SoundManager.YinYue = false;
    }

    /**
     * 点击关闭响应
     */
    private _OnCloseClick(){
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
    private _bg: eui.Image;                                     // 背景图片
	private _isVisibled: boolean = false;                       // 是否显示
    private _closeButton: eui.Button;                           // 关闭按钮
    private _lgImage: eui.Image;                                // 语言选择图片
    private _yuyanImage: eui.Image;                             // 当前语言图片
    private _lgGroup: eui.Group;                                // 语言组
    private _cnImage: eui.Image;                                // 中文选中图片
    private _enImage: eui.Image;                                // 英文选中图片
    private _mImage: eui.Image;                                 // 音效选择图片
    private _musicGroup: eui.Group;                             // 音效组
    private _musicImage: eui.Image;                             // 当前音效图片
    private _moImage: eui.Image;                                // 音效开选中图片
    private _mcImage: eui.Image;                                // 音效关选中图片
    private _musicOpenImage: eui.Image;                         // 音效开图片
    private _musicCloseImage: eui.Image;                        // 音效关图片

    private _yuyan: number = 2;                                 // 当前语言（1中文，2英文）
    private _yingxiao: number = 1;                              // 当前音效（1开，2关）
}