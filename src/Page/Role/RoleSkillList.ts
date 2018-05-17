/**
 * 角色技能列表
 */
class RoleSkillList extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RoleSkillListSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._skillDetailGroup.visible = false;
		this._qiangHuaButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onQiangHuaTap,this);
		this._lookDetailRect.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onlookDetailBegin,this);
		this.addEventListener(egret.TouchEvent.TOUCH_END,this.onlookDetailEnd,this);
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._lookDetailIma.source = "juesexiangqing_chakanxq_l" + lg + "_png";
        this._qiangHuaButton.skinName = SkinCreateMgr.CreateButton("juesexiangqing_qianghua_l" + lg + "_png", "juesexiangqing_qianghua_a" + lg + "_png", "juesexiangqing_qianghua_off" + lg + "_png");
    }

	/**
	 * 点击强化
	 */
	private onQiangHuaTap(e){
		if(UnitManager.Player.TestMoney(this._moneyNum)){
			NetManager.SendRequest(["func=" + NetNumber.upRoleSkill + "&id=" + this._curRole.ID + "&skid=" + this._skillCiShu + 
						"&price=" + this._moneyNum],this._UpRoleSkillReturn.bind(this));
		}
		
	}

	/**
	 * 技能升级返回
	 */
	private _UpRoleSkillReturn(jsonData: Object){
		if(jsonData["code"] == NetManager.SuccessCode){
			// console.log(jsonData);
			this._curRole.SetSkillLevelByNum(jsonData["data"]["sk1"],1);
			this._curRole.SetSkillLevelByNum(jsonData["data"]["sk2"],2);
			this._curRole.SetSkillLevelByNum(jsonData["data"]["sk3"],3);
			this.upDateShow(this._curRole , this._skillCiShu);
			this.creatSkillUpDroArm();
			GameEvent.DispatchEvent(EventType.RoleSkillUpLevel);
		}
		else{
			PromptManager.CreatCenterTip(false,false,"强化失败!");
		}
	}

	/**
	 * 创建技能升级龙骨动画
	 */
	private creatSkillUpDroArm(){
		let res = "jiesuo";
		let _skillUpArm: egret.MovieClip = new egret.MovieClip();
		_skillUpArm.movieClipData = MovieManager.GetMovieClipData(res + "_json",res + "_png",res);
		// _skillUpArm.x = 0;
        // _skillUpArm.y = 0;
        this.addChild(_skillUpArm);
		_skillUpArm.play(1);
		_skillUpArm.addEventListener(egret.Event.COMPLETE, this.skillUpDroArmCom, this);
		this._skillUpArmSet.push(_skillUpArm);
	}
	/**
	 * 解锁动画播放结束
	 */
	private skillUpDroArmCom(e:egret.Event){
		if(this._skillUpArmSet[0]){
			this._skillUpArmSet[0].removeEventListener(egret.Event.COMPLETE, this.skillUpDroArmCom, this);
			this.removeChild(this._skillUpArmSet[0]);
			this._skillUpArmSet.splice(0,1);
		}
	}


	/**
	 * 点击查看详情
	 */
	private onlookDetailBegin(e){
        var lg: string = StringMgr.LanguageSuffix;
		this._lookDetailIma.texture = RES.getRes("juesexiangqing_chakanxq_a" + lg + "_png");
		this._skillDetailGroup.visible = true;
	}

	/**
	 * 松开查看详情
	 */
	private onlookDetailEnd(e){
        var lg: string = StringMgr.LanguageSuffix;
		this._lookDetailIma.texture = RES.getRes("juesexiangqing_chakanxq_l" + lg + "_png");
		this._skillDetailGroup.visible = false;
	}

	/**
	 * 更新
	 * $role 角色信息
	 * $curSkillNum 当前是第几个技能
	 */
	public upDateShow($role: Role, $curSkillNum: number):any{

		this._curRole = $role;
		this._skillCiShu = $curSkillNum;
		this._curSkill = this._curRole.AllSkillSet[$curSkillNum - 1];

		this._skillDetailLabel.text = this._curSkill.OverView;
		this._skillIcon.texture = RES.getRes(this._curSkill.ImageRes);

		this._skillNameLabel.text = this._curSkill.Name;
		this._skillNameLabel.filters = [FilterManage.AddMiaoBian(2,0x0c305d)];
        var lg: string = StringMgr.LanguageSuffix;
		this._skillTypeIma.texture = this._curSkill.IsInitiative ? RES.getRes("jineng_fenlei_zhudong" + lg + "_png"):RES.getRes("jineng_fenlei_beidong" + lg + "_png");

		
		// 更新详情tip里面的内容
		this._moneyNum = Math.ceil( GameConstData.SkillMoneyBase * Math.pow(this._curSkill.Level,1.6) );
		this._qiangHuaNumLabel2.text = this._moneyNum.toString();
		this._qiangHuaNumLabel.text = this._moneyNum.toString();
		
		let des = this._curSkill.Desc.replace("&data", this._curSkill.SkillValue.toString());
		this._skillDetailLabel2.textFlow = FBSDKMgr.HtmlParser(des);


		// 解锁所需角色描述
		let msg = "";
		let lv = this._curSkill.Level + 1;
		let _labelSet:eui.Label[] = [this._jieSuoRoleLabel1,this._jieSuoRoleLabel2,this._jieSuoRoleLabel3,this._jieSuoRoleLabel4];
		for(let i=0; i<_labelSet.length; i++){
			_labelSet[i].text = "";
		}
		for(let i=0; i<this._curSkill.JieSuoRole.length; i++){
			if(this._curSkill.JieSuoRole[i].Level < lv){
				msg = "<font color=0xff0000>" + this._curSkill.JieSuoRole[i].Name + " " + lv + " " + StringMgr.GetText("roleskillpagetext1") + "</font>";
			}else{
				msg = this._curSkill.JieSuoRole[i].Name + " " + lv + " " + StringMgr.GetText("roleskillpagetext1");
			}
			_labelSet[i].textFlow = FBSDKMgr.HtmlParser(msg);
		}

		// 判断是否解锁
		let isJieSuo: boolean = this._curSkill.IsJieSuo;
		if(isJieSuo){
			this._suoIma.visible = false;
			this._skillLevelLabel.visible = true;
			this._qianghuaGroup.visible = true;
			this._skillLevelLabel.text = "l" + this._curSkill.Level;
			this._jieSuoTypeLabel.text = StringMgr.GetText("roleskillpagetext2");
		}else{
			this._suoIma.visible = true;
			this._skillLevelLabel.visible = false;
			this._qianghuaGroup.visible = false;
			this._jieSuoTypeLabel.text = StringMgr.GetText("roleskillpagetext3");
			this._qiangHuaNumLabel2.text = "0";
			this._qiangHuaNumLabel.text = "0";
		}

		// 判断是否可以强化
		if(this._curSkill.IsCanUp){
			this._qiangHuaButton.enabled = true;
			this._redIma.visible = true;
		}else{
			this._qiangHuaButton.enabled = false;
			this._redIma.visible = false;
		}

		if(this._redIma.visible && UnitManager.Player.Money < this._moneyNum){
			this._redIma.visible = false;
		}
	}

	private _skillDetailLabel: eui.Label;						// 角色技能详情
	private _skillIcon: eui.Image;								// 角色技能图片
	private _suoIma: eui.Image;									// 未解锁图标

	private _curSkill: Skill;									// 存储技能信息
	private _curRole: Role;										// 存储角色信息

	private _skillTypeIma: eui.Image;							// 技能类型
	private _qianghuaGroup: eui.Group;							// 技能强化容器
	private _lookDetailIma: eui.Image;							// 查看详情图标
	private _skillNameLabel: eui.Label;							// 技能名称文本
	private _skillLevelLabel: eui.BitmapLabel;					// 技能等级文本
	private _qiangHuaButton: eui.Button;						// 强化按钮
	private _qiangHuaNumLabel: eui.Label;						// 强化金币文本

	private _skillDetailGroup: eui.Group;						// 技能详情容器
	private _qiangHuaNumLabel2: eui.Label;						// 强化金币文本2
	private _skillDetailLabel2: eui.Label;						// 技能详情描述文本2
	private _jieSuoTypeLabel: eui.Label;						// 解锁类型文本

	private _skillCiShu: number;								// 第几个技能
	private _moneyNum: number;									// 花费金币数量


	private _skillUpArmSet: egret.MovieClip[] = [];		// 技能升级动画

	private _jieSuoRoleLabel1: eui.Label;						// 解锁角色文本1
	private _jieSuoRoleLabel2: eui.Label;						// 解锁角色文本2
	private _jieSuoRoleLabel3: eui.Label;						// 解锁角色文本3
	private _jieSuoRoleLabel4: eui.Label;						// 解锁角色文本4

	private _redIma: eui.Image;									// 强化红点

	private _lookDetailRect: eui.Rect;							// 查看详情响应区域
}