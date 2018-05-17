/**
 * 图片资源池
 */
class ImagePool{
    /**
     * 附加字段
     */
    public static PoolName: string = "PoolName";

    /**
     * 获取图片
     * @param textureName                 文件名
     */
    public static GetImage(textureName: string): eui.Image{
        if (ImagePool._imaSet[textureName] == null){
            ImagePool._imaSet[textureName] = [];
        }
        var dataSet: eui.Image[] = ImagePool._imaSet[textureName];
        if (dataSet != null && dataSet.length > 0){
            var arm: eui.Image = dataSet.shift();
            return arm;
        }
        else{
            var newIma: eui.Image = new eui.Image(textureName);
            newIma[ImagePool.PoolName] = textureName;
            return newIma;
        }
    }

    /**
     * 图片放回对象池
     * @param textureName                 文件名
     * @param ima                         图片名
     */
    public static ReturnPool(ima: eui.Image){
        if (ima == null) return;
        ima.visible = true;
        var textureName: string = ima[ImagePool.PoolName];
        if (ImagePool._imaSet[textureName] == null) {
            ImagePool._imaSet[textureName] = [];
        }
        ImagePool._imaSet[textureName].push(ima);
    }

    // 变量
    private static _imaSet: eui.Image[][] = [];
}