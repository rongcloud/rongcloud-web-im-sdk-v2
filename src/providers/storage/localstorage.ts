module RongIMLib {
    export class LocalStorageProvider implements StorageProvider {

        static getInstance(): LocalStorageProvider {
            return new LocalStorageProvider();
        }

        setItem(composedKey: string, object: any): void {
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
