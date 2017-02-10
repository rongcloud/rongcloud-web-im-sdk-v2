module RongIMLib {
    export class TextMessage implements MessageContent, UserInfoAttachedMessage, ExtraAttachedMessage {
        user: UserInfo;
        extra: string;
        content: string;
        mentionedInfo: MentionedInfo;
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
            if (message.mentionedInfo) {
                this.mentionedInfo = message.mentionedInfo;
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

    export class ReadReceiptMessage implements MessageContent {
        lastMessageSendTime: number;
        messageUId: string;
        type: number;
        messageName: string = "ReadReceiptMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ReadReceiptMessage.");
            }
            this.lastMessageSendTime = message.lastMessageSendTime;
            this.messageUId = message.messageUId;
            this.type = message.type;
        }
        static obtain(messageUId: string, lastMessageSendTime: number, type: ConversationType): ReadReceiptMessage {
            return new ReadReceiptMessage({ messageUId: messageUId, lastMessageSendTime: lastMessageSendTime, type: type });
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
        mentionedInfo: MentionedInfo;
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
            if (message.mentionedInfo) {
                this.mentionedInfo = message.mentionedInfo;
            }
        }
        static obtain(base64Content: string, duration: number): VoiceMessage {
            return new VoiceMessage({ content: base64Content, duration: duration, extra: "" });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class RecallCommandMessage implements MessageContent {
        messageName: string = "RecallCommandMessage";
        messageUId: string;
        conversationType:ConversationType;
        targetId:string;
        sentTime:number;
        extra:string;
        user: UserInfo;
        constructor(message: any) {
            this.messageUId = message.messageUId;
            this.conversationType = message.conversationType;
            this.targetId = message.targetId;
            this.sentTime = message.sentTime;
            message.extra && (this.extra = message.extra);
            message.user && (this.user = message.user);
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
        mentionedInfo: MentionedInfo;
        messageName: string = "ImageMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
            }
            this.content = message.content;
            this.imageUri = message.imageUri;
            message.extra && (this.extra = message.extra);
            message.user && (this.user = message.user);
            if (message.mentionedInfo) {
                this.mentionedInfo = message.mentionedInfo;
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
        latitude: number;
        longitude: number;
        poi: string;
        content: string;
        extra: string;
        mentionedInfo: MentionedInfo;
        messageName: string = "LocationMessage";
        constructor(message: any) {
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
            }
            this.latitude = message.latitude;
            this.longitude = message.longitude;
            this.poi = message.poi;
            this.content = message.content;
            this.extra = message.extra;
            if (message.user) {
                this.user = message.user;
            }
            if (message.mentionedInfo) {
                this.mentionedInfo = message.mentionedInfo;
            }
        }

        static obtain(latitude: number, longitude: number, poi: string, content: string): LocationMessage {
            return new LocationMessage({ latitude: latitude, longitude: longitude, poi: poi, content: content, extra: "" });
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
        mentionedInfo: MentionedInfo;
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

        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class JrmfReadPacketMessage implements MessageContent{
        messageName : string = 'JrmfReadPacketMessage';
        message:JrmfReadPacketMessage;
        constructor(message:any){
            message && (this.message = message);
        }
        encode() : string {
            return "";
        }
    }

    export class JrmfReadPacketOpenedMessage implements MessageContent{
        messageName : string = 'JrmfReadPacketOpenedMessage';
        message:JrmfReadPacketOpenedMessage;
        constructor(message:any){
            message && (this.message = message);
        }
        encode() : string {
            return "";
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
        mentionedInfo: MentionedInfo;
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
            if (message.mentionedInfo) {
                this.mentionedInfo = message.mentionedInfo;
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

    export class SyncReadStatusMessage implements MessageContent {
        messageName: string = "SyncReadStatusMessage";
        lastMessageSendTime: number;
        constructor(message: any) {
            message.lastMessageSendTime && (this.lastMessageSendTime = message.lastMessageSendTime);
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class ReadReceiptRequestMessage implements MessageContent {
        messageName: string = "ReadReceiptRequestMessage";
        messageUId: string;
        constructor(message: any) {
            message.messageUId && (this.messageUId = message.messageUId);
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class ReadReceiptResponseMessage implements MessageContent {
        messageName: string = "ReadReceiptResponseMessage";
        receiptMessageDic: any;
        constructor(message: any) {
            message.receiptMessageDic && (this.receiptMessageDic = message.receiptMessageDic);
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
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
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class FileMessage implements MessageContent {
        user: UserInfo;
        messageName: string = "FileMessage";
        name: string;
        size: number;
        type: string;
        fileUrl: string;
        extra: string;
        constructor(message: any) {
            message.name && (this.name = message.name);
            message.size && (this.size = message.size);
            message.type && (this.type = message.type);
            message.fileUrl && (this.fileUrl = message.fileUrl);
            message.extra && (this.extra = message.extra);
            message.user && (this.user = message.user);
        }
        static obtain(msg: any): FileMessage {
            return new FileMessage({ name: msg.name, size: msg.size, type: msg.type, fileUrl: msg.fileUrl });
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class ChannelInfo {
        constructor(
            public Id: string,
            public Key: string) { }
    }

    export class AcceptMessage implements MessageContent {
        messageName: string = "AcceptMessage";
        callId: string;
        mediaType: VoIPMediaType;
        constructor(message: any) {
            this.callId = message.callId;
            this.mediaType = message.mediaType;
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class RingingMessage implements MessageContent {
        messageName: string = "RingingMessage";
        callId: string;
        constructor(message: any) {
            this.callId = message.callId;
        }
        encode(): string {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class SummaryMessage implements MessageContent {
        messageName: string = "SummaryMessage";
        caller: string;
        inviter: string;
        mediaType: VoIPMediaType;
        memberIdList: string[];
        startTime: number;
        connectedTime: number;
        duration: number;
        status: ErrorCode;
        constructor(message: any) {
            this.caller = message.caller;
            this.inviter = message.inviter;
            this.mediaType = message.mediaType;
            this.memberIdList = message.memberIdList;
            this.startTime = message.startTime;
            this.connectedTime = message.connectedTime;
            this.duration = message.duration;
            this.status = message.status;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class HungupMessage implements MessageContent {
        messageName: string = "HungupMessage";
        callId: string;
        reason: string;
        constructor(message: any) {
            this.callId = message.callId;
            this.reason = message.reason;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class InviteMessage implements MessageContent {
        messageName: string = "InviteMessage";
        callId: string;
        engineType: number;
        channelInfo: ChannelInfo;
        mediaType: VoIPMediaType;
        inviteUserIds: string[];
        extra: string;
        constructor(message: any) {
            this.callId = message.callId;
            this.engineType = message.engineType;
            this.channelInfo = message.channelInfo;
            this.mediaType = message.mediaType;
            this.extra = message.extra;
            this.inviteUserIds = message.inviteUserIds;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class MediaModifyMessage implements MessageContent {
        messageName: string = "MediaModifyMessage";
        callId: string;
        mediaType: VoIPMediaType;
        constructor(message: any) {
            this.callId = message.callId;
            this.mediaType = message.mediaType;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

    export class MemberModifyMessage implements MessageContent {
        messageName: string = "MemberModifyMessage";
        modifyMemType: number;
        callId: string;
        caller: string;
        engineType: number;
        channelInfo: ChannelInfo;
        mediaType: VoIPMediaType;
        extra: string;
        inviteUserIds: string[];
        existedMemberStatusList: string[];
        constructor(message: any) {
            this.modifyMemType = message.modifyMemType;
            this.callId = message.callId;
            this.caller = message.caller;
            this.engineType = message.engineType;
            this.channelInfo = message.channelInfo;
            this.mediaType = message.mediaType;
            this.extra = message.extra;
            this.inviteUserIds = message.inviteUserIds;
            this.existedMemberStatusList = message.existedMemberStatusList;
        }
        encode() {
            return JSON.stringify(ModelUtil.modelClone(this));
        }
    }

}
