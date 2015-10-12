module RongIMLib {
    /**
     * 通道标识类
     */
    export class Transports {
        static _TransportType: string = "WebSocket";
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

}
