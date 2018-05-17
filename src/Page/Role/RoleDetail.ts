/**
 * 角色详情界面
 */
class RoleDetail extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RoleDetailSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this._sxDetailGroup.visible = false;

		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseDown,this);
		this._upButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onUpDown,this);
		this._getButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGetDown,this);
		this._detailButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onDetailDown,this);
		this.addEventListener(egret.TouchEvent.TOUCH_END,this.onDetailUp,this);

		GameEvent.AddEventListener(EventType.RoleUpLevel, this._OnUpDataEvent, this);
		GameEvent.AddEventListener(EventType.RoleSuiPianItemUpdate, this._OnUpDataEvent, this);
		GameEvent.AddEventListener(EventType.RoleSkillUpLevel, this._OnUpDataEvent, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
		this._bg.source = "juesexiangqing_di" + lg + "_png";
        this._healthDetailLabel.text = StringMgr.GetText("roledetailtext1");
        this._fangYuDetailLabel.text = StringMgr.GetText("roledetailtext2");
        this._xinYunDetailLabel.text = StringMgr.GetText("roledetailtext3");
        this._getButton.skinName = SkinCreateMgr.CreateButton("juesexiangqing_huode_l" + lg + "_png", "juesexiangqing_huode_a" + lg + "_png", "juesexiangqing_huode_off" + lg + "_png");
        this._upButton.skinName = SkinCreateMgr.CreateButton("juesexiangqing_shengji_l" + lg + "_png", "juesexiangqing_shengji_a" + lg + "_png", "juesexiangqing_shengji_off" + lg + "_png");
    }

	/**
	 * 点击关闭
	 */
	private onCloseDown(e){
        SoundManager.PlayButtonMusic();
		this.IsVisibled = false;
	}

	/**
	 * 点击升级
	 */
	private onUpDown(e){
        SoundManager.PlayButtonMusic();
		if(this._curRole.GetCurRoleNum < this._curRole.UpLevelDebrisNum){
			let num:number = this._curRole.UpLevelDebrisNum - this._curRole.GetCurRoleNum;
			let _allMoney:number = ItemManager.GetItemByID(this._curRole.Pieceid).Price * num;

			PromptManager.CreatCenterTip(false,false,StringMgr.GetText("roledetailtext4"),null,this._OnGoShopPage.bind(this));
		}
		else{
			NetManager.SendRequest(["func=" + NetNumber.upRole + "&id=" + this._curRole.ID.toString()],this._UpRoleReturn.bind(this));
		}
	}

	/**
	 * 点击获得
	 */
	private onGetDown(e){
        SoundManager.PlayButtonMusic();
		if(this._curRole.GetCurRoleNum < this._curRole.UpLevelDebrisNum){
			// let num:number = this._curRole.UpLevelDebrisNum - this._curRole.GetCurRoleNum;
			// let _allMoney:number = ItemManager.GetItemByID(this._curRole.Pieceid).Price * num;
			PromptManager.CreatCenterTip(false,false,StringMgr.GetText("roledetailtext4"),null,this._OnGoShopPage.bind(this));
		}
		// this._OnGoShopPage();
	}

	/**
	 * 前往商店购买碎片
	 */
	private _OnGoShopPage(){
		this.IsVisibled = false;
		if (WindowManager.ShopWindow() == null){
            WindowManager.SetWindowFunction(this._GoShop.bind(this));
            return;
        }
        this._GoShop();
	}

    /**
	 * 前往商店
	 */
    private _GoShop(){
        WindowManager.StarWindow().OpenWindow(WindowManager.ShopWindow());
        WindowManager.ShopWindow().OpenRolePage();
    }

	/**
	 * 升级角色返回
	 */
	private _UpRoleReturn(jsonData: Object){
		if(jsonData["code"] == NetManager.SuccessCode){
			// console.log(jsonData);
			ItemManager.SetItemCount(this._curRole.Pieceid,jsonData["data"]["chip"])
			// ItemManager.UseItem(this._curRole.Pieceid,this._curRole.UpLevelDebrisNum);
			// this._curRole.Level = jsonData["data"]["lv"];
			this.creatShenJiDroArm();
		}
		else{
			PromptManager.CreatCenterTip(false,false,StringMgr.GetText("roledetailtext5"));
		}
	}

	/**
	 * 创建升级龙骨动画
	 */
	private creatShenJiDroArm(){
		let res = "shengji";
		let _shengji: egret.MovieClip = new egret.MovieClip();
		_shengji.movieClipData = MovieManager.GetMovieClipData(res + "_json",res + "_png",res);
		_shengji.x = 0;
        _shengji.y = 0;
        this.addChild(_shengji);
		_shengji.touchEnabled = false;
		_shengji.play(1);
		this._shenjiArmSet.push(_shengji);
		_shengji.addEventListener(egret.Event.COMPLETE, this.shengJiDroArmCom, this);
	}

	/**
	 * 升级动画播放结束
	 */
	private shengJiDroArmCom(e:egret.Event){
		if(this._shenjiArmSet[0]){
			this.removeChild(e.target);
			this._shenjiArmSet[0].removeEventListener(egret.Event.COMPLETE, this.shengJiDroArmCom, this);
			this._shenjiArmSet.splice(0,1);
			let MaxLife = this._curRole.MaxLife;
			let Defense = this._curRole.Defense;
			let Lucky = this._curRole.Lucky;
			this._curRole.Level += 1;
			this.creatShenJiLabel(1,this._curRole.MaxLife - MaxLife);
			this.creatShenJiLabel(2,this._curRole.Defense - Defense);
			this.creatShenJiLabel(3,this._curRole.Lucky - Lucky);
		}
	}

	/**
	 * 创建升级文本 1 生命 2 防御 3 人品
	 */
	private creatShenJiLabel(num: number,msg: number){
		let _label: eui.Label = new eui.Label();
		this.addChild(_label);
		_label.size = 24;
		_label.textColor = 0xF24E3E;
		_label.bold = true;
		_label.fontFamily = "微软雅黑";
		_label.text = "+" + msg;
		_label.x = 533;
		if(num == 1){
			_label.y = 292;
		}else if(num == 2){
			_label.y = 332;
		}else if(num == 3){
			_label.y = 368;
		}
		egret.Tween.get(_label).to({y:_label.y - 20},300).wait(100).to({y:_label.y - 30,alpha:0},200).call(()=>{this.removeChild(_label);},this);
	}

	/**
	 * 点击详细介绍
	 */
	private onDetailDown(e){
		this._sxDetailGroup.visible = true;
	}

	/**
	 * 松开详细介绍
	 */
	private onDetailUp(e){
		this._sxDetailGroup.visible = false;
	}
	

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
        }
        else{
			this.returnRoleArmature();
			this.removeUpAni();
            Main.Instance.WindowTopLayer.removeChild(this);
        }
    }

	/**
	 * 移除所有升级光效
	 */
	private removeUpAni(){
		if(this._shenjiArmSet.length >0){
			this._curRole.Level += this._shenjiArmSet.length;
			for(let i=0;i<this._shenjiArmSet.length;i++){
				this._shenjiArmSet[i].stop();
				this._shenjiArmSet[i].removeEventListener(egret.Event.COMPLETE, this.shengJiDroArmCom, this);
				this.removeChild(this._shenjiArmSet[i]);
			}
			this._shenjiArmSet = [];
		}
	}

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
     * 事件，有更新响应
     */
	private _OnUpDataEvent(){
		if (this._curRole != null){
			this._curRole = UnitManager.GetRole(this._curRole.ID);
			this.UpdataShow(this._curRole);
		}
	}

	/**
     * 更新显示
     */
    public UpdataShow($data:Role){
		this._curRole = $data;
		
		this._levelLabel.text = "LV."+this._curRole.Level.toString();
		this._nameLabel.text = this._curRole.Name;
		this._healthLabel.text = this._curRole.MaxLife.toString();
		this._fangYuLabel.text = this._curRole.Defense.toString();
		this._XinYunLabel.text = this._curRole.Lucky.toString();
		this._roleTeDianLabel.text = StringMgr.GetText("roledetailtext6") + this._curRole.Specialty;
		if(ItemManager.GetItemByID(this._curRole.Pieceid))
			this._roleSuiPianIma.source = ItemManager.GetItemByID(this._curRole.Pieceid).ImageRes;


		// 获得按钮的显示判断
		if(this._curRole.GetCurRoleNum < this._curRole.UpLevelDebrisNum){
			this._upButton.visible = false;
			this._getButton.visible = true;
		}else{
			this._upButton.visible = true;
			this._getButton.visible = false;
		}

		// 升级按钮的状态判断
		let widthBiLi = this._curRole.GetCurRoleNum/this._curRole.UpLevelDebrisNum;
		if(widthBiLi >= 1)widthBiLi = 1;
		if(this._curRole.Level < GameConstData.RoleMaxLevel && this._curRole.Level != 0){
			this._suiPianNumLabel.text = this._curRole.GetCurRoleNum.toString() + "/" + this._curRole.UpLevelDebrisNum.toString();
			this._suiPianTiaoIma.width = widthBiLi*265;
			this._upButton.enabled = true;
		}else if(this._curRole.Level == 0){
			this._suiPianNumLabel.text = this._curRole.GetCurRoleNum.toString() + "/" + this._curRole.UpLevelDebrisNum.toString();
			this._suiPianTiaoIma.width = widthBiLi*265;
			this._upButton.enabled = false;
			this._levelLabel.text = "LV.1";
		}
		else{
			this._suiPianNumLabel.text = StringMgr.GetText("roledetailtext7");
			this._suiPianTiaoIma.width = 265;
			this._upButton.enabled = false;
			this._upButton.visible = true;
			this._getButton.visible = false;
		}

		// 红点的显示判断
		if(this._curRole.Level >= GameConstData.RoleMaxLevel || this._curRole.GetCurRoleNum < this._curRole.UpLevelDebrisNum){
			this._redIma.visible = false;
		}else{
			this._redIma.visible = true;
		}
		

		let skillArr = [this._skill1,this._skill2,this._skill3];
		for(let i=0; i<skillArr.length; i++){
			skillArr[i].upDateShow(this._curRole,i+1);
		}

		this.creatRoleArmature();
    }

	/**
	 * 创建展示动画
	 */
	private creatRoleArmature(){
		if (!ResReadyMgr.IsReady("startrole")) return;

		this.returnRoleArmature();

		this._curAniNum = 0;
		this._curDongZuoNum = 0;
		let res: string = this._curRole.Res;
		this._curRoleArmature = ArmaturePool.GetArmature(res + "_01_json", res + "_01texture_json",
                                                        res + "_01texture_png", res + "_01");
		this.RandAniPlay();
		this._curRoleArmature.display.x = 205;
        this._curRoleArmature.display.y = 355;
        this.addChild(this._curRoleArmature.display);
	}

	/**
	 * 随机动画
	 */
	private RandAniPlay(){
		let tymepNum = 0;
		do{
			tymepNum = Math.floor(Math.random() * this._playMovName.length);
		}while(this._curAniNum == tymepNum)

		this._curAniNum = tymepNum;
		this._curDongZuoNum = 0;
		
		this._curRoleArmature.animation.play(this._playMovName[this._curAniNum][this._curDongZuoNum],1);
		this._curRoleArmature.addEventListener(dragonBones.Event.COMPLETE, this.AniComplete, this);
	}

	/**
	 * 动画播放完判断
	 */
	private AniComplete(){
		this._curRoleArmature.removeEventListener(dragonBones.Event.COMPLETE, this.AniComplete, this);

		if(this._curDongZuoNum == this._playMovName[this._curAniNum].length-1){
			this.RandAniPlay();
		}else{
			if(this.IsVisibled){
				this._curDongZuoNum +=1;
				this._curRoleArmature.animation.play(this._playMovName[this._curAniNum][this._curDongZuoNum],1);
				this._curRoleArmature.addEventListener(dragonBones.Event.COMPLETE, this.AniComplete, this);
			}
		}
	}



	/**
	 * 回收展示动画
	 */
	public returnRoleArmature(){
		if(this._curRoleArmature != null){
			this._curRoleArmature.removeEventListener(dragonBones.Event.COMPLETE, this.AniComplete, this);
			this.removeChild(this._curRoleArmature.display);
			ArmaturePool.ReturnPool(this._curRoleArmature);
			this._curRoleArmature = null;
		}
	}

	// 变量
    private _isVisibled: boolean = false;   			    // 是否显示

	private _bg: eui.Image;									// 背景
	private _upButton: eui.Button;							// 升级按钮
	private _closeButton: eui.Button;						// 关闭按钮
	private _detailButton: eui.Button;						// 属性详细介绍按钮

	private _levelLabel: eui.Label;							// 等级
	private _nameLabel: eui.Label;							// 名字
	private _healthLabel: eui.Label;						// 生命文本
	private _fangYuLabel: eui.Label;						// 防御文本
	private _XinYunLabel: eui.Label;						// 幸运文本
	private _suiPianNumLabel: eui.Label;					// 碎片数量文本

	private _roleSuiPianIma: eui.Image;						// 碎片图片

	private _healthDetailLabel: eui.Label;					// 生命属性详细介绍文本
	private _fangYuDetailLabel: eui.Label;					// 防御属性详细介绍文本
	private _xinYunDetailLabel: eui.Label;					// 幸运属性详细介绍文本

	private _sxDetailGroup: eui.Group;						// 属性详细介绍容器

	private _skill1: RoleSkillList;							// 技能1
	private _skill2: RoleSkillList;							// 技能2
	private _skill3: RoleSkillList;							// 技能3

	private _redIma: eui.Image;								// 红点

	private _curRole: Role;									// 存储当前角色

	private _curRoleArmature: dragonBones.Armature;			// 角色展示动画

	private _curDongZuoNum: number = 0;						// 当前播放动画的第几个动作
	private _curAniNum: number = 0;							// 当前播放的第几个动画

	private _playMovName: any[] = [["walk"],["jump_01","jump_03"]];						// 动作存储

	private _shenjiArmSet: egret.MovieClip[] = [];		// 升级动画

	private _roleTeDianLabel: eui.Label;					// 角色特点文本
	private _getButton: eui.Button;							// 获得按钮
	private _suiPianTiaoIma: eui.Image;						// 碎片进度条

	private _tempLevel: number = 0;							// 临时等级
}