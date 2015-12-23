module RongIMLib {
    class FeatureDectector {
        script: any = document.createElement("script");
        head: any = document.getElementsByTagName("head")[0];
        global: any = window;
        //TODO 设置WEB_XHR_POLLING 为true时为成功，和时机有关系
        constructor() {
            Transports._TransportType = Socket.WEBSOCKET;
            if ("WebSocket" in this.global && "ArrayBuffer" in window && WebSocket.prototype.CLOSED === 3 && !RongIMClient._memoryStore.choicePolling) {
                //http://res.websdk.rongcloud.cn/protobuf-0.2.min.js
                this.script.src = MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://localhost:9876/base/src/internal/protobuf.js";

            } else {
                Transports._TransportType = "xhr-polling";
                this.script.src = MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://localhost:9876/base/src/internal/xhrpolling.js";
            }
            this.head.appendChild(this.script);
        }
        supportWebSocket(): boolean {
            return !(window["WEB_XHR_POLLING"] && window["WEB_XHR_POLLING"] == true);
        }

        supportXHRPolling(): boolean {
            return window["WEB_XHR_POLLING"] && window["WEB_XHR_POLLING"] == true;
        }

        supportWebStorage(): boolean {
            return false;
        }

        supportWebNotification(): boolean {
            return window.Notifications;
        }
        /**
         * [isCookieEnabled 是否禁用Cookie]
         */
        isCookieEnabled(): boolean {
            return navigator.cookieEnabled;
        }

    }
    if (document.readyState == "interactive" || document.readyState == "complete") {
        new FeatureDectector();
    } else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
            //TODO 替换callee
            document.removeEventListener("DOMContentLoaded", <any>arguments.callee, false);
            new FeatureDectector();
        }, false);
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function() {
            if (document.readyState === "interactive" || document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                new FeatureDectector();
            }
        });
    }
}
