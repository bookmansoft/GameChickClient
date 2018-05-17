/**
 * 游戏内技能发动提示
 */
class GameSkill extends eui.Component{
	/**
     * 构造方法
     */
    public constructor($skillId: number){
        super();
        this.skinName = "resource/game_skins/GameSkillShowSkins.exml";
		this._skillId = $skillId;
    }

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		this.alpha = 0;
		this.scaleX = 0;
		this.scaleY = 0;
		this.anchorOffsetX = this.width / 2;
		this.anchorOffsetY = this.height / 2;
		this.showSkill();
	}

	/**
	 * 显示
	 */
	public showSkill(){
		this._skill = SkillManager.GetSkillByID(this._skillId,UnitManager.CurrentRole.ID);
		this._skillIma.texture = RES.getRes(this._skill.ImageRes);
		this._skillNameIma.texture = RES.getRes(this._skill.GameSKillNameRes);
		this.showAni();
	}

	/**
	 * 出现动画
	 */
	private showAni(){
		let addScale: number = 1.4;
		egret.Tween.get(this).to({scaleX:1.4*addScale,scaleY:1.2*addScale,alpha:1},133).to({scaleX:1.2*addScale,scaleY:1.2*addScale},133)
		.wait(500).to({y:this.y - 100,alpha:0},300).call(this.removeShow.bind(this))
	}

	/**
	 * 消失动画
	 */
	// public xiaoshiAni(){
	// 	egret.Tween.get(this).to({y:this.y + 100,alpha:0},500).call(this.removeShow.bind(this))
	// }

	/**
	 * 移除
	 */
	private removeShow(){
		egret.Tween.removeTweens(this);
		if(this.parent){
			this.parent.removeChild(this);
		}
	}

	private _skillIma: eui.Image;					// 技能图标
	private _skillNameIma: eui.Image;				// 技能名称
	private _skillId: number;						// 技能id
	private _skill: Skill;							// 技能
	private _isPlay: boolean = false;				// 是否创建完成
}