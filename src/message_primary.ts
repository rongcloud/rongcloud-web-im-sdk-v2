module RongIMLib {
    export class TextMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        //此处直接赋值对象为以后添加扩展属性埋下伏笔
        static message: any;
        constructor(message: any) {
            super(message);
            if (!TextMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
            }
            super.setObjectName("RC:TxtMsg");
            super.setMessageType(MessageType[1]);
        }
        static obtain(text: string): TextMessage {
            TextMessage.message = new TextMessage({ extra: "", content: text });
            return TextMessage.message;
        }
        getMessage(): TextMessage {
            return TextMessage.message;
        }
    }

    export class VoiceMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        static message: VoiceMessage;
        constructor(message: any) {
            super(message);
            if (!VoiceMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");
            }
            super.setObjectName("RC:VcMsg");
            super.setMessageType(MessageType[3]);
        }

        static obtain(base64Content: string, duration: number): VoiceMessage {
            VoiceMessage.message = new VoiceMessage({
                content: base64Content,
                duration: duration,
                extra: ""
            });
            return VoiceMessage.message;
        }
        getMessage(): RongIMMessage {
            return VoiceMessage.message;
        }
        setDuration(a: any) {
            super.setContent(a, "duration");
        }
        getDuration(): any {
            return super.getDetail().duration;
        }
    }

    export class ImageMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        static message: ImageMessage;
        constructor(message: any) {
            super(message);
            if (!ImageMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
            }
            super.setMessageType(MessageType[2]);
            super.setObjectName("RC:ImgMsg");
        }
        static obtain(content: string, imageUri: string): ImageMessage {
            ImageMessage.message = new ImageMessage({
                content: content,
                imageUri: imageUri,
                extra: ""
            })
            return ImageMessage.message;
        }
        setImageUri(a: any) {
            super.setContent(a, "imageUri");
        }
        getImageUri(): string {
            return super.getDetail().imageUri
        }
        getMessage(): RongIMMessage {
            return ImageMessage.message;
        }
    }

    export class LocationMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        latitude: number;
        longitude: number;
        poi: string;
        imgUri: string;
        static message: LocationMessage;
        constructor(message: any) {
            super(message);
            if (!LocationMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
            }
            super.setMessageType(MessageType[8]);
            super.setObjectName("RC:LBSMsg");
        }

        static obtain(latitude: number, longitude: number, poi: string, imgUri: string): LocationMessage {
            LocationMessage.message = new LocationMessage({
                latitude: longitude,
                longitude: longitude,
                poi: poi,
                imgUri: imgUri,
                extra: ""
            });
            return LocationMessage.message;
        }
        getMessage(): RongIMMessage {
            return LocationMessage.message;
        }
        setLatitude(a: any) {
            super.setContent(a, "latitude")
        }
        getLatitude(): number {
            return this.getDetail().latitude;
        }
        setLongitude(a: any) {
            super.setContent(a, "longitude")
        }
        getLongitude(): number {
            return this.getDetail().longitude;
        }
        setPoi(a: any) {
            super.setContent(a, "poi")
        }
        getPoi(): string {
            return this.getDetail().poi;
        }

    }
    export class RichContentMessage extends RongIMMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        static message: RichContentMessage;
        constructor(message: any) {
            super(message);
            if (!LocationMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
            }
            super.setMessageType(MessageType[4]);
            super.setObjectName("RC:ImgTextMsg");
        }
        static obtain(title: string, content: string, imageUri: string): RichContentMessage {
            RichContentMessage.message = new RichContentMessage({
                title: title,
                content: content,
                imageUri: imageUri
            });
            return RichContentMessage.message;
        }
        getMessage(): RongIMMessage {
            return RichContentMessage.message;
        }
        setTitle(a: any) {
            super.setContent(a, "title")
        };
        getTitle(): string {
            return this.getDetail().title;
        };
        setImageUri(a: any) {
            super.setContent(a, "imageUri")
        };
        getImageUri(): string {
            return this.getDetail().imageUri;
        };
    }
    export class UnknownMessage extends RongIMMessage implements MessageContent {
        constructor(data: string, objectName: string) {
            super(this);
            super.setMessageType(MessageType[6]);
            super.setObjectName(objectName);
        }
        getMessage(): RongIMMessage {
            return this;
        }
    }
}
