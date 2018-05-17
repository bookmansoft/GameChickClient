/**
 * 成就界面
 */
class AchievementWindow extends AWindow{
    /**
     * 是否开始界面进入
     */
    public static IsOpenStar: boolean = false;

    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/AchievementPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._SetAchievementData();
        GameEvent.AddEventListener(EventType.AchieveUpdata, this._Updata, this);
    }

    /**
     * 设置成就数据
     */
    private _SetAchievementData(){
        this._achInfoSet = [];
        var achSet: Achievement[] = AchievementManager.AchievementSet;
        var achX: number = 5;
        var achY: number = 0;
        for (var i = 0; i < achSet.length; i++){
            var ach: Achievement = achSet[i];
            var achInfo: AchievementInfo = new AchievementInfo();
            achInfo.SetData(ach);
            achInfo.x = (i % 3) == 0? 0 : (i % 3) == 1? achInfo.width + 10 : achInfo.width * 2 + 20;
            achInfo.y = Math.floor(i / 3) * achInfo.height + Math.floor(i / 3) * 18;
            this._achGroup.addChild(achInfo);
            this._achInfoSet.push(achInfo);
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
            AchievementManager.GetAchievementData();
        }
        else{
            Main.Instance.WindowBottomLayer.removeChild(this);
        }
        for (var i = 0; i < this._achInfoSet.length; i++){
            if (value) this._achInfoSet[i].PlayMovie();
            else this._achInfoSet[i].StopMovie();
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
     * 更新界面
     */
    private _Updata(){
        for (var i = 0; i < this._achInfoSet.length; i++){
            this._achInfoSet[i].Updata();
        }
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        // var lg: string = StringMgr.LanguageSuffix;
        if(this._achInfoSet){
            for (var i = 0; i < this._achInfoSet.length; i++){
                this._achInfoSet[i].Updata();
            }
        }
    }

    // 变量
    private _isVisibled: boolean = false;       // 是否显示
    private _achGroup: eui.Group;               // 滚动容器
    private _achInfoSet: AchievementInfo[];     // 成就页面集合
}