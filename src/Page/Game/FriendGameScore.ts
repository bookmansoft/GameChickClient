/**
 * 游戏中好友分数显示界面
 */
class FriendGameScore extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/FriendGameScoreSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._friendNameLabel.wordWrap = false;
        this._friendNameLabel.multiline = false;
        this._friendNameLabel.width = 250;
        this._friendNameLabel.height = 35;
    }

	/**
	 * 更新
	 */
	public upDateShow($_friendNameLabel = "",$_friendIma = "",$_friendScoreLabel = ""){
        if (this.parent == null) return;
		this._friendNameLabel.text = $_friendNameLabel;
		this._friendIma.source = $_friendIma;
		this._friendScoreLabel.text = $_friendScoreLabel;
	}

	private _friendNameLabel: eui.Label;
	private _friendIma: eui.Image;
	private _friendScoreLabel: eui.BitmapLabel;

}