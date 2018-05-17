/**
 * 走马灯管理
 */
class RollingNoticeManager {
	/**
	 * 初始化
	 */
	public static Init(){
		RollingNoticeManager._radioJson = RES.getRes("radiodata_json");

		RollingNoticeManager._isInit = true;
		if(RollingNoticeManager.RollingNoticeSet.length > 0){
			WindowManager.RollingNoticeWindow().Show();
		}
	}

	/**
     * 接收走马灯监听
     */
    public static ReceiveRollingNotice(json: Object){
		RollingNoticeManager.AddRollingNotice(json["info"]);
    }


	/**
	 * 获取所有消息列表
	 */
	public static get RollingNoticeSet(): Object[]{
		return RollingNoticeManager._noticeSet;
	}

	/**
	 * 获取文本列表
	 */
	public static get RollingNoticeMsgSet(): JSON{
		return RollingNoticeManager._radioJson;
	}

	/**
	 * 是否初始化
	 */
	public static get IsInit(): boolean{
		return RollingNoticeManager._isInit;
	}

	/**
	 * 添加消息列表
	 */
	public static AddRollingNotice(object){
		RollingNoticeManager._noticeSet.push(object);

		if(RollingNoticeManager.IsInit && WindowManager.RollingNoticeWindow().IsVisibled == false){
			WindowManager.RollingNoticeWindow().Show();
		}
	}



	private static _noticeSet: Object[] = [];							// 走马灯消息
	private static _isInit: boolean = false;							// 是否初始化

	private static _radioJson: JSON = null;								// Json

}