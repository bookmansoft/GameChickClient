/**
 * 游戏中好友分数显示界面
 */
class MyRankList extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/MyRankListSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this.upDateShow();
    }

	/**
	 * 更新
	 */
	public upDateShow(){
		this._rankNumLabel.text = StringMgr.GetText("rankpagetext1");
		this._userIma.source = UnitManager.Player.HearUrl;
		this._nameLabel.text = UnitManager.Player.Name;
		this._scoreLabel.text = UnitManager.Player.MaxScore.toString();
	}

	private _rankNumLabel: eui.Label;
	private _userIma: eui.Image;
	private _nameLabel: eui.Label;
	private _scoreLabel: eui.BitmapLabel;

}