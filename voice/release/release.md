
### voice 声音库

版本号：2.2.6

更新内容：

	1、全新的 声音库播放语音方法 RongIMVoice.Player.play();

	2、取消了 preLoaded 预加载 方法

	3、播放语音消息 提供了三种播放状态：

	（1）onbeforeplay: 音频播放之前

 	（2）onplayed: 音频开始播放

 	（3）onended: 音频播放完成

 	4、RongIMVoice.Player.play() 方法只需传入 AMR格式的 base64 码音频文件作为参数即可

 	5、停止播放 方法 ：RongIMVoice.Player.pause();

 	停止播放后，再次播放该条语音消息，会从开始播放，而不是在停止的地方继续播放

