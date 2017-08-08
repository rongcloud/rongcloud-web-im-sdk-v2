# 融云声音库

## 声音库使用方法

### 引入声音库

```
<script src="http://cdn.ronghub.com/swfobject-2.0.0.min.js"></script> 
<script src="lib/libamr-2.2.6.min.js"></script>   
<script src="./voice-2.2.6.js"></script>
```

### 定义音频文件，base64码，AMR格式
示例中的音频消息：

```
<script src="./voice-amr-base64.json"></script>
```

### 初始化声音库
全局只需要 init 一次

```
RongIMVoice.init();
```

### 播放声音

```
/* 
	voice: amr 格式的 base64 语音文件
 	onbeforeplay: 音频播放之前
 	onplayed: 音频开始播放
 	onended: 音频播放完成
 */

RongIMVoice.Player.play(voice, {
    onbeforeplay: function(){
        console.log('onbeforeplay');
    },
    onplayed: function(){
        console.log('onplayed');
    },
    onended: function(){
        console.log('onended');
    }
});

```

### 停止播放

```
RongIMVoice.Player.pause();
```


### IOS Safari 浏览器等 播放语音，第一次点击无法播放的问题

```
/*
	Safari 浏览器 明确指出等待用户的交互动作后才能播放 audio ，如果没有得到用户的 action 就播放的话就会被 safri 拦截
*/

function touchPlay(){
    window.removeEventListener('touchstart', touchPlay, false);
    play();   //播放语音方法
}

/*  判断是否为 IOS 浏览器  */
var isiOS = (/i(Phone|P(o|a)d)/.test(navigator.userAgent));  
if(isiOS){
    window.addEventListener('touchstart', touchPlay, false);
}

```
