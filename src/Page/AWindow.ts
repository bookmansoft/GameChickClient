/**
 * 界面基类
 */
class AWindow extends eui.Component{
	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._UpdataText();
        GameEvent.AddEventListener(EventType.LanguageChange, this._UpdataText, this);
    }

    /**
     * 更新语言文本
     */
    protected _UpdataText(){
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return false;
    }
}