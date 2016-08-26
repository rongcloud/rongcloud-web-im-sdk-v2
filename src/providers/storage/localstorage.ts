module RongIMLib {
    export class LocalStorageProvider implements StorageProvider {

        prefix: string = 'cu';

        static _instance: LocalStorageProvider = new LocalStorageProvider();

        constructor() {
            var d = new Date(), date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            for (var key in localStorage) {
                if (key.lastIndexOf('RSPCOUNT') > -1) {
                    var senderData = JSON.parse(localStorage[key]);
                    new Date(date).getTime() - senderData.time > 0 && localStorage.removeItem(key);
                }
                if (key.lastIndexOf('REQ') > -1) {
                    var idStore = JSON.parse(localStorage[key]);
                    for (var uid in idStore) {
                        new Date(date).getTime() - idStore[uid] > 0 && (delete idStore[uid]);
                    }
                    if (MessageUtil.isEmpty(idStore)) {
                        localStorage.removeItem(key);
                    } else {
                        localStorage.setItem(key, JSON.stringify(idStore));
                    }
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
