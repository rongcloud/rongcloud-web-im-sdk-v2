// TODO: 将应对原生功能的 dts 和外部引用的 dts 分开
declare function MD5(str: string): any;
declare var Modules: any;
declare var require: any;
declare var module: any;
declare var define: any;
declare var exports: any;
declare class XDomainRequest { }
declare interface Window {
  WebSocket: any; // TODO: 是否类型可以声明成 WebSocket？
  WEB_XHR_POLLING: any;
  Notifications: any;
  RCcallback: any;
  RongIMClient: any;
  getServerEndpoint: any;
  XDomainRequest: any;
}
declare interface HTMLScriptElement {
  onreadystatechange: any;
  readyState: any;
}
declare interface Date {
  toGMTString: any;
}

declare interface Document {
  attachEvent: any;
  detachEvent: any;
}
