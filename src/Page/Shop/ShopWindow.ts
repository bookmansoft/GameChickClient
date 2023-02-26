/**
 * 商店界面
 */
class ShopWindow extends AWindow{
    /**
     * 是否开始界面打开
     */
    public static IsOpenStar: boolean = false;

    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/ShopPageSkins.exml";
        this._ReadData();
        this.width = 640;
        this.height = 626;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        // 初始化货币
        this._UpdataMoney();
        this._UpdataPingGai();
        // 初始化按钮
        var pageGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        pageGroup.addEventListener(egret.Event.CHANGE, this._UpdataPage, this);
        this._roleRadio.group = pageGroup;
        this._roleRadio.value = ShopPage.RoleType;
        this._themeRadio.group = pageGroup;
        this._themeRadio.value = ShopPage.ThemeType;
        this._itemRadio.group = pageGroup;
        this._itemRadio.value = ShopPage.ItemType;
        this._rechargeRadio.group = pageGroup;
        this._rechargeRadio.value = ShopPage.RechargeType;
        this._UpdataPage(null);

        // this._itemRadio.visible = false;
        this._themeRadio.visible = false;
        this._rechargeRadio.x = this._itemRadio.x;
        this._itemRadio.x = this._themeRadio.x;
        // this._rechargeRadio.x = this._themeRadio.x;

        var themeGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        themeGroup.addEventListener(egret.Event.CHANGE, this._UpdataTheme, this);
        this._sceneRadio.group = themeGroup;
        this._sceneRadio.value = 1;
        this._roadRadio.group = themeGroup;
        this._roadRadio.value = 2;
        this._UpdataTheme(null);

        // 刷新商品信息
        this._UpdataShop();

        this.touchEnabled = true;
        this.touchChildren = true;

        GameEvent.AddEventListener(EventType.MoneyChange, this._UpdataMoney, this);
        GameEvent.AddEventListener(EventType.PingGaiChange, this._UpdataPingGai, this);

        GameEvent.AddEventListener(EventType.MoneyChange, this._UpdateShow, this);
        GameEvent.AddEventListener(EventType.PingGaiChange, this._UpdateShow, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._sceneRadio.skinName = SkinCreateMgr.CreateRadioButton("anniu_zhuti_on" + lg + "_png", "anniu_zhuti_off" + lg + "_png");
        this._roadRadio.skinName = SkinCreateMgr.CreateRadioButton("anniu_lujing_on" + lg + "_png", "anniu_lujing_off" + lg + "_png");
        // this._roadRadio.selected = true;
        // this._sceneRadio.selected = true;
        this._roleRadio.skinName = SkinCreateMgr.CreateRadioButton("anniu_juese_on" + lg + "_png", "anniu_juese_off" + lg + "_png");
        this._themeRadio.skinName = SkinCreateMgr.CreateRadioButton("anniu_changjing_on" + lg + "_png", "anniu_changjing_off" + lg + "_png");
        this._itemRadio.skinName = SkinCreateMgr.CreateRadioButton("anniu_daoju_on" + lg + "_png", "anniu_daoju_off" + lg + "_png");
        this._rechargeRadio.skinName = SkinCreateMgr.CreateRadioButton("anniu_chongzhi_on" + lg + "_png", "anniu_chongzhi_off" + lg + "_png");
        // this._itemRadio.selected = true;
        // this._roleRadio.selected = true;

        this._UpdateShow();
    }

    /**
     * 打开充值页面
     */
    public OpenRecharge(){
        this._rechargeRadio.selected = true;
        this._PageUpdate(ShopPage.RechargeType);
    }

    /**
     * 打开物品页面
     */
    public OpenItemPage(){
        this._itemRadio.selected = true;
        this._PageUpdate(ShopPage.ItemType);
    }

    /**
     * 打开角色页面
     */
    public OpenRolePage(){
        this._roleRadio.selected = true;
        this._PageUpdate(ShopPage.RoleType);
    }

	/**
     * 读取数据
     */
    private _ReadData(){
        var jsonData: JSON = RES.getRes("shopdata_json");
        Achievement.RewardData = jsonData;
        this._roleData = [];
        this._sceneData = [];
        this._roadData = [];
        this._itemData = [];
        Object.keys(jsonData).map((id)=>{
            var data: Object = jsonData[id];
            data["id"] = id;
            var bonus: string = data["bonus"];
            var bonusSet: string[] = bonus.split(",");
            var type: string = bonusSet[0];
            if (data["price"] == "0") {
                // ItemManager.AddItem(ItemManager.GetXID(type, data["id"]), 1);
            }
            else{
                switch (ItemManager.GetItemCode(type)) {
                    case "C":
                        this._roleData.push(data);
                        // this._roleData.push([data["id"], data["res"], data["price"], data["name"], data["costtype"], "", data["defaultbuy"], bonusSet[1]]);
                        break;
                    case "scene":
                        this._sceneData.push(data);
                        // this._sceneData.push([data["id"], data["res"], data["price"], data["name"], data["costtype"], "",  data["defaultbuy"], null]);
                        break;
                    case "road":
                        this._roadData.push(data);
                        // this._roadData.push([data["id"], data["res"], data["price"], data["name"], data["costtype"], "",  data["defaultbuy"], null]);
                        break;
                    case "I":
                    case "M":
                        this._itemData.push(data);
                        // this._itemData.push([data["id"], data["res"], data["price"], data["name"], data["costtype"], "",  data["defaultbuy"], null]);
                        break;
                }
            }
        });
        var jsonData: JSON = RES.getRes("shopOuter_json");
        this._rechargeData = [];
        Object.keys(jsonData).map((key)=>{
            var data: Object = jsonData[key];
            var bonus: string = data["bonus"];
            var bonusSet: string[] = bonus.split(",");
            var type: string = bonusSet[0];
            // var num: number = parseInt(bonusSet[1]);
            // let state: string = "normal";
            // if(data["ischeap"] == 1) state = "ischeap";
            // else if(data["ishot"] == 1) state = "ishot";

            if (data["zoneid"] == 1 && type == "D"){
                // this._rechargeData.push([data["itemid"], num, data["price"], 0, 0, state, "", null]);
                this._rechargeData.push(data);
            }
        });
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._UpdateShow();
            this._shuaXinTime = 0;
            ProcessManager.AddProcess(this._Process.bind(this));
        }
        else{
            Main.Instance.WindowBottomLayer.removeChild(this);
            ProcessManager.RemoveProcess(this._Process.bind(this));
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
     * 添加金币
     */
    private _UpdataMoney(){
        this._totalGoldLabel.text = UnitManager.Player.Money.toString();
    }

    /**
     * 添加瓶盖
     */
    private _UpdataPingGai(){
        this._totalPingGaiLabel.text = UnitManager.Player.PingGai.toString();
    }

	/**
     * 更新页面
     */
    private _UpdataPage(evt: egret.Event){
        var value: number = ShopPage.RoleType;
        if (evt != null){
            var group: eui.RadioButtonGroup = evt.target;
            value = group.selectedValue;
        }
        this._PageUpdate(value);
    }

	/**
     * 更新页面
     */
    private _PageUpdate(value: number){
        this._roleGroup.visible = value == ShopPage.RoleType;
        this._themeGroup.visible = value == ShopPage.ThemeType;
        this._itemGroup.visible = value == ShopPage.ItemType;
        this._rechargeGroup.visible = value == ShopPage.RechargeType;
    }

	/**
     * 更新场景页面
     */
    private _UpdataTheme(evt: egret.Event){
        var value: number = 1;
        if (evt != null){
            var group: eui.RadioButtonGroup = evt.target;
            value = group.selectedValue;
        }
        this._scene.visible = value == 1;
        this._road.visible = value == 2;
    }

	/**
     * 更新商品
     */
    private _UpdataShop(){
        if (this._roleData == null) return;
        this._AddShop(ShopPage.RoleType, this._roleData, this._roleScroller, this._roleShop);
        this._AddShop(ShopPage.ThemeType, this._sceneData, this._sceneScroller, this._sceneShop);
        this._AddShop(ShopPage.ThemeType, this._roadData, this._roadScroller, this._roadShop);
        this._AddShop(ShopPage.ItemType, this._itemData, this._itemScroller, this._itemShop);
        this._AddShop(ShopPage.RechargeType, this._rechargeData, this._rechargeScroller, this._rechargeShop);
    }

	/**
     * 添加商品
     */
    private _AddShop(type: number, data: Object[], scroller: eui.Group, shopSet: ShopPage[]){
        var shopX: number = 0;
        var shopY: number = 0;
        // let end:ShopPage = null;
        for (var i = 0; i < data.length; i++){
            var shop: ShopPage = new ShopPage();
            shop.x = shopX;
            shop.y = shopY;
            shop.SetData(type, data[i]);
            scroller.addChild(shop);
            shopSet.push(shop);
            // 隐藏
            // if(data[i][0] == "1008"){
            //     if(UnitStatusMgr.IsFirstCharge && UnitStatusMgr.IsFirstChargeReward){
            //         shopX += shop.width;
            //     }else{
            //         end = shop;
            //     }
            // }else{
                shopX += shop.width;
            // }

            if (shopX >= (shop.width * 3 + 36)){
                shopX = 0;
                shopY += shop.height;
            }

            // 隐藏的显示到最后
            // if(end != null && i == data.length-1){
            //     end.x = shopX;
            //     end.y = shopY;
            // }
        }
    }

	/**
     * 更新显示
     */
    private _UpdateShow(){
        this._roleShop.map((shop)=>{shop.Update();});
        // this._sceneShop.map((shop)=>{shop.Update();});
        // this._roadShop.map((shop)=>{shop.Update();});
        this._itemShop.map((shop)=>{shop.Update();});
        this._rechargeShop.map((shop)=>{shop.Update();});
    }

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        this._shuaXinTime += frameTime;
        if(this._roleShop[0] && this._shuaXinTime >= 60000 && this._roleShop[0].IsAtZheKou){
            this._shuaXinTime -= 60000;
            this._UpdateShow();
        }
    }

    // 变量
    private _roleData: Object[];                              // 角色数据
    private _sceneData: Object[];                             // 场景数据
    private _roadData: Object[];                              // 道路数据
    private _itemData: Object[];                              // 物品数据
    private _rechargeData: Object[];                            // 充值数据
    private _isVisibled: boolean = false;                       // 是否显示
    private _totalGoldLabel: eui.BitmapLabel;                   // 金币总数文本
    private _roleRadio: eui.RadioButton;                        // 角色按钮
    private _themeRadio: eui.RadioButton;                       // 场景按钮
    private _itemRadio: eui.RadioButton;                        // 物品按钮
    private _rechargeRadio: eui.RadioButton;                    // 充值按钮
    private _roleGroup: eui.Group;                              // 角色容器
    private _roleScroller: eui.Group;                           // 角色滚动容器
    private _themeGroup: eui.Group;                             // 场景容器
    private _sceneRadio: eui.RadioButton;                       // 场景背景按钮
    private _roadRadio: eui.RadioButton;                        // 场景道路按钮
    private _scene: eui.Scroller;                               // 场景滚动
    private _sceneScroller: eui.Group;                          // 场景滚动容器
    private _road: eui.Scroller;                                // 道路滚动
    private _roadScroller: eui.Group;                           // 道路滚动容器
    private _itemGroup: eui.Group;                              // 物品容器
    private _itemScroller: eui.Group;                           // 物品滚动容器
    private _rechargeGroup: eui.Group;                          // 充值容器
    private _rechargeScroller: eui.Group;                       // 充值滚动容器
    private _roleShop: ShopPage[] = [];                         // 角色商品集合
    private _sceneShop: ShopPage[] = [];                        // 场景商品集合
    private _roadShop: ShopPage[] = [];                         // 道路商品集合
    private _itemShop: ShopPage[] = [];                         // 物品商品集合
    private _rechargeShop: ShopPage[] = [];                     // 充值商品集合

    private _totalPingGaiLabel: eui.BitmapLabel;                // 瓶盖总数文本

    private _shuaXinTime: number = 0;                               // 刷新间隔
}