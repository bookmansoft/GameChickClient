/**
 * 消息
 */
class Notice {
	/**
     * 构造方法
     * @param json  数据Json串
     */
    public constructor(json: Object){

        //联调
        this._time = json["time"];
        this._isRead = json["state"];

        this._bonus = [];

        let _content = null;
        if(json["content"].constructor == String){
            _content = JSON.parse(json["content"]); 
        }else{
            _content = json["content"]
        }

        if(_content["type"]){
            this._type = _content["type"];
        }

        if(_content["info"]){
            this._info = _content["info"];
        }

        if(this._info){
            this._sendOpenId = this._info["src"];
            this._reviceOpenId = this._info["dst"];

            if(this._info["bonus"]){
                // this._bonus.push(info["bonus"])
                this._bonus = this._info["bonus"];
            }

            if(this._info["rank"]){
                this._rank = this._info["rank"];
            }else{
                this._rank = 0;
            }
        }

        

        
    }

	/**
     * 描述
     */
    public get Des(): string{

        // 七夕活动奖励
        if(this.Type == 4100){
            if(this._rank == 1){
                this._des = StringMgr.GetText("noticetext1");
            }
            else if(this._rank == 2){
                this._des = StringMgr.GetText("noticetext2");
            }
            else if(this._rank == 3){
                this._des = StringMgr.GetText("noticetext3");
            }
            else if(this._rank > 3 && this._rank <= 100){
                var text: string = StringMgr.GetText("noticetext4");
                text = text.replace("&rank", this._rank.toString());
                this._des = text;
            }
            else{
                this._des = StringMgr.GetText("noticetext6");
            }
            
        }else if(this.Type == 4104){// 日常活动

            // 获取数量
            let _pinggaiNum = "";
            for(let i=0; i<this.BonusRes.length;i++){
                if(this.BonusRes[i]["type"] == "pinggai"){
                    _pinggaiNum = this.BonusRes[i]["num"];
                }
            }

            if(this._rank > 0 && this._rank <= 10){
                var text: string = StringMgr.GetText("noticetext7");
                text = text.replace("&rank", this._rank.toString());
                text = text.replace("&token", _pinggaiNum);
                this._des = text;
            }
            else{
                var text: string = StringMgr.GetText("noticetext10");
                text = text.replace("&token", _pinggaiNum);
                this._des = text;
            }
        }
        else{ // 奴隶消息

            let _id: string = "";

            let _isMoster: boolean = false;
            if(this._sendOpenId == UnitManager.Player.ID){
                _isMoster = true;
            }

            if(this.Type == 3121){// 抓捕
                // 奴隶收到
                // if(_isMoster == false){
                    if(this._info["code"] == 0){// 奴隶抓捕成功
                        _id = "1";
                    }else{// 抓捕失败
                        _id = "2";
                    }
                // }else{
                //     if(this._info["code"] == 0){// 奴隶主被抓捕成功
                //         _id = "3";
                //     }else{//抓捕失败
                //         _id = "2";
                //     }
                // }
                
            }else if(this.Type == 3105){// 释放
                // 奴隶收到
                // if(_isMoster == false){
                    if(this._info["early"] == 1){// 主动释放
                        _id = "10";
                    }else{// 时间到释放
                        _id = "12";
                    }
                // }
                // else{
                    // 原奴隶主收到
                    if(this.Bonus.length == 1){ // 奴隶主被抓，释放了奴隶
                        _id = "4";
                    }else if(this.Bonus.length == 2){
                        _id = "13";
                    }
                // }
            }
            else if(this.Type == 3103){// 反抗
                if(this._info["code"] == 0){// 反抗成功
                    _id = "7";
                }else{// 反抗失败
                    _id = "8";
                }
            }else if(this.Type == 3104){// 赎身。后续又会有个释放奖励
                _id = "9";
            }else if(this.Type == 3102){// 鞭挞
                _id = "19";
            }else if(this.Type == 3107){// 加餐
                _id = "20";
            }else if(this.Type == 3108){// 报复
                _id = "22";
            }else if(this.Type == 3109){// 谄媚
                _id = "21";
            }else if(this.Type == 3110){// 表扬
                _id = "18";
            }
            if(_id == ""){
                Main.AddDebug("出现没定义的消息类型：" + this.Type)
                _id = "12";
            }
            
            this._des = StringMgr.GetText(NoticeManager.GetNoticeDes(_id)["des"]);

            if (this._des != null){
                let _sendFriend: Friend = FriendManager.GetFriendByID(this._sendOpenId);
                let _reviceFriend: Friend = FriendManager.GetFriendByID(this._reviceOpenId);
                
                let _sendFriendName: string = StringMgr.GetText("noticetext12");
                let _reviceFriendName: string = StringMgr.GetText("noticetext12");
                
                if(_sendFriend){
                    _sendFriendName = _sendFriend.Name;
                }
                else{
                    if(this._sendOpenId == UnitManager.Player.ID){
                        _sendFriendName = UnitManager.Player.Name;
                    }
                }

                if(_reviceFriend){
                    _reviceFriendName = _reviceFriend.Name;
                }
                else{
                    if(this._reviceOpenId == UnitManager.Player.ID){
                        _reviceFriendName = UnitManager.Player.Name;
                    }
                }

                this._des = this._des.replace("&master", _sendFriendName);
                this._des = this._des.replace("&slave",_reviceFriendName);
            }
        }

        return this._des;
    }

	/**
     * 消息类型
     */
    public get Type(): number{
        return this._type;
    }

	/**
     * 时间
     */
    public get Time(): number{
        return this._time;
    }

	/**
     * 是否是玩家自己发送
     */
    public get IsMySend(): boolean{
        if( this._sendOpenId != UnitManager.PlayerID){
            this._isMySend = false;
        }else{
            this._isMySend = true;
        }

        return this._isMySend;
    }

	/**
     * 是否阅读过
     */
    public get IsRead(): boolean{
        if(this._isRead == 0) return false;
        else return true;
    }

	/**
     * 是否阅读过
     */
    public set IsRead($isRead: boolean){
        if($isRead) this._isRead = 1;
        else this._isRead = 0;
    }

    /**
     * 奖励
     */
    public get Bonus(): Object[]{
        return this._bonus;
    }

    /**
     * 奖励资源整理
     */
    public get BonusRes(): Object[]{
        let _bonusRes = PromptManager.GetBonusResData(this.Bonus, false);
        return _bonusRes;
    }

	private _des: string;            				// 消息描述
	private _type: number;            				// 消息类型 0 更新公告 1 挂机公告 2 系统公告
	private _isRead: number;            	        // 是否已阅读
	private _isMySend: boolean = false;           	// 是否是玩家自己发送
	private _time: number;            				// 时间
    private _sendOpenId: string;            		// 发送人openid
    private _reviceOpenId: string;            		// 收件人openid
    private _bonus: Object[] = [];            	    // 礼物
    private _info: Object;                          // 信息

    private _rank: number = 0;                      // 活动排名


}