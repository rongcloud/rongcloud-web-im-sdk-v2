
module RongIMLib {

    export class ObjectTools {
        static isEmpty(obj: any): boolean {
            var empty: boolean = true;
            for (var key in obj) {
                empty = false;
                break;
            }
            return empty;
        }

        static buildOptions(one: any, opts: any, protocol: string): any {
            if (typeof one == 'object') {
                for (var key in opts) {
                    if (key == 'fileUploadURL' || key == 'fileQNURL' || key == 'protobuf' || key == 'long' || key == 'byteBuffer' || key == 'navi' || key == 'api' ||
                        key == 'emojiImage' || key == 'voiceLibamr' || key == 'voicePCMdata' || key == 'voiceSwfobjct' || key == 'voicePlaySwf' || key == 'callFile') {
                        one[key] && (opts[key] = protocol + one[key]);
                    } else {
                        one[key] && (opts[key] = one[key]);
                    }
                }

            }
            return opts;
        }
    }

    export class PublicServiceMap {
        publicServiceList: Array<any>;
        constructor() {
            this.publicServiceList = [];
        }
        get(publicServiceType: ConversationType, publicServiceId: string): PublicServiceProfile {
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (this.publicServiceList[i].conversationType == publicServiceType && publicServiceId == this.publicServiceList[i].publicServiceId) {
                    return this.publicServiceList[i];
                }
            }
        }
        add(publicServiceProfile: PublicServiceProfile) {
            var isAdd: boolean = true, me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.unshift(this.publicServiceList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.publicServiceList.unshift(publicServiceProfile);
            }
        }
        replace(publicServiceProfile: PublicServiceProfile) {
            var me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    me.publicServiceList.splice(i, 1, publicServiceProfile);
                    break;
                }
            }
        }
        remove(conversationType: ConversationType, publicServiceId: string) {
            var me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == conversationType && publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.splice(i, 1);
                    break;
                }
            }
        }
    }
    /**
     * 会话工具类。
     */
    export class ConversationMap {
        conversationList: Array<Conversation>;
        constructor() {
            this.conversationList = [];
        }
        get(conversavtionType: number, targetId: string): Conversation {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType == conversavtionType && this.conversationList[i].targetId == targetId) {
                    return this.conversationList[i];
                }
            }
            return null;
        }
        add(conversation: Conversation): void {
            var isAdd: boolean = true;
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.unshift(this.conversationList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.conversationList.unshift(conversation);
            }
        }
        /**
         * [replace 替换会话]
         * 会话数组存在的情况下调用add方法会是当前会话被替换且返回到第一个位置，导致用户本地一些设置失效，所以提供replace方法
         */
        replace(conversation: Conversation) {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1, conversation);
                    break;
                }
            }
        }
        remove(conversation: Conversation) {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1);
                    break;
                }
            }
        }
    }

    export class CheckParam {
        static _instance: CheckParam;
        static getInstance(): CheckParam {
            if (!CheckParam._instance) {
                CheckParam._instance = new CheckParam();
            }
            return CheckParam._instance;
        }
        check(f: any, position: string, d?: any) {
            var c = arguments.callee.caller;
            //"_client" in Bridge ||
            if (RongIMClient._dataAccessProvider || d) {
                for (var g = 0, e = c.arguments.length; g < e; g++) {
                    if (!new RegExp(this.getType(c.arguments[g])).test(f[g])) {
                        throw new Error("The index of " + g + " parameter was wrong type " + this.getType(c.arguments[g]) + " [" + f[g] + "] -> position:" + position);
                    }
                }
            } else {
                throw new Error("The parameter is incorrect or was not yet instantiated RongIMClient -> position:" + position);
            }
        }
        getType(str: string): string {
            var temp = Object.prototype.toString.call(str).toLowerCase();
            return temp.slice(8, temp.length - 1);
        }
        checkCookieDisable(): boolean {
            document.cookie = "checkCookie=1";
            var arr = document.cookie.match(new RegExp("(^| )checkCookie=([^;]*)(;|$)")), isDisable = false;
            if (!arr) {
                isDisable = true;
            }
            document.cookie = "checkCookie=1;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return isDisable;
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
            delete this.map[key];
        }
    }

    export class RongAjax {
        options: any;
        xmlhttp: any;
        constructor(options: any) {
            var me = this;
            me.xmlhttp = null;
            me.options = options;
            var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
            if ("undefined" != typeof XMLHttpRequest && hasCORS) {
                me.xmlhttp = new XMLHttpRequest();
            } else if ("undefined" != typeof XDomainRequest) {
                me.xmlhttp = new XDomainRequest();
            } else {
                me.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        send(callback: any): void {
            var me = this;
            me.options.url || (me.options.url = "http://upload.qiniu.com/putb64/-1");
            me.xmlhttp.onreadystatechange = function() {
                if (me.xmlhttp.readyState == 4) {
                    if (me.options.type) {
                        callback();
                    } else {
                        callback(JSON.parse(me.xmlhttp.responseText.replace(/'/g, '"')));
                    }
                }
            };
            me.xmlhttp.open("POST", me.options.url, true);
            me.xmlhttp.withCredentials = false;
            if ("setRequestHeader" in me.xmlhttp) {
                if (me.options.type) {
                    me.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
                } else {
                    me.xmlhttp.setRequestHeader("Content-type", "application/octet-stream");
                    me.xmlhttp.setRequestHeader('Authorization', "UpToken " + me.options.token);
                }
            }

            me.xmlhttp.send(me.options.type ? "appKey=" + me.options.appKey + "&deviceId=" + me.options.deviceId + "&timestamp=" + me.options.timestamp + "&deviceInfo=" + me.options.deviceInfo + "&privateInfo=" + JSON.stringify(me.options.privateInfo) : me.options.base64);
        }
    }
}
