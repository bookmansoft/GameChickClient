/**
 *  跨域访问
 */
class JsonpReq {
    /**
     * 帧响应时间
     */
    public static process(loader: egret.URLLoader): void {
        JsonpReq.startLoader(loader);
    }

    /**
     * 加载script文件
     */
    private static startLoader(loader: egret.URLLoader): void {
        // if (Main.IsDebug) {
        //     var script = document.createElement('script');
        //     script.src = loader._request.url;
        //     document.body.appendChild(script);
        // }
        // else {
        //     loader.addEventListener(egret.Event.COMPLETE, JsonpReq.onComplete, this);
        //     loader.load(loader._request);
        // }
        loader.addEventListener(egret.Event.COMPLETE, JsonpReq.onComplete, this);
        loader.load(loader._request);
    }
    
    /**
     * 直接请求回调
     */
    public static onComplete(event: egret.Event): void {
        JsonpReq.OnGetComplete(event.target.data);
    }  

    /**
     * 信息获取处理
     */
    public static OnGetComplete(strData: string) {
        var data = strData;
        // if (!Main.IsDebug) {
        //     data = JSON.parse(strData);
        // }
        data = JSON.parse(strData);
        NetManager.OnGetComplete(data);
    }
} 