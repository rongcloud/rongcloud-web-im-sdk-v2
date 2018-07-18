/*
    说明: 请勿修改 header.js 和 footer.js
    用途: 自动拼接暴露方式
    命令: grunt release 中 concat
*/
(function(global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        var tempIMLib = factory();
        var tempClient = tempIMLib.RongIMClient;
        var isExists = (!!global.RongIMLib);
        if (isExists) {
            var currentClient = RongIMLib.RongIMClient || {};
            for(var key in currentClient){
                tempClient[key] = currentClient[key];
            }
        }
        global.RongIMLib = tempIMLib;
        global.RongIMClient = tempClient;
    }
})(window, function(){
