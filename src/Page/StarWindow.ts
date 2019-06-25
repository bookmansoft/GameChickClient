/**
 * 开始界面
 */
class StarWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/StarPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        
        this._isCreated = true;
        this.addChildAt(Main.Instance.WindowBottomLayer, 0);
        // 设置按钮的初始状态
        this._shareGroup.touchEnabled = true;
        this._setGroup.touchEnabled = true;
        this._checkPointGroup.touchEnabled = true;
        this._moreGroup.touchEnabled = true;
        this._buttonGroup.touchEnabled = true;
        this._returnButton.visible = false;
        this._buttonGroup.visible = false;
        this._integralButton.visible = false;
        this._integralRedIma.visible = false;
        this._receiveButton.visible = false;
        this._receiveRedIma.visible = false;
        this._noticeRedIma.visible = false;
        // this._musicCheck.selected = false;
        this._activeGroup.visible = false;

        this._checkpointScroller.bounces = false;

        CheckpointManager.ChooseCheckPointId = -1;

        // 注册按钮响应
        this._returnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnReturnClick, this);
        this._shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnShareClick, this);
        this._shareButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnShareBegin, this);
        this._shareButton.addEventListener(egret.TouchEvent.TOUCH_END, this._OnShareEnd, this);
        this._setButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnSetBegin, this);
        this._setButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSetClick, this);
        // this._musicCheck.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnMusicBegin, this);
        // this._musicCheck.addEventListener(egret.TouchEvent.TOUCH_END, this._OnMusicEnd, this);
        // this._musicCheck.addEventListener(egret.TouchEvent.CHANGE, this._OnMusicChange, this);
        this._moreButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnMoreClick, this);
        this._noticeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnNoticeClick, this);
        this._achievementButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAchievementClick, this);
        this._roleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRoleClick, this);
        this._friendButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnFriendClick, this);
        this._shopButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnShopClick, this);
        this._rankButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRankClick, this);
        this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStarClick, this);
        this._keepButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnKeepBegin, this);
        this._keepButton.addEventListener(egret.TouchEvent.TOUCH_END, this._OnKeepEnd, this);
        this._keepButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnKeepClick, this);
        this._guideKeepButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnKeepClick, this)
        this._vipButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnVipClick, this);
        this._integralButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnIntegralClick, this);
        // this._rushButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRushClick, this);
        this._endlessButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnEndlessClick, this);
        this._receiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this._OnIntegralReceiveClick,this);
        this._bagButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBagClick, this);
        this._slaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSlaveClick, this);
        this._firstChargeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnFirstClick, this);
        this._dailyActiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnDailyActiveClick, this);
        this._activeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnActiveClick, this);
        // this._gqButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGuoQingClick, this);
        // this._sceneButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGuoQingSceneClick, this);


        this._UpdatePhysical();
        this._UpdatePhysicalTime();
        this._UpdateHead();
        GameEvent.AddEventListener(EventType.PhysicalChange, this._UpdatePhysical, this);
        GameEvent.AddEventListener(EventType.MaxPhysicalChange, this._UpdatePhysical, this);
        GameEvent.AddEventListener(EventType.PhysicalTimeChange, this._UpdatePhysicalTime, this);
        GameEvent.AddEventListener(EventType.PlayerHeadChange, this._UpdateHead, this);

        // this.creatCheckPoint();
        // GameEvent.AddEventListener(EventType.FriendUpData, this.upDataShowFriendsRole, this);
        GameEvent.AddEventListener(EventType.ShouHello, this.updataRedIsVisible, this);
        GameEvent.AddEventListener(EventType.AchieveUpdata, this.updataRedIsVisible, this);
        GameEvent.AddEventListener(EventType.RoleSuiPianItemUpdate, this.updataRedIsVisible, this);
        GameEvent.AddEventListener(EventType.RoleSkillUpLevel, this.updataRedIsVisible, this);
        GameEvent.AddEventListener(EventType.ActivityExchangeState, this.updataRedIsVisible, this);
        GameEvent.AddEventListener(EventType.UserStatusChange, this.updataRedIsVisible, this);
        GameEvent.AddEventListener(EventType.UserStatusChange, this._UpdataFirstCharge, this);

        GameEvent.AddEventListener(EventType.DailyAcitveStateUpData, this._UpdateDailyActiveButtonVisible, this);
        GameEvent.AddEventListener(EventType.UserStatusChange, this._UpdateDailyActiveButtonVisible, this);

        // GameEvent.AddEventListener(EventType.CheckpointPass, this.upDataShowCheckPoint, this);
        GameEvent.AddEventListener(EventType.ChooseCheckPonit, this.creatCheckPoint, this);
        GameEvent.AddEventListener(EventType.UserStatusChange, this.creatCheckPoint, this);

        this._nameLabel.filters = [FilterManage.AddMiaoBian(3, 0x114c5f)];
        this._nameLabel.text = UnitManager.Player.Name;

        ProcessManager.AddProcess(this._Process.bind(this));

        // 首次分享检测
        this.UpdateFirstShare();
        // 检测礼包
        UnitManager.CheckDayGift();
        // 检测活动礼包
        ActiveManager.CheckBonus();
        // 检测新手或7日礼包
        UnitManager.CheckPlayGift();
        // 检测新手引导
        GuideManager.GuideCheck();
        // 加载提示界面资源
        ResReadyMgr.IsReady("prompt");
        // 检测更新公告
        PromptManager.CheckGenXin();

        this._UpdateButton();
        // 添加活动按钮光效
        this._AddActiveButtonAni();
        this._UpdateDailyActiveButtonVisible();
        
		// "<e:Skin states=\"up,down,disabled\"><e:Image width=\"100%\" height=\"100%\" source=\"yinyue_off_png\" source.down=\"yinyue_on_png\"/><e:Label id=\"labelDisplay\" horizontalCenter=\"0\" verticalCenter=\"0\"/></e:Skin>"
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        // this._musicCheck.skinName = SkinCreateMgr.CreateCheckBox("yinyue_off" + lg + "_png", "yinyue_on" + lg + "_png");
        this._setButton.skinName = SkinCreateMgr.CreateButton("shezhi_l" + lg + "_png", "shezhi_l" + lg + "_png");
        this._shareButton.skinName = SkinCreateMgr.CreateButton("fenxiang_l" + lg + "_png", "fenxiang_l" + lg + "_png");
        this._keepButton.skinName = SkinCreateMgr.CreateButton("shoucang_l" + lg + "_png", "shoucang_l" + lg + "_png");
        this._guideKeepButton.skinName = SkinCreateMgr.CreateButton("shoucang_l2" + lg + "_png", "shoucang_l2" + lg + "_png");
        this._activeButton.skinName = SkinCreateMgr.CreateButton("huodong_l" + lg + "_png", "huodong_a" + lg + "_png");
        this._dailyActiveButton.skinName = SkinCreateMgr.CreateButton("tiaozhan_l" + lg + "_png", "tiaozhan_a" + lg + "_png");
        this._integralButton.skinName = SkinCreateMgr.CreateButton("jifen_l" + lg + "_png", "jifen_a" + lg + "_png");
        this._vipButton.skinName = SkinCreateMgr.CreateButton("vipyueka_l" + lg + "_png", "vipyueka_a" + lg + "_png");
        this._firstChargeButton.skinName = SkinCreateMgr.CreateButton("shouchong_l" + lg + "_png", "shouchong_a" + lg + "_png");
        this._moreButton.skinName = SkinCreateMgr.CreateButton("gengduo_l" + lg + "_png", "gengduo_a" + lg + "_png");
        this._slaveButton.skinName = SkinCreateMgr.CreateButton("nuli_l" + lg + "_png", "nuli_a" + lg + "_png");
        this._achievementButton.skinName = SkinCreateMgr.CreateButton("chengjiu_l" + lg + "_png", "chengjiu_a" + lg + "_png");
        this._bagButton.skinName = SkinCreateMgr.CreateButton("beibao_l" + lg + "_png", "beibao_a" + lg + "_png");
        this._noticeButton.skinName = SkinCreateMgr.CreateButton("xinxi_l" + lg + "_png", "xinxi_a" + lg + "_png");
        this._returnButton.skinName = SkinCreateMgr.CreateButton("fanhui_l" + lg + "_png", "fanhui_a" + lg + "_png");
        this._roleButton.skinName = SkinCreateMgr.CreateButton("juese_l" + lg + "_png", "juese_a" + lg + "_png");
        this._friendButton.skinName = SkinCreateMgr.CreateButton("haoyou_l" + lg + "_png", "haoyou_a" + lg + "_png");
        this._shopButton.skinName = SkinCreateMgr.CreateButton("shangcheng_l" + lg + "_png", "shangcheng_a" + lg + "_png");
        this._rankButton.skinName = SkinCreateMgr.CreateButton("paihang_l" + lg + "_png", "paihang_a" + lg + "_png");
        this._startButton.skinName = SkinCreateMgr.CreateButton("kaishi_l" + lg + "_png", "kaishi_l" + lg + "_png");
        this._endlessButton.skinName = SkinCreateMgr.CreateButton("kaishi_wujin_l" + lg + "_png", "kaishi_wujin_a" + lg + "_png");
        this._receiveButton.skinName = SkinCreateMgr.CreateButton("lingjiang_l" + lg + "_png", "lingjiang_a" + lg + "_png");

        this._UpdatePhysicalTime();
    }

    /**
     * 活动点击响应
     */
    private _OnActiveClick(){
        this._activeGroup.visible = !this._activeGroup.visible;
    }

    /**
     * 国庆按钮点击
     */
    private _OnGuoQingClick(){
        if (WindowManager.GuoQingActiveWindow() != null){
            this._OpenGuoQingActive();
            return;
        }
        WindowManager.SetWindowFunction(this._OpenGuoQingActive.bind(this));
    }

    /**
     * 国庆场景按钮点击
     */
    private _OnGuoQingSceneClick(){
        if (WindowManager.GuoQingSceneWindow() != null){
            this._OpenGuoQingScene();
            return;
        }
        WindowManager.SetWindowFunction(this._OpenGuoQingScene.bind(this));
    }

    /**
     * 打开国庆活动界面
     */
    private _OpenGuoQingActive(){
        WindowManager.GuoQingActiveWindow().IsVisibled = true;
    }

    /**
     * 打开国庆场景获得界面
     */
    private _OpenGuoQingScene(){
        WindowManager.GuoQingSceneWindow().IsVisibled = true;
    }

    /**
     * 日常按钮显示与否
     */
    private _UpdateDailyActiveButtonVisible(){
        // Main.AddDebug("下发活动状态");
        if(UnitManager.DailyActiveState){
            this._dailyActiveButton.visible = true;
            this._AddDailyMovie();

            if(UnitManager.DailyActiveStartTimeNum > 0){
                this._dailyActiveTimeLabel.visible = true;
                this._dailyActiveTimeLabel.text = FBSDKMgr.FormatTime(UnitManager.DailyActiveStartTimeNum);
            }else{
                this._dailyActiveTimeLabel.visible = false;
            }

            if(this._currentWindow != null){
                // this._dailyActiveButton.visible = false;
                // this._dailyActiveTimeLabel.visible = false;
                // if(this._dailyActiveButtonMovie){
                //     this._dailyActiveButtonMovie.visible = false;
                // }
            }
        }else{
            this._dailyActiveButton.visible = false;
            this._dailyActiveTimeLabel.visible = false;
            if(this._dailyActiveButtonMovie){
                this._dailyActiveButtonMovie.stop();
                this._activeGroup.removeChild(this._dailyActiveButtonMovie);
                this._dailyActiveButtonMovie = null;
            }
        }
        
    }

    /**
     * 更新首次分享表现
     */
    public UpdateFirstShare(){
        if (UnitStatusMgr.IsFirstShare){
            if (this._shareMovie == null){
                this._shareMovie = new egret.MovieClip(MovieManager.GetMovieClipData("sharemovie_json", "sharemovie_png", "toucishoucang"));
                this._shareMovie.x = -25;
                this._shareMovie.y = -25;
                this._shareMovie.touchEnabled = false;
            }
            if (this._shareImage == null){
                this._shareImage = new eui.Image("shoucang_li_png");
                this._shareImage.x = 12;
                this._shareImage.y = 8;
            }
            this._shareMovie.play(-1);
            this._shareGroup.addChild(this._shareMovie);
            this._shareGroup.addChild(this._shareImage);
        }
        else {
            if (this._shareMovie != null && this._shareMovie.parent != null){
                this._shareMovie.stop();
                this._shareMovie.parent.removeChild(this._shareMovie);
            }
            if (this._shareImage != null && this._shareImage.parent != null){
                this._shareImage.parent.removeChild(this._shareImage);
            }
        }
    }

    /**
     * 更新首页红点
     */
    public updataRedIsVisible(){
        this._achievementRedIma.visible = NewPointManager.AchiRedPointIsVisible();
        this._roleRedIma.visible = NewPointManager.RoleRedPointIsVisible();
        this._friendRedIma.visible = NewPointManager.friendRedPointIsVisible();
        this._noticeRedIma.visible = UnitStatusMgr.HasNewMail;
        this._slaveRedIma.visible = NewPointManager.SlaveRedIsVisible;
        this._vipRedIma.visible = NewPointManager.VIPRedIsVisible;

        if(!this._achievementRedIma.visible && !this._noticeRedIma.visible){
            this._moreRedIma.visible = false;
        }else{
            this._moreRedIma.visible = true;
        }

        if(IntegralManager.State == "Bonus"){
            this._receiveButton.visible = NewPointManager.ReceiveButtonIsVisible();
            this._receiveRedIma.visible = NewPointManager.ReceiveButtonIsVisible();

            this._integralRedIma.visible = false;
            this._integralButton.visible = false;
        }else{
            this._receiveButton.visible = false;
            this._receiveRedIma.visible = false;

            this._integralRedIma.visible = NewPointManager.ActivityRedPointIsVisible();
            this._integralButton.visible = true;
        }
    }

    /**
     * 更新头像
     */
    private _UpdateHead(){
        this._headImage.source = UnitManager.Player.HearUrl;
    }

    /**
     * 更新体力
     */
    private _UpdatePhysical(){
        var phy: number = UnitManager.Player.Physical;
        var maxPhy: number = UnitManager.Player.MaxPhysical;
        this._tiliLabel.text = phy + "/" + maxPhy;
    }

    /**
     * 更新体力恢复时间
     */
    private _UpdatePhysicalTime(){
        var time: number = UnitManager.Player.PhysicalTime;
        if(UnitManager.Player.Physical < UnitManager.Player.MaxPhysical){
            this._timeLabel.visible = true;
        }else{
            this._timeLabel.visible = false
        }
        this._timeLabel.visible = time != 0;
        if (time == 0) return;
        var h: number = Math.floor(time / 3600);
        var m: number = Math.floor((time % 3600) / 60);
        var s: number = time % 60 |0;
        var hStr: string = h < 10? "0" + h.toString() : h.toString();
        var mStr: string = m < 10? "0" + m.toString() : m.toString();
        var sStr: string = s < 10? "0" + s.toString() : s.toString();
        var str: string = "后";
        if (StringMgr.Language == StringMgr.EN){
            str = "  ";
        }
        this._timeLabel.text = hStr + ":" + mStr + ":" + sStr + str + "+1";
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
        }
        else{
            Main.Instance.WindowTopLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
     * 返回按钮点击响应
     */
    private _OnReturnClick(){
        SoundManager.PlayButtonMusic();
        this.CloseWindow();
    }

	/**
     * 分享按钮触摸开始
     */
    private _OnShareBegin(){
        this._shareGroup.y = -8;
        egret.Tween.removeTweens(this._shareGroup);
        var tw = egret.Tween.get(this._shareGroup);
        tw.to({y: 0}, 100);
    }

	/**
     * 分享按钮触摸结束
     */
    private _OnShareEnd(){
        this._shareGroup.y = 0;
        egret.Tween.removeTweens(this._shareGroup);
        var tw = egret.Tween.get(this._shareGroup);
        tw.to({y: -8}, 100);
    }

	/**
     * 分享按钮点击响应
     */
    private _OnShareClick()　{
        //todo 暂时封闭了分享功能
        window.location.href = `test.gamegold.xin/?openid=${egret.localStorage.getItem('openid')}&openkey=${egret.localStorage.getItem('openkey')}`;
        return;

        // SoundManager.PlayButtonMusic();
        // var textSet: string[] = GameConstData.ShareContent;
        // if (textSet.length == 2){
        //     window["shareCont"] = FBSDKMgr.Share(textSet[0], textSet[1]);
        //     window["share"]();
        //     // FBSDKMgr.Share(textSet[0], textSet[1]);
        // }
        // else{
        //     window["shareCont"] = FBSDKMgr.Share();
        //     window["share"]();
        //     // FBSDKMgr.Share();
        // }
        // NetManager.SendRequest(["func=" + NetNumber.ShareEnd], this._FirstShareReturn.bind(this));
    }

    /**
     * 首次分享返回
     */
    private _FirstShareReturn(jsonData: Object){
    }

	/**
     * 收藏按钮触摸开始
     */
    private _OnKeepBegin(){
        this._keepGroup.y = -8;
        egret.Tween.removeTweens(this._keepGroup);
        var tw = egret.Tween.get(this._keepGroup);
        tw.to({y: 0}, 100);
    }

	/**
     * 收藏按钮触摸结束
     */
    private _OnKeepEnd(){
        this._keepGroup.y = 0;
        egret.Tween.removeTweens(this._keepGroup);
        var tw = egret.Tween.get(this._keepGroup);
        tw.to({y: -8}, 100);
    }

	/**
     * 收藏按钮点击响应
     */
    private _OnKeepClick(){
        //todo 暂时封闭了分享功能
        PromptManager.CreatCenterTip(false, true, "Coming soon...");
        return;

        // SoundManager.PlayButtonMusic();
        // this._guideKeepButton.visible = false;
        // if(GuideManager.IsGuide && GuideManager.GuideID == 8){
        //     WindowManager.KeepRewardTip().IsVisibled = true;
        //     // GuideManager.GuideFinish(8);
        // }else{
        //     // FBSDKMgr.AddShortcut();
        // }
    }

	/**
     * 设置按钮触摸开始
     */
    private _OnSetBegin(){
        this._setGroup.y = -8;
        egret.Tween.removeTweens(this._setGroup);
        var tw = egret.Tween.get(this._setGroup);
        tw.to({y: 0}, 100);
    }

	/**
     * 设置按钮点击响应
     */
    private _OnSetClick(){
        SoundManager.PlayButtonMusic();
        this._setGroup.y = 0;
        egret.Tween.removeTweens(this._setGroup);
        var tw = egret.Tween.get(this._setGroup);
        tw.to({y: -8}, 100);
        if (WindowManager.SetWindow() != null){
            this._OpenSet();
            return;
        }
        WindowManager.SetWindowFunction(this._OpenSet.bind(this));
    }

	/**
     * 打开设置界面
     */
    private _OpenSet(){
        WindowManager.SetWindow().IsVisibled = true;
    }

	/**
     * 声音按钮触摸开始
     */
    private _OnMusicBegin(){
        this._setGroup.y = -8;
        egret.Tween.removeTweens(this._setGroup);
        var tw = egret.Tween.get(this._setGroup);
        tw.to({y: 0}, 100);
    }

	/**
     * 声音按钮触摸结束
     */
    private _OnMusicEnd(){
        this._setGroup.y = 0;
        egret.Tween.removeTweens(this._setGroup);
        var tw = egret.Tween.get(this._setGroup);
        tw.to({y: -8}, 100);
    }

    /**
     * 声音改变
     */
    private _OnMusicChange(){
        // SoundManager.YinYue = this._musicCheck.selected;
        SoundManager.PlayBackgroundMusic();
        SoundManager.PlayButtonMusic();
    }

    /**
     * 音乐状态
     */
    public get MusicStatus(): boolean{
        // return this._musicCheck.selected;
        return false;
    }

    /**
     * 更多按钮点击响应
     */
    private _OnMoreClick(){
        SoundManager.PlayButtonMusic();
        this._buttonGroup.visible = !this._buttonGroup.visible;
    }

    /**
     * 信息按钮点击响应
     */
    private _OnNoticeClick(){
        SoundManager.PlayButtonMusic();
        if (WindowManager.NoticeWindow() == null){
            WindowManager.SetWindowFunction(this._OpenNotice.bind(this));
            return;
        }
        this._OpenNotice();
    }
    /**
     * 打开信息界面
     */
    private _OpenNotice(){
        this.OpenWindow(WindowManager.NoticeWindow());
    }

    /**
     * 成就按钮点击响应
     */
    private _OnAchievementClick(){
        SoundManager.PlayButtonMusic();
        if (WindowManager.AchievementWindow() == null){
            WindowManager.SetWindowFunction(this._OpenAchievement.bind(this));
            return;
        }
        this._OpenAchievement();
    }

    /**
     * 打开成就界面
     */
    private _OpenAchievement(){
        this.OpenWindow(WindowManager.AchievementWindow());
    }

    /**
     * 背包点击响应
     */
    private _OnBagClick(){
        SoundManager.PlayButtonMusic();
        if (WindowManager.BagWindow() == null){
            WindowManager.SetWindowFunction(this._OpenBag.bind(this));
            return;
        }
        this._OpenBag();
    }

    /**
     * 打开背包
     */
    private _OpenBag(){
        this.OpenWindow(WindowManager.BagWindow());
    }

    /**
     * 奴隶按钮点击响应
     */
    private _OnSlaveClick(){
        //todo 暂时封闭
        PromptManager.CreatCenterTip(false, true, "Coming soon...");
        return;

        // SoundManager.PlayButtonMusic();
        // if (WindowManager.SlaveWindow() == null){
        //     WindowManager.SetWindowFunction(this._OpenSlave.bind(this));
        //     return;
        // }
        // this._OpenSlave();
    }

    /**
     * 打开奴隶界面
     */
    private _OpenSlave(){
        this.OpenWindow(WindowManager.SlaveWindow());
    }

    /**
     * VIP按钮点击响应
     */
    private _OnVipClick(){
        SoundManager.PlayButtonMusic();
        if (WindowManager.VIPWindow() == null){
            WindowManager.SetWindowFunction(this._OpenVIP.bind(this));
            return;
        }
        this._OpenVIP();
    }

    /**
     * 打开VIP界面
     */
    private _OpenVIP(){
        this.OpenWindow(WindowManager.VIPWindow());
    }

    /**
     * 日常按钮点击响应
     */
    private _OnDailyActiveClick(){
        //todo 暂时封闭
        PromptManager.CreatCenterTip(false, true, "Coming soon...");
        return;

        // SoundManager.PlayButtonMusic();
        // WindowManager.WaitPage().IsVisibled = true;
        // NetManager.SendRequest(["func=" + NetNumber.GetDailyActiveInfo],this._ReceiveDailyActiveInfo.bind(this));
    }

    /**
     * 获取日常活动信息
     */
    private _ReceiveDailyActiveInfo(json: Object){
        WindowManager.WaitPage().IsVisibled = false;
        if(json["code"] != NetManager.SuccessCode){
            PromptManager.CreatCenterTip(false,true,StringMgr.GetText("startpagetext2"));
            return;
        }
        let data = json["data"];
        if(data["state"] == "Active"){//活动正式开始
            if (WindowManager.DailyActiveStartWindow() == null){
                WindowManager.SetWindowFunction(this._OpenDailyActiveStartWindow.bind(this),json);
                return;
            }
            this._OpenDailyActiveStartWindow(json);
        }else if(data["state"] == "End" || data["state"] == "Bonus"){//活动结束，观看排名
            if (WindowManager.DailyActiveStartWindow() == null){
                WindowManager.SetWindowFunction(this._OpenDailyActiveStartWindow.bind(this),json);
                return;
            }
            this._OpenDailyActiveStartWindow(json);
        }
        else{//活动预热
            if (WindowManager.DailyActiveYuReWindow() == null){
                WindowManager.SetWindowFunction(this._OpenDailyActiveYuReWindow.bind(this),json);
                return;
            }
            this._OpenDailyActiveYuReWindow(json);
        }
    }

    /**
     * 打开日常活动预热界面
     */
    private _OpenDailyActiveYuReWindow(json: Object){
        WindowManager.DailyActiveYuReWindow().IsVisibled = true;
        WindowManager.DailyActiveYuReWindow().Show(json);
    }

    /**
     * 打开日常活动正式开始界面
     */
    private _OpenDailyActiveStartWindow(json: Object){
        WindowManager.DailyActiveStartWindow().IsVisibled = true;
        WindowManager.DailyActiveStartWindow().Show(json);
    }


    /**
     * 首充按钮点击响应
     */
    private _OnFirstClick(){
        SoundManager.PlayButtonMusic();
        if (WindowManager.FirstChargeWindow() == null){
            WindowManager.SetWindowFunction(this._OpenFirst.bind(this));
            return;
        }
        this._OpenFirst();
    }

    /**
     * 打开首充界面
     */
    private _OpenFirst(){
        this.OpenWindow(WindowManager.FirstChargeWindow());
    }

    /**
     * 积分按钮点击响应
     */
    private _OnIntegralClick(){
        //todo 暂时封闭
        PromptManager.CreatCenterTip(false, true, "Coming soon...");
        return;

        // SoundManager.PlayButtonMusic();
        // if (WindowManager.IntegralWindow() == null){
        //     WindowManager.SetWindowFunction(this._OpenIntegral.bind(this));
        //     return;
        // }
        // this._OpenIntegral();
    }

    /**
     * 点击活动领奖
     */
    private _OnIntegralReceiveClick(){
        SoundManager.PlayButtonMusic();
        // 领奖
        NetManager.SendRequest(["func=" + NetNumber.ActivityGetBonus + "&id=0"], this._ReveiveActivityGetBonus.bind(this));
    }

    /**
     * 接受活动排行奖励
     */
    private _ReveiveActivityGetBonus(jsonData: Object){
        let code: number = jsonData["code"];
		let data: Object = jsonData["data"];

        if(code == NetManager.SuccessCode){
            IntegralManager.GitStateById(0, 1);
			PromptManager.ShowGit(data["bonus"]);
        }
        // this.updataRedIsVisible();
    }

    /**
     * 打开积分界面
     */
    private _OpenIntegral(){
        this.OpenWindow(WindowManager.IntegralWindow());
    }

    /**
     * 无尽模式按钮点击响应
     */
    private _OnEndlessClick(){
        SoundManager.PlayButtonMusic();
        this._starGroup.visible = false;

        //todo 取消了进入无尽的前置条件
        // if (CheckpointManager.MaxCheckpointID < 3){
        //     PromptManager.CreatCenterTip(false, true, StringMgr.GetText("startpagetext3"));
        //     return;
        // }

        CheckpointManager.CurrentCheckpointID = CheckpointManager.EndlessCheckpointID;
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
     * 角色按钮点击响应
     */
    private _OnRoleClick(){
        SoundManager.PlayButtonMusic();
        // if (!Main.GameResLoad){
        //     WindowManager.WaitPage.Show(this._OpenRole.bind(this));
        //     return;
        // }
        if (WindowManager.RoleWindow() == null){
            WindowManager.SetWindowFunction(this._OpenRole.bind(this));
            return;
        }
        this._OpenRole();
    }

    /**
     * 打开角色界面
     */
    private _OpenRole(){
        this.OpenWindow(WindowManager.RoleWindow());
    }

    /**
     * 好友按钮点击响应
     */
    public _OnFriendClick(){
        SoundManager.PlayButtonMusic();
        if (WindowManager.FriendWindow() == null){
            WindowManager.SetWindowFunction(this._OpenFriend.bind(this));
            return;
        }
        this._OpenFriend();
    }

    /**
     * 打开好友界面
     */
    private _OpenFriend(){
        this.OpenWindow(WindowManager.FriendWindow());
    }

    /**
     * 商店按钮点击响应
     */
    private _OnShopClick(){
        SoundManager.PlayButtonMusic();
        this.GoShop();
    }

    /**
     * 前往商店
     */
    public GoShop(){
        if (WindowManager.ShopWindow() == null){
            WindowManager.SetWindowFunction(this._OpenShop.bind(this));
            return;
        }
        this._OpenShop();
    }

    /**
     * 打开商店界面
     */
    private _OpenShop(){
        this.OpenWindow(WindowManager.ShopWindow());
    }

    /**
     * 排行按钮点击响应
     */
    private _OnRankClick(){
        SoundManager.PlayButtonMusic();
        if (WindowManager.RankWindow() == null){
            WindowManager.SetWindowFunction(this._OpenRank.bind(this));
            return;
        }
        this._OpenRank();
    }

    /**
     * 打开排行界面
     */
    private _OpenRank(){
        this.OpenWindow(WindowManager.RankWindow());
    }

    /**
     * 开始按钮点击响应
     */
    private _OnStarClick(){
        this._starGroup.visible = !this._starGroup.visible;
        // var str: string = GameConstData.GetTestString();
        // WindowManager.NoticeDetailWindow().ShowGenxin(str);
    }

    /**
     * 打开界面
     */
    public OpenWindow(window: AWindow){
        if (this._currentWindow != null){
            this._currentWindow.IsVisibled = false;
        }

        // if(this._currentWindow == null){
        //     this.returnFriendsRole();
        // }
        this._currentWindow = window;
        this._checkPointGroup.visible = false;
        this._headGroup.visible = false;
        this._tiliGroup.visible = false;
        this._moreGroup.visible = false;
        this._nameLabel.visible = false;
        this._moreButtonGroup.visible = false;
        this._slaveGroup.visible = false;
        this._starGroup.visible = false;
        this._returnButton.visible = true;
        this._checkBgIma2.visible = false;
        this._activeGroup.visible = false;
        this._activeButtonGroup.visible = false;

        if (this._currentWindow != null){
            this._currentWindow.IsVisibled = true;
        }
        this._UpdateButton();
    }

    /**
     * 关闭界面
     */
    public CloseWindow(){
        this._checkPointGroup.visible = true;
        this._headGroup.visible = true;
        this._tiliGroup.visible = true;
        this._moreGroup.visible = true;
        this._nameLabel.visible = true;
        this._moreButtonGroup.visible = true;
        this._slaveGroup.visible = true;
        this._checkBgIma2.visible = true;
        this._activeButtonGroup.visible = true;

        this._returnButton.visible = false;
        this._starGroup.visible = false;
        if (this._currentWindow != null){
            this.upDataShowCheckPoint();
            this._currentWindow.IsVisibled = false;
            this._currentWindow = null;
        }
        this._UpdateButton();
    }

    /**
     * 更新按钮位置
     */
    private _UpdateButton(){
        var moren: number = 995;
        var tuchu: number = 970;

        let moren2: number = 987;
        let tuchu2: number = 962;

        this.updataRedIsVisible();

        if (this._currentWindow != null){
            this._roleButton.y = this._currentWindow == WindowManager.RoleWindow(false)? tuchu : moren;
            this._friendButton.y = this._currentWindow == WindowManager.FriendWindow(false)? tuchu :moren;
            this._shopButton.y = this._currentWindow == WindowManager.ShopWindow(false)? tuchu : moren;
            this._rankButton.y = this._currentWindow == WindowManager.RankWindow(false)? tuchu : moren;

            this._roleRedIma.y = this._currentWindow == WindowManager.RoleWindow(false)? tuchu2 : moren2;
            this._friendRedIma.y = this._currentWindow == WindowManager.FriendWindow(false)? tuchu2 : moren2;
        }
        else{
            this._roleButton.y = moren;
            this._friendButton.y = moren;
            this._shopButton.y = moren;
            this._rankButton.y = moren;
            
            this._roleRedIma.y = moren2;
            this._friendRedIma.y = moren2;
        }
        this._UpdataFirstCharge();

        //todo 暂时封闭了VIP功能
        this._vipButton.visible = false;
        // // 更新VIP表现
        // var isVip: boolean = UnitManager.Player.IsVIP;
        // this._vipImage.visible = isVip;
        // if (!isVip && this._vipButtonMovie == null){
        //     var movicData: egret.MovieClipData = MovieManager.GetMovieClipData("vipbuttonmovie_json", "vipbuttonmovie_png", "vipyuekatx");
        //     this._vipButtonMovie = new egret.MovieClip(movicData);
        //     this._vipButtonMovie.play(-1);
        //     this._vipButtonMovie.x = this._vipButton.x + this._vipButton.width / 2 + 1;
        //     this._vipButtonMovie.y = this._vipButton.y + this._vipButton.height / 2;
        //     this._moreButtonGroup.addChild(this._vipButtonMovie);
        // }
        // else if (isVip && this._vipButtonMovie != null && this._moreButtonGroup.contains(this._vipButtonMovie)){
        //     this._moreButtonGroup.removeChild(this._vipButtonMovie);
        // }
    }

    /**
     * 更新首充表现
     */
    private _UpdataFirstCharge() {
        //todo 暂时封闭了首充按钮
        this._firstChargeButton.visible = false;
        // // 更新首充表现
        // var isFirst: boolean = UnitStatusMgr.IsFirstCharge && UnitStatusMgr.IsFirstChargeReward;
        // this._firstChargeButton.visible = !isFirst;
        // this._firstChargeRedIma.visible = !isFirst;
        // if (isFirst && this._firstButtonMovie != null && this._moreButtonGroup.contains(this._firstButtonMovie)){
        //     this._moreButtonGroup.removeChild(this._firstButtonMovie);
        // }
        // else if (!isFirst && this._firstButtonMovie == null){
        //     var movicData: egret.MovieClipData = MovieManager.GetMovieClipData("firstmovie_json", "firstmovie_png", "shouchongtx");
        //     this._firstButtonMovie = new egret.MovieClip(movicData);
        //     this._firstButtonMovie.play(-1);
        //     this._firstButtonMovie.x = this._firstChargeButton.x + this._firstChargeButton.width / 2 + 1;
        //     this._firstButtonMovie.y = this._firstChargeButton.y + this._firstChargeButton.height / 2 + 2;
        //     this._moreButtonGroup.addChild(this._firstButtonMovie);
        // }
    }

    /**
     * 添加活动按钮光效
     */
    private _AddActiveButtonAni(){
        if(this._activeButtonMovie == null){
            var _dailyActiveButtonMov: egret.MovieClipData = MovieManager.GetMovieClipData("huodongtx_json", "huodongtx_png", "huodongtx");
            this._activeButtonMovie = new egret.MovieClip(_dailyActiveButtonMov);
            this._activeButtonMovie.play(-1);
            this._activeButtonMovie.x = this._dailyActiveButton.x + this._dailyActiveButton.width / 2 - 17;
            this._activeButtonMovie.y = this._dailyActiveButton.y + this._dailyActiveButton.height / 2;
            this._activeButtonGroup.addChildAt(this._activeButtonMovie, 0);
        }
        // if (this._gqButtonMovie == null && UnitManager.FuwuduanTime < 1507478400){
        //     var movicData: egret.MovieClipData = MovieManager.GetMovieClipData("activemovie_json", "activemovie_png", "tiaozhantx");
        //     this._gqButtonMovie = new egret.MovieClip(movicData);
        //     this._sceneMovie = new egret.MovieClip(movicData);
        //     this._gqButtonMovie.play(-1);
        //     this._sceneMovie.play(-1);
        //     this._gqButtonMovie.x = this._gqButton.x + this._gqButton.width / 2;
        //     this._gqButtonMovie.y = this._gqButton.y + this._gqButton.height / 2;
        //     this._sceneMovie.x = this._sceneButton.x + this._sceneButton.width / 2;
        //     this._sceneMovie.y = this._sceneButton.y + this._sceneButton.height / 2;
        //     this._activeGroup.addChildAt(this._gqButtonMovie, 0);
        //     this._activeGroup.addChildAt(this._sceneMovie, 0);
        // }
        // if(UnitManager.FuwuduanTime >= 1507478400){
        //     this._gqButton.visible = false;
        //     if(this._gqButtonMovie){
        //         this._gqButtonMovie.stop();
        //         this._gqButtonMovie.visible = false;
        //     }
        // }
        // if (UnitStatusMgr.IsUnlockNinjaScene || UnitManager.FuwuduanTime >= 1507478400){
        //     this.GetNinjaScene();
        // }
    }

    /**
     * 获得场景
     */
    // public GetNinjaScene(){
    //     if(this._sceneMovie){
    //         this._sceneMovie.stop();
    //         this._sceneMovie.visible = false;
    //     }
    //     this._sceneButton.visible = false;
    // }

    /**
     * 添加日常活动光效
     */
    private _AddDailyMovie(){
        if (this._dailyActiveButtonMovie == null){
            var movicData: egret.MovieClipData = MovieManager.GetMovieClipData("activemovie_json", "activemovie_png", "tiaozhantx");
            this._dailyActiveButtonMovie = new egret.MovieClip(movicData);
            this._dailyActiveButtonMovie.play(-1);
            this._dailyActiveButtonMovie.x = this._dailyActiveButton.x + this._dailyActiveButton.width / 2;
            this._dailyActiveButtonMovie.y = this._dailyActiveButton.y + this._dailyActiveButton.height / 2;
        }
    }


    /**
     * 显示首页关卡
     */
    private upDataShowCheckPoint(){
        if(this._currentWindow == null){
            this.creatCheckPoint();
        }
    }

    /**
     * 创建首页关卡
     */
    public creatCheckPoint(){
        if (!ResReadyMgr.IsReady("checkpointwindow")) return;
        if (!ResReadyMgr.IsReady("startrole")) return;
        if (!this._isCreated) return;
        if(!CheckpointManager.IsRevice) return;

        if(this._checkpointPageSet.length == 0){
            let pageY: number = 200;
            let bgY: number = 250;//this._checkBgItemSet[0] ? 400:300;
            this._checkpointPageSet = [];
            let posiX: number[] = [250,100,250,400];
            let checkSet: Checkpoint[] = CheckpointManager.GetCheckpointSet();
            let index: number = 0;
            let bgHeight: number = this._checkBgSet[0] ? this._checkBgSet[this._checkBgSet.length - 1].y + this._checkBgSet[this._checkBgSet.length - 1].height : 0;
            let bgSetHeight = 0;

            // 创建背景上摆件
            for(let i=0; i<26; i++){
                let ima:eui.Image = new eui.Image;
                this._checkPointGroup.addChild(ima);
                if(i%4 ==0 && i!=0){
                    bgY = 427;
                }else{
                    bgY = 250;
                }
                if(i%4 ==0){
                    ima.source = "zhujiemianxg_biud4_png";
                    ima.y = bgSetHeight + bgY - ima.height/2;
                    ima.x = 0;
                }
                if(i%4 ==1){
                    ima.source = "zhujiemianxg_biud1_png";
                    ima.y = bgSetHeight + bgY - ima.height/2;
                    ima.x = 640-236;
                }
                if(i%4 ==2){
                    ima.source = "zhujiemianxg_biud2_png";
                    ima.y = bgSetHeight + bgY - ima.height/2 + 15;
                    ima.x = 0;
                }
                if(i%4 ==3){
                    ima.source = "zhujiemianxg_biud5_png";
                    ima.y = bgSetHeight + bgY - ima.height/2;
                    ima.x = 640-297;
                }
                if(i == 25){
                    ima.source = "zhujiemianxg_biud5_png";
                    ima.y = bgSetHeight + bgY - ima.height/2;
                    ima.x = 640-297;
                }
                bgSetHeight += bgY;
            }

            for (let i = 0; i < checkSet.length; i++){
                if( i + 1 > this._checkpointPageSet.length){
                    let page: CheckPage = new CheckPage();
                    page.Show(checkSet[i].ID);
                    page.y = pageY;
                    pageY += page.height;
                    page.x = posiX[index];
                    index +=1;
                    if(index >=posiX.length) index = 0;
                    this._checkPointGroup.addChild(page);
                    this._checkpointPageSet.push(page);
                }
            }

            this._checkBgIma1.height = pageY + this._checkpointPageSet[this._checkpointPageSet.length - 1].height;
        }
        // 更新
        this.updataCheckRole();
    }

    /**
     * 更新首页
     */
    public updataCheckRole(){
        let maxPoint = CheckpointManager.ChooseCheckPointId;
        if(maxPoint == -1){
            maxPoint = CheckpointManager.MaxCheckpointID;
        }

        if(this._checkpointPageSet[maxPoint]){
            if(maxPoint > 3 && maxPoint < 47){
                egret.Tween.get(this._checkpointScroller.viewport).to({scrollV:this._checkpointPageSet[maxPoint - 4].y},300);
            }else if(maxPoint <= 3){
                egret.Tween.get(this._checkpointScroller.viewport).to({scrollV:0},300);
            }else if(maxPoint > 47){
                egret.Tween.get(this._checkpointScroller.viewport).to({scrollV:this._checkpointPageSet[this._checkpointPageSet.length-1].y + this._checkpointPageSet[this._checkpointPageSet.length-1].height},300);
            }
            this.creatCheckPonitRole();
        }
        
    }

    /**
     * 创建角色形象
     */
    public creatCheckPonitRole(){
        if (UnitManager.CurrentRole == null) return;
        if(this._startRoleArmature == null || this._startRoleArmature["roleName"] != UnitManager.CurrentRole.Name){
            this.returnRoleArmature();
            this._startRoleArmature = ArmaturePool.GetArmature(UnitManager.CurrentRole.Res + "_01_json",UnitManager.CurrentRole.Res + "_01texture_json",
                            UnitManager.CurrentRole.Res + "_01texture_png",UnitManager.CurrentRole.Res + "_01");
            this._checkPointGroup.addChild(this._startRoleArmature.display);
            this._startRoleArmature.addEventListener(dragonBones.Event.COMPLETE, this._OnReviveEnd, this);
        }

        let pointNum: number = CheckpointManager.ChooseCheckPointId;
        if(CheckpointManager.ChooseCheckPointId == -1){
            pointNum = CheckpointManager.MaxCheckpointID;
        }
        // if(CheckpointManager.GetCheckpointByID(pointNum).IsPass){
        //     pointNum += 1;
        // }
        let _roleCheckPoint: CheckPage = this._checkpointPageSet[pointNum - 1];
        this._startRoleArmature["roleName"] = UnitManager.CurrentRole.Name;

        if(_roleCheckPoint){
            if(this._startRoleArmature.display.y != _roleCheckPoint.y + _roleCheckPoint.RolePosi[1]){
                this._startRoleArmature.animation.play("revive",1);
            }
            this._startRoleArmature.display.scaleX = 1.3;
            this._startRoleArmature.display.scaleY = 1.3;
            this._startRoleArmature.display.x = _roleCheckPoint.x + _roleCheckPoint.RolePosi[0];
            this._startRoleArmature.display.y = _roleCheckPoint.y + _roleCheckPoint.RolePosi[1];
            this._checkPointGroup.setChildIndex(this._startRoleArmature.display,this._checkPointGroup.numChildren - 1);
        }
    }

    /**
     * 复活光效结束
     */
    private _OnReviveEnd(){
        this._startRoleArmature.animation.play("walk",0);
    }

    /**
	 * 回收好友形象
	 */
	public returnRoleArmature(){
		if(this._startRoleArmature != null){
            this._startRoleArmature.removeEventListener(dragonBones.Event.COMPLETE, this._OnReviveEnd, this);
			ArmaturePool.ReturnPool(this._startRoleArmature);
			this._startRoleArmature = null;
		}
	}

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){

        // 每日活动倒计时显示
        if(UnitManager.DailyActiveState){
            if(UnitManager.DailyActiveStartTimeNum > 0){
                this._dailyActiveJingGuoTime += frameTime;

                if(this._dailyActiveJingGuoTime >= 1000){
                    this._dailyActiveJingGuoTime -= 1000;
                    UnitManager.DailyActiveStartTimeNum -= 1;
                    this._dailyActiveTimeLabel.text = FBSDKMgr.FormatTime(UnitManager.DailyActiveStartTimeNum);
                }

                if(UnitManager.DailyActiveStartTimeNum <= 0){
                    this._dailyActiveTimeLabel.visible = false;
                }
            }
        }

        if(CheckpointManager.MaxCheckpointID < 45 && this._checkpointPageSet.length >= 50){
            let _endShowCheckPage = this._checkpointPageSet[CheckpointManager.MaxCheckpointID + 5];
            if(this._checkpointScroller.viewport.scrollV >= _endShowCheckPage.y){
                this._checkpointScroller.viewport.scrollV = _endShowCheckPage.y;
                this._checkpointScroller.stopAnimation();
            }
        }
    }

    /**
     * 界面功能引导
     */
    public WindowGuide(){
        this.CloseWindow();
        GuideManager.ShowGuideWindow(1, 0, 0, 0 , 0);
        CheckpointManager.ChooseCheckPointId = -1;
    }

    /**
     * 引导关卡区域
     */
    public CheckGuide1(){
        this.CloseWindow();
        CheckpointManager.ChooseCheckPointId = -1;
        var x: number = 270;
        var y: number = 160;
        var width: number = 130;
        var height: number = 220;
        GuideManager.ShowGuideWindow(2, x, y, width, height);
        
    }

    /**
     * 引导点击关卡，出现闯关按钮
     */
    public CheckGuide2(){
        this.CloseWindow();
        CheckpointManager.ChooseCheckPointId = -1;
        var x: number = 270;
        var y: number = 160;
        var width: number = 130;
        var height: number = 220;
        GuideManager.ShowGuideWindow(0, x, y, width, height);
    }

    /**
     * 关卡点击开始闯关引导
     */
    public CheckpointGuide(){
        CheckpointManager.ChooseCheckPointId = 1;
        if (WindowManager.RoleSelectWindow()!=null && WindowManager.RoleSelectWindow().IsVisibled){
            WindowManager.RoleSelectWindow().IsVisibled = false;
        }
        var x: number = 250 + 24;
        var y: number = 240;
        var width: number = 122;
        var height: number = 47;
        GuideManager.ShowGuideWindow(0, x, y, width, height);
    }

    /**
     * 收藏按钮引导
     */
    public ShouCangGuide(){
        this._guideKeepButton.visible = true;
        var x: number = this._keepGroup.x;
        var y: number = 0;
        var width: number = this._keepGroup.width;
        var height: number = this._keepGroup.height - 8;
        GuideManager.ShowGuideWindow(4, x, y, width, height);
    }


    // 变量
    private _isCreated: boolean = false;                // 界面是否创建完成
    // 组件
    private _checkPointGroup: eui.Group;                // 关卡容器
    private _headGroup: eui.Group;                      // 头像容器
    private _headImage: eui.Image;                      // 头像图片
    private _tiliGroup: eui.Group;                      // 体力容器
    private _tiliLabel: eui.Label;                      // 体力文本
    private _timeLabel: eui.Label;                      // 体力恢复时间文本
    private _nameLabel: eui.Label;                      // 名字文本
    private _levelLabel: eui.Label;                     // 等级文本
    private _shareGroup: eui.Group;                     // 分享容器
    private _shareButton: eui.Button;                   // 分享按钮
    private _setGroup: eui.Label;                       // 设置容器
    private _setButton: eui.Button;                     // 设置按钮
    // private _musicCheck: eui.CheckBox;                  // 声音按钮
    private _moreGroup: eui.Group;                      // 更多按钮容器
    private _moreButton: eui.Button;                    // 更多按钮
    private _buttonGroup: eui.Button;                   // 按钮容器
    private _achievementButton: eui.Button;             // 成就按钮
    private _noticeButton: eui.Button;                  // 消息按钮
    private _roleButton: eui.Button;                    // 角色按钮
    private _friendButton: eui.Button;                  // 好友按钮
    private _shopButton: eui.Button;                    // 商店按钮
    private _rankButton: eui.Button;                    // 排行按钮
    private _startButton: eui.Button;                   // 开始按钮
    private _returnButton: eui.Button;                  // 返回按钮
    private _keepGroup: eui.Group;                      // 收藏容器
    private _keepButton: eui.Button;                    // 收藏按钮
    private _vipButton: eui.Button;                     // VIP按钮
    private _integralButton: eui.Button;                // 积分按钮
    private _receiveButton: eui.Button;                 // 领奖积分排名按钮
    private _starGroup: eui.Group;                      // 开始容器
    // private _rushButton: eui.Button;                    // 闯关按钮
    private _endlessButton: eui.Button;                 // 无尽按钮
    private _bagButton: eui.Button;                     // 背包按钮
    private _slaveButton: eui.Button;                   // 奴隶按钮
    private _slaveGroup: eui.Group;                     // 奴隶组
    private _firstChargeButton: eui.Button;             // 首充按钮
    private _vipImage: eui.Image;                       // VIP头像角标

    private _moreButtonGroup: eui.Group;                // 放在场景上的按钮的容器

    private _achievementRedIma: eui.Image;              // 成就可操作红点
    private _roleRedIma: eui.Image;                     // 角色可操作红点
    private _friendRedIma: eui.Image;                   // 好友可操作红点
    private _moreRedIma: eui.Image;                     // 更多可操作红点
    private _integralRedIma: eui.Image;                 // 积分可操作红点
    private _receiveRedIma: eui.Image;                  // 领奖可操作红点
    private _noticeRedIma: eui.Image;                   // 消息可操作红点
    private _slaveRedIma: eui.Image;                    // 奴隶红点
    private _firstChargeRedIma: eui.Image;              // 首充红点
    private _vipRedIma: eui.Image;                      // VIP红点

    private _shareMovie: egret.MovieClip;               // 分享光效
    private _shareImage: eui.Image;                     // 分享奖励图片
    private _vipButtonMovie: egret.MovieClip;           // VIP按钮光效
    private _firstButtonMovie: egret.MovieClip;         // 首充按钮光效

    // 参数
    private _isVisibled: boolean = false;               // 是否显示
    // private _isSetVisibled: boolean = false;            // 设置界面是否显示
    public _currentWindow: AWindow;                     // 当前显示界面

    private _startBgIma: eui.Image;                     // 主页面背景

    private _dailyActiveJingGuoTime: number = 0;                // 经过时间
    private _dailyActiveEndJingGuoTime: number = 0;             // 到达结束经过时间

    private _guideKeepButton: eui.Button;                       // 收藏有礼按钮

    private _checkpointPageSet: CheckPage[] = [];               // 关卡集合
    private _checkpointScroller: eui.Scroller;                  // 关卡滚动容器
    private _checkBgSet: eui.Image[] = [];                      // 首页背景
    private _checkBgItemSet: eui.Image[] = [];                  // 首页背景风景

    private _activeButton: eui.Button;                          // 活动按钮
    private _activeButtonGroup: eui.Group;                      // 活动按钮容器
    private _activeGroup: eui.Group;                            // 活动容器
    private _activeButtonMovie: egret.MovieClip;                // 活动按钮光效

    // private _gqButton: eui.Button;                              // 国庆活动按钮
    private _dailyActiveButton: eui.Button;                     // 日常活动按钮
    // private _sceneButton: eui.Button;                           // 场景按钮
    private _dailyActiveTimeLabel: eui.BitmapLabel;             // 距离正式开始日常活动剩余时间
    // private _gqButtonMovie: egret.MovieClip;                    // 国庆活动光效
    private _dailyActiveButtonMovie: egret.MovieClip;           // 日常活动光效
    // private _sceneMovie: egret.MovieClip;                       // 场景按钮光效

    private _startRoleArmature:dragonBones.Armature;			// 角色龙骨
    private _checkBgIma1: eui.Image;                            // 关卡背景底图
    private _checkBgIma2: eui.Image;                            // 关卡背景蒙板
}