/**
 * 动态地图
 */
class DynamicMap extends eui.Group{
    public constructor(){
        super();
    }

    /**
     * 添加图片
     */
    public AddImage(image: eui.Image){
        this.addChild(image);
        this._imageSet.push(image);
    }

    /**
     * 移除地图
     */
    public RemoveMap(){
        if (this.parent != null){
            try {
                this.parent.removeChild(this);
            } catch (error) {
                console.log(error);
            }
        }
        while(this._imageSet.length > 0){
            var image: eui.Image = this._imageSet.shift();
            ImagePool.ReturnPool(image);
        }
    }

    /**
     * 地图数据
     */
    public set MapData(value: Object){
        this._data = value;
    }

    /**
     * 地图数据
     */
    public get MapData(): Object{
        return this._data;
    }

    /**
     * 难度
     */
    public set Difficulty(value: number){
        this._difficulty = value;
    }

    /**
     * 难度
     */
    public get Difficulty(): number{
        return this._difficulty;
    }

    /**
     * 高度
     */
    public get Height(){
        
        for (var i = this._imageSet.length - 1; i > 0; i--){
            var image: eui.Image = this._imageSet[i];
            if (image["isheight"] == null){
                return image.y + image.height - 8;
            }
        }
        return this._imageSet[this._imageSet.length-1].y + this._imageSet[this._imageSet.length-1].height - 8;
    }

    /**
     * 位置
     */
    public get posiX(){
        return this._imageSet[this._imageSet.length-1].x;
    }

    // 变量
    private _imageSet: eui.Image[] = [];
    private _data: Object;
    private _difficulty: number;
}