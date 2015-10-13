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
        ArrayForm(typearray: any): Array<any> {
            if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {
                var arr = new Uint8Array(typearray);
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
        messageId: number = 0;
        isXHR: boolean = Transports._TransportType === Socket.XHR_POLLING;
        constructor() {
            this.isXHR && this.init();
        }
        init() {
            this.messageId = +(CookieHelper.createStorage().getItem("msgId") || CookieHelper.createStorage().setItem("msgId", 0) || 0);
        }
        messageIdPlus(method: any):any {
            this.isXHR && this.init();
            if (this.messageId >= 65535) {
                method();
                return false;
            }
            this.messageId++;
            this.isXHR && CookieHelper.createStorage().setItem("msgId", this.messageId);
            return this.messageId;
        }
        clearMessageId() {
            this.messageId = 0;
            this.isXHR && CookieHelper.createStorage().setItem("msgId", this.messageId);
        }
        getMessageId() {
            this.isXHR && this.init();
            return this.messageId;
        }
    }
}
