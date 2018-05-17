/**
 * 游戏
 */
class Game extends egret.DisplayObjectContainer{
    /**
     * 是否是苹果设备
     */
    public static IsIos: boolean = true;
    
    /**
     * 游戏宽度
     */
    public static GameWidth: number = 640;

    /**
     * 移动速度
     */
    public static MoveSpeed: number = 223;

    /**
     * 角色移动Y值分界线
     */
    public static RoleYLimit: number = 400;

    /**
     * 角色状态（0正常跑，1小跳，2大跳）
     */
    public static RoleStatus: number = 0;

    /**
     * 游戏状态，是否在游戏
     */
    public static GameStatus: boolean = false;

    /**
     * x位移偏差
     */
    public static PianchaNum: number = 8;

    /**
     * 是否显示顶部TIP
     */
    public static IsShowTopTip: boolean = true;

    /**
     * 游戏实例
     */
    public static get Instance(): Game{return Game._instance;}

    /**
     * 构造方法
     */
    public constructor(){
        super();

        this._Init();
    }

    /**
     * 界面初始化
     */
    private _Init(){
        Game._instance = this;
        // 创建各种容器
        this._bg = new eui.Image(MapManager.SceneJsonData["bg"]);
        this._sceneLayer = new egret.DisplayObjectContainer();
        this._moveLayer = new egret.DisplayObjectContainer();
        this._mapLayer = new egret.DisplayObjectContainer();
        this._outDoorLayer = new egret.DisplayObjectContainer();
        this._roleLayer = new egret.DisplayObjectContainer();
        this._doorLayer = new egret.DisplayObjectContainer();
        this._topLayer = new egret.DisplayObjectContainer();
        this._weatherLayer = new egret.DisplayObjectContainer();
        this.addChild(this._bg);
        this.addChild(this._sceneLayer);
        this.addChild(this._moveLayer);
        this._moveLayer.addChild(this._mapLayer);
        this._moveLayer.addChild(this._outDoorLayer);
        this._moveLayer.addChild(this._roleLayer);
        this._moveLayer.addChild(this._doorLayer);
        this._moveLayer.addChild(this._topLayer);
        this._top = new eui.Image(MapManager.SceneJsonData["top"]);
        this.addChild(this._top);
        this.addChild(this._weatherLayer);

        this._friendBg = new eui.Image();
        // this._friendBg.texture = RES.getRes("youxi_zuoding_di_png");
        // this._friendBg.y = 1021;
        this._friendScore = new FriendGameScore();

        // 创建道路上的好友头像
        // this._roadFriendIcon = new RoadFriendIcon();
        // this.addChild(this._roadFriendIcon);
        // this._roadFriendIcon.upDateShow();
        // this._roadFriendIcon.y = 1050;
        // this._roadFriendIcon.x = 50;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._OnMouseClick, this);
        GameEvent.AddEventListener(EventType.GameEnd, this._GameRealEnd, this);
        GameEvent.AddEventListener(EventType.RoleLifeEmpty, this._GameRoleLifeEmpty, this);
        // 添加帧监听
        ProcessManager.AddProcess(this._Process.bind(this));
        // 开始游戏
        this.StarBattle();
    }

    /**
     * 开始游戏
     */
     public StarBattle(){
        // 上报服务端游戏开始
        if (this._paperairArm1 != null){
            ArmaturePool.ReturnMoviePool(this._paperairArm1);
            this._paperairArm1 = null;
        }
        if (this._paperairArm2 != null){
            ArmaturePool.ReturnMoviePool(this._paperairArm2);
            this._paperairArm2 = null;
        }
        this._currentPaper = null;

        Game._isInitArm = false;
        ArmaturePool.Init();
        Game._isInitMap = false;
        MapManager.creatAllMap();
        

        if (CheckpointManager.IsEndless || CheckpointManager.IsDailyActive){
            var data : JSON = JSON.parse("{}");
            data["token"] = UnitManager.Player.GameToken;
            NetManager.SendRequest(["func=" + NetNumber.GameEnd + "&start=0" + "&score=0&money=0"
                                    + "&oemInfo=" + JSON.stringify(data)],
                                    this._GameStartComplete.bind(this));
        }
        else if (CheckpointManager.IsCatch){
            NetManager.SendRequest(["func=" + NetNumber.StartCatch + "&id=" + CheckpointManager.CurrentCheckpointID],
                                    this._GameStartComplete.bind(this));
        }
        else if (CheckpointManager.IsRunaway){
            NetManager.SendRequest(["func=" + NetNumber.StartEscape + "&id=" + CheckpointManager.CurrentCheckpointID],
                                    this._GameStartComplete.bind(this));
        }
        else{
            NetManager.SendRequest(["func=" + NetNumber.CheckpointStar + "&id=" + CheckpointManager.CurrentCheckpointID],
                                    this._GameStartComplete.bind(this));
        }

        // 获取好友排行信息
        var data : JSON = JSON.parse("{}");
        this._friendRankSet2 = [];
        data["token"] = UnitManager.Player.GameToken;
        NetManager.SendRequest(["func=" + NetNumber.FriendRanking + "&oemInfo=" + JSON.stringify(data)], this._ReceiveFriendRank.bind(this));
        
        this._friendRankInfo = null;
        this._playerRankInfo = null;
        this._lastRankNum = 101;
        Game.Instance.EndRankNum = 0;

        // 初始化场景
        if(CheckpointManager.CurrentCheckpoint){
            MapManager.SetSceneIndex(CheckpointManager.CurrentCheckpoint.SceneId);
        }else{
            MapManager.SetSceneIndex(2001);
        }

        // 专属场景设置
        if(UnitManager.CurrentRole.Scene != 0){
            if(UnitManager.CurrentRole.IsSceneStart){
                MapManager.SetSceneIndex(UnitManager.CurrentRole.Scene);
            }
        }

        if (!Main.IsNeedNetDebug){
            this._GameStartComplete({"code":0});
        }
    }

    /**
     * 游戏开始返回
     */
    private _GameStartComplete(jsondata: Object){
        var code: number = jsondata["code"];
        if (code != NetManager.SuccessCode){
            let isTip: boolean = false;
            switch (code) {
                case 603:
                case 9004:
                    PromptManager.CreatCenterTip(false, true, "体力不足");
                    isTip = true;
                    break;
            }
            if(isTip == false){
                PromptManager.CreatCenterTip(false, true, "进入游戏失败！");
            }
            WindowManager.WaitPage().IsVisibled = false;
            return;
        }
        MapManager.IsUpdateMap = false;
        GameEvent.DispatchEvent(EventType.GameStart);
        if(this._bg)
        {
            this._bg.texture = RES.getRes(MapManager.SceneJsonData["bg"]);
        }

        if(this._top)
        {
            this._top.texture = RES.getRes(MapManager.SceneJsonData["top"]);
        }
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this._moveLayer);
        egret.Tween.removeTweens(this._sceneLayer);
        if (this._mapSet != null && this._mapSet.length > 0){
            while(this._mapSet.length > 0){
                this._mapSet[0].Destroy();
                this._mapLayer.removeChild(this._mapSet.shift());
            }
        }
        if (this._sceneSet != null && this._sceneSet.length > 0){
            while(this._sceneSet.length > 0){
                this._sceneSet[0].Destroy();             
                this._sceneLayer.removeChild(this._sceneSet.shift());
            }
        }
        if (this._roleSet != null && this._roleSet.length > 0){
            while(this._roleSet.length > 0){
                this._roleSet[0].Destroy();
                this._roleSet.shift();
            }
        }
        if (GameRole.LastRole != null){
            GameRole.LastRole.Destroy();
            GameRole.LastRole = null;
        }
        this._moveLayer.y = 0;
        this._sceneLayer.y = 0;
        this._scoreNum = 0;
        this._goldNum = 0;
        this._timer = 0;
        this._isRoleLifeEmpty = false;
        WindowManager.GameUI().UIInit();
        SkillManager.StartGame();
        UnitManager.CurrentRole.GameInit();
        
        this._CreateScene();
        this._CreateScene();
        this._CreateScene();
        this._CreateMap();
        this._CreateMap();
        SoundManager.PlayBattleBGMusic();

        Game._isStarReturn = true;
        if(Game._isInitArm && Game._isInitMap && Game._isStarReturn){
            WindowManager.WaitPage().IsVisibled = false;
        }

        if(CheckpointManager.CurrentCheckpointID <= 5){
            this.creatJiaoChengPage();
        }else{
            this.afterJiaoChengPage();
        }

        if (WindowManager.AchievementTip(false) != null){
            if (WindowManager.AchievementTip().IsVisibled){
                WindowManager.AchievementTip().IsVisibled = false;
            }
        }
    }

    /**
     * 创建新手引导教程界面
     */
    private creatJiaoChengPage(){
        if(this._jiaoChengPage == null){
            this._jiaoChengPage = new eui.Image();
            this._jiaoChengPage.texture = RES.getRes("xinshou_jiaocheng" + StringMgr.LanguageSuffix +"_png");
            this._jiaoChengPage.touchEnabled = false;
        }
        Main.Instance.GameLayer.addChild(this._jiaoChengPage);
    }

    /**
     * 新手引导教程界面之后
     */
    private afterJiaoChengPage(){
        if(this._jiaoChengPage && this._jiaoChengPage.parent != null){
            Main.Instance.GameLayer.removeChild(this._jiaoChengPage);
        }
        
        Game.Instance.ChangeSize(new egret.Point(312, 0));
        if (CheckpointManager.CurrentCheckpoint != null && CheckpointManager.CurrentCheckpoint.TipID != ""){
            var res: string = "";
            var des: string = "";
            var tipData: JSON = RES.getRes("chaptertipdata_json");
            var data: JSON = tipData[CheckpointManager.CurrentCheckpoint.TipID];
            if (data != null){
                res = data["pic"] + "_png";
                des = StringMgr.GetText(data["desc"]);
            }
            PromptManager.ShowGameTip(des,res,this.jixuGame.bind(this));
        }
        else{
            this.jixuGame();
        }
    }

    /**
     * 显示新手提示之后继续游戏
     */
    private jixuGame(){

        Game.GameStatus = true;

        if (CheckpointManager.CurrentCheckpoint != null && CheckpointManager.CurrentCheckpoint.Effect != 0){
            if(CheckpointManager.CurrentCheckpoint.Effect == 1 ) WeatherManager.Start(WeatherManager.Rain);
            else WeatherManager.Start(WeatherManager.Snow);      
        }

        if(this._moveFriendArr.length>0){
            for(var i=0; i<this._moveFriendArr.length;i++){
                this.removeChild(this._moveFriendArr[i]);
            }
        }
        this._moveFriendArr = [];

        if (this.contains(this._friendScore)){
            this.removeChild(this._friendBg);
            this.removeChild(this._friendScore);
        }
    }

    /**
     * 创建被动技能提示
     */
    private creatBeiDongSkillTip(){
        if (CheckpointManager.IsEndless) return;
        if (CheckpointManager.IsDailyActive) return;
        this._gameSkillTipSet = [];
        var idSet: Skill[] = UnitManager.CurrentRole.UseSkillSet;
        let _noCreatSet = [11,8,7,9,14,17,20];
        if (idSet != null && idSet.length > 0){
            for (var i = 0; i < idSet.length; i++){
                if (_noCreatSet.indexOf(idSet[i].ID) == -1){
                    this.creatZhuDongSkillTip(idSet[i].ID);
                }
            }
         }
    }

    /**
     * 显示技能提示
     */
    private _ShowSkillMovie(){
        if (this._showSkillIDSet.length <= 0){
            this._isShowSkillMovie = false;
            return;
        }
        this._isShowSkillMovie = true;
        var skillId: number = this._showSkillIDSet.shift();
        let skillTip = new GameSkill(skillId);
        skillTip.x = 640/2;
        skillTip.y = 300;
        this.addChild(skillTip);
        this._skillTimer = 0;
    }

    /**
     * 创建技能提示
     */
    public creatZhuDongSkillTip($skillId: number){
        if (!this._isShowSkillMovie){
            this._showSkillIDSet.push($skillId);
            this._ShowSkillMovie();
        }
        else {
            this._showSkillIDSet.push($skillId);
        }
    }

    private _showSkillIDSet: number[] = [];
    private _isShowSkillMovie: boolean = false;
    private _skillTimer: number = 0;

    private _gameSkillTipSet:GameSkill[] = [];

    /**
     * 创建地图
     */
    private _CreateMap(){
        if (this._mapSet == null) this._mapSet = [];
        if (this._scoreNum != null){
            if (this._scoreNum > this._endlessScoreSet[0]){
                this._endlessStartDifficulty = 3;
            }
            for (var i = 0; i < this._endlessScoreSet.length; i++){
                if (this._scoreNum <= this._endlessScoreSet[i]){
                    if (i != 0){
                        this._endlessDifficulty = this._endlessDifSet[i - 1];
                    }
                    break;
                }
            }
        }

        let map: Map = null;
        if (this._mapSet.length == 0){
            if (CheckpointManager.IsEndless || CheckpointManager.IsDailyActive){
                map = MapManager.GetNewMap(this._endlessDifficulty, true);
            }
            else{
                map = MapManager.GetMap();
            }
            map.CreateMap();
            map.y = 0;
        }
        else{
            if (CheckpointManager.IsEndless || CheckpointManager.IsDailyActive){
                map = MapManager.GetNewMap(this._endlessDifficulty);
            }
            else{
                map = MapManager.GetMap();
            }
            map.CreateMap();
            var lastMap: Map = this._mapSet[this._mapSet.length - 1];
            if (lastMap != null){
                map.y = lastMap.y + lastMap.Height;
            }
            else map.y = 0;
        }
        this._CreateDoor(map);
        this._mapSet.push(map);
        this._mapLayer.addChild(map);
        var isFirstOne: boolean = this._mapSet.length == 1;
        this._CreateGold(map, isFirstOne);
    }

    /**
     * 创建场景
     */
    private _CreateScene(){
        if (this._sceneSet == null) this._sceneSet = [];
        var scene: Scene = new Scene();
        if (this._sceneSet.length == 0){
            scene.y = 0;
        }
        else {
            var last: Scene = this._sceneSet[this._sceneSet.length - 1]
            scene.y = last.y + last.height;
        }
        scene.CreateScene();
        this._sceneSet.push(scene);
        this._sceneLayer.addChild(scene);
    }

    /**
     * 初始化角色
     */
    private _InitRole(){
        GameRole.IsFriend = false;
        if (this._roleSet == null) this._roleSet = [];
        var map: Map = this._mapSet[0];
        for (var i = 0; i < map.RoadCount; i++){
            var role: GameRole = new GameRole();
            role.CreateRole();
            role.Road = map.GetRoad(i);
            role.Map = map;
            role.x = role.MoveRoad[0].x;
            role.y = role.MoveRoad[0].y;
            role.Prop = true;
            this._roleLayer.addChild(role);
            this._roleSet.push(role);
            role.Move(); 
            break;
        }
        Game.RoleStatus = 0;
        GameRole.RoleIsDie = false;
        this._xueTimes = 0;
        this._roleSet[0].MapMoveMark = true;
        Game.Instance.ChangeSize(new egret.Point(this._roleSet[0].localToGlobal().x, 0));
        WindowManager.GameUI().StarGame();
        this.weatherEffect();
        this.creatBeiDongSkillTip();
    }
    /**
     * 天气扣血
     */
    private weatherEffect(){
        var xueTime: number = 3000;         // 下雪时间间隔
        var yuTime: number = 5000;          // 下雨时间间隔
        if (UnitManager.CurrentRole.ImmuneHurt){
            // 下雨
            if(CheckpointManager.CurrentCheckpoint.Effect == 1){
                this._weathertime = egret.setTimeout(this.weatherEffect,this,yuTime);                
            }
            // 下雪
            else if(CheckpointManager.CurrentCheckpoint.Effect == 2){   
                this._weathertime = egret.setTimeout(this.weatherEffect,this,xueTime); 
            }
            return;
        }

        var isWudi: boolean = false;
        var hasHuo: boolean = false;
        for (var i = 0; i < this._roleSet.length; i++){
            if (this._roleSet[i].IsWuDi) isWudi = true;
            if (!this._roleSet[i].IsDie) hasHuo = true;
        }
        if (isWudi || !hasHuo){
            var time: number = CheckpointManager.CurrentCheckpoint.Effect == 1? yuTime :
                               CheckpointManager.CurrentCheckpoint.Effect == 2? xueTime : 0;
            if (time != 0){
                this._weathertime = egret.setTimeout(this.weatherEffect,this,time);   
            }
            return;
        }
        var difficulty: number = CheckpointManager.CurrentCheckpoint == null? 1 : CheckpointManager.CurrentCheckpoint.Difficulty;
        if(CheckpointManager.CurrentCheckpoint != null && CheckpointManager.CurrentCheckpoint.Effect !=0){
            egret.clearTimeout(this._weathertime);
            var currentRole: Role = WindowManager.GameUI().Role;
            var point: egret.Point;
            if (this._roleSet[0] != null){
                point = new egret.Point(this._roleSet[0].localToGlobal().x,this._roleSet[0].localToGlobal().y);
            }
            // 下雨
            if(CheckpointManager.CurrentCheckpoint.Effect == 1){
                var value: number = Math.ceil((currentRole.MaxLife * 0.01 + 10 * difficulty) * (1-currentRole.InjuryFreeRate));
                WindowManager.GameUI().BuckleBlood(value ,point);                
                this._weathertime = egret.setTimeout(this.weatherEffect,this,yuTime);                
            }
            // 下雪
            else if(CheckpointManager.CurrentCheckpoint.Effect == 2){
                var cold:number = 0;
                this._xueTimes += 1;
                if(this._xueTimes == 3){
                    this._xueTimes = 0;
                    cold = 0.02 * currentRole.MaxLife;
                }
                var value: number = Math.ceil((40 + difficulty) * difficulty * 0.1);
                WindowManager.GameUI().BuckleBlood(value + cold, point);     
                this._weathertime = egret.setTimeout(this.weatherEffect,this,xueTime); 
            }
        }
    }

    /**
     * 经过传送门时创建角色
     */
    public CreateRole(type: number){
        // 获取当前角色所在地图
        var map: Map = this._roleSet[0].Map;
        // 创建角色
        for (var i = 1; i < map.RoadCount; i++){
            var road: Road = map.GetRoad(i);
            if (road.IsCreateRole) continue;
            road.IsCreateRole = true;
            var role: GameRole = new GameRole();
            role.CreateRole();
            role.Road = road;
            role.Map = map;
            role.x = role.MoveRoad[0].x + map.x;
            role.y = role.MoveRoad[0].y + map.y;
            role.Prop = true;
            role.ReviveTime = this._roleSet[0].ReviveTime;
            this._roleLayer.addChild(role);
            this._roleSet.push(role);
            role.Move();
        }
        // 打开地图上的门
        map.OutDoorOpen(type);
        // 更新角色的移动标致
        this.UpdataRoleMoveMark();
    }

    /**
     * 更新角色的移动标致
     */
    public UpdataRoleMoveMark(){
        if (this._roleSet == null || this._roleSet.length == 0) return;
        var role: GameRole = this._roleSet[0];
        role.MapMoveMark = true;
        for (var i = 1; i < this._roleSet.length; i++){
            if (this._roleSet[i].y > role.y){
                role.MapMoveMark = false;
                this._roleSet[i].MapMoveMark = true;
                role = this._roleSet[i];
            }
        }
    }

    /**
     * 角色汇合
     * @param role      经过汇合点的角色
     * @param type      汇合点的类型
     * @return boolean  是否需要删除该角色
     */
    public RoleConfluence(role: GameRole, type: number): boolean{
        Game.Instance.UpdataRoleMoveMark();
        if (this._roleSet.length == 0) return false;
        var isDisappear: boolean = false;
        for (var i = 0; i < this._roleSet.length; i++){
            if (role == this._roleSet[i]) continue;
            if (this._roleSet[i].Road.GroupNum > type) continue;
            if (role.y <= this._roleSet[i].y){
                isDisappear = true;
                break;
            }
        }
        if (isDisappear){
            for (var i = 0; i < this._roleSet.length; i++){
                if (role == this._roleSet[i]){
                    this._roleSet.splice(i, 1);
                    break;
                }
            }
            role.Disappear();
            return true;
        }
        return false;
    }

    /**
     * 地图移动
     */
    public MapMove(moveDis: number, time: number){
        if (this._jumpDis > 0){
            moveDis += this._jumpDis;
            this._jumpDis = 0;
        }
        egret.Tween.removeTweens(this._moveLayer);
        var yMove: number = this._moveLayer.y - moveDis;
        var tw = egret.Tween.get(this._moveLayer);
        tw.to({y: yMove}, time);

        egret.Tween.removeTweens(this._sceneLayer);
        var sMove: number = this._sceneLayer.y - moveDis;
        var sTw = egret.Tween.get(this._sceneLayer);
        sTw.to({y: sMove}, time);
        this._SceneMoveEnd();
    }

    /**
     * 场景移动后响应
     */
    private _SceneMoveEnd(){
        var scene = this._sceneSet[0];
        if (this._sceneLayer.y + scene.y + scene.height <= 0){
            scene.Destroy();
            this._sceneLayer.removeChild(scene);
            this._sceneSet.splice(0, 1);
            this._CreateScene();
            this._PaperairPlay();
            
        }
    }

    /**
     * 角色更新地图
     */
    public RoleUpdataMap(role: GameRole, map: Map): boolean{
        // 判断角色是否存在
        for (var i = 0; i < this._roleSet.length; i++){
            if (role != this._roleSet[i]) continue;
            if (role == this._roleSet[i]) break; 
            return false;
        }
        // 获取角色当前所在的地图，并更新到下一张地图
        for (var i = 0; i < this._mapSet.length; i++){
            if (this._mapSet[i] == map){
                if (i == this._mapSet.length - 1) return false;
                var nextMap: Map = this._mapSet[i + 1];
                role.Road = nextMap.GetRoad(0);
                role.Map = nextMap;
            }
        }
        // 移除超出屏幕的无用地图
        for (var i = 0; i < this._mapSet.length; i++){
            var mapY: number = this._moveLayer.y + this._mapSet[i].Height + this._mapSet[i].y;
            if (mapY < 0){
                var map: Map = this._mapSet[i];
                this._mapLayer.removeChild(this._mapSet[i]);
                this._mapSet.splice(i, 1);
                map.Destroy();
                i--;
            }
        }
        // 创建新的地图
        if (this._mapSet.length < 3){
            this._CreateMap();
        }
        return true;
    }

    /**
     * 点击相应
     */
    private _OnMouseClick(event: egret.TouchEvent){
        if(this._jiaoChengPage && this._jiaoChengPage.parent != null){
            this.afterJiaoChengPage();
        }
        if (GameRole.RoleIsDie || GameRole.IsFriend || !Game.GameStatus) return;
        
        if (Game.RoleStatus == 0){                          // 在跑路状态
            Game.RoleStatus = 1;
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].RoleJump();
            }
        }
        else if (Game.RoleStatus == 1){                     // 在小跳状态
            if (GameRole.RoleCanJump)                           // 在小跳起步状态内才可大跳
            {
                Game.RoleStatus = 2;
            }
        }
    }

    /**
     * 判断是否是最后一个角色
     */
    public CheckGameEnd(role: GameRole): boolean{
        if(GameRole.IsFriend) return;
        if (CheckpointManager.IsEndless || CheckpointManager.IsDailyActive){
            for (var i = 0; i < this._roleSet.length; i++){
                if (this._roleSet[i] == role){
                    this._roleSet[i].Die(this._roleSet.length == 1, false);
                    this._roleSet.splice(i, 1);
                    Game.Instance.UpdataRoleMoveMark();
                    break;
                }
            }
            if (this._roleSet.length <= 0)
            {
                GameEvent.DispatchEvent(EventType.RoleLifeEmpty);
                return true;
            }
            else return false;
        }
        var isLastOne: boolean = false;
        var canRevival: boolean = false;
        var revivalTime: number = 5000;
        for (var i = 0; i < this._roleSet.length; i++){
            if (this._roleSet[i] == role){
                if (this._roleSet.length == 1){
                    this.FallHole();
                    if (this._isRoleLifeEmpty){
                        this._isRoleLifeEmpty = false;
                        return;
                    } 
                    isLastOne = true;
                    if (WindowManager.GameUI().Role.CurrentLife > 0){
                        canRevival = true;
                        revivalTime = 2000;
                    }
                }
                this._roleSet[i].Die(isLastOne, canRevival, revivalTime);
                if (!isLastOne || (isLastOne && !canRevival)){
                    this._roleSet.splice(i, 1);
                }
                Game.Instance.UpdataRoleMoveMark();
                break;
            }
        }
        return isLastOne;
    }

    /**
     * 血量为0后处理
     */
    private _GameRoleLifeEmpty(){
        this._isRoleLifeEmpty = true;
        var isLastOne: boolean = false;
        var canRevival: boolean = false;
        var revivalTime: number = 5000;
        while(this._roleSet.length > 0){
            if (this._roleSet.length == 1){
                isLastOne = true;
            }
            this._roleSet[0].Die(isLastOne, canRevival, revivalTime);
            if (!isLastOne || (isLastOne && !canRevival)){
                this._roleSet.splice(0, 1);
            }
            Game.Instance.UpdataRoleMoveMark();
        }
    }

    /**
     * 掉坑
     */
    public FallHole(){
        var point: egret.Point;
        if (this._roleSet[0] != null){
            point = new egret.Point(this._roleSet[0].localToGlobal().x,this._roleSet[0].localToGlobal().y);
        }
        WindowManager.GameUI().BuckleBlood(0, point);
    }

    /**
     * 复活倒计时
     */
    public GameRevive(){
        if (this._daojishiArm == null){
            this._daojishiArm = ArmaturePool.GetArmature("daojishi_json", "daojishitexture_json", "daojishitexture_png", "daojishi");
            this._daojishiArm.display.x = 320;
            this._daojishiArm.display.y = 568;
        }
        else{
            MovieManager.ADDArmature(this._daojishiArm);
        }
        this._daojishiArm.addEventListener(dragonBones.Event.COMPLETE, this._OnDaojishiEnd, this);
        this.addChild(this._daojishiArm.display);
        this._daojishiArm.animation.play("daojishi", 1);
        this._friendScore.visible = true;
        this._friendBg.visible = true;
        this.scaleX = this.scaleY = 1;
        WindowManager.GameUI().IsVisibled = true;
    }

    /**
     * 复活倒计时结束
     */
    private _OnDaojishiEnd(){
        this._daojishiArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnDaojishiEnd, this);
        this.removeChild(this._daojishiArm.display);
        dragonBones.WorldClock.clock.remove(this._daojishiArm);
        Game.GameStatus = true;
        this._roleSet.push(GameRole.LastRole);
        this._roleSet[0].Revive();
        this.UpdataRoleMoveMark();
        GameEvent.DispatchEvent(EventType.RoleRevive);
    }

    /**
     * 跳转距离
     */
    public set JumpDis(dis: number){
        this._jumpDis = dis;
    }

    /**
     * 创建门
     */
    private _CreateDoor(map: Map){
        if (map == null) return;
        for (var i = 0; i < map.RoadCount; i++){
            var road: Road = map.GetRoad(i);
            var roadPoint: egret.Point[] = road.MoveRoad;
            var roadType: number[] = road.RoadType;
            var doorTypeSet: number[] = road.DoorTypeSet;
            for (var j = 0; j < roadPoint.length - 1; j++){
                if (i > 0 && j > 2) break;
                var lastPoint: egret.Point = j == 0? null : roadPoint[j - 1];
                var nextPoint: egret.Point = roadPoint[j + 1];
                var type: number = roadType[j];
                var point: egret.Point = roadPoint[j];
                var doorType: number = doorTypeSet[j];
                // 入口
                if (type == 4 && lastPoint != null){
                    let doorEnter: egret.MovieClip;
                    if (Math.abs(point.x - lastPoint.x) <= Game.PianchaNum){     // 正中
                        doorEnter = ArmaturePool.GetMovieArmature("entrance01_idle_json","entrance01_idle_png","entrance01_idle");
                        doorEnter["name"] = "entrance01";
                    }
                    else{   // 斜
                        doorEnter = ArmaturePool.GetMovieArmature("entrance02_idle_json","entrance02_idle_png","entrance02_idle");
                        doorEnter["name"] = "entrance02";
                        if (point.x > lastPoint.x){
                            doorEnter.scaleX = -1;
                        }else{
                            doorEnter.scaleX = 1;
                        }
                    }
                    doorEnter.x = point.x;
                    doorEnter.y = map.y + point.y + 12;
                    doorEnter[Map.DoorType] = doorType;
                    doorEnter.play(-1);
                    this._doorLayer.addChild(doorEnter);
                    map.AddEnterDoor(doorEnter);
                }
                if (type == 5){
                    var doorOut: egret.MovieClip;
                    if (Math.abs(point.x - nextPoint.x) <= Game.PianchaNum){     // 正中
                        doorOut = ArmaturePool.GetMovieArmature("exit01_idle_json","exit01_idle_png","exit01_idle");
                        doorOut["name"] = "exit01";
                    }
                    else{                               // 斜
                        doorOut = ArmaturePool.GetMovieArmature("exit02_idle_json","exit02_idle_png","exit02_idle");
                        doorOut["name"] = "exit02";
                        
                        if (point.x < nextPoint.x){
                            doorOut.scaleX = -1;
                        }
                        else{
                            doorOut.scaleX = 1;
                        }
                    }
                    doorOut.x = point.x;
                    doorOut.y = map.y + point.y;
                    doorOut[Map.DoorType] = doorType;
                    doorOut.play(-1);
                    this._outDoorLayer.addChild(doorOut);
                    map.AddOutDoor(doorOut);
                }
            }
        }
    }

    /**
     * 改变大小
     */
    public ChangeSize(center: egret.Point, isChangeBig: boolean = false){
        if (center == null) return;
        this.anchorOffsetX = center.x;
        this.anchorOffsetY = center.y;
        this.x = center.x;
        this.y = center.y;
        this._friendScore.visible = false;
        this._friendBg.visible = false;
        WindowManager.GameUI().IsVisibled = false;

        var tw = egret.Tween.get(this);
        if (isChangeBig){
            this.scaleX = this.scaleY = 1;
            tw.to({scaleX: 1.3, scaleY: 1.3}, 600).call(this._ChangeSizeEnd, this);
        }
        else{
            tw.to({scaleX: 1, scaleY: 1}, 600).call(this._ChangeSizeEnd, this);
        }

        if(this._moveFriendArr.length>0){
            for(var i=0; i<this._moveFriendArr.length;i++){
                this.removeChild(this._moveFriendArr[i]);
            }
        }
        this._moveFriendArr = [];
    }

    /**
     * 改变大小结束
     */
    private _ChangeSizeEnd(){
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this._sceneLayer);
        egret.Tween.removeTweens(this._moveLayer);
        if (this.scaleX == 1){
            this._friendScore.visible = true;
            this._friendBg.visible = true;
            WindowManager.GameUI().IsVisibled = true;
        }
    }

    /**
     * 增加分数
     */
    private _AddScore(){
        this._scoreNum += this._roleSet.length;
        GameEvent.DispatchEvent(EventType.GameScoreChange);
    }

    private _scoreSet: number[] =   [1232,   2034,  3029,  4021,  5836,  6284,  7356,  8520,  9953,  10099, 11003, 12987, 13764, 14328, 15602, 20846];
    private _scoreState: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    private _scoreIndex: number = 0;

    /**
     * 分数
     */
    public get Score(): number{
        var score: number = this._scoreNum;
        return score;
    }

    /**
     * 最总分数
     */
    public get EndScore(): number{
        return this._endScore;
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        if (!Game.GameStatus) return;
        if (this.IsGamePause) return;
        //创建Readygo
        if(this._ready == null && this._isreadygo == false){
            this.createReady();
            this._isreadygo = true;
            return;
        }
        if (GameRole.IsFriend){
            GameRole.IsFriend = false;
            return;
        }
        // 技能表现
        if (this._isShowSkillMovie){
            this._skillTimer += frameTime;
            if (this._skillTimer >= 900){
                this._ShowSkillMovie();
            }
        }
        // 分数计算
        var time: number = 330;
        var lessTime: number = Math.ceil(time * 1.414);
        this._timer += frameTime;
        if (GameRole.IsDirect && this._timer >= time){
            this._timer -= time;
            this._AddScore();
        }
        else if (!GameRole.IsDirect && this._timer >= lessTime){
            this._timer -= lessTime;
            this._AddScore();
        }
        
        // 调用角色的帧响应
        for (var i = 0; i < this._roleSet.length; i++){
            this._roleSet[i].Process(frameTime);
        }

        
    }

    private _ifAniPlay: boolean = true;

    /**
     * 创建ready
     */
    private createReady(){
        if(this._ready == null){
            this._ready = new eui.Image();
        }
        this._ready.texture = RES.getRes("wz_ready_png");
        this._topLayer.addChild(this._ready);     
        this._ready.anchorOffsetX = this._ready.width/2;
        this._ready.anchorOffsetY = this._ready.height/2;
        this._ready.x = 345;
        this._ready.y = 500;
        this._ready.scaleX = 1.049;
        this._ready.scaleY = 1.049;
        this._ready.alpha = 1;
        let tween = egret.Tween.get(this._ready).to({scaleX:1,scaleY:1},300).to({scaleX:1.1,scaleY:1.1},300).to({scaleX:1,scaleY:1},300).to({scaleX:1.644,scaleY:1.644,alpha:0},1300)
        .wait(500)
        .call(
            function(){
                this._topLayer.removeChild(this._ready);
                this._ready = null;
                this.creatego();   
            }.bind(this));
    }
    
    /**
     * 创建go
     */
    private creatego(){
        if(this._go == null)
            this._go = new eui.Image();
        this._go.texture = RES.getRes("wz_go_png");
        this._topLayer.addChild(this._go);
        this._go.anchorOffsetX = this._go.width/2;
        this._go.anchorOffsetY = this._go.height/2;
        this._go.x = 345;
        this._go.y = 500;
        this._go.scaleX = 1.049;
        this._go.scaleY = 1.049;
        this._go.alpha = 1;
        let tween = egret.Tween.get(this._go).to({scaleX:1,scaleY:1},135).wait(600).to({alpha:0},428)
        .call(
            function(){
                this._topLayer.removeChild(this._go);
                this._go = null;
                this._InitRole();
            }.bind(this));
    }

    /**
     * 添加金币计数
     */
    public AddGoldNum(){
        this._goldNum += 1;
        GameEvent.DispatchEvent(EventType.GameMoneyChange);
    }

    /**
     * 金币数量
     */
    public get GoldNum(): number{
        var gold: number = this._goldNum;
        return gold;
    }

    /**
     * 创建金币
     */
    private _CreateGold(map: Map, isFirstOne: boolean){
        if (map == null) return;
        var vertical: number = 45; // 竖直方向的金币距离
        var obliqueY: number = 36; // 斜方向的金币Y距离
        this._goldGroupNum = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        // map.GetRoad(0).initGold();
        for (var i = 0; i < map.RoadCount; i++){
            var road: Road = map.GetRoad(i);
            var roadPoint: egret.Point[] = road.MoveRoad;
            var roadType: number[] = road.RoadType;
            var roadGroup: number[] = road.GroupSet;
            var index: number = 0;
            if (isFirstOne) index += 1;
            var lastPoint: egret.Point = roadPoint[index];
            for (var j = index + 1; j < roadPoint.length - 1; j++){
                if (roadType[j - 1] == 2 || roadType[j - 1] == 4 || roadType[j - 1] == 6){
                    lastPoint = roadPoint[j];
                    continue;
                }
                if ((lastPoint.x == roadPoint[j].x && roadPoint[j].y - lastPoint.y >= vertical)
                    || (roadPoint[j].y - lastPoint.y >= obliqueY)) {
                        // 判断是否添加过金币了
                        if (roadGroup[j - 1] != 0){
                            var isBreak: boolean = false;
                            for (var k = roadGroup[j - 1]; k < this._goldGroupNum.length; k++){
                                if (this._goldGroupNum[k] == 1){
                                    isBreak = true;
                                    break;
                                }
                            }
                            if (isBreak) break;
                        }
                        // 添加金币
                        this._AddObject(map, road, lastPoint, roadPoint[j], roadGroup[j - 1]);
                }
                lastPoint = roadPoint[j];
            }
            this._goldGroupNum[road.GroupNum] = 1;
        }
        map.GoldSort();
    }

    /**
     * 添加物件
     */
    private _AddObject(map: Map, road: Road, lastPoint: egret.Point, nextPoint: egret.Point, groupNum: number){
        var probability: number = 0.4; // 物品出现概率
        var vertical: number = 33; // 竖直方向的物件距离
        var obliqueX: number = 29; // 斜方向的物件X距离，绝对值
        var obliqueY: number = 20; // 斜方向的物件Y距离
        var direction: number; // 方向0竖直，1向左，2向右
        if (Math.abs(lastPoint.x - nextPoint.x) <= Game.PianchaNum){
            direction = 0;
        }
        else if (lastPoint.x < nextPoint.x) {
            direction = 2;
        }
        else if (lastPoint.x > nextPoint.x){
            direction = 1;
        }

        let _lastItemPosiY = lastPoint.y;

        var point: egret.Point = new egret.Point();
        point.copyFrom(lastPoint);
        point.x += direction == 0? 0 : direction == 1? -14 : 14;
        point.y += 8;
        while(point.y <= (nextPoint.y - 10)){
            var random = Math.random();    //随机值
            if(random < probability){
                var check: Checkpoint = CheckpointManager.CurrentCheckpoint;
                var obj: ObjectBase;
                var objrandom = Math.random();    //随机值
                if(Math.abs(_lastItemPosiY - point.y) < 70){
                    objrandom = 1;
                }
                if(check != null && objrandom <= check.LuckyRate){
                    var luckychest: LuckyChest = ObjectPool.getPool("LuckyChest").borrowObject();
                    luckychest.Direction = direction;
                    obj = luckychest;
                    _lastItemPosiY = point.y;
                }
                else if(check != null && objrandom <= check.RandomRate + check.LuckyRate && objrandom > check.LuckyRate){
                    var randomchest: RandomChest = ObjectPool.getPool("RandomChest").borrowObject();
                    obj = randomchest;
                    _lastItemPosiY = point.y;
                }
                else if (check != null && objrandom <= check.LuckyRate + check.RandomRate + check.AirRate && objrandom > check.RandomRate + check.LuckyRate){
                    var airBox: AirBox = ObjectPool.getPool("AirBox").borrowObject();
                    obj = airBox;
                    _lastItemPosiY = point.y;
                }
                else if (check != null && objrandom <= check.LuckyRate + check.RandomRate + check.AirRate + check.BombRate && objrandom > check.LuckyRate + check.RandomRate + check.AirRate){
                    var bombBox: BombBox = ObjectPool.getPool("BombBox").borrowObject();
                    obj = bombBox;
                    _lastItemPosiY = point.y;
                }
                else{
                    var gold: Gold = ObjectPool.getPool("Gold").borrowObject();
                    obj = gold;
                }
                obj.x = point.x;
                obj.y = map.y + point.y;
                this._mapLayer.addChild(obj);
                road.AddObject(obj);
                if (groupNum != 0){
                    map.AddObject(obj, groupNum, road);
                }
            }
            point.x += direction == 0? 0 : direction == 1? -(obliqueX) : obliqueX;
            point.y += direction == 0? vertical : obliqueY;
        }
    }

    /**
     * 顶层
     */
    public get TopLayer(): egret.DisplayObjectContainer{
        return this._topLayer;
    }

    /**
     * 天气层级
     */
    public get WeatherLayer():egret.DisplayObjectContainer{
        return this._weatherLayer;
    }

    /**
     * 飞机动画播放
     */
    private _PaperairPlay(){
        // 已有飞机在飞行
        if (this._currentPaper != null) return;
        // 判断是否出现飞行（出现概率50%）
        if (Math.random() > 0.5) return;
        // 判断飞机龙骨是否创建完成
        if (this._paperairArm1 == null){
            // 创建飞机
            this._paperairArm1 = ArmaturePool.GetMovieArmature(MapManager.SceneJsonData["paperair"][0].res+"_json",MapManager.SceneJsonData["paperair"][0].res+"_png",MapManager.SceneJsonData["paperair"][0].res);
            this._paperairArm2 = ArmaturePool.GetMovieArmature(MapManager.SceneJsonData["paperair"][1].res+"_json",MapManager.SceneJsonData["paperair"][1].res+"_png",MapManager.SceneJsonData["paperair"][1].res);
        }
        if(this._currentPaper){
            ArmaturePool.ReturnMoviePool(this._currentPaper);
        }
        // 判断出现飞行的类型（两种飞机概率各位50%）
        if (Math.random() > 0.5){
            this._currentPaper = this._paperairArm1;
            this._paperName = MapManager.SceneJsonData["paperair"][0];//"peperair1";
        }
        else{
            this._currentPaper = this._paperairArm2;
            this._paperName = MapManager.SceneJsonData["paperair"][1];//"peperair2";
        }
        this._currentPaper.addEventListener(egret.Event.COMPLETE, this._PaperairComplete, this);
        this.addChild(this._currentPaper);
        this._currentPaper.play(1);
    }

    /**
     * 飞机播放完成
     */
    private _PaperairComplete(){
        if(this._currentPaper){
            ArmaturePool.ReturnMoviePool(this._currentPaper);
        }
        this._currentPaper = null;
    }

    /**
     * 是否胜利
     */
    public get IsWin(): boolean{
        return this._isWin;
    }

    /**
     * 过关星级
     */
    public get Star(): number{
        return this._starNum;
    }

    /**
     * 返回第一个角色的世界坐标点，用于扣血表现使用
     */
    public get FristRolePosition(): egret.Point{
        if (this._roleSet != null && this._roleSet.length > 0){
            var point: egret.Point = new egret.Point(this._roleSet[0].localToGlobal().x,
                                                    this._roleSet[0].localToGlobal().y);
            return point;
        }
        return null;
    }

    /**
	 * 判断是否超越好友
	 */
	public judgeIsChaoYueFriend(): boolean{
		let _curGameScore = Game.Instance.EndScore;

        // 测试超越
        // _curGameScore += 1000;

		let _score = 0;
		Game.Instance.EndRankNum = Game.Instance.LastRankNum;
		if(Game.Instance.playerInfo != null){ _score = Game.Instance.playerInfo["score"];}
		
		// 分数判断，取分数后面那一位好友
		if(_curGameScore > _score && Game.Instance.FriendSet.length >=1){
			for(let i=0; i<Game.Instance.FriendSet.length; i++){
				if(parseInt(Game.Instance.FriendSet[i][2]) <= _curGameScore){
					Game.Instance.chaoYueFriendInfo = Game.Instance.FriendSet[i];
					Game.Instance.EndRankNum = parseInt(Game.Instance.FriendSet[i][0]);
					break;
				}
			}
		}

		// 排名没有变动
		if(Game.Instance.EndRankNum >= Game.Instance.LastRankNum){
			return false;
		}else{
			return true;
		}
	}

    /**
     * 游戏结束
     */
    private _GameRealEnd(){
        Game.GameStatus = false;
        egret.clearTimeout(this._weathertime);
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this._moveLayer);
        egret.Tween.removeTweens(this._sceneLayer);
        for (var i = 0; i < this._roleSet.length; i++){
            egret.Tween.removeTweens(this._roleSet[i]);
        }
        for(var i = 0; i < this._roleSet.length; i++){
            this._roleSet[i].Stop();
        }
        var role: Role = WindowManager.GameUI().Role;
        var scorerate: number = role.ScoreRate;
        var moneyrate: number = role.MoneyRate;
        var bonusrate: number = role.BonusRate;
        var victoryaction: number = role.VictoryAction? 1 : 0;
        
        let _isChaoYue: number = 1;

        if (CheckpointManager.IsEndless){
            var data : JSON = JSON.parse("{}");
            data["token"] = UnitManager.Player.GameToken;
            NetManager.SendRequest(["func=" + NetNumber.GameEnd + "&start=1" + "&score=" + this.Score + "&money=" + this.GoldNum
                                        + "&oemInfo=" + JSON.stringify(data)],
                                        this._ReceiveEndlessGameEnd.bind(this));

        }else if (CheckpointManager.IsDailyActive){
            var data : JSON = JSON.parse("{}");
            data["token"] = UnitManager.Player.GameToken;
            NetManager.SendRequest(["func=" + NetNumber.GameEnd + "&start=1" + "&score=" + this.Score + "&money=" + this.GoldNum
                                        + "&oemInfo=" + JSON.stringify(data)],
                                        this._ReceiveEndlessGameEnd.bind(this));

            NetManager.SendRequest(["func=" + "dailyactivity.setScore" + "&id=" + this.Score]);

        }
        else if (CheckpointManager.IsCatch){
            NetManager.SendRequest(["func=" + NetNumber.EndCatch,
                                    "&id=" + CheckpointManager.CurrentCheckpointID,
                                     "&blood=" + role.CurrentLife],
                                        this._ReceiveCatchGameEnd.bind(this));
        }
        else if (CheckpointManager.IsRunaway){
            NetManager.SendRequest(["func=" + NetNumber.EscapeEnd,
                                    "&id=" + CheckpointManager.CurrentCheckpointID,
                                     "&blood=" + role.CurrentLife],
                                        this._ReceiveEscapeGameEnd.bind(this));
        }
        else {
            NetManager.SendRequest(["func=" + NetNumber.CheckpointEnd + "&id=" + CheckpointManager.CurrentCheckpointID,
                                    "&score=" + this.Score, "&blood=" + role.CurrentLife,
                                    "&money=" + this.GoldNum, "&scorerate=" + scorerate,
                                    "&moneyrate=" + moneyrate, "&bonusrate=" + bonusrate,
                                    "&victoryaction=" + victoryaction + "&super=" + _isChaoYue],
                                    this._ReceiveGameEnd.bind(this));
        }

        MapManager.IsUpdateMap = true;
        WindowManager.WaitPage().IsVisibled = true;
        egret.clearTimeout(this._weathertime);
        WeatherManager.Stop();
    }

    /**
     * 奴隶抓捕消息返回
     */
    private _ReceiveCatchGameEnd(jsonData: Object){
        WindowManager.GameUI().gameEnd();
        this._isreadygo = false;
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("奴隶抓捕战斗结束错误，code=" + jsonData["code"]);
            return;
        }
    }

    /**
     * 奴隶反抗消息返回
     */
    private _ReceiveEscapeGameEnd(jsonData: Object){
        WindowManager.GameUI().gameEnd();
        this._isreadygo = false;
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("奴隶反抗战斗结束错误，code=" + jsonData["code"]);
            return;
        }
    }

    /**
     * 无尽模式消息返回
     */
    private _ReceiveEndlessGameEnd(jsonData: Object){
        WindowManager.WaitPage().IsVisibled = false;
        var data: Object = jsonData["data"];
        UnitManager.Player.Money = data["money"];
        this._isWin = false;
        this._endScore = this.Score;
        if (this._endScore < this._endlessScoreSet[0]){
            this._endlessDieCount += 1;
            if (this._endlessDieCount >= 3){
                this._endlessStartDifficulty = Math.max(this._endlessStartDifficulty - 1, 1);
            }
        }
        WindowManager.GameUI().gameEnd();
        this._isreadygo = false;
        if (WindowManager.SuccFailWindow() == null){
            WindowManager.SetWindowFunction(this._OpenSuccFailWindow.bind(this),[false, [{"type":"M", "num":this._goldNum}], null]);
            return;
        }
        WindowManager.SuccFailWindow().onShow(false, [{"type":"M", "num":this._goldNum}], null);
    }

    /**
     * 接收游戏结束消息
     */
    private _ReceiveGameEnd(jsondata: Object){
        Game.IsShowTopTip = false;
        WindowManager.WaitPage().IsVisibled = false;
        var isCodeTrue: boolean = true;
        if (jsondata["code"] != NetManager.SuccessCode){
            Main.AddDebug("返回出错:" + jsondata["code"]);
            isCodeTrue = false;
        }
        var role: Role = WindowManager.GameUI().Role;
        var check: Checkpoint = CheckpointManager.CurrentCheckpoint;
        var score: number = 0;
        var maxScore: number = check.MaxScore;
        var star: number = 0;
        var maxStar: number = check.Star;
        var isFrist: boolean = maxStar == 0;
        var bonus: Object[] = null;
        if (isCodeTrue){
            var data: Object = jsondata["data"];
            if (data != null){
                var score: number = data["score"];
                var maxScore: number = data["scoreM"];
                var star: number = data["star"];
                var maxStar: number = data["starM"];
                var bonus: Object[] = data["bonus"];
                var firstBonus: Object[] = [];
                if (data["firstBonus"] != null){
                    firstBonus = data["firstBonus"];
                }

                var superBonus: Object[] = [];
                if(data["superBonus"] != null)
                    superBonus = data["superBonus"];

                bonus = bonus.concat(firstBonus);
                this._isWin = role.CurrentLife > 0;
                this._starNum = star;
                this._endScore = score;
                if (score > UnitManager.Player.MaxScore){
                    UnitManager.Player.MaxScore = score;
                }
            }
        }
        else{
            this._isWin = false;
            isFrist = false;
            this._starNum = 0;
            this._endScore = 0;
        }
        this._isFrist = isFrist;
        check.IsPass = maxStar > 0;
        check.Star = maxStar;
        // 倒计时结束的时候 清空ui上的倒计时
        WindowManager.GameUI().gameEnd();
        this._isreadygo = false;

        if(Game.Instance.IsWin){
            CheckpointManager.PassCheckpoint(check.ID);
            if (WindowManager.SuccFailWindow() == null){
                WindowManager.SetWindowFunction(this._OpenSuccFailWindow.bind(this),[true, bonus, superBonus]);
                return;
            }
            WindowManager.SuccFailWindow().onShow(true, bonus, superBonus);
        }else{
            if (WindowManager.SuccFailWindow() == null){
                WindowManager.SetWindowFunction(this._OpenSuccFailWindow.bind(this),[false, bonus, superBonus]);
                return;
            }
            WindowManager.SuccFailWindow().onShow(false, bonus, superBonus);
        }
    }

    /**
     * 显示闯关结果界面
     */
    private _OpenSuccFailWindow(data){
        WindowManager.SuccFailWindow().onShow(data[0], data[1], data[2]);
    }

    /**
     * 显示结算界面
     */
    private _OpenEndWindow(bonus: Object[]){
        WindowManager.EndWindow().Show(bonus);
    }

    /**
     * 随机道具（1:回复,2:纸飞机,4:护盾,5:分身,6:佐助持续抵挡伤害,7:小樱持续恢复）
     */
    public ChangeRoleStatus(status: number, param: any = null){
        if (status == 1){
            this._roleSet[0].ChangeStatus(1, param);
        }
        else if (status == 2){
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].ChangeStatus(2);
            }
        }else if (status == 4){
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].creatSkillAni(1);
            }
        }else if (status == 5){
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].creatSkillAni(2,param);
            }
        }
        else if (status == 6){
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].creatSkillAni(3);
            }
        }
        else if (status == 7){
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].creatSkillAni(4, param);
            }
        }
        if (status == 5 || status == 6 || status == 7){
            var quanpingAniName: string = ""
            if(status == 5){
                quanpingAniName = "mingrenquanpingji";
            }else if(status == 6){
                quanpingAniName = "zuozhuquanpingji";
            }else if(status == 7){
                quanpingAniName = "xiaoyinquanpingji";
            }

            // 创建全屏动画
            if(quanpingAniName != ""){
                Game.Instance.Pause();
                this._isQuanPingSkillAni = true;
                this._quanpingSkill = ArmaturePool.GetArmature(quanpingAniName + "_json",quanpingAniName + "texture_json",
                                            quanpingAniName + "texture_png", quanpingAniName);
                WindowManager.GameUI().addChild(this._quanpingSkill.display); 
                this._quanpingSkill.display.x = 640/2;
                this._quanpingSkill.display.y = 1136/2;
                this._quanpingSkill.display.visible = true;
                this._quanpingSkill.animation.play(quanpingAniName,1);
                this._quanpingSkill.addEventListener(dragonBones.Event.COMPLETE, this.skillTimeOut, this);
            }else{
                this.skillTimeOut();
            }
        }
    }

    /**
     * 主动技能持续时间
     */
    private skillTimeOut(){
        // 清空全屏主动技能全屏动画
        if(this._quanpingSkill != null){
            ArmaturePool.ReturnPool(this._quanpingSkill);
            this._quanpingSkill = null;
        }

        // 继续游戏
        if(this._isQuanPingSkillAni == true){
            Game.Instance.Continue();
            this._isQuanPingSkillAni = false;
        }

        // 设置主动技能持续时间
        // let time: number = 5000;
        // this._skillTimeOut = egret.setTimeout(this.clearSkillAni,this,time);
    }

    /**
     * 分身个数
     */
    public get FenShenCount(): number{
        if (this._roleSet == null && this._roleSet.length == 0) return 0;
        return this._roleSet[1].FenShenCount;
    }

    /**
     * 是否首次胜利
     */
    public get IsFrist(): boolean{
        return this._isFrist;
    }

    /**
     * 接收好友排行榜消息。获取开始前玩家在好友排行榜中的排名
     */
    private _ReceiveFriendRank(jsonData: Object){
        this._friendRankSet2 = [];
        var data: Object = jsonData["data"]["list"];
        
        if(data != null && data["length"] > 0)
        {
            for (var i = 0; i < data["length"]; i++){
                var rank: string = (i + 1).toString();
                var name: string = decodeURIComponent(data[i]["name"]);
                var score: string = data[i]["score"];
                var imaUrl: string = data[i]["icon"];
                let opendid: string = data[i]["openid"];
                this._friendRankSet2.push([rank, name, score, imaUrl, opendid]);

                if(data[i]["openid"] == UnitManager.PlayerID){
                    this._playerRankInfo = data[i];
                    this._lastRankNum = i+1;
                }
            }
        }
    }

    /**
     * 获取好友列表
     */
    public get FriendSet(){
        return this._friendRankSet2;
    }

    /**
     * 获取玩家当前信息
     */
    public get playerInfo(){
        return this._playerRankInfo;
    }

    /**
     * 获取玩家之前排名
     */
    public get LastRankNum(){
        return this._lastRankNum;
    }

    /**
     * 获取玩家游戏结束后排名
     */
    public get EndRankNum(){
        return this._endRankNum;
    }

    /**
     * 设置玩家游戏结束后排名
     */
    public set EndRankNum($rankNum: number){
        this._endRankNum = $rankNum;
    }

    /**
     * 获取玩家超越好友信息
     */
    public get chaoYueFriendInfo(){
        return this._friendRankInfo;
    }

    /**
     * 设置玩家超越好友信息
     */
    public set chaoYueFriendInfo($info: string[]){
        this._friendRankInfo = $info;
    }/**
     * 清除所有技能效果
     */
    public clearSkillAni(){
        for (var i = 0; i < this._roleSet.length; i++){
            this._roleSet[i].clearSkillAni();
        }
    }

    /**
     * 清除单个技能效果
     */
    public clearOneSkillAni(){
        for (var i = 0; i < this._roleSet.length; i++){
            this._roleSet[i].clearOneSkillAni();
        }
    }

    /**
     * 暂停
     */
    public Pause(){
        this._isGamePause = true;
        egret.Tween.pauseTweens(this);
        if (this._roleSet != null){
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].Pause();
            }
        }
    }

    /**
     * 继续
     */
    public Continue(){
        this._isGamePause = false;
        egret.Tween.resumeTweens(this);
        if (this._roleSet != null){
            for (var i = 0; i < this._roleSet.length; i++){
                this._roleSet[i].Continue();
            }
        }
    }

    /**
     * 游戏是否暂停
     */
    public get IsGamePause(): boolean{
        return this._isGamePause;
    }


    // 变量
    private static _instance: Game;                             // 游戏本体
    private _bg: eui.Image;                                     // 背景
    private _top: eui.Image;                                    // 顶层渐变
    private _sceneLayer: egret.DisplayObjectContainer;          // 场景层
    private _moveLayer: egret.DisplayObjectContainer;           // 移动层
    private _mapLayer: egret.DisplayObjectContainer;            // 地图层
    private _roleLayer: egret.DisplayObjectContainer;           // 角色层
    private _topLayer: egret.DisplayObjectContainer;            // 顶层
    private _weatherLayer: egret.DisplayObjectContainer;        // 天气粒子层
    private _mapSet: Map[];                                     // 地图集合
    private _roleSet: GameRole[] = [];                          // 角色集合
    private _friroleSet: GameRole[];                            // 好友角色集合
    private _sceneSet: Scene[];                                 // 场景集合
    private _timer: number;                                     // 计时器
    private _jumpDis: number = 0;                               // 跳转距离
    private _doorLayer: egret.DisplayObjectContainer;           // 入门的层级
    private _outDoorLayer: egret.DisplayObjectContainer;        // 出门的层级
    private _scoreNum: number = 0;                              // 分数
    private _goldNum: number;                                   // 金币数目
    
    private _paperairArm1: egret.MovieClip;                // 飞机龙骨1
    private _paperairArm2: egret.MovieClip;                // 飞机龙骨2
    private _currentPaper: egret.MovieClip;                // 当前飞机

    private _paperName: string;                                 // 当前飞机动画
    private _updataTimer: number = 0;                           // 定时更新时间
    private _daojishiArm: dragonBones.Armature;                 // 倒计时龙骨
    private _goldGroupNum: number[];                            // 金币创建组（判断该组金币是否创建）
    private _isWin: boolean = false;                            // 是否胜利
    private _starNum: number = 0;                               // 星级
    private _endScore: number = 0;                              // 最终分数
    private _isRoleLifeEmpty: boolean = false;                  // 是否执行血量为0操作
    private _isFrist: boolean = false;                          // 是否首次胜利
    private _endlessDifficulty: number = 3;                     // 无尽模式难度
    private _endlessDieCount: number = 0;                       // 无尽模式400分一下死亡次数
    private _endlessStartDifficulty: number = 3;                // 无尽模式开始难度
    private _endlessScoreSet: number[] = [400, 900, 1600, 2500,
                                          3600, 4900, 6300];    // 无尽模式难度改变分数
    private _endlessDifSet: number[] = [4, 5, 6, 7, 8, 9, 10];  // 无尽对应分数难度

    private _friendBg: eui.Image;                               // 好友背景
    private _friendScore: FriendGameScore;                      // 好友分数信息
    private _moveFriendArr: FriendGameScore[] = [];             // 下落的好友
    private _linpao: FriendGameScore[] = [];                    // 领跑好友头像、分数信息
    
    private _friendRankSet: string[][] = [];                    // 好友排行信息
    private _roadFriendIcon: RoadFriendIcon;                    // 道路上的好友头像
    private _weathertime:any                                    // 天气时间
    private _weather: WeatherManager;                           // 天气粒子

    private _isreadygo: boolean = false;                        // 是否readygo初始为false 开始后为true
    private _ready: eui.Image;                                  // ready图片
    private _go: eui.Image;                                     // go图片
    private _lin: boolean

    private _friendRankSet2: string[][] = [];                   // 好友排行信息
    private _playerRankInfo: string;                            // 玩家排名信息
    private _friendRankInfo: string[];                            // 超越的好友的玩家排名信息
    private _lastRankNum: number = 0;                           // 之前的排名
    private _endRankNum: number = 0;                            // 最后的排名

    private _jiaoChengPage: eui.Image;                          // 教程界面

    public static _isInitArm: boolean = false;                        // 动画是否加载完成
    public static _isInitMap: boolean = false;                        // 地图是否创建完成
    public static _isStarReturn: boolean = false;                     // 游戏开始是否返回

    private _lastItemPosiY: number = 0;                               // 距离上一个道具的距离

    private _isQuanPingSkillAni: boolean = false;               // 是否处于主动技能中
    private _quanpingSkill: dragonBones.Armature = null         // 主动技能

    private _xueTimes: number = 0;                              // 下雪扣血次数统计
    private _isGamePause: boolean = false;                      // 游戏是否暂停
    
}