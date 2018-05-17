/**
 * 等待页面
 */
class SlaveWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/SlaveWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        this._InitPage();
        GameEvent.AddEventListener(EventType.SlaveInfoChange, this._UpdateShow, this);
        GameEvent.AddEventListener(EventType.SlaveTimesUpdate, this._UpdateTimes, this);
        this._addButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAddClick, this);
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        if (StringMgr.Language == StringMgr.CN){
            this._text1.text = "你的身份：";
            this._text2.text = "你的称号：";
            this._ciLabel.visible = true;
        }
        else {
            this._text1.text = "Identity:";
            this._text2.text = "Title:";
            this._ciLabel.visible = false;
        }
        this._UpdateShow();
    }

    /**
     * 添加点击按钮
     */
    private _OnAddClick(){
        var fre: Frequency;
        var consume: number[] = [10, 20, 50, 80 ,100];
        if (UnitStatusMgr.IsSlave){
            fre = FrequencyManager.GetFrequency(FrequencyType.EscapeType);
            var buyTime: number = fre.ExtValue;
            var con: number = buyTime >= consume.length? consume[4] : consume[buyTime];
            if (UnitManager.Player.TestPingGai(con)){
                let text: string = StringMgr.GetText("slavepagetext43");
                text = text.replace("&token", con.toString());
                PromptManager.CreatCenterTip(false, false, text, "", this._BuyEscapeTimes.bind(this));
            }
        }
        else {
            fre = FrequencyManager.GetFrequency(FrequencyType.CatchType);
            var buyTime: number = fre.ExtValue;
            var con: number = buyTime >= consume.length? consume[4] : consume[buyTime];
            if (UnitManager.Player.TestPingGai(con)){
                let text: string = StringMgr.GetText("slavepagetext44");
                text = text.replace("&token", con.toString());
                PromptManager.CreatCenterTip(false, false, text, "", this._BuyCatchTimes.bind(this));
            }
        }
    }

    /**
     * 购买反抗次数
     */
    private _BuyEscapeTimes(){
        FrequencyManager.AddShareTime(FrequencyType.EscapeType.toString());
    }

    /**
     * 购买抓捕次数
     */
    private _BuyCatchTimes(){
        FrequencyManager.AddShareTime(FrequencyType.CatchType.toString());
    }

    /**
     * 初始化图片
     */
    private _InitPage(){
        var openIDSet: number[] = [5,5,20,20,35,35,50,50];
        for (var i= 0; i < 8; i++){
            var page: SlavePage = new SlavePage();
            page.OpenCheckpointID = openIDSet[i];
            page.x = i % 2 == 0? 52 : 322;
            page.y = Math.floor(i / 2) * (page.height + 16) + 157;
            this.addChild(page);
            this._pageSet.push(page);
        }
    }

    /**
     * 更新显示
     */
    private _UpdateShow(){
        var checkIDSet: number[] = [50,35,20,5];
        // 设置界面page
        for (var i = 0; i < this._pageSet.length; i++){
            this._pageSet[i].UpdateShow(i);
        }
        var lg: string = StringMgr.LanguageSuffix;
        // 设置身份
        if (UnitStatusMgr.IsMaster){
            this._sfImage.source = "nuli_kuangxia_zhuren" + lg + "_png";
        }
        else if (UnitStatusMgr.IsSlave){
            this._sfImage.source = "nuli_kuangxia_nuli" + lg + "_png";
        }
        else if (UnitStatusMgr.IsFreed){
            this._sfImage.source = "nuli_kuangxia_ziyoushen" + lg + "_png";
        }
        this._UpdateTimes();
        // 设置等级
        var checkID: number = Math.max(5,CheckpointManager.MaxCheckpointID);
        var resSet: string[] = ["nuli_chuo_wfbr", "nuli_chuo_hxxl", "nuli_chuo_hxlb", "nuli_chuo_xfja"];
        for (var i = 0; i < checkIDSet.length; i++){
            if (checkID >= checkIDSet[i]){
                this._levelImage.source = resSet[i] + lg + "_png";
                break;
            }
        }
    }

    /**
     * 更新次数文本
     */
    private _UpdateTimes(){
        var catchFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.CatchType);
        if (catchFre == null){
            Main.AddDebug("获取不到次数信息，type=" + FrequencyType.CatchType);
            return;
        }
        var escapeFre: Frequency = FrequencyManager.GetFrequency(FrequencyType.EscapeType);
        if (escapeFre == null){
            Main.AddDebug("获取不到次数信息，type=" + FrequencyType.EscapeType);
            return;
        }
        if (UnitStatusMgr.IsMaster){
            this._desLabel.text = StringMgr.GetText("slavepagetext45");
            if (catchFre != null){
                this._timesLabel.text = (catchFre.MaxValue + catchFre.ExtValue - catchFre.Value).toString();
            }
        }
        else if (UnitStatusMgr.IsSlave){
            this._desLabel.text = StringMgr.GetText("slavepagetext46");
            if (escapeFre != null){
                this._timesLabel.text = (escapeFre.MaxValue + escapeFre.ExtValue - escapeFre.Value).toString();
            }
        }
        else if (UnitStatusMgr.IsFreed){
            this._desLabel.text = StringMgr.GetText("slavepagetext45");
            if (catchFre != null){
                this._timesLabel.text = (catchFre.MaxValue + catchFre.ExtValue - catchFre.Value).toString();
            }
        }
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._UpdateShow();
        }
        else{
            Main.Instance.WindowBottomLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }


    // 变量
	private _isVisibled: boolean = false;                       // 是否显示
    private _isCreated: boolean = false;                        // 是否创建完成
    private _addButton: eui.Button;                             // 加号按钮
    private _timesLabel: eui.BitmapLabel;                       // 次数文本
    private _sfImage: eui.Image;                                // 身份图片
    private _levelImage: eui.Image;                             // 等级图片
    private _pageSet: SlavePage[] = [];                         // 页面集合
    private _desLabel: eui.Label;                               // 描述文本
    private _text1: eui.Label;
    private _text2: eui.Label;
    private _ciLabel: eui.Label;
}