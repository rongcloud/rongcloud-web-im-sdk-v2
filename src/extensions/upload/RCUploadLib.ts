module RongIMLib {
    export class RCUploadLib {

        public static _instance: RCUploadLib;

        private store: any = {};

        private listener: any = {};

        private uploadType: string = "";

        private conversationType: number;

        private targetId: string;

        constructor(imgOpts: any, fileOpts: any) {
            var head: any = document.getElementsByTagName('head')[0], me = this;
            var plScript: any = document.createElement('script');
            plScript.src = 'http://cdn.ronghub.com/plupload.min.js';
            plScript.onload = plScript.onreadystatechange = function() {
                imgOpts && imgOpts.domain && imgOpts.browse_button && (me.store["imgOpts"] = imgOpts) && me.createOptions(imgOpts, "IMAGE");
                fileOpts && fileOpts.domain && fileOpts.browse_button && (me.store["fileOpts"] = fileOpts) && me.createOptions(fileOpts, "FILE");
            };
            head.appendChild(plScript);
        }

        static init(imgOpts: any, fileOpts: any): void {
            RCUploadLib._instance = new RCUploadLib(imgOpts, fileOpts);
        }

        static getInstance(): RCUploadLib {
            return RCUploadLib._instance;
        }
        // 必须重写，否则将没有文件 URL
        static getFileUrl(info: any): string {
            return "";
        }
        // 将 response 传入 callback 如：callback(response.responseText);
        static uploadAjax(base64: string, callback: Function) {

        }
        //自定义压缩图片过程，方法最后一行必须调用 callback ，并把压缩好的 base64 传入 callback
        static imageCompressToBase64(file: any, callback: any) {
            RCUploadLib.getInstance().getThumbnail(file, 60000, function(obj: any, data: any) {
                var reg = new RegExp('^data:image/[^;]+;base64,');
                var dataFinal = data.replace(reg, '');
                callback(dataFinal);
            });
        }
        setListeners(listener: any): void {
            this.listener = listener;
        }

        createOptions(opts: any, type: string): void {
            opts['max_file_size'] || (opts['max_file_size'] = '100mb');
            opts['chunk_size'] || (opts['chunk_size'] = '10mb');
            switch (type) {
                case 'IMAGE':
                    opts['filters'] = {
                        mime_types: [{ title: "Image files", extensions: "jpg,gif,png" }],
                        prevent_duplicates: true
                    };
                    opts['multipart'] = true;
                    opts['unique_names'] = true;
                    opts['uploadType'] = 'IMAGE';
                    break;
                case 'FILE':
                    opts['filters'] = {
                        mime_types: [],
                        prevent_duplicates: true
                    };
                    opts['multipart'] = true;
                    opts['unique_names'] = true;
                    opts['uploadType'] = 'FILE';
                    break;
            }
            this.uploadFactory(opts);
        }

        start(conversationType: ConversationType, targetId: string): void {
            this.conversationType = conversationType;
            this.targetId = targetId;
            this.store[this.uploadType].start();
        }

        cancel(fileId: string): void {
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
            me.store["imgOpts"] && image == 'IMAGE' && me.createOptions(me.store["imgOpts"], 'IMAGE');

            file && me.store['FILE'] && me.store['FILE'].destroy();
            me.store['fileOpts'] && file == 'FILE' && me.createOptions(me.store['fileOpts'], 'FILE');
        }

        postImage(base64: string, file: any, conversationType: ConversationType, targetId: string, callback: any): void {
            var me = this;
            RCUploadLib.uploadAjax(base64, function(ret: any) {
                var opt = { uploadType: 'IMAGE', info: ret, isBase64Data: true };
                me.createMessage(opt, file, function(msg: MessageContent) {
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
        }

        uploadFactory(opts: any): void {
            var me = this;
            me.store[opts.uploadType] = new plupload.Uploader({
                browse_button: opts.browse_button,
                url: opts.domain,
                container: opts.container,
                max_file_size: opts.max_file_size,
                // flash_swf_url: 'path/of/plupload/Moxie.swf',
                max_retries: 0,
                dragdrop: opts.dragdrop,
                unique_names: true,
                filters: opts.filters,
                drop_element: opts.drop_element,
                chunk_size: opts.chunk_size,
                auto_start: false,
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
                        var name: string = "";
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
                            opts.fileName = file.target_name.substr(0, index) + '.' + file.target_name.substr(index + 1).toLocaleLowerCase();
                        } else {
                            opts.fileName = file.id;
                        }
                        file.uploadType = me.uploadType;
                        opts['info'] = info;
                        me.createMessage(opts, file, function(msg: MessageContent) {
                            RongIMClient.getInstance().sendMessage(me.conversationType, me.targetId, msg, {
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
            });
            me.store[opts.uploadType].init();
        }

        createMessage(opts: any, file: any, callback: Function): void {
            var msg: MessageContent = null;
            switch (opts.uploadType) {
                case 'IMAGE':
                    if (opts.isBase64Data) {
                        RCUploadLib.imageCompressToBase64(file, function(content: string) {
                            msg = new RongIMLib.ImageMessage({ content: content, imageUri: RCUploadLib.getFileUrl(opts.info) });
                            callback(msg);
                        });
                    } else {
                        RCUploadLib.imageCompressToBase64(file.getNative(), function(content: string) {
                            msg = new RongIMLib.ImageMessage({ content: content, imageUri: RCUploadLib.getFileUrl(opts.info) });
                            callback(msg);
                        });
                    }
                    break;
                case 'FILE':
                    var type: string = (opts.fileName && opts.fileName.split('.')[1]) || "";
                    var url = RCUploadLib.getFileUrl(opts.info);
                    url.indexOf('?') > -1 ? url += "&attname=" + encodeURIComponent(file.oldName) : url += "?attname=" + encodeURIComponent(file.oldName);
                    msg = new RongIMLib.FileMessage({ name: file.oldName, size: file.size, type: type, fileUrl: url });
                    callback(msg);
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
