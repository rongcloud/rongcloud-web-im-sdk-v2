module RongIMLib {

    export class MemeoryProvider implements StorageProvider {
        _host: string;
        _memeoryStore: any = {};
        prefix: string = "rong_";
        setItem(composedKey: string, object: any): void {
            this._memeoryStore[composedKey] = decodeURIComponent(object);
        }

        getItem(composedKey: string): string {
            return this._memeoryStore[composedKey];
        }

        removeItem(composedKey: string): void {
            if (this.getItem(composedKey)) {
                delete this._memeoryStore[composedKey];
            }
        }

        getItemKey(regStr: string): any {
            var me = this, item: any = null, reg = new RegExp(regStr + "\\w+");
            for (var key in me._memeoryStore) {
                var arr = key.match(reg);
                if (arr) {
                    item = key;
                }
            }
            return item;
        }
        clearItem(): void {
            var me = this;
            for (var key in me._memeoryStore) {
                delete me._memeoryStore[key];
            }
        }
        //单位：字节
        onOutOfQuota(): number {
            return 4 * 1024;
        }
    }
}
