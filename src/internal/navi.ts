module RongIMLib {
    export class Navigation {
        static Endpoint: any = new Object;
        static clear(){
            var storage = RongIMClient._storageProvider;
            storage.removeItem('rc_uid');
            storage.removeItem('serverIndex');
            storage.removeItem('rongSDK');
        }
        constructor() {
            window.getServerEndpoint = function(result: any) {
                var server = result.server;
                if (server) {
                    server += ','
                }
                var backupServer = result.backupServer || '';

                var tpl = '{server}{backupServer}';
                var servers:any = RongUtil.tplEngine(tpl, {
                    server: server,
                    backupServer: backupServer
                });
                var storage = RongIMClient._storageProvider;

                servers = servers.split(',');
                storage.setItem('servers', JSON.stringify(servers));

                var token = RongIMClient._memoryStore.token;
                var uid = InnerUtil.getUId(token);
                storage.setItem('rc_uid', uid);

                var userId = result.userId;
                storage.setItem('current_user', userId);

                if (result.voipCallInfo) {
                    var callInfo = JSON.parse(result.voipCallInfo);
                    RongIMClient._memoryStore.voipStategy = callInfo.strategy;
                    storage.setItem("voipStrategy", callInfo.strategy);
                }

                //替换本地存储的导航信息 
                var openMp = result.openMp;
                storage.setItem('openMp' + uid, openMp);
                RongIMClient._memoryStore.depend.openMp = openMp;
                var StatusEvent = Channel._ConnectionStatusListener;
                StatusEvent.onChanged(ConnectionStatus.RESPONSE_NAVI);
            };
        }
        connect(appId?: string, token?: string, callback?: any) {
            var oldAppId = RongIMClient._storageProvider.getItem("appId");
            //如果appid和本地存储的不一样，清空所有本地存储数据
            if (oldAppId && oldAppId != appId) {
                RongIMClient._storageProvider.clearItem();
                RongIMClient._storageProvider.setItem("appId", appId);
            }
            if (!oldAppId) {
                RongIMClient._storageProvider.setItem("appId", appId);
            }
            var client = new Client(token, appId);
            var me = this;
            this.getServerEndpoint(token, appId, function() {
                client.connect(callback);
            }, callback.onError, true);
            return client;
        }
        getServerEndpoint(token: string, appId: string, _onsuccess?: any, _onerror?: any, unignore?: any) {
            if (unignore) {
                //根据token生成MD5截取8-16下标的数据与本地存储的导航信息进行比对
                //如果信息和上次的通道类型都一样，不执行navi请求，用本地存储的导航信息连接服务器
                var uId = md5(token).slice(8, 16);

                var storage = RongIMClient._storageProvider;

                var transportType = storage.getItem("rongSDK");
                var isSameType = (Transportations._TransportType == transportType);
                var _old = storage.getItem('rc_uid');
                var isSameUser = (_old == uId);
                var servers = storage.getItem('servers');
                var hasServers = (typeof servers == 'string')
                
                if (isSameUser && isSameType && hasServers) {
                    RongIMClient._memoryStore.voipStategy = storage.getItem("voipStrategy");
                    var openMp = storage.getItem('openMp' + uId);
                    RongIMClient._memoryStore.depend.openMp = openMp;
                    _onsuccess()
                    return;
                }
            }
            Navigation.clear();
            var StatusEvent = Channel._ConnectionStatusListener;
            StatusEvent.onChanged(ConnectionStatus.REQUEST_NAVI);
            //导航信息，切换Url对象的key进行线上线下测试操作
            var xss:any = document.createElement("script");
            //进行jsonp请求
            var depend = RongIMClient._memoryStore.depend;
            var domain = depend.navi;
            var path = (depend.isPolling ? 'cometnavi' : 'navi');
                token = encodeURIComponent(token);
            var sdkver = RongIMClient.sdkver;
            var random = RongUtil.getTimestamp();

            var tpl = '{domain}/{path}.js?appId={appId}&token={token}&callBack=getServerEndpoint&v={sdkver}&r={random}';
            var url = RongUtil.tplEngine(tpl, {
                domain: domain,
                path: path,
                appId: appId,
                token: token,
                sdkver: sdkver,
                random: random
            });
            xss.src = url;
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
