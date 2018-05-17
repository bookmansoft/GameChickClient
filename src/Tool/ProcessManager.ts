/**
 * 帧响应管理
 */
class ProcessManager{
    /**
     * 帧监听初始化
     */
    public static Init(){
        egret.Ticker.getInstance().register(ProcessManager._Process, ProcessManager);
        WindowManager.Init();
    }

    /**
     * 计时更新
     * @param frameTime 调用时间间隔
     */
    private static _Process(frameTime: number){
        for (var i = 0; i < ProcessManager._functionSet.length; i++){
            ProcessManager._functionSet[i](frameTime);
        }
        var time: number = 5 * 60 * 1000;
        ProcessManager._timer += frameTime;
        if (ProcessManager._timer >= time){
            ProcessManager._timer -= time;
            Facade.instance().notify({"func":NetNumber.HeartBeat});
        }
    }

    /**
     * 添加帧响应
     * @param fun   帧监听
     */
    public static AddProcess(fun: Function){
        for (var i = 0; i < ProcessManager._functionSet.length; i++){
            if (ProcessManager._functionSet[i] == fun) return;
        }
        ProcessManager._functionSet.push(fun);
    }

    /**
     * 移除帧响应
     * @param fun   帧监听
     */
    public static RemoveProcess(fun: Function){
        for (var i = 0; i < ProcessManager._functionSet.length; i++){
            if (ProcessManager._functionSet[i] == fun){
                ProcessManager._functionSet.splice(i, 1);
                return;
            }
        }
    }
    
    // 变量
    private static _functionSet: Function[] = [];       // 方法集合
    private static _timer: number = 0;                  // 计时器
}