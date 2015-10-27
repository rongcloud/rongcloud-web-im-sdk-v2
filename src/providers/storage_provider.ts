module RongIMLib {

    export interface StorageProvider {

        setObject(object: any, composedKey: ComposeKeyFunc): void;

        getObject(composedKey: ComposeKeyFunc): void;

        removeObject(composedKey: ComposeKeyFunc): void;

        clearObject(composedKey: ComposeKeyFunc): void;

        onOutOfQuota(currentMaxSize: number): void;

        // getDataAccessProvider(): DataAccessProvider;
    }
    //动态生成key接口
    export interface ComposeKeyFunc {
        (object: any): string;
    }
}
