/**
 * 角色选择界面
 */
class RoleSelect extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RoleSelectSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        if (this._roleID != 0){
            this.SetRole(this._roleID);
        }
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._sceneIma.skinName = SkinCreateMgr.CreateButton("guankaxj_jiaobiao" + lg + "_png", "guankaxj_jiaobiao" + lg + "_png", "guankaxj_jiaobiao_off" + lg + "_png");
        this._sceneIma.enabled = true;
        this.SetRole(this._roleID);
    }

    /**
     * 设置角色
     */
    public SetRole(roleID: number){
        this._roleID = roleID;
        if (!this._isCreated) return;
        var role: Role = UnitManager.GetRole(roleID);
        this._roleImage.source = role.HeadRes;
        this._ifHave = role.IsHave;
        this._roleNameLabel.text = role.Name;

        this._sceneIma.visible = role.Scene == 0 ? false: true;
        this._sceneIma.enabled = role.IsSceneStart ? true : false;

        var lg: string = StringMgr.LanguageSuffix;
        if(!this._ifHave){
            this._roleImage.visible = false;
            this._roleNameLabel.visible = false;
            this._selectBgImage.source = "guankaxj_kuang_off_png";
        }else{
            this._roleImage.visible = true;
            this._roleNameLabel.visible = true;
            this._selectBgImage.source = "guankaxj_kuang_png";
        }
    }

    /**
     * 点击响应
     */
    private _OnClick(){
        if (UnitManager.CurrentRole.ID == this._roleID) return;
        var role: Role = UnitManager.GetRole(this._roleID);
        if (!role.IsHave) return;
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;

        NetManager.SendRequest(["func=" + NetNumber.ChangeRoleOrTheme + "&id=" + this._roleID
                            + "&oemInfo=" + JSON.stringify(data)],
                                this._OnChangeComplete.bind(this));
        
        if (Main.IsLocationDebug && !Main.IsNeedNetDebug){
            UnitManager.ChangeRole(this._roleID);
            WindowManager.RoleSelectWindow().UpdateSelect(this);
        }
    }

	/**
     * 切换回调
     */
    private _OnChangeComplete(jsonData: Object){
        if (jsonData["code"] == NetManager.SuccessCode){
            var data: Object = jsonData["data"];
            UnitManager.ChangeRole(data["role"]);
            WindowManager.RoleSelectWindow().UpdateSelect(this);
        }
    }

    /**
     * 设置选中状态
     */
    public set Selected(value: boolean){
        this._selectImage.visible = value;
    }

    // 变量
    private _isCreated: boolean = false;            // 是否创建完成
    private _roleImage: eui.Image;                  // 角色图片
    private _selectImage: eui.Image;                // 选择框
    private _selectBgImage: eui.Image;              // 选择角色背景
    private _roleID: number = 0;                    // 角色ID
    private _roleNameLabel: eui.Label;              // 角色名字

    private _ifHave: boolean;                       // 是否拥有
    private _sceneIma: eui.Button;                   // 是否有特殊场景
}