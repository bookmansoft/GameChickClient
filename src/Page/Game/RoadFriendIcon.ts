/**
 * 道路上好友的头像
 */
class RoadFriendIcon extends egret.DisplayObjectContainer{

    /**
     * 构造方法
     */
    public constructor(){
        super();
		this.init();
    }

	/**
     * 子项创建完成
     */
	private init() {
		this.height = 100;
		this._group = new eui.Group;
		this.addChild(this._group);

		this._friendIcon = new eui.Image;
		this._friendIcon.source = "resource/res/common/shop_jinbi.png";
		// this._friendIcon.y = 40;
		this._group.addChild(this._friendIcon);

		this._maskIma = new eui.Image;
		this._maskIma.texture = RES.getRes("youxi_haoyou_zz_png");
		this._friendIcon.mask = this._maskIma;
		// this._friendIcon.y = 40;

		this._kuangIma = new eui.Image;
		this._kuangIma.texture = RES.getRes("youxi_haoyou_di_png");
		this._group.addChild(this._kuangIma);
		// this._kuangIma.y = 40;

		this._nameLabel = new eui.Label;
		this._nameLabel.fontFamily = "微软雅黑";
		this._nameLabel.size = 30;
		this._nameLabel.textColor = 0x244F5B;
		this._nameLabel.text = "鸡小德";
		this.addChild(this._nameLabel);
	}

	/**
	 * 更新
	 */
	public upDateShow($iconUrl = "resource/res/common/shop_jinbi.png",$der = 0,$name = "鸡小德"){
		if($der = 0){
			this._kuangIma.rotation = 0;
		}
		else{
			this._kuangIma.rotation = 90;
		}

		this._friendIcon.source = $iconUrl;
		this._nameLabel.text = $name;
	}

	private _group: eui.Group;
	private _kuangIma: eui.Image;
	private _maskIma: eui.Image;
	private _friendIcon: eui.Image;

	private _nameLabel: eui.Label;

}