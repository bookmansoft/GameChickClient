/**
 * 引导方向
 */
class GuideHand extends egret.DisplayObjectContainer{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this._Init();
    }

    /**
     * 初始化
     */
    private _Init(){
        this._image = new eui.Image("xinshou_jiantou_png");
        this._image.x = -65 / 2;
        this._image.y = -65;
        this.addChild(this._image);
    }
    
    /**
     * 播放
     */
    public Play() {
        if (this.parent == null) return;
        egret.Tween.removeTweens(this._image);
        var tw = egret.Tween.get(this._image);
        tw.to({ y: -100 }, 500).to({ y: -65 }, 500).call(this.Play, this);
    }

    /**
     * 停止
     */
    public Stop(){
        this._image.x = -65 / 2;
        this._image.y = -65;
        egret.Tween.removeTweens(this._image);
    }

    // 变量
    private _image: eui.Image;
}