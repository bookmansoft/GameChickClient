/**
 * 地图管理器
 */
class MapManager{
    /**
     * 地图横向格子数
     */
    public static Horizontal: number = 10;

    /**
     * 地图纵向格子数
     */
    public static Vertical: number = 18;

    /**
     * 道路格子大小
     */
    public static RoadSize: number = 60;

    /**
     * 地图数量
     */
    public static MapCount: number = 13;

    /**
     * 是否可以更新地图
     */
    public static IsUpdateMap: boolean = true;

    /**
     * 初始化
     */
    public static Init(){
        MapManager.SetSceneIndex(2001);
        ProcessManager.AddProcess(MapManager._Process.bind(MapManager));
    }

    /**
     * 场景数据
     */
    public static SceneJsonData:JSON = null;

    /**
     * 设置场景编号
     */
    public static SetSceneIndex($index){
        var jsonData = RES.getRes("sceneRes_json");
        MapManager.SceneJsonData = jsonData[$index];
    }

    /**
     * 取得地图
     * @param id    地图ID
     */
    public static GetMap(): Map{
        let map =  MapManager._mapSet.shift();
        var difficulty: number = CheckpointManager.CurrentCheckpoint == null? 3 : CheckpointManager.CurrentCheckpoint.Difficulty;
        if (map == null){
            map = new Map(RoadManager.Inistence().ceateMapType(difficulty, false, this._ceshiMapNum[0], this._ceshiMapNum[1]));
        }
        return map;
    }

    /**
     * 预创建所有地图
     */
    public static creatAllMap(){
        if (CheckpointManager.IsEndless || CheckpointManager.IsDailyActive){
            Game._isInitMap = false;
            for(let i = 1; i<11; i++){
                // if(MapManager._mapDictionary[i] == null || MapManager._mapDictionary[i].length == 0){
                //     MapManager._CreatedMapByDifficulty(i, 10, true);
                // }
                MapManager._CreatedMapByDifficulty(i, 10, true);
            }
            Game._isInitMap = true;
            if(Game._isInitArm && Game._isInitMap && Game._isStarReturn && WindowManager.WaitPage().IsVisibled){
                WindowManager.WaitPage().IsVisibled = false;
            }
            return;
        }
        MapManager._mapSet = [];
        var difficulty: number = CheckpointManager.CurrentCheckpoint == null? 3 : CheckpointManager.CurrentCheckpoint.Difficulty;
        let num: number = CheckpointManager.CurrentCheckpoint == null? 20 : Math.ceil(CheckpointManager.CurrentCheckpoint.PassTime / 5);
        for(let i = 0; i < num; i++){
            let mapData: DynamicMap = null;
            if(i==0){
                mapData = RoadManager.Inistence().ceateMapType(difficulty, true, this._ceshiMapNum[0], this._ceshiMapNum[1]);
            }else{
                mapData = RoadManager.Inistence().ceateMapType(difficulty, false, this._ceshiMapNum[0], this._ceshiMapNum[1]);
            }
            let map = new Map(mapData);
            // map.cacheAsBitmap = true;
            MapManager._mapSet.push(map);
        }
        Game._isInitMap = true;
        if(Game._isInitArm && Game._isInitMap && Game._isStarReturn && WindowManager.WaitPage().IsVisibled){
            WindowManager.WaitPage().IsVisibled = false;
        }
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private static _Process(frameTime: number){
        // var time: number = 600000;
        // MapManager._timer += frameTime;
        // if(!ResReadyMgr.IsReady("game")) return;
        // if (!MapManager.IsUpdateMap) return;
        // if (MapManager._timer >= time){
        //     MapManager._timer = 0;
        //     MapManager._CreatedMap();
        // }
    }

    /**
     * 创建地图
     */
    private static _CreatedMap(){
        MapManager._firstMapDic = [];
        MapManager._mapDictionary = [];
        // 初始化开始地图，每个难度3张
        for (var i = 1; i < 11; i++){
            var mapSet: Map[] = [];
            for (var j = 0; j < 3; j++){
                var mapData = RoadManager.Inistence().ceateMapType(i, true, this._ceshiMapNum[0], this._ceshiMapNum[1]);
                var map: Map = new Map(mapData);
                mapSet.push(map);
            }
            MapManager._firstMapDic[i] = mapSet;
        }
        for (var i = 1; i < 11; i++){
            MapManager._CreatedMapByDifficulty(i, 1, false);
        }
    }

    /**
     * 预创建某个难度的地图
     * @param difficulty    难度
     */
    private static _CreatedMapByDifficulty(difficulty: number, num: number, IsEndless: boolean){
        var mapSet: Map[] = [];
        for (var i = 0; i < num; i++){
            var mapData = RoadManager.Inistence().ceateMapType(difficulty, false, this._ceshiMapNum[0], this._ceshiMapNum[1]);
            var map: Map = new Map(mapData);
            mapSet.push(map);
            // if(IsEndless){
            //     if(MapManager._huancenMapSet[difficulty] == null){
            //         MapManager._huancenMapSet[difficulty] = [];
            //     }
            //     MapManager._huancenMapSet[difficulty].push(map);
            // }
        }

        // if(!IsEndless){
        MapManager._mapDictionary[difficulty] = mapSet;
        // }
    }

    /**
     * 获取地图
     * @param difficulty    难度
     * @param isFirst       是否是第一张
     */
    public static GetNewMap(difficulty: number, isFirst: boolean = false){
        var map: Map = null;
        if (isFirst){
            if (MapManager._firstMapDic[difficulty] == null || MapManager._firstMapDic[difficulty].length == 0){
                var mapData = RoadManager.Inistence().ceateMapType(difficulty, true, this._ceshiMapNum[0], this._ceshiMapNum[1]);
                map = new Map(mapData);
            }
            else {
                let mapSet: Map[] = MapManager._firstMapDic[difficulty];
                var index: number = (Math.random() * mapSet.length) | 0;
                map = mapSet[index];
                mapSet.splice(index, 1);
            }
        }
        else {
            // for(let i = 1; i<11; i++){
                if (MapManager._mapDictionary[difficulty] == null || MapManager._mapDictionary[difficulty].length == 0){
                    MapManager._CreatedMapByDifficulty(difficulty, 1, true);
                }
                // if(MapManager._huancenMapSet[i] == null || MapManager._huancenMapSet[i].length < MapManager._mapNum){
                //     let _length = MapManager._huancenMapSet[i] == null? 0:MapManager._huancenMapSet[i].length;
                //     MapManager._CreatedMapByDifficulty(i, MapManager._mapNum - _length, true);
                // }
            // }
            // }
            // if (MapManager._huancenMapSet[difficulty] == null || MapManager._huancenMapSet[difficulty].length == 0){
            //     MapManager._CreatedMapByDifficulty(difficulty,1);
            // }
            let mapSet: Map[] = MapManager._mapDictionary[difficulty];
            var index: number = (Math.random() * mapSet.length) | 0;
            map = mapSet[index];
            mapSet.splice(index, 1);
        }
        return map;
    }

    // 变量
    private static _mapSet: Map[] = [];                     // 地图数据字典
    private static _mapDictionary: Map[][] = [];            // 地图字典
    private static _firstMapDic: Map[][] = [];              // 开始地图字典
    private static _timer: number = 0;                      // 计时器

    // 测试地图
    private static _ceshiMapNum: number[] = [null, null];   // 测试 地图道路数量，地图id

    private static _mapNum: number = 10;

    private static _huancenMapSet: Map[][] = [];            // 无尽地图缓存
}