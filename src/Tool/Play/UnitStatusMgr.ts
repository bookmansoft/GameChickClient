/**
 * 角色状态管理
 */
class UnitStatusMgr{
    /**
     * 更新状态
     */
    public static UpdateStatus(jsonData: Object){
        UnitStatusMgr.Status = jsonData["info"];
    }

    /**
     * 角色状态值
     */
    public static set Status(value: number){
        if (value == UnitStatusMgr._userStatus) return;
        UnitStatusMgr._userStatus = value;
        GameEvent.DispatchEvent(EventType.UserStatusChange);
    }

    /**
     * 角色状态值
     */
    public static get Status(): number{
        return UnitStatusMgr._userStatus;
    }

    /**
     * 设置状态位
     * @param value         状态位
     * @param isTrue        状态
     */
    public static SetValue(value: number, isTrue: boolean = true){
        if (isTrue){
            UnitStatusMgr.Status = UnitStatusMgr.Status | value;
        }
        else{
            UnitStatusMgr.Status = UnitStatusMgr.Status & ~value;
        }
    }

    /**
     * 是否第一次分享
     */
    public static get IsFirstShare(): boolean{
        return UserStatus.IsFirstShare != (UnitStatusMgr._userStatus & UserStatus.IsFirstShare);
    }

    /**
     * 是否是新玩家
     */
    public static get IsNewPlay(): boolean{
        return UserStatus.IsNewbie == (UnitStatusMgr._userStatus & UserStatus.IsNewbie);
    }

    /**
     * 是否有新邮件
     */
    public static get HasNewMail(): boolean{
        return UserStatus.NewMsg == (UnitStatusMgr._userStatus & UserStatus.NewMsg);
    }

    /**
     * 是否是奴隶
     */
    public static get IsSlave(): boolean{
        return UserStatus.Slave == (UnitStatusMgr._userStatus & UserStatus.Slave);
    }

    /**
     * 是否是奴隶主
     */
    public static get IsMaster(): boolean{
        return UserStatus.Master == (UnitStatusMgr._userStatus & UserStatus.Master);
    }

    /**
     * 是否是自由身
     */
    public static get IsFreed(): boolean{
        return !UnitStatusMgr.IsSlave && !UnitStatusMgr.IsMaster;
    }

    /**
     * 是否完成首充消费
     */
    public static get IsFirstCharge(): boolean{
        return UserStatus.IsFirstCharge == (UnitStatusMgr._userStatus & UserStatus.IsFirstCharge);
    }

    /**
     * 是否领取首充奖励
     */
    public static get IsFirstChargeReward(): boolean{
        return UserStatus.IsFirstChargeReward == (UnitStatusMgr._userStatus & UserStatus.IsFirstChargeReward);
    }

    /**
     * 是否解锁火影场景
     */
    public static get IsUnlockNinjaScene(): boolean{
        return UserStatus.UnlockedNinjaScene == (UnitStatusMgr._userStatus & UserStatus.UnlockedNinjaScene);
    }

    /**
     * 是否领取过国庆活动礼包
     */
    public static get IsGetNinjaGift(): boolean{
        return UserStatus.IsGetNinjaGift == (UnitStatusMgr._userStatus & UserStatus.IsGetNinjaGift);
    }

    // 变量
    private static _userStatus: number = 0;                 // 玩家当前状态
}

/**
 * 角色状态枚举
 */
const enum UserStatus{
    ShareBonus = 1 << 1,            // 当前分享可以获得奖励
    NewMsg = 1 << 3,                // 有新的消息
    IsNewbie = 1 << 4,              // 新注册
    IsFirstShare = 1<< 5,           // 是否首次分享
    Online = 1 << 6,                // 当前在线
    Gaming = 1 << 7,                // 战斗中
    Slave = 1 << 8,                 // 成为奴隶
    Master = 1 << 9,                // 奴隶主
    IsFirstCharge = 1 << 10,        // 是否完成首充消费
    IsFirstChargeReward = 1 << 11,  // 首充奖励是否领取
    UnlockedNinjaScene = 1 << 15,   // 是否解锁火影场景
    IsGetNinjaGift = 1 << 16,       // 是否领取过国庆活动礼包
}