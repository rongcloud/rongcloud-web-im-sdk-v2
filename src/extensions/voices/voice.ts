module RongIMLib {
    export class RongIMVoice {
        private static isIE: boolean = /Trident/.test(navigator.userAgent);
        private static element: any;
        private static isInit: boolean = false;
        static init() {
            if (this.isIE) {
                var div = document.createElement("div");
                div.setAttribute("id", "flashContent");
                document.body.appendChild(div);
                var script = document.createElement("script");
                script.src = "http://cdn.ronghub.com/swfobject-2.0.0.min.js";
                var header = document.getElementsByTagName("head")[0];
                header.appendChild(script);
                setTimeout(function() {
                    var swfVersionStr = "11.4.0";
                    var flashvars = {};
                    var params: any = {};
                    params.quality = "high";
                    params.bgcolor = "#ffffff";
                    params.allowscriptaccess = "always";
                    params.allowScriptAccess = "always";
                    params.allowfullscreen = "true";
                    var attributes: any = {};
                    attributes.id = "player";
                    attributes.name = "player";
                    attributes.align = "middle";
                    swfobject.embedSWF("http://cdn.ronghub.com/player-2.0.2.swf", "flashContent", "1", "1", swfVersionStr, null, flashvars, params, attributes);
                }, 200);
            } else {
                var list = ["http://cdn.ronghub.com/pcmdata-2.0.0.min.js", "http://cdn.ronghub.com/libamr-2.0.1.min.js"];
                for (let i = 0, len = list.length; i < len; i++) {
                    var script = document.createElement("script");
                    script.src = list[i];
                    document.head.appendChild(script);
                }
            }
            this.isInit = true;
        }

        static play(data: string, duration: number) {
            this.checkInit("play");
            var me = this;
            if (me.isIE) {
                me.thisMovie().doAction("init", data);
            }
            else {
                me.palyVoice(data);
                me.onCompleted(duration);
            }
        }

        static stop() {
            this.checkInit("stop");
            var me = this;
            if (me.isIE) {
                me.thisMovie().doAction("stop");
            } else {
                if (me.element) {
                    me.element.stop();
                }
            }
        }

        static onprogress() {

        }
        private static checkInit(position: string) {
            if (!this.isInit) {
                throw new Error("RongIMVoice is not init,position:" + position);
            }
        }
        private static thisMovie(): any {
            return eval("window['player']");
        }
        private static onCompleted(duration: number): void {
            var me = this;
            var count = 0;
            var timer = setInterval(function() {
                count++;
                me.onprogress();
                if (count >= duration) {
                    clearInterval(timer);
                }
            }, 1000);
            if (me.isIE) {
                me.thisMovie().doAction("play");
            }
        }


        private static base64ToBlob(base64Data: string, type: string) {
            var mimeType: any;
            if (type) {
                mimeType = { type: type };
            }
            base64Data = base64Data.replace(/^(.*)[,]/, '');
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);
                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, mimeType);
        }

        private static palyVoice(base64Data: string) {
            var reader = new FileReader(), blob = this.base64ToBlob(base64Data, "audio/amr"), me = this;
            reader.onload = function() {
                var samples = new AMR({
                    benchmark: true
                }).decode(reader.result);
                me.element = AMR.util.play(samples);
            };
            reader.readAsBinaryString(blob);
        }
    }
    //兼容AMD CMD
    if ("function" === typeof require && "object" === typeof module && module && module.id && "object" === typeof exports && exports) {
        module.exports = RongIMVoice;
    } else if ("function" === typeof define && define.amd) {
        define("RongIMVoice", [], function() {
            return RongIMVoice;
        });
    }
}
