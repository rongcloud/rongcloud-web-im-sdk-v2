module RongIMLib {

    export interface StorageProvider {
        setItem(composedKey: string, object: any): void;

        getItem(composedKey: string): string;

        removeItem(composedKey: string): void;

        clearItem(): void;

        onOutOfQuota(): number;
        /**
         * 获取keys方法
         * @param  {string}  regStr   正则表达式内容
         * @param  {boolean} isUseDef 不传使用默认，传true使用自定义正则表达式
         */
        getKeys(regStr: string, isUseDef?: boolean): any;

        getMsgKeys(regStr: string, isUseDef?: boolean): any;


        // getDataAccessProvider(): DataAccessProvider;
    }
    //动态生成key接口
    export interface ComposeKeyFunc {
        (object: any): string;
    }
}
