var mapping: any = {
    "1": 4,
    "2": 2,
    "3": 3,
    "4": 0,
    "5": 1,
    "6": 5
},
    //objectname映射
    typeMapping: { [s: string]: any } = {
        "RC:TxtMsg": "TextMessage",
        "RC:ImgMsg": "ImageMessage",
        "RC:VcMsg": "VoiceMessage",
        "RC:ImgTextMsg": "RichContentMessage",
        "RC:LBSMsg": "LocationMessage"
    },
    //通知类型映射
    sysNtf: { [s: string]: any } = {
        "RC:InfoNtf": "InformationNotificationMessage",
        "RC:ContactNtf": "ContactNotificationMessage",
        "RC:ProfileNtf": "ProfileNotificationMessage",
        "RC:CmdNtf": "CommandNotificationMessage",
        "RC:DizNtf": "DiscussionNotificationMessage"
    },
    //自定义消息类型
    registerMessageTypeMapping: { [s: string]: any } = {},
    HistoryMsgType: { [s: number]: any } = {
        1: "qryCMsg",
        2: "qryDMsg",
        3: "qryGMsg",
        4: "qryPMsg",
        5: "qrySMsg"
    }
module RongIMLib {
    /**
     * 通道标识类
     */
    export class Transports {
        static _TransportType: string = Socket.WEBSOCKET;
    }
    /**
     * 工具类
     */
    export class MessageUtil {
        static schemeArrs: Array<any> = [["http", "ws"], ["https", "wss"]];
        static ArrayForm(typearray: any): Array<any> {
            if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {
                var arr = new Int8Array(typearray);
                return [].slice.call(arr);
            }
            return typearray;
        }
        static indexOf(arr?: any, item?: any, from?: any): number {
            for (var l = arr.length, i = (from < 0) ? Math.max(0, +from) : from || 0; i < l; i++) {
                if (arr[i] == item) {
                    return i
                }
            }
            return -1
        }
        static isArray(obj: any) {
            return Object.prototype.toString.call(obj) == "[object Array]";
        }
        //遍历，只能遍历数组
        static forEach(arr: any, func: any) {
            if ([].forEach) {
                return function(arr: any, func: any) {
                    [].forEach.call(arr, func)
                }
            } else {
                return function(arr: any, func: any) {
                    for (var i = 0; i < arr.length; i++) {
                        func.call(arr, arr[i], i, arr)
                    }
                }
            }
        }
        static int64ToTimestamp(obj: any, isDate?: boolean) {
            if (obj.low === undefined) {
                return obj;
            }
            var low = obj.low;
            if (low < 0) {
                low += 0xffffffff + 1;
            }
            low = low.toString(16);
            var timestamp = parseInt(obj.high.toString(16) + "00000000".replace(new RegExp('0{' + low.length + '}$'), low), 16);
            if (isDate) {
                return new Date(timestamp)
            }
            return timestamp;
        }
        //消息转换方法
        static messageParser(entity: any, onReceived?: any): any {
            var message: any, content: any = entity.content, de: any, objectName: string = entity.classname;
            try {
                de = JSON.parse(new BinaryHelper().readUTF(content.offset ? MessageUtil.ArrayForm(content.buffer).slice(content.offset, content.limit) : content))
            } catch (ex) {
                console.log(ex + " -> postion:messageParser")
                return null;
            }
            //处理表情 TODO
            // if ("Expression" in RongIMClient && "RC:TxtMsg" == objectName && de.content) {
            //     de.content = de.content.replace(/[\uf000-\uf700]/g, function(x) {
            //         return RongIMClient.Expression.calcUTF(x) || x;
            //     })
            // }
            //映射为具体消息对象
            if (objectName in typeMapping) {
                var str = "new RongIMLib." + typeMapping[objectName] + "(de)";
                message = eval(str);
            } else if (objectName in sysNtf) {
                var str = "new RongIMLib." + sysNtf[objectName] + "(de)";
                message = eval(str);
            } else if (objectName in registerMessageTypeMapping) {
                //自定义消息
                var str = "new RongIMLib." + registerMessageTypeMapping[objectName] + "(de)";
                message = eval(str);
            } else {
                //未知消息
                message = new UnknownMessage(de, objectName);
            }
            //根据实体对象设置message对象
            message.setSentTime(MessageUtil.int64ToTimestamp(entity.dataTime));
            message.setSenderUserId(entity.fromUserId);
            message.setConversationType(mapping[entity.type]);
            if (entity.fromUserId == Bridge._client.userId) {
                //复用字段
                message.setTargetId(entity.groupId);
            } else {
                message.setTargetId(/^[234]$/.test(entity.type || entity.getType()) ? entity.groupId : message.getSenderUserId());
            }
            if (entity.fromUserId == Bridge._client.userId) {
                message.setMessageDirection(MessageDirection.SEND);
            } else {
                message.setMessageDirection(MessageDirection.RECEIVE);
            }
            message.setReceivedTime((new Date).getTime());
            message.setMessageId(message.getConversationType() + "_" + ~~(Math.random() * 0xffffff));
            message.setReceivedStatus(ReceivedStatus);
            return message;
        }
    }
    class UserCookie {
        getItem(x: any) {
            var arr = document.cookie.match(new RegExp("(^| )" + x + "=([^;]*)(;|$)"));
            if (arr != null) {
                return (arr[2]);
            }
            return null;
        }
        setItem(x: any, value: any) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 15 * 24 * 3600 * 1000);
            document.cookie = x + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
        }
        removeItem(x: any) {
            if (this.getItem(x)) {
                document.cookie = x + "=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            }
        }
        clear() {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;)
                    document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
            }
        }
    }
    /**
     * 本地常用信息存储工具类
     */
    export class CookieHelper {
        static obj: any;
        static old: any;
        static _host: string;
        static createStorage(): any {
            if (window.FORCE_LOCAL_STORAGE === true) {
                this.old = localStorage.setItem;
                localStorage.setItem = function(x: any, value: any) {
                    if (localStorage.length == 15) {
                        localStorage.removeItem(localStorage.key(0));
                    }
                    this.old.call(localStorage, x, value)
                }
                this.obj = localStorage;
            } else {
                this.obj = new UserCookie();
            }
            return this.obj;
        }
    }
    export class MessageIdHandler {
        static messageId: number = 0;
        static isXHR: boolean = Transports._TransportType === Socket.XHR_POLLING;
        static init() {
            this.messageId = +(CookieHelper.createStorage().getItem("msgId") || CookieHelper.createStorage().setItem("msgId", 0) || 0);
        }
        static messageIdPlus(method: any): any {
            this.isXHR && this.init();
            if (this.messageId >= 65535) {
                method();
                return false;
            }
            this.messageId++;
            this.isXHR && CookieHelper.createStorage().setItem("msgId", this.messageId);
            return this.messageId;
        }
        static clearMessageId() {
            this.messageId = 0;
            this.isXHR && CookieHelper.createStorage().setItem("msgId", this.messageId);
        }
        static getMessageId() {
            this.isXHR && this.init();
            return this.messageId;
        }
    }
    export class CheckParam {
        static getInstance(): CheckParam {
            return new CheckParam();
        }
        check(f: any, position: string, d?: any) {
            var c = arguments.callee.caller;
            if ('_client' in Bridge || d) {
                for (var g = 0, e = c.arguments.length; g < e; g++) {
                    if (!new RegExp(this.getType(c.arguments[g])).test(f[g])) {
                        throw new Error("The index of " + g + " parameter was wrong type " + this.getType(c.arguments[g]) + " [" + f[g] + "] -> position:" + position)
                    }
                }
            } else {
                throw new Error("The parameter is incorrect or was not yet instantiated RongIMClient -> position:" + position)
            }
        }
        getType(str: string): string {
            var temp = Object.prototype.toString.call(str).toLowerCase();
            return temp.slice(8, temp.length - 1);
        }
    }
    export class LimitableMap {
        map: any;
        keys: any;
        limit: number;
        constructor(limit?: number) {
            this.map = {};
            this.keys = [];
            this.limit = limit || 10;
        }
        set(key: string, value: any): void {
            if (this.map.hasOwnProperty(key)) {
                if (this.keys.length === this.limit) {
                    var firstKey = this.keys.shift();
                    delete this.map[firstKey];
                }
                this.keys.push(key);
            }
            this.map[key] = value;
        }
        get(key: string): number {
            return this.map[key] || 0;
        }
        remove(key: string): void {
            delete this.map[key]
        }
    }
}
