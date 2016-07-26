module RongIMLib {
    export interface UploadProvider {

        setListeners(listeners: any): void;

        start(conversationType: ConversationType, targetId: string): void;

        cancel(file: any): void;

        reload(image: string, file: string): void;

        destroy(): void;

        postImage(base64: string, conversationType: ConversationType, targetId: string, callback: any): void;
    }

}
