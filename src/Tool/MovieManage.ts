/**
* 动画数据管理
*/
class MovieManager {
    /**
     * 取得帧动画数据
     * @param jsonName                  json配置文件名
     * @param textureName               动画图片文件名
     * @param movieName                 动画名
     * @return egret.MovieClipData      动画数据
     */
    public static GetMovieClipData(jsonName: string, textureName: string, movieName: string): egret.MovieClipData {
        if (MovieManager._movieDataFactorySet == null) {
            MovieManager._movieDataFactorySet = [];
        }
        var data = RES.getRes(jsonName);
        var texture = RES.getRes(textureName);
        var key: string = jsonName + textureName;
        var mcDataFactory: egret.MovieClipDataFactory;
        mcDataFactory = MovieManager._movieDataFactorySet[key];
        if (mcDataFactory == null) {
            mcDataFactory = new egret.MovieClipDataFactory(data, texture);
            MovieManager._movieDataFactorySet[key] = mcDataFactory;
        }
        var movieData: egret.MovieClipData = mcDataFactory.generateMovieClipData(movieName);
        return movieData;
    }
    
    /**
     * 取得骨骼动画数据
     * @param movieDataName                 动画配置文件名
     * @param texturejsonName               动画资源配置名
     * @param textureName                   动画资源图片名
     * @param armatureName                  骨架名
     * @return dragonBones.Armature         动画数据
     */
    public static GetDragonBonesMovie(movieDataName: string, texturejsonName: string, textureName: string, armatureName: string): dragonBones.Armature {
        if (MovieManager._dragonBonesFactory == null) {
            MovieManager._dragonBonesFactory = new dragonBones.EgretFactory();
        }
        if (MovieManager._dragonMovieSet == null) MovieManager._dragonMovieSet = [];
        // 判断工厂中是否有数据
        if (MovieManager._dragonMovieSet[movieDataName] == null){
            var skeletonData = RES.getRes(movieDataName);
            var textureData = RES.getRes(texturejsonName);
            var texture = RES.getRes(textureName);
            if (skeletonData == null) {
                console.log("Data:" + movieDataName);
            }
            if (textureData == null) {
                console.log("Texturejson:" + texturejsonName);
            }
            if (texture == null) {
                console.log("Texture:" + textureName);
            }
            MovieManager._dragonBonesFactory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            MovieManager._dragonBonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
            MovieManager._dragonMovieSet[movieDataName] = "1";
        }
        // 创建龙骨动画
        var armature = MovieManager._dragonBonesFactory.buildArmature(armatureName);
        // var armature:dragonBones.FastArmature = this._dragonBonesFactory.buildFastArmature(armatureName);
        // armature.enableAnimationCache(30);
        // 添加到时钟中
        MovieManager.ADDArmature(armature);
        if (!MovieManager._isTickerRegister) {
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
            MovieManager._isTickerRegister = true;
        }
        return armature;
    }
    
    /**
     * 添加骨骼动画数据
     * @param armature                  动画数据
     */
    public static ADDArmature(armature: dragonBones.Armature) {
        if (armature != null) {
            dragonBones.WorldClock.clock.add(armature);
        }
    }
    
    /**
     * 移除骨骼动画数据
     * @param armature                  动画数据
     */
    public static RemoveArmature(armature: dragonBones.Armature) {
        if (armature != null) {
            dragonBones.WorldClock.clock.remove(armature);
        }
    }

    // 变量
    private static _dragonMovieSet: string[];                               // 已有龙骨集合
    private static _isTickerRegister: boolean = false;                      // 是否添加时钟
    private static _movieDataFactorySet: egret.MovieClipDataFactory[];      // 动画工厂集合
    private static _dragonBonesFactory: dragonBones.EgretFactory;           // 龙骨工厂
} 