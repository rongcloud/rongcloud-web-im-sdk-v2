module RongIMLib {

    export class RongUploadLib implements UploadProvider {

        private static _instance: RongUploadLib;

        static init(options: any): void {
            RongUploadLib._instance = new RongUploadLib(options);
        }

        constructor(opt: any) {
            
        }

        getInstance(): RongUploadLib {
            return RongUploadLib._instance;
        }

        setListeners(listeners: any): void {

        }

        startUpload(): void {

        }

        stopUpload(): void {

        }


    }

}
