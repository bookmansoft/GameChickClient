class RoadPackage {

	public constructor() {
	}


	/**
	 * 根据类型创建路径
	 * $lineType 0 起点 1 中间 2 转角 3 节点 4 陷阱 5 汇合点
	 * $der 方向
	 * $ifZheJiaoAtUp 折角的直线是否在上面
	 * $ifZheJiaoEnd 是否有节点 0 不结束 1 结束
	 */
	public creatLine($lineType, $der, $ifZheJiaoAtUp = null, $ifZheJiaoEnd = null):number[]{
		if($lineType==0){
			return this.creatLineStrart($der);
		}else if($lineType==1){
			return this.creatLineCenter($der);
		}else if($lineType==2){
			return this.creatZheJiao($der,$ifZheJiaoAtUp,$ifZheJiaoEnd);
		}else if($lineType==3){
			return this.creatLineEnd($der);
		}else if($lineType==4){
			return this.creatLineJump($der);
		}else if($lineType==5){
			return this.creatHuiHe($der);			
		}else{
			return this.creatLineCenter($der);
		}
	}

	/**
	 * 创建路线起点
	 * $der 方向 0是直线，1是左边，2是右边
	 */
	public creatLineStrart($der:number): number[]{
		if($der == 0){
			return [1]; // 直线起点
		}else if($der == 1){
			return [9]; // 左线起点
		}if($der == 2){
			return [11]; // 右线起点
		}
		return null;
	}

	/**
	 * 创建路线中部
	 * $der 方向 0是直线，1是左边，2是右边
	 */
	public creatLineCenter($der:number):Array<number>{
		if($der == 0){
			let ranNum: number = Math.random()*2 |0;
			if(ranNum == 0) return [2]; // 左线中部1
			else return [21]; // 左线中部2
		}else if($der == 1){
			let ranNum: number = Math.random()*2 |0;
			if(ranNum == 0) return [6]; // 左线中部1
			else return [20]; // 左线中部2
		}if($der == 2){
			let ranNum: number = Math.random()*2 |0;
			if(ranNum == 0) return [5]; // 右线中部1
			else return [19]; // 右线中部2
		}
	}

	/**
	 * 创建折角
	 * $ifUp 直线是否在上
	 * $der 方向,1 左边，2右边
	 * $ifEnd 是否结束 0 不结束 1 结束
	 */
	public creatZheJiao($der:number,$ifUp=true,$ifEnd=0):Array<number>{
		if($ifUp && $ifEnd == 0){
			if($der == 1){
				return [3,15]; // 竖左折
			}
			else if($der == 2){
				return [3,4]; // 竖右折
			}
		}
		else if($ifUp == false && $ifEnd == 0){
			if($der == 1){
				return [10,3]; // 左折竖
			}
			else if($der == 2){
				return [12,3]; // 右折竖
			}
		}
		else if($ifUp == false && $ifEnd == 1){
			if($der == 1){
				return [10,17]; // 左折竖节点
			}
			else if($der == 2){
				return [12,17]; // 右折竖节点
			}
		}
	}

	/**
	 * 创建路线节点
	 * $der 方向 0是直线，1是左边，2是右边
	 */
	public creatLineEnd($der:number):Array<number>{
		// if($ifZheJiao==false){
			if($der == 0){
				return [13]; // 直线节点
			}else if($der == 2){
				return [7]; // 右线节点
			}else if($der == 1){
				return [18]; // 左线节点
			}
		// }else{
		// 	return 17; // 直线折角长节点
		// }
	}


	/**
	 * 创建路线陷阱
	 * $der 方向 0是直线，1是左边，2是右边
	 */
	public creatLineJump($der:number):Array<number>{
		if($der == 0){
			return [14]; // 直线陷阱
		}else if($der == 1){
			return [8]; // 左线陷阱
		}if($der == 2){
			return [16]; // 右线陷阱
		}
	}

	/**
	 * 创建汇合点
	 * $der 方向 0是直线，1是左边，2是右边
	 */
	public creatHuiHe($der:number):Array<number>{
		if($der == 0){
			return [2]; // 直线汇合 中部
		}else{
			return [7]; // 斜线汇合点 结点
		}
	}

	/**
	 * 设置相对于上一块移动的位置
	 * $curNumId 当前块的id
	 * $preNumId 上一块的id
	 */
	public setPosi($curNumId,$preNumId){
		if($preNumId == 1){
			if($curNumId == 3) return [0,30];
			return [0,31];
		}
		else if($preNumId == 2){
			if($curNumId == 3) return [0,30];
			return [0,31];
		}
		else if($preNumId == 21){
			if($curNumId == 3) return [0,30];
			return [0,31];
		}
		else if($preNumId == 3){
			if($curNumId == 2) return [0,48];
			else if($curNumId == 21) return [0,48];
			else if($curNumId == 4) return [0,37];
			else if($curNumId == 13) return [0,48];
			else if($curNumId == 15) return [-5,37];
			return [0,31];
		}
		else if($preNumId == 4){
			return [16,15];
		}
		else if($preNumId == 5){
			if($curNumId == 2) return [6,20];
			else if($curNumId == 21) return [6,20];
			return [22,15];
		}
		else if($preNumId == 19){
			if($curNumId == 2) return [6,20];
			else if($curNumId == 21) return [6,20];
			return [22,15];
		}
		else if($preNumId == 6){
			if($curNumId == 10) return [-16,15];
			else if($curNumId == 2) return [6,20];
			else if($curNumId == 21) return [6,20];
			return [-22,15];
		}
		else if($preNumId == 20){
			if($curNumId == 10) return [-16,15];
			else if($curNumId == 2) return [6,20];
			else if($curNumId == 21) return [6,20];
			return [-22,15];
		}
		else if($preNumId == 7){
			if($curNumId == 8) return [-22,15];
			if($curNumId == 2) return [6,20];
			else if($curNumId == 21) return [6,20];
			return [22,15];
		}
		else if($preNumId == 8){
			if($curNumId == 10) return [-16,15];
			// if($curNumId == 7) return [22,15];
			return [-22,15];
		}
		else if($preNumId == 9){
			if($curNumId == 10) return [-16,15];
			return [-22,15];
		}
		else if($preNumId == 10){
			return [0,15];
		}
		else if($preNumId == 11){
			return [22,15];
		}
		else if($preNumId == 12){
			if($curNumId == 3) return [5,15];
			return [5,15];
		}
		else if($preNumId == 13){
			return [0,31];
		}
		else if($preNumId == 14){
			return [0,31];
		}
		else if($preNumId == 15){
			if($curNumId == 10) return [-16,15];
			return [-22,15];
		}
		else if($preNumId == 16){
			// if($curNumId == 16) return [22,16];
			return [22,15];
		}
		else if($preNumId == 17){
			return [0,48];
		}
		else if($preNumId == 18){
			if($curNumId == 8) return [-22,15];
			if($curNumId == 2) return [6,20];
			else if($curNumId == 21) return [6,20];
			return [22,15];
		}
	}

	public static Instance:RoadPackage = new RoadPackage();

	
}