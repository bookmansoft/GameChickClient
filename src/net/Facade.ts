/**
 * MVC门脸
 */
class Facade {
    public constructor(){
        //初始化Socket连接
        this.SocketInit(NetManager.IndexServerInfo.host, NetManager.IndexServerInfo.port);
        ProcessManager.AddProcess(this._Process.bind(this));
    }
    private socket: SocketIOClient.Socket;//webSocket通讯组件
    private timerOfExpired: number = 0;                              // 超时检测时钟
    private timerOfResent:number = 0;                                // 重发时钟
    private timerOfActive:number = 0;                                // 心跳始终
    /**
     * 打印日志
     */
    private trace(msg:string):void {
    }
    public static instance(){
        if(!Facade._inst){
            Facade._inst = new Facade();
        }
        return Facade._inst;
    }
    private static _inst:Facade;
    /**
     * 建立WebSocket连接
     */
    public SocketInit(host, port){
        if(this.socket){
            this.socket.removeAllListeners();
            this.socket.disconnect();
        }
        var h: string = "https";
        if (Main.IsLocationDebug) h = "http";
        this.socket = io.connect(`${h}://${host}:${port}`, {forceNew: true});
        this.socket.on('notify', msg=>{
            if(!!this.notifyHandles[msg.type]){
                this.notifyHandles[msg.type](msg);
            }
            else if(!!this.notifyHandles["default"]){
                this.notifyHandles["default"](msg);
            }
        });
        //默认的下行消息处理
        this.watch(msg=>{
        });

        let self = this;
        this.socket.on('connect', function(){
            // Main.AddDebug("连接");
            if(this._ifHaveWaitPage == false && WindowManager.WaitPage()){
                this._ifHaveWaitPage = true;
                WindowManager.WaitPage().IsVisibled = false;
            }
            Facade.instance()._connectIng = false;
            Facade.instance()._time = 0;
            Facade.instance()._connNum = 0;

            if(this.huancunSet && this.huancunSet.length > 0){
                let data = this.huancunSet.shift();
                this.fetch(data[0],data[1]);
            }
        }.bind(this));

        this.socket.on('disconnect', function(){
            // Main.AddDebug("连接已断开");
            self.waitConnectFun();
        });
        this.socket.on('close', function(){
            // self.trace("连接已断开");
            // Main.AddDebug("关闭");
            self.waitConnectFun();
        });
        this.socket.on('error', function(){
            // Main.AddDebug("异常");
            self.socket.disconnect();
            //self.waitConnectFun();
        });
        this.socket.on('active', function(msg){//心跳包
            // Main.AddDebug("心跳包");
            self.timerOfExpired = 0; //收到心跳包，清除超时时钟
        });
    }
    /**
     * JSONP模式的远程调用：传入调用名称、参数对象、回调函数
     */
    public fetch(params, callback){
        if(!this.socket.connected){
            // Main.AddDebug("开始重连");
            let _isCun: boolean = false;
            if(this.huancunSet && this.huancunSet.length > 0){
                for(let i=0; i<this.huancunSet.length; i++){
                    if(this.huancunSet[i][0] == params){
                        _isCun = true;
                        break;
                    }
                }
            }
            if(_isCun == false){
                this.huancunSet.push([params,callback]);
            }

            this.waitConnectFun();
            return;
        }

        let pl = {};
        params.reduce((sofar, cur)=>{return sofar + cur}, '').split('&').map(it=>{
            let its = it.split('=');
            pl[its[0]] = its[1];
        });
        let fn = pl['func'].split('.');
        if(fn.length > 1){
            pl['control'] = fn[0];
            pl['func'] = fn[1];
        }
        this.socket.emit('req', pl, data => {
            this.timerOfExpired = 0; //收到业务包，清除超时时钟
            if (data != null && callback != null){
                callback(data);
            }
        });
    }

    /**
     * 断线重连
     */
    public waitConnectFun(){
        // if(Game.GameStatus == false && WindowManager.WaitPage() && WindowManager.WaitPage().IsVisibled == false){
        //     this._ifHaveWaitPage = false;
        //     WindowManager.WaitPage().IsVisibled = true;
        // }
        if(Facade.instance()._connectIng == false){
            Facade.instance()._time = 0;
        }
        Facade.instance()._connectIng = true;

        this.socket.connect();
    }

    /**
     * 帧响应
     * @param frameTime     两次调用间隔时间
     */
    public _Process(frameTime: number) {
        if (Facade.instance()._connectIng) {
            var timeOut: number = Facade.instance()._connNum >= 3? 1000 * 15 : 1000 * 3;
            Facade.instance()._time += frameTime;
            if (Facade.instance()._time >= timeOut) {
                // Main.AddDebug("链接超时。重新链接");
                Facade.instance()._time -= timeOut;
                Facade.instance()._connNum += 1;
                if(Facade.instance()._connNum < 6){
                    try{
                        Facade.instance().socket.connect();
                    }
                    catch(e){
                        console.error(e);
                    }
                }else{
                    Facade.instance()._connectIng = false;
                    Facade.instance()._connNum = 0;
                    Facade.instance()._time = 0;
                    if(this._ifHaveWaitPage == false && WindowManager.WaitPage()){
                        this._ifHaveWaitPage = true;
                        // Main.AddDebug(this._ifHaveWaitPage + "");
                        WindowManager.WaitPage().IsVisibled = false;
                    }
                    PromptManager.ShowWeihu();
                }
            }
        }
    }

    private huancunSet:any[] = [];
    /**
     * NOTIFY模式的远程调用：传入调用名称、参数对象，因为没有返回，所以也不需要传入回调函数
     */
    public notify(params){
        let fn = params.func.split('.');
        if(fn.length > 1){
            params.control = fn[0];
            params.func = fn[1];
        }
        this.socket.emit('notify', params);
    }
    /**
     * 注册服务端下行句柄
     */
    public watch(cb, etype = "default"){
        this.notifyHandles[etype] = cb;
        return this;
    }
    /**
     * 服务端下行处理的句柄列表
     */
    private notifyHandles = {}; 

    public _connectIng = false;         // 是否在链接中
    public _time: number = 0;           // 链接等待时间
    public _connNum: number = 0;        // 链接次数

    private _ifHaveWaitPage: boolean = true;   // 是否有等待页面

}
