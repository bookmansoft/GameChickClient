/**
 * 随机宝箱
 */
class RandomChest extends ObjectBase{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this._movie = new egret.MovieClip();
        this._movie.movieClipData = MovieManager.GetMovieClipData("randombox_json", "randombox_png", "box");
        this._movie.x = 0;
        this._movie.y = 0;
        this.addChild(this._movie);
        this._movie.play(-1);
        
        this.creatTip(this.getMaoPaoTipMsg(3),1);
        if(this._tip){
            this._tip.y = -50;
        }
    }

    /**
     * 触发
     */
    public Trigger(role: GameRole){
        try {
            this.parent.removeChild(this);
            this.removeTip();
        } catch (error) {
            console.log(error);
        }
        var isBool: boolean = super.SkillTrigger();
        if (isBool) role.ChangeStatus(0);
        ObjectPool.getPool("RandomChest").returnObject(this);
    }
    /**
     * 初始化
     */
    public onInit(){
        this._movie.play(-1);
        return this;
    }

    /**
     * 回收
     */
    public onReturn(){
        this._movie.stop();
        return this;
    }
    /**
     *  方向0竖直，1向左，2向右
     */
    public set Direction(value : number){
        this.direction = value;
        // if(this.direction == 0) {
        //     this._image.source = "daoju_baoxiang_sjz_1_png";
        //     this._image.x = -16;
        //     this._image.y = -35;
        //     this._image.scaleX = 1;  
        // }
        // else if(this.direction == 1) {
        //     this._image.source = "daoju_baoxiang_sjc_1_png";
        //     this._image.scaleX = 1;            
        //     this._image.x = -22;
        //     this._image.y = -45;
            
        // }
        // else {
        //     this._image.source = "daoju_baoxiang_sjc_1_png";
        //     this._image.x = 22;
        //     this._image.y = -45;
        //     this._image.scaleX = -1;            
        // }
    }
    
    /**
     *  方向0竖直，1向左，2向右
     */
    public get Direction(): number{
        return this.direction;
    }

    // 变量
    private _image: eui.Image;
    private direction: number;
    private _movie: egret.MovieClip;
}