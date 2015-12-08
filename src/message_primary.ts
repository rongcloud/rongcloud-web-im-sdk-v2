module RongIMLib {
    export class TextMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        userInfo: UserInfo;
        message: TextMessage;
        content: string;
        extra: string;
        //persited 0:持久化 1:不持久化
        persited: number = 1;
        //counted 0:不累计未读消息数  2:累计为度消息数
        counted: number = 2;
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
            }
            this.message = message;
        }
        static obtain(text: string): TextMessage {
            var msg = new TextMessage({ extra: "", content: text });
            return msg;
        }
        setExtra(extra: string): void {
            this.message.extra = extra;
        }
        setContent(content: string): void {
            this.message.content = content;
        }
        getExtra(): string {
            return this.message.extra;
        }
        getContent(): string {
            return this.message.content;
        }
        encode() {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(this.persited | this.counted);
            c.setClassname("RC:TxtMsg");
            c.setContent(JSON.stringify(this.message));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val));
            }
            return val;
        }
    }

    export class VoiceMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        message: VoiceMessage;
        base64: string;
        duration: number;
        uri: string;
        extra: string;
        //persited 0:持久化 1:不持久化
        persited: number = 1;
        //counted 0:不累计未读消息数  2:累计为度消息数
        counted: number = 2;
        constructor(message: any) {
            if (!VoiceMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");
            }
            this.message = message;
        }

        static obtain(base64Content: string, duration: number): VoiceMessage {
            var msg = new VoiceMessage({ content: base64Content, duration: duration, extra: "" });
            return msg;
        }

        setBase64(base64: string) {
            this.message.base64 = base64;
        }

        setDuration(duration: number) {
            this.message.duration = duration;
        }

        setUri(uri: string) {
            this.message.uri = uri;
        }

        setExtra(extra: string) {
            this.message.extra = extra;
        }

        getBase64(): string {
            return this.message.base64;
        }

        getDuration(): number {
            return this.message.duration;
        }

        getUri(): string {
            return this.message.uri;
        }

        getExtra(): string {
            return this.message.extra;
        }


        encode() {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(this.persited | this.counted);
            c.setClassname("RC:VcMsg");
            c.setContent(JSON.stringify(this.message));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val));
            }
            return val;
        }
    }

    export class ImageMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        message: ImageMessage;
        base64: string;
        extra: string;
        localUri: string;
        remoteUri: string;
        thumUri: string;
        isFull: boolean = false;
        isUpLoadExp: boolean = false;
        //persited 0:持久化 1:不持久化
        persited: number = 1;
        //counted 0:不累计未读消息数  2:累计为度消息数
        counted: number = 2;
        constructor(message: any) {
            if (!ImageMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
            }
            this.message = message;
        }
        static obtain(content: string, imageUri: string): ImageMessage {
            var msg = new ImageMessage({ content: content, imageUri: imageUri, extra: "" });
            return msg;
        }

        getBase64(): string {
            return this.message.base64;
        }

        getExtra(): string {
            return this.message.extra;
        }

        getLocalUri(): string {
            return this.message.localUri;
        }

        getRemoteUri(): string {
            return this.message.remoteUri;
        }

        getThumUri(): string {
            return this.message.thumUri;
        }

        getIsFull(): boolean {
            return this.message.isFull;
        }

        getIsUpLoadExp(): boolean {
            return this.message.isUpLoadExp;
        }

        setBase64(base64: string) {
            this.message.base64 = base64;
        }

        setExtra(extra: string) {
            this.message.extra = extra;
        }
        setLocalUri(localUri: string) {
            this.message.localUri = localUri;
        }
        setRemoteUri(remoteUri: string) {
            this.message.remoteUri = remoteUri;
        }
        setThumUri(thumUri: string) {
            this.message.thumUri = thumUri;
        }
        setIsUpLoadExp(isUpLoadExp: boolean) {
            this.message.isUpLoadExp = isUpLoadExp;
        }
        setIsFull(isFull: boolean) {
            this.message.isFull = isFull;
        }

        encode() {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(this.persited | this.counted);
            c.setClassname("RC:ImgMsg");
            c.setContent(JSON.stringify(this.message));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val));
            }
            return val;
        }
    }

    export class LocationMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        extra: string;
        base64: string;
        imgUri: string;
        lat: number;
        lng: number;
        poi: string;
        message: LocationMessage;
        //persited 0:持久化 1:不持久化
        persited: number = 1;
        //counted 0:不累计未读消息数  2:累计为度消息数
        counted: number = 2;
        constructor(message: any) {
            if (!LocationMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
            }
            this.message = message;
        }

        static obtain(latitude: number, longitude: number, poi: string, imgUri: string): LocationMessage {
            var msg = new LocationMessage({ latitude: longitude, longitude: longitude, poi: poi, imgUri: imgUri, extra: "" });
            return msg;
        }

        getBase64(): string {
            return this.message.base64;
        }
        getExtra(): string {
            return this.message.extra;
        }
        getImgUri(): string {
            return this.message.imgUri;
        }
        getLat(): number {
            return this.message.lat;
        }
        getLng(): number {
            return this.message.lng;
        }
        getPoi(): string {
            return this.message.poi;
        }

        setBase64(base64: string) {
            this.message.base64 = base64;
        }

        setExtra(extra: string) {
            this.message.extra = extra;
        }

        setImgUri(imgUri: string) {
            this.message.imgUri = imgUri;
        }

        setLat(lat: number) {
            this.message.lat = lat;
        }

        setLng(lng: number) {
            this.message.lng = lng;
        }

        setPoi(poi: string) {
            this.message.poi = poi;
        }

        encode() {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(this.persited | this.counted);
            c.setClassname("RC:LBSMsg");
            c.setContent(JSON.stringify(this.message));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val));
            }
            return val;
        }
    }

    export class RichContentMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        message: RichContentMessage;
        content: string;
        extra: string;
        imgUrl: string;
        title: string;
        url: string;
        //persited 0:持久化 1:不持久化
        persited: number = 1;
        //counted 0:不累计未读消息数  2:累计为度消息数
        counted: number = 2;
        constructor(message: any) {
            if (!LocationMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
            }
            this.message = message;
        }
        static obtain(title: string, content: string, imageUri: string): RichContentMessage {
            var msg = new RichContentMessage({ title: title, content: content, imageUri: imageUri });
            return msg;
        }

        getContent(): string {
            return this.message.content;
        }
        getExtra(): string {
            return this.message.extra;
        }
        getImgUrl(): string {
            return this.message.imgUrl;
        }
        getTitle(): string {
            return this.message.title;
        }
        getUrl(): string {
            return this.message.url;
        }

        setContent(content: string) {
            return this.message.content = content;
        }
        setExtra(extra: string) {
            return this.message.extra = extra;
        }
        setImgUrl(imgUrl: string) {
            return this.message.imgUrl = imgUrl;
        }
        setTitle(title: string) {
            return this.message.title = title;
        }
        setUrl(url: string) {
            return this.message.url = url;
        }

        encode() {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(this.persited | this.counted);
            c.setClassname("RC:ImgTextMsg");
            c.setContent(JSON.stringify(this.message));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val));
            }
            return val;
        }
    }

    export class UnknownMessage implements MessageContent {
        message: UnknownMessage;
        constructor(message: any) {
            if (!LocationMessage.caller && arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
            }
            this.message = message;
        }

        encode() {
            var c = new Modules.UpStreamMessage();
        }
    }


    export class PublicServiceCommandMessage implements MessageContent {
        message: PublicServiceCommandMessage;
        data: string;
        extra: string;
        command: string;
        //persited 0:持久化 1:不持久化
        persited: number = 1;
        //counted 0:不累计未读消息数  2:累计为度消息数
        counted: number = 2;
        menuItem: PublicServiceMenuItem;
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
            }
            this.message = message;
        }
        static obtain(item: PublicServiceMenuItem): PublicServiceCommandMessage {
            var msg = new PublicServiceCommandMessage({ extra: "", data: "", command: "", menuItem: item });
            return msg;
        }
        encode(): any {
            var c = new Modules.UpStreamMessage();
            c.setSessionId(this.persited | this.counted);
            c.setClassname("RC:PSCmd");
            c.setContent(JSON.stringify(this.message));
            var val = c.toArrayBuffer();
            if (Object.prototype.toString.call(val) == "[object ArrayBuffer]") {
                return [].slice.call(new Int8Array(val));
            }
            return val;
        }
    }

    export class PublicServiceMultiRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        richContentMessages: Array<RichContentMessage>;
        constructor(messages: Array<RichContentMessage>) {
            this.richContentMessages = messages;
        }
        getPublicServiceUserInfo(): UserInfo {
            return this.userInfo;
        }
        setPublicServiceUserInfo(user: UserInfo) {
            this.userInfo = user;
        }
        encode(): any {
            return null;
        }
    }

    export class PublicServiceRichContentMessage implements MessageContent, UserInfoAttachedMessage {
        userInfo: UserInfo;
        richContentMessage: RichContentMessage;
        constructor(message: RichContentMessage) {
            this.richContentMessage = message;
        }
        getMessage(): RichContentMessage {
            return this.richContentMessage;
        }
        getPublicServiceUserInfo(): UserInfo {
            return this.userInfo;
        }
        setPublicServiceUserInfo(user: UserInfo) {
            this.userInfo = user;
        }
        encode(): any {
            return null;
        }
    }
}
