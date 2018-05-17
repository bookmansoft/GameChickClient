/**
 * 场景
 */
class Scene extends egret.DisplayObjectContainer{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.width = 640;
        this.height = 1136;
        // this.CreateScene();
    }

    /**
     * 创建场景
     */
    public CreateScene(){

        var sceneWidth: number = 640;
        var sceneHeight: number = 1136;
        this._imageSet = [];
        this._bridSet = [];
        var data = MapManager.SceneJsonData;
        // 创建山随机2-3个
        var mcount: number = Math.ceil(Math.random() * 2) + 1;
        // var mSet: number[] = [1, 2, 3];
        for (var i = 0; i < mcount; i ++){
            var index: number = Math.floor( Math.random() * data["mountain"].length);
            // var mIndex: number = mSet[index];
            // mSet.splice(index, 1);
            var mountain: eui.Image = ImagePool.GetImage(data["mountain"][index].res);// new eui.Image(data["mountain"][index].res);
            var my: number = Math.floor(Math.random() * (sceneHeight - 300)) + 300;
            mountain.y = my;
            mountain.x = data["mountain"][index].posiX;
            this._imageSet.push(mountain);
            this.addChild(mountain);
        }
        // 创建云随机3-4个
        var yuncount: number = Math.ceil(Math.random() * 2) + 2;
        for (var i = 0; i < yuncount; i ++){
            var index: number = Math.floor( Math.random() * data["cloud"].length);
            var cloud: eui.Image = ImagePool.GetImage(data["cloud"][index].res);//new eui.Image(data["cloud"][index].res);
            var cloudy: number = Math.floor(Math.random() * sceneHeight);
            cloud.y = cloudy;
            cloud.x = data["cloud"][index].posiX;
            this._imageSet.push(cloud);
            this.addChild(cloud);
        }
        // 创建鸟10左右
        var bridcount: number = Math.random() > 0.5? 10 - Math.ceil(Math.random() * 3) : 10 + Math.ceil(Math.random() * 3);
        for (var i = 0; i < bridcount; i ++){
            var index: number = Math.floor( Math.random() * data["bird"].length);
            var brid: eui.Image = ImagePool.GetImage(data["bird"][index]);//new eui.Image(data["bird"][index]);
            brid.x = Math.floor(Math.random() * sceneWidth);
            brid.y = Math.floor(Math.random() * sceneHeight) + this.y;
            this._bridSet.push(brid);
            // this.addChild(brid);
            Game.Instance.TopLayer.addChild(brid);
        }
        // 创建树15-20个
        var treecount: number = Math.ceil(Math.random() * 5) + 15;
        for (var i = 0; i < treecount; i ++){
            var index: number = Math.floor( Math.random() * data["tree"].length);
            var tree: eui.Image = ImagePool.GetImage(data["tree"][index]);//new eui.Image(data["tree"][index]);
            tree.x = Math.floor(Math.random() * sceneWidth);
            tree.y = Math.floor(Math.random() * sceneHeight);
            this._imageSet.push(tree);
            this.addChild(tree);
        }
    }

    /**
     * 销毁资源
     */
    public Destroy(){
        for (var i = 0; i < this._bridSet.length; i++){
            Game.Instance.TopLayer.removeChild(this._bridSet[i]);
            ImagePool.ReturnPool(this._bridSet[i]);
        }

        for (var i = 0; i < this._imageSet.length; i++){
            this.removeChild(this._imageSet[i]);
            ImagePool.ReturnPool(this._imageSet[i]);
        }
    }

    // 变量
    private _imageSet: eui.Image[];             // 图片集合
    private _bridSet: eui.Image[];              // 鸟集合
}