/**
 * 技能管理器
 */
class SkillManager{
    /**
     * 扣血
     */
    public static HurtBlood: number = 0;

    /**
     * 技能初始化数据
     */
    public static Init(){
        var jsonData: JSON = RES.getRes("skilldata_json");
        Object.keys(jsonData).map((id)=>{
            var data: JSON = jsonData[id];
            SkillManager._skillDataSet[id] = data;
            // SkillManager._skillSet.push(new Skill(data));
        });
        ProcessManager.AddProcess(SkillManager._Process.bind(SkillManager));
    }

    /**
     * 创建技能
     */
    public static creatSkill($skillId:number, $roleId:number, $jiesuoRole:string){
        let data = SkillManager.GetSkillDataByID($skillId)

        let _skill = new Skill(data)
        _skill.PreRoleID = $roleId;
        _skill.SetjiesuoRole($jiesuoRole);

        SkillManager._allSkillSet.push(_skill);
        return _skill;
    }

    /**
     * 通过技能ID和角色id获得技能
     * @param id            技能ID
     */
    public static GetSkillByID(id: number, roleid: number): Skill{
        for (var i = 0; i < SkillManager._allSkillSet.length; i++){
            if (id == SkillManager._allSkillSet[i].ID && SkillManager._allSkillSet[i].PreRoleID == roleid){
                return SkillManager._allSkillSet[i];
            }
        }
        return null;
    }

    public static GetSkill(id: number): Skill{
        for (var i = 0; i < SkillManager._allSkillSet.length; i++){
            if (id == SkillManager._allSkillSet[i].ID){
                return SkillManager._allSkillSet[i];
            }
        }
        return null;
    }

    /**
     * 通过ID获得技能数据
     * @param id            技能ID
     */
    public static GetSkillDataByID(id: number): JSON{
        if(SkillManager._skillDataSet[id]){
            return SkillManager._skillDataSet[id];
        }
        return null;
    }

    /**
     * 获得技能Runner
     */
    public static GetSkillRunner(role: Role): SkillRunner_s{
        var runner: SkillRunner_s = new SkillRunner_s(role);
        SkillManager._skillRunner = runner;
        return runner;
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private static _Process(frameTime: number){
        if (SkillManager._skillRunner != null){
            SkillManager._skillRunner.Process(frameTime);
        }
    }

    /**
     * 开始游戏
     */
    public static StartGame(){
        SkillManager._skillRunner = UnitManager.CurrentRole.SkillRunner;
    }
    
    // 变量
    // private static _skillSet: Skill[] = [];          // 技能集合
    private static _skillDataSet: JSON[] = [];          // 技能数据集合
    private static _allSkillSet: Skill[] = [];          // 技能集合
    private static _skillRunner: SkillRunner_s;         // 技能运行时
}

/**
 * 技能类型
 * @type {{Duration: number, Defense: number, Life: number, Fare: number, Protect: number, Lucky: number, Score: number, Money: number, Bonus: number, Revive: number, FlyBoat: number, Jump: number, Shield: number, Action: number}}
 */
const SkillEnum_s = {
    Duration:0,      //内部使用：持续效果计算

    //region 带来静态加成的被动技能
    Defense:1,              //被动提升防御力
    Life:2,                 //被动提升生命
    Fare:3,                 //被动提升运气
    Protect:4,              //被动提升免伤率
    Lucky:12,               //被动提升幸运率
    Score:5,                //关卡结算积分时，在最终结算的基础上
    Money:6,                //关卡结算金币时，在最终结算的基础上
    Bonus:10,               //被动提升关卡道具掉率几率
    //endregion

    //region 带来动态效果的被动技能
    Revive:7,               //死亡时，马上复活并恢复50%生命，每局限一次
    FlyBoat:8,              //受伤时（扣血），有几率触发飞艇效果5%
    Jump:9,                 //第5次跳过障碍可以恢复最大生命的5%，CD 30秒
    Shield:11,              //受伤时，5%触发护盾持续5秒, 不叠加
    Action:13,              //每次成功通过任意关卡后有30%的几率恢复1点体力，扫荡无法触发
    FenShenHuiFu:15,        //增加分身，每个分身提供恢复效果
    FenShenQiangHua:16,     //增加分身，强化分身的承伤能力
    ChangeHurt:18,          //须佐能乎能将受到伤害转化为恢复
    XiaoShiHuiFu:19,        //须佐能乎消失时额外恢复生命
    AllItemHuiFu:21,        //获得印记效果，所有的道具都会恢复生命
    AddHuiFu:22,            //印记效果期间，获得治疗效果提高
    //endregion

    //region 主动技能
    FenShen:14,             //隐分身，召唤分身帮助自己承担伤害
    ZhaoHuanXuZuo:17,       //召唤须佐能乎为自己吸收伤害
    ZhiHuoZaiSheng:20,      //进行一次大幅度的生命恢复
    //endregion
}

/**
 * 动作类型
 * @type {{FlyBoat: number, Recover: number, Shield: number, Revive: number, GetAction: number}}
 */
const ActionEnum_s = {
    FlyBoat: 1,         //飞艇事件
    Recover: 2,         //生命恢复
    Shield: 3,          //触发护盾
    Revive: 4,          //复活
    GetAction: 5,       //获得体力
    Release: 6,         //释放主动技能
    FSRecover: 7,       //分身恢复数值
    HurtRecover: 8,     //受伤恢复
    SkillEnd: 9,       //技能结束
}

/**
 * 事件类型
 * @type {{Start: number, Hurt: number, Jump: number, Dead: number, Victory: number}}
 */
const NotifyEnum_s = {
    Start: 1<<0,                //角色存活期
    Hurt: 1 << 1,               //受到一次伤害时触发
    Jump: 1<<2,                 //跳跃    飞跃的障碍也要发
    Dead: 1 << 3,               //死亡
    Victory: 1<< 4,             //胜利
    Release: 1<< 5,             //主动释放
    GameInit: 1<<6,             //游戏初始化
}

/**
 * 技能引发的动作对象
 */
class ActionObj_s{
    constructor($type, $param = null){
        this.type = $type;
        this.param = !!$param ? $param : 0;
    }

    public type;
    public param;
}

/**
 * 技能类事务对象
 */
class SkillFunction_s
{
    /**
     * 构造方法
     */
    public constructor(id: number, notify: number, runner: SkillRunner_s, role: Role, level: number, params: Object){
        this._id = id;
        this._notify = new Indicator_s(notify);
        this._runner = runner;
        this._role = role;
        this._level = level;
        this._params = params;
    }

    /**
     * 技能ID
     */
    public get ID(): number{
        return this._id;
    }

    /**
     * 执行技能效果
     */
    public Execute(params: Object = null): ActionObj_s[]{
        var ret: ActionObj_s[] =[];
        // 阀值判断
        if (!!this._params["threshold"]){
            if (this._threshold == -1){
                this._threshold = 0;
            }
            this._threshold += 1;
            if (this._threshold < this._params["threshold"]){
                return ret;
            }
            this._threshold = 0;
        }

        // 触发几率检测
        if (!!this._params["rate"]){
            if (Math.random() > this._params["rate"]){
                return ret;
            }
        }

        // 使用次数检测
        if (!!this._params["max"]){
            if (this._maxTimes >= this._params["max"]){
                return ret;
            }
            this._maxTimes += 1;
        }

        // CD检测
        if (!!this._params["cd"]){
            if (this._cd > 0){
                return ret;
            }
            if (this._cd <= 0){
                this._cd = this._params["cd"];
            }
        }

        // 分身技能
        if (!!this._params && !!this._params["fenshencount"] && this._fenshen == -1){
            this._fenshen = this._params["fenshencount"];
        }
        if (!!this._params && !!this._params["fshuifu"] && this._fsHuifu == -1){
            this._fenshen = this._params["fshuifu"];
        }
        if (!!this._params && !!this._params["fsdikan"] && this._fsDikan == -1){
            this._fenshen = this._params["fsdikan"];
        }

        // 影响技能ID
        if (!!this._params && !!this._params["skill"] && this._affectSkill == -1){
            this._affectSkill = this._params["skill"];
        }

        // 持续时间检测
        if (!!this._params["duration"]){
            if (this._duration > 0){
                return ret;
            }
            if (this._duration <= 0){
                this._duration = this._params["duration"];
            }
        }
        // var skilltest: Skill = SkillManager.GetSkill(this._id);
        // if (skilltest != null && Game.Instance != null && Game.Instance.visible){
        //     Main.AddDebug("发动技能:" + skilltest.Name);
        // }
        var value: number = 0;
        switch(this._id){
            case SkillEnum_s.Duration:
                if (this._duration > 0 && this._durationValue > 0 && !!params && !!params["value"]){
                    ret = ret.concat(this.CheckHurt(params["value"]))
                    // var pv = Math.min(this._durationValue, params["value"]);
                    // ret.push(new ActionObj_s(ActionEnum_s.Recover, pv));
                    // if (this._id == SkillEnum_s.ZhaoHuanXuZuo && this._hurtRecover > 0){
                    //     var recover: number = Math.floor(pv * this._hurtRecover);
                    //     ret.push(new ActionObj_s(ActionEnum_s.HurtRecover, {id: this._id, value: recover}));
                    // }
                    // this._durationValue -= pv;
                    // if (this._durationValue <= 0){
                    //     this._duration = 0;
                    //     this._durationValue = 0;
                    //     this.SkillEnd();
                    // }
                }
                break;
            case SkillEnum_s.Defense:
                value = Math.floor((this._GetValue("effectDefBase") + this._GetValue("effectDefUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.defense = value;
                break;
            case SkillEnum_s.Life:
                value = Math.floor((this._GetValue("effectLifeBase") + this._GetValue("effectLifeUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.life = value;
                break;
            case SkillEnum_s.Fare:
                value = Math.floor((this._GetValue("effectLuckyBase") + this._GetValue("effectLuckyUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.fare = value;
                break;
            case SkillEnum_s.Protect:
                value = Math.floor((this._GetValue("effectInjuryFreeBase") + this._GetValue("effectInjuryFreeUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.protect = value;
                break;
            case SkillEnum_s.Lucky:
                value = Math.floor((this._GetValue("effectRealLuckyBase") + this._GetValue("effectRealLuckyUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.lucky = value;
                break;
            case SkillEnum_s.Score:
                value = Math.floor((this._GetValue("effectScoreBase") + this._GetValue("effectScoreUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.score = value;
                break;
            case SkillEnum_s.Money:
                value = Math.floor((this._GetValue("effectMoneyBase") + this._GetValue("effectMoneyUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.money = value;
                break;
            case SkillEnum_s.Bonus:
                value = Math.floor((this._GetValue("effectDropBase") + this._GetValue("effectDropUpdata") * this._level) * 10) / 1000;
                this._runner.Properties.bonus = value;
                break;
            case SkillEnum_s.Revive:
                value = Math.floor(this._GetValue("effectRebornBase") + Math.pow(this._GetValue("effectRebornUpdata") * (this._level - 1), 0.8));
                ret.push(new ActionObj_s(ActionEnum_s.Revive, value));
                break;
            case SkillEnum_s.FlyBoat:
                var rate: number = (this._GetValue("effectPlaneBase") + this._GetValue("effectPlaneUpdata") * this._level) / 100;
                if (Math.random() <= rate){
                    ret.push(new ActionObj_s(ActionEnum_s.FlyBoat));
                }
                break;
            case SkillEnum_s.Jump:
                value = this._GetValue("effectJumpBase") + Math.floor(this._GetValue("effectJumpUpdata") * (this._level) * this._role.MaxLife);
                ret.push(new ActionObj_s(ActionEnum_s.Recover, value));
                break;
            case SkillEnum_s.Shield:
                if (this._duration <= 0){
                    value = Math.floor(this._GetValue("effectShieldBase") + this._GetValue("effectShieldUpdata") * this._level / 100 * this._role.MaxLife);
                    this._durationValue = value;
                    ret.push(new ActionObj_s(ActionEnum_s.Shield, {duration:this._duration, value:value}));
                }
                break;
            case SkillEnum_s.Action:
                var rate: number = (this._GetValue("effectClearApBase") + this._GetValue("effectClearApUpdata") * this._level) / 100;
                if (Math.random() <= rate){
                    ret.push(new ActionObj_s(ActionEnum_s.GetAction, 1));;
                }
                break;
            case SkillEnum_s.FenShen:
                ret.push(new ActionObj_s(ActionEnum_s.Release, {id: this._id, value:this._fenshen}));
                value = Math.floor(this._GetValue("effectFenShenBase") + this._GetValue("effectFenShenUpdata") * (this._level - 1) + this._GetValue("effectFenShenLife") * this._role.MaxLife);
                this._oneFSDiKou = value;
                this._durationValue = value * this._fenshen;
                this._fsCount = this._fenshen;
                if (this._fsDikan > 0){
                    this._durationValue = Math.floor(this._durationValue * (1 + this._fsDikan));
                }
                if (this._fsHuifu > 0){
                    ret.push(new ActionObj_s(ActionEnum_s.FSRecover, {value:this._fsHuifu * this._fsCount}));
                }
                break;
            case SkillEnum_s.FenShenHuiFu:
                var skill: SkillFunction_s = this._runner.GetSkill(this._affectSkill);
                if (skill != null){
                    skill.FenShenCount += 1;
                    value = Math.floor((this._GetValue("effectFenShenRecoverBase") + this._GetValue("effectFenShenRecoverUpdata") * (this._level - 1) + this._GetValue("effectFenShenRecoverLife") * this._role.MaxLife) / 4 / 5);
                    skill.FenShenHuiFu = value;
                }
                break;
            case SkillEnum_s.FenShenQiangHua:
                var skill: SkillFunction_s = this._runner.GetSkill(this._affectSkill);
                if (skill != null){
                    skill.FenShenCount += 1;
                    value = (this._GetValue("effectFenShenPlusBase") + this._GetValue("effectFenShenPlusUpdata") * (this._level - 1)) / 100;
                    skill.FenShenDikan = value;
                }
                break;
            case SkillEnum_s.ZhaoHuanXuZuo:
                value = this._GetValue("effectNinjaShieldBase") + this._GetValue("effectNinjaShieldUpdata") * (this._level - 1) + this._GetValue("effectNinjaShieldLife") * this._role.MaxLife;
                this._durationValue = Math.floor(value);
                ret.push(new ActionObj_s(ActionEnum_s.Release, {id: this._id, value:this._fenshen}));
                break;
            case SkillEnum_s.ChangeHurt:
                var skill: SkillFunction_s = this._runner.GetSkill(this._affectSkill);
                if (skill != null){
                    value = Math.floor(this._GetValue("effectNinjaShieldRecoverBase") + Math.pow(this._GetValue("effectNinjaShieldRecoverUpdata") * (this._level - 1), 0.8)) / 100;
                    skill.HurtRecover = value;
                }
                break;
            case SkillEnum_s.XiaoShiHuiFu:
                var skill: SkillFunction_s = this._runner.GetSkill(this._affectSkill);
                if (skill != null){
                    value = (this._GetValue("effectNinjaShieldRecoverExBase") + this._GetValue("effectNinjaShieldRecoverExUpdata") * this._level) / 100;
                    skill.SkillEndRecover = value;
                }
                break;
            case SkillEnum_s.ZhiHuoZaiSheng:
                var a: number = this._GetValue("effectNinjaRecoverBase");
                var b: number = this._GetValue("effectNinjaRecoverUpdata");
                var c: number = Math.floor(a + b * (this._level - 1)) / 100;
                var d: number = this._role.MaxLife;
                value = Math.floor(this._GetValue("effectNinjaRecoverFixedValue") + c * d);
                if (this.RecoverAdd > 0){
                    value = Math.floor(value * (this.RecoverAdd + 1));
                    ret.push(new ActionObj_s(ActionEnum_s.Release, {id: this._id, isshow: true}));
                }
                else {
                    ret.push(new ActionObj_s(ActionEnum_s.Release, {id: this._id, isshow: false}));
                }
                if (this.ItemRecover > 0){
                    this._role.SkillStatus = true;
                    this._role.ItemRecoverLife = Math.floor(this.ItemRecover * (1 + this.RecoverAdd));
                }
                this._role.ImmuneHurt = this.ImmuneHurt;
                ret.push(new ActionObj_s(ActionEnum_s.Recover, value));
                break;
            case SkillEnum_s.AllItemHuiFu:
                var skill: SkillFunction_s = this._runner.GetSkill(this._affectSkill);
                if (skill != null){
                    value = Math.floor(this._GetValue("effectNinjaItemRecoverBase") + this._GetValue("effectNinjaItemRecoverUpdata") * this._level / 100 * this._role.MaxLife);
                    skill.ItemRecover = value;
                }
                break;
            case SkillEnum_s.AddHuiFu:
                var skill: SkillFunction_s = this._runner.GetSkill(this._affectSkill);
                if (skill != null){
                    value = Math.floor(this._GetValue("effectNinjaRecoverPlusBase") + this._GetValue("effectNinjaRecoverPlusUpdata") * this._level) / 100;
                    skill.RecoverAdd = value;
                    skill.ImmuneHurt = true;
                }
                break;
        }

        return ret;
    }

    /**
     * 受伤检测
     */
    public CheckHurt(blood: number): ActionObj_s[]{
        var ret: ActionObj_s[] =[];
        if (this._duration > 0 && this._durationValue > 0){
            var pv = Math.min(this._durationValue, blood);
            SkillManager.HurtBlood = Math.max(SkillManager.HurtBlood - pv, 0);           // 实际扣血
            // ret.push(new ActionObj_s(ActionEnum_s.Recover, pv));
            if (this._id == SkillEnum_s.ZhaoHuanXuZuo && this._hurtRecover > 0){
                var recover: number = Math.floor(blood * this._hurtRecover);
                ret.push(new ActionObj_s(ActionEnum_s.HurtRecover, {id: this._id, value: recover}));
            }
            this._durationValue = Math.max(this._durationValue - pv, 0);
            var count: number = this._fsCount;
            if (this._id == SkillEnum_s.FenShen){
                this._fsCount = Math.ceil(this._durationValue / this._oneFSDiKou);
                if ((count - this._fsCount) > 0){
                    for (var i = 0; i < (count - this._fsCount); i++){
                        Game.Instance.clearOneSkillAni();
                    }
                }
            }
        }
        return ret;
    }

    /**
     * 获得常量值
     */
    private _GetValue(key: string): number{
        return GameConstData.GetValue(key);
    }

    /**
     * 触发事件
     */
    public get Notify(): Indicator_s{
        return this._notify;
    }

    /**
     * 初始化
     */
    public Init(){
        this._duration = 0;
        this._durationValue = 0;
        this._maxTimes = 0;
        if (!!this._params && !!this._params["fenshencount"]){
            this._fenshen = this._params["fenshencount"];
        }
        if (!!this._params && !!this._params["fshuifu"]){
            this._fsHuifu = this._params["fshuifu"];
        }
        if (!!this._params && !!this._params["fsdikan"]){
            this._fsDikan = this._params["fsdikan"];
        }
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    public Process(frameTime: number){
        if (Game.Instance != null && Game.Instance.IsGamePause) return;
        this._timer += frameTime;
        var time: number = 1000;
        if (this._timer >= time){
            this._timer -= 1000;
            if (this._cd > 0){
                this._cd -= 1;
            }
            if (this._duration > 0){
                this._duration -= 1;
                if (this._duration == 0){
                    this._durationValue = 0;
                    var ret: ActionObj_s[] = this._SkillEnd();
                    this._role.HandleAction({1:ret});
                }
                if (this._id == SkillEnum_s.FenShen && this._fsHuifu > 0){
                    this._role.HandleAction({1:[new ActionObj_s(ActionEnum_s.FSRecover, {value: this._fsHuifu * this._fsCount})]});
                }
            }
        }
        if (this._duration > 0 && this._durationValue <= 0){
            this._duration = 0;
            this._durationValue = 0;
            var endRet: ActionObj_s[] = this._SkillEnd();
            if (endRet.length > 0){
                this._role.HandleAction({1:endRet});
            }
        }
    }

    /**
     * 技能结束
     */
    private _SkillEnd(): ActionObj_s[]{
        var ret: ActionObj_s[] =[];
        if (this._skillEndRecover > 0){
            if (this._id == SkillEnum_s.ZhaoHuanXuZuo){
                var value: number = Math.floor(this._skillEndRecover * this._role.MaxLife)
                ret.push(new ActionObj_s(ActionEnum_s.SkillEnd, {id: this._id, value: value}));
            }
            this._role.ItemRecoverLife = 0;
        }
        this._role.SkillStatus = false;
        this._role.ImmuneHurt = false;
        Game.Instance.clearSkillAni();
        return ret;
    }

    /**
     * 分身数量
     */
    public set FenShenCount(value: number){
        this._fenshen = value;
    }

    /**
     * 分身数量
     */
    public get FenShenCount(): number{
        return this._fenshen;
    }

    /**
     * 分身抵抗
     */
    public set FenShenDikan(value: number){
        this._fsDikan = value;                            
    }

    /**
     * 分身抵抗
     */
    public get FenShenDikan(): number{
        return this._fsDikan;
    }

    /**
     * 分身恢复
     */
    public set FenShenHuiFu(value: number){
        this._fsHuifu = value;
    }

    /**
     * 分身恢复
     */
    public get FenShenHuiFu(): number{
        return this._fsHuifu;
    }

    /**
     * 影响技能ID
     */
    public get AffectSkillID(): number{
        return this._affectSkill;
    }

    /**
     * 技能结束恢复百分比
     */
    public set SkillEndRecover(value: number){
        this._skillEndRecover = value;
    }

    /**
     * 技能结束恢复百分比
     */
    public get SkillEndRecover(): number{
        return this._skillEndRecover;
    }

    /**
     * 受伤恢复百分比
     */
    public set HurtRecover(value: number){
        this._hurtRecover = value;
    }

    /**
     * 受伤恢复百分比
     */
    public get HurtRecover(): number{
        return this._hurtRecover;
    }

    /**
     * 恢复加成
     */
    public set RecoverAdd(value: number){
        this._recoverAdd = value;
    }

    /**
     * 恢复加成
     */
    public get RecoverAdd(): number{
        return this._recoverAdd;
    }

    /**
     * 道具恢复血量
     */
    public set ItemRecover(value: number){
        this._itemRecover = value;
    }

    /**
     * 道具恢复血量
     */
    public get ItemRecover(): number{
        return this._itemRecover;
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

    // 变量
    private _id: number;                            // 技能ID
    private _notify: Indicator_s;                   // 技能触发类型
    private _runner: SkillRunner_s;                 // 技能runner
    private _params: Object;                        // 参数集合
    private _role: Role;                            // 所属角色
    private _level: number;                         // 等级
    private _cd: number = -1;                       // CD
    private _maxTimes: number = 0;                  // 使用次数
    private _threshold: number = -1;                // 阀值判断
    private _duration: number = -1;                 // 持续时间
    private _durationValue: number = 0;             // 免伤值
    private _timer: number = 0;                     // 计时器
    private _fenshen: number = -1;                  // 分身个数
    private _fsHuifu: number = -1;                  // 分身恢复数值
    private _fsDikan: number = -1;                  // 分身抵抗加成
    private _affectSkill: number = -1;              // 影响技能ID
    private _skillEndRecover: number = 0;           // 技能消失恢复百分比
    private _hurtRecover: number = 0;               // 受伤恢复百分比
    private _recoverAdd: number = 0;                // 恢复加成
    private _itemRecover: number = 0;               // 道具恢复血量
    private _immuneHurt: boolean = false;           // 免疫持续伤害
    private _fsCount: number = 0;                   // 当前分身个数
    private _oneFSDiKou: number = 0;                // 每个分身抵扣的值
}

/**
 * 技能运行时管理
 * 输入事件，返回动作列表，每个动作要么对英雄属性做出修改，要么触发执行一个特殊动作
 */
class SkillRunner_s{
    /**
     * 构造方法
     */
    public constructor(role: Role){
        this._role = role;
        this.Properties = {
            defense:0,      //防御加成
            life: 0,        //生命加成
            fare:0,         //运气加成
            protect:0,      //免伤加成
            lucky:0,        //幸运加成
            score:0,        //通关获取分数
            money:0,        //通关获取金币
            bonus:0,        //关卡掉落几率
        };
        this._InitSkill();

        //触发被动技能
        this.Notify(NotifyEnum_s.Start);
    }

    /**
     * 初始技能
     */
    private _InitSkill(){
        var skillSet: Skill[] = this._role.UseSkillSet;
        if (skillSet == null || skillSet.length == 0) return;
        this._skillList = [];
        for (var i = 0; i < skillSet.length; i++){
            var id: number = skillSet[i].ID;
            switch (id) {
                case SkillEnum_s.Defense:
                case SkillEnum_s.Life:
                case SkillEnum_s.Fare:
                case SkillEnum_s.Protect:
                case SkillEnum_s.Lucky:
                case SkillEnum_s.Score:
                case SkillEnum_s.Money:
                case SkillEnum_s.Bonus:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Start, this, this._role, skillSet[i].Level, {}));
                    break;
                case SkillEnum_s.Revive:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Dead, this, this._role, skillSet[i].Level, {max:1, value:0.5}));
                    break;
                case SkillEnum_s.FlyBoat:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Hurt, this, this._role, skillSet[i].Level, {rate:1}));
                    break;
                case SkillEnum_s.Jump:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Jump, this, this._role, skillSet[i].Level, {threshold:5, cd:30}));
                    break;
                case SkillEnum_s.Shield:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Hurt, this, this._role, skillSet[i].Level, {rate: 0.3, duration:5}));
                    break;
                case SkillEnum_s.Action:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Victory, this, this._role, skillSet[i].Level, {rate:0.3}));
                    break;
                case SkillEnum_s.FenShen:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Release, this, this._role, skillSet[i].Level, {duration:5, fenshencount:2, fshuifu: 0, fsdikan: 1}));
                    break;
                case SkillEnum_s.FenShenHuiFu:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.GameInit, this, this._role, skillSet[i].Level, {skill: SkillEnum_s.FenShen}));
                    break;
                case SkillEnum_s.FenShenQiangHua:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.GameInit, this, this._role, skillSet[i].Level, {skill: SkillEnum_s.FenShen}));
                    break;
                case SkillEnum_s.ZhaoHuanXuZuo:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Release, this, this._role, skillSet[i].Level, {duration:5}));
                    break;
                case SkillEnum_s.ChangeHurt:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.GameInit, this, this._role, skillSet[i].Level, {skill: SkillEnum_s.ZhaoHuanXuZuo}));
                    break;
                case SkillEnum_s.XiaoShiHuiFu:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.GameInit, this, this._role, skillSet[i].Level, {skill: SkillEnum_s.ZhaoHuanXuZuo}));
                    break;
                case SkillEnum_s.ZhiHuoZaiSheng:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.Release, this, this._role, skillSet[i].Level, {duration:5}));
                    break;
                case SkillEnum_s.AllItemHuiFu:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.GameInit, this, this._role, skillSet[i].Level, {skill: SkillEnum_s.ZhiHuoZaiSheng}));
                    break;
                case SkillEnum_s.AddHuiFu:
                    this._skillList.push(new SkillFunction_s(id, NotifyEnum_s.GameInit, this, this._role, skillSet[i].Level, {skill: SkillEnum_s.ZhiHuoZaiSheng}));
                    break;
            }
        }
    }

    /**
     * 属性
     */
    public Properties;

    /**
     * 输入特殊事件，触发技能，返回技能引发的动作列表
     * @param $notifyEnum
     */
    public Notify(notifyEnum: number, params: Object = null){
        let ret = {};
        //检测并发动技能
        this._skillList.filter(item=>{
            return item.Notify.Check(notifyEnum);
        }).map(af=>{
            var res = af.Execute(params);
            if(res.length > 0){
                ret[af.ID] = res;
            }
        });
        if (notifyEnum == NotifyEnum_s.Hurt){
            for (var i = 0; i < this._skillList.length; i++){
                if (!this._skillList[i].Notify.Check(notifyEnum)){
                    var res = this._skillList[i].CheckHurt(params["value"]);
                    if(res.length > 0){
                        ret[this._skillList[i].ID] = res;
                    }
                }
            }
        }
        return ret;
    }

    /**
     * 获得技能
     */
    public GetSkill(id: number): SkillFunction_s{
        for (var i = 0; i < this._skillList.length; i++){
            if (this._skillList[i].ID == id){
                return this._skillList[i];
            }
        }
        return null;
    }

    /**
     * 释放技能
     */
    public ReleaseSkill(id: number){
        let ret = {};
        for (var i= 0; i < this._skillList.length; i++){
            if (id == this._skillList[i].ID){
                ret[this._skillList[i].ID] = this._skillList[i].Execute();
                break;
            }
        }
        return ret;
    }

    /**
     * 角色
     */
    public get Role(): Role{
        return this._role;
    }

    /**
     * 初始化
     */
    public Init(){
        for (var i = 0; i < this._skillList.length; i++){
            this._skillList[i].Init();
        }
        this.Notify(NotifyEnum_s.Start);
        this.Notify(NotifyEnum_s.GameInit);
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    public Process(frameTime: number){
        for (var i = 0; i < this._skillList.length; i++){
            if (this._skillList[i].Notify.Check(NotifyEnum_s.Release)){
                this._skillList[i].Process(frameTime);
            }
        }
    }

    // 变量
    private _skillList: SkillFunction_s[] = [];
    private _role: Role;
}

/**
 * 联合枚举检测类
 */
class Indicator_s{
    /**
     * 构造方法
     * @param val
     */
    public constructor(val: number = 0){
        this._indecate = !!val? val : 0;
    }

    /**
     * 当前值
     */
    public get Indicate(): number{
        return this._indecate;
    }

    /**
     * 当前值
     */
    public set Indicate(val: number){
        this._indecate |= val;
    }

    /**
     * 检测当前值
     */
    public Check(val: number, cur: number = null): boolean{
        if (!!cur){
            this._indecate = cur;
        }
        return (this._indecate & val) == val;
    }

    private _indecate: number;
}