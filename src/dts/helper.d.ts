declare function md5(str: string): any;
declare var Modules: any;
declare var require: any;
declare var module: any;
declare var define: any;
declare var exports: any;
declare var dcodeIO: any;
declare var Polling: any;
declare var escape: any;
declare var AMR: any;
declare var swfobject: any;
declare var openDatabase: any;
declare var AgoraRTC: any;
declare var Qiniu: any;
declare var plupload: any;
declare interface AgoraRTC {
    init: any;
    join: any;
    unpublish: any;
    publish: any;
    on: any;
    subscribe: any;
    leave: any;
}
declare class XDomainRequest { }
declare interface Navigator {
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    msGetUserMedia: any;
    getUserMedia: any;
    cancelAnimationFrame: any;
    webkitCancelAnimationFrame: any;
    mozCancelAnimationFrame: any;
    requestAnimationFrame: any;
    webkitRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;
}
declare interface Window {
    WebSocket: WebSocket;
    Notifications: any;
    RCCallback: any;
    RongIMClient: any;
    getServerEndpoint: any;
    WEB_XHR_POLLING: any;
    SCHEMETYPE: any;
    XDomainRequest: any;
    JSON: any;
    Modules: any;
    handleFileSelect: any;
    AudioContext: any;
    webkitAudioContext: any;
}
declare interface Document {
    createStyleSheet: any;
}
declare interface HTMLScriptElement {
    onreadystatechange: any;
    readyState: any;
}
declare interface Date {
    toGMTString: any;
}

declare interface ArrayConstructor {
    forEach: any;
}

declare interface Document {
    attachEvent: any;
    detachEvent: any;
}
