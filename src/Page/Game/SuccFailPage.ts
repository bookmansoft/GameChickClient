/**
 * 游戏UI
 */
class SuccFailPage extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/SuccFailPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._lookEndButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLookEnd,this);
		this._sureButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLookEnd,this);
		this._shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
		this._shareRewardButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._scoreLabel.font = "succPageScore" + lg + "_fnt";
		this._rankLabel.font = "succPageRankNum" + lg + "_fnt";
		this._sureButton.skinName = SkinCreateMgr.CreateButton("chuanguansb_an_queding_l" + lg + "_png" ,"chuanguansb_an_queding_a" + lg + "_png");
		this._shareButton.skinName = SkinCreateMgr.CreateButton("chuanguancg_an_xuanyao_l" + lg + "_png" ,"chuanguancg_an_xuanyao_a" + lg + "_png");
		this._lookEndButton.skinName = SkinCreateMgr.CreateButton("chuanguancg_an_chakan_l" + lg + "_png" ,"chuanguancg_an_chakan_a" + lg + "_png");
		this._shareRewardButton.skinName = SkinCreateMgr.CreateButton("chuanguancg_an_fenxiang_l" + lg + "_png" ,"chuanguancg_an_fenxiang_a" + lg + "_png");
    }

	/**
	 * 点击分享
	 */
	private onShare(e:egret.TouchEvent){
		var textSet: string[] = GameConstData.ShareContent;
		if (textSet.length == 0){
			window["shareCont"] = FBSDKMgr.Share();
			window["share"]();
            // FBSDKMgr.Share("", "");
        }
        else{
			window["shareCont"] = FBSDKMgr.Share(textSet[0], textSet[1]);
			window["share"]();
            // FBSDKMgr.Share(textSet[0], textSet[1]);
        }
		
		NetManager.SendRequest(["func=" + NetNumber.ShareEnd + "&type=" + UnitManager.ChaoYueFriendShareType],
                            this._OnShareChaoYueReturn.bind(this));
	}

	/**
     * 超越好友分享完成返回
     */
    private _OnShareChaoYueReturn(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("超越好友分享返回错误，错误码：" + jsonData["code"]);
            return;
        }

		PromptManager.ShowGit(jsonData["data"]["bonus"]);

		this.onLookEnd(null);
    }

	/**
	 * 点击查看战绩
	 */
	private onLookEnd(e:egret.TouchEvent) {
		// this.IsVisibled = false;
		// this.onShow(true , null);

		if(WindowManager.EndWindow() == null){
			WindowManager.SetWindowFunction(this._OpenEndWindow.bind(this), this._bonus);
			return;
		}
		this._OpenEndWindow(this._bonus);
	}

	/**
     * 显示结算界面
     */
    private _OpenEndWindow(bonus: Object[]){
		egret.Tween.removeTweens(this);
		this.IsVisibled = false;
        WindowManager.EndWindow().Show(bonus);
    }


	/**
	 * 判断分享获得的奖励类型
	 */
	private judgeBounsIma(){
		// 设置奖励
		let _bonusData:Object[] = null;
		if (this._superBonus != null){
            // for (var i = 0; i < this._superBonus.length; i++){
                // var data: Object = this._superBonus[i];
				 _bonusData = PromptManager.GetBonusResData(this._superBonus,false);
            // }
        }
		return [_bonusData[0]["res"], _bonusData[0]["num"]];
	}

	/**
	 * 显示页面
	 */
	public onShow(ifWin:boolean, bouns: Object[], superBonus: Object[]){
		this._bonus = bouns;
		this._ifWin = ifWin;
		this._superBonus = superBonus;
		if (ifWin){
			SoundManager.PlayBackgroundMusic();
		}
		else {
			SoundManager.PlayFailBGMusic();
		}

		this.initSuccFailIma();
		this.IsVisibled = true;
	}

	/**
	 * 初始化
	 */
	private initSuccFailIma(){
		// Main.AddDebug("初始化成功失败界面");
        var lg: string = StringMgr.LanguageSuffix;
		if(this._ifWin){
			this._succFailIma.texture = RES.getRes("chuanguancg_di" + lg + "_png");
		}else{
			this._succFailIma.texture = RES.getRes("chuanguansb_di" + lg + "_png");
		}
		this._sureButton.visible = false;
		this._winGroup.visible = false;
	}

	/**
	 * 开场动画播放结束判断出现的是分数还是按钮
	 */
	private judegeShowWinScoreOrFailButton(){
		if(this._ifWin && !GuideManager.IsGuide){
			this.showWinScoreAni();
		}else{
			this.showFailScoreAni();
			this.SuccFailGuide();
		}
	}

	/**
	 * 显示成功分数还有超越动画
	 */
	private showWinScoreAni(){

		this._winGroup.visible = true;
		this._scoreLabel.text = "f" + Game.Instance.EndScore.toString();

		let _ifChaoYue = Game.Instance.judgeIsChaoYueFriend();

		// 排名显示
		if(Game.Instance.EndRankNum == 101){
			if(Game.Instance.FriendSet.length < 30){
				Game.Instance.EndRankNum = Game.Instance.FriendSet.length + 1;
				this._rankLabel.text = "d " + Game.Instance.EndRankNum.toString() + " m";
			}
			else this._rankLabel.text = "w";// 未上榜
		}else{
			this._rankLabel.text = "d " + Game.Instance.EndRankNum.toString() + " m";
		}


		// 排名没有变动
		if(_ifChaoYue == false){
			this._mohuIma.visible = false;
			this._downInfoGroup.visible = false;
			this._upInfoGroup.visible = false;
			this._upRankGroup.visible = false;
			this._shareRewardGroup.visible = false;

			this._lookEndButton.visible = true;
			this._shareButton.visible = true;
		}
		else{// 排名变动
			this._mohuIma.visible = false;

			
			let rankNum = 0;

			if(Game.Instance.playerInfo){
				rankNum = Math.abs(Game.Instance.EndRankNum - Game.Instance.LastRankNum);
			}else{
				rankNum = Math.abs(Game.Instance.EndRankNum - Game.Instance.FriendSet.length + 1);
			}

			this._upRankLabel.text = "+" + rankNum.toString();

			// 提升的角色的信息
			this._upInfoIcon.source = "touxiang_mr_jpg";
			// 加载资源，玩家自己的信息
			if(Game.Instance.playerInfo){
				if(Game.Instance.playerInfo["icon"] != ""){
					let imaLoad = new egret.ImageLoader();
					imaLoad.load(Game.Instance.playerInfo["icon"]);
					imaLoad.addEventListener(egret.Event.COMPLETE,
						function (){
							this._upInfoIcon.source = imaLoad.data;
						},this);
				}
				this._upInfoNameLabel.text = decodeURIComponent(Game.Instance.playerInfo["name"]);
			}else{
				this._upInfoNameLabel.text = UnitManager.Player.Name;
				this._upInfoIcon.source = UnitManager.Player.HearUrl;
			}
			this._upInfoScoreLabel.text = Game.Instance.EndScore.toString();


			// 降级的角色的信息
			this._downInfoIcon.source = "touxiang_mr_jpg";
			// 加载资源
			if(Game.Instance.chaoYueFriendInfo[3] != ""){
				let imaLoad = new egret.ImageLoader();
				imaLoad.load(Game.Instance.chaoYueFriendInfo[3]);
				imaLoad.addEventListener(egret.Event.COMPLETE,
					function (){
						this._downInfoIcon.source = imaLoad.data;
					},this);
			}
			this._downInfoNameLabel.text = decodeURIComponent(Game.Instance.chaoYueFriendInfo[1]);
			this._downInfoScoreLabel.text = Game.Instance.chaoYueFriendInfo[2];


			this._shareRewardIma.texture = RES.getRes(this.judgeBounsIma()[0]);
			this._shareRewardNumLabel.text = "x " + this.judgeBounsIma()[1];


			// 降级的角色的信息
			this._downInfoGroup.visible = true;
			this._upInfoGroup.visible = true;

			this._upInfoGroup.x = 250;
			this._upInfoGroup.y = 875;
			this._downInfoGroup.x = 10;
			this._downInfoGroup.y = 727;
			this._lookEndButton.visible = false;
			this._shareButton.visible = false;
			this._shareRewardGroup.visible = false;

			this.friendInfoChange();
			this.friendInfoUpImaAni();
			this.friendInfoDownImaAni();
		}
	}

	/**
	 * 显示失败按钮
	 */
	private showFailScoreAni(){
		this._sureButton.visible = true;

	}

	/**
	 * 好友信息交换
	 */
	private friendInfoChange(){
		egret.Tween.removeTweens(this._upInfoGroup);

		this._upInfoGroup.scaleX = 1;
		this._upInfoGroup.scaleY = 1;

		egret.Tween.get(this._upInfoGroup).to({x:185,y:690,scaleX:1.111,scaleY:1.111},125).to({x:10,y:727,scaleX:0.95,scaleY:0.95},83).call(function(){

			egret.Tween.get(this._upInfoGroup).wait(125).to({scaleX:1,scaleY:1});

			this._upRankGroup.visible = true;
			this.RankImaAni();
			this.RankWenZhiAni();

			this._mohuIma.visible = true;
			this.friendInfoMoHuAni();
			egret.Tween.get(this._downInfoGroup).to({x:250,y:875},300).wait(4000).call(this.sureBttonXianShi.bind(this));
		}.bind(this))
	}

	/**
	 * 人物信息交换白光动画
	 */
	private friendInfoMoHuAni(){
		egret.Tween.removeTweens(this._mohuIma);
		this._mohuIma.scaleX = 1;
		this._mohuIma.scaleY = 1;
		this._mohuIma.anchorOffsetX = this._mohuIma.width/2;
		this._mohuIma.anchorOffsetY = this._mohuIma.height/2;
		this._mohuIma.y = 800;
		this._mohuIma.x = 270;

		egret.Tween.get(this._mohuIma).wait(50).to({scaleX:1.2,scaleY:0.143},125).to({scaleX:2,scaleY:0.033},42).call(function(){
				this._mohuIma.visible = false;
		}.bind(this));
	}

	/**
	 * 人物信息提升图标动画
	 */
	private friendInfoUpImaAni(){
		egret.Tween.removeTweens(this._upAniIma);
		this._upAniIma.y = -30;
		egret.Tween.get(this._upAniIma).to({y:-50},500).call(this.friendInfoUpImaAni.bind(this));
	}
	/**
	 * 人物信息降级图标动画
	 */
	private friendInfoDownImaAni(){
		egret.Tween.removeTweens(this._downAniIma);
		this._downAniIma.y = 25;
		egret.Tween.get(this._downAniIma).to({y:35},900).call(this.friendInfoDownImaAni.bind(this));
	}
	/**
	 * 排名升级图标动画
	 */
	private RankImaAni(){
		egret.Tween.removeTweens(this._upRankAniIma);
		this._upRankAniIma.y = 0;
		egret.Tween.get(this._upRankAniIma).to({y:-10},300).to({y:0},300).to({y:10},300).to({y:0},300).call(this.RankImaAni.bind(this));
	}
	/**
	 * 排名升级文字动画
	 */
	private RankWenZhiAni(){
		egret.Tween.removeTweens(this._upRankLabel);
		this._upRankLabel.y = 60;
		this._upRankLabel.alpha = 0;
		egret.Tween.get(this._upRankLabel).to({y:10,alpha:1},700).wait(1000).to({y:-50,alpha:0},700);
	}
	

	/**
     * 闯关成功,超越好友动画结束出现按钮
     */
    private sureBttonXianShi(){
		this._mohuIma.visible = false;
		this._downInfoGroup.visible = false;
		this._upInfoGroup.visible = false;
		egret.Tween.removeTweens(this._upInfoGroup);
		egret.Tween.removeTweens(this._downInfoGroup);
		egret.Tween.removeTweens(this._upAniIma);
		egret.Tween.removeTweens(this._downAniIma);

        this._lookEndButton.visible = true;
		this._shareRewardGroup.visible = true;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
			this.showAni();
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
	 * 出现动画
	 */
	private showAni(){

		this._bg.anchorOffsetX = this._bg.width/2;
		this._bg.anchorOffsetY = this._bg.height/3;
		this._bg.scaleX = 0;
		this._bg.scaleY = 0;
		this._bg.x = this._bg.width/2;
		this._bg.y = this._bg.height/3;
		egret.Tween.get(this._bg).to({scaleX:1,scaleY:1},208);

		this._succFailIma.anchorOffsetX = this._succFailIma.width/2;
		this._succFailIma.anchorOffsetY = this._succFailIma.height/2;
		this._succFailIma.scaleX = 0;
		this._succFailIma.scaleY = 0;
		this._succFailIma.y = 430;
		egret.Tween.get(this._succFailIma).to({scaleX:1,scaleY:1},208).to({scaleX:1.037,scaleY:1.037},83).to({scaleX:1,scaleY:1},83).wait(125).
		call(this.judegeShowWinScoreOrFailButton.bind(this));
	}

	/**
     * 确定结果引导
     */
    public SuccFailGuide(){
        if (!this.IsVisibled) return;
		if(GuideManager.IsGuide && GuideManager.GuideID == 8){
			var x: number = this._sureButton.x;
			var y: number = this._sureButton.y;
			var width: number = this._sureButton.width;
			var height: number = this._sureButton.height;
			GuideManager.ShowGuideWindow(0, x, y, width, height);
		}
    }


	private _isVisibled: boolean = false;           					// 是否显示

	private _bg: eui.Image;												// 背景
	private _succFailIma: eui.Image;									// 成功失败图片
	private _lookEndButton: eui.Button;									// 查看战绩按钮
	private _shareButton: eui.Button;									// 分享按妞

	private _shareRewardGroup: eui.Group;								// 分享获得奖励容器
	private _shareRewardButton: eui.Button;								// 分享获得奖励按妞
	private _shareRewardIma: eui.Image;									// 分享获得的奖励图片
	private _shareRewardNumLabel: eui.Label;							// 超越好友分享奖励数量文本

	private _upRankGroup: eui.Group;									// 升级排名的文本动画容器
	private _upRankAniIma: eui.Image;									// 提升排名的提升图标
	private _upRankLabel: eui.BitmapLabel;								// 升级排名的文本

	private _upInfoGroup: eui.Group;									// 升级的人物信息的容器
	private _upAniIma: eui.Image;										// 信息升级图标
	private _upInfoIcon: eui.Image;										// 信息升级人物头像
	private _upInfoNameLabel: eui.Label;								// 信息升级人物名字
	private _upInfoScoreLabel: eui.Label;								// 信息升级人物分数

	private _downInfoGroup: eui.Group;									// 降级的人物信息的容器
	private _downAniIma: eui.Image;										// 信息降级图标
	private _downInfoIcon: eui.Image;									// 信息降级人物头像
	private _downInfoNameLabel: eui.Label;								// 信息降级人物名字
	private _downInfoScoreLabel: eui.Label;								// 信息降级人物分数

	private _mohuIma: eui.Image;										// 模糊背景图片

	private _rankLabel: eui.BitmapLabel;								// 玩家当前排名
	private _scoreLabel: eui.BitmapLabel;								// 玩家当前得分

	private _sureButton: eui.Button;									// 确认按钮
	private _winGroup: eui.Group;										// 获胜的资源容器

	private _ifWin: boolean;											// 是否胜利
	private _bonus: Object[];											// 奖励
	private _superBonus: Object[];										// 超越分享奖励

	

	// private _friendSet: string[][] = [];               					// 所有好友信息
	// private _chaoyueFriend: string[];               					// 超越的好友的信息
	// private _rankNum: number;											// 排名
}