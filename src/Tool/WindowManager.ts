/**
 * 界面管理
 */
class WindowManager{
    /**
     * 初始化
     */
    public static Init(){
        ProcessManager.AddProcess(WindowManager._Process);
    }

    /**
     * 开始界面
     */
    public static StarWindow(): StarWindow{
        if (WindowManager._starWindow == null){
            WindowManager._starWindow = new StarWindow();
        }
        return WindowManager._starWindow;
    }

    /**
     * 结束界面
     */
    public static EndWindow(isWait: boolean = true): EndWindow{
        if (ResReadyMgr.IsReady("endwindow")){
            if (WindowManager._endWindow == null){
                WindowManager._endWindow = new EndWindow();
            }
            return WindowManager._endWindow;
        }
        // Main.AddDebug("1");
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.EndWindow;
        }
        return null;
    }
    

    /**
     * 中间提示界面
     */
    public static CenterPromptPage(): CenterPromptPage{
        if (ResReadyMgr.IsReady("prompt")){
            if (WindowManager._centerPromptPage == null){
                WindowManager._centerPromptPage = new CenterPromptPage();
            }
            return WindowManager._centerPromptPage;
        }
        // Main.AddDebug("2");
        WindowManager._currentOpenWindow = WindowManager.CenterPromptPage;
        return null;
    }

    /**
     * 商店购买界面
     */
    public static ShopBuyPage(): ShopBuyPage{
        if (ResReadyMgr.IsReady("prompt")){
            if (WindowManager._shopBuyPage == null){
                WindowManager._shopBuyPage = new ShopBuyPage();
            }
            return WindowManager._shopBuyPage;
        }
        WindowManager._currentOpenWindow = WindowManager.ShopBuyPage;
        return null;
    }

    /**
     * 顶部提示界面
     */
    public static TopPromptPage(): TopPromptPage{
        if (ResReadyMgr.IsReady("prompt")){
            if (WindowManager._topPromptPage == null){
                WindowManager._topPromptPage = new TopPromptPage();
            }
            return WindowManager._topPromptPage;
        }
        // Main.AddDebug("3");
        WindowManager._currentOpenWindow = WindowManager.TopPromptPage;
        return null;
    }

    /**
     * 关卡游戏提示界面
     */
    public static GamePromptPage(): CheckpointTip{
        if (ResReadyMgr.IsReady("game")){
            if (WindowManager._gamePromptPage == null){
                WindowManager._gamePromptPage = new CheckpointTip();
            }
            return WindowManager._gamePromptPage;
        }
        // Main.AddDebug("4");
        WindowManager._currentOpenWindow = WindowManager.GamePromptPage;
        return null;
    }

    /**
     * 商店界面
     */
    public static ShopWindow(isWait: boolean = true): ShopWindow{
        if (ResReadyMgr.IsReady("shopwindow")){
            if (WindowManager._shopWindow == null){
                WindowManager._shopWindow = new ShopWindow();
            }
            return WindowManager._shopWindow;
        }
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.ShopWindow;
        }
        return null;
    }

    /**
     * 排行榜界面
     */
    public static RankWindow(isWait: boolean = true): RankWindow{
        if (ResReadyMgr.IsReady("rankwindow")){
            if (WindowManager._rankWindow == null){
                WindowManager._rankWindow = new RankWindow();
            }
            return WindowManager._rankWindow;
        }
        // Main.AddDebug("5");
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.RankWindow;
        }
        return null;
    }

    /**
     * 复活界面
     */
    public static ReviveWindow(): ReviveWindow{
        if (WindowManager._reviveWindow == null){
            WindowManager._reviveWindow = new ReviveWindow();
        }
        return WindowManager._reviveWindow;
    }

    /**
     * 成功失败界面
     */
    public static SuccFailWindow(): SuccFailPage{
        if (ResReadyMgr.IsReady("game")){
            if (WindowManager._succFailWindow == null){
                WindowManager._succFailWindow = new SuccFailPage();
            }
            return WindowManager._succFailWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.SuccFailWindow;
        return null;

        // if (WindowManager._succFailWindow == null){
        //     WindowManager._succFailWindow = new _succFailWindow();
        // }
        // return WindowManager._succFailWindow;
    }

    /**
     * 获得道具提示
     */
    public static GetItemTip(): GetItemTip{
        if (ResReadyMgr.IsReady("prompt")){
            if (WindowManager._getItemTip == null){
                WindowManager._getItemTip = new GetItemTip();
            }
            return WindowManager._getItemTip;
        }
        // Main.AddDebug("6");
        WindowManager._currentOpenWindow = WindowManager.GetItemTip;
        return null;
    }

    /**
     * 等待界面
     */
    public static WaitPage(): WaitPage{
        if (WindowManager._waitPage == null){
            WindowManager._waitPage = new WaitPage();
        }
        return WindowManager._waitPage;
    }

    /**
     * 角色获得界面
     */
    public static RoleGetPage(): RoleGetWindow{
        if (ResReadyMgr.IsReady("rolewindow")){
            if (WindowManager._roleGetPage == null){
                WindowManager._roleGetPage = new RoleGetWindow();
            }
            return WindowManager._roleGetPage;
        }
        WindowManager._currentOpenWindow = WindowManager.RoleGetPage;
        return null;
    }

    /**
     * 成就界面
     */
    public static AchievementWindow(): AchievementWindow{
        if (ResReadyMgr.IsReady("achievemenwindow")){
            if (WindowManager._achievementWindow == null){
                WindowManager._achievementWindow = new AchievementWindow();
            }
            return WindowManager._achievementWindow;
        }
        // Main.AddDebug("7");
        WindowManager._currentOpenWindow = WindowManager.AchievementWindow;
        return null;
    }

    /**
     * 成就提示界面界面
     */
    public static AchievementTip(isWait: boolean = true): AchievementTip{
        if (ResReadyMgr.IsReady("achievemenwindow")){
            if (WindowManager._achievementTip == null){
                WindowManager._achievementTip = new AchievementTip();
            }
            return WindowManager._achievementTip;
        }
        // Main.AddDebug("8");
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.AchievementTip;
        }
        return null;
    }

    /**
     * 成就详细界面
     */
    public static AchievementDetailPage(): AchievementDetailPage{
        if (ResReadyMgr.IsReady("achievemenwindow")){
            if (WindowManager._achievementDetailPage == null){
                WindowManager._achievementDetailPage = new AchievementDetailPage();
            }
            return WindowManager._achievementDetailPage;
        }
        // Main.AddDebug("9");
        WindowManager._currentOpenWindow = WindowManager.AchievementDetailPage;
        return null;
    }

    /**
     * 消息界面
     */
    public static NoticeWindow(): NoticePage{
        if(ResReadyMgr.IsReady("noticewindow")){
            if(WindowManager._noticeWindow == null){
                WindowManager._noticeWindow = new NoticePage();
            }
            return WindowManager._noticeWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.NoticeWindow;
        return null;
    }
    /**
     * 好友界面
     */
    public static FriendWindow(isWait: boolean = true): FriendPage{
        if (ResReadyMgr.IsReady("friendwindow")){
            if (WindowManager._friendWindow == null){
                WindowManager._friendWindow = new FriendPage();
            }
            return WindowManager._friendWindow;
        }
        // Main.AddDebug("11");
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.FriendWindow;
        }
        return null;
    }

    /**
     * 角色界面
     */
    public static RoleWindow(isWait: boolean = true): RolePage{
        if (ResReadyMgr.IsReady("rolewindow")){
            if (WindowManager._roleWindow == null){
                WindowManager._roleWindow = new RolePage();
            }
            return WindowManager._roleWindow;
        }
        // Main.AddDebug("12");
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.RoleWindow;
        }
        return null;
    }

    /**
     * 角色详情界面
     */
    public static RoleDetailWindow(): RoleDetail{
        if (WindowManager._roleDetailPage == null){
            WindowManager._roleDetailPage = new RoleDetail();
        }
        return WindowManager._roleDetailPage;
    }

    /**
     * 公告界面
     */
    public static NoticeDetailWindow(): NoticeDetailPage{
        if (WindowManager._noticeDetailPage == null){
            WindowManager._noticeDetailPage = new NoticeDetailPage();
        }
        return WindowManager._noticeDetailPage;
    }

    /**
     * 走马灯界面
     */
    public static RollingNoticeWindow(): RollingNoticeWindow{
        if (WindowManager._rollingNoticeWindow == null){
            WindowManager._rollingNoticeWindow = new RollingNoticeWindow();
        }
        return WindowManager._rollingNoticeWindow;
    }

    /**
     * 游戏UI
     */
    public static GameUI(): GameUI{
        if (WindowManager._gameUI == null){
            WindowManager._gameUI = new GameUI();
        }
        return WindowManager._gameUI;
    }

    /**
     * 游戏选择界面
     */
    public static RoleSelectWindow(isWait: boolean = true): RoleSelectWindow{
        if (ResReadyMgr.IsReady("roleselect")){
            if (WindowManager._roleSelectWindow == null){
                WindowManager._roleSelectWindow = new RoleSelectWindow();
            }
            return WindowManager._roleSelectWindow;
        }
        // Main.AddDebug("14");
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.RoleSelectWindow;
        }
        return null;
    }

    /**
     * 扫荡结算界面
     */
    public static RaidEndWindow(): RaidEndWindow{
        if (ResReadyMgr.IsReady("raidendwindow")){
            if (WindowManager._raidEndWindow == null){
                WindowManager._raidEndWindow = new RaidEndWindow();
            }
            return WindowManager._raidEndWindow;
        }
        // Main.AddDebug("15");
        WindowManager._currentOpenWindow = WindowManager.RaidEndWindow;
        return null;
    }

    /**
     * 引导界面
     */
    public static GuideWindow(): GuideWindow{
        if (ResReadyMgr.IsReady("guidewindow")){
            if (WindowManager._guideWindow == null){
                WindowManager._guideWindow = new GuideWindow();
            }
            return WindowManager._guideWindow;
        }
        // Main.AddDebug("16");
        // WindowManager._currentOpenWindow = WindowManager.GuideWindow;
        if (WindowManager._waitWindowSet.indexOf(WindowManager.GuideWindow) == -1){
            WindowManager._waitWindowSet.push(WindowManager.GuideWindow);
        }
        return null;
    }

    /**
     * VIP界面
     */
    public static VIPWindow(): VIPWindow{
        if (ResReadyMgr.IsReady("vipwindow")){
            if (WindowManager._vipWindow == null){
                WindowManager._vipWindow = new VIPWindow();
            }
            return WindowManager._vipWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.VIPWindow;
        return null;
    }

    /**
     * 日常活动预热界面
     */
    public static DailyActiveYuReWindow(): DailyActiveYuReWindow{
        if (ResReadyMgr.IsReady("dailyactive")){
            if (WindowManager._dailyActiveYuReWindow == null){
                WindowManager._dailyActiveYuReWindow = new DailyActiveYuReWindow();
            }
            return WindowManager._dailyActiveYuReWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.DailyActiveYuReWindow;
        return null;
    }

    /**
     * 日常活动获得奖励提示
     */
    public static DailyActiveRewardTip(): DailyActiveRewardTip{
        if (ResReadyMgr.IsReady("prompt")){
            if (WindowManager._dailyActiveRewardTip == null){
                WindowManager._dailyActiveRewardTip = new DailyActiveRewardTip();
            }
            return WindowManager._dailyActiveRewardTip;
        }
        // Main.AddDebug("6");
        WindowManager._currentOpenWindow = WindowManager.DailyActiveRewardTip;
        return null;
    }

    /**
     * 日常活动正式开始界面
     */
    public static DailyActiveStartWindow(): DailyActiveStartWindow{
        if (ResReadyMgr.IsReady("dailyactive")){
            if (WindowManager._dailyActivestartWindow == null){
                WindowManager._dailyActivestartWindow = new DailyActiveStartWindow();
            }
            return WindowManager._dailyActivestartWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.DailyActiveStartWindow;
        return null;
    }

    /**
     * 日常活动排名页面
     */
    public static DailyActiveRankWindow(): DailyActiveRankWindow{
        if (ResReadyMgr.IsReady("prompt")){
            if (WindowManager._dailyActiveRankWindow == null){
                WindowManager._dailyActiveRankWindow = new DailyActiveRankWindow();
            }
            return WindowManager._dailyActiveRankWindow;
        }
        // Main.AddDebug("6");
        WindowManager._currentOpenWindow = WindowManager.DailyActiveRankWindow;
        return null;
    }

    /**
     * 积分界面
     */
    public static IntegralWindow(): IntegralWindow{
        if (ResReadyMgr.IsReady("integralwindow")){
            if (WindowManager._integralWindow == null){
                WindowManager._integralWindow = new IntegralWindow();
            }
            return WindowManager._integralWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.IntegralWindow;
        return null;
    }

    /**
     * 积分规则界面
     */
    public static IntegralRuleWindow(): IntegralRuleWindow{
        if (ResReadyMgr.IsReady("prompt")){
            if (WindowManager._integralRuleWindow == null){
                WindowManager._integralRuleWindow = new IntegralRuleWindow();
            }
            return WindowManager._integralRuleWindow;
        }
        // Main.AddDebug("2");
        WindowManager._currentOpenWindow = WindowManager.IntegralRuleWindow;
        return null;
    }

    /**
     * 礼包界面
     */
    public static GiftWindow(): GiftWindow{
        if (ResReadyMgr.IsReady("giftwindow")){
            if (WindowManager._giftWindow == null){
                WindowManager._giftWindow = new GiftWindow();
            }
            return WindowManager._giftWindow;
        }
        // WindowManager._currentOpenWindow = WindowManager.GiftWindow;
        if (WindowManager._waitWindowSet.indexOf(WindowManager.GiftWindow) == -1){
            WindowManager._waitWindowSet.push(WindowManager.GiftWindow);
        }
        return null;
    }

    /**
     * 玩家新手礼包和7日礼包界面
     */
    public static PlayGiftWindow(): PlayGiftWindow{
        if (ResReadyMgr.IsReady("giftwindow")){
            if (WindowManager._playGiftWindow == null){
                WindowManager._playGiftWindow = new PlayGiftWindow();
            }
            return WindowManager._playGiftWindow;
        }
        // WindowManager._currentOpenWindow = WindowManager.PlayGiftWindow;
        if (WindowManager._waitWindowSet.indexOf(WindowManager.PlayGiftWindow) == -1){
            WindowManager._waitWindowSet.push(WindowManager.PlayGiftWindow);
        }
        return null;
    }

    /**
     * 背包界面
     */
    public static BagWindow(): BagWindow{
        if (ResReadyMgr.IsReady("bagwindow")){
            if (WindowManager._bagWindow == null){
                WindowManager._bagWindow = new BagWindow();
            }
            return WindowManager._bagWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.BagWindow;
        return null;
    }

    /**
     * 使用物品提示
     */
    public static UseItemTip(): UseItemTip{
        if (WindowManager._useItemTip == null){
            WindowManager._useItemTip = new UseItemTip();
        }
        return WindowManager._useItemTip;
    }

    /**
     * 奴隶界面
     */
    public static SlaveWindow(isWait: boolean = true): SlaveWindow{
        if (ResReadyMgr.IsReady("slavewindow")){
            if (WindowManager._slaveWindow == null){
                WindowManager._slaveWindow = new SlaveWindow();
            }
            return WindowManager._slaveWindow;
        }
        if (isWait){
            WindowManager._currentOpenWindow = WindowManager.SlaveWindow;
        }
        return null;
    }

    /**
     * 奴隶抓捕界面
     */
    public static SlaveCatchWindow(): SlaveCatchWindow{
        if (WindowManager._slaveCatchWindow == null){
            WindowManager._slaveCatchWindow = new SlaveCatchWindow();
        }
        return WindowManager._slaveCatchWindow;
    }

    /**
     * 奴隶战斗结算界面
     */
    public static SlaveEndWindow(): SlaveEndWindow{
        if (WindowManager._slaveEndWindow == null){
            WindowManager._slaveEndWindow = new SlaveEndWindow();
        }
        return WindowManager._slaveEndWindow;
    }

    /**
     * 奴隶互动界面
     */
    public static SlaveHDWindow(): SlaveHDWindow{
        if (ResReadyMgr.IsReady("slavewindow")){
            if (WindowManager._slaveHDWindow == null){
                WindowManager._slaveHDWindow = new SlaveHDWindow();
            }
            return WindowManager._slaveHDWindow;
        }
        return null;
    }

    /**
     * 首充界面
     */
    public static FirstChargeWindow(): FirstChargeWindow{
        if (ResReadyMgr.IsReady("vipwindow")){
            if (WindowManager._firstChargeWindow == null){
                WindowManager._firstChargeWindow = new FirstChargeWindow();
            }
            return WindowManager._firstChargeWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.FirstChargeWindow;
        return null;
    }

    /**
     * 收藏奖励界面
     */
    public static KeepRewardTip(): KeepRewardTip{
        if(WindowManager._keepRewardTip == null){
            WindowManager._keepRewardTip = new KeepRewardTip();
        }
        WindowManager._currentOpenWindow = WindowManager.KeepRewardTip;
        return WindowManager._keepRewardTip;
        // return null;
    }

    /**
     * 国庆活动界面
     */
    public static GuoQingActiveWindow(): GuoQingActiveWindow{
        if (ResReadyMgr.IsReady("active")){
            if (WindowManager._guoqingActiveWindow == null){
                WindowManager._guoqingActiveWindow = new GuoQingActiveWindow();
            }
            return WindowManager._guoqingActiveWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.GuoQingActiveWindow;
        return null;
    }

    /**
     * 国庆活动场景获得界面
     */
    public static GuoQingSceneWindow(): GuoQingSceneWindow{
        if (ResReadyMgr.IsReady("active")){
            if (WindowManager._guoqingSceneWindow == null){
                WindowManager._guoqingSceneWindow = new GuoQingSceneWindow();
            }
            return WindowManager._guoqingSceneWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.GuoQingSceneWindow;
        return null;
    }

    /**
     * 活动奖励领取
     */
    public static ActiveBonusWindow(): ActiveBonusWindow{
        if (ResReadyMgr.IsReady("giftwindow")){
            if (WindowManager._activeBonusWindow == null){
                WindowManager._activeBonusWindow = new ActiveBonusWindow();
            }
            return WindowManager._activeBonusWindow;
        }
        // WindowManager._currentOpenWindow = WindowManager.ActiveBonusWindow;
        if (WindowManager._waitWindowSet.indexOf(WindowManager.ActiveBonusWindow) == -1){
            WindowManager._waitWindowSet.push(WindowManager.ActiveBonusWindow);
        }
        return null;
    }

    /**
     * 设置界面
     */
    public static SetWindow(): SetWindow{
        if (ResReadyMgr.IsReady("setwindow")){
            if (WindowManager._setWindow == null){
                WindowManager._setWindow = new SetWindow();
            }
            return WindowManager._setWindow;
        }
        WindowManager._currentOpenWindow = WindowManager.SetWindow;
        return null;
    }
    
    /**
     * 设置等待回调
     * @param process       回调方法
     * @param paramSet      回调方法参数集合
     * @param window        界面
     */
    public static SetWindowFunction(process: Function, paramSet: any = null, window: any = null) {
        if (window == null){
            WindowManager._windowCompleteFunction = process;
            WindowManager._functionParamSet = paramSet;
        }
        else {
            WindowManager.WaitPage().IsVisibled = true;
            WindowManager._completedFunSet[window] = process;
            WindowManager._paramSet[window] = paramSet;
        }
    }

    /**
     * 资源加载结束调用
     */
    public static ResLoadEnd(){
        for (var i = 0; i < WindowManager._waitWindowSet.length; i++){
            if (WindowManager._waitWindowSet[i]() != null){
                var element: any = WindowManager._waitWindowSet[i];
                var fun: Function = WindowManager._completedFunSet[element];
                var param: any = WindowManager._paramSet[element];
                if (fun != null){
                    fun(param);
                    delete WindowManager._completedFunSet[element];
                }
                if (param != null){
                    delete WindowManager._paramSet[element];
                }
                WindowManager._waitWindowSet.splice(i, 1);
                i -= 1;
            }
        }
        if (WindowManager._waitWindowSet.length == 0 && WindowManager._currentOpenWindow == null){
            WindowManager.WaitPage().IsVisibled = false;
        }
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private static _Process(frameTime: number){
        if (WindowManager._currentOpenWindow == null) return;
        if (WindowManager._currentOpenWindow() != null){
            if (WindowManager._windowCompleteFunction != null) {
                WindowManager._windowCompleteFunction(WindowManager._functionParamSet);
                WindowManager._windowCompleteFunction = null;
                WindowManager._functionParamSet = null;
            }
            WindowManager._currentOpenWindow = null;
            if (WindowManager._currentOpenWindow == null && WindowManager._waitWindowSet.length == 0){
                WindowManager.WaitPage().IsVisibled = false;
            }
        }
        else {
            if (!WindowManager.WaitPage().IsVisibled){
                // Main.AddDebug("等待界面打开");
            }
            WindowManager.WaitPage().IsVisibled = true;
        }
    }

    // 变量
    private static _windowCompleteFunction: Function;                               // 界面资源加载完成调用
    private static _functionParamSet: any;                                          // 调用函数参数
    private static _currentOpenWindow: Function = null;                             // 当前打开界面
    private static _completedFunSet: Function[] = [];                               // 结束方法集合
    private static _paramSet: any[] = [];                                           // 结束参数集合
    private static _waitWindowSet: any[] = [];                                      // 等待界面集合

    private static _starWindow: StarWindow;                                         // 开始界面
    private static _endWindow: EndWindow;                                           // 结束界面
    private static _shopWindow: ShopWindow;                                         // 商店界面

    private static _rankWindow: RankWindow;                                         // 排行界面
    private static _reviveWindow: ReviveWindow;                                     // 复活界面
    private static _centerPromptPage: CenterPromptPage;                             // 中间提示界面
    private static _topPromptPage: TopPromptPage;                                   // 顶部提示界面
    private static _gamePromptPage: CheckpointTip;                                  // 关卡游戏内提示界面
    private static _getItemTip: GetItemTip;                                         // 获得道具提示
    private static _waitPage: WaitPage;                                             // 等待界面
    private static _achievementWindow: AchievementWindow;                           // 成就界面
    private static _achievementTip: AchievementTip;                                 // 成就提示
    private static _achievementDetailPage: AchievementDetailPage;                   // 成就详细页面
    private static _friendWindow: FriendPage;                                       // 好友界面
    private static _noticeWindow: NoticePage;                                       // 消息界面
    private static _roleWindow: RolePage;                                           // 角色界面
    private static _roleDetailPage: RoleDetail;                                     // 角色详情界面
    private static _noticeDetailPage: NoticeDetailPage;                             // 公告界面
    private static _gameUI: GameUI;                                                 // 游戏界面
    private static _roleSelectWindow: RoleSelectWindow;                             // 角色选择界面
    private static _raidEndWindow: RaidEndWindow;                                   // 扫荡结算界面
    private static _guideWindow: GuideWindow;                                       // 引导界面
    private static _succFailWindow: SuccFailPage;                                   // 成功失败界面
    private static _vipWindow: VIPWindow;                                           // VIP界面
    private static _shopBuyPage: ShopBuyPage;                                       // 购买详情界面
    private static _giftWindow: GiftWindow;                                         // 礼包界面
    private static _integralWindow: IntegralWindow;                                 // 积分界面
    private static _integralRuleWindow: IntegralRuleWindow;                         // 积分规则界面
    private static _bagWindow: BagWindow;                                           // 背包界面
    private static _useItemTip: UseItemTip;                                         // 使用物品提示
    private static _slaveWindow: SlaveWindow;                                       // 奴隶界面
    private static _slaveCatchWindow: SlaveCatchWindow;                             // 奴隶抓捕界面
    private static _slaveEndWindow: SlaveEndWindow;                                 // 奴隶结算界面
    private static _slaveHDWindow: SlaveHDWindow;                                   // 奴隶互动界面
    private static _firstChargeWindow: FirstChargeWindow;                           // 首充界面
    private static _dailyActiveYuReWindow: DailyActiveYuReWindow;                   // 日常活动预热界面
    private static _dailyActiveRewardTip: DailyActiveRewardTip;                     // 日常活动获得奖励界面
    private static _dailyActivestartWindow: DailyActiveStartWindow;                 // 日常活动正式开始界面
    private static _dailyActiveRankWindow: DailyActiveRankWindow;                   // 日常活动排名页面
    private static _keepRewardTip: KeepRewardTip;                                   // 收藏有礼提示页面
    private static _rollingNoticeWindow: RollingNoticeWindow;                       // 走马灯界面
    private static _roleGetPage: RoleGetWindow;                                     // 角色获得界面
    private static _playGiftWindow: PlayGiftWindow;                                 // 玩家新手礼包和7日礼包界面
    private static _guoqingActiveWindow: GuoQingActiveWindow;                       // 国庆活动界面
    private static _guoqingSceneWindow: GuoQingSceneWindow;                         // 国庆活动场景获得界面
    private static _activeBonusWindow: ActiveBonusWindow;                           // 活动奖励领取界面
    private static _setWindow: SetWindow;                                           // 设置界面
}