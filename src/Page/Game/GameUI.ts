/**
 * 游戏UI
 */
class GameUI extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/GameUISkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        GameEvent.AddEventListener(EventType.GameScoreChange, this._UpdateScore, this);
        GameEvent.AddEventListener(EventType.GameMoneyChange, this._UpdateMoney, this);
        GameEvent.AddEventListener(EventType.RoleLifeChange, this._UpdateBlood, this);
        GameEvent.AddEventListener(EventType.GameTimeChange, this._UpdateGameTime, this);
        GameEvent.AddEventListener(EventType.RoleRevive, this._RoleRevive, this);
        ProcessManager.AddProcess(this._Process.bind(this));
        this._skillIma.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSkillClick,this);

        this._xueImage = new eui.Image("xuedi_png");
        this._kouxueLabel = new eui.BitmapLabel();
        this._kouxueLabel.width = 200;
        this._kouxueLabel.textAlign = "center";
        this._kouxueLabel.font = RES.getRes("kouxuenum_fnt");

        this._huixueLabel = new eui.BitmapLabel();
        this._huixueLabel.width = 200;
        this._huixueLabel.textAlign = "center";
        this._huixueLabel.font = RES.getRes("huixuenum_fnt");


        this._timeImaAniGroup = new eui.Group();
        this.addChild(this._timeImaAniGroup);
        // this._succIma = ImagePool.GetImage("wz_tiaozhancg_png");
        // this._succIma.touchEnabled = false;
        var lg: string = StringMgr.LanguageSuffix;
        this._jianChiIma = ImagePool.GetImage("wz_jianchizhu" + lg + "_png");
        this._numIma = new eui.Image();
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onDown,this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._textLabel.font = "guanqia" + lg + "_fnt";
        this._jianChiIma = ImagePool.GetImage("wz_jianchizhu" + lg + "_png");
        // this._textLabel.text = StringMgr.GetText("gameuitext");
    }

    /**
     * UI初始化
     */
    public UIInit(){
        UnitManager.CurrentRole.SkillRunner.Init();
        this._scoreLabel.text = "0";
        this._moneyLabel.text = "0";
        if (!CheckpointManager.IsEndless && !CheckpointManager.IsDailyActive){
            this._guanqiaLabel.text = CheckpointManager.CurrentCheckpointID.toString();
            this._guanqiaLabel.textAlign = "center";
            this._timeImage.width = this._timeWidth;
            this._bloodImage.width = this._bloodWidth;
            this._timeLabel.text = CheckpointManager.CurrentCheckpoint.PassTime.toString() + "s";
            this._bloodLabel.text = UnitManager.CurrentRole.MaxLife.toString() + "/" + UnitManager.CurrentRole.MaxLife.toString();
        }
        this._isTiming = false;
        this._isMovie = false;
        this._group.visible = !CheckpointManager.IsEndless;
        this._checkGroup.visible = !CheckpointManager.IsEndless;
        if(this._group.visible){
            this._group.visible = !CheckpointManager.IsDailyActive;
            this._checkGroup.visible = !CheckpointManager.IsDailyActive;
        }

        // UI上的时间倒计时是组隐藏
        this._timeUiAniGroup.visible = false;
        this._ifUiDaojiAniStar = false;

        // UI上扣血动画相关图片隐藏，数值初始化
        this._shanXueIma.visible = false;
        this._shanXueIma.width = this._bloodWidth;
        this._dicengXueIma.width = this._bloodWidth;

        // 页面上相关的文字提示隐藏
        if(this._timeImaAniGroup) {
            this._timeImaAniGroup.visible = false;
        }

        this.ZhuDongSkillInit();
        this.Energy = GameConstData.GetValue("energyDefault");
        // this.Energy = 99;
    }

    /**
     * 主动技能显示初始化
     */
    private ZhuDongSkillInit(){
        let skilSet = UnitManager.CurrentRole.UseSkillSet;
        if(this._skillTiaoAni == null){
            this._skillTiaoAni = new egret.MovieClip();
            this._skillTiaoAni.movieClipData = MovieManager.GetMovieClipData("guanka_qipao_json","guanka_qipao_png","guanka_qipao");
            this._skillTiaoAni.stop();
            this._skillTiaoAni.x = this._skillGroup.width/2;
            this._skillTiaoAni.y = this._skillGroup.height/2 - 7;
            this._skillGroup.addChild(this._skillTiaoAni);
        }
        if(this._skillMaxAni == null){
            this._skillMaxAni = new egret.MovieClip();
            this._skillMaxAni.movieClipData = MovieManager.GetMovieClipData("guanka_qipaotx_json","guanka_qipaotx_png","guanka_qipaotx");
            this._skillMaxAni.stop();
            this._skillMaxAni.x = this._skillGroup.width/2;
            this._skillMaxAni.y = this._skillGroup.height/2 - 7;
            this._skillGroup.addChild(this._skillMaxAni);
            this._skillMaxAni.visible = false;
        }
        for(let i=0; i<skilSet.length; i++){
            if(skilSet[i].Type){
                this._curIniSkill = skilSet[i];
                this._skillGroup.visible = !CheckpointManager.IsEndless;
                if(this._skillGroup.visible) this._skillGroup.visible = !CheckpointManager.IsDailyActive;
                this._skillIma.texture = RES.getRes(this._curIniSkill.ImageRes);
                this._skillIma.mask = this._skillMaskIma;
                return;
            }
        }
        this._skillGroup.visible = false;
        this._curIniSkill = null;
        this._skillMaxAni.stop();
        this._skillMaxAni.visible = false;
    }

    /**
     * 点击技能
     */
    private onSkillClick(e){
        if(this.Energy >= this._curIniSkill.MpCost && Game.GameStatus){
            if (this._curIniSkill != null){
                this.Energy -= this._curIniSkill.MpCost;
                var objcet: Object = this._role.SkillRunner.ReleaseSkill(this._curIniSkill.ID);
                this._role.HandleAction(objcet);
            }
        }
    }

    /**
     * 角色复活
     */
    private _RoleRevive(){
        this._isTiming = true;
    }

    /**
     * 游戏血量改变
     */
    private _UpdateBlood(){
        if (this._role == null) return;
        this._role = UnitManager.CurrentRole;
        this._bloodLabel.text = this.Role.CurrentLife.toString() + "/" + this.Role.MaxLife.toString();
        var maxRoleLife: number = this._role.MaxLife;
        var roleLife: number = this._role.CurrentLife;

        if(this._role.CurrentLife == this._role.MaxLife){
            this._bloodImage.width = roleLife / maxRoleLife * this._bloodWidth;
            this._lastWidth = this._bloodImage.width;
            this._dicengXueIma.width = this._lastWidth;
        }

        if (roleLife == 0){
            this._isTiming = false;
            GameEvent.DispatchEvent(EventType.RoleLifeEmpty);
        }
    }

    /**
     * 游戏时间改变
     */
    private _UpdateGameTime(){
        this._timeImage.width = this.GameTime / this._maxGameTime * this._timeWidth;
        this._timeLabel.text = this.GameTime.toString() + "s";
        
        if(this.GameTime<=5 && this._ifUiDaojiAniStar == false){
            this._ifUiDaojiAniStar = true;
            this._timeUiAniGroup.visible = true;
            this.UiTimeDaoJiShiAni();
            this._timeImaAniGroup.visible = true;
            this.initJianChiIma();
        }

        // 倒计时动画
        if(this.GameTime <= 5 && this.GameTime > 0){
            this.initNum(this.GameTime);
            egret.Tween.removeTweens(this._numIma);
            let tween = egret.Tween.get(this._numIma).to({scaleX:1.579,scaleY:1.579,alpha:0},700);
            if(this.GameTime == 1){
                egret.Tween.removeTweens(this._jianChiIma);
                let tween2 = egret.Tween.get(this._jianChiIma).to({scaleX:1.154,scaleY:1.154,alpha:0},700);
            }
        }

        if (this.GameTime == 0){
            // Main.AddDebug("发送事件");
            GameEvent.DispatchEvent(EventType.GameEnd);
            this._isTiming = false;
        }
    }

    /**
     * 分数更新
     */
    private _UpdateScore(){
        this._scoreLabel.text = Game.Instance.Score.toString();
    }

    /**
     * 金币更新
     */
    private _UpdateMoney(){
        this._moneyLabel.text = Game.Instance.GoldNum.toString();
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value ) return;
        if (value){
            Main.Instance.GameLayer.addChild(this);
        }
        else{
            Main.Instance.GameLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

    /**
     * 开始游戏
     */
    public StarGame(){
        if (CheckpointManager.IsEndless || CheckpointManager.IsDailyActive){
            this._maxGameTime = 100000;
            this._group.visible = false;
            this._checkGroup.visible = false;
        }
        else{
            var checkpoint: Checkpoint = CheckpointManager.CurrentCheckpoint;
            this._maxGameTime = checkpoint.PassTime;
            this._group.visible = true;
            this._checkGroup.visible = true;
        }
        this._role = UnitManager.CurrentRole;
        this._role.CurrentLife = this._role.MaxLife;
        this.GameTime = this._maxGameTime;
        this._UpdateBlood();
        this._UpdateGameTime();
        this._isTiming = true;
        this._timer = 0;
    }

    /**
     * 游戏中使用的角色
     */
    public get Role(): Role{
        return this._role;
    }

    /**
     * 游戏事件
     */
    public set GameTime(value: number){
        if (value < 0) value = 0;
        if (this._gameTime == value) return;
        this._gameTime = value;
        GameEvent.DispatchEvent(EventType.GameTimeChange);
    }

    /**
     * 游戏事件
     */
    public get GameTime(): number{
        return this._gameTime;
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        if (Game.Instance != null && Game.Instance.IsGamePause) return;
        if (!this._isTiming) return;
        var time = 1000;
        this._timer += frameTime;
        if (this._timer >= time){
            this._timer -= time;
            this.GameTime -= 1;
            this.Energy += GameConstData.EnergyTime;
        }
        if (this._kouxueSet.length > 0){
            if (!this._isMovie){
                var kouxue: any[] = this._kouxueSet.shift();
                this._BloodMovie(kouxue[0], kouxue[1]);
            }
        }
    }

    /**
     * 角色扣血
     * @param blood 扣除血量（0时为掉坑扣血）
     * @param point 扣血表现位置
     */
    public BuckleBlood(blood: number = 0, point: egret.Point = null){
        if (blood == 0){
            var checkpoint: Checkpoint = CheckpointManager.CurrentCheckpoint;
            blood = GameConstData.BuckleBlood * checkpoint.Difficulty * (1 - this._role.InjuryFreeRate);
            blood = Math.ceil(blood);
        }
        blood = Math.ceil(blood);
        if (blood > 0){
            var kouxue: number = blood;
            blood = UnitManager.CurrentRole.HurtAction(kouxue);
        }

        this.initUiBloodAni();
        this._role.CurrentLife -= blood;
        this.UiBloodAniStar();
        this._Kouxue(blood, point);
    }

    /**
     * 扣血
     */
    private _Kouxue(blood: number, point: egret.Point){
        if (this._isMovie){
            this._kouxueSet.push([blood, point]);
            return;
        }
        this._BloodMovie(blood, point);
    }

    /**
     * 扣血动画表现
     */
    private _BloodMovie(blood: number, point: egret.Point){
        if (this._isMovie) return;
        if (blood == 0 || point == null) return;
        this._isMovie = true;
        blood = Math.ceil(blood);
        egret.Tween.removeTweens(this._kouxueLabel);
        egret.Tween.removeTweens(this._xueImage);
        var bloodStr: string = "";
        if (blood >= 0){
            bloodStr = "-" + blood.toString();
            this._kouxueLabel.text = bloodStr;
            this.addChild(this._kouxueLabel);
        }
        else{
            bloodStr = "+" + Math.abs(blood).toString();
            this._huixueLabel.text = bloodStr;
            this.addChild(this._huixueLabel);
        }
        var gaodu: number = 60;
        this._kouxueLabel.x = point.x - this._kouxueLabel.width / 2;
        this._kouxueLabel.y = point.y - gaodu;
        this._kouxueLabel.alpha = 0;
        this._huixueLabel.x = point.x - this._kouxueLabel.width / 2;
        this._huixueLabel.y = point.y - gaodu;
        this._huixueLabel.alpha = 0;
        this._xueImage.anchorOffsetX = 25;
        this._xueImage.anchorOffsetY = 9;
        this._xueImage.x = point.x;
        this._xueImage.y = point.y - gaodu;
        this._xueImage.scaleX = this._xueImage.scaleY = 0;
        var endPoint: egret.Point = new egret.Point(this._bloodImage.localToGlobal().x + this._bloodImage.width / 2,
                                                    this._bloodImage.localToGlobal().y + this._bloodImage.height / 2);
        this.addChild(this._xueImage);
        // 血量文本动画
        var labelTW1 = egret.Tween.get(this._kouxueLabel);
        labelTW1.to({alpha: 1}, 84).wait(125).to({y: this._kouxueLabel.y - 17, alpha: 0}, 125);
        var labelTW2 = egret.Tween.get(this._huixueLabel);
        labelTW2.to({alpha: 1}, 84).wait(125).to({y: this._kouxueLabel.y - 17, alpha: 0}, 125);
        // 血量图片动画
        var imageTW = egret.Tween.get(this._xueImage);
        imageTW.to({scaleX: 1, scaleY: 1}, 84).to({scaleX: 1.3, scaleY: 1.3}, 125).to({scaleX: 1, scaleY: 1}, 167).to(
                    {x: endPoint.x, y: endPoint.y, scaleX: 0.4, scaleY: 0.4}, 460).call(this._MovieEnd, this);
    }

    /**
     * 动画结束回调
     */
    private _MovieEnd(){
        if (this.contains(this._kouxueLabel)){
            this.removeChild(this._kouxueLabel);
        }
        if (this.contains(this._huixueLabel)){
            this.removeChild(this._huixueLabel);
        }
        this.removeChild(this._xueImage);
        this._isMovie = false;
    }

    /**
     * 初始化血条
     */
    private initUiBloodAni(){
        var maxRoleLife: number = this._role.MaxLife;
        var roleLife: number = this._role.CurrentLife;
        this._bloodImage.width = roleLife / maxRoleLife * this._bloodWidth;
        this._lastWidth = this._bloodImage.width;
        this._shanXueIma.width = this._bloodImage.width;
        this._dicengXueIma.width = this._lastWidth;
        
        this._shanXueIma.visible = false;
        clearTimeout(this._timerOutFun);
        egret.Tween.removeTweens(this._dicengXueIma);
        egret.Tween.removeTweens(this._bloodImage);
    }

    /**
     * 扣血动画开始。先初始化
     */
    private UiBloodAniStar(){
        this._shanXueIma.visible = true;
        this._shanNum = 0;
        this._timerOutFun = setTimeout(this.shanFun.bind(this),50);
    }

    /**
     * 闪动动画,连续闪动
     */
    private shanFun(){
        this._shanNum +=1;
        this._shanXueIma.visible = false;

        if(this._shanNum<5){
            this._shanXueIma.visible = true;
            this._timerOutFun = setTimeout(this.shanFun.bind(this),50);
        }else{
            clearTimeout(this._timerOutFun);
            let curRoleLife: number = this._role.CurrentLife;
            let maxRoleLife: number = this._role.MaxLife;
            let _width = curRoleLife / maxRoleLife * this._bloodWidth;
            let tween = egret.Tween.get(this._bloodImage).to({width:_width},200)
            .call(this.moveDiCengXue.bind(this));
        }
    }

    /**
     * 红色血移动结束，淡色血移动
     */
    private moveDiCengXue(){
        egret.Tween.removeTweens(this._bloodImage);
        let curRoleLife: number = this._role.CurrentLife;
        let maxRoleLife: number = this._role.MaxLife;
        let _width = curRoleLife / maxRoleLife * this._bloodWidth;
        let tween = egret.Tween.get(this._dicengXueIma).to({width:_width},200)
        .call(
            function(){
                egret.Tween.removeTweens(this._dicengXueIma);
                let curRoleLife: number = this._role.CurrentLife;
                let maxRoleLife: number = this._role.MaxLife;
                this._lastWidth = curRoleLife / maxRoleLife * this._bloodWidth;
            }.bind(this));
    }

    /**
     * UI上倒计时动画开始
     */
    private UiTimeDaoJiShiAni(){
        this._timeUiAniGroup.alpha = 1;
        egret.Tween.removeTweens(this._timeUiAniGroup);
        let tween = egret.Tween.get(this._timeUiAniGroup).to({alpha:0},1000)
        .call(
            function(){
                if(Game.GameStatus == true){
                    this.UiTimeDaoJiShiAni();
                }else{
                    this.UiTimeAniEnd();
                }
            }.bind(this));
    }


    /**
     * 初始化坚持住马上结束字段
     */
    private initJianChiIma(){
        this._timeImaAniGroup.addChild(this._jianChiIma);
        this._jianChiIma.anchorOffsetX = this._jianChiIma.width/2;
        this._jianChiIma.anchorOffsetY = this._jianChiIma.height/2;
        this._jianChiIma.x = 325;
        this._jianChiIma.y = 150;
        this._jianChiIma.scaleX = 1;
        this._jianChiIma.scaleY = 1;
        this._jianChiIma.alpha = 0;
        let tween = egret.Tween.get(this._jianChiIma).to({alpha:0.5},167).to({alpha:1},167);
    }

    /**
     * 初始化倒计时
     */
    private initNum($num:number){
        this._numIma.texture = RES.getRes("wz_" + $num + "_png");
        this._timeImaAniGroup.addChild(this._numIma);
        this._numIma.anchorOffsetX = this._numIma.width/2;
        this._numIma.anchorOffsetY = this._numIma.height/2;
        this._numIma.x = 325;
        this._numIma.y = 250;
        this._numIma.scaleX = 1;
        this._numIma.scaleY = 1;
        this._numIma.alpha = 1;
    }

    /**
     * UI上的倒计时动画结束
     */
    private UiTimeAniEnd(){
        egret.Tween.removeTweens(this._timeUiAniGroup);
        this._timeUiAniGroup.visible = false;
    }

    /**
     * 倒计时图片动画结束
     */
    private timeImaAniEnd(){
        egret.Tween.removeTweens(this._jianChiIma);
        egret.Tween.removeTweens(this._numIma);
        if (this._timeImaAniGroup.contains(this._jianChiIma)){
            this._timeImaAniGroup.removeChild(this._jianChiIma);
        }
        if (this._timeImaAniGroup.contains(this._numIma)){
            this._timeImaAniGroup.removeChild(this._numIma);
        }
        this._timeImaAniGroup.visible = false;
    }

    /**
     * 游戏结束清空动画
     */
    public gameEnd(){
        this.timeImaAniEnd();
        this.UiTimeAniEnd();
        this.initUiBloodAni();
    }

    /**
     * 能量
     */
    public set Energy($num: number){
        $num = Math.max(0, $num);
        this._energy = $num;
        var maxEnergy: number = this._curIniSkill ? this._curIniSkill.MpCost : 100;
        this._energy = Math.min(this._energy, maxEnergy);
        if(this._energy < maxEnergy){
            this._skillIma.filters = [FilterManage.HuiDu];
            this._jinzhiIma.visible = true;
            if(this._skillMaxAni && this._skillMaxAni.visible){
                this._skillMaxAni.stop();
                this._skillMaxAni.visible = false;
            }
        }else{
            this._skillIma.filters = [];
            this._jinzhiIma.visible = false;
            if(this._skillMaxAni){
                this._skillMaxAni.play(-1);
                this._skillMaxAni.visible = true;
            }
        }
        // 能量条
        if(this._skillTiaoAni && this._curIniSkill){
            let _zhen = Math.round(100 * (this._energy/this._curIniSkill.MpCost));
            this._skillTiaoAni.gotoAndStop(_zhen);
        }
        this._energyLabel.text = this._energy.toString();
    }

    /**
     * 能量
     */
    public get Energy(){
        return this._energy;
    }

    // 变量
    private _isCreated: boolean = false;        // 是否创建完成
    private _isVisibled: boolean = false;       // 是否显示
    private _scoreLabel: eui.BitmapLabel;       // 分数文本
    private _group: eui.Group;                  // 血条时间条容器
    private _checkGroup: eui.Group;             // 关卡容器
    private _timeImage: eui.Image;              // 时间条
    private _bloodImage: eui.Image;             // 血条
    private _moneyLabel: eui.BitmapLabel;       // 金钱文本
    private _timeWidth: number = 168;           // 时间图片宽度
    private _bloodWidth: number = 168;          // 血条图片宽度
    private _role: Role;                        // 当前游戏角色
    private _maxGameTime: number;               // 最大游戏时间(秒)
    private _gameTime: number;                  // 游戏时间(秒)
    private _timer: number;                     // 计时器
    private _isTiming: boolean = false;         // 是否计时

    private _kouxueLabel: eui.BitmapLabel;      // 扣血文本
    private _huixueLabel: eui.BitmapLabel;      // 回血文本
    private _xueImage: eui.Image;               // 血图片
    private _isMovie: boolean = false;          // 是否移动

    
    private _dicengXueIma: eui.Image;           // 虚度底层的血
    private _shanXueIma: eui.Image;             // 闪血

    private _timerOutFun: any;                  // 时间函数
    private _lastWidth: number;                 // 之前的宽度
    private _shanNum: number = 0;               // 闪光次数

    private _timeUiAniGroup: eui.Group;         // Ui上倒计时动画组
    private _timeImaAniGroup: eui.Group;        // 文字倒计时显示区域

    private _ifUiDaojiAniStar: boolean = false; // UI部分的倒计时动画是否开始

    private _jianChiIma: eui.Image;             // 坚持住图片
    private _numIma: eui.Image;                 // 倒计时数字图片

    private _guanqiaLabel: eui.BitmapLabel;     // 关卡显示

    private _bloodLabel: eui.Label;             // 关卡生命显示
    private _timeLabel: eui.Label;              // 关卡时间显示

    private _skillGroup: eui.Group;             // 主动技能容器
    private _skillIma: eui.Image;               // 技能图标
    private _skillMaskIma: eui.Image;           // 遮罩
    private _skillBg: eui.Image;                // 技能表层
    private _skillTiaoAni: egret.MovieClip;     // 技能能量条帧动画
    private _skillMaxAni: egret.MovieClip;      // 技能能量条积满特效

    private _energy: number = 0;                // 能量
    private _energyLabel: eui.Label;            // 能量文本
    private _curIniSkill: Skill = null;         // 当前主动技能
    private _kouxueSet: any[] = [];
    private _jinzhiIma: eui.Image;              // 技能禁止图标
    private _textLabel: eui.BitmapLabel;
}