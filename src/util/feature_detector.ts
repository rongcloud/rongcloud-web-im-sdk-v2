module RongIMLib {
    export class FeatureDectector {
        script: any = document.createElement("script");
        head: any = document.getElementsByTagName("head")[0];

        constructor(callback?: any) {
            if ("WebSocket" in window && "ArrayBuffer" in window && WebSocket.prototype.CLOSED === 3 && !RongIMClient._memoryStore.depend.isPolling) {
                Transportations._TransportType = Socket.WEBSOCKET;
                if (!RongIMClient.Protobuf) {
                    var url: string = RongIMClient._memoryStore.depend.protobuf;
                    var script = this.script;
                    script.src = url;
                    this.head.appendChild(script);
                    script.onload = script.onreadystatechange = function(){
                        var isLoaded = (!this.readState || this.readyState == 'loaded' || this.readyState == 'complete');
                        if (isLoaded) {
                            // 防止 IE6、7 下偶发触发两次 loaded
                            script.onload = script.onreadystatechange = null;
                            if (callback) {
                                callback();
                            }
                            if (!callback) {
                                var token = RongIMClient._memoryStore.token;
                                var connectCallback = RongIMClient._memoryStore.callback;
                                RongIMClient.connect(token, connectCallback);
                            }
                        }
                    };
                }
                
            } else {
                Transportations._TransportType = "xhr-polling";
                RongIMClient.Protobuf = Polling;
            }
        }
    }
}
