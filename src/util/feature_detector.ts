module RongIMLib {
    class FeatureDectector {
        script: any = document.createElement("script");
        head: any = document.getElementsByTagName("head")[0];
        global: any = window;
        constructor() {
            Transportations._TransportType = Socket.WEBSOCKET;
            if ("WebSocket" in this.global && "ArrayBuffer" in window && WebSocket.prototype.CLOSED === 3 && !RongIMClient._memoryStore.choicePolling) {
                //http://res.websdk.rongcloud.cn/protobuf-0.2.min.js
                this.script.src = MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://localhost:9876/base/src/3rd/protobuf.js";

            } else {
                Transportations._TransportType = "xhr-polling";
                this.script.src = MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://localhost:9876/base/src/3rd/xhrpolling.js";
            }
            this.head.appendChild(this.script);
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
