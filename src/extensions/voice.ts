module RongIMLib {
    export class RongIMVoice {
        static init() {
            if (/IE/.test(navigator.userAgent)) {
                //TODO
            } else {
                var list = ["lib/pcmdata.min.js","lib/libamr-min.js"];
                for (let i = 0, len = list.length; i < len; i++) {
                    var script = document.createElement("script");
                    script.src = list[i];
                    document.head.appendChild(script);
                }
            }
        }

        static play(data: string, duration: number) {
            this.palyVoice(data);
            var self = this;
            var timer = setInterval(function() {
                var count: number = 0;
                self.onprogress();
                count++;
                if (count >= duration) {
                    clearInterval(timer);
                }
            }, 1000);
        }

        static onprogress() {

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
            var reader = new FileReader(), blob = this.base64ToBlob(base64Data, "audio/amr");
            reader.onload = function() {
                var samples = new AMR({
                    benchmark: true
                }).decode(reader.result);
                AMR.util.play(samples);
            };
            reader.readAsBinaryString(blob);
        }
    }
}
