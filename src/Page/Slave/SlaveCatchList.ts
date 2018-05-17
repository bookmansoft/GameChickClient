/**
 * 等待页面
 */
class SlaveCatchList extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/SlaveCatchListSkins.exml";
        this.width = 466;
        this.height = 130;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        this._catchButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCatchClick, this);

        if (this._friend != null){
            this.SetData(this._friend);
        }
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._catchButton.skinName = SkinCreateMgr.CreateButton("nuli_an_zhuabuh_l" + lg + "_png", "nuli_an_zhuabuh_a" + lg + "_png");
    }

    /**
     * 抓捕点击响应
     */
    private _OnCatchClick(){
        SoundManager.PlayButtonMusic();
        if (!SlaveManager.CanCatch){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext2"));
            return;
        }
        WindowManager.WaitPage().IsVisibled = true;
        NetManager.SendRequest(["func=" + NetNumber.SendHello, "&actionType=3101", "&openid=" + this._friend.OpenID]);
    }

    /**
     * 设置数据
     */
    public SetData(friend: Friend){
        this._friend = friend;
        if (!this._isCreated){
            return;
        }

        if(this._iconImaSource != friend.IconRes)
			this._headImage.source = RES.getRes("touxiang_mr_jpg");

		// 加载资源
		if(friend.IconRes != ""){
			let imaLoad = new egret.ImageLoader();
			imaLoad.load(friend.IconRes);
			imaLoad.addEventListener(egret.Event.COMPLETE,
				function (){
					this._headImage.source = imaLoad.data;
					this._iconImaSource = this._friend.IconRes;
				},this);
		}
        
        this._nameLabel.text = friend.Name;
        if (friend.IsSlave){
            this._shenfenLabel.text = StringMgr.GetText("slavepagetext3");
            this._catchButton.visible = false;
        }
        else if (friend.IsMaster){
            this._shenfenLabel.text = StringMgr.GetText("slavepagetext4");
            this._catchButton.visible = true;
        }
        else if (friend.IsFreed){
            this._shenfenLabel.text = StringMgr.GetText("slavepagetext5");
            this._catchButton.visible = true;
        }
    }


    // 变量 
    private _isCreated: boolean = false;                        // 是否创建完成
    private _headImage: eui.Image;                              // 头像图片
    private _nameLabel: eui.Label;                              // 名字文本
    private _shenfenLabel: eui.Label;                           // 身份文本
    private _catchButton: eui.Button;                           // 抓捕按钮

    private _friend: Friend;                                    // 当前显示对象
    private _iconImaSource: string;					            // 存储好友头像链接
}