/**
 * 幸运宝箱
 */
class LuckyChest extends ObjectBase{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this._image = new eui.Image("daoju_shengmingzq_png");
        this.addChild(this._image);        
        this._image.x = 0;
        this._image.y = 0;
        
        this.creatTip(this.getMaoPaoTipMsg(2),1);
        if(this._tip){
            this._tip.y = -20;
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
            console.log(this.parent,this);
            console.log(error);
        }
        var isBool: boolean = super.SkillTrigger();
        if (isBool) role.ChangeStatus(1);
        ObjectPool.getPool("LuckyChest").returnObject(this);
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
        return this;
    }
    /**
     *  方向0竖直，1向左，2向右
     */
    public set Direction(value : number){
        this.direction = value;
        if(this.direction == 0) {
            this._image.source = "daoju_shengmingzq_png";
            this._image.x = -26;
            this._image.y = -35;
            this._image.scaleX = 1; 
        }
        else if(this.direction == 1) {
            this._image.source = "daoju_shengmingzq_png";
                        
            this._image.x = -8;
            this._image.y = -45;
            this._image.scaleX = 1;
        }
        else {
            this._image.source = "daoju_shengmingzq_png";
            this._image.x = 8;
            this._image.y = -45;
            this._image.scaleX = -1; 
        }
    }
    
    public get Direction(): number{
        return this.direction;
    }
    // 变量
    private _image: eui.Image;
    private direction: number;
}
