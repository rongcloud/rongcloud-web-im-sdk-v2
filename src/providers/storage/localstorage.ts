module RongIMLib {
    export class LocalStorageProvider implements StorageProvider {
        _host: string;
        setItem(composedKey: string, object: any): void {
            if (localStorage.length == 20) {localStorage.removeItem(localStorage.key(0));}
            localStorage.setItem(composedKey.toString(), object);
        }

        getItem(composedKey: string): string {
            return localStorage.getItem(composedKey ? composedKey.toString() : "");
        }

        removeItem(composedKey: string): void {
            localStorage.removeItem(composedKey.toString());
        }

        clearItem(): void {
            localStorage.clear();
        }
        getItemKey(regStr: string): any {
            var val: string = "";
            for (let i = 0, len = localStorage.length; i < len; i++) {
                if (localStorage.key(i).indexOf(regStr) > -1) {
                    val = localStorage.key(i);
                    break;
                }
            }
            return val ? val : null;
        }
        //单位：字节
        onOutOfQuota(): number {
            return JSON.stringify(localStorage).length;
        }
    }
}
