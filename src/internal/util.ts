
//objectname映射
var typeMapping: { [s: string]: any } = {
    "RC:TxtMsg": "TextMessage",
    "RC:ImgMsg": "ImageMessage",
    "RC:VcMsg": "VoiceMessage",
    "RC:ImgTextMsg": "RichContentMessage",
    "RC:FileMsg": "FileMessage",
    "RC:HQVCMsg": "HQVoiceMessage",
    "RC:LBSMsg": "LocationMessage",
    "RC:InfoNtf": "InformationNotificationMessage",
    "RC:ContactNtf": "ContactNotificationMessage",
    "RC:ProfileNtf": "ProfileNotificationMessage",
    "RC:CmdNtf": "CommandNotificationMessage",
    "RC:DizNtf": "DiscussionNotificationMessage",
    "RC:CmdMsg": "CommandMessage",
    "RC:TypSts": "TypingStatusMessage",
    "RC:CsChaR": "ChangeModeResponseMessage",
    "RC:CsHsR": "HandShakeResponseMessage",
    "RC:CsEnd": "TerminateMessage",
    "RC:CsSp": "SuspendMessage",
    "RC:CsUpdate": "CustomerStatusUpdateMessage",
    "RC:ReadNtf": "ReadReceiptMessage",
    "RC:VCAccept": "AcceptMessage",
    "RC:VCRinging": "RingingMessage",
    "RC:VCSummary": "SummaryMessage",
    "RC:VCHangup": "HungupMessage",
    "RC:VCInvite": "InviteMessage",
    "RC:VCModifyMedia": "MediaModifyMessage",
    "RC:VCModifyMem": "MemberModifyMessage",
    "RC:CsContact": "CustomerContact",
    "RC:PSImgTxtMsg": "PublicServiceRichContentMessage",
    "RC:PSMultiImgTxtMsg": "PublicServiceMultiRichContentMessage",
    "RC:GrpNtf": "GroupNotificationMessage",
    "RC:PSCmd": "PublicServiceCommandMessage",
    "RC:RcCmd": "RecallCommandMessage",
    "RC:SRSMsg": "SyncReadStatusMessage",
    "RC:RRReqMsg": "ReadReceiptRequestMessage",
    "RC:RRRspMsg": "ReadReceiptResponseMessage",
    "RCJrmf:RpMsg": "JrmfRedPacketMessage",
    "RCJrmf:RpOpendMsg": "JrmfRedPacketOpenedMessage"
},
    //自定义消息类型
    registerMessageTypeMapping: { [s: string]: any } = {},
    HistoryMsgType: { [s: number]: any } = {
        4: "qryCMsg",
        2: "qryDMsg",
        3: "qryGMsg",
        1: "qryPMsg",
        6: "qrySMsg",
        7: "qryPMsg",
        8: "qryPMsg",
        5: "qryCMsg"
    }, disconnectStatus: { [s: number]: any } = { 1: 6 };
module RongIMLib {
    /**
     * 通道标识类
     */ 
    export class Transportations {
        static _TransportType: string = Socket.WEBSOCKET;
    }

    export class SyncTimeUtil {
        static $getKey(message: any){
            var client = Bridge._client;
            var userId = client.userId;
            var direction = (message.messageDirection == 1 ? 'send' : 'receive');
            var appkey = RongIMClient._memoryStore.appKey;
            var tpl = '{appkey}_{userId}_{direction}box';
            return RongUtil.tplEngine(tpl, {
                appkey: appkey,
                userId: userId,
                direction: direction
            });
        }
        static set(message: any){
            var key = SyncTimeUtil.$getKey(message)
            var sentTime = message.sentTime;
            var storage = RongIMClient._storageProvider;
            storage.setItem(key, sentTime);
        }
        static get(){
            var sent = SyncTimeUtil.$getKey({
                messageDirection: MessageDirection.SEND
            });
    
            var received = SyncTimeUtil.$getKey({
                messageDirection: MessageDirection.RECEIVE
            });
    
            var storage = RongIMClient._storageProvider;
            return {
                sent: Number(storage.getItem(sent) || 0),
                received: Number(storage.getItem(received) || 0)
            };
        }
    }

    export class MessageUtil {
        //适配SSL
        // static schemeArrs: Array<any> = [["http", "ws"], ["https", "wss"]];
        static sign: any = { converNum: 1, msgNum: 1, isMsgStart: true, isConvStart: true };

        /**
         *4680000 为localstorage最小容量5200000字节的90%，超过90%将删除之前过早的存储
         */
        static checkStorageSize(): boolean {
            return JSON.stringify(localStorage).length < 4680000;
        }

        static getFirstKey(obj: any): string {
            var str: string = "";
            for (var key in obj) {
                str = key;
                break;
            }
            return str;
        }

        static isEmpty(obj: any): boolean {
            var empty: boolean = true;
            for (var key in obj) {
                empty = false;
                break;
            }
            return empty;
        }

        static ArrayForm(typearray: any): Array<any> {
            if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {
                var arr = new Int8Array(typearray);
                return [].slice.call(arr);
            }
            return typearray;
        }
        static ArrayFormInput(typearray: any): Uint8Array {
            if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {
                var arr = new Uint8Array(typearray);
                return arr;
            }
            return typearray;
        }
        static indexOf(arr?: any, item?: any, from?: any): number {
            for (var l = arr.length, i = (from < 0) ? Math.max(0, +from) : from || 0; i < l; i++) {
                if (arr[i] == item) {
                    return i;
                }
            }
            return -1;
        }
        static isArray(obj: any) {
            return Object.prototype.toString.call(obj) == "[object Array]";
        }
        //遍历，只能遍历数组
        static forEach(arr: any, func: any) {
            if ([].forEach) {
                return function(arr: any, func: any) {
                    [].forEach.call(arr, func);
                };
            } else {
                return function(arr: any, func: any) {
                    for (var i = 0; i < arr.length; i++) {
                        func.call(arr, arr[i], i, arr);
                    }
                };
            }
        }
        static remove(array: any, func: any): void {
            for (var i = 0, len = array.length; i < len; i++) {
                if (func(array[i])) {
                    return array.splice(i, 1)[0];
                }
            }
            return null;
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
            var timestamp = parseInt(obj.high.toString(16) + "00000000".replace(new RegExp("0{" + low.length + "}$"), low), 16);
            if (isDate) {
                return new Date(timestamp);
            }
            return timestamp;
        }
        //消息转换方法
        static messageParser(entity: any, onReceived?: any, offlineMsg?: boolean): any {
            var message: Message = new Message(), content: any = entity.content, de: any, objectName: string = entity.classname, val: any, isUseDef = false;
            try {
                if (RongIMClient._memoryStore.depend.isPolling) {
                    val = new BinaryHelper().readUTF(content.offset ? MessageUtil.ArrayForm(content.buffer).slice(content.offset, content.limit) : content);
                    de = JSON.parse(val);
                } else {
                    val = new BinaryHelper().readUTF(content.offset ? MessageUtil.ArrayFormInput(content.buffer).subarray(content.offset, content.limit) : content);
                    de = JSON.parse(val);
                }

            } catch (ex) {
                de = val;
                isUseDef = true;
            }

            //映射为具体消息对象
            if (objectName in typeMapping) {
                var str = "new RongIMLib." + typeMapping[objectName] + "(de)";
                message.content = eval(str);
                message.messageType = typeMapping[objectName];
            } else if (objectName in registerMessageTypeMapping) {
                var str = "new RongIMLib.RongIMClient.RegisterMessage." + registerMessageTypeMapping[objectName] + "(de)";
                if (isUseDef) {
                    message.content = eval(str).decode(de);
                } else {
                    message.content = eval(str);
                }
                message.messageType = registerMessageTypeMapping[objectName];
            } else {
                message.content = new UnknownMessage({ content: de, objectName: objectName });
                message.messageType = "UnknownMessage";
            }
            //根据实体对象设置message对象]
            var dateTime = MessageUtil.int64ToTimestamp(entity.dataTime);
            if (dateTime > 0) {
                message.sentTime = dateTime;
            } else {
                message.sentTime = +new Date;
            }
            message.senderUserId = entity.fromUserId;
            message.conversationType = entity.type;
            if (entity.fromUserId == Bridge._client.userId) {
                message.targetId = entity.groupId;
            } else {
                message.targetId = (/^[234]$/.test(entity.type || entity.getType()) ? entity.groupId : message.senderUserId);
            }

            var selfUserId = Bridge._client.userId;
            
            // 解决多端在线收自己发的消息时, messageDirection 为 2(接收), 导致未读数增加
            var isSelfSend = entity.direction == 1 || message.senderUserId === selfUserId;
            if (isSelfSend) {
                message.messageDirection = MessageDirection.SEND;
                message.senderUserId = Bridge._client.userId;
            } else {
                message.messageDirection = MessageDirection.RECEIVE;
            }
            
            // 自己给自己发的消息, messageDirection 为 2(接收)
            var isSelfToSelf = message.senderUserId === selfUserId && message.targetId === selfUserId;
            if (isSelfToSelf) {
                message.messageDirection = MessageDirection.RECEIVE;
            }

            message.messageUId = entity.msgId;
            message.receivedTime = new Date().getTime();
            message.messageId = (message.conversationType + "_" + ~~(Math.random() * 0xffffff));
            message.objectName = objectName;
            message.receivedStatus = ReceivedStatus.READ;
            if ((entity.status & 2) == 2) {
                message.receivedStatus = ReceivedStatus.RETRIEVED;
            }
            message.offLineMessage = offlineMsg ? true : false;
            if (!offlineMsg) {
                if (RongIMLib.RongIMClient._memoryStore.connectAckTime > message.sentTime) {
                    message.offLineMessage = true;
                }
            }
            return message;
        }
        static detectCMP(options: any){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4){
                    var status = xhr.status;
                    if(status == 200){
                        options.success();
                    }else{
                        options.fail(xhr.status);
                    }
                }
            };
            var method = options.url;
            var url = options.url;
            var method = options.method || 'GET';
            xhr.open(method, url);
            var headers = options.headers;
            for (var key in headers) {
                var value = headers[key];
                xhr.setRequestHeader(key, value);
            }
            var body = JSON.stringify(options.body || {});
            xhr.send(body);
            return xhr;
        }
    }
    /**
     * 工具类
     */

    export class MessageIdHandler {
        static messageId: number = 0;
        static init() {
            this.messageId = +(RongIMClient._storageProvider.getItem(Navigation.Endpoint.userId + "msgId") || RongIMClient._storageProvider.setItem(Navigation.Endpoint.userId + "msgId", 0) || 0);
        }
        static messageIdPlus(method: any): any {
            RongIMClient._memoryStore.depend.isPolling && this.init();
            if (this.messageId >= 65535) {
                method();
                return false;
            }
            this.messageId++;
            RongIMClient._memoryStore.depend.isPolling && RongIMClient._storageProvider.setItem(Navigation.Endpoint.userId + "msgId", this.messageId);
            return this.messageId;
        }
        static clearMessageId() {
            this.messageId = 0;
            RongIMClient._memoryStore.depend.isPolling && RongIMClient._storageProvider.setItem(Navigation.Endpoint.userId + "msgId", this.messageId);
        }
        static getMessageId() {
            RongIMClient._memoryStore.depend.isPolling && this.init();
            return this.messageId;
        }
    }

    export class RongInnerTools {
        static convertUserStatus(entity: any): any{
            entity = RongUtil.rename(entity, {subUserId: 'userId'});
            var status = JSON.parse(entity.status);
            var us = status.us;
            if (!us) {
                return entity;
            }
            entity.status = RongUtil.rename(us, {o: 'online', 'p': 'platform', s: 'status'});
            return entity;
        }
    }
}
