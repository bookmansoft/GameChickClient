/**
 * 物品管理器
 */
class ItemManager{
    /**
     * 复活道具ID
     */
    public static ReviveItemID: number = 40020;

    /**
     * 初始化物品
     */
    public static Init(){
        var jsonData: JSON = RES.getRes("itemdata_json");
        Object.keys(jsonData).map((id)=>{
            let data = jsonData[id];
            data.xid = id;
            ItemManager._itemSet.push(new Item(data));
        });
    }

    /**
     * 添加物品
     * @param xid   物品复合索引
     * @param num   物品数量
     */
    public static AddItem(xid: number, num: number){
        if (ItemManager._itemCountSet[xid] == null){
            ItemManager._itemCountSet[xid] = num;
        }
        else{
            ItemManager._itemCountSet[xid] += num;
        }
        if (xid == ItemManager.ReviveItemID){
            GameEvent.DispatchEvent(EventType.ReviveItemUpdate);
        }

        if(ItemManager.JudgeIsRoleSuiPian(xid)){
            GameEvent.DispatchEvent(EventType.RoleSuiPianItemUpdate);
        }
    }

    /**
     * 判断物品是否是角色碎片
     */
    public static JudgeIsRoleSuiPian($id){
        var item: Item = ItemManager.GetItemByID($id);
        if (item != null) return item.IsDebris;
        return false;
    }

    /**
     * 设置物品数量
     * @param xid   物品ID
     * @param num   物品数量
     */
    public static SetItemCount(xid: number, num: number){
        if (ItemManager._itemCountSet[xid] == null){
            ItemManager.AddItem(xid, num);
            return;
        } 
        ItemManager._itemCountSet[xid] = num;
        if (xid == ItemManager.ReviveItemID){
            GameEvent.DispatchEvent(EventType.ReviveItemUpdate);
        }

        if(ItemManager.JudgeIsRoleSuiPian(xid)){
            GameEvent.DispatchEvent(EventType.RoleSuiPianItemUpdate);
        }
        if (xid == 40401 || xid == 40402 || xid == 40403){
            GameEvent.DispatchEvent(EventType.SlaveItemUpdate);
        }
    }

    /**
     * 获得物品数量
     * @param id    物品ID
     */
    public static GetItemCount(id: number): number{
        if (ItemManager._itemCountSet[id] == null) return 0;
        return ItemManager._itemCountSet[id];
    }

    /**
     * 使用物品
     * @param id    物品ID
     * @param num   使用物品数量
     * @returns     返回是否使用成功
     */
    public static UseItem(id: number, num: number): boolean{
        if (ItemManager._itemCountSet[id] == null) return false;
        if (ItemManager._itemCountSet[id] >= num){
            ItemManager._itemCountSet[id] -= num;
            if (id == ItemManager.ReviveItemID){
                GameEvent.DispatchEvent(EventType.ReviveItemUpdate);
            }
            if(ItemManager.JudgeIsRoleSuiPian(id)){
                GameEvent.DispatchEvent(EventType.RoleSuiPianItemUpdate);
            }
            if (id == 40401 || id == 40402 || id == 40403){ // 使用奴隶交互物品
                GameEvent.DispatchEvent(EventType.SlaveItemUpdate);
            }

            if(id == 22){ // 使用矿泉水
                var text: string = StringMgr.GetText("itemusertext1");
                text = text.replace("&num", num.toString());
                PromptManager.CreatTopTip(text);
            }
            if(id == 23){ // 使用咖啡机
                PromptManager.CreatTopTip(StringMgr.GetText("itemusertext3"));
            }
            
            return true;
        }
        return false;
    }

    /**
     * 通过ID获得物品
     * @param id    物品ID
     */
    public static GetItemByID(id: number): Item{
        for (var i = 0; i < ItemManager._itemSet.length; i++) {
            if (ItemManager._itemSet[i].XID == id){
                return ItemManager._itemSet[i];
            }
        }
        return null;
    }

    public static GetXID(type, id) {
        switch(type) {
            case 'C':
            case 1000:
                return 1000 + parseInt(id);
            case "road":
            case 10000:
                return 10000 + parseInt(id);
            case "role":
            case 20000:
                return 20000 + parseInt(id);
            case "scene":
            case 30000:
                return 30000 + parseInt(id);
            case 'I':
            case 40000:
                return 40000 + parseInt(id);
            case 'box':
            case 50000:
                return 50000 + parseInt(id);
            case 'NFT':
            case 60000:
                return 60000 + parseInt(id);
            case 'D':
            case 1:
                return 1;
            case 'M':
            case 2:
                return 2;
            case 'GAS':
            case 5:
                return 5;
            case 'A':
            case 9:
                return 9;
            case 'V':
            case 20:
                return 20;
        }
        return parseInt(id);
    }

    /**
     * 将可能的数字形式的奖励类型转换成字母型，增强客户端显示兼容性
     */
    public static GetItemCode(type) {
        switch(type) {
            case 1000:
                return "C";
            case 10000:
                return "road";
            case 20000:
                return "role";
            case 30000:
                return "scene";
            case 40000:
                return 'I';
            case 50000:
                return 'box';
            case 60000:
                return 'NFT';
            case 1:
                return 'D';
            case 2:
                return 'M';
            case 5:
                return 'GAS';
            case 9:
                return 'A';
            case 20:
                return 'V';
        }
        return type;
    }

    /**
     * 获得以后的物品ID列表
     */
    public static GetItemIDSet(): number[]{
        var idSet: number[] = [];
        Object.keys(ItemManager._itemCountSet).map((key)=>{
            var id: number = parseInt(key);
            var item: Item = ItemManager.GetItemByID(id);
            var count: number = ItemManager.GetItemCount(id);
            if (item != null && count > 0 && (item.IsItem || item.IsDebris)){
                idSet.push(id);
            }
        })
        return idSet;
    }

    // 变量
    private static _itemCountSet: Object = {};      // 物品数量集合
    private static _itemSet: Item[] = [];           // 物品集合
}