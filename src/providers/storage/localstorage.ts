module RongIMLib {
    export class LocalStorageProvider implements StorageProvider {

        prefix: string = 'rong_';

        _host: string = "";

        // static _instance: LocalStorageProvider = new LocalStorageProvider();

        constructor() {
            var d = new Date(), m = d.getMonth() + 1, date = d.getFullYear() + '/' + (m.toString().length == 1 ? '0' + m : m) + '/' + d.getDate(),
                nowDate = new Date(date).getTime();
            for (var key in localStorage) {
                if (key.lastIndexOf('RECEIVED') > -1) {
                    var recObj = JSON.parse(localStorage.getItem(key));
                    for (let key in recObj) {
                        nowDate - recObj[key].dealtime > 0 && (delete recObj[key]);
                    }
                    if (ObjectTools.isEmpty(recObj)) {
                        localStorage.removeItem(key);
                    } else {
                        localStorage.setItem(key, JSON.stringify(recObj));
                    }
                }
                if (key.lastIndexOf('SENT') > -1) {
                    var sentObj = JSON.parse(localStorage.getItem(key));
                    nowDate - sentObj.dealtime > 0 && (localStorage.removeItem(key));
                }
            }
        }

        setItem(composedKey: string, object: any): void {
            if (composedKey) {
                composedKey.indexOf(this.prefix) == -1 && (composedKey = this.prefix + composedKey);
                localStorage.setItem(composedKey, object);
            }
        }

        getItem(composedKey: string): string {
            if (composedKey) {
                composedKey.indexOf(this.prefix) == -1 && (composedKey = this.prefix + composedKey);
                return localStorage.getItem(composedKey ? composedKey : "");
            }
            return "";
        }

        getItemKey(composedStr: string): string {
            var item = "";
            for (var key in localStorage) {
                if (key.indexOf(composedStr) > -1) {
                    item = key;
                    break;
                }
            }
            return item;
        }

        removeItem(composedKey: string): void {
            if (composedKey) {
                composedKey.indexOf(this.prefix) == -1 && (composedKey = this.prefix + composedKey);
                localStorage.removeItem(composedKey.toString());
            }
        }

        clearItem(): void {
            var me = this;
            for (var key in localStorage) {
                if (key.indexOf(me.prefix) > -1) {
                    me.removeItem(key);
                }
            }
        }
        //单位：字节
        onOutOfQuota(): number {
            return JSON.stringify(localStorage).length;
        }
    }
}
