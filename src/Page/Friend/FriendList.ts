/**
 * 好友列表
 */
class FriendList extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/FriendListSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._zhaoButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onZhaoHuanDown,this);
		this._zanButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onZanDown,this);
		this._shouButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShouDown,this);
		
		GameEvent.AddEventListener(EventType.ShouHello, this.upDataShow, this);

		// 好友状态改变
		GameEvent.AddEventListener(EventType.FriendChangState, this.upDataShow, this);
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._zhaoButton.skinName = SkinCreateMgr.CreateButton("zhaohui_l" + lg + "_png", "zhaohui_a" + lg + "_png");
        this._zanButton.skinName = SkinCreateMgr.CreateButton("dianzan_l" + lg + "_png", "dianzan_a" + lg + "_png", "dianzan_off" + lg + "_png");
        this._shouButton.skinName = SkinCreateMgr.CreateButton("shouqu_l" + lg + "_png", "shouqu_a" + lg + "_png");

		this._zanButton.enabled = true;
		
		// 点赞的状态
		if(this._zanState == null || this._zanState != 0)
			this._zanButton.enabled = false;
		else this._zanButton.enabled = true;
    }

	/**
	 * 侦听到收取的事件
	 */
	private upDataShow(){
		if(this._shouState != this._curFriend.ShouZan){
			this.upDateShow(this._curFriend);
		}

		if(this._curState != this._curFriend.CurState){
			this.upDateShow(this._curFriend);
		}
	}

	/**
	 * 点击收取
	 */
	private onShouDown(e){
        SoundManager.PlayButtonMusic();
		NetManager.SendRequest(["func=bonusHello" + "&openid=" + this._curFriend.OpenID],
                                this.onShouReturn.bind(this));
	}

	/**
	 * 收取返回
	 */
	private onShouReturn(jsonData: Object){
		if(jsonData["code"] == NetManager.SuccessCode){
			this._curFriend.ShouZan -= 1;
			PromptManager.ShowGit(jsonData["data"]);
			this.upDateShow(this._curFriend);
			GameEvent.DispatchEvent(EventType.ShouHello);
		}
	}

	/**
	 * 点击点赞
	 */
	private onZanDown(e){
        SoundManager.PlayButtonMusic();
		NetManager.SendRequest(["func=index.sendHello" + "&actionType="+ NetNumber.SendHelloNum
                            + "&openid=" + this._curFriend.OpenID],
                                this.onZanReturn.bind(this));
	}

	/**
	 * 点赞返回
	 */
	private onZanReturn(jsonData){
		if(jsonData["code"] != NetManager.SuccessCode){
			return;
		}
		this._curFriend.QinMiNum += 1;
		this._curFriend.SendZan += 1;
		this.upDateShow(this._curFriend);
	}

	/**
	 * 点击召唤
	 */
	private onZhaoHuanDown(e){
        SoundManager.PlayButtonMusic();
		window["shareCont"] = FBSDKMgr.Share();
		window["share"]();
		// FBSDKMgr.ShareFriend(this._curFriend.OpenID);
	}

	/**
	 * 更新
	 * $friendData 好友信息
	 */
	public upDateShow($friend: Friend){
		this._curFriend = $friend;

		// 测试显示
		this._qinmiLabel.text = this._curFriend.QinMiNum.toString();
		this._nameLabel.text = this._curFriend.Name;
		this._scoreLabel.text = StringMgr.GetText("friendpagetext1") + this._curFriend.MaxScore.toString();

		if(this._iconImaSource != this._curFriend.IconRes)
			this._friendIcon.source = RES.getRes("touxiang_mr_jpg");

		// 加载资源
		if(this._curFriend.IconRes != ""){
			let imaLoad = new egret.ImageLoader();
			imaLoad.load(this._curFriend.IconRes);
			imaLoad.addEventListener(egret.Event.COMPLETE,
				function (){
					this._friendIcon.source = imaLoad.data;
					this._iconImaSource = this._curFriend.IconRes;
				},this);
		}

		this._curState = this._curFriend.CurState;// 玩家状态

		this._zanState = this._curFriend.SendZan;
		this._shouState = this._curFriend.ShouZan;

		this.updataButton();

		// 好友游戏状态文本显示
		if ($friend.IsGaming){
			this._curStateLabel.textColor = 0xc85f02;
			this._curStateLabel.text = StringMgr.GetText("friendpagetext2");
		}
		else if ($friend.IsOnline){
			this._curStateLabel.textColor = 0x54aa35;
			this._curStateLabel.text = StringMgr.GetText("friendpagetext3");
		}
		else {
			this._curStateLabel.textColor = 0xce4728;
			this._curStateLabel.text = StringMgr.GetText("friendpagetext4");
		}

		// 召唤按钮状态
		// if(this._curState == 0){
		// 	this._zhaoButton.visible = true;
		// }else{
		// 	this._zhaoButton.visible = false;
		// }

		
	}

	/**
	 * 更新按钮状态
	 */
	private updataButton(){
		// 点赞的状态
		if(this._zanState != 0)
			this._zanButton.enabled = false;
		else this._zanButton.enabled = true;
		

		// 收取的状态
		if(this._shouState > 0){
			this._shouButton.visible = true;
			this._zanButton.visible = false;
			this._redIma.visible = true;
		}else{
			this._shouButton.visible = false;
			this._zanButton.visible = true;
			this._redIma.visible = false;
		}

		// 好友机器人按钮状态
		if(this._curFriend.OpenID == "-1"){
			this._shouButton.visible = false;
			this._zanButton.visible = false;
		}
	}

	private _qinmiLabel: eui.Label;					// 亲密度
	private _friendIcon: eui.Image;					// 好友头像
	private _nameLabel: eui.Label;					// 玩家昵称
	private _scoreLabel: eui.Label;					// 玩家分数
	private _curStateLabel: eui.Label;				// 玩家在线状态文本

	private _redIma: eui.Image;						// 红点

	private _zhaoButton: eui.Button;				// 召唤按钮
	private _zanButton: eui.Button;					// 点赞按钮
	private _shouButton: eui.Button;				// 收取按钮
	private _zanState: number;						// 点赞的状态
	private _shouState: number;						// 收取的状态
	private _curState: number;						// 在线状态

	private _curFriend: Friend;						// 存储好友数据
	private _iconImaSource: string;					// 存储好友头像链接

}