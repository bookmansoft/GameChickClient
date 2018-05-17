/**
 * 等待页面
 */
class SlaveCatchWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/SlaveCatchWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._bg.source = "nulizhuabu_di" + lg + "_png";
    }

    /**
     * 关闭按钮点击响应
     */
    private _OnCloseClick(){
        this.IsVisibled = false;
    }

    /**
     * 更新界面
     */
    private _UpdateShow(){
        var list: Friend[] = FriendManager.CatchList;
        if (list == null) return;
        while(this._showListSet.length > 0){
            var page: SlaveCatchList = this._showListSet.shift();
            this._listGroup.removeChild(page);
            this._listSet.push(page);
        }
        var pageY: number = 0;
        for (var i = 0; i < list.length; i++){
            var page: SlaveCatchList;
            if (this._listSet.length > 0){
                page = this._listSet.shift();
            }
            else {
                page = new SlaveCatchList();
            }
            page.SetData(list[i]);
            page.y = pageY;
            this._listGroup.addChild(page);
            this._showListSet.push(page);
            pageY += page.height;
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
            this._UpdateShow();
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


    // 变量
	private _isVisibled: boolean = false;                       // 是否显示
    private _bg: eui.Image;                                     // 背景图片
    private _listGroup: eui.Group;                              // 列表按钮
    private _closeButton: eui.Button;                           // 关闭按钮
    private _isCreated: boolean = false;                        // 是否创建完成
    private _listSet: SlaveCatchList[] = [];                    // 抓捕列表
    private _showListSet: SlaveCatchList[] = [];                // 显示列表
}