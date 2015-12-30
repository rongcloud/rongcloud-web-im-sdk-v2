module RongIMLib {

    export interface StorageProvider {
        setItem(composedKey: string, object: any): void;

        getItem(composedKey: string): string;

        removeItem(composedKey: string): void;

        clearItem(): void;

        onOutOfQuota(): number;

    }
    //动态生成key接口
    export interface ComposeKeyFunc {
        (object: any): string;
    }
}
