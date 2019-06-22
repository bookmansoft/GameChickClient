class GuideWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/GuidePageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._mask = new MaskBG();
        this._hand = new GuideHand();
        // this._image1.visible = false;
        // this._image2.visible = false;
        // this._tipGroup.visible = false;

        this._knowButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnKnowClick, this);
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "xinshou_shouye" + lg + "_png";
        this._image1.source = "xinshou_qidian" + lg + "_png";
        this._shouchangIma.source = "xinshou_shoucang" + lg + "_png";
        this._knowButton.skinName = SkinCreateMgr.CreateButton("anniu_wozhidao_l" + lg + "_png", "anniu_wozhidao_a" + lg + "_png");
    }

    /**
     * 点击知道按钮
     */
    private _OnKnowClick(){
        SoundManager.PlayButtonMusic();
        // console.log(GuideManager.GuideID);
        GuideManager.GuideFinish(GuideManager.GuideID);
    }

    /**
     * 显示
     */
    public Show(type: number, x: number = 0, y: number = 0, width: number = 0, height: number = 0, msg: string = ""){
        //todo 暂时取消了新手引导功能
        this.IsVisibled = false;
        return;

        //  首页界面引导
        this.IsVisibled = true;
        if (type == 1){// 角色信息
            if (this.contains(this._mask)) this.removeChild(this._mask);
            this._image1.visible = false;
            this._bg.visible = true;
            this._knowButton.visible = true;
            this._shouchangIma.visible = false;
            this._HandStop();
        }
        else if (type == 2){// 引导关卡区域
            this._bg.visible = false;
            if (!this.contains(this._mask)) this.addChildAt(this._mask, 0);
            this._image1.visible = true;
            this._knowButton.visible = true;
            this._shouchangIma.visible = false;
            this._mask.SetSize(x, y, width, height);
            this._HandStop();
            this._knowButton.visible = true;
        }
        // else if (type == 3){//引导点击关卡出现闯关按钮
        //     this._bg.visible = false;
        //     if (!this.contains(this._mask)) this.addChildAt(this._mask, 0);
        //     this._image1.visible = false;
        //     this._knowButton.visible = true;
        //     this._shouchangIma.visible = false;
        //     this._mask.SetSize(x, y, width, height);
        //     this._hand.x = x + width / 2;
        //     this._hand.y = y;
        //     this._HandStop();
        // }
        else if (type == 4){//收藏引导
            this._bg.visible = false;
            if (!this.contains(this._mask)) this.addChildAt(this._mask, 0);
            this._image1.visible = false;
            this._knowButton.visible = false;
            this._shouchangIma.visible = true;
            this._mask.SetSize(x, y, width, height);
            this._HandStop();
        }
        else if (type == 0){
            this._bg.visible = false;
            if (!this.contains(this._mask)) this.addChildAt(this._mask, 0);
            this._image1.visible = false;
            this._knowButton.visible = false;
            this._shouchangIma.visible = false;
            this._mask.SetSize(x, y, width, height);
            this._hand.x = x + width / 2;
            this._hand.y = y;
            this._HandPlay();
            
        }
    }

    /**
     * 方向播放
     */
    private _HandPlay(){
        this._HandStop();
        if (!this.contains(this._hand)) this.addChild(this._hand);
        this._hand.Play();
    }

    /**
     * 方向停止
     */
    private _HandStop(){
        if (this.contains(this._hand)) this.removeChild(this._hand);
        this._hand.Stop();
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.TopLayer.addChildAt(this, 0);
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

    // 变量
    private _isVisibled: boolean = false;       // 是否显示
    private _bg: eui.Image;                     // 背景图片
    private _image1: eui.Image;                 // 图片1
    // private _image2: eui.Image;                 // 好友图片2
    private _knowButton: eui.Button;            // 知道按钮
    private _mask: MaskBG;                      // 遮罩底
    private _hand: GuideHand;                   // 方向
    private _shouchangIma: eui.Image;           // 引导收藏提示

    // private _tipGroup: eui.Group;               // 提示容器
    // private _tipLabel: eui.Label;               // 提示文本
}

/**
 * 方形
 */
class MaskBG extends egret.DisplayObjectContainer {
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this._Init();
    }

    /**
     * 初始化
     */
    private _Init() {
        this._zsImage.texture = RES.getRes("wait_di_png");
        this._zImage.texture = RES.getRes("wait_di_png");
        this._zxImage.texture = RES.getRes("wait_di_png");
        this._sImage.texture = RES.getRes("wait_di_png");
        this._xImage.texture = RES.getRes("wait_di_png");
        this._ysImage.texture = RES.getRes("wait_di_png");
        this._yImage.texture = RES.getRes("wait_di_png");
        this._yxImage.texture = RES.getRes("wait_di_png");
        this._zsImage.touchEnabled = true;
        this._zImage.touchEnabled = true;
        this._zxImage.touchEnabled = true;
        this._sImage.touchEnabled = true;
        this._xImage.touchEnabled = true;
        this._ysImage.touchEnabled = true;
        this._yImage.touchEnabled = true;
        this._yxImage.touchEnabled = true;
        this._zsImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this._zImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this._zxImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this._sImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this._xImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this._ysImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this._yImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this._yxImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBGClick, this);
        this.addChild(this._zsImage);
        this.addChild(this._zImage);
        this.addChild(this._zxImage);
        this.addChild(this._sImage);
        this.addChild(this._xImage);
        this.addChild(this._ysImage);
        this.addChild(this._yImage);
        this.addChild(this._yxImage);
        this.SetSize(400, 200, 40, 80);
    }

    /**
     * 设置大小
     * @param   width   宽
     * @param   height  高
     */
    public SetSize(x: number, y: number, width: number, height: number) {
        var stageW: number = 640;
        var stageH: number = 1136;
        if (width > stageW) width = stageW;
        if (height > stageH) height = stageH;
        // 设置X
        this._zsImage.x = this._zImage.x = this._zxImage.x = 0;
        this._sImage.x = this._xImage.x = x;
        this._ysImage.x = this._yImage.x = this._yxImage.x = x + width;
        // 设置Y
        this._zsImage.y = this._sImage.y = this._ysImage.y = 0;
        this._zImage.y = this._yImage.y = y;
        this._zxImage.y = this._xImage.y = this._yxImage.y = y + height;
        // 设置宽
        this._zsImage.width = this._zImage.width = this._zxImage.width = x;
        this._sImage.width = this._xImage.width = width;
        this._ysImage.width = this._yImage.width = this._yxImage.width = stageW - (x + width);
        // 设置高
        this._zsImage.height = this._sImage.height = this._ysImage.height = y;
        this._zImage.height = this._yImage.height = height;
        this._zxImage.height = this._xImage.height = this._yxImage.height = stageH - (y + height);
    }

    /**
     * 背景点击响应
     */
    private _OnBGClick(event: egret.TouchEvent) {
        event.stopPropagation();
        event.stopImmediatePropagation();
    }

    // 变量(方块组成)
    private _zsImage: egret.Bitmap = new egret.Bitmap();
    private _zImage: egret.Bitmap = new egret.Bitmap();
    private _zxImage: egret.Bitmap = new egret.Bitmap();
    private _sImage: egret.Bitmap = new egret.Bitmap();
    private _xImage: egret.Bitmap = new egret.Bitmap();
    private _ysImage: egret.Bitmap = new egret.Bitmap();
    private _yImage: egret.Bitmap = new egret.Bitmap();
    private _yxImage: egret.Bitmap = new egret.Bitmap();
}