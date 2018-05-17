/**
 * 日常活动正式开始界面
 */
class DailyActiveStartWindow extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/DailyAcitveStartWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseDown,this);
		this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStartDown,this);
        this._rankButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onOpenDailyActiveRankWindow,this);
        this._lookRewardButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLookRewardDown,this);
        this._tipCloseButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseRewardTipDown,this);
        // this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClickTipBegin,this);
        // this.addEventListener(egret.TouchEvent.TOUCH_END,this.onClickTipEnd,this);
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "richang_di" + lg + "_png";
        this._startButton.skinName = SkinCreateMgr.CreateButton("richang_an_kaishi_l" + lg + "_png", "richang_an_kaishi_a" + lg + "_png");
        this._rankButton.skinName = SkinCreateMgr.CreateButton("richang_an_paiming_l" + lg + "_png", "richang_an_paiming_a" + lg + "_png", "dianzan_off" + lg + "_png");
        this._lookRewardButton.skinName = SkinCreateMgr.CreateButton("richang_an_chakan_l" + lg + "_png", "richang_an_chakan_a" + lg + "_png");

        this._rewardTipBg.source = "richangjiangli_di" + lg + "_png";
        if(lg == ""){
            this._rewardTipLabel1.text = "1. 本次活动共设前10名奖励以及参与奖，所有的奖励都将从奖池中出现。";
            this._rewardTipLabel2.text = "2. 系统将根据玩家的排名，将奖池中的奖励按照百分比发放。";
            this._rewardTipLabel3.text = "3. 排名越靠前的玩家获得的奖励将越多。";
        }else{
            this._rewardTipLabel1.text = "1. Rewards are available for participation and top 10 finishers, drawn from the prize pool.";
            this._rewardTipLabel2.text = "2. Rewards given out in ratios from the prize pool based on rankings.";
            this._rewardTipLabel3.text = "3. The higher you rank, the more rewards you get.";
        }
        this._startButton.enabled = true;
        this.updataShow();
        
    }

	/**
	 * 点击关闭
	 */
	private onCloseDown(e){
		this.IsVisibled = false;
	}

    /**
	 * 点击查看奖励说明
	 */
	private onLookRewardDown(e){
        this._rewardTipGroup.visible = true;
	}

    /**
	 * 点击关闭奖励说明提示
	 */
	private onCloseRewardTipDown(e){
        this._rewardTipGroup.visible = false;
	}

    /**
	 * 点击打开活动排行榜
	 */
	private onOpenDailyActiveRankWindow(e){
        if (WindowManager.DailyActiveRankWindow() == null){
			WindowManager.SetWindowFunction(this._ShowDailyActiveRankWindow);
			return;
		}
		this._ShowDailyActiveRankWindow();
	}

	/**
	 * 加载完成日常活动奖励提示
     * @param param 奖励资源信息
	 */
	private _ShowDailyActiveRankWindow(){
		WindowManager.DailyActiveRankWindow().IsVisibled = true;
	}

    /**
	 * 点击出现提示
	 */
	/*private onClickTipBegin(e: egret.TouchEvent){
        let _tipSet = [this._rewardIma0, this._rewardIma1, this._rewardIma2, this._rewardIma3, this._rewardIma4];
        let _tipMsg = ["1.时尚安卓手机\n2.瓶盖x300", "1.鸡小德公仔\n2.瓶盖x500", "1.莫贝尔公仔\n2.瓶盖x400", "1.瓶盖x200", "1.瓶盖x50"];
        let _tipPosi = [{"x":120,"y":480}, {"x":220,"y":480}, {"x":310,"y":480}, {"x":160,"y":590}, {"x":270,"y":590}];

        for(let i=0; i<_tipSet.length; i++){
            if(e.target == _tipSet[i]){
                this._tipLabel.text = _tipMsg[i];
                this._tipGroup.x = _tipPosi[i]["x"];
                this._tipGroup.y = _tipPosi[i]["y"];
                this._tipGroup.visible = true;
                break;
            }
        }
	}*/

    /**
	 * 松开消失提示
	 */
	/*private onClickTipEnd(e){
        if(this._tipGroup.visible){
            this._tipGroup.visible = false;
        }
	}*/

	/**
	 * 点击开始活动，判断是否可以进入战场
	 */
	private onStartDown(e){
        NetManager.SendRequest(["func=" + "dailyactivity.checkJoin"],this.ReveiceCanJoin.bind(this));
    }

    /**
     * 判断是否可以进入战场消息返回
     */ 
    private ReveiceCanJoin(json){
        console.log(json);
        
        if(json["code"] != NetManager.SuccessCode){
            PromptManager.CreatCenterTip(false,true,StringMgr.GetText("dailyactivetext4"));
            return;
		}

        if(json["data"]["join"] == 0){
            PromptManager.CreatCenterTip(false,false,StringMgr.GetText("dailyactivetext5"),null,this.JoinDailyActiveGame.bind(this));
        }
        else{
            CheckpointManager.CurrentCheckpointID = CheckpointManager.DailyActiveActiveCheckpointID;
            if (WindowManager.RoleSelectWindow() == null){
                WindowManager.SetWindowFunction(this._OpenRoleSelect.bind(this));
                return;
            }
            this._OpenRoleSelect();
        }
    }

    /**
     * 花费瓶盖进入战场
     */
    private JoinDailyActiveGame(){
        NetManager.SendRequest(["func=" + "dailyactivity.toJoin"],this.ReveiceIsJoin.bind(this));
    }

    /**
     * 花费瓶盖进入战场消息返回
     */
    private ReveiceIsJoin(json){
        console.log(json);
        if(json["code"] != NetManager.SuccessCode){
            PromptManager.CreatCenterTip(false,true,StringMgr.GetText("dailyactivetext6"));
            return;
		}

        CheckpointManager.CurrentCheckpointID = CheckpointManager.DailyActiveActiveCheckpointID;
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
	 * 显示界面
	 */
	public Show(json: Object){
        if(json["data"]["prop"])
		    this._jiangchiNum = json["data"]["prop"];

        this._state = json["data"]["state"];

        if(json["data"]["score"])
            UnitManager.DailyActiveCurScore = json["data"]["score"];

        if(UnitManager.DailyActiveCurScore > UnitManager._dailyActiveMaxScore){
            UnitManager.DailyActiveCurScore = UnitManager._dailyActiveMaxScore;
        }

        this.updataShow();
	}

    /**
     * 更新页面
     */
    private updataShow(){
        this._pingGaiNumLabel.text = this._jiangchiNum.toString();
        if(this.State == "Active" /*&& UnitManager.DailyActiveCurScore < UnitManager._dailyActiveMaxScore*/){
            // this._yinheGroup.visible = true;
            // this._succGroup.visible = false;

            // let _bili = (UnitManager.DailyActiveCurScore/UnitManager._dailyActiveMaxScore);

            // this._leftTiaoIma.width = this._tiaoMaxWidth * _bili;
            // this._rightTiaoIma.width = this._tiaoMaxWidth * _bili;
            // this._niulangIma.x = 70 + this._renwuMoveX * _bili;
            // this._zhinvIma.x = 340 - this._renwuMoveX * _bili;

            this._startButton.enabled = true;
        }
        else{
            // this._yinheGroup.visible = false;
            // this._succGroup.visible = true;

            this._startButton.enabled = false;
        }
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
     * 获取活动状态
     */
    public get State(): string{
        return this._state;
    }


	private _isVisibled: boolean = false;                   // 是否显示

    private _bg: eui.Image;                                 // 背景
	private _pingGaiNumLabel: eui.Label;					// 奖池瓶盖数量文本
	private _startButton: eui.Button;						// 开始按钮
	private _closeButton: eui.Button;						// 关闭按钮

    private _lookRewardButton: eui.Button;                  // 点击查看奖励说明
    private _rewardTipGroup: eui.Group;                     // 奖励说明容器
    private _tipCloseButton: eui.Button;                    // 奖励说明关闭按钮

    private _rankButton: eui.Button;                        // 排名按钮
    // private _succGroup: eui.Group;                          // 成功汇合显示内容容器
    // private _yinheGroup: eui.Group;                         // 银河内容容器
    // private _leftTiaoIma: eui.Image;                        // 左边条
    // private _rightTiaoIma: eui.Image;                       // 右边条
    // private _tipGroup: eui.Group;                           // 奖励提示容器
    // private _tipLabel: eui.Label;                           // 奖励提示文本
    // private _rewardIma0: eui.Rect;                          // 奖励1
    // private _rewardIma1: eui.Rect;                          // 奖励2
    // private _rewardIma2: eui.Rect;                          // 奖励3
    // private _rewardIma3: eui.Rect;                          // 奖励4
    // private _rewardIma4: eui.Rect;                          // 奖励5
    // private _niulangIma: eui.Image;                         // 牛郎图片 70
    // private _zhinvIma: eui.Image;                           // 织女图片 340


    private _jiangchiNum: number = 0;						// 奖池数量
    private _state: string = "Active";                      // 活动状态

    // private _tiaoMaxWidth: number = 152;                    // 条的最大宽
    // private _renwuMoveX: number = 115;                      // 牛郎织女移动的距离

    private _dailyActiveMaxScore: number = 300000000;              // 最大日常活动积分

    private _rewardTipBg: eui.Image;                                // 奖励说明背景
    private _rewardTipLabel1: eui.Label;                            // 奖励说明1
    private _rewardTipLabel2: eui.Label;                            // 奖励说明2
    private _rewardTipLabel3: eui.Label;                            // 奖励说明3
}