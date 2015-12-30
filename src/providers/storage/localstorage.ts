module RongIMLib {
    export class LocalStorageProvider implements StorageProvider {
        setItem(composedKey: string, object: any): void {
            if (localStorage.length == 20) { localStorage.removeItem(localStorage.key(0)); }
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
        //单位：字节
        onOutOfQuota(): number {
            return JSON.stringify(localStorage).length;
        }
    }
}
