/**
 * 角色列表
 */
class RoleList extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RoleListSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._peiYangButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onPeiYangDown,this);
		this._jieSuoButton.enabled = false;
		this._jieSuoButton.visible = false;
		this._jieSuoButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onJieSuoDown,this);
		this._yulanButton.visible = true;
		this._yulanButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onPeiYangDown,this)

		GameEvent.AddEventListener(EventType.RoleUpLevel, this._OnUpDataEvent, this);
		GameEvent.AddEventListener(EventType.RoleSkillUpLevel, this._OnUpDataEvent, this);
		GameEvent.AddEventListener(EventType.RoleSuiPianItemUpdate, this._OnUpDataEvent, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._textLabel.text = StringMgr.GetText("rolelisttext1");
		this._peiYangButton.skinName = SkinCreateMgr.CreateButton("peiyang_l" + lg + "_png", "peiyang_a" + lg + "_png");
		this._jieSuoButton.skinName = SkinCreateMgr.CreateButton("jiesuo_l" + lg + "_png", "jiesuo_l" + lg + "_png", "jiesuo_a" + lg + "_png");
		this._yulanButton.skinName = SkinCreateMgr.CreateButton("yulan_l" + lg + "_png", "yulan_a" + lg + "_png");

		this.upDateShow(this._curRole);
    }

	/**
	 * 点击培养
	 */
	private onPeiYangDown(e){
        SoundManager.PlayButtonMusic();
		let _curDetail = WindowManager.RoleDetailWindow();
		_curDetail.UpdataShow(this._curRole);
		_curDetail.IsVisibled = true;
	}

	/**
	 * 点击解锁
	 */
	private onJieSuoDown(e){
        SoundManager.PlayButtonMusic();
		NetManager.SendRequest(["func=" + NetNumber.upRole + "&id=" + this._curRole.ID],this._UpRoleReturn.bind(this));
	}

	/**
	 * 解锁角色返回
	 */
	private _UpRoleReturn(jsonData: Object){
		if(jsonData["code"] == NetManager.SuccessCode){
			ItemManager.UseItem(this._curRole.Pieceid,this._curRole.GetRoleNum);
			// 更新角色技能
			if(jsonData["data"]["lv"]){
				this._curRole.Level = jsonData["data"]["lv"];
				this._curRole.SetSkillLevelByNum(jsonData["data"]["sk1"],1);
				this._curRole.SetSkillLevelByNum(jsonData["data"]["sk2"],2);
				this._curRole.SetSkillLevelByNum(jsonData["data"]["sk3"],3);
			}
			else{
				this._curRole.Level = 1;
			}
			// 更新相关联角色技能
			if(jsonData["data"]["unlock"]){
				var data: Object = jsonData["data"]["unlock"];
					Object.keys(data).map((key)=>{
					let obj: Object = data[key];
					let id: number = parseInt(obj["id"]);
					let level: number = obj["lv"];
					let sk1: number = obj["sk1"];
					let sk2: number = obj["sk2"];
					let sk3: number = obj["sk3"];
					let role: Role = UnitManager.GetRole(id);
					if (role != null){
						role.SetSkillLevelByNum(sk1,1);
						role.SetSkillLevelByNum(sk2,2);
						role.SetSkillLevelByNum(sk3,3);
					}
				});
				GameEvent.DispatchEvent(EventType.RoleUpLevel);
			}
			WindowManager.RoleGetPage().Show(this._curRole);
		}
		else{
			PromptManager.CreatCenterTip(false,false,StringMgr.GetText("rolelisttext2"));
		}
	}

	/**
     * 事件，有更新响应
     */
	private _OnUpDataEvent(){
		if (this._curRole != null){
			this.upDateShow(this._curRole);
		}
	}

	/**
	 * 更新
	 * $role 角色信息
	 */
	public upDateShow($role:Role){
		if($role == null) return;
		this._curRole = $role;

		// 测试显示
		this._levelLabel.text = "LV."+this._curRole.Level;
		this._roleIcon.source = this._curRole.HeadRes;

		if(this._curRole.IsHave == false){//未解锁
			this._lanDiGroup.visible = true;
			this._baiDiGroup.visible = false;
			this._lanDiNameLabel.text = this._curRole.Name;
			
			this._jinDuLabel.text = this._curRole.GetCurRoleNum.toString() + "/" + this._curRole.GetRoleNum.toString();
			this._jinDuLabel.filters = [FilterManage.AddMiaoBian(1,0x000000)];

			// 进度条长度
			if(this._curRole.GetCurRoleNum/this._curRole.GetRoleNum>=1){
				this._jinDuTiaoIma.width = 211;
			}
			else{
				this._jinDuTiaoIma.width = this._curRole.GetCurRoleNum/this._curRole.GetRoleNum * 211;
			}

			// 解锁按钮状态
			if(this._curRole.Level < GameConstData.RoleMaxLevel && this._curRole.GetCurRoleNum >= this._curRole.GetRoleNum){
				this._jieSuoButton.enabled = true;
				this._jieSuoButton.visible = true;
				this._redIma.visible = true;
				this._yulanButton.visible = false;
			}else{
				this._jieSuoButton.enabled = false;
				this._jieSuoButton.visible = false;
				this._yulanButton.visible = true;
				this._redIma.visible = false;
			}
		}
		else{
			this._lanDiGroup.visible = false;
			this._baiDiGroup.visible = true;
			this._baiDiNameLabel.text = this._curRole.Name;

			if(this._curRole.Level < GameConstData.RoleMaxLevel && this._curRole.GetCurRoleNum >= this._curRole.UpLevelDebrisNum){
				this._redIma.visible = true;
			}else{
				this._redIma.visible = false;
			}
		}


		// 如果没有红点，判断技能是否可以强化
		if(this._redIma.visible == false){
			for(let i=0; i<this._curRole.UseSkillSet.length; i++){
				let _moneyNum = Math.ceil( GameConstData.SkillMoneyBase * Math.pow(this._curRole.UseSkillSet[i].Level,1.6) );
				if(this._curRole.UseSkillSet[i].IsCanUp && UnitManager.Player.Money >= _moneyNum){
					this._redIma.visible = true;
					return;
				}
			}
		}
	} 


	private _baiDiGroup: eui.Group;					// 白底的容器。已解锁的角色
	private _lanDiGroup: eui.Group;					// 蓝底的容器。未解锁的角色
	private _levelLabel: eui.Label;					// 等级
	private _roleIcon: eui.Image;					// 角色头像
	private _baiDiNameLabel: eui.Label;				// 白底角色昵称
	private _lanDiNameLabel: eui.Label;				// 蓝底角色昵称
	private _jinDuTiaoIma: eui.Image;				// 进度条图片
	private _jinDuLabel: eui.Label;					// 进度条文本

	private _redIma: eui.Image;						// 红点

	private _peiYangButton: eui.Button;				// 培养按钮
	private _jieSuoButton: eui.Button;				// 解锁按钮

	private _curRole: Role;							// 存储角色数据

	private _curDetail: RoleDetail;					// 角色详细界面
	private _yulanButton: eui.Button;				// 预览按钮
	private _textLabel: eui.Label;
}