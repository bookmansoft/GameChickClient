/**
 * 背包物品
 */
class BagPage extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.width = 134;
        this.height = 171;
        this.skinName = "resource/game_skins/BagPageSkins.exml";
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        if (this._id != -1){
            this.SetData(this._id);
        }
    }

    /**
     * 点击响应
     */
    private _OnClick(){
        WindowManager.UseItemTip().Show(this._id);
    }

    /**
     * 设置数据
     * @param id    物品ID
     */
    public SetData(id: number){
        if (!this._isCreated){
            this._id = id;
            return;
        }
        var item: Item = ItemManager.GetItemByID(id);
        if (item == null) {
            Main.AddDebug("找不到物品，物品ID：" + id);
            return;
        }
        this._id = id;
        this._itemImage.source = item.ImageRes;
        var count: number = ItemManager.GetItemCount(id);
        this._countLabel.text = count.toString();
    }

    // 变量
    private _isCreated: boolean = false;            // 是否创建完成
    private _itemImage: eui.Image;                  // 物品图片
    private _countLabel: eui.BitmapLabel;           // 数量
    private _id: number = -1;                       // 物品ID
}