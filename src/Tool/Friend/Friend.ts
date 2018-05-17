/**
 * 好友
 */
class Friend{
    /**
     * 构造方法
     * @param json  数据Json串
     */
    public constructor(json: Object){
		this._openId = json["openid"] == null? "" : json["openid"];
		this._uId = json["uid"] == null? 0 : json["uid"];
		this._maxScore = json["score"] == null? 0 : json["score"];
		this._iconRes = json["icon"] == null? "" : json["icon"];
		this._name = json["name"] == null? "" : decodeURIComponent(json["name"]);
		this._curRoleId = json["o"] == null? 1001 : json["o"];
		this._curState = json["status"] == null? 0 : json["status"];
		this._qinmiNum = json["h"] == null? 0 : json["h"];
		this._shouZan = json["r"] == null? 0 : json["r"];
		this._senZan = json["s"] == null? 0 : json["s"];
        this._checkpointID = json["hisGateNo"] == null? 1 : json["hisGateNo"];
    }

    /**
     * userID
     */
    public get UID(): number{
        return this._uId;
    }

	/**
     * openID
     */
    public get OpenID(): string{
        return this._openId;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return this._name;
    }

    /**
     * 头像资源
     */
    public get IconRes(): string{
        return this._iconRes;
    }

	/**
     * 最高分
     */
    public get MaxScore(): number{
        return this._maxScore;
    }

	/**
     * 当前使用的角色的id
     */
    public get CurRoleId(): number{
        return this._curRoleId;
    }

    /**
     * 亲密度
     */
    public set QinMiNum(num:number){
        this._qinmiNum = num;
    }

	/**
     * 亲密度
     */
    public get QinMiNum(): number{
        return this._qinmiNum;
    }

	/**
     * 当前状态
     */
    public get CurState(): number{
        return this._curState;
    }

	/**
     * 当前状态
     */
    public set CurState(value:number){
        this._curState = value;
    }

	/**
     * 是否在线
     */
    public get IsOnline(): boolean{
        return UserStatus.Online == (this._curState & UserStatus.Online);
    }
    
	/**
     * 是否战斗中
     */
    public get IsGaming(): boolean{
        return UserStatus.Gaming == (this._curState & UserStatus.Gaming);
    }

	/**
     * 收到的赞
     */
    public get ShouZan(): number{
        return this._shouZan;
    }

	/**
     * 收到的赞
     */
    public set ShouZan(value:number){
        this._shouZan = value;
    }

	/**
     * 发出的赞
     */
    public get SendZan(): number{
        return this._senZan;
    }

	/**
     * 发出的赞
     */
    public set SendZan(value:number){
        this._senZan = value;
    }

	/**
     * 是否是主人
     */
    public get IsMaster(): boolean{
        return UserStatus.Master == (this._curState & UserStatus.Master);
    }

	/**
     * 是否是奴隶
     */
    public get IsSlave(): boolean{
        return UserStatus.Slave == (this._curState & UserStatus.Slave);
    }

	/**
     * 是否是自由身
     */
    public get IsFreed(): boolean{
        return !this.IsMaster && !this.IsSlave;
    }

	/**
     * 当前通过的最高关卡
     */
    public get CheckpointID(): number{
        return Math.max(this._checkpointID - 1, 1);
    }

    /**
     * 设置状态位
     * @param value         状态位
     * @param isTrue        状态
     */
    public SetValue(value: number, isTrue: boolean = true){
        if (isTrue){
            this._curState = this._curState | value;
        }
        else{
            this._curState = this._curState & ~value;
        }
    }

    // 变量
    private _uId: number;               // 用户ID
	private _openId: string;            // 开放ID
    private _name: string;              // 名字
    private _iconRes: string;           // 资源
	private _curRoleId: number;			// 当前使用的角色的id
	private _maxScore: number;			// 最高分数
	private _curState: number;			// 当前状态
	private _qinmiNum: number;			// 亲密度
	private _shouZan: number;			// 收到的赞
	private _senZan: number;			// 发出的赞
    private _checkpointID: number;      // 玩家当前关卡ID

    private _level: number;             // 等级
}