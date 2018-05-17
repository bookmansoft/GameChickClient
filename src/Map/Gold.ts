/**
 * 金币
 */
class Gold extends ObjectBase{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this._goldImage = new eui.Image("jinbi_png");
        this._goldImage.x = -12;
        this._goldImage.y = -10;
        this.addChild(this._goldImage);
        this._movie = new egret.MovieClip();
        this._movie.movieClipData = MovieManager.GetMovieClipData("disappera_json", "disappera_png", "disappear");
        this._movie.stop();
    }

    /**
     * 触发
     */
    public Trigger(){
        Game.Instance.AddGoldNum();
        this._Disappear();
    }

    /**
     * 消失
     */
    private _Disappear(){

        this.addChild(this._movie);
        try {
            this.removeChild(this._goldImage);
        } catch (error) {
            console.log(error);
        }

        this._movie.addEventListener(egret.Event.COMPLETE, this._MovieEnd, this);
        this._movie.gotoAndPlay(1, 1);
        SoundManager.PlayGoldMusic();
    }

    /**
     * 消失动画结束
     */
    private _MovieEnd(){
        try {
            this.parent.removeChild(this);
        } catch (error) {
            console.log(error);
        }
        this._movie.removeEventListener(egret.Event.COMPLETE, this._MovieEnd, this);
        ObjectPool.getPool("Gold").returnObject(this);
    }

    /**
     * 初始化
     */
    public onInit(){
        return this;
    }

    /**
     * 回收
     */
    public onReturn(){
        this.addChild(this._goldImage);
        try {
            this.removeChild(this._movie);
        } catch (error) {
            console.log(error);
        }
        return this;
    }

    // 变量
    private _goldImage: eui.Image;                  // 金币图片
    private _movie: egret.MovieClip;                // 金币消失动画
}