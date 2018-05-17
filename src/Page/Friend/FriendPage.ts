/**
 * 好友界面
 */
class FriendPage extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/FriendPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._scroller.bounces = false;
        GameEvent.AddEventListener(EventType.FriendUpData, this.upDataReturn, this);
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._UpdataShow();
        }
        else{
            Main.Instance.WindowBottomLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

    /**
     * 监听到好友信息更新
     */
    private upDataReturn(){
        if(this._isVisibled){
            this._UpdataShow();
        }  
    }

	/**
     * 更新显示
     */
    private _UpdataShow(){
        if(FriendManager.AllFrienSet.length == 0 && FriendManager.JiQiFriend == null) return;

        this._scroller.viewport.scrollV = 0;


		let _listHeight = 0;
        
        let jiqiNum = 0;

        if(FriendManager.JiQiFriend != null){
            jiqiNum = 1;
        }

        // 初始化列表
        for (let i = 0; i < this._listSet.length; i++){
            if (this._listSet[i].parent != null){
                this._friendGroup.removeChild(this._listSet[i]);
            }
        }
        // 添加显示信息
        let index: number = 0;
        let listY: number = 0;
        let list: FriendList = null;
        if(FriendManager.JiQiFriend != null){
            list = this._GetList(index);
            list.upDateShow(FriendManager.JiQiFriend);
            this._friendGroup.addChild(list);
            list.y = listY;
            index += 1;
            listY += list.height;
        }
        for (let j = 0; j < FriendManager.AllFrienSet.length; j++){
            list = this._GetList(index);
            list.upDateShow(FriendManager.AllFrienSet[j]);
            this._friendGroup.addChild(list);
            list.y = listY;
            index += 1;
            listY += list.height;
        }
    }

    /**
     * 返回一个好友列表
     */
    private _GetList(index: number): FriendList{
        let list: FriendList = null;
        if (index < this._listSet.length){
            list = this._listSet[index];
        }
        else{
            list = new FriendList();
            this._listSet.push(list);
        }
        return list;
    }

	// 变量
    private _isVisibled: boolean = false;       // 是否显示
	private _listSet: FriendList[] = [];        // 列表集合

	private _scroller: eui.Scroller;			// 滚动区域
	private _friendGroup: eui.Group;			// 显示容器

    private _bonus: Object[];					// 收取的奖励
}