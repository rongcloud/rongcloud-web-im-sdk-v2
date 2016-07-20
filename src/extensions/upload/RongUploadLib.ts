module RongIMLib {

    export class RongUploadLib implements UploadProvider {

        private static _instance: RongUploadLib;

        private listener: any;

        private uploader: any;

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

        static init(options: any): void {
            if (!options.browse_button || !options.container || options.conversationType || !options.targetId) {
                throw new Error("browse_button or conversationType or targetId or container is empty!");
            }
            RongUploadLib._instance = new RongUploadLib(options);
        }

        constructor(options: any) {
            var me = this;
            for (let key in options) {
                me.options[key] = options[key];
            }
            if (!me.options.drop_element) {
                me.options.drop_element = options.container;
            }
            var head: any = document.getElementsByTagName('head')[0];
            var plScript: any = document.createElement('script');
            plScript.src = 'xx.js';
            plScript.onload = plScript.onreadystatechange = function() {
                if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                    var qiniuScript = document.createElement('script');
                    qiniuScript.src = "qinniu.js";
                    qiniuScript.onload = plScript.onreadystatechange = function() {
                        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                            me.createUploadObject();
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

        startUpload(): void {
            this.uploader.start();
        }

        stopUpload(): void {
            this.uploader.stop();
        }

        createUploadObject(): void {
            var me = this;
            me.uploader = Qiniu.uploader({
                runtimes: me.options.runtimes,      // 上传模式，依次退化
                browse_button: me.options.browse_button,         // 上传选择的点选按钮，必需
                get_new_uptoken: me.options.get_new_uptoken,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                domain: me.options.domain,     // bucket域名，下载资源时用到，必需
                container: me.options.container,             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: me.options.max_file_size,             // 最大文件体积限制
                // flash_swf_url: 'path/of/plupload/Moxie.swf',
                max_retries: me.options.max_retries,                     // 上传失败最大重试次数
                dragdrop: me.options.dragdrop,                     // 开启可拖曳上传
                drop_element: me.options.drop_element,          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: me.options.chunk_size,                  // 分块上传时，每块的体积
                auto_start: me.options.auto_start,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up: any, files: any) {
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
                        // 每个文件上传成功后，处理相关的事情
                        // 其中info是文件上传成功后，服务端返回的json，形式如：
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 查看简单反馈
                        // var domain = up.getOption('domain');
                        // var res = parseJSON(info);
                        // var sourceLink = domain + res.key; 获取上传成功后的文件的Url

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
            });
        }

    }

}
