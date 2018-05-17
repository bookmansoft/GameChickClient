/**
 *
 * @author @srf
 *
 */
class ResReady {
	public constructor() {
	}
	// 设置名称
	public SetGroupName(resGroupName:string, priority:number) {
        this.m_resGroupName = resGroupName;
        this.m_priority = priority;
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);        
        //    开始加载
        RES.loadGroup(resGroupName, priority);
	}
	// 获得名称
	public GetGroupName():string {
        return this.m_resGroupName;
	}
	//    是否准备完毕
	public IsReady() {
        // RES.loadGroup(this.m_resGroupName, this.m_priority);
        return this.m_bReady;
	}	
    // 资源组加载出错
    private onResourceLoadError(event: RES.ResourceEvent): void {
        if (event.groupName == this.GetGroupName()) {
            //TODO
            console.warn("Group:" + event.groupName + " has failed to load");            
            if (++this.m_nowRetryTime < this.m_maxRetryTime) {
                RES.loadGroup( event.groupName);           
            } else {
                //忽略加载失败的项目
                this.onResourceLoadComplete(event);          
            }            
        }
    }   
    // game资源组加载完成
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if(event.groupName == this.GetGroupName()) {
            this.m_bReady = true;
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResProgress, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            if (Game.Instance == null || (Game.Instance != null && Game.Instance.parent == null)){
                ResReadyMgr.LoadGroup();
            }
            ResReadyMgr.GroupLoadEnd(event.groupName);
            WindowManager.ResLoadEnd();
        }
    }
    /**
     * 指定资源加载进度
     */
    private onResProgress(event: RES.ResourceEvent): void {
        // WindowManager.WindowLoading().SetProgress(event.itemsLoaded,event.itemsTotal);
    }
    
    // 私有变量
    // 资源组名
    private m_resGroupName: string = '';
    // 是否加载完毕
    private m_bReady: boolean = false;
    // 最大重试次数
    private m_maxRetryTime: number = 3;
    // 当前重试次数
    private m_nowRetryTime: number = 0;
    // 优先级
    private m_priority: number;
}