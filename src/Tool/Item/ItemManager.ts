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
            if (id == 401 || id == 402 || id == 403){ // 使用奴隶交互物品
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
                return 1000+id;
            case "road":
                return 10000+id;
            case "role":
                return 20000+id;
            case "scene":
                return 30000+id;
            case 'I':
                return 40000+id;
            case 'box':
                return 50000+id;
            case 'D':
                return 1;
            case 'M':
                return 2;
            case 'A':
                return 9;
            case 'V':
                return 20;
            default:
                return 0;
        }
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