/**
 * 冒泡提示
 */
class MaoPaoTip extends eui.Component{
	/**
     * 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/MaoPaoTipSkins.exml";
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

		this._isCreat = true;
		if(this.IsVisibled){
			this.upDataShow();
		}
    }

	/**
	 * 设置显示数据
	 * $msg 显示文本
	 * $type 冒泡类型 1 小冒泡 2 大冒泡
	 */
	public setData($msg: string, $type: number){
		this._msg = $msg;
		this._type = $type;
		this.upDataShow();
	}

	/**
	 * 显示
	 * $msg 文本
	 * $type 冒泡类型 1 小冒泡 2 大冒泡
	 */
	public upDataShow(){
		if(this._isCreat){
			if(this._type == 1){
				this._smallMaoPaoTipGroup.visible = true;
				this._bigMaoPaoTipGroup.visible = false;
				this._smallMaoPaoLabel.text = this._msg;

				this._smallMaoPaoTipGroup.x = -32;
				this._smallMaoPaoTipGroup.y = -70;
			}else{
				this._smallMaoPaoTipGroup.visible = false;
				this._bigMaoPaoTipGroup.visible = true;
				this._smallMaoPaoLabel.text = this._msg;

				this._bigMaoPaoTipGroup.x = -92;
				this._bigMaoPaoTipGroup.y = -122;
			}
		}
	}

	/**
	 * 显示动画
	 */
	private showAni(){
		egret.Tween.removeTweens(this);
		this.scaleX = 0;
		this.scaleY = 0;
		egret.Tween.get(this).to({scaleX:1,scaleY:1},500);
	}

	/**
	 * 消失动画
	 */
	private removeAni(){
		egret.Tween.removeTweens(this);
		this.scaleX = 1;
		this.scaleY = 1;
		egret.Tween.get(this).to({scaleX:0,scaleY:0},500).call(function(){
			this.visible = false;
		},this);
	}

	/**
     * 是否显示
     */
    public set IsVisibled(value: boolean){
        if (this._isVisibled == value) return;
        this._isVisibled = value;
        if (value){
			this.visible = true;
			this.upDataShow();
			this.showAni();
        }
        else{
			this.removeAni();
        }
    }

	/**
     * 是否显示
     */
    public get IsVisibled(): boolean{
        return this._isVisibled;
    }

	private _bigMaoPaoTipGroup: eui.Group;						// 大冒泡的容器
	private _smallMaoPaoTipGroup: eui.Group;					// 小冒泡的容器

	private _bigMaoPaoLabel: eui.Label;							// 大冒泡的文本
	private _smallMaoPaoLabel: eui.Label;						// 小冒泡的文本

	private _isVisibled: boolean = true;           				// 是否显示

	private _isCreat: boolean = false;							// 是否创建好

	private _type: number;										// 冒泡类型，大冒泡还是小冒泡
	private _msg: string;										// 冒泡文本
}