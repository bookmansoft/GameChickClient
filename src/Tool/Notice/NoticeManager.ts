/**
 * 消息管理
 */
class NoticeManager {
	public constructor() {
	}

	/**
     * 初始化，获取消息返回
     */
    public static updataNoticeReturn(jsonData: Object){
		NoticeManager._allNoticeSet = [];
        if (jsonData["code"] != NetManager.SuccessCode){
            Main.AddDebug("获取消息列表出错：" + jsonData["code"])
            return;
        }
		
        var _data: Object = jsonData["data"];
		
        Object.keys(_data).map((key)=>{
			let _notice: Notice = new Notice(_data[key]);
			NoticeManager._allNoticeSet.push(_notice);
        });
		
        GameEvent.DispatchEvent(EventType.NoticeUpData);
    }

	/**
	 * 获取所有消息列表
	 */
	public static get AllNoticeSet(): Notice[]{
		return NoticeManager._allNoticeSet;
	}

	/**
	 * 获取指点位置消息
	 */
	public static GetNoticeByPosiId($posiId: number): Notice{
		return NoticeManager._allNoticeSet[$posiId];
	}


	/**
	 * 获取消息文本配置
	 */
	public static GetNoticeDes($id: string): Object{
		if(NoticeManager._noticeJsonData == null){
			NoticeManager._noticeJsonData = RES.getRes("maildata_json");
		}

		return NoticeManager._noticeJsonData[$id];
	}

	private static _allNoticeSet: Notice[] = [];
	private static _noticeJsonData: JSON;
	private static _noticeDesSet: Object[] = [];
}