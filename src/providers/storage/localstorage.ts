module RongIMLib {
    export class LocalStorageProvider implements StorageProvider {

        prefix: string = 'cu';

        static _instance: LocalStorageProvider = new LocalStorageProvider();

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
