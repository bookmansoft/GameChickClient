/**
 * 技能
 */
class Skill{
    /**
     * 构造方法
     */
    public constructor(data: JSON){
        this._id = data["id"];
        this._name = data["name"];
        this._imageRes = data["pic"];
        this._effect = data["effect"];
        this._desc = data["desc"];

        this._type = data["type"];
        this._mpcost = data["mpcost"];
        this._overview = data["overview"];
        this._gameSkillNameRes = data["skilltext"];
    }

    /**
     * ID
     */
    public get ID(): number{
        return this._id;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return StringMgr.GetText(this._name);
    }

    /**
     * 图片资源
     */
    public get ImageRes(): string{
        return this._imageRes + "_png";
    }

    /**
     * 名字图片资源
     */
    public get GameSKillNameRes(): string{
        return this._gameSkillNameRes + StringMgr.LanguageSuffix + "_png";
    }

    /**
     * 描述
     */
    public get Desc(): string{
        return StringMgr.GetText(this._desc);
    }

    /**
     * 技能类型
     */
    public get Type(): number{
        return this._type;
    }

    /**
     * 是否是主动技能
     */
    public get IsInitiative(): boolean{
        if(this._type == 0) return false;
        return true;
    }

    /**
     * 技能所需能量
     */
    public get MpCost(): number{
        return this._mpcost;
    }

    /**
     * 技能简介？
     */
    public get OverView(): string{
        return StringMgr.GetText(this._overview);
    }

    /**
     * 等级
     */
    public get Level(): number{
        return this._level;
    }

    /**
     * 等级
     */
    public set Level($num: number){
        this._level = $num;
        GameEvent.DispatchEvent(EventType.RoleUpLevel);
    }

    /**
	 * 技能属于哪个角色
	 */
	public get PreRoleID():number{
		return this._preRole;
	}

    /**
	 * 技能属于哪个角色
	 */
	public set PreRoleID(roleId: number){
		this._preRole = roleId;
	}

    /**
	 * 技能解锁条件
	 */
	public SetjiesuoRole($unlockRole:string){
        this._unlockSet = $unlockRole;
        if($unlockRole == ""){
            this._jiesuoRoleIdSet = [this._preRole];
        }else{
            let roleIDSet = $unlockRole.split(",");
            for(let j=0; j<roleIDSet.length; j++){
                this._jiesuoRoleIdSet.push(parseInt(roleIDSet[j]));
            }
            this._jiesuoRoleIdSet.push(this._preRole);
        }
	}

    /**
	 * 技能解锁条件
	 */
	public get JieSuoRole():Role[]{
        if(this._jiesuoRoleSet.length == 0){
            for(let i=0 ;i<this._jiesuoRoleIdSet.length; i++){
                this._jiesuoRoleSet.push(UnitManager.GetRole(this._jiesuoRoleIdSet[i]));
            }
        }
		return this._jiesuoRoleSet;
	}

    /**
	 * 是否可以升级
	 */
	public get IsCanUp():boolean{
        for(let i=0; i<this.JieSuoRole.length; i++){
            if(this.JieSuoRole[i].Level < this.Level + 1)
                return false;
        }
		return true;
	}

	/**
	 * 是否解锁
	 */
	public get IsJieSuo():boolean{
        if(this.Level <=0) return false;
		return true;
	}

	/**
	 * 技能值
	 */
    public get SkillValue(): number{
        var value: number = 0;
        var role: Role = UnitManager.GetRole(this._preRole);
        var level: number = Math.max(1, this._level);
        switch(this._id){
            case SkillEnum_s.Defense:
                value = Math.floor((this._GetValue("effectDefBase") + this._GetValue("effectDefUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Life:
                value = Math.floor((this._GetValue("effectLifeBase") + this._GetValue("effectLifeUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Fare:
                value = Math.floor((this._GetValue("effectLuckyBase") + this._GetValue("effectLuckyUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Protect:
                value = Math.floor((this._GetValue("effectInjuryFreeBase") + this._GetValue("effectInjuryFreeUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Lucky:
                value = Math.floor((this._GetValue("effectRealLuckyBase") + this._GetValue("effectRealLuckyUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Score:
                value = Math.floor((this._GetValue("effectScoreBase") + this._GetValue("effectScoreUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Money:
                value = Math.floor((this._GetValue("effectMoneyBase") + this._GetValue("effectMoneyUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Bonus:
                value = Math.floor((this._GetValue("effectDropBase") + this._GetValue("effectDropUpdata") * level) * 10) / 10;
                break;
            case SkillEnum_s.Revive:
                value = Math.floor(this._GetValue("effectRebornBase") + Math.pow(this._GetValue("effectRebornUpdata") * (level - 1), 0.8));
                break;
            case SkillEnum_s.FlyBoat:
                value = (this._GetValue("effectPlaneBase") + this._GetValue("effectPlaneUpdata") * level);
                break;
            case SkillEnum_s.Jump:
                value = this._GetValue("effectJumpBase") + Math.floor(this._GetValue("effectJumpUpdata") * (level) * role.MaxLife);
                break;
            case SkillEnum_s.Shield:
                value = Math.floor(this._GetValue("effectShieldBase") + this._GetValue("effectShieldUpdata") * level / 100 * role.MaxLife);
                break;
            case SkillEnum_s.Action:
                value = (this._GetValue("effectClearApBase") + this._GetValue("effectClearApUpdata") * level);
                break;
            case SkillEnum_s.FenShen:
                value = Math.floor(this._GetValue("effectFenShenBase") + this._GetValue("effectFenShenUpdata") * (level - 1) + this._GetValue("effectFenShenLife") * role.MaxLife);
                break;
            case SkillEnum_s.FenShenHuiFu:
                value = Math.floor((this._GetValue("effectFenShenRecoverBase") + this._GetValue("effectFenShenRecoverUpdata") * (level - 1) + this._GetValue("effectFenShenRecoverLife") * role.MaxLife) / 4 / 5);
                break;
            case SkillEnum_s.FenShenQiangHua:
                value = (this._GetValue("effectFenShenPlusBase") + this._GetValue("effectFenShenPlusUpdata") * (level - 1));
                break;
            case SkillEnum_s.ZhaoHuanXuZuo:
                value = Math.floor(this._GetValue("effectNinjaShieldBase") + this._GetValue("effectNinjaShieldUpdata") * (level - 1) + this._GetValue("effectNinjaShieldLife") * role.MaxLife);
                break;
            case SkillEnum_s.ChangeHurt:
                value = Math.floor(this._GetValue("effectNinjaShieldRecoverBase") + Math.pow(this._GetValue("effectNinjaShieldRecoverUpdata") * (level - 1), 0.8));
                break;
            case SkillEnum_s.XiaoShiHuiFu:
                value = this._GetValue("effectNinjaShieldRecoverExBase") + this._GetValue("effectNinjaShieldRecoverExUpdata") * level;
                break;
            case SkillEnum_s.ZhiHuoZaiSheng:
                value = Math.floor(this._GetValue("effectNinjaRecoverFixedValue") + Math.floor((this._GetValue("effectNinjaRecoverBase") + this._GetValue("effectNinjaRecoverUpdata") * (level - 1))) * role.MaxLife / 100);
                break;
            case SkillEnum_s.AllItemHuiFu:
                value = Math.floor(this._GetValue("effectNinjaItemRecoverBase") + this._GetValue("effectNinjaItemRecoverUpdata") * level / 100 * role.MaxLife);
                break;
            case SkillEnum_s.AddHuiFu:
                value = Math.floor(this._GetValue("effectNinjaRecoverPlusBase") + this._GetValue("effectNinjaRecoverPlusUpdata") * level);
                break;
        }
        return value;
    }

    /**
     * 获得常量值
     */
    private _GetValue(key: string): number{
        return GameConstData.GetValue(key);
    }


    // 变量
    private _id: number;                            // ID
    private _name: string;                          // 名字
    private _imageRes: string;                      // 图片资源
    private _effect: string;                        // 效果
    private _desc: string;                          // 描述
    private _type: number = 0;                      // 技能类型
    private _mpcost: number = 0;                    // 技能所需能量
    private _overview: string;                      // 技能简介？
    private _level: number = 0;                         // 等级

    private _preRole: number;							// 属于哪个角色的
    private _jiesuoRoleSet: Role[] = [];					// 解锁条件
    private _jiesuoRoleIdSet: number[] = [];			// 解锁角色Id条件
	private _skill: Skill;							// 技能

    private _gameSkillNameRes: string;                      // 游戏内名字资源
    private _unlockSet:string;                              // 解锁条件
}