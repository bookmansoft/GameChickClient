/**
 * 关卡
 */
class CheckPage extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.height = 147;
        this.skinName = "resource/game_skins/CheckPointSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._starImageSet = [];
        for (var i = 0; i < 3; i ++){
            this._starImageSet.push(this["_starImage" + i]);
        }

        this._rushButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._StartGame, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._ChooseCheck, this);
        
        this._isCreated = true;
        this.Show(this._checkpointID);

        GameEvent.AddEventListener(EventType.CheckpointStarUpdata, this._UpdataStar, this);
        GameEvent.AddEventListener(EventType.ChooseCheckPonit, this.UpdateRoleShow, this);
        GameEvent.AddEventListener(EventType.CheckpointPass, this.UpdateJieSuoShow, this);
        GameEvent.AddEventListener(EventType.StartCheckPassAni, this.StartCheckPassAni, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._checkpointIDLabel.font = "guanqianum" + lg + "_fnt";
        this._rushButton.skinName = SkinCreateMgr.CreateButton("zhujiemianxg_an_kaishi_l" + lg + "_png", "zhujiemianxg_an_kaishi_a" + lg + "_png");
    }

    /**
     * 选择关卡。更新选中状态
     */
    public _ChooseCheck(e: egret.TouchEvent){
        // console.log(e.target);
        if(GuideManager.GuideID != 2){
            CheckpointManager.ChooseCheckPointId = this._checkpointID;
            this.UpdateRoleShow();
            if(GuideManager.GuideID == 3){
                GuideManager.GuideFinish(3);
            }
        }
        
    }

    /**
     * 更新选中状态
     */
    public UpdateRoleShow(){
        if (!this._isCreated) return;
        if(CheckpointManager.ChooseCheckPointId == this._checkpointID){
            this.chooseAni();
        }
        else{
            this._canRushGroup.visible = false;
        }
    }

    /**
     * 选中动画
     */
    private chooseAni(){
        if(this._canRushGroup.visible == false){
            this._canRushGroup.visible = true;
            this._canRushGroup.anchorOffsetX = this._canRushGroup.width/2;
            this._canRushGroup.anchorOffsetY = this._canRushGroup.height/2;
            this._canRushGroup.scaleX = 0;
            this._canRushGroup.scaleY = 0;
            this._canRushGroup.y = 130;
            egret.Tween.get(this._canRushGroup).to({scaleX:1,scaleY:1},200);
        }
    }

    /**
     * 更新解锁状态
     */
    public UpdateJieSuoShow(){
        if (!this._isCreated) return;
        this._checkpoint = CheckpointManager.GetCheckpointByID(this._checkpointID);
        // 能否挑战
        let canChallenge: boolean = this._checkpoint.CanChallenge;
        if (canChallenge){
            this.touchEnabled = true;
            this.touchChildren = true;
            this._noJieSuoIma.visible = false;
            this._jiesuoGroup.visible = true;
        }
        else{
            this._noJieSuoIma.visible = true;
            this._jiesuoGroup.visible = false;
            this.touchEnabled = false;
            this.touchChildren = false;
        }
    }

    

    /**
     * 播放解锁动画
     */
    public StartCheckPassAni(){
        if (!this._isCreated) return;
        // if(CheckpointManager.MaxCheckpointID + 1 >=  this._checkpointID && this._jiesuoAni == null){
        if(CheckpointManager.CurrentCheckpointID == CheckpointManager.MaxCheckpointID && CheckpointManager.MaxCheckpointID + 1 ==  this._checkpointID && this._checkpoint.CanChallenge){
            this._noJieSuoIma.visible = false;
            this._jiesuoGroup.visible = false;
            this._jiesuoAni = new egret.MovieClip();

            let aniRes = this._checkpointID % 5 == 0? "zhujiemianxg_guankadh2" : "zhujiemianxg_guankadh1";
            this._jiesuoAni.movieClipData = MovieManager.GetMovieClipData(aniRes + "_json", aniRes + "_png", aniRes);
            this._jiesuoAni.x = 90;
            this._jiesuoAni.y = 150;
            this._jiesuoAni.play(1);
            this.addChild(this._jiesuoAni);
            this._jiesuoAni.addEventListener(egret.Event.COMPLETE, this._MovieEnd, this);
        }
    }

    /**
     * 解锁动画结束
     */
    private _MovieEnd(){
        try {
            this._jiesuoAni.stop();
            this.removeChild(this._jiesuoAni);
            this._jiesuoAni.removeEventListener(egret.Event.COMPLETE, this._MovieEnd, this);
            this._jiesuoAni = null;
        } catch (error) {
            console.log(error);
        }
        this.Show(this._checkpointID);
    }

    /**
     * 星级更新
     */
    private _UpdataStar(){
        this._checkpoint = CheckpointManager.GetCheckpointByID(this._checkpointID);
        if(this._curStarNum != this._checkpoint.Star){
            this._curStarNum = this._checkpoint.Star;
            for (var i = 0; i < this._starImageSet.length; i++){
                this._starImageSet[i].source = i < this._curStarNum? "zhujiemianxg_xing_on_png" : "zhujiemianxg_xing_off_png";
            }
        }
    }

	/**
     * 显示界面
     * @param id    关卡ID
     */
    public Show(id: number){
        this._checkpointID = id;
        if (!this._isCreated) return;
        this._checkpoint = CheckpointManager.GetCheckpointByID(id);
        if (this._checkpoint == null){
            Main.AddDebug("关卡列表关卡为空，关卡ID：" + id);
            return;
        }
        this._curStarNum = this._checkpoint.Star;
        for (let i = 0; i < this._starImageSet.length; i++){
            this._starImageSet[i].source = i < this._curStarNum? "zhujiemianxg_xing_on_png" : "zhujiemianxg_xing_off_png";
        }
        this._checkpointIDLabel.text = "g" + this._checkpoint.ID;

        if(this._checkpoint.RewardImage != ""){
            this._rewardImage.source = this._checkpoint.RewardImage;
            this._rewardGroup.visible = true;
        }else{
            this._rewardGroup.visible = false;
        }

        this._tiliLabel.text = "-" + this._checkpoint.ConsumePhy;

        this._bgIma.source = id % 5 == 0? "zhujiemianxg_guanka2_png" : "zhujiemianxg_guanka1_png";
        this._noJieSuoIma.source = id % 5 == 0? "zhujiemianxg_guanka2_d_png" : "zhujiemianxg_guanka1_d_png";

        // 能否挑战
        let canChallenge: boolean = this._checkpoint.CanChallenge;
        if (canChallenge){
            this.touchEnabled = true;
            this.touchChildren = true;
        }
        else{
            this.touchEnabled = false;
            this.touchChildren = false;
        }

        this.UpdateRoleShow();
        this.UpdateJieSuoShow();
    }

    /**
     * 开始游戏
     */
    private _StartGame(){
        if(GuideManager.IsGuide && GuideManager.GuideID < 5){
            return;
        }
        if (GuideManager.IsGuide && GuideManager.GuideID == 5){
            GuideManager.GuideFinish(5);
        }
        if (GuideManager.IsGuide && GuideManager.GuideID == 6){
            GuideManager.GuideFinish(6);
        }
        CheckpointManager.CurrentCheckpointID = this._checkpointID;
        if (WindowManager.RoleSelectWindow() == null){
            WindowManager.SetWindowFunction(this._OpenRoleSelect.bind(this));
            return;
        }
        this._OpenRoleSelect();
    }

    /**
     * 打开角色选择
     */
    private _OpenRoleSelect(){
        WindowManager.RoleSelectWindow().IsVisibled = true;
    }

    /**
     * 获取角色位置
     */
    public get RolePosi(): number[]{
        return [89, 20];
    }

    /**
     * 获取角色位置
     */
    public get checkId(): number{
        return this._checkpointID
    }

    // 变量
    private _isCreated: boolean = false;
    private _starImageSet: eui.Image[];                     // 星星图片集合
    private _checkpointIDLabel: eui.BitmapLabel;            // 关卡ID文本
    private _rewardImage: eui.Image;                        // 奖励图片
    private _rushButton: eui.Button;                        // 闯关按钮
    private _tiliGroup: eui.Group;                          // 体力容器
    private _tiliLabel: eui.BitmapLabel;                          // 体力文本
    private _checkpointID: number;                          // 当前显示的关卡ID
    private _curStarNum: number;                            // 当前关卡星级

    private _bgIma: eui.Image;                              // 背景图片
    private _rewardGroup: eui.Group;                        // 奖励容器
    private _canRushGroup: eui.Group;                       // 可以闯关容器

    private _roleArmature:dragonBones.Armature;				// 角色龙骨
    // private _roleGroup: eui.Group;                          // 角色容器

    private _chooseIma: eui.Image;                          // 选择关卡

    private _noJieSuoIma: eui.Image;                        // 未解锁状态
    private _jiesuoGroup: eui.Group;                        // 解锁状态

    private _jiesuoAni: egret.MovieClip;                        // 解锁动画
    private _checkpoint: Checkpoint;                            // 关卡
}