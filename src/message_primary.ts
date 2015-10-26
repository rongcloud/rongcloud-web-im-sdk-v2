module RongIMLib {
    export class TextMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        //此处直接赋值对象为以后添加扩展属性埋下伏笔
        static message: any;
        constructor(message: any) {
            super(message);
            if (!TextMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead.");
            }
            super.setObjectName("RC:TxtMsg");
            super.setMessageType(MessageType[1]);
        }
        static obtain(text: string): TextMessage {
            TextMessage.message = new TextMessage({extra:"",content:text});
            return TextMessage.message;
        }
        encode(): any {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(0);
            c.setClassname(TextMessage.message.getObjectName());
            c.setContent(JSON.stringify(TextMessage.message.getDetail()));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val))
            }
            return val
        }
        getMessage(): TextMessage {
            return TextMessage.message;
        }
    }

    export class VoiceMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        duration: number;
        private _base64Content: string;

        constructor(data?: string) {
            super(this);
            if (!VoiceMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead.");
            }
        }

        static obtain(base64Content: string, duration: number): VoiceMessage {
            var message = new VoiceMessage();

            message._base64Content = base64Content;
            message.duration = duration;

            return message;
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }

    export class ImageMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;

        constructor(data: string) {
            super(this);
        }

        static obtain(content: string): ImageMessage {
            return undefined;
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }

    export class LocationMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        latitude: number;
        longitude: number;
        poi: string;
        imgUri: string;

        constructor(data: string) {
            super(this);
        }

        static obtain(latitude: number, longitude: number, poi: string, imgUri: string): LocationMessage {
            return undefined;
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }

    export class UnknownMessage extends RongIMMessage implements MessageContent {
        constructor(data: string, objectName: string) {
            super(this);
        }

        encode(): string {
            return JSON.stringify(this);
        }
        getMessage(): RongIMMessage {
            return this.message;
        }
    }
}
