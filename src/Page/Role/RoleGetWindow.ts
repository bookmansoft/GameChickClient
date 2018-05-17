/**
 * 获得角色界面
 */
class RoleGetWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RoleGetWindowSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseDown,this);
		this._shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShareDown,this);
		this._lookButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onLookDown,this);
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._shareButton.skinName = SkinCreateMgr.CreateButton("juesehuode_an_fenxiang_l" + lg + "_png", "juesehuode_an_fenxiang_a" + lg + "_png");
        this._lookButton.skinName = SkinCreateMgr.CreateButton("juesehuode_an_chakan_l" + lg + "_png", "juesehuode_an_chakan_a" + lg + "_png");
		
		this._bg.source = "juesehuode_di" + lg + "_png";

		if(this._curRole){
			this._roleIma.source = this._curRole.GetRes + lg + "_png";
		}
    }

	/**
	 * 点击关闭
	 */
	private onCloseDown(e){
        SoundManager.PlayButtonMusic();
		this.IsVisibled = false;
	}

	/**
	 * 点击分享
	 */
	private onShareDown(e){
        SoundManager.PlayButtonMusic();
		if (this._curRole != null){
			NetManager.SendRequest(["func=" + "role.share" + "&id=" + this._curRole.ID + "&choose=" + 1]);
		}
		else{
			NetManager.SendRequest(["func=sceneShare&type=" + 1]);
		}
		
		var id: number = this._curRole == null? 2005 : this._curRole.ID;
		var textSet: string[] = GameConstData.GetShareContentByID(id);
		if (textSet.length == 2){
			window["shareCont"] = FBSDKMgr.Share(textSet[0], textSet[1]);
			window["share"]();
			// FBSDKMgr.Share(textSet[0], textSet[1]);
		}
		else{
			window["shareCont"] = FBSDKMgr.Share();
			window["share"]();
			// FBSDKMgr.Share();
		}

		this._shareButton.enabled = false;
	}

	/**
	 * 点击查看
	 */
	private onLookDown(e){
        SoundManager.PlayButtonMusic();
		this.IsVisibled = false;
		let _curDetail = WindowManager.RoleDetailWindow();
		_curDetail.UpdataShow(this._curRole);
		_curDetail.IsVisibled = true;
	}

	/**
	 * 显示
	 */
	public Show($role:Role){
		this.IsVisibled = true;
		this._lookButton.visible = true;;
		this._curRole = $role;
		this._tipLabel.text = StringMgr.GetText("rolegetpagetext1") + this._curRole.Name;
		this._roleIma.source = this._curRole.GetRes + StringMgr.LanguageSuffix + "_png";
	}

	/**
	 * 显示图片(场景)
	 */
	public ShowImage(name: string){
		this.IsVisibled = true;
		this._curRole = null;
		this._tipLabel.text = StringMgr.GetText("rolegetpagetext2");
		this._lookButton.visible = false;
		this._roleIma.texture = RES.getRes(name);
	}

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
			this._shareButton.enabled = true;
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
    private _isVisibled: boolean = false;   			    // 是否显示

	private _bg: eui.Image;									// 背景
	private _closeButton: eui.Button;						// 关闭按钮
	private _lookButton: eui.Button;						// 查看按钮
	private _shareButton: eui.Button;						// 分享按钮

	private _roleIma: eui.Image;							// 角色图片
	private _curRole: Role;									// 角色

	private _tipLabel: eui.Label;							// 提示
}