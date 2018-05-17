/**
 * 背包界面
 */
class BagWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/BagWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        var pageGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        pageGroup.addEventListener(egret.Event.CHANGE, this._UpdatePage, this);
        this._allRadio.group = pageGroup;
        this._allRadio.value = BagWindow._ALL;
        this._itemRadio.group = pageGroup;
        this._itemRadio.value = BagWindow._ITEM;
        this._debrisRadio.group = pageGroup;
        this._debrisRadio.value = BagWindow._DEBRIS;

        
        GameEvent.AddEventListener(EventType.UseItem, this._UpdatePage, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._itemRadio.skinName = SkinCreateMgr.CreateRadioButton("fenye_daoju_on" + lg + "_png", "fenye_daoju_off" + lg + "_png");
        this._allRadio.skinName = SkinCreateMgr.CreateRadioButton("fenye_quanbu_on" + lg + "_png", "fenye_quanbu_off" + lg + "_png");
        this._debrisRadio.skinName = SkinCreateMgr.CreateRadioButton("fenye_suipian_on" + lg + "_png", "fenye_suipian_off" + lg + "_png");
        this._itemRadio.selected = false;
        this._allRadio.selected = true;
        this._UpdatePage();
    }
    
	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._itemRadio.selected = false;
            this._allRadio.selected = true;
            this._UpdatePage();
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
     * 更新界面显示
     */
    private _UpdatePage(evt: egret.Event = null){
        var value: number = BagWindow._ALL;
        if (evt != null){
            var group: eui.RadioButtonGroup = evt.target;
            value = group.selectedValue;
        }
        while (this._bagShowPageSet.length > 0){
            var page: BagPage = this._bagShowPageSet.shift();
            this._itemGroup.removeChild(page);
            this._bagPageSet.push(page);
        }
        var itemIDSet: number[] = ItemManager.GetItemIDSet();
        if (itemIDSet == null || itemIDSet.length == 0) return;
        var index: number = 0;
        for (var i = 0; i < itemIDSet.length; i++){
            var id: number = itemIDSet[i];
            var item: Item = ItemManager.GetItemByID(id);
            if (item == null) continue;
            if (value == BagWindow._ITEM && !item.IsItem) continue;
            if (value == BagWindow._DEBRIS && !item.IsDebris) continue;
            var page: BagPage = this._bagPageSet.length > 0?
                                this._bagPageSet.shift():
                                new BagPage();
            page.SetData(id);
            var column: number = index % 4;
            var line: number = Math.floor(index / 4);
            page.x = column * page.width + column * 1;
            page.y = line * page.height + line * 8;
            this._itemGroup.addChild(page);
            this._bagShowPageSet.push(page);
            index += 1;
        }
    }

    // 变量
    private static _ALL: number = 1;                    // 所有
    private static _ITEM: number = 2;                   // 道具
    private static _DEBRIS: number = 3;                 // 碎片

    private _isVisibled: boolean = false;               // 是否显示
    private _allRadio: eui.RadioButton;                 // 全部按钮
    private _itemRadio: eui.RadioButton;                // 物品按钮
    private _debrisRadio: eui.RadioButton;              // 碎片按钮
    private _itemGroup: eui.Group;                      // 物品容器
    private _bagPageSet: BagPage[] = [];                // 物品page集合
    private _bagShowPageSet: BagPage[] = [];            // 显示物品Page集合
}