/**
 * 渲染管理
 */
class FilterManage
{
    /**
     * 灰度渲染
     */
    public static get HuiDu():egret.ColorMatrixFilter
    {
        var mat:any[] = [ 0.33,0.33,0.33,0,0,
                          0.33,0.33,0.33,0,0,
                          0.33,0.33,0.33,0,0,
                          0,0,0,1,0 ];
        var colorMat:egret.ColorMatrixFilter = new egret.ColorMatrixFilter(mat);

        return colorMat;
    }

    /**
     * 添加指定颜色的描边
     * @shendu 描边像素
     * @color 描边颜色
     */
    public static AddMiaoBian($shendu:number=0,$color=0xffffff):egret.GlowFilter
    {
        var colorMat:egret.GlowFilter = new egret.GlowFilter($color, 1.0, $shendu, $shendu, 10, 1, false, false);  

        return colorMat;
    }


}