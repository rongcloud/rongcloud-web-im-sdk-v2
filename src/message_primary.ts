module RongIMLib {
    export class TextMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        content: string;

        constructor(data?: string) {
            if (!TextMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead.");
            }
        }

        static obtain(content: string): TextMessage {
            var message = new TextMessage();

            message.content = content;

            return message;
        }

        encode(): string {
            return JSON.stringify(this);
        }
    }

    export class VoiceMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        duration: number;
        private _base64Content: string;

        constructor(data?: string) {
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
    }

    export class ImageMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;

        constructor(data: string) {

        }

        static obtain(content: string): ImageMessage {
            return undefined;
        }

        encode(): string {
            return JSON.stringify(this);
        }
    }

    export class LocationMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        latitude: number;
        longitude: number;
        poi: string;
        imgUri: string;

        constructor(data: string) {

        }

        static obtain(latitude: number, longitude: number, poi: string, imgUri: string): LocationMessage {
            return undefined;
        }

        encode(): string {
            return JSON.stringify(this);
        }
    }

    export class UnknownMessage implements MessageContent {
        constructor(data: string,objectName:string) {

        }

        encode(): string {
            return JSON.stringify(this);
        }
    }
}
