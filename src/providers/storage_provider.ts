module RongIMLib {

    export interface StorageProvider {
        _host: string;

        setItem(composedKey: string, object: any): void;

        getItem(composedKey: string): string;

        removeItem(composedKey: string): void;

        clearItem(): void;

        onOutOfQuota(): number;

        getItemKey(regStr: string): any;

        // getDataAccessProvider(): DataAccessProvider;
    }
    //动态生成key接口
    export interface ComposeKeyFunc {
        (object: any): string;
    }
}
