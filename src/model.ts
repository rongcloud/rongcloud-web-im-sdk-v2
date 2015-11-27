module RongIMLib {
    export class Conversation {
        constructor(
            public conversationTitle?: string,
            public conversationType?: ConversationType,
            public draft?: string,
            public isTop?: boolean,
            public latestMessage?: any,
            public latestMessageId?: string,
            public notificationStatus?: ConversationNotificationStatus,
            public objectName?: string,
            public receivedStatus?: ReceivedStatus,
            public receivedTime?: Date,
            public senderUserId?: string,
            public senderUserName?: string,
            public sentStatus?: SentStatus,
            public sentTime?: number,
            public targetId?: string,
            public unreadMessageCount?: number,
            public senderPortraitUri?: string
        ) { }
        setTop(): void {
            RongIMClient.conversationMap.add(this);
        }
    }

    export class Discussion {
        /**
         *         disInfo.setCreatorId(entity.adminUserId);
                 disInfo.setId(entity.channelId);
                 disInfo.setMemberIdList(entity.firstTenUserIds);
                 disInfo.setName(entity.channelName);
                 disInfo.setOpen(entity.openStatus);
         */
        private creatorId: string;
        private id: string;
        private memberIdList: string[];
        private name: string;
        private isOpen: boolean;
        setId(id: string) {
            this.id = id;
        }
        setCreatorId(creatorId: string) {
            this.creatorId = creatorId;
        }
        setMemberIdList(memberIdList: string[]) {
            this.memberIdList = memberIdList;
        }
        setName(name: string) {
            this.name = name;
        }
        setOpen(isOpen: boolean) {
            this.isOpen = isOpen;
        }
        getId() {
            return this.id;
        }
        getCreatorId() {
            return this.creatorId;
        }
        getMemberIdList() {
            return this.memberIdList;
        }
        getName() {
            return this.name;
        }
        getOpen() {
            return this.isOpen;
        }
    }

    export class Group {
        constructor(
            public id: string,
            public name: string,
            public portraitUri: string
        ) { }
    }

    export class Message {
        constructor(
            public content?: MessageContent,
            public conversationType?: ConversationType,
            public extra?: string,
            public objectName?: string,
            public messageDirection?: MessageDirection,
            public messageId?: string,
            public receivedStatus?: ReceivedStatus,
            public receivedTime?: number,
            public senderUserId?: string,
            public sentStatus?: SentStatus,
            public sentTime?: number,
            public targetId?: string,
            public messageType?:string
           ) {}
        setObjectName(objectName: string) {
            this.objectName = objectName;
        }
        setMessage(content: MessageContent) {
            this.content = content;
        }
    }

    // TODO: TBD
    export class PublicServiceProfile {
        constructor(
            public name: string,
            public portraitUri: string,
            public publicServiceId: string,
            public hasFollowed: boolean,
            public introduction: string,
            public isGolbal: boolean

        ) { }
    }

    export class UserData {
        constructor(
            public accountInfo: UserData.AccountInfo,
            public appVersion: string,
            public clientInfo: UserData.ClientInfo,
            public contactInfo: UserData.ContactInfo,
            public extra: string,
            public personalInfo: UserData.PersonalInfo
        ) { }
    }

    export class UserInfo {
        userId: string;
        name: string;
        portraitUri: string;
        setUserId(userId: string) {
            this.userId = userId;
        }
        setUserName(name: string) {
            this.name = name;
        }
        setPortraitUri(portraitUri: string) {
            this.portraitUri = portraitUri;
        }
        getUserId() {
            return this.userId;
        }
        getUserName() {
            return this.name;
        }
        getPortaitUri() {
            return this.portraitUri;
        }
    }

    export module UserData {
        export class AccountInfo {
            constructor(
                public appUserId: string,
                public nickname: string,
                public username: string
            ) { }
        }

        // TODO: mobilePhoneManufacturers remove "s".
        export class ClientInfo {
            constructor(
                public carrier: string,
                public device: string,
                public mobilePhoneManufacturer: string,
                public network: string,
                public os: string,
                public systemVersion: string
            ) { }
        }

        export class ContactInfo {
            constructor(
                public address: string,
                public email: string,
                public qq: string,
                public tel: string,
                public weiBo: string,
                public weiXin: string
            ) { }
        }

        export class PersonalInfo {
            constructor(
                public age: string,
                public birthday: string,
                public comment: string,
                public job: string,
                public portraitUri: string,
                public realName: string,
                public sex: string
            ) { }
        }
    }
}
