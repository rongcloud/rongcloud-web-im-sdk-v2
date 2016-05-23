module RongIMLib {
    export class RongIMVoiceRecorder {
        /**static paramters*/
        private static rongAudioContext: any = window.AudioContext || window.webkitAudioContext;
        private static audioContext: any = null;
        private static inputPoint: any = null;
        private static audioInput: any = null;
        private static realAudioInput: any = null;
        private static isInit: boolean = false;
        // private static getMedia: any = (navigator.webkitGetUserMedia || navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        private static instance: RongIMVoiceRecorder = null;

        /**internal paramters*/
        private _wrokPath: string = "js/rongworker.js";
        private _gainNode: any = null;
        private _worker: Worker = null;
        private _recording: boolean = false;
        private _callback: any = null;

        constructor(source: any) {
            var me = RongIMVoiceRecorder.instance = this;
            me._gainNode = source.context.createScriptProcessor(4096, 2, 2);
            me._worker = new Worker(this._wrokPath);
            me._worker.postMessage({
                command: "init",
                config: {
                    sampleRate: source.context.sampleRate
                }
            });
            me._gainNode.onaudioprocess = function(e: any) {
                if (!me._recording) return;
                me._worker.postMessage({
                    command: 'record',
                    buffer: [
                        e.inputBuffer.getChannelData(0),
                        e.inputBuffer.getChannelData(1)
                    ]
                });
            };
            source.connect(me._gainNode);
            me._gainNode.connect(source.context.destination);
            me._worker.onmessage = function(e) {
                var blob = e.data;
                me._callback(blob);
            };
        }

        static init() {
            var me = this;
            me.isInit = true;
            me.audioContext = new this.rongAudioContext();
            if (!navigator.getUserMedia)
                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!navigator.cancelAnimationFrame)
                navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
            if (!navigator.requestAnimationFrame)
                navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
            navigator.getUserMedia(
                {
                    "audio": {
                        "mandatory": {
                            "googEchoCancellation": "false",
                            "googAutoGainControl": "false",
                            "googNoiseSuppression": "false",
                            "googHighpassFilter": "false"
                        },
                        "optional": []
                    },
                }, function(stream: any) {
                    me.inputPoint = me.audioContext.createGain();
                    me.audioInput = me.realAudioInput = me.audioContext.createMediaStreamSource(stream);
                    me.audioInput.connect(me.inputPoint);
                    me.instance = new RongIMVoiceRecorder(me.inputPoint);
                }, function(e: any) {
                    alert('Error getting audio');
                    console.log(e);
                });
        }

        static startRecord() {
            this.instance._recording = true;
        }

        static stopRecord(callback: any) {
            this.instance._callback = callback;
            this.instance._worker.postMessage({ command: 'getMonoBuffers' });
            this.instance._recording = false;
            this.instance.clear();

        }

        private static checkInit() {
            if (!this.isInit) {
                throw new Error("RongIMVoiceRecorder is not init!");
            }
        }

        private clear() {
            this._worker.postMessage({ command: "clear" });
        }

        private getAmrBase64(callback: any) {

        }
    }
}
