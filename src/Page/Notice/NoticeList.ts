/**
 * 单个消息
 */
class NoticeList extends eui.Component{
	public constructor() {
		super();
		this.skinName = "resource/game_skins/NoticeListSkins.exml";
	}

	protected createChildren():void{
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	/**
	 * 更新显示
	 */
	public upDateShow($data: Notice, $id: number){
		this._curNotice = $data;
		this._noticePosiId = $id;

		this._group1.visible = this._curNotice.Bonus.length == 0?true:false;
		this._group2.visible = this._curNotice.Bonus.length == 0?false:true;

		// 显示有奖励没奖励
		if(this._group1.visible == true){
			this._information1.text = this._curNotice.Des;
		}
		else if(this._group2.visible == true){
			this._information2.text = this._curNotice.Des;

			let bonusRes = this._curNotice.BonusRes;
			
			for(let i = 0; i< bonusRes.length; i++){
				if(i == 0){
					this._itemGroup1.visible = true;
					this._itemGroup2.visible = false;
					this._itemIcon1.texture = RES.getRes(bonusRes[i]["res"]);
					this._itemNumLabel1.text = bonusRes[i]["num"].toString();
				}else{
					this._itemGroup2.visible = true;
					this._itemIcon2.texture = RES.getRes(bonusRes[i]["res"]);
					this._itemNumLabel2.text = bonusRes[i]["num"].toString();
				}
			}
		}

		if(this.isRead){
			this._redIma.visible = false;
		}else{
			this._redIma.visible = true;
		}


		// 时间判断显示
		
		let _curTime = (new Date()).getTime()/1000 | 0;

		let _lesTime = _curTime - this._curNotice.Time;
        var s: number = _lesTime % 60;								//秒
        var m: number = Math.floor((_lesTime % 3600) / 60);			//分
        var h: number = Math.floor(_lesTime / 3600 % 24);			//小时
		var d: number = Math.floor(_lesTime / (3600 * 24));			//天
		var z: number = Math.floor(d/7);							//周
		var y: number = Math.floor(d/30);							//月
		var n: number = Math.floor(y/12);							//年

		if(n > 0){
			this._timeLabel.text = n + StringMgr.GetText("noticepagetext1");
		}
		else if(y > 0){
			this._timeLabel.text = y + StringMgr.GetText("noticepagetext2");
		}
		else if(z > 0){
			this._timeLabel.text = z + StringMgr.GetText("noticepagetext3");
		}
		else if(d > 0){
			this._timeLabel.text = d + StringMgr.GetText("noticepagetext4");
		}
		else if(h > 0){
			this._timeLabel.text = h + StringMgr.GetText("noticepagetext5");
		}
		else if(m > 0){
			this._timeLabel.text = m + StringMgr.GetText("noticepagetext6");
		}
		else if(s >= 0){
			this._timeLabel.text = s + StringMgr.GetText("noticepagetext7");
		}
		else if (s < 0){
			this._timeLabel.text = "0" + StringMgr.GetText("noticepagetext7");
		}
	}

	/**
     * 点击右键阅读
     */
    private onTap(e: egret.TouchEvent){
		if(this.isRead == false)
			NetManager.SendRequest(["func=" + NetNumber.SendNoticeRead + "&idx=" + this._noticePosiId], this._ReviceReadNotice.bind(this));
    }

	/**
	 * 阅读回调
	 */
	private _ReviceReadNotice(json: Object){
		if(json["code"] == NetManager.SuccessCode){
			NoticeManager.GetNoticeByPosiId(this._noticePosiId).IsRead = true;
			this.upDateShow(this._curNotice,this._noticePosiId);
			if(this._curNotice.Bonus.length > 0)
				PromptManager.ShowGit(this._curNotice.Bonus);
			GameEvent.DispatchEvent(EventType.NoticeUpDataResIma);
		}
	}

	/**
	 * 获取是否阅读过
	 */
	public get isRead(): boolean{
		return this._curNotice.IsRead;
	}
	

	private _group1:eui.Group;								// 纯文字集合

	private _group2:eui.Group;								// 带奖励的文字集合
	private _itemGroup1: eui.Group;							// 奖励容器1
	private _itemGroup2: eui.Group;							// 奖励容器2

	private _information1:eui.Label;						// 纯文字内容
	private _information2:eui.Label;						// 带附件文字内容

	private _itemIcon1:eui.Image;							// 附件图片1
	private _itemIcon2:eui.Image;							// 附件图片2
	private _itemNumLabel1:eui.BitmapLabel;					// 附件图片1数量
	private _itemNumLabel2:eui.BitmapLabel;					// 附件图片2数量

	private _timeLabel:eui.Label;							// 经过多少时间的消息
	private _curNotice:Notice;								// 当前消息

	private _redIma: eui.Image;								// 红点
	private _noticePosiId: number;							// 位置id
}