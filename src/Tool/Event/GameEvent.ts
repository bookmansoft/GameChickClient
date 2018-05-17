/**
 * 游戏事件
 */
class GameEvent{
    /**
     * 添加事件
     * @param type          事件类型
     * @param callback      事件回调
     * @param thisObject    绑定对象
     */
    public static AddEventListener(type: string, callback: Function, thisObject: any){
        GameEvent._eventDis.addEventListener(type, callback, thisObject);
    }

    /**
     * 移除事件
     * @param type          事件类型
     * @param callback      事件回调
     * @param thisObject    绑定对象
     */
    public static RemoveEventListener(type: string, callback: Function, thisObject: any){
        GameEvent._eventDis.removeEventListener(type, callback, thisObject);
    }

    /**
     * 触发事件
     * @param type          事件类型
     */
    public static DispatchEvent(type: string, data: any = null){
        egret.Event.dispatchEvent(GameEvent._eventDis, type, false, data);
    }


    // 变量
    private static _eventDis: egret.DisplayObject = new egret.DisplayObject();      // 事件绑定事件对象
}