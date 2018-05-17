/**
 * 龙骨池
 */
class ArmaturePool{
    /**
     * 龙骨附加字段
     */
    public static PoolName: string = "PoolName";

    /**
     * 龙骨是否初始化
     */
    public static IsInit: boolean = false;

    /**
     * 初始化一些龙骨资源
     */
    public static Init(){
        if (ArmaturePool.IsInit){
            Game._isInitArm = true;
            if(Game._isInitArm && Game._isInitMap && Game._isStarReturn && WindowManager.WaitPage().IsVisibled){
                WindowManager.WaitPage().IsVisibled = false;
            }
            return;
        }
        ArmaturePool.IsInit = true;
        for(let i = 0; i<ArmaturePool._resName.length; i++){
            var obj: any = ArmaturePool._resName[i];
            for(var j = 0; j < obj.count; j++){
                // let a = MovieManager.GetMovieClipData(obj.name + "_json", obj.name + "_png", obj.name);
                let arm = ArmaturePool.GetMovieArmature(obj.name + "_json", obj.name + "_png", obj.name);
                arm[ArmaturePool.PoolName] = obj.name + "_json";
                ArmaturePool.ReturnMoviePool(arm);
            }
        }
        Game._isInitArm = true;
        if(Game._isInitArm && Game._isInitMap && Game._isStarReturn && WindowManager.WaitPage().IsVisibled){
            WindowManager.WaitPage().IsVisibled = false;
        }
    }

    /**
     * 初始化角色角色资源
     */
    public static InitRole(groupName: string){
        var roleSet: Role[] = UnitManager.GetRoleSet();
        Object.keys(roleSet).map(function(key){
                if (roleSet[key].ResGroupName == groupName){
                    var res: string = roleSet[key].Res;
                    for (var j = 0; j < 6; j++){
                        var arm1: dragonBones.Armature = MovieManager.GetDragonBonesMovie(res + "_01_json", res + "_01texture_json",
                                                                                res + "_01texture_png", res + "_01");
                        var arm2: dragonBones.Armature = MovieManager.GetDragonBonesMovie(res + "_02_json", res + "_02texture_json",
                                                                        res + "_02texture_png", res + "_02");
                        arm1[ArmaturePool.PoolName] = res + "_01_json";
                        arm2[ArmaturePool.PoolName] = res + "_02_json";
                        ArmaturePool.ReturnPool(arm1);
                        ArmaturePool.ReturnPool(arm2);
                    }
                }
            });
    }

    /**
     * 获取龙骨
     * @param movieDataName                 动画配置文件名
     * @param texturejsonName               动画资源配置名
     * @param textureName                   动画资源图片名
     * @param armatureName                  骨架名
     */
    public static GetArmature(movieDataName: string, texturejsonName: string, textureName: string, armatureName: string){
        if (ArmaturePool._armSet[movieDataName] == null){
            ArmaturePool._armSet[movieDataName] = [];
        }
        var dataSet: dragonBones.Armature[] = ArmaturePool._armSet[movieDataName];
        if (dataSet.length > 0){
            var arm: dragonBones.Armature = dataSet.shift();
            MovieManager.ADDArmature(arm);
            return arm;
        }
        else{
            var newArm: dragonBones.Armature = MovieManager.GetDragonBonesMovie(movieDataName, texturejsonName, textureName, armatureName);
            newArm[ArmaturePool.PoolName] = movieDataName;
            return newArm;
        }
    }

    /**
     * 龙骨放回对象池
     * @param arm                  骨架
     */
    public static ReturnPool(arm: dragonBones.Armature){
        if (arm == null) return;
        var name: string = arm[ArmaturePool.PoolName];
        if (ArmaturePool._armSet[name] == null) {
            ArmaturePool._armSet[name] = [];
        }
        var dis: egret.DisplayObject = arm.display;
        dis.visible = true;
        dis.scaleX = 1;
        dis.scaleY = 1;
        if (dis.parent != null){
            dis.parent.removeChild(dis);
        }
        MovieManager.RemoveArmature(arm);
        ArmaturePool._armSet[name].push(arm);
    }

    /**
     * 获取帧动画
     * @param movieDataName                 动画配置文件名
     * @param texturejsonName               动画资源配置名
     * @param textureName                   动画资源图片名
     * @param armatureName                  骨架名
     */
    public static GetMovieArmature(jsonName: string, textureName: string, movieName: string): egret.MovieClip{
        if (ArmaturePool._movSet[jsonName] == null){
            ArmaturePool._movSet[jsonName] = [];
        }
        let dataSet: egret.MovieClip[] = ArmaturePool._movSet[jsonName];
        if (dataSet.length > 0){
            let arm: egret.MovieClip = dataSet.shift();
            return arm;
        }
        else{
            var newArm: egret.MovieClip = new egret.MovieClip();
            newArm.movieClipData =  MovieManager.GetMovieClipData(jsonName, textureName, movieName);
            newArm[ArmaturePool.PoolName] = jsonName;
            return newArm;
        }
    }

    /**
     * 帧动画放回对象池
     * @param arm                  骨架
     */
    public static ReturnMoviePool(arm: egret.MovieClip){
        if (arm == null) return;
        var name: string = arm[ArmaturePool.PoolName];
        if (ArmaturePool._movSet[name] == null) {
            ArmaturePool._movSet[name] = [];
        }
        arm.visible = true;
        arm.scaleX = 1;
        arm.scaleY = 1;
        arm.stop();
        if (arm.parent != null){
            arm.parent.removeChild(arm);
        }
        ArmaturePool._movSet[name].push(arm);
    }

    // 变量
    private static _armSet: dragonBones.Armature[][] = [];
    private static _movSet: egret.MovieClip[][] = [];

    /**
     * 预创建的资源
     */
    private static _resName:any[]=[
        {"name":"entrance01_idle","count":5},//入门（正）
        {"name":"entrance01_open","count":5},//入门
        {"name":"entrance02_idle","count":5},//
        {"name":"entrance02_open","count":5},//
        {"name":"exit01_idle","count":15},//出门（正）
        {"name":"exit01_open","count":15},//出门（正）
        {"name":"exit02_idle","count":15},//
        {"name":"exit02_open","count":15},//
        {"name":"balloon","count":15},//
        {"name":"house","count":15},//
        {"name":"paperair1","count":5},//
        {"name":"paperair2","count":5},//
        {"name":"snowman","count":15},//
        {"name":"snowsmall","count":15},//
        {"name":"snow1","count":5},//
        {"name":"snow2","count":5},//
        {"name":"aircraft","count":15},//
        {"name":"building","count":15},//
        {"name":"house_qixi","count":15},//
        {"name":"xique_qix","count":15}
                            ];
}