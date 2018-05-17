/**
 * 日常活动排行条
 */
class DailyActiveRankList extends eui.Component{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/DailyAcitveRankListSkins.exml";
        this.height = 72;
    }

	/**
     * 子项创建完成
     */
    // public SetData(rank: string, name: string, score: string, imaUrl: string = ""){
	public SetData(json: Object){
		let score = json["score"];
		let rank = json["rank"];
		let imaUrl = json["icon"];
		let name = json["name"] == null ? "": decodeURIComponent(json["name"]);
		
        this._nameLabel.text = name;
        this._scoreLabel.text = score;

        this._bonusNumLabel.text = json["bonus"].toString();

        
        this._scoreLabel.visible = WindowManager.DailyActiveStartWindow().State == "Active" ? true: false;
        this._bonusGroup.visible = !this._scoreLabel.visible;
        

        var rankIndex: number = parseInt(rank);
        var isBai: boolean = rankIndex % 2 == 1;
        this._bgImage.visible = isBai;

        if (rankIndex <= 3){
            this._rankNumLabel.visible = false;
            this._rankImage.visible = true;
            this._rankImage.texture = RES.getRes("mingci_" + rank + "_png");
            this._rankUserIma.visible = true;
            this._rankUserIma.texture = RES.getRes("touxiang_kuang_" + rank + "_png");
        }
        else{
            this._rankNumLabel.visible = true;
            this._rankImage.visible = false;
            this._rankUserIma.visible = false;
        }

        if(rank!="未上榜"){
            this._noRankLabel.visible = false;
            this._rankNumLabel.visible = true;
            this._rankNumLabel.text = rank;
        } 
        else{
            this._noRankLabel.visible = true;
            this._rankNumLabel.visible = false;
        }

        if(this._iconImaSource != imaUrl)
            this._userIma.source = "touxiang_mr_jpg";

		// 加载资源
		if(imaUrl != ""){
			let imaLoad = new egret.ImageLoader();
			imaLoad.load(imaUrl);
			imaLoad.addEventListener(egret.Event.COMPLETE,
				function (){
					this._userIma.source = imaLoad.data;
                    this._iconImaSource = imaUrl;
				},this);
		}
    }

    // 变量
    private _rankImage: eui.Image;                      // 排名图片
    // private _lanGroup: eui.Group;                       // 蓝色字组
    // private _lanLabel: eui.BitmapLabel;                 // 蓝色分数
    // private _lanNameLabel: eui.Label;                   // 蓝色名字
    // private _baiGroup: eui.Group;                       // 白色字组
    private _scoreLabel: eui.BitmapLabel;               // 分数文本
    private _nameLabel: eui.Label;                      // 名字文本
    private _bgImage: eui.Image;                        // 背景底图

    private _userIma: eui.Image;                        // 人物头像
    private _rankUserIma: eui.Image;                    // 人物头像排名图片
    private _rankNumLabel: eui.BitmapLabel;             // 排名
    private _noRankLabel: eui.Label;                    // 未上榜排名

    private _iconImaSource: string;					    // 存储头像链接

    private _bonusGroup: eui.Group;                     // 奖励容器
    private _bonusItemIma: eui.Image;                   // 奖励图片
    private _bonusNumLabel: eui.Label;                  // 奖励数量文本
}