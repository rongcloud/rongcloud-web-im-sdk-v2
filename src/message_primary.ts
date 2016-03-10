module RongIMLib {
    export class TextMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        extra: string;
        content: string;
        messageName: string = "TextMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
            }
            this.content = message.content;
            this.extra = message.extra;
            if (message.user) {
                this.user = message.user;
            }
        }
        static obtain(text: string): TextMessage {
            return new TextMessage({ extra: "", content: text });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class TypingStatusMessage implements MessageContent {
        typingContentType: string;
        data: string;
        messageName: string = "TypingStatusMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TypingStatusMessage.");
            }
            this.typingContentType = message.typingContentType;
            this.data = message.data;
        }
        static obtain(typingContentType: string, data: string): TypingStatusMessage {
            return new TypingStatusMessage({ typingContentType: typingContentType, data: data });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class VoiceMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
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
            if (message.user) {
                this.user = message.user;
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
        user: UserInfo;
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
            if (message.user) {
                this.user = message.user;
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
        user: UserInfo;
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
            this.poi = message.poi;
            this.content = message.content;
            this.extra = message.extra;
            if (message.user) {
                this.user = message.user;
            }
        }

        static obtain(latitude: number, longitude: number, poi: string, content: string): LocationMessage {
            return new LocationMessage({ latitude: longitude, longitude: longitude, poi: poi, content: content, extra: "" });
        }

        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class RichContentMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        title: string;
        content: string;
        imageUri: string;
        extra: string;
        url: string;
        messageName: string = "RichContentMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
            }
            this.title = message.title;
            this.content = message.content;
            this.imageUri = message.imageUri;
            this.extra = message.extra;
            this.url = message.url;
            if (message.user) {
                this.user = message.user;
            }
        }
        static obtain(title: string, content: string, imageUri: string, url: string): RichContentMessage {
            return new RichContentMessage({ title: title, content: content, imageUri: imageUri, url: url, extra: "" });
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
        user: UserInfo;
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
            if (message.user) {
                this.user = message.user;
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
        user: UserInfo;
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
        user: UserInfo;
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
