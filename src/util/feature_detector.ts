module RongIMLib {
    export class FeatureDectector {
        script: any = document.createElement("script");
        head: any = document.getElementsByTagName("head")[0];

        constructor() {
            Transportations._TransportType = Socket.WEBSOCKET;
            if ("WebSocket" in window && "ArrayBuffer" in window && WebSocket.prototype.CLOSED === 3 && !window["WEB_XHR_POLLING"]) {
                var str: string = window["SCHEMETYPE"] ? window["SCHEMETYPE"] + "://cdn.ronghub.com/protobuf-2.1.1.min.js" : "//cdn.ronghub.com/protobuf-2.1.1.min.js";
                this.script.src = str;
                this.head.appendChild(this.script);
            } else {
                Transportations._TransportType = "xhr-polling";
                window["Modules"] = Polling;
            }

        }
    }
    if (document.readyState == "interactive" || document.readyState == "loading" || document.readyState == "complete") {
        new FeatureDectector();
    } else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
            //TODO 替换callee
            document.removeEventListener("DOMContentLoaded", <any>arguments.callee, false);
            new FeatureDectector();
        }, false);
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function() {
            if (document.readyState == "interactive" || document.readyState == "loading" || document.readyState == "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                new FeatureDectector();
            }
        });
    }
}
