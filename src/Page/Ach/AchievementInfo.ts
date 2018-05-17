/**
 * 成就页
 */
class AchievementInfo extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/AchievementSkins.exml";
        this.width = 170;
        this.height = 238;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._nameLabel.bold = true;
        this._label.bold = true;
        // this._nameLabel.filters = [FilterManage.AddMiaoBian(3, 0x0c305d)];

        this._isCreated = true;
        if (this._achievement != null){
            this.SetData(this._achievement);
        }
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.PlayMovie();

        GameEvent.AddEventListener(EventType.AchieveUpdata, this.Updata, this);
    }

	/**
     * 点击响应
     */
    private _OnClick(){
        WindowManager.AchievementDetailPage().ShowPage(this._achievement);
    }

	/**
     * 设置数据
     */
    public SetData(ach: Achievement){
        if (ach == null) return;
        this._achievement = ach;
        if (!this._isCreated) return;
        this.Updata();
        var rarity: number = this._achievement.Rarity;
        if (rarity != 0){
            var movieName: string = rarity == 1? "acmenteffects_1" : "acmenteffects_2";
            this._effectArm = ArmaturePool.GetArmature(movieName + "_json",
                                                       movieName + "texture_json",
                                                       movieName + "texture_png",
                                                       movieName);
            this._effectArm.display.x = 65;
            this._effectArm.display.y = 65;
            this._effectArm.display.scaleX = 0.65;
            this._effectArm.display.scaleY = 0.65;
            MovieManager.RemoveArmature(this._effectArm);
            this._movieName = movieName;
        }
    }

	/**
     * 更新
     */
    public Updata(){
        var lg: string = StringMgr.LanguageSuffix;
        let res = RES.getRes(this._achievement.ImageRes + "_jpg");
        if(RES.getRes(this._achievement.ImageRes + lg + "_png")){
            res = RES.getRes(this._achievement.ImageRes + lg + "_png");
        }
        this._image.texture = res;

        this._nameLabel.text = "No." + this._achievement.ID;
        var text: string = StringMgr.GetText("achievementtext1");
        if (this._achievement.IsCompleted){
            text = this._achievement.CompleteTime + StringMgr.GetText("achievementtext2");
        }

        this._label.text = text;
        this._image.filters = [];
        if (!this._achievement.IsCompleted){
            this._image.filters = [FilterManage.HuiDu];
        }
        
        this._redIma.visible = this._achievement.Status == 1? true : false;
    }

	/**
     * 播放光效
     */
    public PlayMovie(){
        if (!this._achievement.IsCompleted) return;
        if (this._effectArm == null) return;
        this._effectGroup.addChild(this._effectArm.display);
        MovieManager.ADDArmature(this._effectArm);
        this._effectArm.animation.play(this._movieName, 0);
    }

	/**
     * 停止光效
     */
    public StopMovie(){
        if (!this._achievement.IsCompleted) return;
        if (this._effectArm == null) return;
        if (this._effectGroup.contains(this._effectArm.display)){
            this._effectGroup.removeChild(this._effectArm.display);
        }
        MovieManager.RemoveArmature(this._effectArm);
        this._effectArm.animation.stop(this._movieName);
    }

    // 变量
    private _isCreated: boolean = false;        // 是否创建完成
    private _image: eui.Image;                  // 图片
    private _label: eui.Label;                  // 文本
    private _nameLabel: eui.Label;              // 名字文本
    private _effectGroup: eui.Group;            // 光效组
    private _achievement: Achievement;          // 当前显示成就
    private _effectArm: dragonBones.Armature;   // 光效
    private _movieName: string;                 // 动作名字

    private _redIma: eui.Image;                 // 新消息红点
}