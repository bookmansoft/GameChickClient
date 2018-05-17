/**
 * 角色
 */
class Role{
    /**
     * 构造方法
     * @param json  数据Json串
     */
    public constructor(json: JSON){
        this._id = json["id"];
        this._name = json["name"];
        this._res = json["res"];
        this._sJumpMusic = json["sjump"] + SoundManager.Music_Suffix;
        this._bJumpMusic  = json["bjump"] + SoundManager.Music_Suffix;
        this._dieMusic = json["die"] + SoundManager.Music_Suffix;
        this._lifeBase = json["basehp"];
        this._lifeRate = json["hprate"];
        this._defenseBase = json["basedef"];
        this._defenseRate = json["defrate"];
        this._luckyBase = json["baselucy"];
        this._luckyRate = json["lucyrate"];
        this._pieceid = json["pieceid"];
        
        this._headRes = json["headres"];
        this._resGroupName = json["resgroupname"];

        this._skillID1 = json["skill1"];
        this._skillID2 = json["skill2"];
        this._skillID3 = json["skill3"];
        this._skillSound = json["skillv"];

        this._specialty = json["specialty"];
        this._unlockskill1 = json["unlockskill1"];
        this._unlockskill2 = json["unlockskill2"];
        this._unlockskill3 = json["unlockskill3"];
        this._skill1 = SkillManager.creatSkill(this._skillID1,this._id,this._unlockskill1);
        this._skill2 = SkillManager.creatSkill(this._skillID2,this._id,this._unlockskill2);
        this._skill3 = SkillManager.creatSkill(this._skillID3,this._id,this._unlockskill3);

        this._getImaRes = json["resget"];

        this._isscene = json["isscene"];

        this._level = 0;
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
     * 资源
     */
    public get Res(): string{
        return this._res;
    }

    /**
     * 资源组名字
     */
    public get ResGroupName(): string{
        return this._resGroupName;
    }

    /**
     * 头像资源
     */
    public get HeadRes(): string{
        return this._headRes + "_png";
    }

    /**
     * 碎片的物品id
     */
    public get Pieceid(): number{
        return this._pieceid;
    }

    /**
     * 小跳音乐
     */
    public get SmallJumpMusic(): string{
        return this._sJumpMusic;
    }

    /**
     * 大跳音乐
     */
    public get BigJumpMusic(): string{
        return this._bJumpMusic;
    }

    /**
     * 死亡音乐
     */
    public get DieMusic(): string{
        return this._dieMusic;
    }

    /**
     * 等级
     */
    public set Level(value: number){
        if (this._level == value) return;
        this._level = value;
        this._UpdateSkillRunner();
        this.MaxLife;
        GameEvent.DispatchEvent(EventType.RoleUpLevel);
    }

    /**
     * 等级
     */
    public get Level(): number{
        return this._level;
    }

    /**
     * 特点
     */
    public get Specialty(): string{
        return StringMgr.GetText(this._specialty);
    }
    

    /**
     * 是否拥有该角色
     */
    public get IsHave(): boolean{
        return this.Level > 0;
    }

    /**
     * 获取解锁技能条件角色id字符串列表
     */
    public get UnlockSkillSet(): string[]{
        return [this._unlockskill1,this._unlockskill2,this._unlockskill3];
    }

    /**
     * 获取技能id列表
     */
    public get SkillIdSet(): number[]{
        return [this._skillID1,this._skillID2,this._skillID3];
    }

    /**
     * 获取角色所有技能信息列表
     */
    public get AllSkillSet(): Skill[]{
        return [this._skill1,this._skill2,this._skill3];
    }

    /**
     * 设置技能等级
     * $lv 等级
     * $num 第几个技能
     */
    public SetSkillLevelByNum(lv: number ,num: number){
        this.AllSkillSet[num-1].Level = lv;
        this._UpdateSkillRunner();
    }

    /**
     * 获取已生效技能列表
     */
    public get UseSkillSet(): Skill[]{
        var idSet: Skill[] = [];

        for(let i=0; i<this.AllSkillSet.length; i++){
            if(this.AllSkillSet[i].IsJieSuo)
                idSet.push(this.AllSkillSet[i]);
        }
        // 根据技能解锁角色是否存在来判断解锁技能
        // for(let i=0; i<this.UnlockSkillSet.length; i++){
        //     let roleSet = [];
        //     let _isPush: boolean = false;
        //     if(this.UnlockSkillSet[i] == ""){
        //         _isPush = true;
        //     }else{
        //         roleSet = this.UnlockSkillSet[i].split(";");

        //         let haveRoleNum = 0;
        //         for(let j=0; j<roleSet.length; j++){
        //             haveRoleNum += UnitManager.GetRole( parseInt(roleSet[j]) ).IsHave == true ? 1 : 0;
        //         }
        //         _isPush = roleSet.length == haveRoleNum ? true : false;
        //     }
        //     if(_isPush){
        //         if(i == 0) idSet.push(this._skillID1);
        //         else if(i == 1) idSet.push(this._skillID2);
        //         else if(i == 2) idSet.push(this._skillID3);
        //     }
        // }

        return idSet;
    }

    /**
     * 根据技能id判断技能是否生效
     */
    public IsUseSkillById($id: number):boolean{
        for(let i = 0; i <this.UseSkillSet.length; i++){
            if($id == this.UseSkillSet[i].ID){
                return true;
            }
        }
        return false;
    }

    /**
     * 生命最大值
     */
    public get MaxLife(): number{
        var lifeRate: number = this.SkillRunner.Properties["life"];
        var life: number = 0;
        var level: number = this.Level == 0? 1: this.Level;
        life = this._lifeBase * Math.pow((level - 1) + this._lifeRate * level, 0.6);
        if (lifeRate != null){
            life *= (1 + lifeRate);
        }
        life = Math.floor(life);
        return life;
    }

    /**
     * 当前生命值
     */
    public get CurrentLife(): number{
        return this._currentLife;
    }

    /**
     * 当前生命值
     */
    public set CurrentLife(value: number){
        // 判断生命边界值
        if (value < 0) value = 0;
        if (value > this.MaxLife) value = this.MaxLife;
        // 判断值是否修改
        if (this._currentLife == value) return;
        // 修改生命值并触发事件
        this._currentLife = value;
        GameEvent.DispatchEvent(EventType.RoleLifeChange);
    }

    /**
     * 防御
     */
    public get Defense(): number{
        var defense: number = 0;
        var level: number = this.Level == 0? 1: this.Level;
        defense = this._defenseBase * Math.pow((level - 1) * 2 + this._defenseRate * level, 0.6);
        var defenseRate: number = this.SkillRunner.Properties["defense"];
        if (defenseRate != null){
            defense *= (1 + defenseRate);
        }
        defense = Math.floor(defense);
        return defense;
    }

    /**
     * 幸运（用于显示）
     */
    public get Lucky(): number{
        var lucky: number = 0;
        var level: number = this.Level == 0? 1: this.Level;
        lucky = this._luckyBase * Math.pow((level - 1) * 2 + this._luckyRate * level, 0.6);
        var fare: number = this.SkillRunner.Properties["fare"];
        if (fare != null){
            lucky *= (1 + fare);
        }
        lucky = Math.floor(lucky);
        return lucky;
    }

    /**
     * 最终幸运值（用于实际逻辑计算）
     */
    public get RealLucky(): number{
        var lucky: number = 0;
        lucky = this.Lucky / (this.Lucky + GameConstData.HopeLucky + GameConstData.LuckyRate * this.Level);
        var luckyRate: number = this.SkillRunner.Properties["lucky"];
        if (luckyRate != null){
            lucky *= (1 + luckyRate);
        }
        return lucky;
    }

    /**
     * 免伤率
     */
    public get InjuryFreeRate(): number{
        var value: number = 0;
        value = this.Defense / (this.Defense + GameConstData.HopeDefense + GameConstData.InjuryFreeRate * this.Level);
        var protect: number = this.SkillRunner.Properties["protect"];
        if (protect != null){
            value *= (1 + protect);
        }
        return value;
    }

    /**
     * 获取角色所需碎片数量
     */
    public get GetRoleNum(): number{
        return GameConstData.GetRoleNum;
    }

    /**
     * 获取角色当前碎片数量
     */
    public get GetCurRoleNum(): number{
        return ItemManager.GetItemCount(this._pieceid);
    }

    /**
     * 获取升级碎片数量
     */
    public get UpLevelDebrisNum(): number{
        var num: number = this._GetDebrisNum(this.Level);
        num = Math.ceil(num);
        return num;
    }

    /**
     * 获取具体某个级别提升需要的碎片数量
     */
    private _GetDebrisNum(level: number): number{
        if (level == 0){
            return this.GetRoleNum;
        }
        var value: number = 0;
        value = this._GetDebrisNum(level - 1) + GameConstData.DebrisConumRate * level;
        value = Math.ceil(value);
        return value;
    }

    /**
     * 技能管理
     */
    private _UpdateSkillRunner(): SkillRunner_s{
        this._skillRunnerLv = this._level;
        this._skillRunner = SkillManager.GetSkillRunner(this);
        return this._skillRunner;
    }

    /**
     * 角色技能管理
     */
    public get SkillRunner(): SkillRunner_s{
        if (this._skillRunner == null){
            this._UpdateSkillRunner();
        }
        if (this._level != this._skillRunnerLv){
            this._UpdateSkillRunner();
        }
        return this._skillRunner;
    }

    /**
     * 角色分数加成
     */
    public get ScoreRate(): number{
        var value: number = 0;
        var score: number = this.SkillRunner.Properties["score"];
        if (score != null){
            value = score;
        }
        return value;
    }

    /**
     * 角色金币加成
     */
    public get MoneyRate(): number{
        var value: number = 0;
        var money: number = this.SkillRunner.Properties["money"];
        if (money != null){
            value = money;
        }
        return value;
    }

    /**
     * 角色奖励掉落加成
     */
    public get BonusRate(): number{
        var value: number = 0;
        var bonus: number = this.SkillRunner.Properties["bonus"];
        if (bonus != null){
            value = bonus;
        }
        return value;
    }

    /**
     * 受伤触发事件
     */
    public HurtAction(blood: number): number{
        if (blood <= 0) return;
        SkillManager.HurtBlood = blood;
        var objcet: Object = this.SkillRunner.Notify(NotifyEnum_s.Hurt, {value: blood});
        this.HandleAction(objcet);
        return SkillManager.HurtBlood;
    }

    /**
     * 过坑事件
     */
    public JumpAction(){
        var objcet: Object = this.SkillRunner.Notify(NotifyEnum_s.Jump);
        this.HandleAction(objcet);
    }

    /**
     *死亡触发发事件
     */
    public DeadAction(){
        var objcet: Object = this.SkillRunner.Notify(NotifyEnum_s.Dead);
        this.HandleAction(objcet);
    }

    /**
     *隐分身触发发事件
     */
    public FenShenAction(){
        var objcet: Object = this.SkillRunner.Notify(NotifyEnum_s.Dead);
        this.HandleAction(objcet);
    }

    /**
     * 胜利触发事件事件
     */
    public get VictoryAction(): boolean{
        var objcet: Object = this.SkillRunner.Notify(NotifyEnum_s.Victory);
        var isGet: boolean = false;
        Object.keys(objcet).map((id)=>{
            objcet[id].map((item)=>{
                var type: number = item["type"];
                switch (type) {
                    case ActionEnum_s.GetAction:
                        isGet = true;
                        break;
                }
            });
        });
        return isGet;
    }

    /**
     * 事件处理
     */
    public HandleAction(action: Object){
        if (action == null) return;
        if (CheckpointManager.IsEndless) return;
        if (CheckpointManager.IsDailyActive) return;
        Object.keys(action).map((id)=>{
            action[id].map((item)=>{
                var type: number = item["type"];
                switch (type) {
                    case ActionEnum_s.FlyBoat:            // 飞机
                        if (this.CurrentLife == 0) break;
                        Game.Instance.ChangeRoleStatus(2);
                        this.creatSkillTip(8);
                        break;
                    case ActionEnum_s.Recover:            // 恢复
                        if (this.CurrentLife == 0) break;
                        var value: number = item.param;
                        Game.Instance.ChangeRoleStatus(1, -value);
                        this.creatSkillTip(9);
                        break;
                    case ActionEnum_s.Shield:             // 护盾
                        if (this.CurrentLife == 0) break;
                        var duration: number = item.param.duration;
                        var value: number = item.param.value;
                        Game.Instance.ChangeRoleStatus(4, -value);
                        this.creatSkillTip(11);
                        break;
                    case ActionEnum_s.Revive:             // 复活
                        this.CurrentLife = Math.floor(this.MaxLife * (item.param / 100));
                        Game.Instance.GameRevive();
                        this.creatSkillTip(7);
                        break;
                    case ActionEnum_s.Release:              // 主动技能释放
                        var id: number = item.param.id;
                        if (!!id){
                            if (id == SkillEnum_s.FenShen){
                                var value: number = item.param.value;
                                Game.Instance.ChangeRoleStatus(5, value);
                            }
                            else if (id == SkillEnum_s.ZhaoHuanXuZuo){
                                Game.Instance.ChangeRoleStatus(6);
                            }
                            else if (id == SkillEnum_s.ZhiHuoZaiSheng){
                                var isShow: boolean = item.param.isshow;
                                var count: number = isShow? 1 : 0;
                                Game.Instance.ChangeRoleStatus(7, count);
                            }
                            this.creatSkillTip(id);
                            SoundManager.PlayMusic(this.SkillSoundName, 1);
                        }
                        break;
                    case ActionEnum_s.FSRecover:            // 分身恢复
                        if (this.CurrentLife == 0) break;
                        var value: number = item.param.value;
                        var blood: number = value;
                        Game.Instance.ChangeRoleStatus(1, -blood);
                        // this.creatSkillTip(15);
                        break;
                    case ActionEnum_s.HurtRecover:            // 受伤恢复
                        if (this.CurrentLife == 0) break;
                        var id: number = item.param.id;
                        var value: number = item.param.value;
                        Game.Instance.ChangeRoleStatus(1, -value);
                        this.creatSkillTip(id);
                        break;
                    case ActionEnum_s.SkillEnd:            // 技能结束恢复
                        if (this.CurrentLife == 0) break;
                        var id: number = item.param.id;
                        var value: number = item.param.value;
                        Game.Instance.ChangeRoleStatus(1, -value);
                        this.creatSkillTip(id);
                        break;
                }
            });
        });
    }

    /**
     * 创建主动技能提示
     */
    private creatSkillTip(skillId: number){
        for(let i=0; i<this.UseSkillSet.length; i++){
            if(this.UseSkillSet[i].ID == skillId){
                Game.Instance.creatZhuDongSkillTip(skillId);
                break;
            }
        }
    }

    /**
     * 获得时画报
     */
    public get GetRes(): string{
        return this._getImaRes;
    }

    /**
     * 是否在技能效果内
     */
    public set SkillStatus(value: boolean){
        this._skillStatus = value;
    }

    /**
     * 是否在技能效果内
     */
    public get SkillStatus(): boolean{
        return this._skillStatus;
    }

    /**
     * 道具恢复血量
     */
    public set ItemRecoverLife(value: number){
        this._itemRecoverLife = value;
    }

    /**
     * 道具恢复血量
     */
    public get ItemRecoverLife(): number{
        return this._itemRecoverLife;
    }

    /**
     * 是否免疫持续伤害
     */
    public set ImmuneHurt(value: boolean){
        this._immuneHurt = value;
    }

    /**
     * 是否免疫持续伤害
     */
    public get ImmuneHurt(): boolean{
        return this._immuneHurt;
    }

    /**
     * 游戏初始化
     */
    public GameInit(){
        this._immuneHurt = false;
        this._skillStatus = false;
        this._itemRecoverLife = 0;
    }

    /**
     * 专属场景
     */
    public get Scene(): number{
        return this._isscene;
    }

    /**
     * 专属场景是否开启
     */
    public get IsSceneStart(): boolean{
        if(UnitStatusMgr.IsUnlockNinjaScene){
            return true;
        }
        return false;
    }

    /**
     * 技能音效名字
     */
    public get SkillSoundName(): string{
        return this._skillSound + SoundManager.Music_Suffix;
    }


    // 变量
    private _id: number;                // ID
    private _name: string;              // 名字
    private _res: string;               // 资源
    private _sJumpMusic: string;        // 小跳音乐
    private _bJumpMusic: string;        // 大跳音乐
    private _dieMusic: string;          // 死亡音乐
    private _lifeBase: number;          // 生命基数
    private _lifeRate: number;          // 生命成长值
    private _defenseBase: number;       // 防御基数
    private _defenseRate: number;       // 防御成长值
    private _luckyBase: number;         // 幸运基数
    private _luckyRate: number;         // 幸运成长值
    private _skillID1: number;          // 技能ID1
    private _skillID2: number;          // 技能ID2
    private _skillID3: number;          // 技能ID3
    private _headRes: string;           // 头像资源
    private _pieceid: number;           // 碎片物品id
    private _resGroupName: string;      // 资源组名字

    private _level: number;             // 等级
    private _currentLife: number;       // 当前生命
    private _skillRunner: SkillRunner_s;  // 技能管理
    private _skillRunnerLv: number = 0; // 技能管理设置的等级

    private _specialty: string;         // 角色特点
    private _unlockskill1: string;      // 技能1解锁条件角色
    private _unlockskill2: string;      // 技能2解锁条件角色
    private _unlockskill3: string;      // 技能3解锁条件角色

    private _skill1: Skill;             // 技能1
    private _skill2: Skill;             // 技能2
    private _skill3: Skill;             // 技能3
    private _skillSound: string;        // 技能音效

    private _getImaRes: string;                 // 获得时显示画报
    private _immuneHurt: boolean = false;       // 是否免疫伤害
    private _skillStatus: boolean = false;      // 是否在技能效果内
    private _itemRecoverLife: number = 0;       // 道具恢复血量
    private _isscene: number = 0;               // 专属场景
}