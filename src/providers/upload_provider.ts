module RongIMLib {
    export interface UploadProvider {

        setListeners(listeners: any): void;

        startUpload(): void;

        stopUpload(): void;
    }

}
