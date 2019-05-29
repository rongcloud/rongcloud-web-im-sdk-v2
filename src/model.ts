module RongIMLib {

    export class ChannelInfo {
        constructor(
            public Id: string,
            public Key: string) { }
    }

    export class UserStatus {
        constructor(
            public platform?: string[],
            public online?: boolean,
            public status?: number
        ) { }
    }

    export class MentionedInfo {
        constructor(
            type?: MentionedType,
            userIdList?: string[],
            mentionedContent?: string
        ) { }
    }

    export class DeleteMessage {
        constructor(public msgId?: string,
            public msgDataTime?: number,
            public direct?: number) { }
    }

    export class CustomServiceConfig {
        constructor(
            isBlack?: boolean,
            companyName?: string,
            companyUrl?: string) {
        }
    }

    export class CustomServiceSession {
        constructor(uid?: string,
            cid?: string,
            pid?: string,
            isQuited?: boolean,
            type?: number,
            adminHelloWord?: string,
            adminOfflineWord?: string) {
        }
    }

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
            public receivedTime?: number,
            public senderUserId?: string,
            public senderUserName?: string,
            public sentStatus?: SentStatus,
            public sentTime?: number,
            public targetId?: string,
            public unreadMessageCount?: number,
            public senderPortraitUri?: string,
            public isHidden?: boolean,
            public mentionedMsg?: any,
            public hasUnreadMention?: boolean,
            public _readTime?: number
        ) { }
        setTop(): void {
            RongIMClient._dataAccessProvider.addConversation(this, <ResultCallback<boolean>>{ onSuccess: function (data) { } });
        }
    }

    export class Discussion {
        constructor(
            public creatorId?: string,
            public id?: string,
            public memberIdList?: string[],
            public name?: string,
            public isOpen?: boolean) {

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
            public messageType?: string,
            public messageUId?: string,
            public isLocalMessage?: boolean,
            public offLineMessage?: boolean,
            public receiptResponse?: any
        ) { }
    }
    export class MessageTag {
        constructor(
            public isCounted: boolean,
            public isPersited: boolean
        ) { }
        getMessageTag(): number {
            if (this.isCounted && this.isPersited) {
                return 3;
            } else if (this.isCounted) {
                return 2;
            } else if (this.isPersited) {
                return 1;
            } else if (!this.isCounted && !this.isPersited) {
                return 0;
            }
        }
        static getTagByStatus(status: any): any {

            var statusMap: any = {
                3: {
                    isCounted: true,
                    isPersited: true
                },
                2: {
                    isCounted: true,
                    isPersited: false
                },
                1: {
                    isCounted: true,
                    isPersited: true
                },
                0: {
                    isCounted: true,
                    isPersited: true
                }
            };
            return statusMap[status] || statusMap[3];
        }
    }
    export class PublicServiceMenuItem {
        constructor(
            public id?: string,
            public name?: string,
            public type?: ConversationType,
            public sunMenuItems?: Array<PublicServiceMenuItem>,
            public url?: string
        ) { }
    }
    // TODO: TBD
    export class PublicServiceProfile {
        constructor(
            public conversationType?: ConversationType,
            public introduction?: string,
            public menu?: Array<PublicServiceMenuItem>,
            public name?: string,
            public portraitUri?: string,
            public publicServiceId?: string,
            public hasFollowed?: boolean,
            public isGlobal?: boolean
        ) { }
    }

    export class UserInfo {
        constructor(
            public id: string,
            public name: string,
            public portraitUri: string) { }
    }

    export class User {
        constructor(
            public id: string,
            public token: string
        ) { }
    }

    export class Room {
        constructor(
            public id: string,
            public user: User,
            public mode: number
        ) { }
    }
}
