/**
 * 活动奖励界面
 */
class ActiveBonusWindow extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/PlayGiftWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;

        this._receiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        for (var i = 0; i < 5; i++){
            this._groupSet.push(this["_gourp" + i]);
            this._imageSet.push(this["_image" + i]);
            this._countLabelSet.push(this["_countLabel" + i]);
            this._groupSet[i].visible = false;
        }
        if (this._bonus != null){
            this.Show(this._name, this._bonus);
        }
	}

    /**
     * 按钮点击响应
     */
    private _OnClick(){
        this.IsVisibled = false;
    }

    /**
     * 显示界面
     * @param giftType 奖励类型
     */
    public Show(name: string, bonus: Object[]){
        if (!this._isCreated){
            this._bonus = bonus;
            this._name = name;
            this.IsVisibled = true;
            return;
        }
        this.IsVisibled = true;
        this._bonus = null;
        var name: string = "";
        this._nameLabel.text = name;
        if (bonus != null){
            for (var i = 0; i < this._groupSet.length; i++){
                this._groupSet[i].visible = false;
            }
            var index: number = 0;
            for (var i = 0; i < bonus.length && i < 5; i++){
                this._groupSet[i].visible = true;
                var data: Object = bonus[i];
                var type: string = data["type"];
                if (type == "M"){
                    this._imageSet[index].source = "fenxiang_jinbi_png";
                    this._countLabelSet[index].text = data["num"];
                    // UnitManager.Player.Money += data["num"];
                }
                else if (type == "I" || type == "C"){
                    var item: Item = ItemManager.GetItemByID(ItemManager.GetXID(type, data["id"]));
                    if (item != null){
                        this._imageSet[index].source = item.ImageRes;
                        this._countLabelSet[index].text = data["num"];
                        ItemManager.AddItem(ItemManager.GetXID(type, data["id"]), data["num"]);
                    }
                }
                else if(type == "A"){
                    this._imageSet[index].source = "fenxiang_daoju_tili_png";
                    this._countLabelSet[index].text = data["num"];
                }
                else if(type == "D"){
                    this._imageSet[index].source = "fenxiang_jifen_png";
                    this._countLabelSet[index].text = data["num"];
                }
                else if(type == "V"){
                    this._imageSet[index].source = "fenxiang_daoju_viptian_png";
                    this._countLabelSet[index].text = data["num"];
                }
                index += 1;
            }
            if (index > 0 && index < 6){
                var position: number[][][] = [[[265, 529]],
                                            [[194, 529], [336, 529]],
                                            [[122, 529], [265, 529], [407, 529]],
                                            [[194, 464], [336, 464], [194, 592], [363, 593]],
                                            [[122, 464], [265, 464], [407, 464], [194, 592], [336, 592]]];
                var pos: number[][] = position[index - 1];
                for (var i = 0; i < pos.length; i++){
                    this._groupSet[i].x = pos[i][0];
                    this._groupSet[i].y = pos[i][1];
                }
            }
        }
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.MainTopLayer.addChild(this);
        }
        else{
            Main.MainTopLayer.removeChild(this);
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
    private _isCreated: boolean = false;                        // 是否创建完成
    private _nameLabel: eui.Label;                              // 礼包名字文本
    private _groupSet: eui.Group[] =[];                         // 奖励容器集合
    private _imageSet:eui.Image[] = [];                         // 图片组件集合
    private _countLabelSet: eui.Label[] = [];                   // 数量文本集合
    private _receiveButton: eui.Button;                         // 领取按钮
    private _name: string;
    private _bonus: Object[];
}