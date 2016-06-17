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

    export interface VoIPProvider {

        /**
         * 设置音频参数
         * @params opt {size:{height:100,width:200},container:'显示 video 容器'}
         */
        startCall(converType: ConversationType, targetId: string, userIds: string[], mediaType: VoIPMediaType, extra: string, opt: any, callback: ResultCallback<ErrorCode>): void;

        hangupCall(converType: ConversationType, targetId: string, reason: string, callback: any): void;

        joinCall(message: Message, mediaType: VoIPMediaType, opt: any, callback: ResultCallback<ErrorCode>): void;

        onReceived(message: Message, imOnReceived: any): boolean;
    }
}
