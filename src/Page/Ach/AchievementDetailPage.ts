/**
 * 成就界面
 */
class AchievementDetailPage extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/AchievementDetail.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._rewardButton.visible = true;
        this._shareButton.visible = false;
        this._desLabel.text = "";
        this._conditionLabel.text = "";
        this._rewardLabel.text = "";
        this._conditionLabel.bold = true;
        this._rewardLabel.bold = true;
        this._desLabel.bold = true;

        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._rewardButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRewardClick, this);
        this._shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnShareClick, this);

        this._isCreated = true;
        if (this._achievement != null){
            this.ShowPage(this._achievement);
        }
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "chengjiu2_di" + lg + "_png";
        this._getedImage.source = "chengjiu2_yihuode" + lg + "_png";
        this._rewardButton.skinName = SkinCreateMgr.CreateButton("chengjiu2_fenxiang_l" + lg + "_png", "chengjiu2_fenxiang_a" + lg + "_png");
        this._shareButton.skinName = SkinCreateMgr.CreateButton("chengjiu2_fenxiang1_l" + lg + "_png", "chengjiu2_fenxiang1_a" + lg + "_png");
        this.updataButton();
        // if(this._achievement){
        //     this._rewardLabel.text = this._achievement.RewardDesc;
        // }
       
    }

    /**
     * 关闭按钮点击响应
     */
    private _OnCloseClick(){
        this.IsVisibled = false;
    }

    /**
     * 点击分享获得奖励响应
     */
    private _OnRewardClick(){
        if (!this._achievement.IsCompleted){
            PromptManager.CreatCenterTip(false,true,"成就未完成");
            return;
        }
        this._OnShareClick();
    }

    /**
     * 点击分享按钮响应
     */
    private _OnShareClick(){
        if (!this._achievement.IsCompleted){
            PromptManager.CreatCenterTip(false,true,"成就未完成");
            return;
        }
        if (Main.IsLocationDebug){
            this._GetBonus();
            return;
        }
        var shareData: string[] = this._achievement.ShareContent;
        if (shareData.length == 0){
            window["shareCont"] = FBSDKMgr.Share();
            window["share"]();
        }
        else{
            window["shareCont"] = FBSDKMgr.Share(shareData[0], shareData[1]);
            window["share"]();
        }
        this._GetBonus();
    }

    /**
     * 领奖
     */
    private _GetBonus(){
        AchievementManager.AchievementGetBonus(this._achievement.ID);
        this._achievement.Status = 2;
        this._rewardButton.visible = this._achievement.Status == 1;
        this._shareButton.visible = this._achievement.Status == 2;
        this._getedImage.visible = this._achievement.Status == 2;
    }

    /**
     * 显示页面
     */
    public ShowPage(ach: Achievement){
        this._achievement = ach;
        if (!this._isCreated){
            this.IsVisibled = true;
            return;
        }
        var lg: string = StringMgr.LanguageSuffix;
        let res = RES.getRes(this._achievement.ImageRes + "_jpg");
        if(RES.getRes(this._achievement.ImageRes + lg + "_png")){
            res = RES.getRes(this._achievement.ImageRes + lg + "_png");
        }
        this._achImage.texture = res;
        this._nameLabel.text = this._achievement.Name;
        this._desLabel.text = this._achievement.Description;
        this._conditionLabel.text = this._achievement.ConditionDesc;
        this._rewardImage.texture = RES.getRes(this._achievement.RewardImageRes);
        this._rewardLabel.text = this._achievement.RewardDesc;
        this.updataButton();
        this._getedImage.visible = this._achievement.Status == 2;
        this._achImage.filters = [];
        if (!this._achievement.IsCompleted){
            this._achImage.filters = [FilterManage.HuiDu];
        }
        else{
            var rarity: number = this._achievement.Rarity;
            if (rarity != 0){
                var movieName: string = rarity == 1? "acmenteffects_1" : "acmenteffects_2";
                this._effectArm = ArmaturePool.GetArmature(movieName + "_json",
                                                        movieName + "texture_json",
                                                        movieName + "texture_png",
                                                        movieName);
                this._effectArm.display.x = 100;
                this._effectArm.display.y = 100;
                this._effectArm.display.scaleX = 1;
                this._effectArm.display.scaleY = 1;
                this._effectGroup.addChild(this._effectArm.display);
                this._effectArm.animation.play(movieName, 0);
                this._movieName = movieName;
            }
        }
        this.IsVisibled = true;
    }

    /**
     * 更新按钮状态
     */
    private updataButton(){
        this._rewardButton.visible = this._achievement.Status == 1;
        this._shareButton.visible = this._achievement.Status == 2;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.TopLayer.addChild(this);
        }
        else{
            Main.Instance.TopLayer.removeChild(this);
            if (this._effectArm != null){
                this._effectGroup.removeChild(this._effectArm.display);
                this._effectArm.animation.stop(this._movieName);
                ArmaturePool.ReturnPool(this._effectArm);
                this._effectArm = null;
            }
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

    // 变量
    private _isCreated: boolean = false;            // 界面是否创建完成
    private _isVisibled: boolean = false;           // 是否显示
    private _bg: eui.Image;                         // 背景
    private _rewardButton: eui.Button;              // 分享获取奖励按钮
    private _closeButton: eui.Button;               // 关闭按钮
    private _shareButton: eui.Button;               // 分享按钮
    private _achImage: eui.Image;                   // 成就图片
    private _rewardImage: eui.Image;                // 奖励图片
    private _desLabel: eui.Label;                   // 描述文本
    private _conditionLabel: eui.Label;             // 条件文本
    private _rewardLabel: eui.Label;                // 奖励文本
    private _getedImage: eui.Image;                 // 已获得图片
    private _achievement: Achievement;              // 当前显示成就
    private _effectGroup: eui.Group;                // 光效组
    private _nameLabel: eui.Label;                  // 名字文本
    private _effectArm: dragonBones.Armature;       // 光效
    private _movieName: string;                     // 动作名字
}