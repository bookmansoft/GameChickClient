/**
 * 活动管理器
 */
class IntegralManager{

    /**
     * 接受活动信息
     */
    public static _ReceiveActivityInfo(jsonData: Object){
		let code: number = jsonData["code"];
		let data: Object = jsonData["data"];
        if (code == NetManager.SuccessCode){
			if(data["act"])
				IntegralManager.GitState = data["act"];
			IntegralManager.ID = data["id"];
			IntegralManager.Type = data["type"];
			IntegralManager.State = data["state"];
			if(data["score"])
				IntegralManager.Score = data["score"];
			if(data["starttime"])
				IntegralManager.StartTime = data["starttime"];
			if(data["endtime"]){
				IntegralManager.EndTime = data["endtime"];
			}
			if(data["rank"]){
				IntegralManager.RankNum = data["rank"];
			}
		}
    }

	/**
     * 初始化
     */
    public static Init(){
		// 活动类型
		let _typeJsonData: JSON = RES.getRes("eventsdata_json");
		Object.keys(_typeJsonData).map((id)=>{
			let data: Object = _typeJsonData[id];
			data["id"] = id;
			IntegralManager._IntegralTypeDataSet.push(data);
		});

		// 兑换奖励
		let _exchangeJsonData: JSON = RES.getRes("integralrewards_json");
		Object.keys(_exchangeJsonData).map((id)=>{
			let data: Object = _exchangeJsonData[id];
			IntegralManager._IntegralExchangeDataSet.push(data);
		});

		// 排名奖励
		let _rankJsonData: JSON = RES.getRes("integralrankrewards_json");
		Object.keys(_rankJsonData).map((id)=>{
			let data: Object = _rankJsonData[id];
			IntegralManager._IntegralRankDataSet.push(data);
		});
    }

	/**
	 * 更新积分
	 */
	public static UpDataScore(jsonData: Object){
        let data: number = jsonData["info"];
		IntegralManager.Score = data;
		
    }


	/**
	 * 获取活动信息
	 */
	public static IntegralInformation(): Object{
		let _info:Object = null;

		for(let i = 0; i<IntegralManager._IntegralTypeDataSet.length; i++){
			if(IntegralManager._IntegralTypeDataSet[i]["id"] == IntegralManager.Type){
				_info = IntegralManager._IntegralTypeDataSet[i];
			}
		}

		return _info;
	}

	/**
	 * 获取兑换奖励
	 */
	public static IntegralExchangeRewardsData(): Object[]{
		let dataSet: any[] = [];
		
		for(let i = 0; i<IntegralManager._IntegralExchangeDataSet.length; i++){
			if(IntegralManager._IntegralExchangeDataSet[i]["eventid"] == IntegralManager.Type){
				dataSet.push(IntegralManager._IntegralExchangeDataSet[i]);
			}
		}

		return dataSet;
	}


	/**
	 * 获取排名奖励
	 */
	public static IntegralRankRewards(): Object[]{
		let dataSet: any[] = [];

		for(let i = 0; i<IntegralManager._IntegralRankDataSet.length; i++){
			if(IntegralManager._IntegralRankDataSet[i]["eventid"] == IntegralManager.Type){
				dataSet.push(IntegralManager._IntegralRankDataSet[i]);
			}
		}

		return dataSet;
	}

	/**
	 * 设置排名
	 */
	public static set RankNum(v : number) {
		IntegralManager._rankNum = v;
	}

	/**
	 * 获取排名
	 */
	public static get RankNum(): number {
		return IntegralManager._rankNum;
	}

	/**
	 * 设置活动编号
	 */
	public static set ID(v : number) {
		IntegralManager._id = v;
	}

	/**
	 * 获取活动编号
	 */
	public static get ID(): number {
		return IntegralManager._id;
	}

	/**
	 * 设置活动类型
	 */
	public static set Type(v : number) {
		IntegralManager._type = v;
	}

	/**
	 * 获取活动类型
	 */
	public static get Type(): number {
		return IntegralManager._type;
	}

	/**
	 * 设置活动状态
	 */
	public static set State(v : string) {
		IntegralManager._state = v;
	}

	/**
	 * 获取活动状态
	 */
	public static get State(): string {
		return IntegralManager._state;
	}

	/**
	 * 设置活动积分
	 */
	public static set Score(v : number) {
		IntegralManager._score = v;
		GameEvent.DispatchEvent(EventType.ActivityScore);
	}

	/**
	 * 获取活动积分
	 */
	public static get Score(): number {
		return IntegralManager._score;
	}

	/**
	 * 设置活动开始时间
	 */
	public static set StartTime(v : string) {
		IntegralManager._startTime = v;
	}

	/**
	 * 获取活动开始时间
	 */
	public static get StartTime(): string {
		return IntegralManager._startTime;
	}

	/**
	 * 设置活动结束时间
	 */
	public static set EndTime(v : string) {
		IntegralManager._endTime = v;
	}

	/**
	 * 获取活动结束时间
	 */
	public static get EndTime(): string {
		return IntegralManager._endTime;
	}

	/**
	 * 设置活动兑换礼包状态
	 */
	public static set GitState(v : number[]) {
		IntegralManager._gitState = v;
		GameEvent.DispatchEvent(EventType.ActivityExchangeState);
	}

	/**
	 * 设置活动兑换礼包状态
	 */
	public static GitStateById(i : number, v:number) {
		IntegralManager._gitState[i] = v;
		GameEvent.DispatchEvent(EventType.ActivityExchangeState);
	}

	/**
	 * 获取活动兑换礼包状态
	 */
	public static get GitState():  number[] {
		return IntegralManager._gitState;
	}

	// /**
	//  * 设置活动排名礼包状态
	//  */
	// public static set RankGitState(v : number) {
	// 	IntegralManager._rankGitState = v;
	// }

	// /**
	//  * 获取活动排名礼包状态
	//  */
	// public static get RankGitState():  number {
	// 	return IntegralManager._rankGitState;
	// }
	



	private static _id: number;											// 活动编号
	private static _type: number;										// 活动类型
	private static _IntegralTypeDataSet: any[] = [];                  	// 活动类型JSON
    private static _IntegralRankDataSet: any[] = [];                  	// 活动排名奖励JSON
    private static _IntegralExchangeDataSet: any[] = [];               	// 活动兑换奖励JSON

	private static _state: string = "";               					// 活动状态
	private static _score: number = 0;               					// 活动积分
	private static _startTime: string = "xxxx/xx/xx";               	// 活动开始时间
	private static _endTime: string = "xxxx/xx/xx";               		// 活动结束时间
	private static _gitState: number[] = [];               				// 活动礼包状态 0 是排行礼包 1-n 兑换礼包 值：0 表示没领取 1 表示已领取
	private static _rankNum: number = 0;								// 排名

}