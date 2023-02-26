/**
 * 商店界面
 */
class ShopPage extends AWindow{
    /**
     * 角色类型
     */
    public static RoleType: number = 1;
    /**
     * 场景类型
     */
    public static ThemeType: number = 2;
    /**
     * 物品类型
     */
    public static ItemType: number = 3;
    /**
     * 充值类型
     */
    public static RechargeType: number = 4;

    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/ShopSkin.exml";
        this.width = 135;
        this.height = 190;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        GameEvent.AddEventListener(EventType.UserStatusChange, this.Update, this);
        GameEvent.AddEventListener(EventType.RoleUpLevel, this.Update, this);
        // ProcessManager.AddProcess(this._Process.bind(this));
    }

	/**
     * 点击响应
     */
    private _OnClick(){
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;
        var shopID: number = Game.IsIos? this._shopID + 8 : this._shopID;
        if (this._type == ShopPage.RechargeType){
            var text: string = StringMgr.GetText("shopbuypagetext4");
            text = text.replace("&point", this._endPrice.toString());
            text = text.replace("&token", this._bonus[1].toString());
            PromptManager.CreatCenterTip(false,false,text,null,this._BuyGold.bind(this));
            return;
        }
        if (this._isCanBuy){
            if(this._buyGoldType == "D"){
                PromptManager.CreatShopBuyPage(this._shopID, this._BuyItem.bind(this),this._buyGoldType,this._endPrice);
            }else{
                PromptManager.CreatShopBuyPage(this._shopID, this._BuyItem.bind(this),this._buyGoldType,this._endPrice);
            }
            
        }
        // else if (!this._isSelected){
        // }
    }

    /**
     * 购买瓶盖
     */
    private _BuyGold(){
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;

        let itemid:Number = Game.IsIos? this._shopID + 8 : this._shopID;

        //1 Notify 模式 / 2 URLSchema 模式
        let mode = 2;

        NetManager.SendRequest([`func=${NetNumber.BuyGold}&itemid=${itemid}&count=1&mode=${mode}&oemInfo=${JSON.stringify(data)}`], data => {
            return this._OnBuyGoldCom.bind(this)(data, mode);
        });
    }

    /**
     * 内购
     */
    private _BuyItem($num){
        this._buyNum = $num;
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;
        let allPrice = this._endPrice * $num;
        if(this._buyGoldType == "D"){
            if (UnitManager.Player.TestPingGai(allPrice)){
                WindowManager.WaitPage().IsVisibled = true;
                NetManager.SendRequest(["func=" + NetNumber.BuyItem + "&id=" + this._shopID + "&num=" + $num
                                    + "&oemInfo=" + JSON.stringify(data)],
                                        this._OnBuyComplete.bind(this));
            }
        }else{
            if (UnitManager.Player.TestMoney(allPrice)){
                WindowManager.WaitPage().IsVisibled = true;
                NetManager.SendRequest(["func=" + NetNumber.BuyItem + "&id=" + this._shopID + "&num=" + $num
                                    + "&oemInfo=" + JSON.stringify(data)],
                                        this._OnBuyComplete.bind(this));
            }
        }
    }

	/**
     * 积分购买回调
     */
    private _OnBuyGoldCom(jsonData: Object, mode) {
        var code: number = jsonData["code"];
        var data: Object = jsonData["data"];
        if (jsonData["code"] != NetManager.SuccessCode) {
            if (code == 1004){ // 积分不足
                PromptManager.CreatCenterTip(false,false,StringMgr.GetText("shopbuypagetext9"),null,this._OnPayClick.bind(this));
            }
        } else {
            var pingaiStr: string = data["bonus"];
            let pingaiNum: string[] = pingaiStr.split(",");
            switch(mode) {
                case 1: {
                    //Notify 模式
                }
                case 2: {
                    //URLSchema 模式
                    let order = {
                        cid: data["cid"],
                        sn: data["sn"],
                        price: data["price"],
                    };
                    let st = `/wallet/pay/${JSON.stringify(order)}`;
                    window.location.href = `http://h5.gamegold.xin?path=${encodeURIComponent(st)}`;
                    break;
                }
            }
        }
    }

	/**
     * 确认支付
     */
    private _OnPayClick(){
        // Main.AddDebug("发起支付");
        FBSDKMgr.SetPaySuccess(this._OnPaySuccess.bind(this));
        FBSDKMgr.SetPayError(this._OnPayError.bind(this));
        FBSDKMgr.SetPayClose(this._OnPayClose.bind(this));
        FBSDKMgr.PopPayTips(this._endPrice);
    }

	/**
     * 充值成功回调
     */
    private _OnPaySuccess(){
        // Main.AddDebug("支付成功");
        this._BuyGold();
    }

	/**
     * 重置出错回调
     */
    private _OnPayError(){
        // Main.AddDebug("支付出错误");
        PromptManager.CreatCenterTip(false,true,StringMgr.GetText("shopbuypagetext10"));
    }

	/**
     * 重置关闭回调
     */
    private _OnPayClose(){
        // Main.AddDebug("支付关闭");
         PromptManager.CreatCenterTip(false,true,StringMgr.GetText("shopbuypagetext10"));
    }

	/**
     * 购买响应
     */
    private _OnBuyComplete(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        if (jsonData["code"] == NetManager.SuccessCode){
             PromptManager.CreatCenterTip(false,false,StringMgr.GetText("shopbuypagetext11"));
            // Main.Instance.PromptWindow.ShowPrompt(false, "购买成功", false);
            var data: Object = jsonData["data"];
            Object.keys(data).map(function(key){
                ItemManager.SetItemCount(parseInt(key), data[key]["num"]);
            });

            this.Update();
            if (this._shopID == 4012){
                var shopData: JSON = RES.getRes("shopdata_json");
                var shop: JSON = shopData[this._shopID.toString()];
                if (shop != null){
                    var bonus: string = shop["bonus"];
                    var bonusStr: string[] = bonus.split(",");
                    let itemID: number = 0;
                    if(bonusStr.length == 3) {
                        itemID = ItemManager.GetXID(bonusStr[0], parseInt(bonusStr[1]));
                    } else {
                        itemID = parseInt(bonusStr[0]);
                    }
                    var upData : JSON = JSON.parse("{}");
                    data["token"] = UnitManager.Player.GameToken;
                    ItemManager.UseItem(itemID, this._buyNum);
                    NetManager.SendRequest(["func=" + NetNumber.UseItem + "&id=" + itemID + "&num=" + this._buyNum
                                                + "&oemInfo=" + JSON.stringify(upData)],
                                                this._UseItemReturn.bind(this));
                }
            }
        }else{
            PromptManager.CreatCenterTip(false,true,StringMgr.GetText("shopbuypagetext12"));
        }
    }

    /**
     * 使用物品返回
     */
    private _UseItemReturn(jsonData: Object){
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("购买直接使用物品失败，商品ID：" + this._shopID);
            return;
        }
        GameEvent.DispatchEvent(EventType.UseItem);
    }

	/**
     * 设置数据
     * [0.商品id, 1.商品资源, 2.价格, 3.名字, 4.消费类型, 5.是否热卖促销, 6.购买条件, 7.商品碎片对应的道具id]
     */
    public SetData(type: number, dataSet: Object){
        this._type = type;
        this._dataSet = dataSet;
        // if(this._dataSet == null) return;

        this._roleGroup.visible = type == ShopPage.RoleType;
        this._themeGroup.visible = type == ShopPage.ThemeType;
        this._itemGroup.visible = type == ShopPage.ItemType;
        this._rmbGroup.visible = type == ShopPage.RechargeType;

        // 存储数据
        if(this._type != ShopPage.RechargeType){
            this._shopID = parseInt(dataSet["id"]); // id
            this._defaultbuy = StringMgr.GetText(dataSet["defaultbuy"]); // 购买条件
            this._name = StringMgr.GetText(dataSet["name"]); // 商品名称
            this._buyGoldType = dataSet["costtype"]; // 消费类型
        }else{
            this._shopID = parseInt(dataSet["itemid"]); // id
        }
        this._activeTime = dataSet["times"].split(","); // 折扣活动时间
        this._price = parseInt(dataSet["price"]); // 原价格
        this._zhekouRes = dataSet["markres"] + StringMgr.LanguageSuffix; // 折扣显示资源
        this._zhekouNum = dataSet["discount"]; // 折扣值
        this._bonus = dataSet["bonus"].split(","); // 奖励

        // 金币显示类型
        let goldRes:string = "shop_jinbi_png";
        if(this._buyGoldType == "D") goldRes = "shop_jifen_png";  

        // 角色碎片商品对应的角色
        if(this._bonus[1] && ItemManager.GetItemByID(parseInt(this._bonus[1]))){
            let roleId: number = ItemManager.GetItemByID(parseInt(this._bonus[1])).ID + 1000;
            this._duiyingRole = UnitManager.GetRole(roleId);
        }

        this._UpdataShow();

        // 显示商品图片
        switch (type) {
            case ShopPage.RoleType:
                this._roleImage.texture = RES.getRes(dataSet["res"] + "_png");
                this._rolePriceLabel.text = String(this._endPrice);
                this._roleGoldType.texture = RES.getRes(goldRes);
                break;

            case ShopPage.ThemeType:
                this._themeImage.texture = RES.getRes(dataSet["res"] + "_png");
                this._themePriceLabel.text = String(this._endPrice);
                this._themeGoldType.texture = RES.getRes(goldRes);
                break;
            case ShopPage.ItemType:
                this._itemImage.texture = RES.getRes(dataSet["res"] + "_png");
                this._itemPriceLabel.text = String(this._endPrice);
                this._itemGoldType.texture = RES.getRes(goldRes);
                break;
            case ShopPage.RechargeType:
                if(this._isZheKou){
                    this._goldLabel.text = this._bonus[1] + "x2";
                }else{
                    this._goldLabel.text = this._bonus[1];
                }
                
                this._rmbLabel.text = this._endPrice / 10 + " rmb";

                // 判断是否出现热卖和促销
                var lg: string = StringMgr.LanguageSuffix;
                if(dataSet["ischeap"] == "1" && dataSet["ishot"] == "0" && this._zhekouIma.visible == false){
                    this._shopStateIma.texture = RES.getRes("shop_huasuan" + lg + "_png");
                    this._shopStateIma.visible = true;
                }else if(dataSet["ischeap"] == "0" && dataSet["ishot"] == "1" && this._zhekouIma.visible == false){
                    this._shopStateIma.texture = RES.getRes("shop_remai" + lg + "_png");
                    this._shopStateIma.visible = true;
                }else{
                    this._shopStateIma.visible = false;
                }
            break;
        }
    }

    /**
     * 更新显示
     */
    private _UpdataShow(){
        // 折扣后价格与显示
        if(this.IsZheKou){
            this._endPrice = Math.ceil(this._price * this._zhekouNum); // 价格 * 折扣
            this._zhekouIma.visible = true;
            this._zhekouIma.texture = RES.getRes(this._zhekouRes + "_png");
        }else{
            this._endPrice = this._price; // 价格
            this._zhekouIma.visible = false;
        }

        // 更新红蓝底
        let isEnough = true;
        if (ItemManager.GetItemCode(this._buyGoldType) == "D"){
            isEnough = UnitManager.Player.PingGai >= this._endPrice;
        }
        else if (ItemManager.GetItemCode(this._buyGoldType) == "M"){
            isEnough = UnitManager.Player.Money >= this._endPrice;
        }
        // 判断显示红蓝底框
        if (this._type != ShopPage.RechargeType && !isEnough){
            this._bg.texture = RES.getRes("shop_kuang_hong_png");
            this._rolePriceLabel.font = RES.getRes("shophnum_fnt");
            this._themePriceLabel.font = RES.getRes("shophnum_fnt");
            this._itemPriceLabel.font = RES.getRes("shophnum_fnt");
        }
        else{
            this._bg.texture = RES.getRes("shop_kuang_lan_png");
            this._rolePriceLabel.font = RES.getRes("shoplnum_fnt");
            this._themePriceLabel.font = RES.getRes("shoplnum_fnt");
            this._itemPriceLabel.font = RES.getRes("shoplnum_fnt");
        }
        
        // 判断是否需要解锁角色才能购买
        if(this._defaultbuy != "" && this._duiyingRole && this._duiyingRole.Level < 1){
            this._bg.texture = RES.getRes("shop_kuang_hong_png");
            this._roleGold.visible = false;
            this._roleTipLabel.visible = true;
            this._roleTipLabel.text = this._defaultbuy;
            this._isCanBuy = false;
            // if(!Main.IsOfficialVersion)this._isCanBuy = true;
        }
        else{
            this._roleGold.visible = true;
            this._roleTipLabel.visible = false;
            this._isCanBuy = this._endPrice != 0;
        }
    }

    /**
     * 是否处于折扣中
     */
    public get IsZheKou():boolean{
        // 显示折扣图标
        let time: number = UnitManager.FuwuduanTime;
        let startTime: number = this._activeTime[0] ? parseInt(this._activeTime[0]) : 0;
		let endTime: number = this._activeTime[1] ? parseInt(this._activeTime[1]) : 0;
        if (time >= startTime && time <= endTime){
            this._isZheKou = true;
            return this._isZheKou;
        }
        else{
            this._isZheKou = false;
            return this._isZheKou;
        }
    }

    /**
     * 是否处于折扣中
     */
    public get IsAtZheKou():boolean{
        return this._isZheKou;
    }

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        if(this._isZheKou){
            this._shuaXinTime += frameTime;
            if(this._shuaXinTime >= 60000){
                this._shuaXinTime -= 60000;
                this.Update();
            }
        }
    }

	/**
     * 更新
     */
    public Update(){
        this.SetData(this._type, this._dataSet);
    }

    // 变量
    private _bg: eui.Image;                                         // 背景
    private _roleGroup: eui.Group;                                  // 角色容器
    private _roleImage: eui.Image;                                  // 角色图片
    private _rolePriceLabel: eui.BitmapLabel;                       // 角色价格文本
    private _roleGold: eui.Group;                                   // 角色金币
    private _itemGroup: eui.Group;                                  // 物品容器
    private _itemImage: eui.Image;                                  // 物品图片
    private _itemPriceLabel: eui.BitmapLabel;                       // 物品价格文本
    private _themeGroup: eui.Group;                                 // 主题容器
    private _themeImage: eui.Image;                                 // 主题图片
    private _themePriceLabel: eui.BitmapLabel;                      // 主题价格文本
    private _themeGold: eui.Group;                                  // 主题价格
    private _rmbGroup: eui.Group;                                   // 充值容器
    private _goldLabel: eui.BitmapLabel;                            // 充值获得金币文本
    private _rmbLabel: eui.BitmapLabel;                             // 充值价格文本
    private _shopID: number = 0;                                    // 商品ID
    private _isSelected: boolean = false;                           // 是否选中
    private _isCanBuy: boolean = false;                             // 能否购买
    private _price: number = 0;                                     // 商品价格
    private _endPrice: number = 0;                                  // 最终商品价格
    private _type: number;                                          // 类型
    private _dataSet: Object = null;                                       // 数据集合
    private _name: string;                                          // 名字
    private _buyNum: number = 0;                                    // 购买数量

    private _roleGoldType: eui.Image;                               // 货币
    private _itemGoldType: eui.Image;                               // 货币
    private _themeGoldType: eui.Image;                              // 货币

    private _buyGoldType: string = "";                              // 货币类型

    private _shopStateIma: eui.Image;                               // 商店热卖优惠图片
    private _roleTipLabel: eui.Label;                               // 是否需要解锁角色
    private _defaultbuy: string = "";                               // 购买条件
    private _duiyingRole: Role = null;                              // 对应的角色
    private _bonus: string[] = [];                                  // 奖励

    private _zhekouIma: eui.Image;                                  // 折扣图片
    private _zhekouRes: string = "";                                // 折扣图片资源
    private _zhekouNum: number = 1;                                 // 折扣值

    private _activeTime: string[] = [];                             // 折扣活动时间
    private _isZheKou: boolean = false;                             // 是否处于折扣中

    private _shuaXinTime: number = 0;                               // 刷新间隔

}