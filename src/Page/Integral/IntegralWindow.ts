/**
 * 积分页面
 */
class IntegralWindow extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/IntegralWindowSkins.exml";
        this._ReadData();
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        // GameEvent.AddEventListener(EventType.VIPTimeUpdate, this._UpdateTime, this);

        // 初始化按钮
        let pageGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        pageGroup.addEventListener(egret.Event.CHANGE, this._UpdataPage, this);
        this._integralExchangeRadio.group = pageGroup;
        this._integralExchangeRadio.value = 1;
        this._integralRankRadio.group = pageGroup;
        this._integralRankRadio.value = 2;
        this._UpdataPage(null);

        this.touchEnabled = true;
        this.touchChildren = true;

        this._ruleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleClick, this);
        
        this._UpdataShow();
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._integralTimeLabel0.text = StringMgr.GetText("integraltext2");
        this._integralExchangeRadio.skinName = SkinCreateMgr.CreateRadioButton("jifen_an_duihuan_huang" + lg + "_png", "jifen_an_duihuan_lan" + lg + "_png");
        this._integralRankRadio.skinName = SkinCreateMgr.CreateRadioButton("jifen_an_paihang_huang" + lg + "_png", "jifen_an_paihang_lan" + lg + "_png");
        
        this._UpdataShow();
        if(IntegralManager.RankNum == 0){
            this._myRankNumLabel.text = StringMgr.GetText("integraltext3");
        }else{
            this._myRankNumLabel.text = StringMgr.GetText("integraltext4") + IntegralManager.RankNum;
        }
    }

    /**
     * 读取数据
     */
    private _ReadData(){

        this._IntegralTypeData = IntegralManager.IntegralInformation();
        this._IntegralExchangeDataSet = IntegralManager.IntegralExchangeRewardsData();
        this._IntegralRankDataSet = IntegralManager.IntegralRankRewards();

    }

    /**
     * 点击规则按钮
     */
    private onRuleClick(e){
        if (WindowManager.IntegralRuleWindow() == null){
            WindowManager.SetWindowFunction(this._OpenIntegralRule.bind(this));
            return;
        }
        this._OpenIntegralRule();
    }

    /**
     * 打开规则界面
     */
    private _OpenIntegralRule(){
        if(this._exchangeGroup.visible) 
            WindowManager.IntegralRuleWindow().upDataShow(StringMgr.GetText(this._IntegralTypeData["cumulativerule"]));
        else
            WindowManager.IntegralRuleWindow().upDataShow(StringMgr.GetText(this._IntegralTypeData["rankingrule"]));
    }

    /**
     * 更新页面
     */
    private _UpdataPage(evt: egret.Event){
        let value: number = 1;
        if (evt != null){
            let group: eui.RadioButtonGroup = evt.target;
            value = group.selectedValue;
        }
        this._exchangeGroup.visible = value == 1;
        this._rankGroup.visible = value == 2;

        if(this._rankGroup.visible){
            // 获取活动排名
            NetManager.SendRequest(["func=" + NetNumber.ActivityRankList], this._ReveiveActivityRank.bind(this));
        }else{
            this._UpdataShow();
        }
    }

    /**
     * 接受活动排行信息
     */
    private _ReveiveActivityRank(jsonData: Object){
        let code: number = jsonData["code"];

        if(code == NetManager.SuccessCode){
            this._rankObjectSet = jsonData["data"]["list"];
        }

        this._UpdataShow();
    }

    /**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            if(this._rankGroup.visible){
                // 获取活动排名
                NetManager.SendRequest(["func=" + NetNumber.ActivityRankList], this._ReveiveActivityRank.bind(this));
            }
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
     * 更新显示
     */
    private _UpdataShow(){
        // 更新兑换列表
        if(this._exchangeGroup.visible){
            // 初始化列表
            for (let i = 0; i < this._exchangeListSet.length; i++){
                if (this._exchangeListSet[i].parent != null){
                    this._exchangeListGroup.removeChild(this._exchangeListSet[i]);
                }
            }
            
            // 添加显示信息
            let index: number = 0;
            let listY: number = 0;
            let list: IntegralExchangeList = null;
            for (let j = 0; j < this._IntegralExchangeDataSet.length; j++){
                list = this._GetExchangeList(index);
                list.upDataShow(this._IntegralExchangeDataSet[j]);
                this._exchangeListGroup.addChild(list);
                list.y = listY;
                index += 1;
                listY += list.height;
            }
        }


        // 更新排名列表
        if(this._rankGroup.visible){
            // 初始化列表
            for (let i = 0; i < this._rankListSet.length; i++){
                if (this._rankListSet[i].parent != null){
                    this._rankListGroup.removeChild(this._rankListSet[i]);
                }
            }
            

            let _rankNum: number = 0;
            let _ifPlayer: boolean = false;

            // 添加显示信息
            let index: number = 0;
            let listY: number = 0;
            let list: IntegralRankList = null;
            for (let j = 0; j < this._rankObjectSet.length; j++){
                if(this._rankObjectSet[j]["rank"] != 0){
                    list = this._GetRankList(index);

                    if(this._rankObjectSet[j]["openid"] == UnitManager.PlayerID){
                        _rankNum = this._rankObjectSet[j]["rank"];
                        _ifPlayer = true;
                    }else{
                        _ifPlayer = false;
                    }

                    list.upDataShow(_ifPlayer, this._rankObjectSet[j], this._IntegralRankDataSet);
                    this._rankListGroup.addChild(list);
                    list.y = listY;
                    index += 1;
                    listY += list.height;

                    
                }
            }

            IntegralManager.RankNum = _rankNum;

            if(IntegralManager.RankNum == 0){
                this._myRankNumLabel.text = StringMgr.GetText("integraltext3");
            }else{
                this._myRankNumLabel.text = StringMgr.GetText("integraltext4") + IntegralManager.RankNum;
            }
        }

        this._integralTimeLabel.text = StringMgr.GetText("integraltext5") + IntegralManager.StartTime + "—" + IntegralManager.EndTime;
    }

    /**
     * 返回一个兑换列表
     */
    private _GetExchangeList(index: number): IntegralExchangeList{
        let list: IntegralExchangeList = null;
        if (index < this._exchangeListSet.length){
            list = this._exchangeListSet[index];
        }
        else{
            list = new IntegralExchangeList();
            this._exchangeListSet.push(list);
        }
        return list;
    }

    /**
     * 返回一个排名列表
     */
    private _GetRankList(index: number): IntegralRankList{
        let list: IntegralRankList = null;
        if (index < this._rankListSet.length){
            list = this._rankListSet[index];
        }
        else{
            list = new IntegralRankList();
            this._rankListSet.push(list);
        }
        return list;
    }

    // 变量
    private _isVisibled: boolean = false;                       // 是否显示
	private _listSet: RoleList[] = [];                          // 列表集合

	private _scroller: eui.Scroller;			                // 滚动区域
	private _roleGroup: eui.Group;			                    // 显示容器

    private _integralExchangeRadio: eui.RadioButton;            // 积分兑换按钮
    private _integralRankRadio: eui.RadioButton;                // 积分排行按钮
    private _ruleButton: eui.Button;                            // 规则按钮

    private _exchangeGroup: eui.Group;                          // 兑换列表容器
    private _exchangeListGroup: eui.Group;                      // 兑换列表滚动容器

    private _rankGroup: eui.Group;                              // 排名列表容器
    private _rankListGroup: eui.Group;                          // 排名列表滚动容器
    private _myRankNumLabel: eui.Label;                         // 我的排名文本
    private _integralTimeLabel: eui.Label;                      // 活动时间
    private _integralTimeLabel0: eui.Label;

    private _rankListSet: IntegralRankList[] = [];              // 排名集合
    private _exchangeListSet: IntegralExchangeList[] = [];      // 兑换集合

    private _IntegralTypeData: Object = null;                   // 活动详情
    private _IntegralRankDataSet: Object[] = [];                // 活动排名奖励JSON
    private _IntegralExchangeDataSet: Object[] = [];            // 活动兑换奖励JSON

    private _rankObjectSet: Object[] = [];                      // 排名列表数据
}