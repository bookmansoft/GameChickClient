/**
 * 日常活动获得奖励块
 */
class DailyActiveRewardList extends eui.Component{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/DailyAcitveRewardListSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren(){
        super.createChildren();
	}

	/**
	 * 显示界面
	 */
	public show(bonus:Object){
		this._itemIma.texture = RES.getRes(bonus["res"]);
		this._nameLabel.text = bonus["name"];
		this._numLabel.text = "x" + bonus["num"];

		this._nameLabel.filters = [FilterManage.AddMiaoBian(2,0x622897)];
		this._numLabel.filters = [FilterManage.AddMiaoBian(2,0x622897)];
	}

	private _itemIma: eui.Image;				// 奖励图片
	private _nameLabel: eui.Label;				// 名字文本
	private _numLabel: eui.Label;				// 数量文本
}