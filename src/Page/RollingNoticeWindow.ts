/**
 * 滚动公告，走马灯页面
 */
class RollingNoticeWindow extends eui.Component{
	public constructor() {
		super();
		this.skinName = "resource/game_skins/RollingNoticeWindowSkins.exml";
	}

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this.touchEnabled = false;
		this.touchChildren = false;
		this._noticeLabel.mask = this._maskRect;
	}


	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.MainTopLayer.addChild(this);
        }
        else{
            Main.MainTopLayer.removeChild(this);
        }
    }


	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
	 * 显示走马灯
	 */
	public Show(){
		this.IsVisibled = true;
		if (RollingNoticeManager.RollingNoticeSet.length <= 0){
            this.IsVisibled = false;
            return;
        }

		this._noticeLabel.x = 508;

		let noticeObject = RollingNoticeManager.RollingNoticeSet.shift();
		let msg: string = StringMgr.GetText(RollingNoticeManager.RollingNoticeMsgSet[noticeObject["id"]]["text"]);

		if(noticeObject["name"])
			msg = msg.replace("&name", decodeURIComponent(noticeObject["name"]));

		if(noticeObject["roldId"])
			msg = msg.replace("&role", UnitManager.GetRole(noticeObject["roldId"]).Name);

		if(noticeObject["gateId"])
			msg = msg.replace("&chapter", noticeObject["gateId"]);
	
		if(noticeObject["dst"])
			msg = msg.replace("&slave", decodeURIComponent(noticeObject["dst"]));
		if(noticeObject["src"])
			msg = msg.replace("&name", decodeURIComponent(noticeObject["src"]));

		this._noticeLabel.text = msg;
		this._noticeLabel.width = msg.length * 23;

		let _moveX: number = this._maskRect.width + this._noticeLabel.width;
		egret.Tween.get(this._noticeLabel).to({x:133 - this._noticeLabel.width} , _moveX/150 * 1000).call(this.Show.bind(this));
	}


	private _isVisibled: boolean = false;       			// 是否显示
	private _maskRect: eui.Rect;							// 遮罩
	private _noticeLabel: eui.Label;						// 消息文本


	private _noticeSet: any[] = [];							// 消息集合
	// private _isMove: boolean = false;						// 是否在移动走马灯

}