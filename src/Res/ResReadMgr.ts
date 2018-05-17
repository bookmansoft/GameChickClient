/**
 *
 * @author @srf
 * 资源准备就绪类
 */
class ResReadyMgr {
    /**
     * 查询加载是否完毕 -- 高优先级
     */
    public static IsReady(groupName:string, bNormal?:boolean) :boolean {
        if (ResReadyMgr.s_resReadys[groupName]) {
            return ResReadyMgr.s_resReadys[groupName].IsReady();
        }
        var newRes :ResReady = new ResReady();
        ResReadyMgr.s_resReadys[groupName] = newRes;     
        if (bNormal) {
            newRes.SetGroupName(groupName, ResReadyMgr.s_priority);     
        } else {
            newRes.SetGroupName(groupName, ++ResReadyMgr.s_priority);
        }   
        return newRes.IsReady();        
    }

    /**
     * 重置加载优先级
     */
    public static ResetLoadPriority(priority:number) {
        ResReadyMgr.s_priority = priority;
    }

    /**
     * 加载组资源
     */
    public static LoadGroup(){
        for (var i = 0; i < ResReadyMgr._groupSet.length; i++){
            if (!ResReadyMgr.IsReady( ResReadyMgr._groupSet[i])){
                return;
            }
        }
    }

    /**
     * 资源加载完成处理
     */
    public static GroupLoadEnd(groupName: string){
        switch (groupName) {
            case "startsound":
                if (!Game.GameStatus){
                    SoundManager.PlayBackgroundMusic();
                }
                break;
            case "checkpointwindow":
                WindowManager.StarWindow().creatCheckPoint();
                // GuideManager.GuideCheck();
                break;
            case "startrole":
                WindowManager.StarWindow().creatCheckPoint();
                // GuideManager.GuideCheck();
                break;
            case "jixiaode":
            case "xiaomei":
            case "alian":
            case "fatiao":
            case "gulaobang":
            case "huihui":
            case "shasha":
            case "xiaoying":
            case "mingrn":
            case "zuozhu":
            case "yujie":
                ArmaturePool.InitRole(groupName);
                if (WindowManager.RoleSelectWindow(false) != null){
                    WindowManager.RoleSelectWindow().ResLoadEnd();
                }
                break;
        }
    }
    
    // 私有变量
    private static s_resReadys: any = {};                   // 物品集合
    private static s_priority: number = 10;                 // 加载优先级
    // 资源组
    private static _groupSet: string[] = [  "startrole",
                                            "checkpointwindow",
                                            "startsound",
                                            "itemres",
                                            "game",
                                            "prompt",
                                            "jixiaode",
                                            "xiaomei",
                                            "alian",
                                            "fatiao",
                                            "gulaobang",
                                            "huihui",
                                            "shasha",
                                            "yujie",
                                            "xiaoying",
                                            "mingrn",
                                            "zuozhu"];            
}