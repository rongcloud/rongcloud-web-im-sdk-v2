module RongIMLib {

    export class RongUploadLib implements UploadProvider {

        private static _instance: RongUploadLib;

        private listener: any;

        private uploadType: string;

        private store: any;

        private usingKey: any = '';

        private conversationType: number;

        private targetId: string;

        private options: any = {
            uptoken: '',
            get_new_uptoken: false,
            domain: 'http://oaka9tiom.bkt.clouddn.com/',
            max_file_size: '100mb',
            max_retries: 3,
            dragdrop: true,
            drop_element: '',
            chunk_size: '4mb',
            auto_start: true,
            container: '',
            browse_button: '',
            conversationType: 0,
            targetId: ""
        };

        static init(imgOpts: any, fileOpts: any): void {
            RongUploadLib._instance = new RongUploadLib(imgOpts, fileOpts);
        }

        constructor(imgOpts: any, fileOpts: any) {
            var me = this;
            var head: any = document.getElementsByTagName('head')[0];
            var plScript: any = document.createElement('script');
            plScript.src = 'xx.js';
            plScript.onload = plScript.onreadystatechange = function() {
                if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                    var qiniuScript = document.createElement('script');
                    qiniuScript.src = "qinniu.js";
                    qiniuScript.onload = plScript.onreadystatechange = function() {
                        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                            me.createOptions(imgOpts, 'image');
                            me.createOptions(fileOpts, 'file');
                        }
                    }
                    head.appendChild(qiniuScript);
                }
            };
            head.appendChild(plScript);
        }

        getInstance(): RongUploadLib {
            return RongUploadLib._instance;
        }

        setListeners(listener: any): void {
            this.listener = listener;
        }

        startUpload(conversationType: ConversationType, targetId: string): void {
            this.conversationType = conversationType;
            this.targetId = targetId;
            this.store[this.uploadType].start();
        }

        stopUpload(): void {
            this.store[this.uploadType].stop();
        }

        createOptions(opts: any, key: string): void {
            var me = this;
            if (!opts) return;
            for (let key in me.options) {
                opts[key] || (opts[key] = me.options[key]);
            }
            //TODO 文件类型目前没有限制类型，若限制类型必须修改当前使用 uploader 的逻辑
            if (key == 'image' && !opts['filters']) {
                opts['filters'] = {
                    mime_types: [{ title: "Image files", extensions: "jpg,gif,png" }],
                    prevent_duplicates: false
                };
            } else {
                opts['filters'] = {
                    mime_types: [],
                    prevent_duplicates: false
                }
            }
            var uploader = me.createUploadFactory(opts);
            me.store[key] = uploader;
        }

        createUploadFactory(opts: any): any {
            var me = this;
            var options: any = {
                runtimes: opts.runtimes,      // 上传模式，依次退化
                browse_button: opts.browse_button,         // 上传选择的点选按钮，必需
                get_new_uptoken: opts.get_new_uptoken,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                domain: opts.domain,     // bucket域名，下载资源时用到，必需
                container: opts.container,             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: opts.max_file_size,             // 最大文件体积限制
                // flash_swf_url: 'path/of/plupload/Moxie.swf',
                max_retries: opts.max_retries,                     // 上传失败最大重试次数
                dragdrop: opts.dragdrop,                     // 开启可拖曳上传
                drop_element: opts.drop_element,          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: opts.chunk_size,                  // 分块上传时，每块的体积
                auto_start: opts.auto_start,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up: any, files: any) {
                        var opts: any = up.getOption();
                        if (opts.filters.mime_types.length) {
                            me.uploadType = 'image';
                        } else {
                            me.uploadType = 'file';
                        }
                        plupload.each(files, function(file: any) {
                            me.listener.onFileAdded(file);
                        });
                    },
                    'BeforeUpload': function(up: any, file: any) {
                        me.listener.onBeforeUpload(file);
                    },
                    'UploadProgress': function(up: any, file: any) {
                        me.listener.onUploadProgress(file);
                    },
                    'FileUploaded': function(up: any, file: any, info: any) {
                        
                        // 此处发送消息并返回文件名称、类型、大小等
                        me.listener.onFileUploaded({});
                    },
                    'Error': function(up: any, err: any, errTip: any) {
                        me.listener.onError(err, errTip);
                    },
                    'UploadComplete': function() {
                        me.listener.onUploadComplete();
                    },
                    'Key': function(up: any, file: any) {
                    }
                }
            };
            opts.filters && (options['filters'] = opts.filters);
            var rongQiniu = new QiniuJsSDK();
            return rongQiniu.uploader(options);
        }

    }

}
