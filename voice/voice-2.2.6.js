"use strict";
/*
使用流程：
    1、引入外部依赖 amr.js 、swfobject-2.0.0.min.js 、weixin-voice.js
    2、引入 voice.js
开发流程：
    1、定义暴露 API
    2、抽象 Flash、Audio、各自实现

    swfobject.js : http://blog.deconcept.com/swfobject/
*/
;(function (global, factory,namespace) {
    if(typeof exports === 'object' && typeof module !== 'undefined'){
    	module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
    	define(factory);
    }else{
        //namespace = "g.p.c";
    	global[namespace] = factory(namespace);
    }
})(window, function(namespace){
    /*
    参考资料：
        判断是否支持 flash: http://www.jb51.net/article/53702.htm
        浏览器支持 Audio 情况： http://caniuse.com/#feat=audio-api
        base64ToBlob：http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        FileReader：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader (把文件读入内存，并且读取文件中的数据)
    */
    var isSupportFlash = (function(){
	    var version = "", n = navigator; 
	    if (n.plugins && n.plugins.length) {
	        for (var ii = 0; ii < n.plugins.length; ii++) {
	              if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) { 
	                  version = n.plugins[ii].description.split('Shockwave Flash ')[1];
	                  version = version.split(' ').join('.');
	                  break; 
	             } 
	        } 
	    }else if (window.ActiveXObject) { 
	        var swf = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
	        if(swf) {
	            VSwf=swf.GetVariable("$version");
	            flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]);
	            version = VSwf.toLowerCase().split('win').join('').split(',').join('.');
	        }
	    }

	    return version != ""; 
	})();

	var isSupportAudio = (function(){
        var AudioStr = Audio + "";
        
        if( AudioStr.indexOf("[native code") != -1){
            return true;
        }
        // return false;
	})();

    if(!isSupportAudio && !isSupportFlash){
        alert("浏览器不支持Audio，也不支持flash，请安装flash");
        return;
    }

    
    /* 工具类 */ 
    var util = {
        noop: function(){},
        source: function(source, target){
            for(var key in source){
                target[key] = source[key];
            }
        },
        forEach: function(obj, callback){
            for(var key in obj){
                callback(key, obj[key]);
            }
        },
        /*
            voice = "IyFBTVIKLNEafAAeef/hgmeAH8AD..."; 音频文件，base64码，AMR格式
        */
        amr2wav: function(voice,callback){
            var blob = util.base64ToBlob(voice, "audio/amr");
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = new Uint8Array(e.target.result);
                var samples = AMR.decode(data);
                var pcm = PCMData.encode({
                    sampleRate: 8000,
                    channelCount: 1,
                    bytesPerSample: 2,
                    data: samples
                });
                var voiceWav = "data:audio/wav;base64," + btoa(pcm);
                callback(voiceWav);
            };
            reader.readAsArrayBuffer(blob);
        },

        /*
            base64 = "IyFBTVIKLNEafAAeef/hgmeAH8AD..."; 音频文件，base64码，AMR格式
            type = "audio/amr";
        */
        base64ToBlob: function(base64, type) {
            
            var mimeType = {};
            type && ( mimeType[type] = type);
            base64 = base64.replace(/^(.*)[,]/, "");

            var sliceSize = 1024;
            var byteChar = atob(base64);
            var byteLen = byteChar.length;
            var count = Math.ceil(byteLen / sliceSize);
            var byteArray = new Array(count);

            for (var index = 0; index < count; ++index) {
                var begin = index * sliceSize;
                var end = Math.min(begin + sliceSize, byteLen);
                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteChar[offset].charCodeAt(0)
                }
                byteArray[index] = new Uint8Array(bytes)
            }
            return new Blob(byteArray, mimeType);
        }
    };

    var flashStore = {
        id: 'player',
        callback: util.noop,
        cbs: {
            onplayed: util.noop,
            onended: util.noop
        }
    };

    /*
        id = "player";
    */
    var getFlashPlayer = function(id){
        return window[id];
    };
    var flashPlayer = function(){
        var movie = getFlashPlayer(flashStore.id);
        var audio = {};
        audio.play = function(base64, callbacks){
            callbacks.onbeforeplay();
            flashStore.cbs = callbacks;
            movie.doAction("init", base64);
        };
        audio.pause = function(){
            movie.doAction("stop");
        };
        flashStore.callback(audio);
    }

    var createFlashPlayer = function(callback){
        callback = callback || util.noop;

        flashStore.callback = callback;

        window.onRCVoiceSWFLoaded = function(){
            flashPlayer();
        };

        window.onRCVoiceConverted = function(e){
            var movie = getFlashPlayer(flashStore.id);
            movie.doAction('play');
            flashStore.cbs.onplayed();
        };

        window.onRCVoiceEnded = function(){
            flashStore.cbs.onended();
        };

        var containter = "rongcloud-flashContent";
    
        // var swfobject = "//cdn.ronghub.com/swfobject-2.0.0.min.js";
        var playerSWF = "./player.swf";

        var node = document.createElement("div");
            node.setAttribute("id", containter);
        document.body.appendChild(node);
        
        var swfVersionStr = "11.4.0";

        var flashvars = ['onRCVoiceSWFLoaded=onRCVoiceSWFLoaded', 'onRCVoiceConverted=onRCVoiceConverted', 'onRCVoiceEnded=onRCVoiceEnded'];

        flashvars = flashvars.join('&');

        var params = {
            quality : "high",
            bgcolor : "#ffffff",
            allowscriptaccess : "sameDomain",
            allowfullscreen : "true",
            flashvars: flashvars
        };

        var attributes = {
            id : flashStore.id,
            name : flashStore.id,
            align : "middle"
        };

        swfobject.embedSWF(playerSWF, containter, "1", "1", swfVersionStr, null, {}, params, attributes);
    }

    var waveData = {};

    var getUId = function(str){
        return str.substr(-10);
    };

    var isCacheAudio = function(key){
        return !!waveData[key];
    };

    /*
        audio = <audio preload = "auto" src = "data:audio/wav;base64,UklGRqBMAQBXQVZFZm..."></audio>
        data = "data:audio/wav;base64,UklGRqBMAQBXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YYBMAQAAAAAAA...";
    */
    var canPlay = function(audio, data, callbacks){
        audio.onended = callbacks.onended;
        audio.src = data;
//      audio.load();
        audio.play();
        callbacks.onplayed();
    };

    var playProcess = {
        cache: function(audio, base64, callbacks){
            var key = getUId(base64);
            var data = waveData[key];
            canPlay(audio, data, callbacks);
        },
        convert: function(audio, base64, callbacks){
            var key = getUId(base64);
            util.amr2wav(base64,function(data){
                waveData[key] = data;
                canPlay(audio, data, callbacks);
            });
        }
    };

    var audioPlayer = function(key){
        return isCacheAudio(key) ? playProcess.cache : playProcess.convert;
    };

    var createAudioPlayer = function(callback) {
        callback = callback || util.noop;
        var audio = new Audio();
        var player = {
            play: function(base64, callbacks){
                var key = getUId(base64);
                callbacks.onbeforeplay();
                audioPlayer(key)(audio, base64, callbacks);             
            },
            pause: function(){
                audio.pause();
            }
        };
        callback(player);
    }

    var _player;

    var checkInitReady = function(){
        return typeof _player == 'object';
    };

    /*
       playQueue = {
         base64: 'akd==',
         callbacks: {
            onbeforeplay: function(){},
            onplayed: function(){},
            onended: function(){}
         }
       }
     */
    var playQueue = {

    };
    
    var getInitPlayer = function(){
        if (isSupportAudio) {
            return createAudioPlayer;
        }else if(isSupportFlash){
            return createFlashPlayer;
        }
    };

    var init = function(){
        if (checkInitReady()) {
            return;
        }
        getInitPlayer()(function(player){
            _player = player;
            var base64 = playQueue.base64;
            if (base64) {
                var callbacks = playQueue.callbacks;
                _player.play(base64, callbacks);
            }
        });
    };

    /*
        base64: 文件类型 AMR
        callbacks.onbeforeplay: 播放之前
        callbacks.onplayed: 开始播放
        callbacks.onended: 播放完成
     */
    var play = function(params){
        params.callbacks = params.callbacks || { 
            onbeforeplay: util.noop,
            onplayed: util.noop,
            onended: util.noop
        };

        _player.play(params.base64, params.callbacks);
    };
    
    var pause = function(){
        _player && _player.pause();
    };

    var loadRes = function(params, operate){
        playQueue = params;
        init(); 
    };

    var handler = function(operate){
        return checkInitReady() ? operate : loadRes;
    };

    var Player = {
        play: function(base64, callbacks){
            var params = {
                base64: base64,
                callbacks: callbacks
            };
            handler(play)(params);
        },
        pause: function(){
            handler(pause)();
        }
    };

	return {
        init: init,
        Player: Player
    };;

}, "RongIMVoice");