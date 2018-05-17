/**
 * 物件基类
 */
class ObjectBase extends egret.DisplayObjectContainer{
    /**
     * 构造方法
     */
    public constructor(){
        super();

        ProcessManager.AddProcess(this._Process.bind(this));
    }

    /**
     * 触发
     */
    public Trigger(role: GameRole = null){
    }

    /**
     * 技能触发
     */
    public SkillTrigger(): boolean{
        if (UnitManager.CurrentRole.SkillStatus){
            var r: Role = UnitManager.CurrentRole;
            r.HandleAction({1:[new ActionObj_s(ActionEnum_s.Recover, r.ItemRecoverLife)]});
            return false;
        }
        return true;
    }

    /**
     * 销毁资源
     */
    public Destroy(){
    }

    /**
     * 冒泡
     * $msg 文本
     * $type 类型 1 小冒泡 2 大冒泡
     */
    public creatTip($msg: string, $type: number){
        if(CheckpointManager.CurrentCheckpoint.Isbubble){
            if(this._tip == null){
                this._tip = new MaoPaoTip;
                this.addChild(this._tip);
            }

            this._tip.setData($msg, $type);
            this._tip.IsVisibled = true;
        }
    }

    /**
     * 冒泡
     * $num 冒泡编号 0 飞机 1 炸弹 2 幸运宝箱 3 随机宝箱
     */
    public getMaoPaoTipMsg($num){
        let _msgSet = [];
        var jsonData: JSON = RES.getRes("eventtip_json");
        Object.keys(jsonData).map((id)=>{
            _msgSet.push(jsonData[id]);
        });

        return StringMgr.GetText(_msgSet[$num]["desc"]);
    }

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        if(this._tip == null) return;

        this._time += frameTime;
        if(this._time % 5000 <= 2500){
            this._tip.IsVisibled = true;
        }else if(this._time % 5000 > 2500){
            this._tip.IsVisibled = false;
        }
    }

    /**
     * 移除冒泡提示
     */
    public removeTip(){
        if(this._tip){
            try {
                this._tip.parent.removeChild(this._tip);
            } catch (error) {
                console.log(this._tip.parent,this._tip);
                console.log(error);
            }
            this._tip = null;
            this._time = 0;
        }
    }

    public _time: number = 0;                                 // 时间
    public _tip: MaoPaoTip;                                   // 冒泡
}