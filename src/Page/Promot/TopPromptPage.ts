/**
 * 顶部提示框
 */
class TopPromptPage extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/TopPromptPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        TopPromptPage._instance = this;
    }

	/**
     * 显示提示框
     * $ifAuto 是否自动消失
     * $msg 显示文本的内容
     * $ImaRes 图标资源
     */
    public ShowPrompt($msg: string = null, $ImaRes: string = null){

        this._resName = $ImaRes;
        this._desText = $msg;

		if($ImaRes == null){
			this.skin.currentState = "noIma";
            this._noImaLabel.text = this._desText;
            this.Show($msg,$ImaRes);
		}else{
			this.skin.currentState = "haveIma";
			this._image.source = this._resName;
			this._haveImaLabel.text = this._desText;
            this.Show($msg,$ImaRes);
		}
    }

	/**
     * 显示
     */
    public Show(res: string, text: string){
        if (this._isMovie) return;
        if (!this._isCreated){
            this.IsVisibled = true;
            return;
        }
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
    private _isVisibled: boolean = false;          						 // 是否显示
	private _image: eui.Image;											 // 图标
	private _haveImaLabel: eui.Label;								     // 带图片的文本
    private _noImaLabel: eui.Label;									 // 没带图片的文本

	private static _instance: TopPromptPage;                             // 游戏本体
	private _isMovie: boolean = false;         							 // 是否在播放动画
	private _isCreated: boolean = false;        						 // 是否创建完成

    private _resName: string;                   						 // 资源名字
    private _desText: string;                   						 // 描述
}