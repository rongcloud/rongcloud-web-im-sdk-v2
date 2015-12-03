module RongIMLib {

    export enum Qos {

        AT_MOST_ONCE = 0,

        AT_LEAST_ONCE = 1,

        EXACTLY_ONCE = 2,

        DEFAULT = 3
    }

    export enum Type {

        CONNECT = 1,

        CONNACK = 2,

        PUBLISH = 3,

        PUBACK = 4,

        QUERY = 5,

        QUERYACK = 6,

        QUERYCON = 7,

        SUBSCRIBE = 8,

        SUBACK = 9,

        UNSUBSCRIBE = 10,

        UNSUBACK = 11,

        PINGREQ = 12,

        PINGRESP = 13,

        DISCONNECT = 14
    }

}
