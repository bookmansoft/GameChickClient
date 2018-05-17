/**
 * 天气
 */
class WeatherManager{
    /**
     * 雪
     */
    public static Snow: string = "snow";
    /**
     * 雨
     */
    public static Rain: string = "rain";

    /**
     * 开始
     * @param weather:"snow","rain"
     * @param duration: 粒子出现总时间(毫秒)
     * @param maxParticles:粒子系统最大粒子数，超过该数量将不会继续创建粒子，取值范围[1,Number.MAX_VALUE]
     */
    public static Start(weather: String, duration: number = -1, maxParticles: number = 200){
        if (WeatherManager.IsPlayParticle) return;
        //下雪粒子特效
        var texture = RES.getRes(weather+"_png");  
        var config = RES.getRes(weather+"_json");  
        config["maxParticles"] = maxParticles;
        WeatherManager._particleSys = new particle.GravityParticleSystem(texture,config);
        WeatherManager._particleSys.addEventListener(egret.Event.COMPLETE, WeatherManager.Stop, WeatherManager);
        Game.Instance.WeatherLayer.addChild(WeatherManager._particleSys);  
        WeatherManager._particleSys.start(duration);
    }

    /**
     * 停止粒子光效
     */
    public static Stop(){
        if (WeatherManager._particleSys != null){
            // WeatherManager._particleSys.stop();
            Game.Instance.WeatherLayer.removeChild(WeatherManager._particleSys);
            WeatherManager._particleSys = null;
        }
    }

    /**
     * 是否播放粒子光效
     */
    public static get IsPlayParticle(): boolean{
        return WeatherManager._particleSys != null;
    }

    // 变量
    private static _particleSys: particle.GravityParticleSystem;        // 粒子对象
}