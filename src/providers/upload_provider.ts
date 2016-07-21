module RongIMLib {
    export interface UploadProvider {

        setListeners(listeners: any): void;

        startUpload(conversationType: ConversationType, targetId: string): void;

        stopUpload(): void;
    }

}
