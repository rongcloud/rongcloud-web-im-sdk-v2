module RongIMLib {

    export class RongUploadLib implements UploadProvider {

        private static _instance: RongUploadLib;

        private listener: any;

        private uploadType: string;

        private store: any = {};

        private usingKey: any = '';

        private conversationType: number;

        private targetId: string;

        private options: any = {
            uptoken: '',
            get_new_uptoken: false,
            domain: '',
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
            RongUploadLib._instance.startCalcToken();
        }

        //自定义压缩图片过程，方法最后一行必须调用 callback ，并把压缩好的 base64 传入 callback
        static imageCompressToBase64(file: any, callback: any) {
            RongUploadLib.getInstance().getThumbnail(file, 60000, function(obj: any, data: any) {
                var reg = new RegExp('^data:image/[^;]+;base64,');
                var dataFinal = data.replace(reg, '');
                callback(dataFinal);
            });
        }

        constructor(imgOpts: any, fileOpts: any) {
            var me = this;
            var head: any = document.getElementsByTagName('head')[0];
            var plScript: any = document.createElement('script');
            plScript.src = '//cdn.ronghub.com/plupload.min.js';
            plScript.onload = plScript.onreadystatechange = function() {
                if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                    var qiniuScript = document.createElement('script');
                    qiniuScript.src = "//cdn.ronghub.com/qiniu2.2.4.js";
                    qiniuScript.onload = plScript.onreadystatechange = function() {
                        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                            imgOpts && RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                                onSuccess: function(data: any) {
                                    imgOpts["uptoken"] = data.token;
                                    me.store["imgOpts"] = imgOpts;
                                    me.createOptions(imgOpts, 'IMAGE');
                                },
                                onError: function(error: ErrorCode) { }
                            });
                            fileOpts && RongIMClient.getInstance().getFileToken(RongIMLib.FileType.FILE, {
                                onSuccess: function(data: any) {
                                    fileOpts["uptoken"] = data.token;
                                    me.store["fileOpts"] = fileOpts;
                                    me.createOptions(fileOpts, 'FILE');
                                },
                                onError: function(error: ErrorCode) { }
                            });


                        }
                    }
                    head.appendChild(qiniuScript);
                }
            };
            head.appendChild(plScript);
        }

        static getInstance(): RongUploadLib {
            return RongUploadLib._instance;
        }

        setListeners(listener: any): void {
            this.listener = listener;
        }

        start(conversationType: ConversationType, targetId: string): void {
            var me = this;
            this.conversationType = conversationType || null;
            this.targetId = targetId || null;
            this.store[this.uploadType].start();
        }

        cancel(fileId: any): void {
            this.store[this.uploadType].removeFile(fileId);
        }

        cancelAll(callback: any): void {
            var up = this.store[this.uploadType], files = up.files;
            for (let i = 0, len = files.length; i < len; i++) {
                up.removeFile(files[i]);
            }
            callback();
        }

        reload(image: string, file: string): void {
            var me = this;
            image && me.store["IMAGE"] && me.store['IMAGE'].destroy();
            me.store["imgOpts"] && image == 'IMAGE' && RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                onSuccess: function(data: any) {
                    me.store["imgOpts"]["uptoken"] = data.token;
                    me.createOptions(me.store["imgOpts"], 'IMAGE');
                },
                onError: function(error: ErrorCode) { }
            });

            file && me.store['FILE'] && me.store['FILE'].destroy();
            me.store['fileOpts'] && file == 'FILE' && RongIMClient.getInstance().getFileToken(RongIMLib.FileType.FILE, {
                onSuccess: function(data: any) {
                    me.store['fileOpts']["uptoken"] = data.token;
                    me.createOptions(me.store['fileOpts'], 'FILE');
                },
                onError: function(error: ErrorCode) { }
            });
        }

        destroy(): void {
            var me = this;
            for (var key in me.store) {
                me.store[key].destroy();
                delete me.store[key];
            }
        }

        postImage(base64: string, file: any, conversationType: ConversationType, targetId: string, callback: any): void {
            var me = this;
            RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                onSuccess: function(data: any) {
                    new RongAjax({ token: data.token, base64: base64 }).send(function(ret: any) {
                        var opt = { uploadType: 'IMAGE', fileName: ret.hash, isBase64Data: true };
                        me.createMessage(opt, file, function(msg: MessageContent) {
                            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, <SendMessageCallback>{
                                onSuccess: function(message: Message) {
                                    callback(ret, message);
                                },
                                onError: function(error: ErrorCode, message: Message) {
                                    callback(ret, message, error);
                                }
                            });
                        });
                    });
                },
                onError: function(error: ErrorCode) { }
            });

        }

        createOptions(opts: any, type: string): void {
            var me = this;
            if (!opts) return;
            for (let key in me.options) {
                opts[key] || (opts[key] = me.options[key]);
            }
            //TODO 文件类型目前没有限制类型，若限制类型必须修改当前使用 uploader 的逻辑
            switch (type) {
                case 'IMAGE':
                    !opts['filters'] && (opts['filters'] = {
                        mime_types: [{ title: "Image files", extensions: "jpg,gif,png" }],
                        prevent_duplicates: true
                    });
                    opts.domain || (opts.domain = "http://rongcloud-image.qiniudn.com/");
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 1);
                    break;
                case 'FILE':
                    opts['filters'] = {
                        mime_types: [],
                        prevent_duplicates: true
                    }
                    opts.domain || (opts.domain = "http://o83059m7d.bkt.clouddn.com/");
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 2);
                    break;
                case 'VIDEO':
                    !opts['filters'] && (opts['filters'] = {
                        mime_types: [{ title: "Video files", extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4" }],
                        prevent_duplicates: true
                    });
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 3);
                    break;
                case 'AUDIO':
                    !opts['filters'] && (opts['filters'] = {
                        mime_types: [{ title: "Audio files", extensions: "mp3,wav,amr,wma" }],
                        prevent_duplicates: true
                    });
                    opts.uploadType = type;
                    me.store[type] = me.createUploadFactory(opts, 4);
                    break;
            }

        }

        createUploadFactory(opts: any, type: number): any {
            var me = this;
            var options: any = {
                runtimes: opts.runtimes,      // 上传模式，依次退化
                browse_button: opts.browse_button,         // 上传选择的点选按钮，必需
                get_new_uptoken: opts.get_new_uptoken,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                domain: opts.domain,     // bucket域名，下载资源时用到，必需
                container: opts.container,             // 上传区域DOM ID，默认是browser_button的父元素
                uptoken: opts.uptoken,
                max_file_size: opts.max_file_size,             // 最大文件体积限制
                // flash_swf_url: 'path/of/plupload/Moxie.swf',
                max_retries: opts.max_retries,                     // 上传失败最大重试次数
                dragdrop: opts.dragdrop,                     // 开启可拖曳上传
                unique_names: true,
                drop_element: opts.drop_element,          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: opts.chunk_size,                  // 分块上传时，每块的体积
                auto_start: false,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                uploadType: opts.uploadType,
                init: {
                    'FilesAdded': function(up: any, files: any) {
                        var opts: any = up.getOption(), name: string = "";
                        me.uploadType = opts.uploadType;
                        plupload.each(files, function(file: any) {
                            file.uploadType = me.uploadType;
                            me.listener.onFileAdded(file);
                        });
                    },
                    'BeforeUpload': function(up: any, file: any) {
                        var name = ""
                        file.oldName = file.name;
                        if (file.name.lastIndexOf('.') > -1) {
                            name = file.id + file.name.substr(file.name.lastIndexOf('.'));
                        }
                        else {
                            name = file.id;
                        }
                        file.name = name;
                        file.uploadType = me.uploadType;
                        me.listener.onBeforeUpload(file);
                    },
                    'UploadProgress': function(up: any, file: any) {
                        file.uploadType = me.uploadType;
                        me.listener.onUploadProgress(file);
                    },
                    'FileUploaded': function(up: any, file: any, info: any) {
                        var option: any = up.getOption();
                        if (file.name.lastIndexOf('.') > -1) {
                            var index = file.target_name.lastIndexOf('.')
                            options.fileName = file.target_name.substr(0, index) + '.' + file.target_name.substr(index + 1).toLocaleLowerCase();
                        } else {
                            options.fileName = file.id;
                        }
                        file.uploadType = me.uploadType;
                        me.createMessage(options, file, function(msg: MessageContent) {
                            RongIMClient.getInstance().sendMessage(me.conversationType, me.targetId, msg, <SendMessageCallback>{
                                onSuccess: function(ret: Message) {
                                    me.listener.onFileUploaded(file, ret);
                                },
                                onError: function(error: ErrorCode, ret: Message) {
                                    me.listener.onFileUploaded(file, ret, error);
                                }
                            });
                        });

                    },
                    'Error': function(up: any, err: any, errTip: any) {
                        me.listener.onError(up, err, errTip);
                    },
                    'UploadComplete': function() {
                        me.listener.onUploadComplete();
                    },
                    'Key': function(up: any, file: any) {
                    }
                }
            };
            opts.filters && (options['filters'] = opts.filters);
            if (type == 1) {
                return Qiniu.uploader(options);
            } else {
                var rongQiniu = new QiniuJsSDK();
                return rongQiniu.uploader(options);
            }
        }

        createMessage(option: any, file: any, callback: any): void {
            var msg: MessageContent = null;
            switch (option.uploadType) {
                case 'IMAGE':
                    var oriName: string = option.fileName.lastIndexOf('.') == -1 ? option.fileName + '.jpg' : encodeURIComponent(option.fileName);
                    RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.IMAGE, option.fileName, null, {
                        onSuccess: function(data: any) {
                            if (option.isBase64Data) {
                                RongUploadLib.imageCompressToBase64(file, function(content: string) {
                                    msg = new RongIMLib.ImageMessage({ content: content, imageUri: data.downloadUrl });
                                    callback(msg);
                                });
                            } else {
                                RongUploadLib.imageCompressToBase64(file.getNative(), function(content: string) {
                                    msg = new RongIMLib.ImageMessage({ content: content, imageUri: data.downloadUrl });
                                    callback(msg);
                                });
                            }

                        },
                        onError: function(error: ErrorCode) { }
                    });
                    break;
                case 'FILE':
                    RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.FILE, option.fileName, encodeURIComponent(file.oldName), {
                        onSuccess: function(data: any) {
                            var type: string = (option.fileName && option.fileName.split('.')[1]) || "";
                            msg = new RongIMLib.FileMessage({ name: file.oldName, size: file.size, type: type, fileUrl: data.downloadUrl });
                            callback(msg);
                        },
                        onError: function(error: ErrorCode) { }
                    });
                    break;
                case 'VIDEO':
                    //TODO
                    break;
                case 'AUDIO':
                    //TODO
                    break;
            }

        }

        private getThumbnail(obj: any, area: number, callback: any) {
            var canvas = document.createElement("canvas"),
                context = canvas.getContext('2d'), me = this;

            var img = new Image();

            img.onload = function() {
                var pos = me.getBackground(img.width, img.height);

                canvas.width = pos.w > 240 ? 240 : pos.w;
                canvas.height = pos.h > 240 ? 240 : pos.h;

                context.drawImage(img, pos.x, pos.y, pos.w, pos.h);

                try {
                    var base64str = canvas.toDataURL("image/jpeg", 0.7);
                    callback(obj, base64str);
                } catch (e) {
                    callback(obj, null);
                }

            }
            img.src = me.getFullPath(obj);

        }

        private getBackground = function(width: number, height: number) {
            var isheight = width < height;
            var scale = isheight ? height / width : width / height;
            var zoom: number, x = 0, y = 0, w: number, h: number;
            if (scale > 2.4) {
                if (isheight) {
                    zoom = width / 100;
                    w = 100;
                    h = height / zoom;
                    y = (h - 240) / 2;
                } else {
                    zoom = height / 100;
                    h = 100;
                    w = width / zoom;
                    x = (w - 240) / 2;
                }
            } else {
                if (isheight) {
                    zoom = height / 240;
                    h = 240;
                    w = width / zoom;
                } else {
                    zoom = width / 240;
                    w = 240;
                    h = height / zoom;
                }
            }
            return {
                w: w,
                h: h,
                x: -x,
                y: -y
            }
        }

        private startCalcToken(): void {
            var me = this;
            setInterval(function() {
                me.store['imgOpts'] && RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function(data: any) {
                        me.store['imgOpts']["uptoken"] = data.token;
                    },
                    onError: function(error: ErrorCode) { }
                });
                me.store['fileOpts'] && RongIMClient.getInstance().getFileToken(RongIMLib.FileType.FILE, {
                    onSuccess: function(data: any) {
                        me.store['fileOpts']["uptoken"] = data.token;
                    },
                    onError: function(error: ErrorCode) { }
                });
            }, 3500);
        }

        private getFullPath(file: File): any {
            window.URL = window.URL || window.webkitURL;
            if (window.URL && window.URL.createObjectURL) {
                return window.URL.createObjectURL(file)
            } else {
                return null;
            }
        }
    }

}
