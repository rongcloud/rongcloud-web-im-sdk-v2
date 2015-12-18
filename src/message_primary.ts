module RongIMLib {
    export class TextMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        content: string;
        messageName: string = "TextMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
            }
            this.content = message.content;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(text: string): TextMessage {
            return new TextMessage({ extra: "", content: text });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }
    export class VoiceMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        content: string;
        duration: number;
        extra: string;
        messageName: string = "VoiceMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");
            }
            this.content = message.content;
            this.duration = message.duration;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(base64Content: string, duration: number): VoiceMessage {
            return new VoiceMessage({ content: base64Content, duration: duration, extra: "" });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class ImageMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        content: string;
        imageUri: string;
        extra: string;
        messageName: string = "ImageMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
            }
            this.content = message.content;
            this.imageUri = message.imageUri;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(content: string, imageUri: string): ImageMessage {
            return new ImageMessage({ content: content, imageUri: imageUri, extra: "" });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class LocationMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        latiude: number;
        longitude: number;
        poi: string;
        content: string;
        extra: string;
        messageName: string = "LocationMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
            }
            this.latiude = message.latitude;
            this.longitude = message.longitude;
            this.poi = message.pot;
            this.content = message.content;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }

        static obtain(latitude: number, longitude: number, poi: string, imgUri: string): LocationMessage {
            return new LocationMessage({ latitude: longitude, longitude: longitude, poi: poi, imgUri: imgUri, extra: "" });
        }

        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class RichContentMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        title: string;
        content: string;
        imageUri: string;
        extra: string;
        messageName: string = "RichContentMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
            }
            this.title = message.title;
            this.content = message.content;
            this.imageUri = message.imageUri;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(title: string, content: string, imageUri: string): RichContentMessage {
            return new RichContentMessage({ title: title, content: content, imageUri: imageUri, extra: "" });
        }

        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class UnknownMessage implements MessageContent {
        message: UnknownMessage;
        messageName: string = "UnknownMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> UnknownMessage.");
            }
            this.message = message;
        }
        encode(): string {
            return "";
        }
    }


    export class PublicServiceCommandMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        menuItem: PublicServiceMenuItem;
        content: string;
        extra: string;
        messageName: string = "PublicServiceCommandMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> PublicServiceCommandMessage.");
            }
            this.content = message.content;
            this.extra = message.extra;
            this.menuItem = message.menuItem;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        static obtain(item: PublicServiceMenuItem): PublicServiceCommandMessage {
            return new PublicServiceCommandMessage({ content: "", command: "", menuItem: item, extra: "" });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class PublicServiceMultiRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        richContentMessages: Array<RichContentMessage>;
        messageName: string = "PublicServiceMultiRichContentMessage";
        constructor(messages: Array<RichContentMessage>) {
            this.richContentMessages = messages;
        }
        encode(): any {
            return null;
        }
    }

    export class PublicServiceRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        richContentMessage: RichContentMessage;
        messageName: string = "PublicServiceRichContentMessage";
        constructor(message: RichContentMessage) {
            this.richContentMessage = message;
        }
        encode(): any {
            return null;
        }
    }
}
