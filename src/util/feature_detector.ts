module RongIMLib {
    if (document.readyState == "interactive" || document.readyState == "complete") {
        new FeatureDectector();
    } else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
            document.removeEventListener("DOMContentLoaded", arguments.callee, false);
            new FeatureDectector();
        }, false)
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function() {
            if (document.readyState === "interactive" || document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                new FeatureDectector();
            }
        })
    }
    class FeatureDectector {
        script: any = document.createElement("script");
        head: any = document.getElementsByTagName("head")[0];
        global: any = window;
        //TODO 设置WEB_XHR_POLLING 为true时为成功，和时机有关系
        constructor() {
            Transports._TransportType = Socket.WEBSOCKET;
            if ("WebSocket" in this.global && "ArrayBuffer" in window && WebSocket.prototype.CLOSED === 3 && !this.global.WEB_SOCKET_FORCE_FLASH && !this.global.WEB_XHR_POLLING) {
                //http://res.websdk.rongcloud.cn/protobuf-0.2.min.js
                this.script.src = "http://localhost:9876/base/src/internal/protobuf.js";

            } else if (!/opera/i.test(navigator.userAgent) && !this.global.WEB_XHR_POLLING && (function() {
                if ('navigator' in this.global && 'plugins' in navigator && navigator.plugins['Shockwave Flash']) {
                    return !!navigator.plugins['Shockwave Flash'].description;
                }
                if ('ActiveXObject' in this.global) {
                    try {
                        return !!new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
                    } catch (e) {
                    }
                }
                return false;
            })()) {
                //加载flash widget帮助库
                this.script.src = "http://res.websdk.rongcloud.cn/swfobject-0.2.min.js";
            } else {
                //如果上述条件都不支持则执行comet逻辑
                Transports._TransportType = "xhr-polling";
                //加载comet帮助库
                this.script.src = "http://localhost:9876/base/src/internal/xhrpolling.js";
            }
            this.head.appendChild(this.script);
        }
        supportWebSocket(): boolean {
            return !(window["WEB_XHR_POLLING"] && window["WEB_XHR_POLLING"] == true);
        }

        supportXHRPolling(): boolean {
            return window["WEB_XHR_POLLING"] && window["WEB_XHR_POLLING"] == true;
        }

        supportIndexedDB(): boolean {
            return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
        }

        supportWebStorage(): boolean {
            return false;
        }

        supportWebNotification(): boolean {
            return window.Notifications;
        }
        /**
         * [isCookieEnabled 是否禁用Cookie]
         * @return {boolean} [true:启用Cookie ; false:禁用Cookie]
         */
        isCookieEnabled(): boolean {
            return navigator.cookieEnabled;
        }

    }
}
