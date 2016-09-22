module RongIMLib {
    export class Navigation {
        static Endpoint: any = new Object;
        constructor() {
            window.getServerEndpoint = function(x: any) {
                //把导航返回的server字段赋值给CookieHelper._host，因为flash widget需要使用 decodeURIComponent
                RongIMClient._cookieHelper._host = Navigation.Endpoint.host = x["server"];
                RongIMClient._cookieHelper.setItem("RongBackupServer", x["backupServer"] + "," + (x.userId || ""));
                //设置当前用户 Id 只有 comet 使用。
                Navigation.Endpoint.userId = x["userId"];
                if (x["voipCallInfo"]) {
                    var callInfo = JSON.parse(x["voipCallInfo"]);
                    RongIMClient._memoryStore.voipStategy = callInfo.strategy;
                    RongIMClient._cookieHelper.setItem("voipStrategy", callInfo.strategy);
                }
                //替换本地存储的导航信息
                var temp = RongIMClient._cookieHelper.getItemKey("navi");
                temp !== null && RongIMClient._cookieHelper.removeItem(temp);
                var md5Token: string = md5(RongIMLib.Bridge._client.token).slice(8, 16), openMp: number = x['openMp'] == 0 ? 0 : 1;
                RongIMClient._cookieHelper.setItem("navi" + md5Token, x["server"] + "," + (x.userId || ""));
                RongIMClient._cookieHelper.setItem('openMp' + md5Token, openMp);
                if (!openMp) {
                    RongIMClient._memoryStore.depend.openMp = false;
                }
            };
        }
        connect(appId?: string, token?: string, callback?: any) {
            var oldAppId = RongIMClient._cookieHelper.getItem("appId");
            //如果appid和本地存储的不一样，清空所有本地存储数据
            if (oldAppId && oldAppId != appId) {
                RongIMClient._cookieHelper.clearItem();
                RongIMClient._cookieHelper.setItem("appId", appId);
            }
            if (!oldAppId) {
                RongIMClient._cookieHelper.setItem("appId", appId);
            }
            var client = new Client(token, appId);
            var me = this;
            this.getServerEndpoint(token, appId, function() {
                client.connect(callback);
            }, callback.onError, true);
            return client;
        }
        getServerEndpoint(_token: string, _appId: string, _onsuccess?: any, _onerror?: any, unignore?: any) {
            if (unignore) {
                //根据token生成MD5截取8-16下标的数据与本地存储的导航信息进行比对
                //如果信息和上次的通道类型都一样，不执行navi请求，用本地存储的导航信息连接服务器
                var naviStr = md5(_token).slice(8, 16),
                    _old = RongIMClient._cookieHelper.getItem(RongIMClient._cookieHelper.getItemKey("navi")),
                    _new = RongIMClient._cookieHelper.getItem("navi" + naviStr);
                if (_old == _new && _new !== null && RongIMClient._cookieHelper.getItem("rongSDK") == Transportations._TransportType) {
                    var obj = decodeURIComponent(_old).split(",");
                    setTimeout(function() {
                        RongIMClient._cookieHelper._host = Navigation.Endpoint.host = obj[0];
                        RongIMClient._memoryStore.voipStategy = RongIMClient._cookieHelper.getItem("voipStrategy");
                        if (!RongIMClient._cookieHelper.getItem('openMp' + naviStr)) {
                            RongIMClient._memoryStore.depend.openMp = false;
                        }
                        Navigation.Endpoint.userId = obj[1];
                        _onsuccess();
                    }, 500);
                    return;
                }
            }
            //导航信息，切换Url对象的key进行线上线下测试操作
            var xss = document.createElement("script");
            //进行jsonp请求
            xss.src = RongIMClient._memoryStore.depend.navi + (RongIMClient._memoryStore.depend.isPolling ? "/cometnavi.js" : "/navi.js") + "?appId=" + _appId + "&token=" + encodeURIComponent(_token) + "&" + "callBack=getServerEndpoint&t=" + (new Date).getTime();
            document.body.appendChild(xss);
            xss.onerror = function() {
                _onerror(ConnectionState.TOKEN_INCORRECT);
            };
            if ("onload" in xss) {
                xss.onload = _onsuccess;
            } else {
                xss.onreadystatechange = function() {
                    xss.readyState == "loaded" && _onsuccess();
                };
            }
        }
    }
}
