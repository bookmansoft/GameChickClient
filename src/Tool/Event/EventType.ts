/**
 * 事件类型
 */
class EventType{
    /**
     * 金钱改变
     */
    public static get MoneyChange(): string{return "moneyChange";}

    /**
     * 瓶盖改变
     */
    public static get PingGaiChange(): string{return "pingGaiChange";}

    /**
     * 更新成就数据
     */
    public static get AchieveUpdata(): string{return "achieveUpata";}

    /**
     * 角色生命值修改
     */
    public static get RoleLifeChange(): string{return "roleLifeChange";}

    /**
     * 游戏分数改变
     */
    public static get GameScoreChange(): string{return "gameScroeChange";}

    /**
     * 游戏金币改变
     */
    public static get GameMoneyChange(): string{return "gameMoneyChange";}

    /**
     * 玩家头像修改
     */
    public static get PlayerHeadChange(): string{return "playerHeadChange";}

    /**
     * 体力时间改变
     */
    public static get PhysicalTimeChange(): string{return "physicalTimeChange";}

    /**
     * 体力改变
     */
    public static get PhysicalChange(): string{return "physicalChange";}

    /**
     * 体力最大值改变
     */
    public static get MaxPhysicalChange(): string{return "maxPhysicalChange";}

    /**
     * 游戏事件改变事件
     */
    public static get GameTimeChange(): string{return "gameTimeChange";}

    /**
     * 游戏结束事件
     */
    public static get GameEnd(): string{return "gameEnd";}

    /**
     * 关卡通过
     */
    public static get CheckpointPass(): string{return"checkpointPass";}

    /**
     * 角色等级提升
     */
    public static get RoleUpLevel(): string{return "roleUpLevel";}

    /**
     * 游戏开始
     */
    public static get GameStart(): string{return "gameStart";}

    /**
     * 关卡扫荡时间更新响应
     */
    public static get CheckpointRaidTimeUpdate(): string{return "checkpointRaidTimeUpdate";}

    /**
     * 好友信息更新
     */
    public static get FriendUpData(): string{return "friendUpData";}

    /**
     * 收到赞
     */
    public static get ShouHello(): string{return "shouHello";}

    /**
     * 好友改变在线状态
     */
    public static get FriendChangState(): string{return "friendChangState";}

    /**
     * 角色血量为0
     */
    public static get RoleLifeEmpty(): string{return "roleLifeEmpty";}

    /**
     * 角色复活
     */
    public static get RoleRevive(): string{return "roleRevive";}

    /**
     * 关卡星级更新
     */
    public static get CheckpointStarUpdata(): string{return "checkPointStarUpdata";}

    /**
     * 复活物品数量更新
     */
    public static get ReviveItemUpdate(): string{return "reviveItemUpdate";}

    /**
     * 角色碎片物品数量更新
     */
    public static get RoleSuiPianItemUpdate(): string{return "roleSuiPianItemUpdate";}

    /**
     * VIP时间更新
     */
    public static get VIPTimeUpdate(): string{return "vipTimeUpdate";}

    /**
     * 活动兑换礼包状态更新
     */
    public static get ActivityExchangeState(): string{return "ActivityExchangeState";}

    /**
     * 活动积分更新
     */
    public static get ActivityScore(): string{return "ActivityScore";}

    /**
     * 使用物品
     */
    public static get UseItem(): string{return "useItem";}

    /**
     * 消息邮件更新
     */
    public static get NoticeUpData(): string{return "noticeUpData";}

    /**
     * 玩家状态改变
     */
    public static get UserStatusChange(): string{return "userStatusChange";}

    /**
     * 奴隶系统更新
     */
    public static get SlaveInfoChange(): string{return "slaveInfoChange";}

    /**
     * 消息邮件红点更新
     */
    public static get NoticeUpDataResIma(): string{return "noticeUpDataResIma";}

    /**
     * 努力系统次数抓捕和反抗次数更新
     */
    public static get SlaveTimesUpdate(): string{return "slaveTimesUpdate";}

    /**
     * 奴隶互动次数更新
     */
    public static get SlaveHDTimesUpdate(): string{return "slaveHDTimesUpdate";}

    /**
     * 奴隶互动物品数量更新
     */
    public static get SlaveItemUpdate(): string{return "slaveItemUpdate";}

    /**
     * 奴隶系统时间更新
     */
    public static get SlaveTimeChange(): string{return "slaveTimeChange";}

    /**
     * 奴隶互动CD时间改变
     */
    public static get SlaveHDCDChange(): string{return "SlaveHDCDChange";}

    /**
     * VIP每日领奖次数更新
     */
    public static get VIPRewardTimesChange(): string{return "vipRewardTimesChange";}

    /**
     * 日常活动状态更新
     */
    public static get DailyAcitveStateUpData(): string{return "dailyAcitveStateUpData";}
    /**
     * 角色技能提升
     */
    public static get RoleSkillUpLevel(): string{return "roleSkillUpLevel";}
    /**
     * 选择关卡
     */
    public static get ChooseCheckPonit(): string{return "chooseCheckPonit";}
    /**
     * 开始解锁动画
     */
    public static get StartCheckPassAni(): string{return"startCheckPassAni";}
    /**
     * 语言切换
     */
    public static get LanguageChange(): string{return "languagechange";}
}