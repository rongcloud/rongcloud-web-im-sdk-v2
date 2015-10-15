module RongIMLib {
    export abstract class MessageContent {
        constructor(data?: string) {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        }
        static obtain(): MessageContent {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        }

        abstract encode(): string;
    }
    export abstract class NotificationMessage extends MessageContent { }

    export abstract class StatusMessage extends MessageContent { }

    export interface UserInfoAttachedMessage {
        userInfo: UserInfo;
    }

    export interface ExtraAttachedMessage {
        extra: string;
    }

    export interface InFMessageHandler {

        putCallback(callbackObj: any, _publishMessageId: any, _msg: any): any;

        setConnectCallback(_connectCallback: any): void;

        onReceived(msg: any): void;

        handleMessage(msg: any): void;

    }
}
