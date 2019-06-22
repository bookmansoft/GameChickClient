/**
* 玩家
*/
class Player {
    /**
     * 构造方法
     */
    public constructor(id: string, name: string, money: number, pinggai: number, maxScore: number, token: string, headUrl:string) {
        this._id = id;
        this.Name = name;
        this.Money = money;
        this.PingGai = pinggai;
        this.MaxScore = maxScore;
        this._gameToken = token;
        this.HearUrl = headUrl;

        ProcessManager.AddProcess(this._Process.bind(this));
        GameEvent.AddEventListener(EventType.MaxPhysicalChange, this._PhysicalChange, this);
        GameEvent.AddEventListener(EventType.PhysicalChange, this._PhysicalChange, this);
    }
    
    /**
     * ID
     */
    public get ID(): string {
        return this._id;
    }

    /**
     * 玩家游戏验证码
     */
    public get GameToken(): string{
        return this._gameToken;
    }
    
    /**
     * 金钱
     */
    public set Money(value: number) {
        this._money = value;
        GameEvent.DispatchEvent(EventType.MoneyChange);
    }
    
    /**
     * 金钱
     */
    public get Money(): number {
        return this._money;
    }

    /**
     * 消耗金钱
     */
    public ConsumeMoney(value: number) {
        this.Money -= value;
    }

    /**
     * 测试金钱是否足够
     */
    public TestMoney(value: number): boolean{
        if (this._money >= value) return true;
        var cha: number = value - this._money;
        var text: string = StringMgr.GetText("playertext1");
        text = text.replace("&money", cha.toString());
        PromptManager.CreatCenterTip(false,false,text, null,this._GoShopItemPage.bind(this));
        return false;
    }

    /**
	 * 前往商店购买
	 */
	private _GoShopItemPage(){
        if (WindowManager.ShopWindow() == null){
            WindowManager.SetWindowFunction(this._GoItemShop.bind(this));
            return;
        }
        this._GoItemShop();
	}

    /**
	 * 前往商店
	 */
    private _GoItemShop(){
        if(WindowManager.RoleDetailWindow().IsVisibled){
            WindowManager.RoleDetailWindow().IsVisibled = false;
        }
        WindowManager.StarWindow().OpenWindow(WindowManager.ShopWindow());
        WindowManager.ShopWindow().OpenItemPage();
        var slaveHDWindow: SlaveHDWindow = WindowManager.SlaveHDWindow();
        if (slaveHDWindow != null && slaveHDWindow.IsVisibled){
            slaveHDWindow.IsVisibled = false;
        }
    }

    /**
     * 瓶盖
     */
    public set PingGai(value: number) {
        this._pingGai = value;
        GameEvent.DispatchEvent(EventType.PingGaiChange);
    }
    
    /**
     * 瓶盖
     */
    public get PingGai(): number {
        return this._pingGai;
    }

    /**
     * 消耗瓶盖
     */
    public ConsumePingGai(value: number) {
        this.PingGai -= value;
    }

    /**
     * 测试瓶盖是否足够
     */
    public TestPingGai(value: number): boolean{
        if (this._pingGai >= value) return true;
        var cha: number = value - this._pingGai;
        var text: string = StringMgr.GetText("playertext3");
        text = text.replace("&token", cha.toString());
        PromptManager.CreatCenterTip(false,false,text,null, this._GoShopRechargePage.bind(this));
        
        return false;
    }

    /**
	 * 前往商店购买
	 */
	private _GoShopRechargePage(){
        if (WindowManager.ShopWindow() == null){
            WindowManager.SetWindowFunction(this._GoRechargeShop.bind(this));
            return;
        }
        this._GoRechargeShop();
	}

    /**
	 * 前往商店
	 */
    private _GoRechargeShop(){
        WindowManager.StarWindow().OpenWindow(WindowManager.ShopWindow());
        WindowManager.ShopWindow().OpenRecharge();
        var slaveHDWindow: SlaveHDWindow = WindowManager.SlaveHDWindow();
        if (slaveHDWindow != null && slaveHDWindow.IsVisibled){
            slaveHDWindow.IsVisibled = false;
        }
    }
    
    /**
     * 玩家名字
     */
    public set Name(name: string) {
        this._name = name;
    }

    /**
     * 玩家名字
     */
    public get Name(): string {
        if (!this._name) {
            return `Vallnet${(Math.random()*100000)|0}`;
        } 
        return this._name;
    }

    /**
     * 玩家头像
     */
    public set HearUrl(headUrl: string) {
        if (this._headUrl == headUrl) return;
        this._headUrl = headUrl;
        GameEvent.DispatchEvent(EventType.PlayerHeadChange);
    }

    /**
     * 玩家头像
     */
    public get HearUrl(): string {
        if (this._headUrl == "") return "resource/res/common/anniu_off.png";
        return this._headUrl;
    }

    /**
     * 最大分数
     */
    public set MaxScore(score: number){
        if (score > this._maxScore){
            this._maxScore = score;
        }
    }

    /**
     * 最大分数
     */
    public get MaxScore(): number{
        return this._maxScore;
    }

    /**
     * 体力最大值
     */
    public set MaxPhysical(value: number){
        if (this._maxPhysical == value) return;
        this._maxPhysical = value;
        GameEvent.DispatchEvent(EventType.MaxPhysicalChange);
    }

    /**
     * 体力最大值
     */
    public get MaxPhysical(): number{
        return this._maxPhysical;
    }

    /**
     * 当前体力
     */
    public set Physical(value: number){
        if (this._physical == value) return;
        this._physical = value;
        if (this._physical == this._maxPhysical){
            this.PhysicalTime = 0;
        }
        GameEvent.DispatchEvent(EventType.PhysicalChange);
    }

    /**
     * 当前体力
     */
    public get Physical(): number{
        return this._physical;
    }

    /**
     * 消耗体力
     */
    public PhysicalConsume(value: number): boolean{
        var isPass: boolean = this._TestPhysical(value);
        if (isPass){
            this.Physical -= value;
        }
        return isPass;
    }

    /**
     * 检查体力是否足够
     */
    private _TestPhysical(value: number): boolean{
        if (this.Physical >= value) return true;
        UnitManager.PhysicalNoEnough();
        return false;
    }

    /**
     * 体力恢复时间(秒)
     */
    public set PhysicalTime(time: number){
        if (time == this._physicalTime) return;
        if (this.Physical == this.MaxPhysical) time = 0;
        this._physicalTime = time;
        GameEvent.DispatchEvent(EventType.PhysicalTimeChange);
    }

    /**
     * 体力恢复时间(秒)
     */
    public get PhysicalTime(): number{
        return this._physicalTime;
    }

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        var time: number = 1000;
        this._timer += frameTime;
        if (this._timer >= time){
            this._timer -= time;
            if (this.PhysicalTime > 0){
                this.PhysicalTime -= 1;
                if (this.PhysicalTime == 0){
                    this.Physical += 1;
                }
            }
            if (this._vipTime > 0){
                this.VIPTime -= 1;
            }
        }
    }

    /**
     * 体力改变处理
     */
    private _PhysicalChange(){
        if (this.Physical == this.MaxPhysical){
            this.PhysicalTime = 0;
        }
        if (this.Physical < this.MaxPhysical && this.PhysicalTime == 0){
            this.PhysicalTime = this.PhysicalMaxTime;
        }
    }

    /**
     * 体力恢复最大时间
     */
    public set PhysicalMaxTime(value: number){
        this._physicalMaxTime = value;
    }

    /**
     * 体力恢复最大时间
     */
    public get PhysicalMaxTime():number{
        return this._physicalMaxTime;
    }

    /**
     * 是否是VIP
     */
    public get IsVIP(): boolean{
        return this._vipTime > 0;
    }

    /**
     * VIP剩余时间(秒)
     */
    public get VIPTime(): number{
        return this._vipTime;
    }

    /**
     * VIP剩余时间(秒)
     */
    public set VIPTime(value: number){
        if (value < 0) value = 0;
        if (value == this._vipTime) return;
        this._vipTime = value;
        GameEvent.DispatchEvent(EventType.VIPTimeUpdate);
    }
     
    // 变量
    private _id: string;                    // ID
    private _name: string = "";             // 名字
    private _money: number;                 // 金钱
    private _pingGai: number;               // 瓶盖
    private _maxScore: number = 0;          // 最高分数
    private _gameToken: string;             // 游戏令牌
    private _headUrl: string;               // 头像
    private _maxPhysical: number = 0        // 体力最大值
    private _physical: number = 0;          // 体力
    private _physicalTime: number = 0;      // 体力恢复时间(秒)
    private _timer: number = 0;             // 计时器
    private _physicalMaxTime: number = 0;   // 体力恢复最大时间
    private _vipTime: number = 0;           // VIP剩余时间
}