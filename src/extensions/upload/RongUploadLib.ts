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
        }

        //自定义压缩图片过程，方法最后一行必须调用 callback ，并把压缩好的 base64 传入 callback
        static imageCompressToBase64(file: any, callback: any) {
            RongUploadLib.getInstance().getThumbnail(file.getNative(), 60000, function(obj: any, data: any) {
                var reg = new RegExp('^data:image/[^;]+;base64,');
                var dataFinal = data.replace(reg, '');
                callback(dataFinal);
            });
        }

        constructor(imgOpts: any, fileOpts: any) {
            var me = this;
            var head: any = document.getElementsByTagName('head')[0];
            var plScript: any = document.createElement('script');
            plScript.src = 'upload/plupload/js/plupload.dev.js';
            plScript.onload = plScript.onreadystatechange = function() {
                if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                    var qiniuScript = document.createElement('script');
                    qiniuScript.src = "upload/qiniu.js";
                    qiniuScript.onload = plScript.onreadystatechange = function() {
                        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                            imgOpts && RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                                onSuccess: function(data: any) {
                                    me.store["imgOpts"] = imgOpts;
                                    imgOpts["uptoken"] = data.token;
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
            this.conversationType = conversationType;
            this.targetId = targetId;
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

        postImage(base64: string, conversationType: ConversationType, targetId: string, callback: any): void {
            var me = this;
            RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                onSuccess: function(data: any) {
                    new RongAjax({ token: data.token, base64: base64 }).send(function(ret: any) {
                        var opt = { uploadType: 'IMAGE', fileName: ret.hash, isBase64Data: true };
                        me.createMessage(opt, base64, function(msg: MessageContent) {
                            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
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
                            me.listener.onFileAdded(file);
                        });
                    },
                    'BeforeUpload': function(up: any, file: any) {
                        var name = ""
                        file.oldName = file.name;
                        name = (+new Date) + '-' + Math.floor(Math.random() * 1000) + '.' + file.name.split(".")[1];
                        file.name = name;
                        me.listener.onBeforeUpload(file);
                    },
                    'UploadProgress': function(up: any, file: any) {
                        me.listener.onUploadProgress(file);
                    },
                    'FileUploaded': function(up: any, file: any, info: any) {
                        var option: any = up.getOption();
                        options.fileName = file.target_name;
                        me.createMessage(options, file, function(msg: MessageContent) {
                            RongIMClient.getInstance().sendMessage(me.conversationType, me.targetId, msg, {
                                onSuccess: function(ret: Message) {
                                    me.listener.onFileUploaded(file, ret);
                                },
                                onError: function(error: ErrorCode, ret: Message) {
                                    me.listener.onFileUploaded(file, ret);
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
                    RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.IMAGE, option.fileName, {
                        onSuccess: function(data: any) {
                            if (option.isBase64Data) {
                                msg = new RongIMLib.ImageMessage({ content: file, imageUri: data.downloadUrl });
                                callback(msg);
                            } else {
                                RongUploadLib.imageCompressToBase64(file, function(content: string) {
                                    msg = new RongIMLib.ImageMessage({ content: content, imageUri: data.downloadUrl });
                                    callback(msg);
                                });
                            }

                        },
                        onError: function(error: ErrorCode) { }
                    });
                    break;
                case 'FILE':
                    RongIMClient.getInstance().getFileUrl(RongIMLib.FileType.FILE, option.fileName, {
                        onSuccess: function(data: any) {
                            var type: string = (option.fileName && option.fileName.split('.')[1]) || "";
                            msg = new RongIMLib.FileMessage({ name: file.oldName, size: file.size, type: type, uri: data.downloadUrl });
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
                var target_w: number;
                var target_h: number;

                var imgarea = img.width * img.height;
                var _y = 0, _x = 0, maxWidth = 240, maxHeight = 240;
                if (imgarea > area) {
                    var scale = Math.sqrt(imgarea / area);
                    scale = Math.ceil(scale * 100) / 100;
                    target_w = img.width / scale;
                    target_h = img.height / scale;
                } else {
                    target_w = img.width;
                    target_h = img.height;
                }
                canvas.width = target_w;
                canvas.height = target_h;
                context.drawImage(img, 0, 0, target_w, target_h);
                try {
                    if (canvas.width > maxWidth || canvas.height > maxHeight) {
                        if (target_w > maxWidth) {
                            _x = (target_w - maxWidth) / 2;
                            target_w = maxWidth;
                        }
                        if (target_h > maxHeight) {
                            _y = (target_h - maxHeight) / 2;
                            target_h = maxHeight;
                        }
                        var imgData = context.getImageData(_x, _y, target_w, target_h);
                        context.createImageData(target_w, target_h);
                        canvas.width = target_w;
                        canvas.height = target_h;
                        context.putImageData(imgData, 0, 0);
                    }
                    var _canvas = canvas.toDataURL("image/jpeg", 0.5);
                    callback(obj, _canvas);
                } catch (e) {
                    callback(obj, null);
                }
            }

            img.src = me.getFullPath(obj);
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
