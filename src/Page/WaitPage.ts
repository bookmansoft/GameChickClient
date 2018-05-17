/**
 * 等待页面
 */
class WaitPage extends AWindow{
	public constructor() {
		 super();
        this.skinName = "resource/game_skins/WaitPageSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._waitArm = new egret.MovieClip();
        this._waitArm.movieClipData = MovieManager.GetMovieClipData("wait_json","wait_png","wait");
        this.addChild(this._waitArm);
        this._waitArm.play(-1);
        
        this._waitArm.x = 640/2;
        this._waitArm.y = 1136/2;

        this._isCreated = true;
        if (this._waitWenBenSet.length == 0){
            var jsonData: JSON = RES.getRes("loadingtip_json");
            Object.keys(jsonData).map((id)=>{
                this._waitWenBenSet.push(jsonData[id]);
            });

            this._waitTime = 0;
            this._waitDianTime = 0;
            this._dianNum = 0;
            this.RandXianShiWenBen();
            this.judgeDianNum();
        }

        ProcessManager.AddProcess(this._Process.bind(this));
	}

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
        var lg: string = StringMgr.LanguageSuffix;
        if (StringMgr.Language == StringMgr.CN){
            this._cnImage.visible = true;
            this._enImage.visible = false;
            this._dianIma1.x = 528;
            this._dianIma2.x = 551;
            this._dianIma3.x = 574;
        }
        else {
            this._cnImage.visible = false;
            this._enImage.visible = true;
            this._dianIma1.x = 376;
            this._dianIma2.x = 399;
            this._dianIma3.x = 422;
        }
    }

	/**
     * 显示界面
     * @param callback 关闭回调
     */
    public Show(callback: Function = null){
        this._function = callback;
        this.IsVisibled = true;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            if (this._waitArm != null){
                this._waitArm.play(-1);
            }

            if(this._isCreated){
                this._waitTime = 0;
                this._waitDianTime = 0;
                this._dianNum = 0;
                this.RandXianShiWenBen();
                this.judgeDianNum();
            }

            if(Main.Instance)
                Main.Instance.TopLayer.addChild(this);
        }
        else{
            if(this._waitArm)
                this._waitArm.stop();
            if(this.parent)
                Main.Instance.TopLayer.removeChild(this);
            if (this._function != null){
                this._function();
            }
            this._function = null;
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

    /**
     * 随机显示文本
     */
    private RandXianShiWenBen(){
        let numSet: any[] = [];
        let num = 0;
        for(let i=0; i<2; i++){
            
            do{
                num = Math.random() * this._waitWenBenSet.length |0;
            }while(numSet.indexOf(num) != -1)

            numSet.push(num);

            if(i == 0)
                this._waitTipLabel1.text = StringMgr.GetText(this._waitWenBenSet[numSet[i]]["desc"]);
            else if(i == 1)
                this._waitTipLabel2.text = StringMgr.GetText(this._waitWenBenSet[numSet[i]]["desc"]);
        }
    }

    /**
     * 帧响应
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        if(!this.IsVisibled) return;

        this._waitTime += frameTime;
        this._waitDianTime += frameTime;

        if(this._waitTime >= 5000){
            this._waitTime -= 5000;
            this.RandXianShiWenBen();
        }

        if(this._waitDianTime >= 1000){
            this._waitDianTime -= 1000;
            this._dianNum += 1;
            this.judgeDianNum();
        }
    }

    /**
     * 判断出现几个点
     */
    private judgeDianNum(){
        var num: number = this._dianNum % 3;
        this._dianIma1.visible = true;
        this._dianIma2.visible = num >= 1;
        this._dianIma3.visible = num >= 2;
    }

	private _isVisibled: boolean = false;                       // 是否显示
	private _waitArm: egret.MovieClip;                          // 等待
    private _function: Function;                                // 关闭响应

    private _dianIma1: eui.Image;                               // 等待点1
    private _dianIma2: eui.Image;                               // 等待点2
    private _dianIma3: eui.Image;                               // 等待点3
    private _waitTipGroup: eui.Group;                           // 等待提示文本容器
    private _waitTipLabel1: eui.Label;                          // 等待提示文本1
    private _waitTipLabel2: eui.Label;                          // 等待提示文本2
    private _cnImage: eui.Image;                                // 中文图片
    private _enImage: eui.Image;                                // 英文图片

    private _waitWenBenSet: any[] = [];                         // 等待界面文本集合
    private _isCreated: boolean = false;                        // 页面是否创建完成

    private _waitTime: number = 0;                              // 已经等待了多少时间
    private _waitDianTime: number = 0;                          // 已经等待了多少时间
    private _dianNum: number = 0;                               // 显示第几个点
}