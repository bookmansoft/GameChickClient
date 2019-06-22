/**
 * 结算界面
 */
class EndWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/EndPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._starSet = [];
        for (var i = 0; i < 3; i++){
            this._starSet.push(this["_starImage" + i]);
        }

        this._shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnShareClick, this);
        this._againButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnReplayClick, this);
        this._changeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChangeClick, this);
        this._returnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnReturnClick, this);
        this._continueButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnContinueClick, this);

        this._isCreated = true;
        if (this._bonus != null){
            this.Show(this._bonus);
            this._bonus = null;
        }
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._fristImage.source = "suipian_jiao" + lg + "_png";
        this._newImage.source = "newgame" + lg + "_png";
        this._returnButton.skinName = SkinCreateMgr.CreateButton("anniu_fanhuizhuye_l" + lg + "_png", "anniu_fanhuizhuye_a" + lg + "_png");
        this._shareButton.skinName = SkinCreateMgr.CreateButton("anniu_fenxiang_l" + lg + "_png", "anniu_fenxiang_a" + lg + "_png");
        this._continueButton.skinName = SkinCreateMgr.CreateButton("anniu_jixu_l" + lg + "_png", "anniu_jixu_a" + lg + "_png");
        this._changeButton.skinName = SkinCreateMgr.CreateButton("anniu_genghuanjuese_l" + lg + "_png", "anniu_genghuanjuese_a" + lg + "_png");
        this._againButton.skinName = SkinCreateMgr.CreateButton("anniu_zailaiyici_l" + lg + "_png", "anniu_zailaiyici_a" + lg + "_png");
    }

    /**
     * 继续按钮点击响应
     */
    private _OnContinueClick(){
        if (CheckpointManager.IsEndless){
            this.IsVisibled = false;
            Game.Instance.StarBattle();
        }
        else if(CheckpointManager.IsDailyActive){
            if(UnitManager.DailyActiveState == false || UnitManager.DailyActiveCurScore >= UnitManager._dailyActiveMaxScore){
                PromptManager.CreatCenterTip(false, true, StringMgr.GetText("endwindowtext1"));
            }else{
                this.IsVisibled = false;
                Game.Instance.StarBattle();
            }
        }
        else{
            if (!CheckpointManager.CurrentCheckpoint.IsPass){
                PromptManager.CreatCenterTip(false, true, StringMgr.GetText("endwindowtext2"));
                return;
            }
            if (CheckpointManager.CurrentCheckpoint.ID >= CheckpointManager.GetCheckpointSet().length){
                PromptManager.CreatCenterTip(false, false, StringMgr.GetText("endwindowtext3"));
                return;
            }
            if (UnitManager.Player.PhysicalConsume(CheckpointManager.CurrentCheckpoint.ConsumePhy)){
                this.IsVisibled = false;
                CheckpointManager.CurrentCheckpointID += 1;
                Game.Instance.StarBattle();
            }
        }
    }

    /**
     * 返回按钮点击响应
     */
    private _OnReturnClick(){
        this.IsVisibled = false;
        CheckpointManager.ChooseCheckPointId = CheckpointManager.CurrentCheckpointID;
        GameEvent.DispatchEvent(EventType.StartCheckPassAni);

        WindowManager.StarWindow().IsVisibled = true;
        SoundManager.PlayBackgroundMusic();
        Main.Instance.BattleEnd();
        WindowManager.StarWindow().CloseWindow();
        if(!GuideManager.IsGuide){
            AchievementManager.ShowLastCompleteAch();
        }
        if(GuideManager.IsGuide && GuideManager.GuideID == 8){
            WindowManager.StarWindow().ShouCangGuide();
        }
    }

    /**
     * 点击更换角色按钮响应
     */
    private _OnChangeClick(){
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
     * 分享按钮点击响应
     */
    private _OnShareClick(){
        var textSet: string[] = GameConstData.ShareContent;
        if (textSet.length == 2){
            window["shareCont"] = FBSDKMgr.Share(textSet[0], textSet[1]);
            window["share"]();
            // FBSDKMgr.Share(textSet[0], textSet[1]);
        }
        else{
            window["shareCont"] = FBSDKMgr.Share();
            window["share"]();
            // FBSDKMgr.Share();
        }
    }

	/**
     * 重新开始按钮点击响应
     */
    private _OnReplayClick(event: egret.TouchEvent){
        if (CheckpointManager.IsEndless){
                this.IsVisibled = false;
                Game.Instance.StarBattle();
        }
        else if(CheckpointManager.IsDailyActive){
            if(UnitManager.DailyActiveState == false || UnitManager.DailyActiveCurScore >= UnitManager._dailyActiveMaxScore){
                PromptManager.CreatCenterTip(false, true, StringMgr.GetText("endwindowtext1"));
            }else{
                this.IsVisibled = false;
                Game.Instance.StarBattle();
            }
        }
        else{
            if (UnitManager.Player.PhysicalConsume(CheckpointManager.CurrentCheckpoint.ConsumePhy)){
                this.IsVisibled = false;
                Game.Instance.StarBattle();
            }
        }
    }

	/**
     * 显示结算
     */
    public Show(bonus: Object[] = null){
        if (!this._isCreated){
            this._bonus = bonus;
            this.IsVisibled = true;
            return;
        }
        var isWin: boolean = Game.Instance.IsWin;
        var score: number = Game.Instance.EndScore;
        var star: number = Game.Instance.Star;
        var isFrist: boolean = Game.Instance.IsFrist && isWin;
        // 设置背景
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = isWin? "jiesuan_di" + lg + "_png" : "jiesuansb_di" + lg + "_png";
            // 设置星级
        if (!isWin) star = 0;
        for (var i = 0; i < this._starSet.length; i++){
            this._starSet[i].visible = i < star;
        }
        this._starGroup.visible == isWin;
        if (CheckpointManager.IsEndless || CheckpointManager.IsDailyActive){
            if (score > UnitManager.Player.MaxScore){
                UnitManager.Player.MaxScore = score;
                this._newImage.visible = true;
            }
            else{
                this._newImage.visible = false;
            }
            this._scoreLabel.text = score.toString();
            this._maxScoreLabel.text = UnitManager.Player.MaxScore.toString();
        }
        else{
            var checkpoint: Checkpoint = CheckpointManager.CurrentCheckpoint;
            if (checkpoint == null){
                Main.AddDebug("结算界面找不到关卡");
                return;
            }
            // 设置分数
            this._scoreLabel.text = score.toString();
            // 设置最大分数和是否是新纪录
            if (score > checkpoint.MaxScore){
                this._newImage.visible = true;
                checkpoint.MaxScore = score;
                this._maxScoreLabel.text = score.toString();
            }
            else {
                this._newImage.visible = false;
                this._maxScoreLabel.text = checkpoint.MaxScore.toString();
            }
        }
        this.IsVisibled = true;
        // 设置奖励
        var money: number = 0;
        var res: string = "";
        var des: string = StringMgr.GetText("endwindowtext4");
        var hasItem: boolean = false;
        var hasMoney: boolean = false;
        if (bonus != null){
            
            for (var i = 0; i < bonus.length; i++){
                var data: Object = bonus[i];
                var type: string = data["type"];
                if (type == "M"){
                    if (!hasMoney){
                        money = data["num"];
                        hasMoney = true;
                    }
                    else{
                        res = "fenxiang_jinbi_png";
                        des = StringMgr.GetText("rewardtext1") + " X" + money.toString();
                        hasItem = true;
                    }
                    // UnitManager.Player.Money += money;
                }
                else if (type == "D"){
                    // if (!hasMoney){
                        // money = data["num"];
                        // hasMoney = true;
                    // }
                    // else{
                        res = "fenxiang_jifen_png";
                        des = StringMgr.GetText("rewardtext2") + " X" + data["num"];
                        hasItem = true;
                    // }
                    // UnitManager.Player.PingGai += money;
                }
                else if ((type == "I" || type == "C") && !hasItem){
                    var item: Item = ItemManager.GetItemByID(data["id"]);
                    if (item != null && data["id"] != 701 && data["id"] != 702){
                        res = item.ImageRes;
                        des = item.Name + "x" + data["num"];
                        ItemManager.AddItem(ItemManager.GetXID(type, data["id"]), data["num"]);
                        hasItem = true;
                    }

                    // 获得雀翎提示
                    if(item != null && data["id"] == 701 || data["id"] == 702){
                        let _typeBonus = [];
                        _typeBonus.push(bonus[i]);
                        PromptManager.ShowDailyActiveRewardTip(_typeBonus);
                    }
                }
                else if(type == "A" && !hasItem){
                    res = "fenxiang_daoju_tili_png";
                    des = StringMgr.GetText("rewardtext3") + " X" + data["num"];
                    hasItem = true;
                }
            }
        }
        this._moneyLabel.text = money.toString();
        this._rewardImage.source = res;
        this._rewardLabel.text = des;
        this._rewardBgIma.visible = hasItem;
        this._rewardGroup.visible = isWin;
        this._fristImage.visible = isFrist;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.GameLayer.addChild(this);
            Game.IsShowTopTip = true;
            this.EndWindowGuide();
        }
        else{
            Main.Instance.GameLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

    /**
     * 返回主页面引导
     */
    public EndWindowGuide(){
        if (!this.IsVisibled) return;
		if(GuideManager.IsGuide && GuideManager.GuideID == 8){
			var x: number = this._returnButton.x;
			var y: number = this._returnButton.y;
			var width: number = this._returnButton.width;
			var height: number = this._returnButton.height;
			GuideManager.ShowGuideWindow(0, x, y, width, height);
		}
    }

    // 变量
    private _isVisibled: boolean = false;       // 是否显示
    private _isCreated: boolean = false;        // 是否创建完成
    private _bg: eui.Image;                     // 背景图片
    private _starGroup: eui.Group;              // 星星容器
    private _starSet: eui.Image[];              // 星星图片集合
    private _scoreLabel: eui.Label;             // 分数文本
    private _maxScoreLabel: eui.Label;          // 最高分数文本
    private _moneyLabel: eui.Label;             // 金钱文本
    private _rewardLabel: eui.Label;            // 奖励文本
    private _newImage: eui.Image;               // 新纪录图片
    private _rewardGroup: eui.Group;            // 奖励容器
    private _rewardImage: eui.Image;            // 奖励图片
    private _againButton: eui.Button;           // 再来一次按钮
    private _changeButton: eui.Button;          // 更改角色按钮
    private _returnButton: eui.Button;          // 返回主页按钮
    private _shareButton: eui.Button;           // 分享按钮
    private _continueButton: eui.Button;        // 继续按钮
    private _rewardBgIma: eui.Image;            // 获得奖励的背景
    private _fristImage: eui.Image;             // 首冲奖励图片
    private _bonus: Object[] = null;            // 奖励
}