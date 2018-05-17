/**
 * 扫荡结束界面
 */
class RaidEndWindow extends AWindow{
    /**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/RaidEndSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._receiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        for(var i = 1; i <= 2; i ++){       // i值和皮肤中组件的命名相关
            this._groupSet.push(this["_awardGroup" + i]);
            this._imageSet.push(this["_image" + i]);
            this._labelSet.push(this["_label" + i]);
        }

        this._isCreated = true;
        if (this._bonus != null){
            this.Show(this._bonus);
        }
    }

	/**
     * 领取按钮点击响应
     */
    private _OnClick(){
        this.IsVisibled = false;
    }

	/**
     * 显示结算
     */
    public Show(bonus: Object[] = null){
        this._bonus = bonus;
        if (!this._isCreated){
            this.IsVisibled = true;
            return;
        }
        this.IsVisibled = true;
        for (var i= 0; i < this._groupSet.length; i++){
            this._groupSet[i].visible = false;
        }
        // 设置奖励
        var index: number = 0;
        if (bonus != null){
            let _bonusSet: Object[] = PromptManager.GetBonusResData(bonus,true);

            for (var i = 0; i < _bonusSet.length; i++){
                this._imageSet[index].source = _bonusSet[i]["res"];
                this._labelSet[index].text = _bonusSet[i]["name"] + " X" + _bonusSet[i]["num"];
                this._groupSet[index].visible = true;
                index += 1;
                if (index >= this._groupSet.length) break;
            }
        }
        if (this._awardGroup2.visible){
            this._bg.height = 481;
            this._receiveButton.y = 709;
        }
        else {
            this._bg.height = 481 - 120;
            this._receiveButton.y = 709 - 120;
        }
        this._bonus = null;
    }

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
            Main.Instance.WindowTopLayer.addChild(this);
        }
        else{
            Main.Instance.WindowTopLayer.removeChild(this);
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

    // 变量
    private _isCreated: boolean = false;        // 是否创建完成
    private _isVisibled: boolean = false;       // 是否显示
    private _bg: eui.Image;                     // 背景图片
    private _receiveButton: eui.Button;         // 领奖按钮
    private _awardGroup1: eui.Group;            // 奖励组1
    private _image1: eui.Image;                 // 奖励图片1
    private _label1: eui.Label;                 // 奖励文本1
    private _awardGroup2: eui.Group;            // 奖励组2
    private _image2: eui.Image;                 // 奖励图片2
    private _label2: eui.Label;                 // 奖励文本2
    private _groupSet: eui.Group[] = [];        // 奖励组集合
    private _imageSet: eui.Image[] = [];        // 奖励图片集合
    private _labelSet: eui.Label[] = [];        // 奖励文本集合
    private _bonus: Object[];                   // 奖励
}