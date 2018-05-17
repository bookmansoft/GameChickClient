/**
 * 购买详情页面
 */
class ShopBuyPage extends AWindow{
	/**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/ShopBuyPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

		this._buyOneButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBuyOneButtonClick, this);
        this._buyTenButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBuyTenButtonClick, this);
		this._buyFivetyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBuyFivetyButtonClick, this);
        this._buyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBuyButtonClick, this);
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseButtonClick, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._textLabel1.text = StringMgr.GetText("shopbuypagetext1");
        this._textLabel2.text = StringMgr.GetText("shopbuypagetext2");
        this._textLabel3.text = StringMgr.GetText("shopbuypagetext3");
		this._bg.source = "goumaits_di" + lg + "_png";
        this._buyButton.skinName = SkinCreateMgr.CreateButton("goumaits_an_goumai_l" + lg + "_png", "goumaits_an_goumai_a" + lg + "_png");
        this._closeButton.skinName = SkinCreateMgr.CreateButton("anniu_quxiao_l" + lg + "_png", "anniu_quxiao_a" + lg + "_png");
    }

	/**
	 * 购买数量+1
	 */
	private _OnBuyOneButtonClick(){
		this._endBuyNum += 1;
		this.updataPrice();
	}

	/**
	 * 购买数量+10
	 */
	private _OnBuyTenButtonClick(){
		this._endBuyNum += 10;
		this.updataPrice();
	}

	/**
	 * 购买数量+50
	 */
	private _OnBuyFivetyButtonClick(){
		this._endBuyNum += 50;
		this.updataPrice();
	}

	/**
	 * 数量增加，更新文本和价格
	 */
	private updataPrice(){

		if(this._endBuyNum > this._xianZhiBuyNum){
			this._endBuyNum = this._xianZhiBuyNum;
		}
		this._price = this._endOnePrice * this._endBuyNum;

		this._buyNumLabel.text = this._endBuyNum.toString();
		this._buyMoneyLabel.text = this._price.toString();
	}

	/**
	 * 购买商品，内购
	 */
	private _OnBuyButtonClick(){
		this.IsVisibled = false;

		if(this._buyFun!=null){
			this._buyFun(this._endBuyNum);
			this._buyFun = null;
		}
	}

	/**
	 * 取消
	 */
	private _OnCloseButtonClick(){
		this.IsVisibled = false;
	}

	/**
	 * 显示页面
	 * $shopId 商品id
	 * $buyFun 购买执行函数
	 * $buyGoldType 购买的货币类型
	 * $endPrice 价格
	 */
	public Show($shopId: number, $buyFun: Function, $buyGoldType: string, $endPrice: number){

		this.IsVisibled = true;

		this._shopID = $shopId;

		// 通过商品id获取物品id
		this._itemData = this.getItemData();
		this._item = null;
		this._item = this.getItem();
		this._endBuyNum = 1;
		this._endOnePrice = $endPrice;

		this._price = this._endOnePrice * this._endBuyNum;

		this._buyGoldType = $buyGoldType;
        let goldRes:string = "shop_jinbi_png";
        if(this._buyGoldType == "D") goldRes = "shop_jifen_png";
		this._buyTypeIma.texture = RES.getRes(goldRes);

		// 限制购买数量
		this._xianZhiBuyNum = 200;
		// else if(this._item.ID == 22) this._xianZhiBuyNum = UnitManager.Player.MaxPhysical - UnitManager.Player.Physical;

		this._nameLabel.text = StringMgr.GetText(this._itemData["name"]);
		this._descLabel.text = StringMgr.GetText(this._itemData["desc"]);

		if(this._item != null){
			if(this._item.ID == 23) this._xianZhiBuyNum = 1;
			this._haveNumLabel.text = ItemManager.GetItemCount(this._item.ID).toString();
		}
		else{
			this._haveNumLabel.text = UnitManager.Player.Money.toString();
		}

		this._buyNumLabel.text = this._endBuyNum.toString();
		this._buyMoneyLabel.text = this._price.toString();

		this._itemIconIma.texture = RES.getRes(this._itemData["res"] + "_png");

		this._buyFun = $buyFun;
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

	/**
     * 获取道具商店信息
     */
    private getItemData(): Item{
		if(this._shopData == null) this._shopData = RES.getRes("shopdata_json");

        let data = this._shopData[this._shopID.toString()];
        // let _bonus: string = type["bonus"];
        // let _bonusArr: any[] = _bonus.split(","); 
        // let _itemId: number = parseInt(_bonusArr[1]);
        // let _item: Item = ItemManager.GetItemByID(_itemId);
        return data;
    }

	/**
     * 获取道具信息
     */
    private getItem(): Item{
		if(this._shopData == null) this._shopData = RES.getRes("shopdata_json");

        let data = this._shopData[this._shopID.toString()];
        let _bonus: string = data["bonus"];
        let _bonusArr: any[] = _bonus.split(","); 
        let _itemId: number = parseInt(_bonusArr[1]);
        let _item: Item = ItemManager.GetItemByID(_itemId);
        return _item;
    }

	// 变量
    private _isVisibled: boolean = false;          				 // 是否显示

	private _bg: eui.Image;										// 背景
	private _nameLabel: eui.Label;								// 名称文本
	private _descLabel: eui.Label;								// 描述文本
	private _haveNumLabel: eui.Label;							// 拥有数量文本
	private _buyNumLabel: eui.Label;							// 购买数量文本
	private _buyMoneyLabel: eui.Label;							// 购买花费金币文本

	private _itemIconIma: eui.Image;							// 道具图标图片
	private _buyTypeIma: eui.Image;								// 购买金币类型图片

	private _buyOneButton: eui.Button;							// 购买数量+1按钮
	private _buyTenButton: eui.Button;							// 购买数量+10按钮
	private _buyFivetyButton: eui.Button;						// 购买数量+50按钮

	private _buyButton: eui.Button;								// 购买按钮
	private _closeButton: eui.Button;							// 取消按钮

	private _shopID: number;									// 商品在商店内id
	
	private _endBuyNum: number = 0;								// 购买数量
	private _item: Item;										// 商品
	private _itemData: Object;									// 商品信息
	private _xianZhiBuyNum: number = 200;						// 限制购买数量

	private _price: number;										// 总价格

	private _buyFun: Function;									// 购买执行函数
	private _shopData: JSON;									// 商店配置

	private _buyGoldType: string;								// 购买的货币类型

	private _endOnePrice: number = 0;							// 最终单品价格
	private _textLabel1: eui.Label;
	private _textLabel2: eui.Label;
	private _textLabel3: eui.Label;
}