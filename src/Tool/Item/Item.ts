/**
 * 物品
 */
class Item{
    /**
     * 构造方法
     */
    public constructor(data: JSON){
        this._xid = data["xid"];
        this._id = data["id"];
        this._name = data["name"];
        this._res = data["pic"];
        this._type = data["type"];
        this._desc = data["desc"];
        this._price = data["price"];
    }

    /**
     * ID
     */
    public get ID(): number{
        return this._id;
    }

    public get XID(): number{
        return this._xid;
    }

    /**
     * 名字
     */
    public get Name(): string{
        return StringMgr.GetText(this._name);
    }

    /**
     * 图片资源
     */
    public get ImageRes(): string{
        let lg: string = StringMgr.LanguageSuffix;
        if(RES.getRes(this._res + lg + "_png")){
            return this._res + lg + "_png";
        }
        return this._res + "_png";
    }

    /**
     * 类型
     */
    public get Type(): string{
        return this._type;
    }

    /**
     * 类型描述
     */
    public get TypeDesc(): string{
        var desc: string = "";
        switch (ItemManager.GetItemCode(this._type)) {
            case "I":
                desc = StringMgr.GetText("commontext2");
                break;
            case "NFT":
                desc = StringMgr.GetText("commontext8");
                break;
            case "M":
                desc = StringMgr.GetText("commontext3");
                break;
            case "GAS":
                desc = StringMgr.GetText("commontext7");
                break;
            case "C":
                desc = StringMgr.GetText("commontext4");
                break;
            case "scene":
                desc = StringMgr.GetText("commontext5");
                break;
            case "road":
                desc = StringMgr.GetText("commontext6");
                break;
        }
        return desc;
    }

    /**
     * 描述
     */
    public get Desc(): string{
        return StringMgr.GetText(this._desc);
    }

    /**
     * 价格
     */
    public get Price(): number{
        return this._price;
    }

    /**
     * 是否是碎片
     */
    public get IsDebris(): boolean{
        return this._type == "C";
    }

    /**
     * 是否是道具
     */
    public get IsItem(): boolean{
        return this._type == "I";
    }

    // 变量
    private _xid: number;           // XID
    private _id: number;            // ID
    private _name: string;          // 名字
    private _res: string;           // 资源
    private _type: string;          // 类型
    private _desc: string;          // 描述
    private _price: number;         // 价格
}