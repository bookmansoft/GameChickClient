/**
 * 放入对象池中的对象，建议实现如下接口
 */
interface IObjectPool
{
    onInit():any; //返回自身
    onReturn():any;//返回自身
}

/**
 * 对象池
 */
class ObjectPool {
    private static pool: Object = {};

    //缓冲池对象必须实现IObjectPool接口
    private list: Array<IObjectPool>;

    private className: string;

    public constructor(className: string) {
        this.className = className;
        this.list = [];
    }

    /**
     * 获取对象
     */
    public borrowObject(...arg): any {
        if (this.list.length > 0) {
            let ret = this.list.shift();
            return typeof(ret.onInit) == 'function' ? ret.onInit() : ret;
        }
        var clazz: any = egret.getDefinitionByName(this.className);
        return new clazz(...arg);
    }

    /**
     * 回收对象
     */
    public returnObject(value: any): void {
        typeof(value.onReturn) == 'function' ? this.list.push(value.onReturn()) : this.list.push(value);
    }

    /**
     * 获取和类名称对应的对象池
     */
    public static getPool(className: string): ObjectPool {
        if (!ObjectPool.pool[className]) {
            ObjectPool.pool[className] = new ObjectPool(className);
        }
        return ObjectPool.pool[className];
    }
}