/**
 * 排行榜界面
 */
class RankWindow extends AWindow{
    /**
     * 是否开始界面进入
     */
    public static IsOpenStar: boolean = false;

    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RankPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        // this._scroller.verticalScrollBar.thumb
        var group: eui.RadioButtonGroup = new eui.RadioButtonGroup();
        group.addEventListener(egret.Event.CHANGE, this._UpdataShow, this);
        this._totalRank.group = group;
        this._dayRank.group = group;
        this._friendRank.group = group;
        this._totalRank.value = 1;
        this._dayRank.value = 2;
        this._friendRank.value = 3;
    }

    /**
     * 更新文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        this._totalRank.skinName = SkinCreateMgr.CreateRadioButton("paihang_lsan_on" + lg + "_png", "paihang_lsan_off" + lg + "_png");
        this._dayRank.skinName = SkinCreateMgr.CreateRadioButton("paihang_dran_on" + lg + "_png", "paihang_dran_off" + lg + "_png", "dianzan_off" + lg + "_png");
        this._friendRank.skinName = SkinCreateMgr.CreateRadioButton("paihang_hyan_on" + lg + "_png", "paihang_hyan_off" + lg + "_png");
        // this._dayRank.selected = true;
        // this._totalRank.selected = true;

        this._text3.text = StringMgr.GetText("dailyactivetext1");

        if (StringMgr.Language == StringMgr.CN){
            this._text1.text = "名次";
            this._text2.text = "玩家名字";
        }
        else {
            this._text1.text = "Rank";
            this._text2.text = "Player";
        }
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowBottomLayer.addChild(this);
            this._GetData();
        }
        else{
            Main.Instance.WindowBottomLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	/**
     * 更新排行榜显示
     */
    private _UpdataShow(event: egret.Event){
        var radioValue: number = 1;
        // this._myRankList.visible = false;
        this._scroller.viewport.scrollV = 0;

        if (event != null){
            var radioGroup: eui.RadioButtonGroup = event.target;
            var radioValue: number = radioGroup.selectedValue;
        }
        else if(this._dayRank.selected){
            radioValue = 2;
        }
        else if(this._friendRank.selected){
            radioValue = 3;
        }
        var data: string[][] = this._totalRankSet;
        if (radioValue == 1) data = this._totalRankSet;
        else if (radioValue == 2) data = this._dayRankSet;
        else if (radioValue == 3){
            data = this._friendRankSet;
            // this._myRankList.visible = true;
        }

        while (this._showListSet.length > 0){
            var list: RankList = this._showListSet.pop();
            this._listGroup.removeChild(list);
            this._listSet.push(list);
        }
        if (data == null) return;
        var listY: number = 0;
        for (var i = 0; i < data.length; i++){
            var list: RankList;
            if (i >= this._listSet.length){
                list = new RankList();
            }
            else{
                list = this._listSet.pop();
            }
            list.y = listY;
            listY += list.height;
            list.SetData(data[i][0], data[i][1], data[i][2], data[i][3]);
            this._listGroup.addChild(list);
            this._showListSet.push(list);
        }

        if(this._ifRankUp == false && radioValue == 3 && UnitManager.Player.MaxScore >0){
            var list: RankList;
            if (data.length >= this._listSet.length){
                list = new RankList();
            }
            else{
                list = this._listSet.pop();
            }
            list.y = listY;
            listY += list.height;
            list.SetData(StringMgr.GetText("rankpagetext1"), UnitManager.Player.Name, UnitManager.Player.MaxScore.toString(), UnitManager.Player.HearUrl);
            this._listGroup.addChild(list);
            this._showListSet.push(list);
        }
    }

    /**
     * 获取排行榜数据
     */
    private _GetData(){
        // 获取总排行榜信息
        var data : JSON = JSON.parse("{}");
        data["token"] = UnitManager.Player.GameToken;
        NetManager.SendRequest(["func=" + NetNumber.Ranking + "&oemInfo=" + JSON.stringify(data)], this._ReceiveTotalRank.bind(this));
        NetManager.SendRequest(["func=" + NetNumber.DayRanking + "&oemInfo=" + JSON.stringify(data)], this._ReceiveDayRank.bind(this));
        NetManager.SendRequest(["func=" + NetNumber.FriendRanking + "&oemInfo=" + JSON.stringify(data)], this._ReceiveFriendRank.bind(this));
        // NetManager.SendRequest(["func=" + NetNumber.FriendInfor + "&uid=" + UnitManager.PlayerID],
        //                          this._ReceiveFriendRank.bind(this));
    }

    /**
     * 接收排行榜消息
     */
    private _ReceiveTotalRank(jsonData: Object){
        this._totalRankSet = [];
        var data: Object = jsonData["data"]["list"];
        for (var i = 0; i < data["length"]; i++){
            var rank: string = (i + 1).toString();
            // var name: string = data[i]["Name"];
            var name: string = decodeURIComponent(data[i]["name"]);
            var score: string = data[i]["score"];
            if(Main.IsLocationDebug)
                var imaUrl: string = "";
            else
                var imaUrl: string = data[i]["icon"];
            this._totalRankSet.push([rank, name, score, imaUrl]);
        }
        this._UpdataShow(null);
    }

    /**
     * 接收当日排行榜信息
     */
    private _ReceiveDayRank(jsonData: Object){
        this._dayRankSet = [];
        var data: Object = jsonData["data"]["list"];
        for (var i = 0; i < data["length"]; i++){
            var rank: string = (i + 1).toString();
            var name: string = decodeURIComponent(data[i]["name"]);
            var score: string = data[i]["score"];
            if(Main.IsLocationDebug)
                var imaUrl: string = "";
            else
                var imaUrl: string = data[i]["icon"];
            // imaUrl = "resource/res/common/chengjiu.png";
            this._dayRankSet.push([rank, name, score, imaUrl]);
        }
        this._UpdataShow(null);
    }

    /**
     * 接收好友排行榜消息
     */
    private _ReceiveFriendRank(jsonData: Object){
        this._friendRankSet = [];
        var data: Object = jsonData["data"]["list"];

        this._ifRankUp = false;
        
        if(data != null && data["length"] > 0)
        {
            for (var i = 0; i < data["length"]; i++){
                var rank: string = (i + 1).toString();
                var name: string = decodeURIComponent(data[i]["name"]);
                var score: string = data[i]["score"];
                if(Main.IsLocationDebug)
                    var imaUrl: string = "";
                else
                    var imaUrl: string = data[i]["icon"];
                this._friendRankSet.push([rank, name, score, imaUrl]);

                if(data[i]["openid"] == UnitManager.PlayerID){
                    this._ifRankUp = true;
                }
            }
        }
        this._UpdataShow(null);
    }
    
    // 变量
    private _isVisibled: boolean = false;       // 是否显示
    
    private _scroller: eui.Scroller;            // 列表
    private _listGroup: eui.Group;              // 列表容器

    private _totalRank: eui.RadioButton;        // 总排行按钮
    private _dayRank: eui.RadioButton;          // 当日排行按钮
    private _friendRank: eui.RadioButton;       // 好友排行按钮
    private _listSet: RankList[] = [];          // 列表集合
    private _showListSet: RankList[] = [];      // 显示列表集合
    private _totalRankSet: string[][];          // 总榜信息
    private _dayRankSet: string[][];            // 当日排行信息
    private _friendRankSet: string[][];         // 好友排行信息
    
    private _ifRankUp: boolean = false;         // 是否有上榜
    private _text1: eui.Label;
    private _text2: eui.Label;
    private _text3: eui.Label;

    // private _myRankList: MyRankList;            // 玩家自己的榜条
}