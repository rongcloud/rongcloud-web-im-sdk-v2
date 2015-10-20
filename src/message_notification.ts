module RongIMLib {
    export class InformationNotificationMessage implements NotificationMessage, UserInfoAttachedMessage {
        public message: string;
        public userInfo: UserInfo;
        public extra: string;

        constructor(data: string) {

        }

        static obtain(message: string): InformationNotificationMessage {
            return undefined;
        }

        encode(): string {
            return undefined;
        }
        getMessage():any {

        }
    }
}
