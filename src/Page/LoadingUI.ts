/**
 * 玩吧Loading界面
 */
class LoadingUI extends egret.DisplayObjectContainer {
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
    private _Init(){
        // 背景
        var bg: eui.Image = new eui.Image();
        bg.source = "loading_di_jpg";
        this.addChild(bg);

         // 角色光效
        this._bgMov = ArmaturePool.GetArmature("loading_liuguang_json", "loading_liuguangtexture_json",
                                                 "loading_liuguangtexture_png", "loading_liuguang");
        var dis: egret.DisplayObject = this._bgMov.display;
        dis.x = 640/2; //this._loadingImage.x;
        dis.y = 1136/2;//this._loadingImage.y + 41;
        // dis.scaleX = dis.scaleY = 0.4;
        this.addChild(dis);
        this._bgMov.animation.play("loading_liuguang", 0);


        // 进度条
        this._loadingMovieClip = new egret.MovieClip(MovieManager.GetMovieClipData("loading_tiaoAni_json", "loading_tiaoAni_png", "loading_tiao"));
        this._loadingMovieClip.x = 45;
        this._loadingMovieClip.y = 995;
        this.addChild(this._loadingMovieClip);


        // 进度条文本
        this._lodingLabel = new eui.Label;
        this._lodingLabel.textColor = 0x365daa;
        this._lodingLabel.size = 32;
        this._lodingLabel.bold = true;
        this._lodingLabel.fontFamily = "微软雅黑";
        this._lodingLabel.width = 640;
        this._lodingLabel.textAlign = "center";
        this._lodingLabel.y = this._loadingMovieClip.y - 25;
        this._lodingLabel.text = "0%";
        this.addChild(this._lodingLabel);

        // 版本文本
        var label: egret.TextField = new egret.TextField();
        label.fontFamily = "微软雅黑";
        label.size = 16;
        label.width = 300;
        label.height = 50;
        label.x = 0;
        label.y = 0;
        label.textColor = 0x000000;
        label.text = "app:" + Main.AppVersion + "   res:" + Main.ResVersion;
        this.addChild(label);
    }

    /**
     * 设置进度
     */
    public SetProgress(current:number, total:number):void {

        this._lodingLabel.text = Math.floor(current / total * 100).toString() + "%";
        this._loadingMovieClip.gotoAndStop(Math.floor(current / total * 100));
    }

    /**
     * 销毁资源
     */
    public Destroy(){
        this._bgMov.animation.stop("loading_liuguang");
        ArmaturePool.ReturnPool(this._bgMov);
    }

    // 变量
    private _loadingMovieClip: egret.MovieClip;
    private _bgMov: dragonBones.Armature;         // 角色
    private _lodingLabel: eui.Label;              // 文本
}
