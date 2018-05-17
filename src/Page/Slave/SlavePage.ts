/**
 * 等待页面
 */
class SlavePage extends AWindow{
	public constructor() {
		super();
        this.skinName = "resource/game_skins/SlavePageSkins.exml";
        this.width = 266;
        this.height = 141;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._isCreated = true;
        ProcessManager.AddProcess(this._Process.bind(this));
        this._rentButton.visible = false;

        this._fCatchButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCatchClick, this);
        this._rentButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRentClick, this);
        this._mInterctiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnMasterHDClick, this);
        this._freedButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnFreedClcik, this);
        this._ransomButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRansomClick, this);
        this._sInterctiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSlaveHDClick, this);
        this._rebellionButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRebellionClick, this);
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._freeLabel.text = StringMgr.GetText("slavepagetext1");
        this._mInterctiveButton.skinName = SkinCreateMgr.CreateButton("nuli_an_hudong_l" + lg + "_png", "nuli_an_hudong_a" + lg + "_png");
        this._freedButton.skinName = SkinCreateMgr.CreateButton("nuli_an_shifang_l" + lg + "_png", "nuli_an_shifang_a" + lg + "_png");
        this._rentButton.skinName = SkinCreateMgr.CreateButton("nuli_an_shouzu_l" + lg + "_png", "nuli_an_shouzu_a" + lg + "_png");
        this._ransomButton.skinName = SkinCreateMgr.CreateButton("nuli_an_shushen_l" + lg + "_png", "nuli_an_shushen_a" + lg + "_png");
        this._sInterctiveButton.skinName = SkinCreateMgr.CreateButton("nuli_an_hudong_l" + lg + "_png", "nuli_an_hudong_a" + lg + "_png");
        this._rebellionButton.skinName = SkinCreateMgr.CreateButton("nuli_an_fankang_l" + lg + "_png", "nuli_an_fankang_a" + lg + "_png");
        this._fCatchButton.skinName = SkinCreateMgr.CreateButton("nuli_an_zhuabu_l" + lg + "_png", "nuli_an_zhuabu_a" + lg + "_png");
    }

    /**
     * 奴隶主收租点击响应
     */
    private _OnRentClick(){
        SoundManager.PlayButtonMusic();
    }

    /**
     * 奴隶主互动点击响应
     */
    private _OnMasterHDClick(){
        SoundManager.PlayButtonMusic();
        WindowManager.SlaveHDWindow().Show(true, this._slaveOpenid);
    }

    /**
     * 奴隶主释放点击响应
     */
    private _OnFreedClcik(){
        SoundManager.PlayButtonMusic();
        PromptManager.CreatCenterTip(false, false, StringMgr.GetText("slavepagetext36"), "", this._Freed.bind(this));
    }

    /**
     * 奴隶释放
     */
    private _Freed(){
        WindowManager.WaitPage().IsVisibled = true;
        NetManager.SendRequest(["func=" + NetNumber.SendHello, "&actionType=" + NetNumber.SlaveRelease,
                                "&openid=" + this._slaveOpenid],
                                this._ReleaseReturn.bind(this));
    }

    /**
     * 释放返回
     */
    private _ReleaseReturn(jsonData: Object){
    }

    /**
     * 奴隶赎身点击响应
     */
    private _OnRansomClick(){
        SoundManager.PlayButtonMusic();
        var consume: number = Math.ceil(this._time / 3600) * 1;
        if (!UnitManager.Player.TestPingGai(consume)){
            return;
        }
        var text: string = StringMgr.GetText("slavepagetext37");
        text = text.replace("&token", consume.toString());
        PromptManager.CreatCenterTip(false, false, text, "", this._Ransom.bind(this));
    }

    /**
     * 赎身
     */
    private _Ransom(){
        var consume: number = Math.ceil(this._time / 3600) * 1;
        var master: Object = SlaveManager.Master;
        if (master == null) return;
        WindowManager.WaitPage().IsVisibled = true;
        NetManager.SendRequest(["func=" + NetNumber.SendHello, "&actionType=" + NetNumber.SlaveRansom,
                                "&openid=" + master["openid"]],
                                this._RansomReturn.bind(this));
    }

    /**
     * 奴隶赎身返回
     */
    private _RansomReturn(jsonData: Object){
    }

    /**
     * 奴隶互动点击响应
     */
    private _OnSlaveHDClick(){
        SoundManager.PlayButtonMusic();
        WindowManager.SlaveHDWindow().Show(false);
    }

    /**
     * 奴隶反抗点击响应
     */
    private _OnRebellionClick(){
        SoundManager.PlayButtonMusic();
        if (!SlaveManager.CanEsvape){
            PromptManager.CreatCenterTip(false, true, StringMgr.GetText("slavepagetext39"));
            return;
        }
        WindowManager.WaitPage().IsVisibled = true;
        var master: Object = SlaveManager.Master;
        if (master == null) return;
        NetManager.SendRequest(["func=" + NetNumber.SendHello, "&actionType=3103", "&openid=" + master["openid"]]);
    }

    /**
     * 抓捕按钮点击响应
     */
    private _OnCatchClick(){
        WindowManager.SlaveCatchWindow().IsVisibled = true;
    }

    /**
     * 开启关卡ID
     */
    public set OpenCheckpointID(value: number){
        this._openCheckpointID = value;
    }

    /**
     * 开启关卡ID
     */
    public get OpenCheckpointID(): number{
        return this._openCheckpointID;
    }

    /**
     * 更新显示
     */
    public UpdateShow(index: number){
        var checkpointID: number = CheckpointManager.MaxCheckpointID;
        if (checkpointID < this._openCheckpointID){
            this._closeGroup.visible = true;
            this._openGroup.visible = false;
            var text: string = StringMgr.GetText("slavepagetext40");
            text = text.replace("&stage", this._openCheckpointID.toString());
            this._closeLabel.text = text;
        }
        else{
            this._closeGroup.visible = false;
            this._openGroup.visible = true;
        }
        this.visible = true;
        if (UnitStatusMgr.IsSlave){
            this.visible = index == 0;
            var master: Object = SlaveManager.Master;
            if (master == null){
                Main.AddDebug("奴隶主获取错误");
                return;
            }
            var friend: Friend = FriendManager.GetFriendByID(master["openid"]);
            if (friend == null){
                Main.AddDebug("奴隶主获取好友错误");
                return;
            }
            this._mButtonGroup.visible = false;
            this._fButtonGroup.visible = false;
            this._freeLabel.visible = false;
            this._contentGroup.visible = true;
            this._sButtonGroup.visible = true;
            this._headImage.source = friend.IconRes;
            this._nameLabel.text = friend.Name;
            this._borderImage.visible = false;
            this._time = master["time"];
            this._UpdateTime();
        }
        else if (UnitStatusMgr.IsMaster){
            var slaveSet: Object[] = SlaveManager.SlaveList;
            if (index >= slaveSet.length){
                this._mButtonGroup.visible = false;
                this._sButtonGroup.visible = false;
                this._contentGroup.visible = false;
                this._fButtonGroup.visible = true;
                this._freeLabel.visible = true;
                return;
            }
            this._slaveOpenid = slaveSet[index]["openid"];
            var friend: Friend = FriendManager.GetFriendByID(this._slaveOpenid);
            if (friend == null){
                Main.AddDebug("奴隶获取好友错误");
                return;
            }
            this._mButtonGroup.visible = true;
            this._fButtonGroup.visible = false;
            this._freeLabel.visible = false;
            this._contentGroup.visible = true;
            this._sButtonGroup.visible = false;
            this._headImage.source = friend.IconRes;
            this._nameLabel.text = friend.Name;
            this._borderImage.visible = true;
            this._time = slaveSet[index]["time"];
            this._UpdateTime();
        }
        else if (UnitStatusMgr.IsFreed){
            this._contentGroup.visible = false;
            this._mButtonGroup.visible = false;
            this._sButtonGroup.visible = false;
            this._fButtonGroup.visible = true;
            this._freeLabel.visible = true;
        }
    }

    /**
     * 更新时间
     */
    private _UpdateTime(){
        var timeText: string = FBSDKMgr.FormatTime(this._time);
        this._timeLabel.text = timeText + StringMgr.GetText("slavepagetext42");
    }

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        if (!this._contentGroup.visible) return;
        if (this._time <= 0) return;
        var time: number = 1000;
        this._timer += frameTime;
        if (this._timer >= time){
            this._timer -= time;
            this._time -= 1;
            this._UpdateTime();
        }
    }


    // 变量 
    private _isCreated: boolean = false;                        // 是否创建完成
    private _closeGroup: eui.Group;                             // 关闭组
    private _closeLabel: eui.Label;                             // 关闭文本
    private _openGroup: eui.Group;                              // 打开组
    private _mButtonGroup: eui.Group;                           // 主人按钮组
    private _rentButton: eui.Button;                            // 收租按钮
    private _mInterctiveButton: eui.Button;                     // 主人互动按钮
    private _freedButton: eui.Button;                           // 释放那妞
    private _sButtonGroup: eui.Group;                           // 奴隶按钮组
    private _ransomButton: eui.Button;                          // 赎身按钮
    private _sInterctiveButton: eui.Button;                     // 奴隶互动按钮
    private _rebellionButton: eui.Button;                       // 反抗按钮
    private _fButtonGroup: eui.Group;                           // 空闲组
    private _fCatchButton: eui.Button;                           // 抓捕按钮
    private _freeLabel: eui.Label;                              // 抓捕文本
    private _contentGroup: eui.Group;                           // 内容组
    private _headImage: eui.Image;                              // 头像图片
    private _borderImage: eui.Image;                            // 框图片
    private _nameLabel: eui.Label;                              // 名字文本
    private _timeLabel: eui.Label;                              // 时间文本
    
    private _openCheckpointID: number;                          // 开启关卡ID
    private _index: number = 0;                                 // 当前页面索引
    private _timer: number = 0;                                 // 计时器
    private _time: number = 0;                                  // 时间
    private _slaveOpenid: string;                               // 奴隶Openid
}