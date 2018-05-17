/**
 * 角色
 */
class GameRole extends egret.DisplayObjectContainer{
    /**
     * 角色能否二段跳
     */
    public static RoleCanJump: boolean = true;

    /**
     * 角色是否死亡
     */
    public static RoleIsDie: boolean = false;

    /**
     * 最后一个角色
     */
    public static LastRole: GameRole;

    /**
     * 是否是侧面
     */
    public static IsDirect: boolean = true;

    /**
     * 是否是好友角色
     */
    public static IsFriend: boolean = false;

    /**
     * 角色ID
     */
    public static GameRoleID: number = 100000;
   
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this._id = GameRole.GameRoleID += 1;
    }

    /**
     * 初始化
     */
    public CreateRole(roleRes: string = ""){
        var res: string = roleRes == ""? UnitManager.CurrentRole.Res : roleRes; 
        // 正面
        this._jxdArm = ArmaturePool.GetArmature(res + "_01_json", res + "_01texture_json",
                                                        res + "_01texture_png", res + "_01");
        this._jxdDis = this._jxdArm.display;
        this._jxdDis. x = 0;
        this._jxdDis. y = 0;
        // 侧面
        this._jxdSizeArm = ArmaturePool.GetArmature(res + "_02_json", res + "_02texture_json",
                                                            res + "_02texture_png", res + "_02");
        this._jxdSizeDis = this._jxdSizeArm.display;
        this._jxdSizeDis. x = 0;
        this._jxdSizeDis. y = 0;
        this._PlayMovie("walk", 0);
        // 添加到界面
        this.addChild(this._jxdDis);
        this.addChild(this._jxdSizeDis);
        this._change = false;
        this._isRevive = false;
        this._canJump = true;
        this._isFly = false;
        this._prop = null;
    }
    
    /**
     * 更新角色方向
     */
    private _UpdataRole(starX: number, endX: number){
        this._roleStarX = starX;
        this._roleEndX = endX;
        if (Math.abs(starX - endX) <= Game.PianchaNum){
            if (!this._isFly){
                if(this._prop != null)this._prop.display.visible = false;
                this._jxdDis.visible = true;
                this._jxdSizeDis.visible = false;
            }
            else{
                this._jxdDis.visible = false;
                this._jxdSizeDis.visible = false;
                if(this._prop){
                    this._prop.animation.play("chupeng",0);
                    this._prop.display.scaleX = 1;
                }
            }
            this._direction = 0;
            if (this._mapMoveMark) GameRole.IsDirect = true;
        }
        else if (starX < endX) {
            this._jxdSizeDis.scaleX = 1;
            if (!this._isFly){
                if(this._prop != null)this._prop.display.visible = false;
                this._jxdDis.visible = false;
                this._jxdSizeDis.visible = true;
            }
            else{
                this._jxdDis.visible = false;
                this._jxdSizeDis.visible = false;
                if(this._prop){
                    this._prop.animation.play("chupeng1",0);
                    this._prop.display.scaleX = 1;
                }
            }
            this._direction = 2;
            if (this._mapMoveMark) GameRole.IsDirect = false;
        }
        else if (starX > endX){
            this._jxdSizeDis.scaleX = -1;
            if (!this._isFly){
                if(this._prop != null)this._prop.display.visible = false;
                this._jxdDis.visible = false;
                this._jxdSizeDis.visible = true;
            }
            else{
                this._jxdDis.visible = false;
                this._jxdSizeDis.visible = false;
                if(this._prop){
                    this._prop.animation.play("chupeng1",0);
                    this._prop.display.scaleX = -1;
                }
                    
            }
            this._direction = 1;
            if (this._mapMoveMark) GameRole.IsDirect = false;
        }

        // 根据方向显示技能方向
        if(this._skillAniZhenSet.length > 0){
            for(let i= this._skillAniZhenSet.length - 1; i>=0;i--){
                this._skillAniZhenSet[i].display.visible = this._jxdDis.visible;
            }
        }
        if(this._skillAniCeSet.length > 0){
            for(let i=this._skillAniCeSet.length - 1; i>=0;i--){
                this._skillAniCeSet[i].display.visible = this._jxdSizeDis.visible;
                this._skillAniCeSet[i].display.scaleX = this._jxdSizeDis.scaleX;
            }
        }
    }

    /**
     * 设置移动道路
     */
    public set Road(road: Road){
        this._road = road;
        this._moveRoad = road.MoveRoad;
        this._roadTypeSet = road.RoadType;
        this._doorTypeSet = road.DoorTypeSet;
    }

    /**
     * 设置移动道路
     */
    public get Road(): Road{
        return this._road;
    }

    /**
     * 当前移动点集合
     */
    public get MoveRoad(): egret.Point[]{
        return this._moveRoad;
    }

    /**
     * 当前所在地图
     */
    public set Map(map: Map){
        this._map = map;
    }

    /**
     * 当前所在地图
     */
    public get Map(): Map{
        return this._map;
    }

    /**
     * 路径关键点类型
     */
    public Move(){
        if (this._moveIndex < 0) this._moveIndex = 0;
        var startPoint: egret.Point = new egret.Point(this.x, this.y);
        if (this._moveIndex >= this._moveRoad.length){
            if (GameRole.IsFriend){
                var reelEnd: egret.Point = new egret.Point(startPoint.x, 1136 + 80); // 世界中的坐标点
                var moveDis = Math.sqrt(Math.pow(reelEnd.y - startPoint.y, 2) + Math.pow(reelEnd.x - startPoint.x, 2));
                var speed: number = this._friSpeed;
                var moveTime = moveDis / speed * 1000;
                var tw = egret.Tween.get(this);
                this._jxdDis.visible = true;
                this._jxdSizeDis.visible = false;
                tw.to({x: reelEnd.x, y: reelEnd.y}, moveTime);
            }
            return;// 后面没有地图了停止
        }
        var endPoint: egret.Point = this._moveRoad[this._moveIndex];// 地图上的坐标点
        var reelEnd: egret.Point = new egret.Point(endPoint.x, endPoint.y + this._map.y); // 世界中的坐标点
        if (this._isRevive && reelEnd.y <= startPoint.y){
            this._isRevive = false;
            this._moveIndex += 1;
            this.Move();
            return;
        }
        this._isRevive = false;
        this._UpdataRole(startPoint.x, endPoint.x);
        var type: number = this._roadTypeSet[this._moveIndex];
        var doorType: number = this._doorTypeSet[this._moveIndex];
        if (this._currentRoadType != 1){
            // 判断结束
            if (this._currentRoadType == 2 && this._CheckEnd(true))
            {
                Game.Instance.UpdataRoleMoveMark();
                return; // 道路边界判断
            }
            else if(this._currentRoadType == 2 && GameRole.IsFriend){
                if(Math.sqrt(Math.pow(reelEnd.y - startPoint.y, 2) + Math.pow(reelEnd.x - startPoint.x, 2))>80){
                    this._PlayMovie("jump_01", 1);
                    this._friStatus = 1;
                    egret.setTimeout(()=>{
                        this._PlayMovie("jump_03", 1);
                    },this,150); 
                    egret.setTimeout(()=>{
                        this._PlayMovie("jump_02", 1);
                    },this,500); 
                    egret.setTimeout(()=>{
                        this._friStatus = 0;
                        this._PlayMovie("walk", 0);
                    },this,700); 
                }
                else{
                    this._PlayMovie("jump_01", 1);
                    this._friStatus = 1;
                    egret.setTimeout(()=>{
                        this._PlayMovie("jump_05", 1);
                    },this,150); 
                    egret.setTimeout(()=>{
                        this._PlayMovie("jump_02", 1);
                    },this,400); 
                    egret.setTimeout(()=>{
                        this._friStatus = 0;
                        this._PlayMovie("walk", 0);
                    },this,500); 
                }
            }
            else if (this._currentRoadType == 2){
                UnitManager.CurrentRole.JumpAction();
                this._isPassHole = true;
                
            }
            // 进入门
            if (this._currentRoadType == 4){                    
                Game.Instance.JumpDis = reelEnd.y - this.y;
                this._map.EnterDoorOpen(doorType); 
                Game.RoleStatus = 0;
                this._isJump = false;
                this._currentRoadType = type;
                Game.Instance.CreateRole(doorType);
                this.x = reelEnd.x;
                this.y = reelEnd.y;
                this._moveIndex += 1;
                this._PlayMovie("walk", 0);
                this.Move();
                return;
            }
            // 到达汇合点
            if (this._currentRoadType == 6){         
                if (Game.Instance.RoleConfluence(this, this._currentRoadType)){
                    Game.Instance.JumpDis = 3;
                    return;
                }
            }
        }
        if (this._isDie) return;
        this._currentRoadType = type;
        var moveDis = Math.sqrt(Math.pow(reelEnd.y - startPoint.y, 2) + Math.pow(reelEnd.x - startPoint.x, 2));
        if(!GameRole.IsFriend)var speed: number = Game.MoveSpeed * (this._direction == 0? 1 : 0.8333333);
        else {
            if(this._friStatus != 0) var speed: number = (this._friSpeed - 100) * (this._direction == 0? 1 : 0.8333333);
            else var speed: number = this._friSpeed * (this._direction == 0? 1 : 0.8333333);
        }
        var moveTime = moveDis / speed * 1000;
        var tw = egret.Tween.get(this);
        tw.to({x: reelEnd.x, y: reelEnd.y}, moveTime).call(this.Move);
        if (this._mapMoveMark)
        {
            this._CheckMapMove(reelEnd.y - startPoint.y, moveTime);
        }
        this._moveIndex += 1;
        if (this._moveIndex >= this._moveRoad.length){
            if (!GameRole.IsFriend && Game.Instance.RoleUpdataMap(this, this._map)){
                this._moveIndex = 0;
            }
        }
    }

    /**
     * 检测背景是否移动
     */
    private _CheckMapMove(moveDis: number, time: number){
        if (this.parent == null) return;
        var parent = this.parent.parent;
        if (this.y + parent.y >= Game.RoleYLimit){
            moveDis += (this.y + parent.y - Game.RoleYLimit);
            Game.Instance.MapMove(moveDis, time);
        }
    }

    /**         
     * 判断是否结束
     */
    private _CheckEnd(isMoveEnd: boolean): boolean{
        if (this._reviveTime > 0) return false;
        var isEnd: boolean = false;
        if(this._isFly) return false;
        if (isMoveEnd && this._currentRoadType == 2 && Game.RoleStatus == 0){
            isEnd = Game.Instance.CheckGameEnd(this);
        }
        else if (!isMoveEnd && this._currentRoadType == 3 && Game.RoleStatus == 0){
            isEnd = Game.Instance.CheckGameEnd(this);
        }
        return isEnd;  
            
    }

    /**
     * 角色跳跃
     */
    public RoleJump(){
        if (!this._canJump) return;
        this._RemoveRoleEvent();

        this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._OnSmallJumpEnd, this);
        this._PlayMovie("jump_01", 1);
        SoundManager.PlayMusic(UnitManager.CurrentRole.SmallJumpMusic);
        this._isJump = true;
        Game.RoleStatus = 1;
    }

    /**
     * 角色小跳跃结束回调
     */
    private _OnSmallJumpEnd(){
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnSmallJumpEnd, this);

        if (Game.RoleStatus == 2){
            this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._OnJumpEnd, this);
            this._PlayMovie("jump_03", 1);
            SoundManager.PlayMusic(UnitManager.CurrentRole.BigJumpMusic);
        }
        else if(Game.RoleStatus == 0){
            GameRole.RoleCanJump = true;
            this._isJump = false;
            this._PlayMovie("walk", 0);
            this._CheckEnd(false);
        }
        else{
            this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._OnSamllJumpHalfEnd, this);
            this._PlayMovie("jump_05", 1);
        }
    }

    /**
     * 停止
     */
    public Stop(){
        this._jxdArm.animation.stop();
        this._jxdSizeArm.animation.stop();
        this._RemoveRoleEvent();
    }

    /**
     * 移除监听事件
     */
    private _RemoveRoleEvent(){
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnJumpEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnSmallJumpEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnSamllJumpHalfEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnReviveEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this.Revive, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnMergeEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._GameEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._DieEnd, this);
    }

    /**
     * 角色小跳跃下降一半结束
     */
    private _OnSamllJumpHalfEnd(event: dragonBones.Event){
        GameRole.RoleCanJump = false;

        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnSamllJumpHalfEnd, this);

        if (Game.RoleStatus == 2){
            this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._OnJumpEnd, this);
            this._PlayMovie("jump_06", 1);
            SoundManager.PlayMusic(UnitManager.CurrentRole.BigJumpMusic);
        }
        else if(Game.RoleStatus == 0){
            GameRole.RoleCanJump = true;
            this._isJump = false;
            this._PlayMovie("walk", 0);
            this._CheckEnd(false);
        }
        else{
            this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._OnJumpEnd, this);
            this._PlayMovie("jump_02", 1);
        }
    }

    /**
     * 跳跃结束
     */
    private _OnJumpEnd(event: dragonBones.Event){
        GameRole.RoleCanJump = true;
        if (this._isPassHole && !this._isFly){
            if (Game.RoleStatus == 1){
                WindowManager.GameUI().Energy += GameConstData.EnergySmall;
            }
            else if (Game.RoleStatus == 2){
                WindowManager.GameUI().Energy += GameConstData.EnergyBig;
            }
        }
        this._isPassHole = false;
        Game.RoleStatus = 0;
        this._isJump = false;
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnJumpEnd, this);
        this._PlayMovie("walk", 0);
        this._CheckEnd(false);
    }

    /**
     * 死亡
     * @param isLast        // 是否是最后一个
     * @param canRevival    // 能否复活
     * @param revivalTime   // 复活时间
     */
    public Die(isLast: boolean = false, canRevival: boolean = false, revivalTime: number = 5000){
        if (this._isFly){
            this.Move();
            return;
        } 
        this._isPassHole = false;
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnJumpEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnSmallJumpEnd, this);
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnSamllJumpHalfEnd, this);
        this._isDie = true;
        this._canJump = false;
        this._wudiTime = revivalTime;
        egret.Tween.removeTweens(this);
        if (isLast && !canRevival){
            if (this._isFly){
                this._isFly = false;
                this._UpdataRole(this._roleStarX, this._roleEndX);
                if (this._prop != null){
                    ArmaturePool.ReturnPool(this._prop);
                    this._prop = null;
                }
            }
            Game.GameStatus = false;
            this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._GameEnd, this);
            GameRole.RoleIsDie = true;
            Game.Instance.ChangeSize(this.localToGlobal(), true);
            this._PlayMovie("die1", 1);
            SoundManager.PlayMusic(UnitManager.CurrentRole.DieMusic);
        }
        else if (canRevival){
            Game.GameStatus = false;
            this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this.Revive, this);
            GameRole.RoleIsDie = true;
            this._PlayMovie("die2", 1);
            SoundManager.PlayMusic(UnitManager.CurrentRole.DieMusic);
        }
        else {
            this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._DieEnd, this);
            this._PlayMovie("die2", 1);
        }
    }

    /**
     * 死亡结束
     */
    private _DieEnd(){
        this.Destroy();
        GameRole.RoleIsDie = false;
    }

    /**
     * 游戏结束
     */
    private _GameEnd(){
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._GameEnd, this);
        GameRole.RoleIsDie = false;
        GameRole.LastRole = this;
        var tw = egret.Tween.get(this);
        tw.wait(800).call(this._GameRealEnd, this);
    }

    /**
     * 游戏正式结束
     */
    private _GameRealEnd(){
        egret.Tween.removeTweens(this);
        UnitManager.CurrentRole.DeadAction();
        if (!CheckpointManager.IsEndless && !CheckpointManager.IsDailyActive && UnitManager.CurrentRole.CurrentLife > 0) return;
        WindowManager.ReviveWindow().IsVisibled = true;
    }

    /**
     * 销毁资源
     */
    public Destroy(){
        this._isDestroy = true;
        this._RemoveRoleEvent();
        egret.Tween.removeTweens(this);
        ArmaturePool.ReturnPool(this._jxdArm);
        ArmaturePool.ReturnPool(this._jxdSizeArm);
        if (this.parent != null){
            this.parent.removeChild(this);
        }
    }

    /**
     * 消失
     */
    public Disappear(){
        this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._OnMergeEnd, this);
        var movieName: string = this._isJump? "merge2" : "merge1";
        this._PlayMovie(movieName, 1);
    }

    /**
     * 消失结束
     */
    private _OnMergeEnd(){
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnMergeEnd, this);
        this.Destroy();
    }

    /**
     * 地图移动标记
     */
    public set MapMoveMark(value: boolean){
        this._mapMoveMark = value;
    }

    /**
     * 播放角色动画
     * @param name  动画名字
     * @param time  次数,0为循环播放
     */
    public _PlayMovie(name: string, time: number){
        if (this._isDestroy){
            Main.AddDebug("资源已销毁");
            return;
        }
        this._jxdArm.animation.play(name, time);
        this._jxdSizeArm.animation.play(name, time);

        if(this._skillAniZhenSet.length>0){
            for(let i=this._skillAniZhenSet.length-1; i>=0; i--){
                this._skillAniZhenSet[i].animation.play(name, time);
            }
        }
        if(this._skillAniCeSet.length>0){
            for(let i=this._skillAniCeSet.length-1; i>=0; i--){
                this._skillAniCeSet[i].animation.play(name, time);
            }
        }
        if (this._reviveMovie != null){
            this._reviveMovie.animation.play(name, time);
        }
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    public Process(frameTime: number){
        if(GameRole.IsFriend){
            return;
        }
        // 判断金币获得
        var objectSet: ObjectBase[] = this._road.ObjectSet;
        if (objectSet != null && objectSet.length > 0){
            for (var j = 0; j < objectSet.length; j++){

                var object: ObjectBase = objectSet[j];
                if ( (this.y - object.y) >= 0 && (this.y - object.y) < 15 && Math.abs(this.x - object.x) < 15 && Game.RoleStatus ==0 && !this._isFly){
                    object.Trigger(this);
                    this._road.SpliceObject(j);
                    break;
                }
                else if (object.y > this.y) break;
            }
        }
        if (this._reviveTime > 0){
            this._reviveTime -= frameTime;
            if (this._reviveTime <= 0){
                this.removeChild(this._reviveMovie.display);
                this._reviveMovie.animation.stop();
                egret.Tween.removeTweens(this._reviveMovie.display);
                ArmaturePool.ReturnPool(this._reviveMovie);
                this._reviveMovie = null;
            }
            else if (this._reviveTime <= 2000){
                var tw = egret.Tween.get(this._reviveMovie.display, {"loop":true});
                tw.to({alpha: 0}, 200).to({alpha: 1}, 200);
            }
        }

    }
    
    /**
     * 随机道具（0:随机,1:回复,2:纸飞机,3:炸弹,4:护盾）
     */
    public ChangeStatus(value:number = 0, blood: number = 0){
        if (this._isDie){
            if (value == 2) this._changeType = value;
            return;
        }
        this._changeType = -1;
        // 确定当前状态
        if(value == 0){
            var probability = Math.random();
            if(probability <= 0.4) value = 2;
            else if(probability >0.4 && probability <= 0.8) value = 1;
            else value = 3;
        }
        this._role = WindowManager.GameUI().Role;
        // 判断触发血量
        var difficulty: number = CheckpointManager.CurrentCheckpoint == null? 1 : CheckpointManager.CurrentCheckpoint.Difficulty;
        var point: egret.Point = new egret.Point(this.localToGlobal().x, this.localToGlobal().y);  
        // 血量恢复
        if(value == 1){
            var realBlood: number = -(0.1 * this._role.MaxLife + 100 * difficulty) * (1 - this._role.InjuryFreeRate);
            if (blood != 0){
                realBlood = blood;
            }
            WindowManager.GameUI().BuckleBlood(realBlood, point); 
        }
        // 炸弹
        else if(value == 3) {
            if(this._reviveMovie == null){
                WindowManager.GameUI().BuckleBlood(500 * (1 - this._role.RealLucky) * difficulty * (1 - this._role.InjuryFreeRate),point);                
            }
        }
        if (this._change) return;
        // 动画表现
        var time:number = 0;
        var prop = null;
        // 纸飞机
        if(value == 2){
            prop = ArmaturePool.GetArmature("jixiaode_zhifeiji_json","jixiaode_zhifeijitexture_json",
                                                "jixiaode_zhifeijitexture_png","jixiaode_zhifeiji");
            this._isFly = true;
            this._UpdataRole(this._roleStarX, this._roleEndX); 
            time = 3500;
        }
        // 血量恢复
        else if(value == 1){
            prop = ArmaturePool.GetArmature("jixiaode_buxue_json","jixiaode_buxuetexture_json",
                                                "jixiaode_buxuetexture_png","jixiaode_buxue");
            time = 600;     
        }
        // 护盾
        else if(value == 4){
            prop = ArmaturePool.GetArmature("hudun_json","huduntexture_json",
                                                "huduntexture_png","hudun");
            time = 5000;
        }
        // 炸弹
        else{
            prop = ArmaturePool.GetArmature("jixiaode_zhadan_json","jixiaode_zhadantexture_json",
                                                "jixiaode_zhadantexture_png","jixiaode_zhadan");
            time = 600;     
        }
        if (prop == null) return;
        this._prop = prop;
        this._change = true;
        this.addChild(prop.display); 
        prop.display.x = 0;
        prop.display.y = 0;
        prop.display.visible = true;
        prop.animation.play("huode",1);                                                                                                                                                        
        this._huoDeTimeOut = egret.setTimeout(()=>{
            this._prop.animation.stop(); 
            if(value == 2) this._UpdataRole(this._roleStarX,this._roleEndX);
            else{
                this._prop.animation.play("chupeng",1);
            }
            this._chupengTimeOut = egret.setTimeout(()=>{
                this._isFly = false;
                this._change = false;
                if (this._prop != null){
                    this.removeChild(this._prop.display);
                }
                if (value == 2){
                    this.ReviveTime = 1500;                                       
                }
                this._UpdataRole(this._roleStarX, this._roleEndX); 
                ArmaturePool.ReturnPool(this._prop);
                this._prop = null;         
                egret.clearTimeout(this._huoDeTimeOut);
                egret.clearTimeout(this._chupengTimeOut);                              
            },this,time);
        },this,150);
    }

    /**
     * 创建技能效果（1:护盾,2:分身,3:佐助,4:小樱; num:护盾数量）
     */
    public creatSkillAni(value:number = 0,num:number = 1){
        this._role = WindowManager.GameUI().Role;
        let zhenResName = ""; // 正面
        let ceResName = ""; // 侧面
        this.clearSkillAni();
        if(value == 1){
            zhenResName = ceResName = "hudun";
        }
        else if(value == 2){
            zhenResName = "mingrenyfs_01";
            ceResName = "mingrenyfs_02";
        }else if(value == 3){
            zhenResName = "zuozhuxz_01";
            ceResName = "zuozhuxz_02";
        }else if(value == 4){
            zhenResName = "xiaoyingzy_01";
            ceResName = "xiaoyingzy_02";
        }
        
        for(let i=0; i<num; i++){
            let skill1 = ArmaturePool.GetArmature(zhenResName + "_json",zhenResName + "texture_json",
                                            zhenResName + "texture_png",zhenResName);
            let skill2 = ArmaturePool.GetArmature(ceResName + "_json",ceResName + "texture_json",
                                            ceResName + "texture_png",ceResName);
            this.addChild(skill1.display); 
            this.addChild(skill2.display); 

            if(num == 1){
                skill2.display.x = skill1.display.x = 0;
                skill2.display.y = skill1.display.y = 0;
            }else{
                let _radian = Math.random()*(2*Math.PI);//随机弧度
                skill2.display.x = skill1.display.x = Math.cos(_radian)*50;// 根据弧度做半径50的圆
                skill2.display.y = skill1.display.y = Math.sin(_radian)*50;
            }
            // skill2.display.visible = skill1.display.visible = false;
            skill1.animation.play("walk");
            skill2.animation.stop("walk");
            this._skillAniZhenSet.push(skill1);
            this._skillAniCeSet.push(skill2);
        }
        
    }

    /**
     * 主动技能持续时间
     */
    private skillTimeOut(){
        // 显示主动技能效果
        if(this._skillAniZhenSet.length > 0){
            for(let i=this._skillAniZhenSet.length-1; i>=0; i--){
                this._skillAniZhenSet[i].display.visible = true;
                this._skillAniZhenSet[i].animation.play("walk",1);
            }
            for(let i=this._skillAniCeSet.length-1; i>=0; i--){
                this._skillAniCeSet[i].display.visible = true;
                this._skillAniCeSet[i].animation.play("walk",1);
            }
        }

        // 设置主动技能持续时间
        // let time: number = 5000;
        // this._skillTimeOut = egret.setTimeout(this.clearSkillAni,this,time);
    }

    /**
     * 清除所有技能效果
     */
    public clearSkillAni(){
        if(this._skillAniZhenSet.length > 0){
            for(let i=this._skillAniZhenSet.length-1; i>=0; i--){
                this.removeChild(this._skillAniZhenSet[i].display);
                ArmaturePool.ReturnPool(this._skillAniZhenSet[i]);
                this._skillAniZhenSet.splice(i,1);
            }
            this._skillAniZhenSet = [];
        }
        if(this._skillAniCeSet.length > 0){
            for(let i=this._skillAniCeSet.length-1; i>=0; i--){
                this.removeChild(this._skillAniCeSet[i].display);
                ArmaturePool.ReturnPool(this._skillAniCeSet[i]);
                this._skillAniCeSet.splice(i,1);
            }
            this._skillAniCeSet = [];
        }
        this._UpdataRole(this._roleStarX, this._roleEndX); 
        if(this._skillTimeOut != null){
            egret.clearTimeout(this._skillTimeOut); 
            this._skillTimeOut = null;    
        } 
        // console.log("技能清除");
    }
    

    /**
     * 清除单个技能效果
     */
    public clearOneSkillAni(){
        if(this._skillAniZhenSet[0] != null){
            this.removeChild(this._skillAniZhenSet[0].display);
            ArmaturePool.ReturnPool(this._skillAniZhenSet[0]);
            this._skillAniZhenSet.splice(0,1);
        }
        if(this._skillAniCeSet[0] != null){
            this.removeChild(this._skillAniCeSet[0].display);
            ArmaturePool.ReturnPool(this._skillAniCeSet[0]);
            this._skillAniCeSet.splice(0,1);
        }

        if(this._skillAniZhenSet.length == 0){
            this._UpdataRole(this._roleStarX, this._roleEndX); 
            if(this._skillTimeOut != null){
                egret.clearTimeout(this._skillTimeOut); 
                this._skillTimeOut = null;    
            } 
        }
        // console.log("技能清除1个");
    }

    /**
     * 分身个数
     */
    public get FenShenCount(): number{
        if (this._skillAniZhenSet == null) return 0;
        return this._skillAniZhenSet.length;
    }
    
    /**     
     * 随机道具
     */
    public set Prop(value:boolean){
        this._propState = value ;
        
    }

    /**     
     * 随机道具
     */
    public get Prop():boolean{
        return this._propState;
    }
    
    /**
     * 复活
     * @param time      无敌持续时间
     */
    public Revive(){
        if(GameRole.IsFriend){
            return;
        }
        this._moveIndex -= 1;
        if (this._jxdArm.hasEventListener(dragonBones.Event.COMPLETE)){
            this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this.Revive, this);
        }
        this._jxdArm.addEventListener(dragonBones.Event.COMPLETE, this._OnReviveEnd, this);
        this._PlayMovie("revive", 1);
    }

    /**
     * 复活光效结束
     */
    private _OnReviveEnd(){
        if(GameRole.IsFriend){
            return;
        }
        this._jxdArm.removeEventListener(dragonBones.Event.COMPLETE, this._OnReviveEnd, this);
        this._reviveTime = this._wudiTime;
        this._isDie = false;
        Game.RoleStatus = 0;
        GameRole.RoleIsDie = false;
        this._PlayMovie("walk", 0);
        if (WindowManager.EndWindow(false) != null && WindowManager.EndWindow().IsVisibled) return;
        Game.GameStatus = true;
        Game.Instance.UpdataRoleMoveMark();
        this._isRevive = true;
        this._canJump = true;
        this._isFly = false;
        if (this._changeType != -1){
            this.ChangeStatus(this._changeType);
        }
        this.Move();
        if (this._reviveMovie == null){
            this._reviveMovie = ArmaturePool.GetArmature("invincible_json", "invincibletexture_json", "invincibletexture_png", "invincible");
            this.addChildAt(this._reviveMovie.display, 0);
            this._reviveMovie.animation.play("walk", 0);
        }
    }

    /**
     * 复活时间
     */
    public set ReviveTime(value: number){
        if(GameRole.IsFriend){
            return;
        }
        this._reviveTime = value;
        if (value > 0 && this._reviveMovie == null){
            this._reviveMovie = ArmaturePool.GetArmature("invincible_json", "invincibletexture_json", "invincibletexture_png", "invincible");
            this.addChildAt(this._reviveMovie.display, 0);
            this._reviveMovie.animation.play("invincible", 0);
        }
    }

    /**
     * 复活时间
     */
    public get ReviveTime(): number{
        if(GameRole.IsFriend){
            return;
        }
        return this._reviveTime;
    }

    /**
     * 好友跑动速度
     */
    public set FriSpeed(speed:number){
        if(!GameRole.IsFriend){
            return;
        }
        this._friSpeed = speed;
    }

    /**
     * 好友跑动速度
     */
    public get FriSpeed():number{
        if(!GameRole.IsFriend){
            return;
        }
        return this._friSpeed;
    }
    /**
     * 好友跳跃状态
     */
    public set FriStatus(status:number){
        if(!GameRole.IsFriend){
            return;
        }
        this._friStatus = status;
    }

    /**
     * 好友跳跃状态
     */
    public get FriStatus():number{
        if(!GameRole.IsFriend){
            return;
        }
        return this._friStatus;
    }

    /**
     * 无敌
     */
    public get IsWuDi(): boolean{
        if (this._reviveTime > 0) return true;
        return false;
    }

    /**
     * 是否死亡
     */
    public get IsDie(): boolean{
        return this._isDie;
    }

    /**
     * 暂停
     */
    public Pause(){
        this._jxdArm.animation.stop();
        this._jxdSizeArm.animation.stop();
        egret.Tween.pauseTweens(this);
    }

    /**
     * 继续
     */
    public Continue(){
        this._jxdArm.animation.play();
        this._jxdSizeArm.animation.play();
        egret.Tween.resumeTweens(this);
    }


    // 变量
    private _id: number = 0;                        // ID
    private _isJump: boolean = false;               // 是否在跳跃状态
    private _mapMoveMark: boolean = false;          // 场景是否移动
    private _isDie: boolean = false;                // 是否死亡
    private _direction: number;                     // 方向，0正，1左，2右
    private _road: Road;                            // 当前所在的道路
    private _moveRoad: egret.Point[];               // 角色移动路径
    private _roadTypeSet: number[];                 // 路径关键点类型
    private _doorTypeSet: number[];                 // 门类型集合
    private _map: Map;                              // 当前所在地图
    private _moveIndex: number = 0;                 // 角色当前位置
    private _currentRoadType: number = 1;           // 当前道路状态
    private _jxdArm: dragonBones.Armature;          // 角色正面动画
    private _jxdDis: egret.DisplayObject;           // 角色正面显示对象
    private _jxdSizeArm: dragonBones.Armature;      // 角色侧面动画
    private _jxdSizeDis: egret.DisplayObject;       // 角色侧面显示对象
    private _reviveTime: number = -1;               // 复活霸体时间
    private _reviveMovie: dragonBones.Armature;     // 复活光效
    private _isDestroy: boolean = false;            // 是否销毁
    private _wudiTime: number = 5000;               // 无敌持续时间
    private _friSpeed: number = 280;                //好友移动速度
    private _friStatus: number;                     //好友跳跃状态
    private _canJump: boolean = true;               // 能否跳跃

    private _propState:boolean
    private _roleStarX: number;
    private _roleEndX: number;
    private _prop: dragonBones.Armature;                  //随机道具动画
    private _skillAniZhenSet: dragonBones.Armature[] = []     // 技能正面动画集合
    private _skillAniCeSet: dragonBones.Armature[] = []     // 技能侧面动画集合
    private _role:Role;
    
    private _isRevive: boolean = false;
    /**
     * 是否在道具使用时间内
     */
    private _change: boolean = false;
   
    /**
     * 是否飞在空中
     */
    private _isFly: boolean = false;

    private _huoDeTimeOut;
    private _chupengTimeOut;
    private _changeType: number = -1;

    private _skillTimeOut;                      // 技能时间函数
    private _isPassHole: boolean = false;       // 是否进过障碍
}