/**
 * 好友管理器
 */
class FriendManager{

    /**
     * 初始化好友
     */
    public static Init(){
    }

    /**
     * 所有好友消息监听
     */
    public static FriendInfo(jsonData: Object){
        if (jsonData["info"] != null){
            for(let i = 0; i<jsonData["info"].length; i++) {
                let data = jsonData["info"][i];
                if(!data) {
                    continue;
                }
                let friend: Friend = new Friend(data);
                // 更新好友
                if(FriendManager.GetFriendByID(data["openid"]) == null){
                    FriendManager._AddFriend(friend);
                }else{
                    FriendManager.updataFrien = friend;
                }
            }
        }

        FriendManager.AddJiQiFriend();
        
        GameEvent.DispatchEvent(EventType.FriendUpData);
    }

    /**
     * 添加机器人
     */
    public static AddJiQiFriend(){
        if(FriendManager.AllFrienSet.length < 8){
            let data = {"openid":"-1","h":0,"icon":"","name":"鸡小萌","o":1002,"r":0,"s":1,"score":10000000,"sid":"2","status":1,"uid":-1};
            if(FriendManager.JiQiFriend == null){
                let friend: Friend = new Friend(data);
                FriendManager.JiQiFriend = friend;
            }
        }else{
            FriendManager.JiQiFriend = null;
        }
    }

    /**
     * 收好友给我点赞侦听
     */
    public static ShouHello(jsonData: Object){
        // 如果useid相同，更改那个的
        for(let i = 0;i<FriendManager.AllFrienSet.length; i++){
            if(FriendManager.AllFrienSet[i].OpenID == jsonData["info"]["src"]){
                FriendManager.AllFrienSet[i].ShouZan += 1;
                GameEvent.DispatchEvent(EventType.ShouHello);
                return;
            }
        }
    }

    /**
     * 收好友更改状态的消息
     */
    public static UpDataFriendState(jsonData: Object){
        // 如果useid相同，更改那个的
        for(let i = 0;i<FriendManager.AllFrienSet.length; i++){
            if(FriendManager.AllFrienSet[i].OpenID == jsonData["info"]["id"]){
                FriendManager.AllFrienSet[i].CurState = jsonData["info"]["value"];
                GameEvent.DispatchEvent(EventType.FriendChangState);
                return;
            }
        }
    }

    /**
     * 添加好友
     */
    private static _AddFriend(friend: Friend){
        FriendManager._friendSet.push(friend);
    }

    /**
     * 获取所有好友
     */
    public static get AllFrienSet():Friend[]{
		return FriendManager._friendSet;
    }

    /**
     * 通过onenID 获得好友
     * @param id    好友ID
     */
    public static GetFriendByID(id: string): Friend{
        for (var i = 0; i < FriendManager._friendSet.length; i++){
            if (FriendManager._friendSet[i].OpenID == id){
                return FriendManager._friendSet[i];
            }
        }
        return null;
    }

    /**
     * 通过onenID 更新好友
     * @param id    好友ID
     */
    public static set updataFrien(friend: Friend){
        for (var i = 0; i < FriendManager._friendSet.length; i++){
            if (FriendManager._friendSet[i].OpenID == friend.OpenID){
                FriendManager._friendSet[i] = friend;
            }
        }
    }
    
    /**
     * 添加机器人好友
     */
    public static set JiQiFriend(friend: Friend){
        FriendManager._jiqiFriend = friend;
    }

    /**
     * 获取机器人好友
     */
    public static get JiQiFriend():Friend{
		return FriendManager._jiqiFriend;
    }

    /**
     * 抓捕列表
     */
    public static get CatchList():Friend[]{
        var list: Friend[] =[];
        var slaveList: Friend[] = [];
        var noSlaveList: Friend[] =[];
        for (var i = 0; i < FriendManager._friendSet.length; i++){
            var friend: Friend = FriendManager._friendSet[i];
            if (friend.IsSlave){
                slaveList.push(friend);
            }
            else{
                noSlaveList.push(friend);
            }
        }
        list = noSlaveList.concat(slaveList);
        return list;
    }

    // 变量
    private static _friendSet: Friend[] = [];           // 好友集合
    private static _jiqiFriend: Friend;                 // 机器人好友
}