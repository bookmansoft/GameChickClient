/**
 * 路径
 */
class Road{
    /**
     * 构造方法
     * @param data      道路信息
     * @param map       当前所属地图
     */
    public constructor(data: JSON, map: Map){
        this._map = map;
        this._roadSet = [];
        this._typeSet = [];
        this._groupSet = [];
        this._doorTypeSet = [];
        this._groupNum = data["type"];
        var loadData: number[][] = data["data"];
        for (var i = 0; i < loadData.length; i++){
            var point: egret.Point = new egret.Point(loadData[i][0], loadData[i][1]);
            var type: number = loadData[i][2];
            var group: number = loadData[i][3];
            var doorType: number = loadData[i][4];
            this._roadSet.push(point);
            this._typeSet.push(type);
            this._groupSet.push(group);
            this._doorTypeSet.push(doorType);
        }
    }

    /**
     * 获取移动路径
     */
    public get MoveRoad(): egret.Point[]{
        return this._roadSet;
    }

    /**
     * 获取移动路径点的类型集合
     * （1表示正常坐标，2表示道路比边界开始，3表示道路边界结束，4表示门入口，5表示门出口，6表示汇合点）
     */
    public get RoadType(): number[]{
        return this._typeSet;
    }

    /**
     * 道路点组别集合
     */
    public get GroupSet(): number[] {
        return this._groupSet;
    }

    /**
     * 添加物件
     */
    public AddObject(object: ObjectBase){
        if (this._itemSet == null) this._itemSet = [];
        this._itemSet.push(object);
    }

    /**
     * 取得物件集合
     */
    public get ObjectSet(): ObjectBase[]{
        return this._itemSet;
    }

    /**
     * 获取门的类型集合
     */
    public get DoorTypeSet(): number[]{
        return this._doorTypeSet;
    }

    /**
     * 删除某个元素
     */
    public SpliceObject(index: number){
        if (this._itemSet == null) return;
        if (index < 0 || index >= this._itemSet.length) return;
        this._itemSet.splice(index, 1)
    }

    /**
     * 销毁资源
     */
    public Destroy(){
        if (this._itemSet == null) return;
        for (var i = 0; i < this._itemSet.length; i++){
            this._itemSet[i].Destroy();
            if (this._itemSet[i].parent != null && this._itemSet[i].parent.contains(this._itemSet[i])){
                this._itemSet[i].parent.removeChild(this._itemSet[i]);
            }
        }
        this._itemSet = [];
    }

    /**
     * 道路组别
     */
    public get GroupNum(): number{
        return this._groupNum;
    }

    /**
     * 所属地图
     */
    public get Map(): Map{
        return this._map;
    }

    /**
     * ID
     */
    public set ID(value: number){
        this._id = value;
    }

    /**
     * ID
     */
    public get ID(): number{
        return this._id;
    }

    /**
     * 金币排序
     */
    public GoldSort(){
        if (this._itemSet == null || this._itemSet.length < 2) return;
        for (var i = 0; i < this._itemSet.length - 1; i++){
            var index: number = i;
            for (var j = i + 1; j < this._itemSet.length; j++){
                if (this._itemSet[j].y < this._itemSet[index].y){
                    index = j;
                }
            }
            if (i != index){
                var item: ObjectBase = this._itemSet[i];
                this._itemSet[i] = this._itemSet[index];
                this._itemSet[index] = item;
            }
        }
    }

    /**
     * 是否创建过角色
     */
    public set IsCreateRole(bool: boolean){
        this._isCreate = bool;
    }

    /**
     * 是否创建过角色
     */
    public get IsCreateRole(): boolean{
        return this._isCreate;
    }

    // 变量
    private _roadSet: egret.Point[];        // 道路点集合
    private _typeSet: number[];             // 道路点类型集合
    private _groupSet: number[];            // 道路组别信息
    private _itemSet: ObjectBase[];         // 金币集合
    private _groupNum: number;              // 道路组别
    private _map: Map;                      // 当前所属地图
    private _id: number;                    // 道路ID
    private _isCreate: boolean = false;     // 是否已创建过角色
    private _doorTypeSet: number[];            // 门的类型集合
}