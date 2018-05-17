/**
 * 新手引导管理
 */
class GuideManager{
    /**
     * 初始化
     */
    public static Init(){
        Facade.instance().watch(GuideManager._Guide, NetNumber.Guide);
        Facade.instance().watch(GuideManager._GuideBonus, NetNumber.GuideBonus);
        NetManager.SendRequest(["func=" + NetNumber.GuideInfo], GuideManager._GuideReturn.bind(GuideManager));
    }

    /**
     * 结束引导返回
     */
    private static _GuideReturn(jsonData: number){
        var id: number = jsonData;
        GuideManager._guideID = id;
        GuideManager._isStarGuide = GuideManager._guideID != 0 || GuideManager._isStarGuide;
        GuideManager.GuideCheck();
    }

    /**
     * 引导监听
     */
    private static _Guide(jsonData: Object){
        var id: number = jsonData["info"]["gid"];
        GuideManager._guideID = id;
        GuideManager._isStarGuide = GuideManager._guideID != 0 || GuideManager._isStarGuide;
        GuideManager.GuideCheck();
    }

    /**
     * 引导奖励监听
     */
    private static _GuideBonus(jsonData: Object){
        if (jsonData == null) return;
        PromptManager.ShowGit(jsonData["info"]);
    }

    /**
     * 引导结束
     */
    public static GuideFinish(guideID: number = 0){
        if (guideID != 0 && guideID != GuideManager._guideID) return;
        NetManager.SendRequest(["func=" + NetNumber.GuideFinish, "&gid=" + GuideManager._guideID]);
        if(GuideManager._guideID == 7){
            WindowManager.GuideWindow().IsVisibled = false;
        }
    }

    /**
     * 引导检测
     */
    public static GuideCheck(){
        if (!Main.IsCreated || !GuideManager._isStarGuide) return;
        GuideManager._isGuide = GuideManager._guideID != 0;
        switch (GuideManager._guideID) {
            case 0://0没有引导
                WindowManager.GuideWindow().IsVisibled = false;
                break;
            case 1://引导告知角色形象和名字
                WindowManager.StarWindow().WindowGuide();
                break;
            case 2://引导角色
                // if (ResReadyMgr.IsReady("startrole")){
                //     WindowManager.WaitPage().IsVisibled = false;
                //     WindowManager.StarWindow().CheckGuide1();
                // }
                // else {
                //     WindowManager.WaitPage().IsVisibled = true;
                // }
                WindowManager.StarWindow().CheckGuide1();
                break;
            case 3://引导角色
                // if (ResReadyMgr.IsReady("startrole")){
                //     WindowManager.WaitPage().IsVisibled = false;
                //     WindowManager.StarWindow().CheckGuide2();
                // }
                // else {
                //     WindowManager.WaitPage().IsVisibled = true;
                // }
                WindowManager.StarWindow().CheckGuide2();
                break;
            case 4://引导角色
                GuideManager.GuideFinish(4);
                break;
            case 5://引导关卡
                WindowManager.StarWindow().CheckpointGuide();
                break;
            case 6://引导闯关
                GuideManager.GuideFinish(6);
                break;
            case 7://引导开始游戏
                if (WindowManager.RoleSelectWindow() != null){
                    WindowManager.RoleSelectWindow().StartGameGuide();
                }
                break;
            case 8://引导收藏
                if(WindowManager.GuideWindow()!=null && WindowManager.GuideWindow().IsVisibled) return;
                
                let _ifShow: boolean = true;
                
                if(WindowManager.RoleSelectWindow() != null){
                    _ifShow = false;
                }
                if(_ifShow){
                    WindowManager.StarWindow().ShouCangGuide();
                }
                break;
            default:
                // UnitManager.CheckPlayGift();
                break;
        }
        return GuideManager._guideID;
    }

    /**
     * 显示引导界面
     * @param       type        类型
     * @param       x           x
     * @param       y           y
     * @param       width       宽
     * @param       height      高
     */
    public static ShowGuideWindow(type: number, x: number, y: number, width: number, height: number, msg: string  =""){
        if (WindowManager.GuideWindow() == null){
            WindowManager.SetWindowFunction(GuideManager._OpenWindow, [type, x, y, width, height, msg], WindowManager.GuideWindow);
            return;
        }
        GuideManager._OpenWindow([type, x, y, width, height, msg]);
    }

    /**
     * 打开界面
     */
    private static _OpenWindow(param: any[]){
        WindowManager.GuideWindow().Show(param[0], param[1], param[2], param[3], param[4], param[5]);
        // UnitManager.CheckPlayGift();
    }

    /**
     * 是否在引导
     */
    public static get IsGuide(): boolean{
        return GuideManager._isGuide;
    }

    /**
     * 当前引导步骤
     */
    public static get GuideID(): number{
        return GuideManager._guideID;
    }

    // 变量
    private static _guideID: number;                    // 引导步骤ID
    private static _isStarGuide: boolean = false;       // 是否有开始过引导
    private static _isGuide: boolean = false;           // 是否在引导
}