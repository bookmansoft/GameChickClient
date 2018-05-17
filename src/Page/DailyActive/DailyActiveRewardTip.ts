/**
 * 日常活动获得奖励界面
 */
class DailyActiveRewardTip extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/DailyAcitveRewardTipSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren(){
        super.createChildren();
		this._sureButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseDown,this);
		this._isCreat = true;
		this.Show(this._bonus);
	}

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._bg.source = "jiangli_di" + lg + "_png";
    }

	/**
	 * 点击关闭
	 */
	private onCloseDown(e){
		this.IsVisibled = false;
	}

	/**
	 * 显示
	 */
	public Show(bonus: Object[]){
		this.IsVisibled = true;
		// if(this._isCreat){
			// 初始化列表
			for (let i = 0; i < this._rewardSet.length; i++){
				if (this._rewardSet[i].parent != null){
					this._listGroup.removeChild(this._rewardSet[i]);
				}
			}

			let index: number = 0;
			let listX: number = 0;
			let list: DailyActiveRewardList = null;

			let bonusSet = PromptManager.GetBonusResData(bonus,true);
			let oriX = 0;

			if(bonusSet.length == 1) oriX = 175;
			else if(bonusSet.length == 2) oriX = 115;
			else if(bonusSet.length == 3) oriX = 65;

			for (let j = 0; j < bonusSet.length; j++){
				list = this._GetList(index);
				list.show(bonusSet[j]);
				this._listGroup.addChild(list);
				list.x = listX + oriX;
				index += 1;
				listX += list.width;
			}
		// }
	}

	/**
     * 返回一个好友列表
     */
    private _GetList(index: number): DailyActiveRewardList{
        let list: DailyActiveRewardList = null;
        if (index < this._rewardSet.length){
            list = this._rewardSet[index];
        }
        else{
            list = new DailyActiveRewardList();
            this._rewardSet.push(list);
        }
        return list;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
            // this._UpdataShow();
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

	private _bg: eui.Image;								// 背景
	private _listGroup: eui.Group;						// 奖励容器
	private _scroller: eui.Scroller;					// 滚动容器
	private _rewardSet: DailyActiveRewardList[] = [];			// 奖励

	private _isVisibled: boolean = false;       		// 是否显示
	private _sureButton: eui.Button;					// 确认按钮

	private _bonus: Object[] = [];						// 存储奖励参数
	private _isCreat: boolean = false;					// 是否创建完成
}