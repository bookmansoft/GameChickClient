/**
 * 飞机道具
 */
class AirBox extends ObjectBase{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this._image = new eui.Image("daoju_zhifeiji_png");
        this.addChild(this._image);
        this._image.x = -54 / 2;
        this._image.y = -60 / 2;

        this.creatTip(this.getMaoPaoTipMsg(0),1);
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
            console.log(error);
        }
        var isBool: boolean = super.SkillTrigger();
        if (isBool) role.ChangeStatus(2);
        ObjectPool.getPool("RandomChest").returnObject(this);
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

    // 变量
    private _image: eui.Image;
}