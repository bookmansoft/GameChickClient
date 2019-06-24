//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    /**
     * 是否正式版本
     */
    public static get IsOfficialVersion(): boolean{
        // return true;
        return false;
    }
    /**
     * 是否单机调试(正式版本为false)
     */
    public static get IsLocationDebug(): boolean{
        if (Main.IsOfficialVersion) return false;
        // return false;
        return true;
    }

    /**
     * 是否需要输出调试信息
     */
    public static get IsNeedDebugLog(): boolean{
        if (Main.IsOfficialVersion) return false;
        return false;
        // return true;
    }

    /**
     * 是否需要网络测试
     */
    public static get IsNeedNetDebug(): boolean{
        if (Main.IsOfficialVersion || !Main.IsLocationDebug) return true;
        return true;
        // return false;
    }

    /**
     * 是否播放声音(正式版本为true)
     */
    public static get IsPlayMusic(): boolean{
        if (Main.IsOfficialVersion) return true;
        return true;
        // return false;
    }

    /**
     * 是否使用CDN(正式版本为true)
     */
    public static get IsUseCDN(): boolean{
        if (Main.IsOfficialVersion) return true;
        return false;
        // return true;
    }

    /**
     * 游戏实例
     */
    public static get Instance(): Main{return Main._instance;}

    /**
     * 当前游戏应用版本
     */
    public static AppVersion: string = "2.5.0";

    /**
     * 当前游戏资源版本
     */
    public static ResVersion: string = "2.5.7";

    /**
     * CDN地址和资源版本号
     */
    public static CDNURL: string = Main.IsUseCDN ? "https://jxdcdn.173kw.com/res" + Main.ResVersion + "/" : "";

    /**
     * game资源是否加载完成
     */
    public static GameResLoad: boolean = false;

    /**
     * 是否创建完成
     */
    public static IsCreated: boolean = false;
    
    /**
     * 子项添加完成
     */
    protected createChildren(): void {
        super.createChildren();
        egret.ImageLoader.crossOrigin = "anonymous";
        RES.setMaxLoadingThread(8);

        this._gameLayer = new egret.DisplayObjectContainer();
        this._windowBottomLayer = new egret.DisplayObjectContainer();
        this._windowBottomLayer.width = 640;
        this._windowBottomLayer.height = 1136;
        this._windowTopLayer = new egret.DisplayObjectContainer();
        this._windowTopLayer.width = 640;
        this._windowTopLayer.height = 1136;
        Main._topLayer = new egret.DisplayObjectContainer();
        Main._topLayer.width = 640;
        Main._topLayer.height = 1136; 
        this._debugLayer = new egret.DisplayObjectContainer();
        this._debugLayer.touchEnabled = false;
        this._debugLayer.touchChildren = false;
        this.stage.addChild(this._gameLayer);
        // this.stage.addChild(this._windowBottomLayer);
        this.stage.addChild(this._windowTopLayer);
        this.stage.addChild(Main._topLayer);
        this.stage.addChild(this._debugLayer);
        this._InitDebug();

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter",assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        //Config loading process interface
        // initialize the Resource loading library
        //初始化Resource资源加载库
        // RES.loadConfig("config.json");
        // RES.getResAsync("config.json", this._OnLoadConfig, this);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this._OnConfigComplete, this);
        RES.loadConfig(Main.CDNURL + "resource/default.res.json", Main.CDNURL + "resource/");

        this._AddFunction();
        // FBSDKMgr.SetOnAddShortcutHandler();
        // FBSDKMgr.SetAppicon();
        this._LoadGonggao(); // 加载公告
    }

    /**
     * 公告配置
     */
    public static get GonggaoJson(): JSON{
        return Main._gonggaoJson;
    }

    /**
     * 添加方法
     */
    private _AddFunction(){
        /**
         * 取数组随机对象
         */
        Array.prototype["random"] = function(){
            if(this.length == 0){
                return null;
            }
            else if(this.length == 1){
                return this[0];
            }
            else{
                return this[(Math.random()*this.length)|0];
            }
        }
    }

    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private _OnConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this._OnConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme(Main.CDNURL + "resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this._OnThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._OnResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this._OnResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this._OnItemLoadError, this);
        RES.loadGroup("loading");
    }

    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private _OnThemeLoadComplete(): void {
        this._isThemeLoadEnd = true;
        this._CreateScene();
    }

    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private _OnResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "loading"){
            // RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this._OnResourceProgress, this);
            // Main.AddDebug("加载loading结束，开始加载preload");
            //设置加载进度界面
            StringMgr.Language = StringMgr.CN;
            this._loadingView = new LoadingUI();
            this._gameLayer.addChild(this._loadingView);

            RES.loadGroup("config");
        }
        if (event.groupName == "config") {
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this._OnResourceProgress, this);
            RES.loadGroup("gameloading");
        }
        else if (event.groupName == "gameloading") {
            this._isResourceLoadEnd = true;
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this._OnResourceProgress, this);
            this._CreateScene();
        }
        else if (event.groupName == "game"){
            Main.GameResLoad = true;
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._OnResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this._OnResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this._OnItemLoadError, this);
            if (this._isStartBattle){
                if (WindowManager.WaitPage() != null && WindowManager.WaitPage().IsVisibled){
                    WindowManager.WaitPage().IsVisibled = false;
                }
                this.StarBattle();
            }
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private _OnItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private _OnResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this._OnResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private _OnResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "gameloading") {
            this._loadingView.SetProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    /**
     * 加载公告
     */
    private _LoadGonggao(){
        // 临时注释公告拉取部分：
        // ori:
        // var url: string = "https://s4.app1105943531.qqopenapp.com/gonggao.json";
        // var loader = new egret.URLLoader();
        // loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        // var request = new egret.URLRequest(url); 
        // request.method = egret.URLRequestMethod.GET;
        // loader._request = request;
        // JsonpReq.process(loader);
        // loader.addEventListener(egret.Event.COMPLETE, this._loadGonggaoEnd, this);
        // loader.load(loader._request);
        // alt:
        if(this._isThemeLoadEnd && this._isResourceLoadEnd){
            this._CheckWeihu();
        }
        // end.
    }

    /**
     * 公告加载完成
     */
    private _loadGonggaoEnd(event: egret.Event){
        var json: JSON = JSON.parse(event.target.data);
        Main._gonggaoJson = json;
        if(this._isThemeLoadEnd && this._isResourceLoadEnd){
            this._CheckWeihu();
        }
    }

    /**
     * 检测维护
     */
    private _CheckWeihu(){
        if (Main._gonggaoJson != null){
            var weihu: JSON = Main._gonggaoJson["fuwuqiweihu"];
            if (weihu["isshow"]){
                PromptManager.ShowWeihu();
                return;
            }
        }
        this.StartCreateScene();
    }

    /**
     * 创建场景
     */
    private _CreateScene(){
        if(this._isThemeLoadEnd && this._isResourceLoadEnd){
            Main._instance = this;

            // FBSDKMgr.Init();
            // FBSDKMgr.Login();
            //登录成功后才进行回调
            LoginMgr.Login(this._CheckWeihu.bind(this));
        }
    }

    /**
     * 创建场景界面
     */
    public StartCreateScene(): void {
        if (!LoginMgr.LoginSuccess || !this._isResourceLoadEnd) 
            return;

        if (Main.IsCreated) 
            return;

        Main.IsCreated = true;
        // 初始化技能
        SkillManager.Init();
        // 角色初始化
        UnitManager.Init();
        // 物品初始化
        ItemManager.Init();
        // 关卡初始化
        CheckpointManager.Init();
        // 成就初始化
        AchievementManager.Init();
        // 活动初始化
        IntegralManager.Init();
        // 地图信息初始化
        MapManager.Init();
        // 播放背景音乐
        SoundManager.PlayBackgroundMusic();
        // 注册时间响应
        // egret.Ticker.getInstance().register(this._Process, this);
        ProcessManager.Init();
        // 移除加载界面
        this._loadingView.Destroy();
        this._gameLayer.removeChild(this._loadingView);
        // 总背景
        var image: eui.Image = ImagePool.GetImage("tongyong_di_jpg");
        // 显示开始界面
        this._windowBottomLayer.addChild(image);
        WindowManager.StarWindow().IsVisibled = true;

        RollingNoticeManager.Init();

        ProcessManager.AddProcess(this._Process.bind(this));
    }

    /**
     * 开始游戏
     */
    public StarBattle(){
        this._isStartBattle = true;
        if (!Main.GameResLoad){
            // Main.AddDebug("等待Game资源加载");
            ResReadyMgr.IsReady("game");
            WindowManager.WaitPage().IsVisibled = true;
            return;
        }
        if(this._game == null){
            this._game = new Game();
        }
        else {
            if (WindowManager.EndWindow() && WindowManager.EndWindow().IsVisibled){
                WindowManager.EndWindow().IsVisibled = false;
            }
            this._game.StarBattle();
        }
        this.GameLayer.addChild(this._game);
    }

    /**
     * 战斗结束
     */
    public BattleEnd(){
        if (this._game != null && this.GameLayer.contains(this._game)){
            this.GameLayer.removeChild(this._game);
        }
        ResReadyMgr.LoadGroup();
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private _Process(frameTime: number){
        var isInBg: boolean = false; //FBSDKMgr.AppInBackground;
        if (this._isInBackground == isInBg) return;
        this._isInBackground = isInBg;
        if (isInBg){
            SoundManager.YinYue = false;
        }
        else {
            SoundManager.YinYue = WindowManager.StarWindow().MusicStatus;
        }
    }

    /**
     * 资源是否加载完成
     */
    public get IsResourceLoadEnd(): boolean{
        return this._isResourceLoadEnd;
    }

    /**
     * 游戏层
     */
    public get GameLayer(): egret.DisplayObjectContainer{
        return this._gameLayer;
    }

    /**
     * 界面层级底层
     */
    public get WindowBottomLayer(): egret.DisplayObjectContainer{
        return this._windowBottomLayer;
    }

    /**
     * 界面层级高层
     */
    public get WindowTopLayer(): egret.DisplayObjectContainer{
        return this._windowTopLayer;
    }

    /**
     * 顶层
     */
    public get TopLayer(): egret.DisplayObjectContainer{
        return Main._topLayer;
    }

    /**
     * 调试层
     */
    public get DebugLayer(): egret.DisplayObjectContainer{
        return this._debugLayer;
    }

    /**
     * 顶层
     */
    public static get MainTopLayer(): egret.DisplayObjectContainer{
        return Main._topLayer;
    }

    /**
     * 初始化Debug文本
     */
    private _InitDebug(){
        if (!Main.IsNeedDebugLog) return;
        Main._debugStr = "";
        Main._debugText = new egret.TextField();
        Main._debugText.width = 640;
        Main._debugText.height = 1136;
        Main._debugText.textColor = 0x000000;
        Main._debugText.touchEnabled = false;
        Main._debugText.stroke = 1;
        Main._debugText.strokeColor = 0xffffff;
        Main._debugText.bold = true;
        Main._debugText.fontFamily = "微软雅黑";
        this._debugLayer.addChild(Main._debugText);
        Main.AddDebug("Debug文本初始化完成:" + Main.AppVersion);
    }

    /**
     * 添加debug信息
     */
    public static AddDebug(text: string){
        console.log(text);
        if (!Main.IsNeedDebugLog) return;
        Main._debugStr += text + "\n";
        Main._debugText.text = Main._debugStr;
        Main._debugText.scrollV = Math.max(Main._debugText.numLines - 37, 1);
    }

    // 变量
    private static _instance: Main;
    private static _gonggaoJson: JSON;                              // 公告json
    private static _topLayer: egret.DisplayObjectContainer;         // 顶层
    private _loadingView: LoadingUI;                                 // 加载进度界面
    private _isResourceLoadEnd: boolean = false;
    private _isThemeLoadEnd: boolean = false;
    private _gameLayer: egret.DisplayObjectContainer;               // 游戏层
    private _windowBottomLayer: egret.DisplayObjectContainer;       // 界面层0
    private _windowTopLayer: egret.DisplayObjectContainer;          // 界面层1
    private _debugLayer: egret.DisplayObjectContainer;              // 调试层
    private _isInBackground: boolean = false;                       // 是否在后台

    private _game: Game;                                            // 游戏界面
    private _isStartBattle: boolean = false;                        // 开始游戏

    private static _debugText: egret.TextField;                     // 调试文本
    private static _debugStr: string;                               // 调试文字
} 
