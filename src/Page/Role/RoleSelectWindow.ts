/**
 * 角色选择界面
 */
class RoleSelectWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/SelectRoleSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartClick, this);
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);

        GameEvent.AddEventListener(EventType.GameStart, this._OnGameStart, this);
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._name.source = "guankaxj_di" + lg + "_png";
        this._startButton.skinName = SkinCreateMgr.CreateButton("anniu_kaishi_l" + lg + "_png", "anniu_kaishi_a" + lg + "_png");
        this._closeButton.skinName = SkinCreateMgr.CreateButton("anniu_quxiao_l" + lg + "_png", "anniu_quxiao_a" + lg + "_png");
    }

    /**
     * 关闭点击响应
     */
    private _OnCloseClick(){
        this.IsVisibled = false;
        CheckpointManager.IsCatch = false;
        CheckpointManager.IsRunaway = false;
    }

    /**
     * 开始按钮点击响应
     */
    private _OnStartClick(){
        if (this._isClick) return;
        this._isClick = true;
        SoundManager.PlayButtonMusic();
        if (ResReadyMgr.IsReady(UnitManager.CurrentRole.ResGroupName)){
            this._Start();
        }
        else {
            WindowManager.WaitPage().IsVisibled = true;
            this._isStartGame = true;
        }
        if (GuideManager.IsGuide){
            GuideManager.GuideFinish(7);
        }
    }

    /**
     * 开始
     */
    private _Start(){
        WindowManager.WaitPage().IsVisibled = true;
        this._isStartGame = false;
        if (CheckpointManager.IsEndless){
        	Main.Instance.StarBattle();
        }
        else if (CheckpointManager.IsDailyActive){
            if(WindowManager.DailyActiveStartWindow().IsVisibled){
                WindowManager.DailyActiveStartWindow().IsVisibled = false;
            }
        	Main.Instance.StarBattle();
        }
        else if (CheckpointManager.IsCatch){
        	Main.Instance.StarBattle();
        }
        else if (CheckpointManager.IsRunaway){
        	Main.Instance.StarBattle();
        }
        else {
            if(UnitManager.Player.PhysicalConsume(CheckpointManager.CurrentCheckpoint.ConsumePhy)){
                Main.Instance.StarBattle();
            }
            else{
                this._isClick = false;
                WindowManager.WaitPage().IsVisibled = false;
            }
        }
    }

    /**
     * 资源加载完成调用
     */
    public ResLoadEnd(){
        if (!this._isStartGame) return;
        WindowManager.WaitPage().IsVisibled = false;
        if (ResReadyMgr.IsReady(UnitManager.CurrentRole.ResGroupName)){
            this._Start();
        }
    }

    /**
     * 游戏开始响应
     */
    private _OnGameStart(){
        WindowManager.StarWindow().IsVisibled = false;
        this.IsVisibled = false;
        this._isClick = false;
    }

    /**
     * 更新显示
     */
    private _UpdateShow(){
        var roleSet: Role[] = UnitManager.GetRoleSet();
        
        let _jiesuoRole = [];
        let _noJiesuoRole = [];

        for (let i = 0; i < roleSet.length; i++){
            let role: Role = roleSet[i];
            if(role.IsHave){
                _jiesuoRole.push(this.creatSelectRole(i,role));
            }else{
                _noJiesuoRole.push(this.creatSelectRole(i,role));
            }
        }

        let index = 0;
        for(let i=0;i<_jiesuoRole.length;i++){
            this.setSelectPosi(index, _jiesuoRole[i]);
            index += 1;
        }
        for(let i=0;i<_noJiesuoRole.length;i++){
            this.setSelectPosi(index, _noJiesuoRole[i]);
            index += 1;
        }
    }

    /**
     * 创建选择角色框
     */
    private creatSelectRole(index:number, role:Role){
        if (index <= this._roleSelectSet.length){
            this._roleSelectSet.push(new RoleSelect());
        }
        let select: RoleSelect = this._roleSelectSet[index];
        select.SetRole(role.ID);
        select.Selected = role.ID == UnitManager.CurrentRole.ID;

        return select;
    }

    /**
     * 设置位置
     */
    private setSelectPosi(index:number, select:RoleSelect){
        let realIndex: number = index % 3;
        select.x = realIndex == 0? 0 : 170 * realIndex;
        select.x += 0;
        select.y = 0 + 200 * Math.floor(index / 3);
        if(index >= 9)
            select.x += 100;
        this._roleGroup.addChild(select);
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
            this._UpdateShow();
            if (GuideManager.IsGuide && GuideManager.GuideID == 7){
                GuideManager.GuideCheck();
            }
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
     * 更新选中状态
     */
    public UpdateSelect(target: RoleSelect){
        for (var i = 0; i < this._roleSelectSet.length; i++){
            if (this._roleSelectSet[i] == target){
                this._roleSelectSet[i].Selected = true;
            }
            else{
                this._roleSelectSet[i].Selected = false;
            }
        }
    }

    /**
     * 开始游戏引导
     */
    public StartGameGuide(){
        if (!this.IsVisibled) return;
        var x: number = this._startButton.x;
        var y: number = this._startButton.y;
        var width: number = this._startButton.width;
        var height: number = this._startButton.height;
        GuideManager.ShowGuideWindow(0, x, y, width, height);
    }

    // 变量
    private _isVisibled: boolean = false;           // 是否显示
    private _startButton: eui.Button;               // 开始按钮
    
    private _bg: eui.Image;                         // 背景图片
    private _name: eui.Image;                       // 名字图片
    private _closeButton: eui.Button;               // 关闭按钮
    private _roleSelectSet: RoleSelect[] = [];      // 角色集合
    private _isClick: boolean = false;              // 是否点击过开始了
    private _isStartGame: boolean = false;          // 是否开始游戏

    private _roleGroup: eui.Group;                  // 角色容器
}