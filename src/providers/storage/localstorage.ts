module RongIMLib {
    export class LocalStorageProvider implements StorageProvider {

        prefix: string = 'cu';

        static _instance: LocalStorageProvider = new LocalStorageProvider();

        constructor() {
            var d = new Date(), m = d.getMonth() + 1, date = d.getFullYear() + '/' + (m.toString().length == 1 ? '0' + m : m) + '/' + d.getDate(),
                nowDate = new Date(date).getTime();
            for (var key in localStorage) {
                if (key.lastIndexOf('RECEIVED') > -1) {
                    var recObj = JSON.parse(localStorage.getItem(key));
                    for (let key in recObj) {
                        nowDate - recObj[key].dealtime > 0 && (delete recObj[key]);
                    }
                    if (MessageUtil.isEmpty(recObj)) {
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

        static getInstance(): LocalStorageProvider {
            return LocalStorageProvider._instance;
        }

        setItem(composedKey: string, object: any): void {
            if (composedKey) {
                localStorage.setItem(composedKey.toString(), object);
            }
        }

        getItem(composedKey: string): string {
            if (composedKey) {
                return localStorage.getItem(composedKey ? composedKey.toString() : "");
            }
            return "";
        }

        removeItem(composedKey: string): void {
            if (composedKey) {
                localStorage.removeItem(composedKey.toString());
            }
        }

        clearItem(): void {
            var me = this, str: string = me.prefix + Bridge._client.userId;
            for (var key in localStorage) {
                if (key.indexOf(str) > -1) {
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
