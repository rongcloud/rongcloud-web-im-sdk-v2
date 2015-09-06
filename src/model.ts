module RongIMLib {
  export class Conversation {
    constructor(
      public conversationTitle: string,
      public conversationType: ConversationType,
      public draft: string,
      public isTop: boolean,
      public latestMessage: Message,
      public latestMessageId: string,
      public notificationStatus: ConversationNotificationStatus,
      public objectName: string,
      public ReceivedStatus: ReceivedStatus,
      public receivedTime: Date,
      public senderUserId: string,
      public senderUserName: string,
      public sentStatus: SentStatus,
      public sentTime: Date,
      public targetId: string,
      public unreadMessageCount: number
      ) { }
  }

  export class Discussion {
    constructor(
      public creatorId: string,
      public id: string,
      public memberIdList: string[],
      public name: string,
      public isOpen: boolean
      ) { }
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
      public content: MessageContent,
      public conversationType: ConversationType,
      public extra: string,
      public messageDirection: MessageDirection,
      public messageId: number,
      public objectName: string,
      public receivedStatus: ReceivedStatus,
      public receivedTime: Date,
      public senderUserId: string,
      public sentStatus: SentStatus,
      public sentTime: Date,
      public targetId: string
      ) { }
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
    constructor(
      public userId: string,
      public name: string,
      public portraitUri: string
      ) { }
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
