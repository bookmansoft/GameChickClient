/**
 * 地图管理，生成
 */
class RoadManager extends egret.DisplayObjectContainer{

	public constructor() {
		super();
		this.loadJson();
	}

	/**
	 * 获取本身
	 */
	public static Inistence(): RoadManager{
		if(RoadManager._inistence == null){
			RoadManager._inistence = new RoadManager();
		}
		return RoadManager._inistence;
	}

	/**
	 * 读取地图块配置
	 */
	private loadJson(){

		this._jsonKuai = RES.getRes("roadType_json");
		this._dataKuaiRes = [];

		// 读取和解析每个地图块的类型配置
		for(var i:number = 0; i< this._jsonKuai["road"].length; i++){
			for(var j:number = 0; j< this._jsonKuai["road"].length; j++){
				if(this._jsonKuai["road"][j].type == i+1){
					this._dataKuaiRes.push(this._jsonKuai["road"][j]);
					break;
				}
			}
		}

		this._jsonKuaiPosi = RES.getRes("kuaiPosi_json");
	}

	/**
	 * 创建最终地图
	 * $nandu 难度
	 * $ifFirst 是否是第一张地图
	 * $mapId 测试用，固定显示一张地图
	 * $roadNum 测试用，固定显示一张地图，是几条路
	 */
	public ceateMapType($nandu:number = 10,$ifFirst:boolean = false, $roadNum: number = null, $mapId:number = null): DynamicMap{
		this.removeMap();

		// 难度调节
		this._difficultyLevel = $nandu;
		if ($ifFirst == true) $mapId = null;

		this._kuaiRes = "k";
		// 关卡道路
		if(CheckpointManager.CurrentCheckpoint) this._kuaiRes = CheckpointManager.CurrentCheckpoint.RoadRes;
		// 专属道路
		if(UnitManager.CurrentRole.Scene == 2005 && UnitManager.CurrentRole.IsSceneStart){
            this._kuaiRes = "hy";
        }
		
		this.setNanDuMap($ifFirst, $mapId, $roadNum);
		this.jiexiJson();
		this.creatJumpRoad($ifFirst);
		
		var map: DynamicMap = new DynamicMap();
		this.createMapRes(map);
		

		map.MapData = this._endReturnGameData;
		map.Difficulty = $nandu;

		return map;
	}

	/**
	 * 设置难度,根据难度出现地图
	 * $mapId 测试用，显示的地图
	 */
	private setNanDuMap($ifFirst, $mapId, $roadNum){

		let allJson = [];
		let oneJson =["road1-1_json","road1-2_json","road1-3_json","road1-4_json","road1-5_json",
					"road1-6_json","road1-7_json","road1-8_json"];

		let twoJson =["road2-1_json","road2-2_json","road2-3_json","road2-4_json","road2-5_json",
					"road2-6_json","road2-7_json","road2-8_json"];

		let threeJson =["road3-1_json","road3-2_json","road3-3_json","road3-4_json","road3-5_json","road3-6_json"];

		let fourJson =["road4-1_json","road4-2_json","road4-3_json"];
		let fiveJson =["road5-1_json","road5-2_json","road5-3_json"];

		allJson = [oneJson, twoJson, threeJson, fourJson, fiveJson];

		let nanduRoadNumGaiLv = [0, 0, 0, 0, 0]; // 根据难度，出现几条道路的概率

		// 根据难度选择地图
		if(this._difficultyLevel >= 1){
			nanduRoadNumGaiLv = [1, 0, 0, 0, 0];
		}
		if(this._difficultyLevel >= 3){
			nanduRoadNumGaiLv = [0.3, 0.7, 0, 0, 0];
		}
		if(this._difficultyLevel >= 5){
			nanduRoadNumGaiLv = [0.2, 0.3, 0.5, 0, 0];
		}
		if(this._difficultyLevel >= 7){
			nanduRoadNumGaiLv = [0.1, 0.2, 0.3, 0.4, 0];
		}
		if(this._difficultyLevel >= 9){
			nanduRoadNumGaiLv = [0, 0.1, 0.2, 0.3, 0.4];
		}

		let num = 0;

		let roadNumGaiLv: number = Math.random() * 1; // 随机几条路概率
		let endJiSuanGailv: number = 0; // 计算当前道路概率
		let _roadNum: number = 1; // 几条路

		// 判断出现几条路
		for(let i:number = 0; i<nanduRoadNumGaiLv.length; i++){
			if(i == 0){
				if(roadNumGaiLv <= nanduRoadNumGaiLv[i]){
					num = Math.floor(Math.random()*(allJson[i].length));
					_roadNum = i + 1;
					break;
				}
			}else{
				if(roadNumGaiLv > endJiSuanGailv && roadNumGaiLv <= endJiSuanGailv + nanduRoadNumGaiLv[i]){
					num = Math.floor(Math.random()*(allJson[i].length));
					_roadNum = i + 1;
					break;
				}
			}
			endJiSuanGailv += nanduRoadNumGaiLv[i];
		}

		if(_roadNum == 5) _roadNum = 4;

		// 现状第一张地图只出现一条路
		if($ifFirst){
			do{
				num = Math.floor(Math.random()*(oneJson.length));
				_roadNum = 1;
			}while(num == 0)
		}
		
		if($mapId != null){
			num = $mapId;
			_roadNum = $roadNum;
		}

		// 读取地图配置
		this._jsonRoadMap = RES.getRes(allJson[_roadNum - 1][num]);
	}

	/**
	 * 获取地图配置,解析地图JSON
	 */
	private jiexiJson(){

		// 记录几条路
		this._roadNum = this._jsonRoadMap["roadNum"];
		// 记录房子和气球的位置
		this._houseArr = this._jsonRoadMap["house"];
		// 记录房子和气球的位置
		this._ballArr = this._jsonRoadMap["balloon"];
		// 记录门的位置
		this._oriX = this._jsonRoadMap["posiX"];
		// 层级显示
		this._cenjiArr = this._jsonRoadMap["cenji"];
		// 分支合成
		this._endRoadFenZhiTypeArr = this._jsonRoadMap["roadType"];

		// 所有道路
		let _allRoadJson = this._jsonRoadMap["road"];

		this._roadFenZhiArr = [];
		
		// 开始循环几条道路
		for(var i:number = 0; i< _allRoadJson.length; i++){
			let arr = [];

			// 生成几条路的空位，同时配置参数
			this._roadFenZhiArr[i] = new Array();
			this._roadFenZhiArr[i]["allRoadId"] = _allRoadJson[i]["allRoadId"];// 当前支线道路的id
			this._roadFenZhiArr[i]["lastType"] = _allRoadJson[i]["lastType"];// 当前支线的上一个支线
			this._roadFenZhiArr[i]["kuaiType"] = _allRoadJson[i]["kuaiType"];//当前支线所有块的类型和对应数量
			this._roadFenZhiArr[i]["ifCanJump"] = _allRoadJson[i]["ifCanJump"];//重合点是否可以跳跃
			this._roadFenZhiArr[i]["changeKuaiId"] = [];//当前支线的所有块，已经从类型和数量全部转换成块的id
			
			// 开始循环每条道路里面的每个块, 转换为显示的地图块
			for(var j:number = 0; j< _allRoadJson[i]["kuaiType"].length; j++){

				// 存储当前的，上一个
				let obj = _allRoadJson[i]["kuaiType"][j];
				let lestObj = 0;
				if(j>0) lestObj = _allRoadJson[i]["kuaiType"][j-1];

				if(i>0 && j == 0) lestObj = _allRoadJson[i-1]["kuaiType"][_allRoadJson[i-1]["kuaiType"].length - 1];

				// 批量生成
				for(let a=0; a<obj["num"]; a++){
					// 转换成块的id
					let numId = [];
					let endType = obj["type"];

					if(obj["der"].length){
						numId = RoadPackage.Instance.creatLine(obj["type"], obj["der"][0],false,false);
						let endObj = this.creatEndKuaiJson(obj["der"], obj["type"], numId[0], obj["doorID"], obj["intersect"],this._roadFenZhiArr[i]["ifCanJump"]);
						arr.push(endObj);
						let endObj2 = this.creatEndKuaiJson(obj["der"], obj["type"], numId[1], obj["doorID"], obj["intersect"],this._roadFenZhiArr[i]["ifCanJump"]);
						arr.push(endObj2);
						numId = RoadPackage.Instance.creatLine(obj["type"], obj["der"][1],true,false);
						let endObj3 = this.creatEndKuaiJson(obj["der"], obj["type"], numId[1], obj["doorID"], obj["intersect"],this._roadFenZhiArr[i]["ifCanJump"]);
						arr.push(endObj3);
					}
					else{
						numId = RoadPackage.Instance.creatLine(obj["type"], obj["der"],false,false);

						if(lestObj != 0 && lestObj["der"] == 0 && ( lestObj["type"] == 1 || lestObj["type"] == 7 ) && obj["type"] == 2)
							numId = RoadPackage.Instance.creatLine(obj["type"], obj["der"],true,false);

						
						if(endType == 1 && obj["der"] != 0 && (lestObj["type"] == 1 || lestObj["type"] == 2 || lestObj["type"] == 0 || lestObj["type"] == 7)){
							if( (lestObj["der"].length && obj["der"] != lestObj["der"][lestObj["der"].length - 1]) || ( !lestObj["der"].length && obj["der"] != lestObj["der"])){
								if(a == 0) endType = 0;
								numId = RoadPackage.Instance.creatLine(endType, obj["der"],false,false);
							}
						}
					
						let endObj = this.creatEndKuaiJson(obj["der"], endType, numId[0], obj["doorID"], obj["intersect"],this._roadFenZhiArr[i]["ifCanJump"]);
						arr.push(endObj);
						if(obj["type"] == 2){
							let endObj2 = this.creatEndKuaiJson(obj["der"], obj["type"], numId[1], obj["doorID"], obj["intersect"],this._roadFenZhiArr[i]["ifCanJump"]);
							arr.push(endObj2);
						}
					}
					
				}
			}
			
			this._roadFenZhiArr[i]["changeKuaiId"] = arr;
		}
	}

	/**
	 * 创建跳跃块
	 */
	private creatJumpRoad($ifFirst){

		// 出现坑的概率。1-10 难度，0.2-0.9的概率
		// let jumpProbability = this._difficultyLevel*(7/90)+(11/90);
		
		let _smollJumpProbability = 0.5;//1 - (this._difficultyLevel*(-4/90)+(85/90)); // 出现小坑的概率。1-10 难度, 0.9-0.5 的概率
		let _bigJumpProbability = 0.5;//this._difficultyLevel*(-4/90)+(85/90); // 出现大坑的概率。
		
		let _allNumLength = 0; // 计算一共有多少个可以跳跃的块
		let _allCanJumpRoadSet:Object[] = []; // 存储可以跳跃的块的集合
		
		// 设置是否可以跳跃 计算总共多少块可以跳跃
		for(let i=0; i<this._cenjiArr.length; i++){
			for(let j=3; j<this._roadFenZhiArr[this._cenjiArr[i][0]]["changeKuaiId"].length-1; j++){
				if(this._roadFenZhiArr[this._cenjiArr[i][0]]["changeKuaiId"][j]["type"] == 1){

					let curRoadType = this._cenjiArr[i][0];

					// 设置是否可以跳跃
					let _curFenZhiRoadMaxNum = this._roadFenZhiArr[curRoadType]["changeKuaiId"].length;
					let curKuai = this._roadFenZhiArr[curRoadType]["changeKuaiId"][j];
					let lastKuai = this._roadFenZhiArr[curRoadType]["changeKuaiId"][j-1];
					let lastKuai2 = this._roadFenZhiArr[curRoadType]["changeKuaiId"][j-2];
					let nextKuai = this._roadFenZhiArr[curRoadType]["changeKuaiId"][j+1];

					let _ifCanJump = true;

					// 离道路结束要有3个空格
					if( j >= _curFenZhiRoadMaxNum - 3){
						_ifCanJump = false;
						break;
					}

					// 转向的不能跳跃。判断
					if(lastKuai["der"] != curKuai["der"] || nextKuai["der"] != curKuai["der"] || lastKuai2["der"] != curKuai["der"]
						|| (lastKuai.type == 2 && lastKuai.kuaiId != 3 ) ){
						_ifCanJump = false;
					}

					// 特例的重合点部分不能跳跃
					if(curKuai["intersect"] != -1 && curKuai["ifCanJump"] == 0){
						_ifCanJump = false;
					}

					// 是第一张地图
					if( $ifFirst && j<10){
						_ifCanJump = false;
					}

					// 设置是否可以跳跃
					if(_ifCanJump){
						for(let a= 0; a<this._cenjiArr[i].length; a++){
							this._roadFenZhiArr[this._cenjiArr[i][a]]["changeKuaiId"][j]["jugdeState"] = 1;
							this._roadFenZhiArr[this._cenjiArr[i][a]]["changeKuaiId"][j]["posiCenJi"] = i;
							this._roadFenZhiArr[this._cenjiArr[i][a]]["changeKuaiId"][j]["PosiKuai"] = j;
						}
						_allNumLength += 1;
						_allCanJumpRoadSet.push(this._roadFenZhiArr[this._cenjiArr[i][0]]["changeKuaiId"][j]);
					}
				}
			}
		}

		// 根据难度等级1-10，按比例0.4-0.9平方
		let _maxJumpLength = (_allNumLength * (this._difficultyLevel*1/18 + 31/90) * (this._difficultyLevel*1/18 + 31/90)) |0; // 最大要出现的总坑的长度。
		let _minJumpLength = (_allNumLength * (this._difficultyLevel*1/18 + 31/90) * (this._difficultyLevel*1/18 + 31/90)) |0; // 最小要出现的总坑的长度。
		if(_minJumpLength < 1) _minJumpLength = 1;
		
		let _curAllJumpNumLength = 0; // 当前总共有几个坑
		let _curAllKengLength = 0; // 当前坑的长度
		
		let _smoollJumpLength = 0; // 小坑的次数
		let _bigJumpLength = 0; // 大坑的次数


		// 随机散落
		do{
			// 是出现大坑还是小坑
			let _kengTypeNum = Math.floor(Math.random()*100); // 大坑小坑的数值，概率
			let _judgeJumpLength = Math.floor(Math.random()*1); // 大小坑里面是几个

			// 特定情况要固定是大坑还是小坑
			if(_curAllJumpNumLength!=0){
				if(_smoollJumpLength/_curAllJumpNumLength < _smollJumpProbability) _kengTypeNum = Math.floor(100*_smollJumpProbability)-2;
				else _kengTypeNum = Math.floor(100*_smollJumpProbability) + 2;
			}

			let _jumpLength: number = 0; // 当前要设置的坑的长度数量
			if(_kengTypeNum <= 100*_smollJumpProbability){
				if(_judgeJumpLength > this._difficultyLevel*(-4/90)+(85/90)){_jumpLength = 1;}else{_jumpLength = 2;}
			}else{
				if(_judgeJumpLength > this._difficultyLevel*(-4/90)+(85/90)){_jumpLength = 3;}else{_jumpLength = 4;}
			}


			// 设置出现坑的位置
			let _randRoadPosiNum:number = (Math.random() * _allCanJumpRoadSet.length) |0; // 在所有的可跳跃块中随机
						
			let _endJumpLength: number = 0;	// 最终跳跃了几块
			let _curCengJiPosi = _allCanJumpRoadSet[_randRoadPosiNum]["posiCenJi"];
			let _curRoadPosi = _allCanJumpRoadSet[_randRoadPosiNum]["PosiKuai"];

			// 设置跳跃块
			for(let a=0; a<this._cenjiArr[_curCengJiPosi].length; a++){ // 最后循环当前层级的所有分支
				var _lastJumpNum = 0;// 向前跳跃了多少格
				let _nextJumpNum = 0;// 向后跳跃了多少格
				let _curFenZhiType: number = this._cenjiArr[_curCengJiPosi][a];	// 存储当前分支
				let curKuai = this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi]; // 存储当前块
				// 设置跳跃块.向后循环
				for(let b=0; b<_jumpLength; b++){
					if(this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi + b]["jugdeState"] == 1){
						let tymep = RoadPackage.Instance.creatLine(4, curKuai["der"],false, false);
						this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi + b].type = 4;
						this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi + b]["kuaiId"] = tymep[0];
						this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi + b]["jugdeState"] = 0;
						_nextJumpNum += 1;
					}else{
						break;
					}
				}
				// 设置跳跃块.向前循环
				if(_nextJumpNum<_jumpLength){
					for(let b=1; b< _jumpLength - _nextJumpNum ; b++){
						if(this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi - b]["jugdeState"] == 1){
							let tymep = RoadPackage.Instance.creatLine(4, curKuai["der"],false, false);
							this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi - b].type = 4;
							this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi - b]["kuaiId"] = tymep[0];
							this._roadFenZhiArr[_curFenZhiType]["changeKuaiId"][_curRoadPosi - b]["jugdeState"] = 0;
							_lastJumpNum += 1;
						}else{
							break;
						}
					}
				}
				_endJumpLength = _nextJumpNum + _lastJumpNum;
			}

			_curRoadPosi = _curRoadPosi - _lastJumpNum;

			// 设置前面后面要有多少个块
			let kuaiNum = 0;
			if(_endJumpLength != 0){
				// 计算坑数量
				_curAllJumpNumLength+=1;
				_curAllKengLength += _endJumpLength;
				if(_endJumpLength == 1){kuaiNum = _endJumpLength ; _smoollJumpLength+=1;}
				else if(_endJumpLength ==2){kuaiNum = _endJumpLength + 1;_smoollJumpLength+=1;}
				else if(_endJumpLength == 3){kuaiNum = _endJumpLength + Math.floor(Math.random()*2+1);_bigJumpLength+=1;}
				else if(_endJumpLength == 4){kuaiNum = _endJumpLength + 2;_bigJumpLength+=1}
			}
			// 设置前后块的状态
			let num = 0;
			do{
				num += 1;
				if(_curRoadPosi - num >= 0){
					for(let a= 0; a<this._cenjiArr[_curCengJiPosi].length; a++){
						this._roadFenZhiArr[this._cenjiArr[_curCengJiPosi][a]]["changeKuaiId"][_curRoadPosi - num]["jugdeState"]  = 0;
					}
				}
			}while(num < 4)
			num = 0;
			do{
				num += 1;
				if(_curRoadPosi + num <= this._roadFenZhiArr[this._cenjiArr[_curCengJiPosi][0]]["changeKuaiId"].length){
					for(let a= 0; a<this._cenjiArr[_curCengJiPosi].length; a++){
						this._roadFenZhiArr[this._cenjiArr[_curCengJiPosi][a]]["changeKuaiId"][_curRoadPosi + num]["jugdeState"]  = 0;
					}
				}
			}while(num < kuaiNum)

			// 重新刷新可以跳跃的坑 计算总共多少块可以跳跃
			_allCanJumpRoadSet = this.canJumpRoadSet;
			_allNumLength = _allCanJumpRoadSet.length;

		}while(_allNumLength != 0 && _curAllKengLength < _maxJumpLength)

		// 根据陷阱改起点，结点
		this.SetJumpOtherRoadType();
	}

	/**
	 * 获取可以跳跃的道路的数组
	 */
	private get canJumpRoadSet(){
		let _allCanJumpRoadSet:Object[] = [];
		for(let i=0; i<this._cenjiArr.length; i++){
			for(let j=3; j<this._roadFenZhiArr[this._cenjiArr[i][0]]["changeKuaiId"].length-1; j++){
				if(this._roadFenZhiArr[this._cenjiArr[i][0]]["changeKuaiId"][j]["type"] == 1){

					let curRoadType = this._cenjiArr[i][0];
					// 设置是否可以跳跃
					let _curFenZhiRoad = this._roadFenZhiArr[curRoadType]["changeKuaiId"][j];

					// 设置是否可以跳跃
					if(_curFenZhiRoad["jugdeState"] == 1){
						_allCanJumpRoadSet.push(this._roadFenZhiArr[this._cenjiArr[i][0]]["changeKuaiId"][j]);
					}
				}
			}
		}
		return _allCanJumpRoadSet;
	}

	/**
	 * 设置陷阱的前面后面，根据陷阱改起点，结点
	 */
	private SetJumpOtherRoadType(){
		// 根据陷阱改起点，结点
		for(let i=0; i<this._roadFenZhiArr.length; i++){

			for(let j=0; j<this._roadFenZhiArr[i]["changeKuaiId"].length; j++){

				let curKuai = this._roadFenZhiArr[i]["changeKuaiId"][j];
				let lastKuai = null;
				let nextKuai = null;

				if(j-1>=0)
					lastKuai = this._roadFenZhiArr[i]["changeKuaiId"][j-1];

				if(j+1<this._roadFenZhiArr[i]["changeKuaiId"].length)
					nextKuai = this._roadFenZhiArr[i]["changeKuaiId"][j+1];

				if(curKuai.type == 5){
					let tymep = RoadPackage.Instance.creatLine(5, curKuai["der"],false, false);
					curKuai["kuaiId"] = tymep[0];
				}
				else if(curKuai.type == 6){
					let tymep = RoadPackage.Instance.creatLine(3, curKuai["der"],false, false);
					curKuai["kuaiId"] = tymep[0];
				}
				else if(curKuai.type == 7){
					let tymep = RoadPackage.Instance.creatLine(0, curKuai["der"],false, false);
					curKuai["kuaiId"] = tymep[0];
				}
				else if(curKuai.type == 4){
					// 结点
					if((lastKuai && lastKuai["type"] == 1) || (lastKuai && lastKuai["type"] == 0)){
						let tymep = RoadPackage.Instance.creatLine(3, lastKuai["der"],false, false);
						this._roadFenZhiArr[i]["changeKuaiId"][j-1]["type"] = 3;
						this._roadFenZhiArr[i]["changeKuaiId"][j-1]["kuaiId"] = tymep[0];
					}
					// 起点
					if(nextKuai && nextKuai["type"] == 1){
						let tymep = RoadPackage.Instance.creatLine(0, nextKuai["der"],false, false);
						this._roadFenZhiArr[i]["changeKuaiId"][j+1]["type"] = 0;
						this._roadFenZhiArr[i]["changeKuaiId"][j+1]["kuaiId"] = tymep[0];
					}
					// 转角结点
					if(lastKuai && lastKuai["type"] == 2 && lastKuai["kuaiId"] == 3){
						let tymep = RoadPackage.Instance.creatLine(lastKuai["der"], lastKuai["der"],false, true);
						this._roadFenZhiArr[i]["changeKuaiId"][j-1]["type"] = lastKuai["type"];
						this._roadFenZhiArr[i]["changeKuaiId"][j-1]["kuaiId"] = tymep[1];
					}
				}

				this._roadFenZhiArr[i]["changeKuaiId"][j] = curKuai;
			}
		}
	}

	/**
	 * 创建转换过的块的json数据
	 * $der 方向
	 * $type 类型
	 * $kuaiId 块id
	 * $doorId 门id
	 * $intersect 重合点
	 */
	private creatEndKuaiJson($der, $type, $kuaiId, $doorId, $intersect, $ifCanJump){
		let _object = {"der":$der,"type":$type,"kuaiId":$kuaiId,"doorID":$doorId,"intersect":$intersect,"ifCanJump":$ifCanJump,"jugdeState":0};
		return _object;
	}

	/**
	 * 显示地图块
	 */
	private createMapRes($group: DynamicMap){
		// 先把所有分支上面的图片创建出来
		// 先循环所有分支
		for(let k=0; k<this._roadFenZhiArr.length;k++){
			this._roadImaArr[k] = new Array();
			// 循环分支里面的所有块
			for(let o=0; o<this._roadFenZhiArr[k]["changeKuaiId"].length; o++){
				let typeRoad = this.creatRoadIma(k,o,this._roadFenZhiArr[k]["lastType"][0]);
				this._roadImaArr[k].push(typeRoad[0]);
			}
			
		}

		// 根据层级显示
		// 先循环所有的层级
		for(let i=0; i<this._cenjiArr.length; i++){
			// 当前第几条路
			let curRoadType = -1;
			// 循环当前层级里面的道路,取当前层级的第一条路的长度做循环
			for(let j=0; j<this._roadImaArr[this._cenjiArr[i][0]].length; j++){

				// 循环当前层级里面所有的路
				for(let a=0; a<this._cenjiArr[i].length; a++){

					// 根据层级来获取，当前显示第几条路
					curRoadType = this._cenjiArr[i][a];

					// 第几层级的第几条路
					$group.AddImage(this._roadImaArr[curRoadType][j]);

					// 重合点隐藏
					if(this._roadFenZhiArr[curRoadType]["changeKuaiId"][j].intersect != -1){
						// if(a!=0){
						// 	this._roadImaArr[curRoadType][j].visible = false;
						// }else 
						if(curRoadType != this._roadFenZhiArr[curRoadType]["changeKuaiId"][j].intersect[0]){
							this._roadImaArr[curRoadType][j].visible = false;
						}
					}
				}
			}
		}

		// 显示汇合点层级
		for(let i=0; i<this._huiheImaArr.length; i++){
			this._huiheImaArr[i]["isheight"] = false;
			$group.AddImage(this._huiheImaArr[i]);
		}

		// 计算点
		this.jisuanPosi();
		
		// 存储游戏需要的配置
		this._endReturnGameData ={ "road":[],"roadcount":this._roadNum,"resheight":$group.Height - 8,
									"house":this._houseArr,"balloon":this._ballArr,"posiX":$group.posiX};
		// 显示红点,存储位置
		for(let j=0; j<this._roadPosiArr.length; j++){
			let roaddataJson = {"roaddata": {"type":1, "data":[] }};
			// this._redImaArr[j] = new Array();
			for(let i=0; i<this._roadPosiArr[j].length; i++){
				// let red = ImagePool.GetImage("red_jpg");
				// red["isheight"] = false;
				// $group.AddImage(red);
				// red.x = this._roadPosiArr[j][i][0];
				// red.y = this._roadPosiArr[j][i][1];
				// this._redImaArr[j].push(red);
				roaddataJson.roaddata.data.push(this._roadPosiArr[j][i]);
			}
			this._endReturnGameData.road.push(roaddataJson);
		}

		// 判断道路type。先根据几条路
		for(let i=0; i<this._endRoadFenZhiTypeArr.length; i++){
			for(let j=0; j<this._endRoadFenZhiTypeArr[i].length; j++){
				let _curRoadId = this._endRoadFenZhiTypeArr[i][j];
				if(this._roadFenZhiArr[_curRoadId]["changeKuaiId"][0].type == 5){
					this._endReturnGameData.road[i].roaddata.type = this._roadFenZhiArr[_curRoadId]["allRoadId"];
					break;
				}
			}
		}
	}

	/**
	 * 计算点
	 */
	private jisuanPosi(){
		let _curRoadZhuanTai = -1; // 当前路的状态
		let _der = -1;

		// 先循环一共给出几条道路
		for(let i=0; i<this._endRoadFenZhiTypeArr.length; i++){

			this._roadPosiArr[i] = [];
			_curRoadZhuanTai = -1;// 当前路的状态
			_der = -1;// 当前路的方向
			// 循环给出的道路上第几条分支
			for(let j=0; j<this._endRoadFenZhiTypeArr[i].length; j++){

				let _curFenZhiType = this._endRoadFenZhiTypeArr[i][j];
				
				// 循环分支上的块
				for(let a = 0; a<this._roadImaArr[_curFenZhiType].length; a++){
					
					let posiType = 1;
					let posi = [];
					let posi2 = [];
					let doorId = 0;

					let ifPush = true;

					// 道路类型判断
					if(this._roadImaArr[_curFenZhiType][a]["type"] == 1){
						if(_der != this._roadImaArr[_curFenZhiType][a]["der"]){
							posiType = 1;
							if(_der == -1){
								posi = this._roadImaArr[_curFenZhiType][a]["topPosi"];
							}
							else{
								posi = this._roadImaArr[_curFenZhiType][a]["cenPosi"];
							}
							if(_curRoadZhuanTai == 6){
								ifPush = false;
							}
						}else{
							_curRoadZhuanTai = 1;
						}
					}
					else if(this._roadImaArr[_curFenZhiType][a]["type"] == 2){
						if(this._roadImaArr[_curFenZhiType][a]["res"] == "_1"){
							_der = 3;
							posiType = 1;
							// 前面是斜线
							if(this._roadImaArr[_curFenZhiType][a]["der"].length){
								// 两边都有转角的
								posi = this._roadImaArr[_curFenZhiType][a-1]["cenPosi"];
								posi2 = [this._roadImaArr[_curFenZhiType][a-1].x + posi[0],this._roadImaArr[_curFenZhiType][a-1].y + posi[1]];
								let arr = [posi2[0],posi2[1],posiType,this._roadImaArr[_curFenZhiType][a]["roadID"],doorId];
								this._roadPosiArr[i].push(arr);

								posi = this._roadImaArr[_curFenZhiType][a+1]["cenPosi"];
								posi2 = [this._roadImaArr[_curFenZhiType][a+1].x + posi[0],this._roadImaArr[_curFenZhiType][a+1].y + posi[1]];
							}else{
								if(this._roadImaArr[_curFenZhiType][a-1]["der"] == this._roadImaArr[_curFenZhiType][a]["der"]){
									posi = this._roadImaArr[_curFenZhiType][a-1]["cenPosi"];
									posi2 = [this._roadImaArr[_curFenZhiType][a-1].x + posi[0],this._roadImaArr[_curFenZhiType][a-1].y + posi[1]];
									
								}
								else{// 前面是斜线
									posi = this._roadImaArr[_curFenZhiType][a+1]["cenPosi"];
									posi2 = [this._roadImaArr[_curFenZhiType][a+1].x + posi[0],this._roadImaArr[_curFenZhiType][a+1].y + posi[1]];
								}
							}
						}
						else{
							posiType = _curRoadZhuanTai;
						}
					}
					else if(this._roadImaArr[_curFenZhiType][a]["type"] == 5){//汇合点
						posiType = 6;
						posi = this._roadImaArr[_curFenZhiType][a]["cenPosi"];
					}
					else if(this._roadImaArr[_curFenZhiType][a]["type"] == 6){//入门
						if(i==0 && j ==0 && a == 0){
							posi = this._roadImaArr[_curFenZhiType][a]["topPosi"];
							posi2 = [this._roadImaArr[_curFenZhiType][a].x + posi[0],this._roadImaArr[_curFenZhiType][a].y + posi[1]]
							let arr = [posi2[0],posi2[1],posiType,this._roadImaArr[_curFenZhiType][a]["roadID"],doorId];
							this._roadPosiArr[i].push(arr);
						}
						posiType = 4;
						posi = this._roadImaArr[_curFenZhiType][a]["buttomPosi"];
						doorId = this._roadImaArr[_curFenZhiType][a]["doorID"];
					}
					else if(this._roadImaArr[_curFenZhiType][a]["type"] == 7){// 出门
						posiType = 5;
						posi = this._roadImaArr[_curFenZhiType][a]["topPosi"];

						let doorArr = this._roadImaArr[_curFenZhiType][a]["doorID"].toString().split(".");
						doorId = parseInt(doorArr[0]);
					}
					else if(this._roadImaArr[_curFenZhiType][a]["type"] == 0){//起点，边界结束
						posiType = 3;
						posi = this._roadImaArr[_curFenZhiType][a]["topPosi"];

						if(a > 0 && ( this._roadImaArr[_curFenZhiType][a-1]["type"] == 1 || this._roadImaArr[_curFenZhiType][a - 1]["type"] == 0 || this._roadImaArr[_curFenZhiType][a - 1]["type"] == 2)){
							posiType = 1;
							posi = this._roadImaArr[_curFenZhiType][a]["cenPosi"];
						}

						let lestObj = 0;
						let _lesFenZhiType = 0;
						if(j > 0) _lesFenZhiType = this._endRoadFenZhiTypeArr[i][j-1];
						if(_lesFenZhiType != 0 && a == 0) lestObj = this._roadImaArr[_lesFenZhiType][this._roadImaArr[_lesFenZhiType].length - 1];

						if(lestObj != 0 && (lestObj["type"] == 1 || lestObj["type"] == 0 || lestObj["type"] == 2)){
							posiType = 1;
							posi = this._roadImaArr[_curFenZhiType][a]["cenPosi"];
						}

					}
					else if(this._roadImaArr[_curFenZhiType][a]["type"] == 3){//结点，边界开始
						// 如果上一块是陷阱。要记录陷阱结束
						if(a-1 >= 0 && this._roadImaArr[_curFenZhiType][a-1]["type"] == 4){
							posiType = 3;
							posi = this._roadImaArr[_curFenZhiType][a]["topPosi"];
							posi2 = [this._roadImaArr[_curFenZhiType][a].x + posi[0],this._roadImaArr[_curFenZhiType][a].y + posi[1]]
							let arr2 = [posi2[0],posi2[1],posiType,this._roadImaArr[_curFenZhiType][a]["roadID"],doorId];
							this._roadPosiArr[i].push(arr2);
							_curRoadZhuanTai = posiType;
						}

						posiType = 2;
						posi = this._roadImaArr[_curFenZhiType][a]["buttomPosi"];
						
					}
					else if(this._roadImaArr[_curFenZhiType][a]["type"] == 4){//陷阱
						// 如果上一块是转角
						if(this._roadImaArr[_curFenZhiType][a-1]["type"] == 2){
							posiType = 2;
							posi = this._roadImaArr[_curFenZhiType][a-1]["buttomPosi"];
							posi2 = [this._roadImaArr[_curFenZhiType][a-1].x + posi[0],this._roadImaArr[_curFenZhiType][a-1].y + posi[1]]
							let arr2 = [posi2[0],posi2[1],posiType,this._roadImaArr[_curFenZhiType][a-1]["roadID"],doorId];
							this._roadPosiArr[i].push(arr2);
						}
						// 如果下一块是转角
						if(this._roadImaArr[_curFenZhiType][a+1]["type"] == 2){
							posiType = 3;
							posi = this._roadImaArr[_curFenZhiType][a+1]["topPosi"];
							posi2 = [this._roadImaArr[_curFenZhiType][a+1].x + posi[0],this._roadImaArr[_curFenZhiType][a+1].y + posi[1]]
							let arr2 = [posi2[0],posi2[1],posiType,this._roadImaArr[_curFenZhiType][a+1]["roadID"],doorId];
							this._roadPosiArr[i].push(arr2);
						}
						posiType = _curRoadZhuanTai;
						_der = this._roadImaArr[_curFenZhiType][a]["der"];
					}

					// 是转角，位置有变
					if(_der != 3){
						posi2 = [this._roadImaArr[_curFenZhiType][a].x + posi[0],this._roadImaArr[_curFenZhiType][a].y + posi[1]];
					}

					if(posi2[0] && (_curRoadZhuanTai != posiType || _der != this._roadImaArr[_curFenZhiType][a]["der"]) && ifPush){
						let arr = [posi2[0],posi2[1],posiType,this._roadImaArr[_curFenZhiType][a]["roadID"],doorId];
						this._roadPosiArr[i].push(arr);
					}
					_curRoadZhuanTai = posiType;

					if(this._roadImaArr[_curFenZhiType][a]["der"].length){
						_der = this._roadImaArr[_curFenZhiType][a]["der"][1];
					}
					else _der = this._roadImaArr[_curFenZhiType][a]["der"];

					// 斜转直
					if( a+1 <this._roadImaArr[_curFenZhiType].length && 
					this._roadImaArr[_curFenZhiType][a]["type"] == 2 && this._roadImaArr[_curFenZhiType][a+1]["der"] == 0){
						_der = 0;
					}
				}
			}

		}

		// 特例，最后是门
		if(this._roadPosiArr[0][this._roadPosiArr[0].length-1][2] == 5){
			let posiType = 1;
			let doorId = 0;
			let fenzhiLength = this._endRoadFenZhiTypeArr.length - 1;
			let _fengzhi1 = this._endRoadFenZhiTypeArr[fenzhiLength].length - 1

			let _curFenZhiType = this._endRoadFenZhiTypeArr[fenzhiLength][_fengzhi1];
			let num = this._roadImaArr[_curFenZhiType].length-1;

			let posi = this._roadImaArr[_curFenZhiType][num]["topPosi"];
			let posi2 = [this._roadImaArr[_curFenZhiType][num].x + posi[0],this._roadImaArr[_curFenZhiType][num].y + posi[1]]

			let arr = [posi2[0],posi2[1],posiType,this._roadImaArr[_curFenZhiType][num]["roadID"],doorId];
			for(let i = 0; i<this._roadPosiArr.length; i++){
				this._roadPosiArr[i].push(arr);
			}

		}
	}

	/**
	 * 创建图片
	 */
	private creatRoadIma($roadNum,$kuaiNum,$lastType){

		let obj = this._roadFenZhiArr[$roadNum]["changeKuaiId"][$kuaiNum];
		let lastObj = null;
		if($kuaiNum >0)
			lastObj = this._roadFenZhiArr[$roadNum]["changeKuaiId"][$kuaiNum - 1];
		
		let resName = this._dataKuaiRes[obj.kuaiId-1].res;

		let road = ImagePool.GetImage(this._kuaiRes + resName + "_png");

		let posiArr = this._jsonKuaiPosi[resName];
		road["topPosi"] = [posiArr[2], posiArr[3]];
		road["buttomPosi"] = [posiArr[4], posiArr[5]];
		road["cenPosi"] = [posiArr[6], posiArr[7]];
		road["type"] = obj.type;
		road["roadID"] = this._roadFenZhiArr[$roadNum]["allRoadId"];
		road["doorID"] = obj.doorID;
		road["der"] = obj.der;
		road["res"] = resName;

		if($kuaiNum==0){
			road.x = 312;
			road.y = 0;
			if($lastType!=-1){
				// 上个道路的最后一个
				let lastTypeRoadPosi = this._roadFenZhiArr[$lastType]["changeKuaiId"].length-1;
				// 上个分支最后一块地板的数据
				let lastTypeRoad = this._roadFenZhiArr[$lastType]["changeKuaiId"][lastTypeRoadPosi];
				
				let tympPosi = RoadPackage.Instance.setPosi(obj.kuaiId,lastTypeRoad.kuaiId)
				road.x = this._roadImaArr[$lastType][lastTypeRoadPosi].x + tympPosi[0];
				road.y = this._roadImaArr[$lastType][lastTypeRoadPosi].y + tympPosi[1];
			}
		}else{
			let _movePosiXY = RoadPackage.Instance.setPosi(obj.kuaiId,lastObj.kuaiId);

			road.x = this._roadImaArr[$roadNum][$kuaiNum-1].x + _movePosiXY[0];
			road.y = this._roadImaArr[$roadNum][$kuaiNum-1].y + _movePosiXY[1];
		}
		
		// 出门，变更位置
		if(obj.type == 7){
			let _doorId = obj.doorID.toString().split(".");
			road.x = this._oriX[parseInt(_doorId[0]) - 1][parseInt(_doorId[1]) - 1][0];
			road.y = this._oriX[parseInt(_doorId[0]) - 1][parseInt(_doorId[1]) - 1][1];
		}
		else if(obj.type == 5){// 规则，只有一个汇合块，就是结束块
			let huihe = ImagePool.GetImage("huihedian_png");
			if(obj.der != 0){
				huihe.x = road.x + 4;
			}else{
				huihe.x = road.x - 2;
			}
			huihe.y = road.y;
			
			this._huiheImaArr.push(huihe);
		}

		return [road];
	}

	/**
	 * 移除地图数据和显示
	 */
	public removeMap(){
		this._roadImaArr = [];
		this._redImaArr = [];
		this._huiheImaArr = [];

		this._roadFenZhiArr = [];
		this._lastType = [];
		this._cenjiArr = [];
		this._endRoadFenZhiTypeArr = [];
		this._roadPosiArr = [];
		this._endReturnGameData = null;
		this._oriX = [312];
		this._oriY = [0];
		
		this._roadNum = 1;
	}


	
	private _jsonKuai:JSON = null;							// 所有道路类型的JSON配置
	private _dataKuaiRes:any[] = [];						// 从道路类型Json解析出来的每块道路类型配置
	private _jsonKuaiPosi:JSON = null;						// 所有道路的点
	private _dataKuaiPosi:any[] = [];						// 从道路的点Json解析出来的每块道路的点
	private _jsonRoadMap:JSON = null;						// 道路的布局的JSON配置

	private _roadFenZhiArr:any[] = [];						// 地图的分支  生成的地图类型
	private _lastType:any[] =[];							// 上一个的道路分支
	private _cenjiArr:any[]=[];								// 显示的层级
	private _houseArr:any[]=[];								// 房子显示的位置
	private _ballArr:any[]=[];								// 气球显示的位置

	private _roadImaArr:any[] = [];							// 生成的地图的显示图片
	private _huiheImaArr:any[] = [];						// 生成的汇合的图片

	private _endRoadFenZhiTypeArr:any[]=[];					// 最后整条道路的所有分支型号
	private _roadPosiArr:any[] = [];
	private _endReturnGameData:any = null;					// 最后给出的配置

	private _oriX:any[] = [312];							// 门的位置X
	private _oriY:any[] = [0];								// 门的位置Y

	public _difficultyLevel:number = 0;						// 难度等级
	public _roadNum:number = 1;								// 道路数量


	private _redImaArr:any[] = [];							// 测试，生成的红点图片

	public static _inistence: RoadManager;					// 本身

	private _kuaiRes:string = "";							// 地图块名称

}