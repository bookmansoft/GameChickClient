/**
 * 地图
 */
class Map extends egret.DisplayObjectContainer{
    /**
     * 门类型字段
     */
    public static DoorType: string = "DOORTYPE";

    /**
     * 构造方法
     * @param group     容器
     * @param jsonData  地图数据
     */
    public constructor($group: DynamicMap){
        super();
        this._mapIma = $group;
        this._jsonData = $group.MapData;
        this.Height = $group.Height;
        // this.CreateMap();
    }

    /**
     * 测试
     */
    public get jsonData():Object{
        return this._jsonData;
    }

    /**
     * 创建地图
     */
    public CreateMap(){
        // 解析JSON数据
        this._movieSet = [];
        this._movieFramSet = [];
        this._roadSet = [];
        this._enterDoorSet = [];
        this._outDoorSet = [];
        var resCount: number = this._jsonData["mapcount"];
        var resName: string = this._jsonData["mapresname"];
        var resHeight: number = this._jsonData["resheight"];
        var roadCount: number = this._jsonData["roadcount"];

        for (var i = 0; i < roadCount; i++){
            var roadData: JSON = this._jsonData["road"][i]["roaddata"];
            this._roadSet.push(new Road(roadData, this));
            this._roadSet[i].ID = i;
        }

        // 创建资源
        this._mapIma.x = 0;
        this._mapIma.y = 0;
        this._mapIma.cacheAsBitmap = true;
        this.addChild(this._mapIma);

        // 房子
        var housePoint: number[][] = this._jsonData["house"];
        for (var i = 0; i < housePoint.length; i++){
            // let houseMovie:egret.MovieClip = ArmaturePool.GetMovieArmature("house_json","house_png","house");
            let houseMovie:egret.MovieClip = ArmaturePool.GetMovieArmature(MapManager.SceneJsonData["house"].res+"_json",MapManager.SceneJsonData["house"].res+"_png",MapManager.SceneJsonData["house"].res);
            houseMovie.play(-1);
            var point: number[] = housePoint[i];
            houseMovie.x = point[0];
            houseMovie.y = point[1];
            this.addChild(houseMovie);
            this._movieFramSet.push(houseMovie);
        }
        // 气球
        var balloonPoint: number[][] = this._jsonData["balloon"];
        for (var i = 0; i < balloonPoint.length; i++){
            // var balloonMovie: dragonBones.Armature = ArmaturePool.GetArmature(MapManager.SceneJsonData["balloon"]+"_json", MapManager.SceneJsonData["balloon"]+"texture_json",
                                                                                    // MapManager.SceneJsonData["balloon"]+"texture_png", MapManager.SceneJsonData["balloon"]);
            // let balloonMovie:egret.MovieClip = ArmaturePool.GetMovieArmature("balloon_json","balloon_png","balloon");
            let balloonMovie:egret.MovieClip = ArmaturePool.GetMovieArmature(MapManager.SceneJsonData["balloon"]+"_json",MapManager.SceneJsonData["balloon"]+"_png",MapManager.SceneJsonData["balloon"]);
            balloonMovie.play(-1);
            var point: number[] = balloonPoint[i];
            balloonMovie.x = point[0];
            balloonMovie.y = point[1];
            this.addChild(balloonMovie);
            this._movieFramSet.push(balloonMovie);
        }
    }

    /**
     * 路径个数
     */
    public get RoadCount(): number{
        return this._roadSet.length;
    }

    /**
     * 获取移动路径
     * @param roadIndex     路径索引
     */
    public GetRoad(roadIndex: number): Road{
        if (roadIndex >= this._roadSet.length) return null;
        return this._roadSet[roadIndex];
    }

    /**
     * 销毁资源
     */
    public Destroy(){
        // ImagePool.ReturnPool(this._mapIma[ImagePool.PoolName],this._mapIma);
        this._mapIma.cacheAsBitmap = false;
        this._mapIma.RemoveMap();
        if (this._enterDoorSet != null){
            for (var i = this._enterDoorSet.length -1; i >=0; i--){
                // var parent = this._enterDoorSet[i].parent;
                this._enterDoorSet[i].stop();
                let _name = this._enterDoorSet[i]["name"];
                this._enterDoorSet[i].movieClipData = MovieManager.GetMovieClipData(
                            _name + "_idle_json",_name + "_idle_png",_name + "_idle");
                ArmaturePool.ReturnMoviePool(this._enterDoorSet[i]);
                // if (parent != null){
                //     this._enterDoorSet[i].stop();
                //     parent.removeChild(this._enterDoorSet[i]);
                // }
                // ArmaturePool.ReturnPool(this._enterDoorSet[i]);
                this._enterDoorSet.splice(i,1);
            }
        }
        if (this._outDoorSet != null){
            for (var j = this._outDoorSet.length -1; j >= 0; j--){
                this._outDoorSet[j].stop();
                let _name = this._outDoorSet[j]["name"];
                this._outDoorSet[j].movieClipData = MovieManager.GetMovieClipData(
                            _name + "_idle_json",_name + "_idle_png",_name + "_idle");
                ArmaturePool.ReturnMoviePool(this._outDoorSet[j]);
                // var parent = this._outDoorSet[j].parent;
                // if (parent != null){
                //     this._outDoorSet[j].stop();
                //     parent.removeChild(this._outDoorSet[j]);
                // }
                // ArmaturePool.ReturnPool(this._outDoorSet[j]);
                this._outDoorSet.splice(j,1);
            }
        }
        if (this._movieSet != null){
            for (let a = 0; a < this._movieSet.length; a++){
                // this.removeChild(this._movieSet[a].display);
                ArmaturePool.ReturnPool(this._movieSet[a]);
            }
        }

        if (this._movieFramSet != null){
            for (let a = 0; a < this._movieFramSet.length; a++){
                ArmaturePool.ReturnMoviePool(this._movieFramSet[a]);
                // this._movieFramSet[a].stop();
                // this.removeChild(this._movieFramSet[a]);
            }
        }
        for (var b = 0; b < this._roadSet.length; b++){
            this._roadSet[b].Destroy();
        }
        // this.cacheAsBitmap = false;
    }

    /**
     * 添加进入的门
     */
    public AddEnterDoor(door: egret.MovieClip){
        if (this._enterDoorSet == null) this._enterDoorSet = [];
        this._enterDoorSet.push(door);
    }

    /**
     * 添加出来的门
     */
    public AddOutDoor(door: egret.MovieClip){
        if (this._outDoorSet == null) this._outDoorSet = [];
        this._outDoorSet.push(door);
    }

    /**
     * 进门打开
     */
    public EnterDoorOpen(type: number){
        if (this._enterDoorSet == null) return;
        for (var i = 0; i < this._enterDoorSet.length; i++){
            if (this._enterDoorSet[i][Map.DoorType] == type){
                let _name = this._enterDoorSet[i]["name"];
                this._enterDoorSet[i].stop();
                this._enterDoorSet[i].movieClipData = MovieManager.GetMovieClipData(
                            _name + "_open_json",_name + "_open_png",_name + "_open");
                this._enterDoorSet[i].play(1);
            }
        }
        SoundManager.PlayMusic(SoundManager.Door_Music);
    }

    /**
     * 出门打开
     */
    public OutDoorOpen(type: number){
        if (this._outDoorSet == null) return;
        for (var i = 0; i < this._outDoorSet.length; i++){
            if (this._outDoorSet[i][Map.DoorType] == type){
                let _name = this._outDoorSet[i]["name"];
                this._outDoorSet[i].stop();
                this._outDoorSet[i].movieClipData = MovieManager.GetMovieClipData(
                        _name + "_open_json",_name + "_open_png",_name + "_open");
                this._outDoorSet[i].play(1);
            }
        }
    }
    
    /**
     * 添加金币
     * @param   gold        金币
     * @param   groupNum    道路组边
     * @param   road        创建金币的道路
     */
    public AddObject(gold: ObjectBase, groupNum: number, road: Road){
        for (var i = 0; i < this._roadSet.length; i++){
            if (this._roadSet[i] == road) continue;
            if (this._roadSet[i].GroupNum <= groupNum){
                this._roadSet[i].AddObject(gold);
            }
        }
    }

    /**
     * 金币排序
     */
    public GoldSort(){
        for (var i = 0; i < this._roadSet.length; i++){
            this._roadSet[i].GoldSort();
        }
    }

    public set Height(value:number){
        this._height = value;
    }

    public get Height(): number{
        return this._height;
    }

    // 变量
    private _jsonData: Object;                          // 地图数据
    private _roadSet: Road[];                           // 地图道路集合
    private _movieSet: dragonBones.Armature[];          // 动画资源集合
    private _enterDoorSet: egret.MovieClip[];           // 入门骨架集合
    private _outDoorSet: egret.MovieClip[];             // 出门骨架集合

    private _movieFramSet: egret.MovieClip[];           // 动画资源集合

    private _mapIma: DynamicMap;                         // 地图
    private _height: number;
}