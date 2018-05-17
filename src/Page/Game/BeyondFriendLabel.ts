/**
 * 超越好友文本
 */
class BeyondFriendLabel extends egret.DisplayObjectContainer{
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
        this._label = new eui.Label();
        this._label.width = 640;
        this._label.height = 50;
        this._label.fontFamily = "微软雅黑";
        this._label.textAlign = "center";
        this._label.textColor = 0xff4e00;
        this._label.bold = true;
        this._label.size = 50;
        this.addChild(this._label);
    }

    /**
     * 显示
     */
    public Show(text: string){
        this._label.text = text;
        egret.Tween.removeTweens(this._label);
        this._label.alpha = 1;
        this._label.y = 670;
        var tw = egret.Tween.get(this._label);
        tw.wait(500).to({y: 550, alpha: 0}, 600).call(this._Remove.bind(this));
    }

    /**
     * 移除
     */
    private _Remove(){
        ObjectPool.getPool("BeyondFriendLabel").returnObject(this);
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
        if (this.parent != null){
            this.parent.removeChild(this);
        }
        return this;
    }

    // 变量
    private _label: eui.Label;                  // 文本
}