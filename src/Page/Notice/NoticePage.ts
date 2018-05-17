/**
 * 消息页面
 */
class NoticePage extends AWindow{
	public constructor() {
		super();
		this.skinName = "resource/game_skins/NoticePageSkins.exml";
	}

	public createChildren():void{
		super.createChildren();
        //联调用数据连接
        GameEvent.AddEventListener(EventType.NoticeUpData, this.updataShow.bind(this), this);
        GameEvent.AddEventListener(EventType.NoticeUpDataResIma, this.updataShow.bind(this), this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._noticeRadio.skinName = SkinCreateMgr.CreateRadioButton("xiaoxi_xitong_l" + lg + "_png", "xiaoxi_xitong_a" + lg + "_png");
        this.updataShow();
    }

	/**
	 * 更新显示
	 */
	public updataShow(){

		let _height: number = 0;
        let _sysRedImaVisible: boolean = false;
        if(NoticeManager.AllNoticeSet == null) return;
        for(var i = 0; i < NoticeManager.AllNoticeSet.length; i++){

			let _noticeList = this._GetList(i);
			this._group.addChild(_noticeList);

            let id = NoticeManager.AllNoticeSet.length - i - 1;
			_noticeList.upDateShow(NoticeManager.AllNoticeSet[NoticeManager.AllNoticeSet.length - i - 1], id);
			_noticeList.y = _height;
			_height = _noticeList.y + _noticeList.height;

            if(NoticeManager.AllNoticeSet[NoticeManager.AllNoticeSet.length - i - 1].IsRead == false){
                _sysRedImaVisible = true;
            }
		}

        this._sysRedIma.visible = _sysRedImaVisible;
	}

	/**
     * 返回一个消息列
     */
    private _GetList(index: number): NoticeList{
        let list: NoticeList = null;
        if (index < this._noticeSet.length){
            list = this._noticeSet[index];
        }
        else{
            list = new NoticeList();
            this._noticeSet.push(list);
        }
        return list;
    }

    /**
     * 获取消息列表数据
     */
    private _GetData(){
        // 初始化列表
        for (let i = 0; i < this._noticeSet.length; i++){
            if (this._noticeSet[i].parent != null){
                this._group.removeChild(this._noticeSet[i]);
            }
        }
        NetManager.SendRequest(["func=" + NetNumber.GetNoticeList], NoticeManager.updataNoticeReturn.bind(NoticeManager));
    }

	
	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._GetData();
        }
        else{
            // this.SendNoticeRead();
            Main.Instance.WindowBottomLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }
	

    private _isVisibled: boolean = false;       // 是否显示
	private _scroller: eui.Scroller;			// 滚动区域
	private _group: eui.Group;					// 显示容器
    private _noticeRadio: eui.RadioButton;      // 系统消息按钮
    private _sysRedIma: eui.Image;              // 系统消息红点

	private _noticeSet: NoticeList[] = [];		// 消息集合
} 