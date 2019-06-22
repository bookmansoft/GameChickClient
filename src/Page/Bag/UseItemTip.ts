/**
 * 背包物品使用提示
 */
class UseItemTip extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/BagTipSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._useOneButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUseOneClick, this);
        this._useAllButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUseAllClick, this);
        this._useButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUseClick, this);

        this._isCreated = true;
        if (this._id != -1){
            this.Show(this._id);
        }
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._textLabel1.text = StringMgr.GetText("bagtiptext1");
        this._textLabel2.text = StringMgr.GetText("bagtiptext2");
        this._textLabel3.text = StringMgr.GetText("bagtiptext3");
        this._useButton.skinName = SkinCreateMgr.CreateButton("beibao_an_qushiyong_l" + lg + "_png", "beibao_an_qushiyong_a" + lg + "_png");
        this._useOneButton.skinName = SkinCreateMgr.CreateButton("beibao_an_shiyong1ge_l" + lg + "_png", "beibao_an_shiyong1ge_a" + lg + "_png");
        this._useAllButton.skinName = SkinCreateMgr.CreateButton("beibao_an_quanbushiyong_l" + lg + "_png", "beibao_an_quanbushiyong_a" + lg + "_png");
    }

    /**
     * 关闭按钮
     */
    private _OnCloseClick(){
        SoundManager.PlayButtonMusic();
        this.IsVisibled = false;
    }

    /**
     * 显示
     * @param id    物品ID
     */
    public Show(id: number){
        this._id = id;
        if (!this._isCreated){
            this.IsVisibled = true;
            return;
        }
        this.IsVisibled = true;
        var item: Item = ItemManager.GetItemByID(id);
        if (item == null){
            Main.AddDebug("物品为空，物品ID：" + id);
            this.IsVisibled = false;
            return;
        }
        var itemCount: number = ItemManager.GetItemCount(id);
        this._itemImage.source = item.ImageRes;
        this._nameLabel.text = item.Name;
        this._descLabel.text = item.Desc;
        this._countLabel.text = itemCount.toString();
        if (id == 40022 || id == 40023){
            this._buttonGroup.visible = true;
            this._useButton.visible = false;
        }
        else {
            this._buttonGroup.visible = false;
            this._useButton.visible = true;
        }
    }

    /**
     * 去使用点击响应
     */
    private _OnUseClick(){
        SoundManager.PlayButtonMusic();
        this.IsVisibled = false;
        var item: Item = ItemManager.GetItemByID(this._id);
        if (item == null) return;
        if (item.ID == ItemManager.ReviveItemID){
            WindowManager.StarWindow().CloseWindow();
        }
        if (item.IsDebris){
            if (WindowManager.RoleWindow() == null){
                WindowManager.SetWindowFunction(this._OpenRole.bind(this));
                return;
            }
            this._OpenRole();
        }
    }

    /**
     * 打开角色界面
     */
    private _OpenRole(){
        WindowManager.StarWindow().OpenWindow(WindowManager.RoleWindow());
    }

    /**
     * 使用一个点击响应
     */
    private _OnUseOneClick(){
        SoundManager.PlayButtonMusic();
        if (this._id == 22 || this._id == 23){
            if (UnitManager.Player.Physical >= UnitManager.Player.MaxPhysical){
                PromptManager.CreatCenterTip(false, true, StringMgr.GetText("bagtiptext4"));
                return;
            }
        }
        this._UseItem();
    }

    /**
     * 使用全部点击响应
     */
    private _OnUseAllClick(){
        SoundManager.PlayButtonMusic();
        if (this._id == 22 || this._id == 23){
            if (UnitManager.Player.Physical >= UnitManager.Player.MaxPhysical){
                PromptManager.CreatCenterTip(false, true, StringMgr.GetText("bagtiptext4"));
                return;
            }
        }
        var itemCount: number = ItemManager.GetItemCount(this._id);
        this._UseItem(itemCount);
    }

    /**
     * 使用物品
     */
    private _UseItem(count: number = 1){
        if (count == 0){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("bagtiptext5"));
            GameEvent.DispatchEvent(EventType.UseItem);
            return;
        }
        this._useCount = count;
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;
        NetManager.SendRequest(["func=" + NetNumber.UseItem + "&id=" + this._id + "&num=" + count
                                    + "&oemInfo=" + JSON.stringify(data)],
                                    this._UseItemReturn.bind(this));
    }

    /**
     * 使用物品返回
     */
    private _UseItemReturn(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("购买直接使用物品失败，商品ID：" + this._id);
            return;
        }
        ItemManager.UseItem(this._id, this._useCount);
        GameEvent.DispatchEvent(EventType.UseItem);
        var itemCount: number = ItemManager.GetItemCount(this._id);
        if (itemCount == 0){
            this.IsVisibled = false;
        }
    }
    
	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
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

    // 变量
    private _isVisibled: boolean = false;               // 是否显示
    private _isCreated: boolean = false;                // 是否创建完成
    private _itemImage: eui.Image;                      // 物品图片
    private _nameLabel: eui.Label;                      // 名字文本
    private _countLabel: eui.Label;                     // 数量文本
    private _descLabel: eui.Label;                      // 描述文本
    private _useButton: eui.Button;                      // 使用按钮
    private _closeButton: eui.Button;                   // 关闭按钮
    private _buttonGroup: eui.Group;                    // 按钮组
    private _useAllButton: eui.Button;                  // 使用全部按钮
    private _useOneButton: eui.Button;                  // 使用一个按钮
    private _id: number = -1;                           // 物品ID
    private _useCount: number = 0;                      // 使用物品数量
    private _textLabel1: eui.Label;
    private _textLabel2: eui.Label;
    private _textLabel3: eui.Label;
}