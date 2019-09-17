/**
 * 消息编号
 */
class NetNumber{
    /**
     * 登入1000
     */
    public static get Logoin(): string{
        return "index.login";
    }

    /**
     * 游戏接收，用户上报分数1001
     */
    public static get GameEnd(): number{
        return 1001;
    }

    /**
     * 使用道具1002
     */
    public static get UseItem(): number{
        return 1002;
    }

    /**
     * 内购1003
     */
    public static get BuyItem(): string{
        return 'shop.BuyShopItem';
    }

    /**
     * 获取用户信息1005
     */
    public static get PlayerInfomation(): number{
        return 1005;
    }

    /**
     * 积分购买1006
     */
    public static get BuyGold(): string {
        return 'shop.BuyItem';
    }

    /**
     * 切换角色和主题1009
     */
    public static get ChangeRoleOrTheme(): number{
        return 1009;
    }

    /**
     * 分享完成1010
     */
    public static get ShareEnd(): number{
        return 1010;
    }

    /**
     * 发送点赞消息编号
     */
    public static get SendHelloNum(): number{
        return 3004;
    }

    /**
     * 获取用户好友信息
     */
    public static get FriendInfor(): number{
        return 3005;
    }

    /**
     * 好友状态改变
     */
    public static get FriendUserStatus(): number{
        return 3010;
    }

    /**
     * 积分排行榜9000
     */
    public static get Ranking(): number{
        return 9000;
    }

    /**
     * 当日排行9001
     */
    public static get DayRanking(): number{
        return 9001;
    }

    /**
     * 好友排行9002
     */
    public static get FriendRanking(): number{
        return 9002;
    }

    /**
     * 获取成就状态列表列表
     */
    public static get AchievementList(): string{
        return "task.list";
    }

    /**
     * 成就领奖
     */
    public static get AchGetBonus(): string{
        return "task.getBonus";
    }

    /**
     * 获取关卡列表信息
     */
    public static get CheckpointList(): string{
        return "gate.query";
    }

    /**
     * 关卡开始
     */
    public static get CheckpointStar(): string{
        return "gate.start";
    }

    /**
     * 关卡结束
     */
    public static get CheckpointEnd(): string{
        return "gate.end";
    }

    /**
     * 关卡扫荡
     */
    public static get CheckpointRaid(): string{
        return "gate.sweep";
    }

    /**
     * 体力消息监听
     */
    public static get ReceivePhysical(): string{
        return "1";
    }

    /**
     * 获取角色列表
     */
    public static get RoleList(): string{
        return "role.list";
    }

    /**
     * 升级指定角色
     */
    public static get upRole(): string{
        return "role.upgrade";
    }

    /**
     * 扫荡领取奖励
     */
    public static get RaidReward(): string{
        return "gate.getSweepBonus";
    }

    /**
     * 成就完成
     */
    public static get AchievementComplete(): string{
        return "2001";
    }

    /**
     * 成就更新
     */
    public static get AchievementUpdate(): string{
        return "2002";
    }

    /**
     * 引导
     */
    public static get Guide(): string{
        return "5001";
    }

    /**
     * 引导奖励
     */
    public static get GuideBonus(): string{
        return "5002";
    }

    /**
     * 首次分享奖励
     */
    public static get ShareFirstBonus(): string{
        return "5003";
    }

    /**
     * 引导信息获取
     */
    public static get GuideInfo(): string{
        return "checkGuide";
    }

    /**
     * 引导完成
     */
    public static get GuideFinish(): string{
        return "guide.finish";
    }

    /**
     * 分享次数更新
     */
    public static get ShareTimeUpdate(): string{
        return "3006";
    }

    /**
     * VIP检测
     */
    public static get VIPCheck(): string{
        return "vip.checkValid";
    }

    /**
     * 每日礼包
     */
    public static get DayGift(): string{
        return "vip.draw";
    }

    /**
     * 玩家礼包（新手礼包和7日礼包）
     */
    public static get PlayGift(): string{
        return "getGift";
    }

    /**
     * VIP每日礼包
     */
    public static get VipDayGift(): string{
        return "vip.drawDaily";
    }

    /**
     * 首充奖励领取
     */
    public static get FirstChargeGift(): string{
        return "vip.drawFirstPurchaseBonus";
    }

    /**
     * 活动信息
     */
    public static get ActivityInfo(): string{
        return "activity.getInfo";
    }

    /**
     * 活动好友列表
     */
    public static get ActivityRankList(): string{
        return "activity.getList";
    }

    /**
     * 活动积分更新
     */
    public static get ActivityScore(): number{
        return 6000;
    }

    /**
     * 活动领奖
     */
    public static get ActivityGetBonus(): string{
        return "activity.getBonus";
    }

    /**
     * 角色状态更新
     */
    public static get UserStatusUpdate(): string{
        return "4";
    }

    /**
     * 开始抓捕
     */
    public static get StartCatch(): string{
        return "gate.startCatch";
    }

    /**
     * 抓捕结束
     */
    public static get EndCatch(): string{
        return "gate.catch";
    }

    /**
     * 不知道具体什么作用的消息，目前用到的地方是获取好友最高关卡ID
     */
    public static get SendHello(): string{
        return "sendHello";
    }

    /**
     * 获取消息列表
     */
    public static get GetNoticeList(): string{
        return "mail.getList";
    }

    /**
     * 发送阅读消息事件
     */
    public static get SendNoticeRead(): string{
        return "mail.read";
    }

    /**
     * 获取奴隶列表
     */
    public static get GetSlaveList(): string{
        return "social.getSlaveList";
    }

    /**
     * 反抗开始
     */
    public static get StartEscape(): string{
        return "gate.startEscape";
    }

    /**
     * 反抗结束
     */
    public static get EscapeEnd(): string{
        return "gate.escape";
    }

    /**
     * 购买次数
     */
    public static get BuyTimes(): string{
        return "3150";
    }

    /**
     * 奴隶列表
     */
    public static get SlaveList(): string{
        return "3106";
    }

    /**
     * 抓捕奴隶
     */
    public static get SlaveCatch(): string{
        return "3101";
    }

    /**
     * 抓捕奴隶结果
     */
    public static get SlaveCatchEnd(): string{
        return "3121"
    }

    /**
     * 奴隶反抗成功
     */
    public static get SlaveEscape(): string{
        return "3103";
    }

    /**
     * 奴隶反抗失败
     */
    public static get SlaveEscapeEnd(): string{
        return "3123";
    }

    /**
     * 奴隶赎身
     */
    public static get SlaveRansom(): string{
        return "3104";
    }

    /**
     * 奴隶释放
     */
    public static get SlaveRelease(): string{
        return "3105";
    }

    /**
     * 奴隶鞭挞
     */
    public static get SlaveLash(): string{
        return "3102";
    }

    /**
     * 奴隶加餐
     */
    public static get SlaveFood(): string{
        return "3107";
    }

    /**
     * 奴隶报复
     */
    public static get SlaveAvenge(): string{
        return "3108";
    }

    /**
     * 奴隶表扬
     */
    public static get SlavePraise(): string{
        return "3110";
    }

    /**
     * 奴隶谄媚
     */
    public static get SlaveFawn(): string{
        return "3109";
    }
    
    /**
     * 奴隶谄媚监听
     */
    public static get SlaveFawnWatch(): string{
        return "3111";
    }

    /**
     * 心跳包
     */
    public static get HeartBeat(): string{
        return "heartbeat";
    }

    /**
     * 日常活动信息获取
     */
    public static get GetDailyActiveInfo(): string{
        return "dailyactivity.getInfo";
    }

    /**
     * 添加奖池金额
     */
    public static get AddDailyActiveProp(): string{
        return "dailyactivity.addProp";
    }

    /**
     * 日常活动按钮是否显示
     */
    public static get DailyActiveButtonVisible(): string{
        return "4102";
    }

    /**
     * 日常活动排行
     */
    public static get DailyActiveRank(): string{
        return "dailyactivity.getList";
    }

    /**
     * 走马灯
     */
    public static get RollingNotice(): string{
        return "2";
    }

    /**
     * 升级角色技能
     */
    public static get upRoleSkill(): string{
        return "role.skill";
    }

    /**
     * 下发分享角色奖励
     */
    public static get ReceiveBonus(): string{
        return "7001";
    }
    /**
     * 下发分享场景奖励
     */
    public static get ReceiveShareScenceBonus(): string{
        return "7002";
    }

    /**
     * 活动信息初始化
     */
    public static get ActiveInfo(): string{
        return "task.getInfo";
    }

    /**
     * 活动奖励领取
     */
    public static get ActiveBonus(): string{
        return "getFesGift";
    }

    /**
     * 火影场所解锁
     */
    public static get NinjaSceneUnlock(): string{
        return "role.unlockedScene";
    }
}