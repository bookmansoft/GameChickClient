/**
 * 成就Tip
 */
class AchievementTip extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/AchievementTipSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._label.bold = true;

        this.height = 148;
        this.x = 0;
        this.y = -this.height;

        this._isCreated = true;
        if (this._resName != null){
            let res: string = this._resName;
            this._resName = "";
            this.Show(res, this._desText);
        }
    }

    /**
     * 显示
     */
    public Show(res: string, text: string){
        if (this._isMovie) return;
        if (!this._isCreated){
            this._resName = res;
            this._desText = text;
            this.IsVisibled = true;
            return;
        }
        if (res != this._resName){
            this._image.texture = RES.getRes(res);
            this._resName = res;
        }
        this._label.text = text;
        this.IsVisibled = true;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
            this._Movie();
        }
        else{
            Main.Instance.WindowTopLayer.removeChild(this);
            this._isMovie = false;
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
     * 动画表现
     */
    private _Movie(){
        this._isMovie = true;
        egret.Tween.removeTweens(this);
        this.y = -this.height;
        var tw = egret.Tween.get(this);
        tw.to({y: 0}, 500).call(this._Appear.bind(this));
    }

	/**
     * 出现结束
     */
    private _Appear(){
        egret.Tween.removeTweens(this);
        var tw = egret.Tween.get(this);
        tw.wait(2000).call(this._Hide.bind(this));
    }

	/**
     * 开始消失
     */
    private _Hide(){
        egret.Tween.removeTweens(this);
        var tw = egret.Tween.get(this);
        tw.to({y: -this.height}, 500).call(this._HideEnd.bind(this));
    }

	/**
     * 消失结束
     */
    private _HideEnd(){
        egret.Tween.removeTweens(this);
        this.IsVisibled = false;
    }

    // 变量
    private _isVisibled: boolean = false;       // 是否显示
    private _isCreated: boolean = false;        // 是否创建完成
    private _image: eui.Image;                  // 图片
    private _label: eui.Label;                  // 文本
    private _resName: string;                   // 资源名字
    private _desText: string;                   // 描述
    private _isMovie: boolean = false;          // 是否在播放动画
}