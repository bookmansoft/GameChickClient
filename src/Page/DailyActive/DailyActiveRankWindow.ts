/**
 * 日常活动排行榜
 */
class DailyActiveRankWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/DailyAcitveRankWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseDown,this);
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._bg.source = "huodong_paihang_di" + lg + "_png";
    }

	/**
	 * 点击关闭
	 */
	private onCloseDown(e){
		this.IsVisibled = false;
	}

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
			this._GetData();
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
     * 获取排行榜数据
     */
    private _GetData(){
        // 获取总排行榜信息
        NetManager.SendRequest(["func=" + NetNumber.DailyActiveRank], this._ReveiveActivityRank.bind(this));
    }

	/**
     * 接受活动排行信息
     */
    private _ReveiveActivityRank(jsonData: Object){
        let code: number = jsonData["code"];

        if(code == NetManager.SuccessCode){
            this._rankObjectSet = jsonData["data"]["list"];
			this._myRankInfo = jsonData["data"]["user"];
        }

        this._UpdataShow();
    }

	/**
     * 更新显示
     */
    private _UpdataShow(){

		this._rankTypeLabel.text = WindowManager.DailyActiveStartWindow().State == "Active" ?
																	 StringMgr.GetText("dailyactivetext1"): 
																	 StringMgr.GetText("dailyactivetext2");

		// 初始化列表
		for (let i = 0; i < this._dailyAcitveRankListSet.length; i++){
			if (this._dailyAcitveRankListSet[i].parent != null){
				this._listGroup.removeChild(this._dailyAcitveRankListSet[i]);
			}
		} 

		let _rankNum: number = 0;
		let _ifPlayer: boolean = false;

		// 添加显示信息
		let index: number = 0;
		let listY: number = 0;
		let list: DailyActiveRankList = null;

		for (let j = 0; j < this._rankObjectSet.length; j++){
			if(this._rankObjectSet[j]["rank"] != 0 && j < 10){
				list = this._GetRankList(index);

				list.SetData(this._rankObjectSet[j]);
				this._listGroup.addChild(list);
				list.y = listY;
				index += 1;
				listY += list.height;
			}
		}


		if(this._myRankInfo != null){
			if(this._myRankInfo["rank"] > 0){
				this._myRankLabel.text = this._myRankInfo["rank"].toString();
			}else{
				this._myRankLabel.text = StringMgr.GetText("dailyactivetext3");
			}

			this._myNameLabel.text = UnitManager.Player.Name;
			
			this._myScoreLabel.text = this._myRankInfo["score"].toString();

			if(this._iconImaSource != this._myRankInfo["icon"])
            	this._myUserIma.source = "touxiang_mr_jpg";

			// 加载资源
			if(this._myRankInfo["icon"] != ""){
				let imaLoad = new egret.ImageLoader();
				imaLoad.load(this._myRankInfo["icon"]);
				imaLoad.addEventListener(egret.Event.COMPLETE,
					function (){
						this._myUserIma.source = imaLoad.data;
						this._iconImaSource = this._myRankInfo["icon"];
					},this);
			}

			this._bonusNumLabel.text = this._myRankInfo["bonus"].toString();
			this._myScoreLabel.visible = WindowManager.DailyActiveStartWindow().State == "Active" ? true: false;
			this._bonusGroup.visible = WindowManager.DailyActiveStartWindow().State == "Active" ? false: true;

		}else{
			this._myRankLabel.text = StringMgr.GetText("dailyactivetext3");
			this._myNameLabel.text = UnitManager.Player.Name;
			this._myScoreLabel.text = "0";
			this._myScoreLabel.visible = WindowManager.DailyActiveStartWindow().State == "Active" ? true: false;
			this._bonusGroup.visible = WindowManager.DailyActiveStartWindow().State == "Active" ? false: true;
			this._myUserIma.source = "touxiang_mr_jpg";
		}
		
    }

	/**
     * 返回一个排名列表
     */
    private _GetRankList(index: number): DailyActiveRankList{
        let list: DailyActiveRankList = null;
        if (index < this._dailyAcitveRankListSet.length){
            list = this._dailyAcitveRankListSet[index];
        }
        else{
            list = new DailyActiveRankList();
            this._dailyAcitveRankListSet.push(list);
        }
        return list;
    }


	private _isVisibled: boolean = false;                   // 是否显示
	
	private _bg: eui.Image;									// 背景图片
	private _closeButton: eui.Button;						// 关闭按钮
	private _listGroup: eui.Group;							// 排行容器
	private _rankObjectSet: Object[] = [];					// 排行数据集合
	private _myRankInfo: Object;							// 玩家自己的信息
	
	private _dailyAcitveRankListSet: DailyActiveRankList[] = [];		// 日常活动排行列表集合

	private _myRankLabel: eui.Label;						// 玩家自己的排名
	private _myNameLabel: eui.Label;						// 玩家自己的名字
	private _myScoreLabel: eui.Label;						// 玩家自己的分数
	private _myUserIma: eui.Image;							// 玩家自己的头像

	private _iconImaSource: string;					   		// 存储头像链接
	private _rankTypeLabel: eui.Label;						// 显示排名内容

	private _bonusGroup: eui.Group;							// 玩家自己的奖励
	private _bonusNumLabel: eui.Label;						// 奖励数量
}