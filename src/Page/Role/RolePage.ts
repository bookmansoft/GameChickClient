/**
 * 角色界面
 */
class RolePage extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RolePageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._scroller.bounces = false;
        GameEvent.AddEventListener(EventType.RoleUpLevel, this._OnJieSuo, this);
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._UpdataShow();
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
     * 等级提升响应
     */
	private _OnJieSuo(){
		if (this.IsVisibled){
			this._UpdataShow();
		}
	}

	/**
     * 更新显示
     */
    private _UpdataShow(){
        let roleSet:Role[] = UnitManager.GetRoleSet();
        
        // this._scroller.viewport.scrollV = 0;
		// 显示
        let _jieSuoRoleSet = [];
        let _canjieSuoRoleSet = [];
        let _noJieSuoRoleSet = [];
        for(let i=0; i< roleSet.length; i++){
            if(this._listSet.length <= i){
                let rolelist = new RoleList;
			    this._roleGroup.addChild(rolelist);
                this._listSet.push(rolelist);
            }

            this._listSet[i].upDateShow(roleSet[i]);
            if(roleSet[i].Level>0){
                _jieSuoRoleSet.push(this._listSet[i]);
            }
            else{
                if(roleSet[i].GetCurRoleNum >= roleSet[i].GetRoleNum){
                    _canjieSuoRoleSet.push(this._listSet[i]);
                }else{
                    _noJieSuoRoleSet.push(this._listSet[i]);
                }
            }
		}

        // 排序。未解锁的在下面
        let _listHeight = 0;
        for(let i=0; i<_canjieSuoRoleSet.length; i++){
            _canjieSuoRoleSet[i].y = _listHeight;
			_listHeight = _canjieSuoRoleSet[i].y + _canjieSuoRoleSet[i].height;
        }
        for(let i=0; i<_jieSuoRoleSet.length; i++){
            _jieSuoRoleSet[i].y = _listHeight;
			_listHeight = _jieSuoRoleSet[i].y + _jieSuoRoleSet[i].height;
        }
        for(let i=0; i<_noJieSuoRoleSet.length; i++){
            _noJieSuoRoleSet[i].y = _listHeight;
			_listHeight = _noJieSuoRoleSet[i].y + _noJieSuoRoleSet[i].height;
        }
    }

	// 变量
    private _isVisibled: boolean = false;       // 是否显示
	private _listSet: RoleList[] = [];          // 列表集合

	private _scroller: eui.Scroller;			// 滚动区域
	private _roleGroup: eui.Group;			    // 显示容器
}