var Polling = {
        SearchMpInput:function(){
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setId = function (b) {
                a.id = b;
            };
            this.toArrayBuffer = function () {
                return a;
            }
        },
        SearchMpOutput:function(){
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.setInfo = function (b) {
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a;
            }
        },
        MpInfo:function(){
            var a = {};
            this.setMpid = function(b){
                a.mpid = b;
            };
            this.setName = function(b){
                a.name = b;
            };
            this.setType = function(b){
                a.type = b;
            };
            this.setTime = function(b){
                a.time = b;
            };
            this.setPortraitUri = function(b){
                a.portraitUrl = b;
            };
            this.setExtra = function(b){
                a.extra = b;
            };
            this.toArrayBuffer = function () {
                return a;
            }
        },
        PullMpInput:function(){
            var a = {};
            this.setMpid = function(b){
                a.mpid = b;
            };
            this.setTime = function(b){
                a.time = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        PullMpOutput:function(){
            var a = {};
            this.setStatus = function(b){
                a.status = b;
            }
            this.setInfo = function(b){
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        MPFollowInput:function(){
            var a = {};
            this.setId = function(b){
                a.id = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        MPFollowOutput:function(){
            var a = {};
            this.setNothing = function(b){
                a.nothing = b;
            };
            this.setInfo = function(b){
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        NotifyMsg: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setTime = function (b) {
                a.time = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        SyncRequestMsg: function () {
            var a = {};
            this.setSyncTime = function (b) {
                a.syncTime = b || 0;
            };
            this.setIspolling = function (b) {
                a.ispolling = !!b;
            };
            this.setIsweb = function (b) {
                a.isweb = !!b;
            };
            this.setIsPullSend = function (b) {
                a.isPullSend = !!b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        UpStreamMessage: function () {
            var a = {};
            this.setSessionId = function (b) {
                a.sessionId = b
            };
            this.setClassname = function (b) {
                a.classname = b
            };
            this.setContent = function (b) {
                if (b) a.content = b;
            };
            this.setPushText = function (b) {
                a.pushText = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        DownStreamMessages: function () {
            var a = {};
            this.setList = function (b) {
                a.list = b
            };
            this.setSyncTime = function (b) {
                a.syncTime = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        DownStreamMessage: function () {
            var a = {};
            this.setFromUserId = function (b) {
                a.fromUserId = b
            };
            this.setType = function (b) {
                a.type = b
            };
            this.setGroupId = function (b) {
                a.groupId = b
            };
            this.setClassname = function (b) {
                a.classname = b
            };
            this.setContent = function (b) {
                if (b)
                    a.content = b
            };
            this.setDataTime = function (b) {
                a.dataTime = b;
            };
            this.setStatus = function (b) {
                a.status = b;
            };
            this.setMsgId = function (b) {
                a.msgId = b;
            };
            this.toArrayBuffer = function () {
                return a;
            };
        },
        CreateDiscussionInput: function () {
            var a = {};
            this.setName = function (b) {
                a.name = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        CreateDiscussionOutput: function () {
            var a = {};
            this.setId = function (b) {
                a.id = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChannelInvitationInput: function () {
            var a = {};
            this.setUsers = function (b) {
                a.users = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        LeaveChannelInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChannelEvictionInput: function () {
            var a = {};
            this.setUser = function (b) {
                a.user = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        RenameChannelInput: function () {
            var a = {};
            this.setName = function (b) {
                a.name = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ChannelInfoInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ChannelInfoOutput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b
            };
            this.setChannelId = function (b) {
                a.channelId = b
            };
            this.setChannelName = function (b) {
                a.channelName = b
            };
            this.setAdminUserId = function (b) {
                a.adminUserId = b
            };
            this.setFirstTenUserIds = function (b) {
                a.firstTenUserIds = b
            };
            this.setOpenStatus = function (b) {
                a.openStatus = b
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ChannelInfosInput: function () {
            var a = {};
            this.setPage = function (b) {
                a.page = b
            };
            this.setNumber = function (b) {
                a.number = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChannelInfosOutput: function () {
            var a = {};
            this.setChannels = function (b) {
                a.channels = b
            };
            this.setTotal = function (b) {
                a.total = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        MemberInfo: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b
            };
            this.setUserName = function (b) {
                a.userName = b
            };
            this.setUserPortrait = function (b) {
                a.userPortrait = b
            };
            this.setExtension = function (b) {
                a.extension = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupMembersInput: function () {
            var a = {};
            this.setPage = function (b) {
                a.page = b
            };
            this.setNumber = function (b) {
                a.number = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupMembersOutput: function () {
            var a = {};
            this.setMembers = function (b) {
                a.members = b
            };
            this.setTotal = function (b) {
                a.total = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetUserInfoInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetUserInfoOutput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b
            };
            this.setUserName = function (b) {
                a.userName = b
            };
            this.setUserPortrait = function (b) {
                a.userPortrait = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetSessionIdInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetSessionIdOutput: function () {
            var a = {};
            this.setSessionId = function (b) {
                a.sessionId = b
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GetQNupTokenInput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            }
            this.toArrayBuffer = function () {
                return a
            }
        },
        GetQNupTokenOutput: function () {
            var a = {};
            this.setDeadline = function (b) {
                a.deadline = b
            };
            this.setToken = function (b) {
                a.token = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        GetQNdownloadUrlInput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setKey = function (b) {
                a.key = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        GetQNdownloadUrlOutput: function () {
            var a = {};
            this.setDownloadUrl = function (b) {
                a.downloadUrl = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        Add2BlackListInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        RemoveFromBlackListInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        QueryBlackListInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        QueryBlackListOutput: function () {
            var a = {};
            this.setUserIds = function (b) {
                a.userIds = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        BlackListStatusInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        BlockPushInput: function () {
            var a = {};
            this.setBlockeeId = function (b) {
                a.blockeeId = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        ModifyPermissionInput: function () {
            var a = {};
            this.setOpenStatus = function (b) {
                a.openStatus = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupInput: function () {
            var a = {};
            this.setGroupInfo = function (b) {
                for (var i = 0, arr = []; i < b.length; i++) {
                    arr.push({id: b[i].getContent().id, name: b[i].getContent().name})
                }
                a.groupInfo = arr;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupOutput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupInfo: function () {
            var a = {};
            this.setId = function (b) {
                a.id = b;
            };
            this.setName = function (b) {
                a.name = b;
            };
            this.getContent = function () {
                return a;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupHashInput: function () {
            var a = {};
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.setGroupHashCode = function (b) {
                a.groupHashCode = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        GroupHashOutput: function () {
            var a = {};
            this.setResult = function (b) {
                a.result = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChrmInput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChrmOutput: function () {
            var a = {};
            this.setNothing = function (b) {
                a.nothing = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        ChrmPullMsg: function () {
            var a = {};
            this.setSyncTime = function (b) {
                a.syncTime = b
            };
            this.setCount = function (b) {
                a.count = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        RelationsInput: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setMsg = function(b){
                a.msg = b;
            };
            this.toArrayBuffer = function () {
                return a
            };
        },
        RelationsOutput: function () {
            var a = {};
            this.setInfo = function (b) {
                a.info = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        RelationInfo: function () {
            var a = {};
            this.setType = function (b) {
                a.type = b;
            };
            this.setUserId = function (b) {
                a.userId = b;
            };
            this.setMsg = function(b){
                a.msg = b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        HistoryMessageInput: function () {
            var a={};
            this.setTargetId=function(b){
                a.targetId=b;
            };
            this.setDataTime=function(b){
                a.dataTime=b;
            };
            this.setSize=function(b){
                a.size=b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        },
        HistoryMessagesOuput: function () {
            var a={};
            this.setList=function(b){
                a.list=b;
            };
            this.setSyncTime=function(b){
                a.syncTime=b;
            };
            this.setHasMsg=function(b){
                a.hasMsg=b;
            };
            this.toArrayBuffer = function () {
                return a
            }
        }
    };
    for (var f in Polling) {
        Polling[f].decode = function (b) {
            var back = {}, val = JSON.parse(b) || eval("(" + b + ")");
            for (var i in val) {
                back[i]=val[i];
                back["get"+ i.charAt(0).toUpperCase()+i.slice(1)]=function(){
                    return val[i];
                }
            }
            return back;
        }
    }

/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define, module */

(function ($) {
    'use strict';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }
    $.md5 = md5;
    if (typeof define === 'function' && define.amd) {
        define('md5',function () {
            return md5;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = md5;
    } else {
        $.md5 = md5;
    }
}(this));

var RongIMLib;
(function (RongIMLib) {
    (function (BlacklistStatus) {
        /**
         * 在黑名单中。
         */
        BlacklistStatus[BlacklistStatus["IN_BLACK_LIST"] = 0] = "IN_BLACK_LIST";
        /**
         * 不在黑名单中。
         */
        BlacklistStatus[BlacklistStatus["NOT_IN_BLACK_LIST"] = 1] = "NOT_IN_BLACK_LIST";
    })(RongIMLib.BlacklistStatus || (RongIMLib.BlacklistStatus = {}));
    var BlacklistStatus = RongIMLib.BlacklistStatus;
    (function (ConnectionChannel) {
        ConnectionChannel[ConnectionChannel["XHR_POLLING"] = 0] = "XHR_POLLING";
        ConnectionChannel[ConnectionChannel["WEBSOCKET"] = 1] = "WEBSOCKET";
        //外部调用
        ConnectionChannel[ConnectionChannel["HTTP"] = 0] = "HTTP";
        //外部调用
        ConnectionChannel[ConnectionChannel["HTTPS"] = 1] = "HTTPS";
    })(RongIMLib.ConnectionChannel || (RongIMLib.ConnectionChannel = {}));
    var ConnectionChannel = RongIMLib.ConnectionChannel;
    (function (ConnectionStatus) {
        /**
         * 连接成功。
         */
        ConnectionStatus[ConnectionStatus["CONNECTED"] = 0] = "CONNECTED";
        /**
         * 连接中。
         */
        ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
        /**
         * 断开连接。
         */
        ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 2] = "DISCONNECTED";
        /**
         * 用户账户在其他设备登录，本机会被踢掉线。
         */
        ConnectionStatus[ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"] = 6] = "KICKED_OFFLINE_BY_OTHER_CLIENT";
        /**
         * 网络不可用。
         */
        ConnectionStatus[ConnectionStatus["NETWORK_UNAVAILABLE"] = -1] = "NETWORK_UNAVAILABLE";
    })(RongIMLib.ConnectionStatus || (RongIMLib.ConnectionStatus = {}));
    var ConnectionStatus = RongIMLib.ConnectionStatus;
    (function (ConversationNotificationStatus) {
        /**
         * 免打扰状态，关闭对应会话的通知提醒。
         */
        ConversationNotificationStatus[ConversationNotificationStatus["DO_NOT_DISTURB"] = 0] = "DO_NOT_DISTURB";
        /**
         * 提醒。
         */
        ConversationNotificationStatus[ConversationNotificationStatus["NOTIFY"] = 1] = "NOTIFY";
    })(RongIMLib.ConversationNotificationStatus || (RongIMLib.ConversationNotificationStatus = {}));
    var ConversationNotificationStatus = RongIMLib.ConversationNotificationStatus;
    (function (ConversationType) {
        ConversationType[ConversationType["NONE"] = 0] = "NONE";
        ConversationType[ConversationType["PRIVATE"] = 1] = "PRIVATE";
        ConversationType[ConversationType["DISCUSSION"] = 2] = "DISCUSSION";
        ConversationType[ConversationType["GROUP"] = 3] = "GROUP";
        ConversationType[ConversationType["CHATROOM"] = 4] = "CHATROOM";
        ConversationType[ConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";
        ConversationType[ConversationType["SYSTEM"] = 6] = "SYSTEM";
        //默认关注 MC
        ConversationType[ConversationType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
        //手工关注 MP
        ConversationType[ConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
    })(RongIMLib.ConversationType || (RongIMLib.ConversationType = {}));
    var ConversationType = RongIMLib.ConversationType;
    (function (DiscussionInviteStatus) {
        /**
         * 开放邀请。
         */
        DiscussionInviteStatus[DiscussionInviteStatus["OPENED"] = 0] = "OPENED";
        /**
         * 关闭邀请。
         */
        DiscussionInviteStatus[DiscussionInviteStatus["CLOSED"] = 1] = "CLOSED";
    })(RongIMLib.DiscussionInviteStatus || (RongIMLib.DiscussionInviteStatus = {}));
    var DiscussionInviteStatus = RongIMLib.DiscussionInviteStatus;
    (function (ErrorCode) {
        ErrorCode[ErrorCode["TIMEOUT"] = -1] = "TIMEOUT";
        /**
         * 未知原因失败。
         */
        ErrorCode[ErrorCode["UNKNOWN"] = -2] = "UNKNOWN";
        /**
         * 发送频率过快
         */
        ErrorCode[ErrorCode["SEND_FREQUENCY_TOO_FAST"] = 20604] = "SEND_FREQUENCY_TOO_FAST";
        /**
         * 不在讨论组。
         */
        ErrorCode[ErrorCode["NOT_IN_DISCUSSION"] = 21406] = "NOT_IN_DISCUSSION";
        /**
         * 加入讨论失败
         */
        ErrorCode[ErrorCode["JOIN_IN_DISCUSSION"] = 21407] = "JOIN_IN_DISCUSSION";
        /**
         * 创建讨论组失败
         */
        ErrorCode[ErrorCode["CREATE_DISCUSSION"] = 21408] = "CREATE_DISCUSSION";
        /**
         * 设置讨论组邀请状态失败
         */
        ErrorCode[ErrorCode["INVITE_DICUSSION"] = 21409] = "INVITE_DICUSSION";
        /**
         * 不在群组。
         */
        ErrorCode[ErrorCode["NOT_IN_GROUP"] = 22406] = "NOT_IN_GROUP";
        /**
         * 不在聊天室。
         */
        ErrorCode[ErrorCode["NOT_IN_CHATROOM"] = 23406] = "NOT_IN_CHATROOM";
        /**
         *获取用户失败
         */
        ErrorCode[ErrorCode["GET_USERINFO_ERROR"] = 23407] = "GET_USERINFO_ERROR";
        /**
         * 在黑名单中。
         */
        ErrorCode[ErrorCode["REJECTED_BY_BLACKLIST"] = 405] = "REJECTED_BY_BLACKLIST";
        /**
         * 通信过程中，当前 Socket 不存在。
         */
        ErrorCode[ErrorCode["RC_NET_CHANNEL_INVALID"] = 30001] = "RC_NET_CHANNEL_INVALID";
        /**
         * Socket 连接不可用。
         */
        ErrorCode[ErrorCode["RC_NET_UNAVAILABLE"] = 30002] = "RC_NET_UNAVAILABLE";
        /**
         * 通信超时。
         */
        ErrorCode[ErrorCode["RC_MSG_RESP_TIMEOUT"] = 30003] = "RC_MSG_RESP_TIMEOUT";
        /**
         * 导航操作时，Http 请求失败。
         */
        ErrorCode[ErrorCode["RC_HTTP_SEND_FAIL"] = 30004] = "RC_HTTP_SEND_FAIL";
        /**
         * HTTP 请求失败。
         */
        ErrorCode[ErrorCode["RC_HTTP_REQ_TIMEOUT"] = 30005] = "RC_HTTP_REQ_TIMEOUT";
        /**
         * HTTP 接收失败。
         */
        ErrorCode[ErrorCode["RC_HTTP_RECV_FAIL"] = 30006] = "RC_HTTP_RECV_FAIL";
        /**
         * 导航操作的 HTTP 请求，返回不是200。
         */
        ErrorCode[ErrorCode["RC_NAVI_RESOURCE_ERROR"] = 30007] = "RC_NAVI_RESOURCE_ERROR";
        /**
         * 导航数据解析后，其中不存在有效数据。
         */
        ErrorCode[ErrorCode["RC_NODE_NOT_FOUND"] = 30008] = "RC_NODE_NOT_FOUND";
        /**
         * 导航数据解析后，其中不存在有效 IP 地址。
         */
        ErrorCode[ErrorCode["RC_DOMAIN_NOT_RESOLVE"] = 30009] = "RC_DOMAIN_NOT_RESOLVE";
        /**
         * 创建 Socket 失败。
         */
        ErrorCode[ErrorCode["RC_SOCKET_NOT_CREATED"] = 30010] = "RC_SOCKET_NOT_CREATED";
        /**
         * Socket 被断开。
         */
        ErrorCode[ErrorCode["RC_SOCKET_DISCONNECTED"] = 30011] = "RC_SOCKET_DISCONNECTED";
        /**
         * PING 操作失败。
         */
        ErrorCode[ErrorCode["RC_PING_SEND_FAIL"] = 30012] = "RC_PING_SEND_FAIL";
        /**
         * PING 超时。
         */
        ErrorCode[ErrorCode["RC_PONG_RECV_FAIL"] = 30013] = "RC_PONG_RECV_FAIL";
        /**
         * 消息发送失败。
         */
        ErrorCode[ErrorCode["RC_MSG_SEND_FAIL"] = 30014] = "RC_MSG_SEND_FAIL";
        /**
         * 做 connect 连接时，收到的 ACK 超时。
         */
        ErrorCode[ErrorCode["RC_CONN_ACK_TIMEOUT"] = 31000] = "RC_CONN_ACK_TIMEOUT";
        /**
         * 参数错误。
         */
        ErrorCode[ErrorCode["RC_CONN_PROTO_VERSION_ERROR"] = 31001] = "RC_CONN_PROTO_VERSION_ERROR";
        /**
         * 参数错误，App Id 错误。
         */
        ErrorCode[ErrorCode["RC_CONN_ID_REJECT"] = 31002] = "RC_CONN_ID_REJECT";
        /**
         * 服务器不可用。
         */
        ErrorCode[ErrorCode["RC_CONN_SERVER_UNAVAILABLE"] = 31003] = "RC_CONN_SERVER_UNAVAILABLE";
        /**
         * Token 错误。
         */
        ErrorCode[ErrorCode["RC_CONN_USER_OR_PASSWD_ERROR"] = 31004] = "RC_CONN_USER_OR_PASSWD_ERROR";
        /**
         * App Id 与 Token 不匹配。
         */
        ErrorCode[ErrorCode["RC_CONN_NOT_AUTHRORIZED"] = 31005] = "RC_CONN_NOT_AUTHRORIZED";
        /**
         * 重定向，地址错误。
         */
        ErrorCode[ErrorCode["RC_CONN_REDIRECTED"] = 31006] = "RC_CONN_REDIRECTED";
        /**
         * NAME 与后台注册信息不一致。
         */
        ErrorCode[ErrorCode["RC_CONN_PACKAGE_NAME_INVALID"] = 31007] = "RC_CONN_PACKAGE_NAME_INVALID";
        /**
         * APP 被屏蔽、删除或不存在。
         */
        ErrorCode[ErrorCode["RC_CONN_APP_BLOCKED_OR_DELETED"] = 31008] = "RC_CONN_APP_BLOCKED_OR_DELETED";
        /**
         * 用户被屏蔽。
         */
        ErrorCode[ErrorCode["RC_CONN_USER_BLOCKED"] = 31009] = "RC_CONN_USER_BLOCKED";
        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        ErrorCode[ErrorCode["RC_DISCONN_KICK"] = 31010] = "RC_DISCONN_KICK";
        /**
         * Disconnect，由服务器返回，比如用户互踢。
         */
        ErrorCode[ErrorCode["RC_DISCONN_EXCEPTION"] = 31011] = "RC_DISCONN_EXCEPTION";
        /**
         * 协议层内部错误。query，上传下载过程中数据错误。
         */
        ErrorCode[ErrorCode["RC_QUERY_ACK_NO_DATA"] = 32001] = "RC_QUERY_ACK_NO_DATA";
        /**
         * 协议层内部错误。
         */
        ErrorCode[ErrorCode["RC_MSG_DATA_INCOMPLETE"] = 32002] = "RC_MSG_DATA_INCOMPLETE";
        /**
         * 未调用 init 初始化函数。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_CLIENT_NOT_INIT"] = 33001] = "BIZ_ERROR_CLIENT_NOT_INIT";
        /**
         * 数据库初始化失败。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_DATABASE_ERROR"] = 33002] = "BIZ_ERROR_DATABASE_ERROR";
        /**
         * 传入参数无效。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_INVALID_PARAMETER"] = 33003] = "BIZ_ERROR_INVALID_PARAMETER";
        /**
         * 通道无效。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_NO_CHANNEL"] = 33004] = "BIZ_ERROR_NO_CHANNEL";
        /**
         * 重新连接成功。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_RECONNECT_SUCCESS"] = 33005] = "BIZ_ERROR_RECONNECT_SUCCESS";
        /**
         * 连接中，再调用 connect 被拒绝。
         */
        ErrorCode[ErrorCode["BIZ_ERROR_CONNECTING"] = 33006] = "BIZ_ERROR_CONNECTING";
        /**
         * 消息漫游服务未开通
         */
        ErrorCode[ErrorCode["MSG_ROAMING_SERVICE_UNAVAILABLE"] = 33007] = "MSG_ROAMING_SERVICE_UNAVAILABLE";
        /**
         * 群组被禁言
         */
        ErrorCode[ErrorCode["FORBIDDEN_IN_GROUP"] = 22408] = "FORBIDDEN_IN_GROUP";
        /**
         * 删除会话失败
         */
        ErrorCode[ErrorCode["CONVER_REMOVE_ERROR"] = 34001] = "CONVER_REMOVE_ERROR";
        /**
         *拉取历史消息
         */
        ErrorCode[ErrorCode["CONVER_GETLIST_ERROR"] = 34002] = "CONVER_GETLIST_ERROR";
        /**
         * 会话指定异常
         */
        ErrorCode[ErrorCode["CONVER_SETOP_ERROR"] = 34003] = "CONVER_SETOP_ERROR";
        /**
         * 获取会话未读消息总数失败
         */
        ErrorCode[ErrorCode["CONVER_TOTAL_UNREAD_ERROR"] = 34004] = "CONVER_TOTAL_UNREAD_ERROR";
        /**
         * 获取指定会话类型未读消息数异常
         */
        ErrorCode[ErrorCode["CONVER_TYPE_UNREAD_ERROR"] = 34005] = "CONVER_TYPE_UNREAD_ERROR";
        /**
         * 获取指定用户ID&会话类型未读消息数异常
         */
        ErrorCode[ErrorCode["CONVER_ID_TYPE_UNREAD_ERROR"] = 34006] = "CONVER_ID_TYPE_UNREAD_ERROR";
        //群组异常信息
        /**
         *
         */
        ErrorCode[ErrorCode["GROUP_SYNC_ERROR"] = 35001] = "GROUP_SYNC_ERROR";
        /**
         * 匹配群信息系异常
         */
        ErrorCode[ErrorCode["GROUP_MATCH_ERROR"] = 35002] = "GROUP_MATCH_ERROR";
        //聊天室异常
        /**
         * 加入聊天室Id为空
         */
        ErrorCode[ErrorCode["CHATROOM_ID_ISNULL"] = 36001] = "CHATROOM_ID_ISNULL";
        /**
         * 加入聊天室失败
         */
        ErrorCode[ErrorCode["CHARTOOM_JOIN_ERROR"] = 36002] = "CHARTOOM_JOIN_ERROR";
        /**
         * 拉取聊天室历史消息失败
         */
        ErrorCode[ErrorCode["CHATROOM_HISMESSAGE_ERROR"] = 36003] = "CHATROOM_HISMESSAGE_ERROR";
        //黑名单异常
        /**
         * 加入黑名单异常
         */
        ErrorCode[ErrorCode["BLACK_ADD_ERROR"] = 37001] = "BLACK_ADD_ERROR";
        /**
         * 获得指定人员再黑名单中的状态异常
         */
        ErrorCode[ErrorCode["BLACK_GETSTATUS_ERROR"] = 37002] = "BLACK_GETSTATUS_ERROR";
        /**
         * 移除黑名单异常
         */
        ErrorCode[ErrorCode["BLACK_REMOVE_ERROR"] = 37003] = "BLACK_REMOVE_ERROR";
        /**
         * 获取草稿失败
         */
        ErrorCode[ErrorCode["DRAF_GET_ERROR"] = 38001] = "DRAF_GET_ERROR";
        /**
         * 保存草稿失败
         */
        ErrorCode[ErrorCode["DRAF_SAVE_ERROR"] = 38002] = "DRAF_SAVE_ERROR";
        /**
         * 删除草稿失败
         */
        ErrorCode[ErrorCode["DRAF_REMOVE_ERROR"] = 38003] = "DRAF_REMOVE_ERROR";
        /**
         * 关注公众号失败
         */
        ErrorCode[ErrorCode["SUBSCRIBE_ERROR"] = 39001] = "SUBSCRIBE_ERROR";
        /**
         * 关注公众号失败
         */
        ErrorCode[ErrorCode["QNTKN_FILETYPE_ERROR"] = 41001] = "QNTKN_FILETYPE_ERROR";
        /**
         * 获取七牛token失败
         */
        ErrorCode[ErrorCode["QNTKN_GET_ERROR"] = 41002] = "QNTKN_GET_ERROR";
        /**
         * cookie被禁用
         */
        ErrorCode[ErrorCode["COOKIE_ENABLE"] = 51001] = "COOKIE_ENABLE";
    })(RongIMLib.ErrorCode || (RongIMLib.ErrorCode = {}));
    var ErrorCode = RongIMLib.ErrorCode;
    (function (MediaType) {
        /**
         * 图片。
         */
        MediaType[MediaType["IMAGE"] = 1] = "IMAGE";
        /**
         * 声音。
         */
        MediaType[MediaType["AUDIO"] = 2] = "AUDIO";
        /**
         * 视频。
         */
        MediaType[MediaType["VIDEO"] = 3] = "VIDEO";
        /**
         * 通用文件。
         */
        MediaType[MediaType["FILE"] = 100] = "FILE";
    })(RongIMLib.MediaType || (RongIMLib.MediaType = {}));
    var MediaType = RongIMLib.MediaType;
    (function (MessageDirection) {
        /**
         * 发送消息。
         */
        MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
        /**
         * 接收消息。
         */
        MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
    })(RongIMLib.MessageDirection || (RongIMLib.MessageDirection = {}));
    var MessageDirection = RongIMLib.MessageDirection;
    (function (FileType) {
        FileType[FileType["IMAGE"] = 1] = "IMAGE";
        FileType[FileType["AUDIO"] = 2] = "AUDIO";
        FileType[FileType["VIDEO"] = 3] = "VIDEO";
    })(RongIMLib.FileType || (RongIMLib.FileType = {}));
    var FileType = RongIMLib.FileType;
    (function (RealTimeLocationErrorCode) {
        /**
         * 未初始化 RealTimeLocation 实例
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NOT_INIT"] = -1] = "RC_REAL_TIME_LOCATION_NOT_INIT";
        /**
         * 执行成功。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_SUCCESS"] = 0] = "RC_REAL_TIME_LOCATION_SUCCESS";
        /**
         * 获取 RealTimeLocation 实例时返回
         * GPS 未打开。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_GPS_DISABLED"] = 1] = "RC_REAL_TIME_LOCATION_GPS_DISABLED";
        /**
         * 获取 RealTimeLocation 实例时返回
         * 当前会话不支持位置共享。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT"] = 2] = "RC_REAL_TIME_LOCATION_CONVERSATION_NOT_SUPPORT";
        /**
         * 获取 RealTimeLocation 实例时返回
         * 对方已发起位置共享。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_IS_ON_GOING"] = 3] = "RC_REAL_TIME_LOCATION_IS_ON_GOING";
        /**
         * Join 时返回
         * 当前位置共享已超过最大支持人数。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT"] = 4] = "RC_REAL_TIME_LOCATION_EXCEED_MAX_PARTICIPANT";
        /**
         * Join 时返回
         * 加入位置共享失败。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_JOIN_FAILURE"] = 5] = "RC_REAL_TIME_LOCATION_JOIN_FAILURE";
        /**
         * Start 时返回
         * 发起位置共享失败。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_START_FAILURE"] = 6] = "RC_REAL_TIME_LOCATION_START_FAILURE";
        /**
         * 网络不可用。
         */
        RealTimeLocationErrorCode[RealTimeLocationErrorCode["RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE"] = 7] = "RC_REAL_TIME_LOCATION_NETWORK_UNAVAILABLE";
    })(RongIMLib.RealTimeLocationErrorCode || (RongIMLib.RealTimeLocationErrorCode = {}));
    var RealTimeLocationErrorCode = RongIMLib.RealTimeLocationErrorCode;
    (function (RealTimeLocationStatus) {
        /**
         * 空闲状态 （默认状态）
         * 对方或者自己都未发起位置共享业务，或者位置共享业务已结束。
         */
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_IDLE"] = 0] = "RC_REAL_TIME_LOCATION_STATUS_IDLE";
        /**
         * 呼入状态 （待加入）
         * 1. 对方发起了位置共享业务，此状态下，自己只能选择加入。
         * 2. 自己从已连接的位置共享中退出。
         */
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_INCOMING"] = 1] = "RC_REAL_TIME_LOCATION_STATUS_INCOMING";
        /**
         * 呼出状态 =（自己创建）
         * 1. 自己发起位置共享业务，对方只能选择加入。
         * 2. 对方从已连接的位置共享业务中退出。
         */
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_OUTGOING"] = 2] = "RC_REAL_TIME_LOCATION_STATUS_OUTGOING";
        /**
         * 连接状态 （自己加入）
         * 对方加入了自己发起的位置共享，或者自己加入了对方发起的位置共享。
         */
        RealTimeLocationStatus[RealTimeLocationStatus["RC_REAL_TIME_LOCATION_STATUS_CONNECTED"] = 3] = "RC_REAL_TIME_LOCATION_STATUS_CONNECTED";
    })(RongIMLib.RealTimeLocationStatus || (RongIMLib.RealTimeLocationStatus = {}));
    var RealTimeLocationStatus = RongIMLib.RealTimeLocationStatus;
    (function (ReceivedStatus) {
        ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";
        ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";
        ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";
    })(RongIMLib.ReceivedStatus || (RongIMLib.ReceivedStatus = {}));
    var ReceivedStatus = RongIMLib.ReceivedStatus;
    (function (SearchType) {
        /**
         * 精确。
         */
        SearchType[SearchType["EXACT"] = 0] = "EXACT";
        /**
         * 模糊。
         */
        SearchType[SearchType["FUZZY"] = 1] = "FUZZY";
    })(RongIMLib.SearchType || (RongIMLib.SearchType = {}));
    var SearchType = RongIMLib.SearchType;
    (function (SentStatus) {
        /**
         * 发送中。
         */
        SentStatus[SentStatus["SENDING"] = 10] = "SENDING";
        /**
         * 发送失败。
         */
        SentStatus[SentStatus["FAILED"] = 20] = "FAILED";
        /**
         * 已发送。
         */
        SentStatus[SentStatus["SENT"] = 30] = "SENT";
        /**
         * 对方已接收。
         */
        SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";
        /**
         * 对方已读。
         */
        SentStatus[SentStatus["READ"] = 50] = "READ";
        /**
         * 对方已销毁。
         */
        SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";
    })(RongIMLib.SentStatus || (RongIMLib.SentStatus = {}));
    var SentStatus = RongIMLib.SentStatus;
    (function (ConnectionState) {
        ConnectionState[ConnectionState["ACCEPTED"] = 0] = "ACCEPTED";
        ConnectionState[ConnectionState["UNACCEPTABLE_PROTOCOL_VERSION"] = 1] = "UNACCEPTABLE_PROTOCOL_VERSION";
        ConnectionState[ConnectionState["IDENTIFIER_REJECTED"] = 2] = "IDENTIFIER_REJECTED";
        ConnectionState[ConnectionState["SERVER_UNAVAILABLE"] = 3] = "SERVER_UNAVAILABLE";
        /**
         * token无效
         */
        ConnectionState[ConnectionState["TOKEN_INCORRECT"] = 4] = "TOKEN_INCORRECT";
        ConnectionState[ConnectionState["NOT_AUTHORIZED"] = 5] = "NOT_AUTHORIZED";
        ConnectionState[ConnectionState["REDIRECT"] = 6] = "REDIRECT";
        ConnectionState[ConnectionState["PACKAGE_ERROR"] = 7] = "PACKAGE_ERROR";
        ConnectionState[ConnectionState["APP_BLOCK_OR_DELETE"] = 8] = "APP_BLOCK_OR_DELETE";
        ConnectionState[ConnectionState["BLOCK"] = 9] = "BLOCK";
        ConnectionState[ConnectionState["TOKEN_EXPIRE"] = 10] = "TOKEN_EXPIRE";
        ConnectionState[ConnectionState["DEVICE_ERROR"] = 11] = "DEVICE_ERROR";
    })(RongIMLib.ConnectionState || (RongIMLib.ConnectionState = {}));
    var ConnectionState = RongIMLib.ConnectionState;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var RongIMClient = (function () {
        function RongIMClient() {
        }
        RongIMClient.getInstance = function () {
            if (!RongIMClient._instance) {
                throw new Error("RongIMClient is not initialized. Call .init() method first.");
            }
            return RongIMClient._instance;
        };
        /**
         * 初始化 SDK，在整个应用全局只需要调用一次。
         * @param appKey    开发者后台申请的 AppKey，用来标识应用。
         * @param dataAccessProvider 必须是DataAccessProvider的实例
         */
        RongIMClient.init = function (appKey, dataAccessProvider) {
            if (!RongIMClient._instance) {
                RongIMClient._instance = new RongIMClient();
            }
            var pather = new RongIMLib.FeaturePatcher();
            pather.patchAll();
            RongIMClient._memoryStore = {
                token: "",
                callback: null,
                hasModules: true,
                global: window,
                lastReadTime: new RongIMLib.LimitableMap(),
                conversationList: [],
                appKey: appKey,
                publicServiceMap: new RongIMLib.PublicServiceMap(),
                listenerList: [],
                providerType: 1,
                deltaTime: 0,
                filterMessages: [],
                isSyncRemoteConverList: false
            };
            RongIMClient._cookieHelper = new RongIMLib.CookieProvider();
            if (dataAccessProvider && Object.prototype.toString.call(dataAccessProvider) == "[object Object]") {
                RongIMClient._dataAccessProvider = dataAccessProvider;
            }
            else {
                RongIMClient._dataAccessProvider = new RongIMLib.ServerDataProvider();
            }
            RongIMClient.MessageParams = {
                TextMessage: { objectName: "RC:TxtMsg", msgTag: new RongIMLib.MessageTag(true, true) },
                ImageMessage: { objectName: "RC:ImgMsg", msgTag: new RongIMLib.MessageTag(true, true) },
                DiscussionNotificationMessage: { objectName: "RC:DizNtf", msgTag: new RongIMLib.MessageTag(true, true) },
                VoiceMessage: { objectName: "RC:VcMsg", msgTag: new RongIMLib.MessageTag(true, true) },
                RichContentMessage: { objectName: "RC:ImgTextMsg", msgTag: new RongIMLib.MessageTag(true, true) },
                HandshakeMessage: { objectName: "", msgTag: new RongIMLib.MessageTag(true, true) },
                UnknownMessage: { objectName: "", msgTag: new RongIMLib.MessageTag(true, true) },
                SuspendMessage: { objectName: "", msgTag: new RongIMLib.MessageTag(true, true) },
                LocationMessage: { objectName: "RC:LBSMsg", msgTag: new RongIMLib.MessageTag(true, true) },
                InformationNotificationMessage: { objectName: "RC:InfoNtf", msgTag: new RongIMLib.MessageTag(true, true) },
                ContactNotificationMessage: { objectName: "RC:ContactNtf", msgTag: new RongIMLib.MessageTag(true, true) },
                ProfileNotificationMessage: { objectName: "RC:ProfileNtf", msgTag: new RongIMLib.MessageTag(true, true) },
                CommandNotificationMessage: { objectName: "RC:CmdNtf", msgTag: new RongIMLib.MessageTag(true, true) },
                CommandMessage: { objectName: "RC:CmdMsg", msgTag: new RongIMLib.MessageTag(false, false) }
            };
            RongIMClient.MessageType = {
                TextMessage: "TextMessage",
                ImageMessage: "ImageMessage",
                DiscussionNotificationMessage: "DiscussionNotificationMessage",
                VoiceMessage: "VoiceMessage",
                RichContentMessage: "RichContentMessage",
                HandshakeMessage: "HandshakeMessage",
                UnknownMessage: "UnknownMessage",
                SuspendMessage: "SuspendMessage",
                LocationMessage: "LocationMessage",
                InformationNotificationMessage: "InformationNotificationMessage",
                ContactNotificationMessage: "ContactNotificationMessage",
                ProfileNotificationMessage: "ProfileNotificationMessage",
                CommandNotificationMessage: "CommandNotificationMessage",
                CommandMessage: "CommandMessage"
            };
        };
        /**
         * 连接服务器，在整个应用全局只需要调用一次，断线后 SDK 会自动重连。
         *
         * @param token     从服务端获取的用户身份令牌（Token）。
         * @param callback  连接回调，返回连接的成功或者失败状态。
         */
        RongIMClient.connect = function (token, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "connect", true);
            RongIMClient.bridge = RongIMLib.Bridge.getInstance();
            RongIMClient._memoryStore.token = token;
            RongIMClient._memoryStore.callback = callback;
            if (!navigator.cookieEnabled) {
                callback.onError(RongIMLib.ErrorCode.COOKIE_ENABLE);
                return;
            }
            RongIMClient.bridge.connect(RongIMClient._memoryStore.appKey, token, {
                onSuccess: function (data) {
                    callback.onSuccess(data);
                },
                onError: function (e) {
                    if (e == RongIMLib.ConnectionState.TOKEN_INCORRECT || !e) {
                        callback.onTokenIncorrect();
                    }
                    else {
                        callback.onError(e);
                    }
                }
            });
            //循环设置监听事件，追加之后清空存放事件数据
            for (var i = 0, len = RongIMClient._memoryStore.listenerList.length; i < len; i++) {
                RongIMClient.bridge["setListener"](RongIMClient._memoryStore.listenerList[i]);
            }
            RongIMClient._memoryStore.listenerList.length = 0;
            return RongIMClient._instance;
        };
        RongIMClient.reconnect = function (callback) {
            RongIMClient.bridge.reconnect(callback);
        };
        /**
         * 注册消息类型，用于注册用户自定义的消息。
         * 内建的消息类型已经注册过，不需要再次注册。
         * 自定义消息声明需放在执行顺序最高的位置（在RongIMClient.init(appkey)之后即可）
         * @param objectName  消息内置名称
         */
        RongIMClient.registerMessageType = function (messageType, objectName, messageTag, messageContent) {
            if (!messageType) {
                throw new Error("messageType can't be empty,postion -> registerMessageType");
            }
            if (!objectName) {
                throw new Error("objectName can't be empty,postion -> registerMessageType");
            }
            if (Object.prototype.toString.call(messageContent) == "[object Array]") {
                var regMsg = RongIMLib.ModelUtil.modleCreate(messageContent);
                RongIMClient.RegisterMessage[messageType] = regMsg;
            }
            else if (Object.prototype.toString.call(messageContent) == "[object Function]" || Object.prototype.toString.call(messageContent) == "[object Object]") {
                if (!messageContent.encode) {
                    throw new Error("encode method has not realized or messageName is undefined-> registerMessageType");
                }
                if (!messageContent.decode) {
                    throw new Error("decode method has not realized -> registerMessageType");
                }
            }
            else {
                throw new Error("The index of 3 parameter was wrong type  must be object or function or array-> registerMessageType");
            }
            RongIMClient.RegisterMessage[messageType].messageName = messageType;
            RongIMClient.MessageType[messageType] = messageType;
            RongIMClient.MessageParams[messageType] = { objectName: objectName, msgTag: messageTag };
            registerMessageTypeMapping[objectName] = messageType;
        };
        /**
         * 设置连接状态变化的监听器。
         *
         * @param listener  连接状态变化的监听器。
         */
        RongIMClient.setConnectionStatusListener = function (listener) {
            if (RongIMClient.bridge) {
                RongIMClient.bridge.setListener(listener);
            }
            else {
                RongIMClient._memoryStore.listenerList.push(listener);
            }
        };
        /**
         * 设置接收消息的监听器。
         *
         * @param listener  接收消息的监听器。
         */
        RongIMClient.setOnReceiveMessageListener = function (listener) {
            if (RongIMClient.bridge) {
                RongIMClient.bridge.setListener(listener);
            }
            else {
                RongIMClient._memoryStore.listenerList.push(listener);
            }
        };
        /**
         * 清理所有连接相关的变量
         */
        RongIMClient.prototype.logout = function () {
            RongIMClient.bridge.disconnect();
            RongIMClient.bridge = null;
        };
        /**
         * 断开连接。
         */
        RongIMClient.prototype.disconnect = function () {
            RongIMClient.bridge.disconnect();
        };
        /**
         * 获取当前连接的状态。
         */
        RongIMClient.prototype.getCurrentConnectionStatus = function () {
            return RongIMLib.Bridge._client.channel.connectionStatus;
        };
        /**
         * 获取当前使用的连接通道。
         */
        RongIMClient.prototype.getConnectionChannel = function () {
            if (RongIMLib.Transportations._TransportType == RongIMLib.Socket.XHR_POLLING) {
                return RongIMLib.ConnectionChannel.XHR_POLLING;
            }
            else if (RongIMLib.Transportations._TransportType == RongIMLib.Socket.WEBSOCKET) {
                return RongIMLib.ConnectionChannel.WEBSOCKET;
            }
        };
        /**
         * 获取当前使用的本地储存提供者。 TODO
         */
        RongIMClient.prototype.getStorageProvider = function () {
            if (RongIMClient._memoryStore.providerType == 1) {
                return "ServerDataProvider";
            }
            else {
                return "OtherDataProvider";
            }
        };
        /**
         * 过滤聊天室消息（拉取最近聊天消息）
         * @param {string[]} msgFilterNames [description]
         */
        RongIMClient.prototype.setFilterMessages = function (msgFilterNames) {
            if (Object.prototype.toString.call(msgFilterNames) == "[object Array]") {
                RongIMClient._memoryStore.filterMessages = msgFilterNames;
            }
        };
        /**
         * 获取当前连接用户的 UserId。
         */
        RongIMClient.prototype.getCurrentUserId = function () {
            return RongIMLib.Bridge._client.userId;
        };
        /**
         * [getCurrentUserInfo 获取当前用户信息]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        // getCurrentUserInfo(callback: ResultCallback<UserInfo>) {
        //     CheckParam.getInstance().check(["object"], "getCurrentUserInfo");
        //     this.getUserInfo(Bridge._client.userId, callback);
        // }
        /**
         * 获得用户信息
         * @param  {string}                   userId [用户Id]
         * @param  {ResultCallback<UserInfo>} callback [回调函数]
         */
        // getUserInfo(userId: string, callback: ResultCallback<UserInfo>) {
        //     CheckParam.getInstance().check(["string", "object"], "getUserInfo");
        //     var user = new Modules.GetUserInfoInput();
        //     user.setNothing(1);
        //     RongIMClient.bridge.queryMsg(5, MessageUtil.ArrayForm(user.toArrayBuffer()), userId, {
        //         onSuccess: function(info: any) {
        //             var userInfo = new UserInfo(info.userId, info.name, info.portraitUri);
        //             callback.onSuccess(userInfo);
        //         },
        //         onError: function(err: any) {
        //             callback.onError(err);
        //         }
        //     }, "GetUserInfoOutput");
        // }
        /**
         * 获取服务器时间与本地时间的差值，单位为毫秒。
         * 计算公式：差值 = 本地时间毫秒数 - 服务器时间毫秒数
         * @param callback  获取的回调，返回差值。
         */
        RongIMClient.prototype.getDeltaTime = function () {
            return RongIMClient._memoryStore.deltaTime;
        };
        // #region Message
        RongIMClient.prototype.clearMessages = function (conversationType, targetId, callback) {
            RongIMClient._dataAccessProvider.clearMessages(conversationType, targetId, callback);
        };
        /**TODO 清楚本地存储的未读消息，目前清空内存中的未读消息
         * [clearMessagesUnreadStatus 清空指定会话未读消息]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [用户id]
         * @param  {ResultCallback<boolean>} callback         [返回值，参数回调]
         */
        RongIMClient.prototype.clearMessagesUnreadStatus = function (conversationType, targetId, callback) {
            RongIMClient._dataAccessProvider.updateMessages(conversationType, targetId, "readStatus", null, callback);
        };
        /**TODO
         * [deleteMessages 删除消息记录。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {number[]}                messageIds       [description]
         * @param  {ResultCallback<boolean>} callback         [description]
         */
        RongIMClient.prototype.deleteMessages = function (conversationType, targetId, messageIds, callback) {
            RongIMClient._dataAccessProvider.removeMessage(conversationType, targetId, messageIds, callback);
        };
        RongIMClient.prototype.sendLocalMessage = function (message, callback) {
            RongIMLib.CheckParam.getInstance().check(["object", "object"], "sendLocalMessage");
            RongIMClient._dataAccessProvider.updateMessage(message);
            this.sendMessage(message.conversationType, message.targetId, message.content, callback);
        };
        /**
         * [sendMessage 发送消息。]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {MessageContent}          messageContent   [消息类型]
         * @param  {SendMessageCallback}     sendCallback     []
         * @param  {ResultCallback<Message>} resultCallback   [返回值，函数回调]
         * @param  {string}                  pushContent      []
         * @param  {string}                  pushData         []
         */
        RongIMClient.prototype.sendMessage = function (conversationType, targetId, messageContent, sendCallback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object", "object"], "sendMessage");
            if (!RongIMLib.Bridge._client.channel) {
                sendCallback.onError(RongIMLib.ErrorCode.RC_NET_UNAVAILABLE, null);
                return;
            }
            if (!RongIMLib.Bridge._client.channel.socket.socket.connected) {
                sendCallback.onError(RongIMLib.ErrorCode.TIMEOUT, null);
                throw new Error("connect is timeout! postion:sendMessage");
            }
            RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, messageContent);
            var modules = new Modules.UpStreamMessage();
            modules.setSessionId(RongIMClient.MessageParams[messageContent.messageName].msgTag.getMessageTag());
            modules.setClassname(RongIMClient.MessageParams[messageContent.messageName].objectName);
            modules.setContent(messageContent.encode());
            var content = modules.toArrayBuffer();
            if (Object.prototype.toString.call(content) == "[object ArrayBuffer]") {
                content = [].slice.call(new Int8Array(content));
            }
            var c = null, me = this, msg = new RongIMLib.Message();
            this.getConversation(conversationType, targetId, {
                onSuccess: function (conver) {
                    c = conver;
                }
            });
            msg.content = messageContent;
            msg.conversationType = conversationType;
            msg.senderUserId = RongIMLib.Bridge._client.userId;
            msg.objectName = RongIMClient.MessageParams[messageContent.messageName].objectName;
            msg.targetId = targetId;
            msg.sentTime = new Date().getTime();
            msg.messageDirection = RongIMLib.MessageDirection.SEND;
            msg.sentStatus = RongIMLib.SentStatus.SENT;
            msg.messageType = messageContent.messageName;
            if (!c) {
                c = me.createConversation(conversationType, targetId, "");
            }
            c.sentTime = new Date().getTime();
            c.sentStatus = RongIMLib.SentStatus.SENDING;
            c.senderUserName = "";
            c.senderUserId = RongIMLib.Bridge._client.userId;
            c.notificationStatus = RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;
            c.latestMessage = msg;
            c.unreadMessageCount = 0;
            c.setTop();
            RongIMClient.bridge.pubMsg(conversationType.valueOf(), content, targetId, {
                onSuccess: function (data) {
                    msg.messageUId = data.messageUId;
                    msg.sentTime = data.timestamp;
                    msg.sentStatus = RongIMLib.SentStatus.SENT;
                    c.latestMessage = msg;
                    sendCallback.onSuccess(msg);
                },
                onError: function (errorCode) {
                    msg.sentStatus = RongIMLib.SentStatus.FAILED;
                    c.latestMessage = msg;
                    sendCallback.onError(errorCode, msg);
                }
            }, null);
        };
        /**
         * [sendStatusMessage description]
         * @param  {MessageContent}          messageContent [description]
         * @param  {SendMessageCallback}     sendCallback   [description]
         * @param  {ResultCallback<Message>} resultCallback [description]
         */
        RongIMClient.prototype.sendStatusMessage = function (messageContent, sendCallback, resultCallback) {
            throw new Error("Not implemented yet");
        };
        /**
         * [sendTextMessage 发送TextMessage快捷方式]
         * @param  {string}                  content        [消息内容]
         * @param  {ResultCallback<Message>} resultCallback [返回值，参数回调]
         */
        RongIMClient.prototype.sendTextMessage = function (conversationType, targetId, content, sendMessageCallback) {
            var msgContent = RongIMLib.TextMessage.obtain(content);
            this.sendMessage(conversationType, targetId, msgContent, sendMessageCallback);
        };
        /**
         * [insertMessage 向本地插入一条消息，不发送到服务器。]
         * @param  {ConversationType}        conversationType [description]
         * @param  {string}                  targetId         [description]
         * @param  {string}                  senderUserId     [description]
         * @param  {MessageContent}          content          [description]
         * @param  {ResultCallback<Message>} callback         [description]
         */
        RongIMClient.prototype.insertMessage = function (conversationType, targetId, senderUserId, content, callback) {
            RongIMClient._dataAccessProvider.addMessage(conversationType, targetId, content, callback);
        };
        /**
         * [getHistoryMessages 拉取历史消息记录。]
         * @param  {ConversationType}          conversationType [会话类型]
         * @param  {string}                    targetId         [用户Id]
         * @param  {number|null}               pullMessageTime  [拉取历史消息起始位置(格式为毫秒数)，可以为null]
         * @param  {number}                    count            [历史消息数量]
         * @param  {ResultCallback<Message[]>} callback         [回调函数]
         * @param  {string}                    objectName       [objectName]
         */
        RongIMClient.prototype.getHistoryMessages = function (conversationType, targetId, timestamp, count, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "number|null|global|object", "number", "object"], "getHistoryMessages");
            if (count > 20) {
                throw new Error("HistroyMessage count must be less than or equal to 20!");
            }
            if (conversationType.valueOf() < 0) {
                throw new Error("ConversationType must be greater than -1");
            }
            RongIMClient._dataAccessProvider.getHistoryMessages(conversationType, targetId, timestamp, count, callback);
        };
        /**
         * [getRemoteHistoryMessages 拉取某个时间戳之前的消息]
         * @param  {ConversationType}          conversationType [description]
         * @param  {string}                    targetId         [description]
         * @param  {Date}                      dateTime         [description]
         * @param  {number}                    count            [description]
         * @param  {ResultCallback<Message[]>} callback         [description]
         */
        RongIMClient.prototype.getRemoteHistoryMessages = function (conversationType, targetId, timestamp, count, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "number|null|global|object", "number", "object"], "getRemoteHistoryMessages");
            if (count > 20) {
                callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
                return;
            }
            if (conversationType.valueOf() < 0) {
                callback.onError(RongIMLib.ErrorCode.RC_CONN_PROTO_VERSION_ERROR);
                return;
            }
            var modules = new Modules.HistoryMessageInput(), self = this;
            modules.setTargetId(targetId);
            if (!timestamp) {
                modules.setDataTime(RongIMClient._memoryStore.lastReadTime.get(conversationType + targetId));
            }
            else {
                modules.setDataTime(timestamp);
            }
            modules.setSize(count);
            RongIMClient.bridge.queryMsg(HistoryMsgType[conversationType], RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), targetId, {
                onSuccess: function (data) {
                    RongIMClient._memoryStore.lastReadTime.set(conversationType + targetId, RongIMLib.MessageUtil.int64ToTimestamp(data.syncTime));
                    var list = data.list.reverse();
                    for (var i = 0, len = list.length; i < len; i++) {
                        list[i] = RongIMLib.MessageUtil.messageParser(list[i]);
                    }
                    callback.onSuccess(list, !!data.hasMsg);
                },
                onError: function () {
                    callback.onSuccess([], false);
                }
            }, "HistoryMessagesOuput");
        };
        /**
         * [hasRemoteUnreadMessages 是否有未接收的消息，jsonp方法]
         * @param  {string}          appkey   [appkey]
         * @param  {string}          token    [token]
         * @param  {ConnectCallback} callback [返回值，参数回调]
         */
        RongIMClient.prototype.hasRemoteUnreadMessages = function (token, callback) {
            var xss = null;
            window.RCCallback = function (x) {
                callback.onSuccess(!!+x.status);
                xss.parentNode.removeChild(xss);
            };
            xss = document.createElement("script");
            xss.src = RongIMLib.MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://api.cn.ronghub.com/message/exist.js?appKey=" + encodeURIComponent(RongIMClient._memoryStore.appKey) + "&token=" + encodeURIComponent(token) + "&callBack=RCCallback&_=" + Date.now();
            document.body.appendChild(xss);
            xss.onerror = function () {
                callback.onError(RongIMLib.ErrorCode.UNKNOWN);
                xss.parentNode.removeChild(xss);
            };
        };
        RongIMClient.prototype.getTotalUnreadCount = function (callback) {
            RongIMClient._dataAccessProvider.getTotalUnreadCount(callback);
        };
        /**
         * [getConversationUnreadCount 指定多种会话类型获取未读消息数]
         * @param  {ResultCallback<number>} callback             [返回值，参数回调。]
         * @param  {ConversationType[]}     ...conversationTypes [会话类型。]
         */
        RongIMClient.prototype.getConversationUnreadCount = function (conversationTypes, callback) {
            RongIMClient._dataAccessProvider.getConversationUnreadCount(conversationTypes, callback);
        };
        /**
         * [getUnreadCount 指定用户、会话类型的未读消息总数。]
         * @param  {ConversationType} conversationType [会话类型]
         * @param  {string}           targetId         [用户Id]
         */
        RongIMClient.prototype.getUnreadCount = function (conversationType, targetId, callback) {
            RongIMClient._dataAccessProvider.getUnreadCount(conversationType, targetId, callback);
        };
        /**
         * 清楚会话未读消息数
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         * @param  {ResultCallback<boolean>} callback         返回值，函数回调
         */
        RongIMClient.prototype.clearUnreadCount = function (conversationType, targetId, callback) {
            RongIMClient._dataAccessProvider.clearUnreadCount(conversationType, targetId, callback);
        };
        RongIMClient.prototype.setMessageExtra = function (messageId, value, callback) {
            RongIMClient._dataAccessProvider.setMessageExtra(messageId, value, callback);
        };
        RongIMClient.prototype.setMessageReceivedStatus = function (messageId, receivedStatus, callback) {
            RongIMClient._dataAccessProvider.setMessageReceivedStatus(messageId, receivedStatus, callback);
        };
        RongIMClient.prototype.setMessageSentStatus = function (messageId, sentStatus, callback) {
            RongIMClient._dataAccessProvider.setMessageSentStatus(messageId, sentStatus, callback);
        };
        // #endregion Message
        // #region TextMessage Draft
        /**
         * clearTextMessageDraft 清除指定会话和消息类型的草稿。
         * @param  {ConversationType}        conversationType 会话类型
         * @param  {string}                  targetId         目标Id
         */
        RongIMClient.prototype.clearTextMessageDraft = function (conversationType, targetId) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "clearTextMessageDraft");
            var key = "darf_" + conversationType + "_" + targetId;
            delete RongIMClient._memoryStore[key];
            return true;
        };
        /**
         * [getTextMessageDraft 获取指定消息和会话的草稿。]
         * @param  {ConversationType}       conversationType [会话类型]
         * @param  {string}                 targetId         [目标Id]
         */
        RongIMClient.prototype.getTextMessageDraft = function (conversationType, targetId) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getTextMessageDraft");
            if (targetId == "" || conversationType < 0) {
                throw new Error("params error : " + RongIMLib.ErrorCode.DRAF_GET_ERROR);
            }
            var key = "darf_" + conversationType + "_" + targetId;
            return RongIMClient._memoryStore[key];
        };
        /**
         * [saveTextMessageDraft description]
         * @param  {ConversationType}        conversationType [会话类型]
         * @param  {string}                  targetId         [目标Id]
         * @param  {string}                  value            [草稿值]
         */
        RongIMClient.prototype.saveTextMessageDraft = function (conversationType, targetId, value) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "string", "object"], "saveTextMessageDraft");
            var key = "darf_" + conversationType + "_" + targetId;
            RongIMClient._memoryStore[key] = value;
            return true;
        };
        // #endregion TextMessage Draft
        // #region Conversation
        RongIMClient.prototype.clearConversations = function (callback) {
            var conversationTypes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                conversationTypes[_i - 1] = arguments[_i];
            }
            if (conversationTypes.length == 0) {
                conversationTypes = [RongIMLib.ConversationType.CHATROOM,
                    RongIMLib.ConversationType.CUSTOMER_SERVICE,
                    RongIMLib.ConversationType.DISCUSSION,
                    RongIMLib.ConversationType.GROUP,
                    RongIMLib.ConversationType.PRIVATE,
                    RongIMLib.ConversationType.SYSTEM,
                    RongIMLib.ConversationType.PUBLIC_SERVICE,
                    RongIMLib.ConversationType.APP_PUBLIC_SERVICE];
            }
            RongIMClient._dataAccessProvider.clearConversations(conversationTypes, callback);
        };
        /**
         * [getConversation 获取指定会话，此方法需在getConversationList之后执行]
         * @param  {ConversationType}             conversationType [会话类型]
         * @param  {string}                       targetId         [目标Id]
         * @param  {ResultCallback<Conversation>} callback         [返回值，函数回调]
         */
        RongIMClient.prototype.getConversation = function (conversationType, targetId, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getConversation");
            var conver = RongIMClient._dataAccessProvider.getConversation(conversationType, targetId);
            callback.onSuccess(conver);
        };
        /**
         * [pottingConversation 组装会话列表]
         * @param {any} tempConver [临时会话]
         * conver_conversationType_targetId_no.
         * msg_conversationType_targetId_no.
         */
        RongIMClient.prototype.pottingConversation = function (tempConver) {
            var conver = RongIMClient._dataAccessProvider.getConversation(tempConver.type, tempConver.userId), self = this, isUseReplace = false;
            if (!conver) {
                conver = new RongIMLib.Conversation();
            }
            else {
                isUseReplace = true;
            }
            conver.conversationType = tempConver.type;
            conver.targetId = tempConver.userId;
            conver.latestMessage = RongIMLib.MessageUtil.messageParser(tempConver.msg);
            conver.latestMessageId = conver.latestMessage.messageId;
            conver.objectName = conver.latestMessage.objectName;
            conver.receivedStatus = conver.latestMessage.receivedStatus;
            conver.receivedTime = conver.latestMessage.receiveTime;
            conver.sentStatus = conver.latestMessage.sentStatus;
            conver.sentTime = conver.latestMessage.sentTime;
            if (!isUseReplace) {
                conver.unreadMessageCount = 0;
            }
            // if (conver.conversationType == ConversationType.PRIVATE) {
            //     self.getUserInfo(tempConver.userId, <ResultCallback<UserInfo>>{
            //         onSuccess: function(info: UserInfo) {
            //             conver.conversationTitle = info.name;
            //             conver.senderUserName = info.name;
            //             conver.senderUserId = info.userId;
            //             conver.senderPortraitUri = info.portraitUri;
            //         },
            //         onError: function(error: ErrorCode) { }
            //     });
            // } else
            if (conver.conversationType == RongIMLib.ConversationType.DISCUSSION) {
                self.getDiscussion(tempConver.userId, {
                    onSuccess: function (info) {
                        conver.conversationTitle = info.name;
                    },
                    onError: function (error) { }
                });
            }
            RongIMClient._dataAccessProvider.addConversation(conver, { onSuccess: function (data) { } });
        };
        RongIMClient.prototype.sortConversationList = function (conversationList) {
            var convers = [];
            for (var i = 0, len = conversationList.length; i < len; i++) {
                if (conversationList[i].isTop) {
                    convers.push(conversationList[i]);
                    conversationList.splice(i, 1);
                    continue;
                }
                for (var j = 0; j < len - i - 1; j++) {
                    if (conversationList[j].sentTime < conversationList[j + 1].sentTime) {
                        var swap = conversationList[j];
                        conversationList[j] = conversationList[j + 1];
                        conversationList[j + 1] = swap;
                    }
                }
            }
            RongIMClient._memoryStore.conversationList = convers.concat(conversationList);
        };
        RongIMClient.prototype.getConversationList = function (callback, conversationTypes) {
            RongIMLib.CheckParam.getInstance().check(["object", "null|array|object|global"], "getConversationList");
            var me = this;
            RongIMClient._dataAccessProvider.getConversationList({
                onSuccess: function (data) {
                    if (conversationTypes) {
                        callback.onSuccess(data);
                    }
                    else {
                        me.sortConversationList(RongIMClient._memoryStore.conversationList);
                        callback.onSuccess(RongIMClient._memoryStore.conversationList);
                    }
                }
            }, conversationTypes);
        };
        RongIMClient.prototype.getRemoteConversationList = function (callback, conversationTypes) {
            RongIMLib.CheckParam.getInstance().check(["object", "null|array|object|global"], "getRemoteConversationList");
            var modules = new Modules.RelationsInput(), self = this;
            modules.setType(1);
            RongIMClient.bridge.queryMsg(26, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                onSuccess: function (list) {
                    if (list.info) {
                        for (var i = 0, len = list.info.length; i < len; i++) {
                            self.pottingConversation(list.info[i]);
                        }
                    }
                    if (conversationTypes) {
                        var convers = [];
                        Array.forEach(conversationTypes, function (converType) {
                            Array.forEach(RongIMClient._memoryStore.conversationList, function (item) {
                                if (item.conversationType == converType) {
                                    convers.push(item);
                                }
                            });
                        });
                        callback.onSuccess(convers);
                    }
                    else {
                        callback.onSuccess(RongIMClient._memoryStore.conversationList);
                    }
                },
                onError: function () {
                    callback.onSuccess([]);
                }
            }, "RelationsOutput");
        };
        /**
         * [createConversation 创建会话。]
         * @param  {number}  conversationType [会话类型]
         * @param  {string}  targetId         [目标Id]
         * @param  {string}  converTitle      [会话标题]
         * @param  {boolean} islocal          [是否同步到服务器，ture：同步，false:不同步]
         */
        RongIMClient.prototype.createConversation = function (conversationType, targetId, converTitle) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "string"], "createConversation");
            var conver = new RongIMLib.Conversation();
            conver.targetId = targetId;
            conver.conversationType = conversationType;
            conver.conversationTitle = converTitle;
            conver.latestMessage = {};
            conver.unreadMessageCount = 0;
            RongIMClient._dataAccessProvider.addConversation(conver, { onSuccess: function (data) { } });
            return conver;
        };
        //TODO 删除本地和服务器、删除本地和服务器分开
        RongIMClient.prototype.removeConversation = function (conversationType, targetId, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "removeConversation");
            var mod = new Modules.RelationsInput();
            mod.setType(conversationType);
            RongIMClient.bridge.queryMsg(27, RongIMLib.MessageUtil.ArrayForm(mod.toArrayBuffer()), targetId, {
                onSuccess: function () {
                    RongIMClient._dataAccessProvider.removeConversation(conversationType, targetId, {
                        onSuccess: function () {
                            callback.onSuccess(true);
                        },
                        onError: function () {
                            callback.onError(RongIMLib.ErrorCode.CONVER_REMOVE_ERROR);
                        }
                    });
                }, onError: function () {
                    callback.onError(RongIMLib.ErrorCode.CONVER_REMOVE_ERROR);
                }
            });
        };
        RongIMClient.prototype.setConversationToTop = function (conversationType, targetId, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "setConversationToTop");
            RongIMClient._dataAccessProvider.setConversationToTop(conversationType, targetId, callback);
        };
        // #endregion Conversation
        // #region Notifications
        /**
         * [getConversationNotificationStatus 获取指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
        RongIMClient.prototype.getConversationNotificationStatus = function (conversationType, targetId, callback) {
            throw new Error("Not implemented yet");
        };
        /**
         * [setConversationNotificationStatus 设置指定用户和会话类型免提醒。]
         * @param  {ConversationType}                               conversationType [会话类型]
         * @param  {string}                                         targetId         [目标Id]
         * @param  {ResultCallback<ConversationNotificationStatus>} callback         [返回值，函数回调]
         */
        RongIMClient.prototype.setConversationNotificationStatus = function (conversationType, targetId, notificationStatus, callback) {
            throw new Error("Not implemented yet");
        };
        /**
         * [getNotificationQuietHours 获取免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.getNotificationQuietHours = function (callback) {
            throw new Error("Not implemented yet");
        };
        /**
         * [removeNotificationQuietHours 移除免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.removeNotificationQuietHours = function (callback) {
            throw new Error("Not implemented yet");
        };
        /**
         * [setNotificationQuietHours 设置免提醒消息时间。]
         * @param  {GetNotificationQuietHoursCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.setNotificationQuietHours = function (startTime, spanMinutes, callback) {
            throw new Error("Not implemented yet");
        };
        // #endregion Notifications
        // #region Discussion
        /**
         * [addMemberToDiscussion   加入讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string[]}          userIdList   [讨论中成员]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        RongIMClient.prototype.addMemberToDiscussion = function (discussionId, userIdList, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "addMemberToDiscussion");
            var modules = new Modules.ChannelInvitationInput();
            modules.setUsers(userIdList);
            RongIMClient.bridge.queryMsg(0, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function () {
                    callback.onSuccess();
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.JOIN_IN_DISCUSSION);
                }
            });
        };
        /**
         * [createDiscussion 创建讨论组]
         * @param  {string}                   name       [讨论组名称]
         * @param  {string[]}                 userIdList [讨论组成员]
         * @param  {CreateDiscussionCallback} callback   [返回值，函数回调]
         */
        RongIMClient.prototype.createDiscussion = function (name, userIdList, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "array", "object"], "createDiscussion");
            var modules = new Modules.CreateDiscussionInput(), self = this;
            modules.setName(name);
            RongIMClient.bridge.queryMsg(1, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                onSuccess: function (discussId) {
                    if (userIdList.length > 0) {
                        self.addMemberToDiscussion(discussId, userIdList, {
                            onSuccess: function () { },
                            onError: function (error) {
                                callback.onError(error);
                            }
                        });
                    }
                    callback.onSuccess(discussId);
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.CREATE_DISCUSSION);
                }
            }, "CreateDiscussionOutput");
        };
        /**
         * [getDiscussion 获取讨论组信息]
         * @param  {string}                     discussionId [讨论组Id]
         * @param  {ResultCallback<Discussion>} callback     [返回值，函数回调]
         */
        RongIMClient.prototype.getDiscussion = function (discussionId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "getDiscussion");
            var modules = new Modules.ChannelInfoInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(4, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback, "ChannelInfoOutput");
        };
        /**
         * [quitDiscussion 退出讨论组]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        RongIMClient.prototype.quitDiscussion = function (discussionId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitDiscussion");
            var modules = new Modules.LeaveChannelInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(7, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
        };
        /**
         * [removeMemberFromDiscussion 将指定成员移除讨论租]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            userId       [被移除的用户Id]
         * @param  {OperationCallback} callback     [返回值，参数回调]
         */
        RongIMClient.prototype.removeMemberFromDiscussion = function (discussionId, userId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "removeMemberFromDiscussion");
            var modules = new Modules.ChannelEvictionInput();
            modules.setUser(userId);
            RongIMClient.bridge.queryMsg(9, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
        };
        /**
         * [setDiscussionInviteStatus 设置讨论组邀请状态]
         * @param  {string}                 discussionId [讨论组Id]
         * @param  {DiscussionInviteStatus} status       [邀请状态]
         * @param  {OperationCallback}      callback     [返回值，函数回调]
         */
        RongIMClient.prototype.setDiscussionInviteStatus = function (discussionId, status, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "setDiscussionInviteStatus");
            var modules = new Modules.ModifyPermissionInput();
            modules.setOpenStatus(status.valueOf());
            RongIMClient.bridge.queryMsg(11, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, {
                onSuccess: function (x) {
                    callback.onSuccess();
                }, onError: function () {
                    callback.onError(RongIMLib.ErrorCode.INVITE_DICUSSION);
                }
            });
        };
        /**
         * [setDiscussionName 设置讨论组名称]
         * @param  {string}            discussionId [讨论组Id]
         * @param  {string}            name         [讨论组名称]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        RongIMClient.prototype.setDiscussionName = function (discussionId, name, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "setDiscussionName");
            var modules = new Modules.RenameChannelInput();
            modules.setName(name);
            RongIMClient.bridge.queryMsg(12, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), discussionId, callback);
        };
        // #endregion Discussion
        // #region Group
        /**
         * [加入群组]
         * @param  {string}            groupId   [群组Id]
         * @param  {string}            groupName [群组名称]
         * @param  {OperationCallback} callback  [返回值，函数回调]
         */
        RongIMClient.prototype.joinGroup = function (groupId, groupName, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "string", "object"], "joinGroup");
            var modules = new Modules.GroupInfo();
            modules.setId(groupId);
            modules.setName(groupName);
            var _mod = new Modules.GroupInput();
            _mod.setGroupInfo([modules]);
            RongIMClient.bridge.queryMsg(6, RongIMLib.MessageUtil.ArrayForm(_mod.toArrayBuffer()), groupId, callback, "GroupOutput");
        };
        /**
         * [退出群组]
         * @param  {string}            groupId  [群组Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.quitGroup = function (groupId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitGroup");
            var modules = new Modules.LeaveChannelInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(8, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), groupId, callback);
        };
        /**
         * [同步群组信息]
         * @param  {Array<Group>}      groups   [群组列表]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.syncGroup = function (groups, callback) {
            RongIMLib.CheckParam.getInstance().check(["array", "object"], "syncGroup");
            //去重操作
            for (var i = 0, part = [], info = [], len = groups.length; i < len; i++) {
                if (part.length === 0 || !(groups[i].id in part)) {
                    part.push(groups[i].id);
                    var groupinfo = new Modules.GroupInfo();
                    groupinfo.setId(groups[i].id);
                    groupinfo.setName(groups[i].name);
                    info.push(groupinfo);
                }
            }
            var modules = new Modules.GroupHashInput();
            modules.setUserId(RongIMLib.Bridge._client.userId);
            modules.setGroupHashCode(md5(part.sort().join("")));
            RongIMClient.bridge.queryMsg(13, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                onSuccess: function (result) {
                    //1为群信息不匹配需要发送给服务器进行同步，0不需要同步
                    if (result === 1) {
                        var val = new Modules.GroupInput();
                        val.setGroupInfo(info);
                        RongIMClient.bridge.queryMsg(20, RongIMLib.MessageUtil.ArrayForm(val.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                            onSuccess: function () {
                                callback.onSuccess();
                            },
                            onError: function () {
                                callback.onError(RongIMLib.ErrorCode.GROUP_MATCH_ERROR);
                            }
                        }, "GroupOutput");
                    }
                    else {
                        callback.onSuccess();
                    }
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.GROUP_SYNC_ERROR);
                }
            }, "GroupHashOutput");
        };
        // #endregion Group
        // #region ChatRoom
        /**
         * [加入聊天室。]
         * @param  {string}            chatroomId   [聊天室Id]
         * @param  {number}            messageCount [拉取消息数量，-1为不拉去消息]
         * @param  {OperationCallback} callback     [返回值，函数回调]
         */
        RongIMClient.prototype.joinChatRoom = function (chatroomId, messageCount, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "number", "object"], "joinChatRoom");
            if (chatroomId != "") {
                RongIMLib.Bridge._client.chatroomId = chatroomId;
            }
            else {
                callback.onError(RongIMLib.ErrorCode.CHATROOM_ID_ISNULL);
                return;
            }
            var e = new Modules.ChrmInput();
            e.setNothing(1);
            RongIMClient.bridge.queryMsg(19, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, {
                onSuccess: function () {
                    callback.onSuccess();
                    var modules = new Modules.ChrmPullMsg();
                    messageCount == 0 && (messageCount = -1);
                    modules.setCount(messageCount);
                    modules.setSyncTime(0);
                    RongIMLib.Bridge._client.queryMessage("chrmPull", RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), chatroomId, 1, {
                        onSuccess: function (collection) {
                            var sync = RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime);
                            RongIMClient._cookieHelper.setItem(RongIMLib.Bridge._client.userId + "CST", sync);
                            var list = collection.list;
                            if (RongIMClient._memoryStore.filterMessages.length > 0) {
                                for (var i = 0, mlen = list.length; i < mlen; i++) {
                                    for (var j = 0, flen = RongIMClient._memoryStore.filterMessages.length; j < flen; j++) {
                                        if (RongIMClient.MessageParams[RongIMClient._memoryStore.filterMessages[j]].objectName != list[i].classname) {
                                            RongIMLib.Bridge._client.handler.onReceived(list[i]);
                                        }
                                    }
                                }
                            }
                            else {
                                for (var i = 0, len = list.length; i < len; i++) {
                                    RongIMLib.Bridge._client.handler.onReceived(list[i]);
                                }
                            }
                        },
                        onError: function (x) {
                            callback.onError(RongIMLib.ErrorCode.CHATROOM_HISMESSAGE_ERROR);
                        }
                    }, "DownStreamMessages");
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.CHARTOOM_JOIN_ERROR);
                }
            }, "ChrmOutput");
        };
        /**
         * [退出聊天室]
         * @param  {string}            chatroomId [聊天室Id]
         * @param  {OperationCallback} callback   [返回值，函数回调]
         */
        RongIMClient.prototype.quitChatRoom = function (chatroomId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "quitChatRoom");
            var e = new Modules.ChrmInput();
            e.setNothing(1);
            RongIMClient.bridge.queryMsg(17, RongIMLib.MessageUtil.ArrayForm(e.toArrayBuffer()), chatroomId, callback, "ChrmOutput");
        };
        // #endregion ChatRoom
        // #region Public Service
        RongIMClient.prototype.getRemotePublicServiceList = function (mpId, conversationType, pullMessageTime, callback) {
            var modules = new Modules.PullMpInput(), self = this;
            if (!pullMessageTime) {
                modules.setTime(0);
            }
            else {
                modules.setTime(RongIMClient._memoryStore.lastReadTime.get(conversationType + RongIMLib.Bridge._client.userId));
            }
            modules.setMpid("");
            RongIMClient.bridge.queryMsg(28, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                onSuccess: function (data) {
                    //TODO 找出最大时间
                    // self.lastReadTime.set(conversationType + targetId, MessageUtil.int64ToTimestamp(data.syncTime));
                    RongIMClient._memoryStore.publicServiceMap.publicServiceList.length = 0;
                    RongIMClient._memoryStore.publicServiceMap.publicServiceList = data;
                },
                onError: function () { }
            }, "PullMpOutput");
        };
        /**
         * [getPublicServiceList ]获取已经的公共账号列表
         * @param  {ResultCallback<PublicServiceProfile[]>} callback [返回值，参数回调]
         */
        RongIMClient.prototype.getPublicServiceList = function (callback) {
            RongIMLib.CheckParam.getInstance().check(["object"], "getPublicServiceList");
            callback.onSuccess(RongIMClient._memoryStore.publicServiceMap.publicServiceList);
        };
        /**
         * [getPublicServiceProfile ]   获取某公共服务信息。
         * @param  {PublicServiceType}                    publicServiceType [公众服务类型。]
         * @param  {string}                               publicServiceId   [公共服务 Id。]
         * @param  {ResultCallback<PublicServiceProfile>} callback          [公共账号信息回调。]
         */
        RongIMClient.prototype.getPublicServiceProfile = function (publicServiceType, publicServiceId, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getPublicServiceProfile");
            var profile = RongIMClient._memoryStore.publicServiceMap.get(publicServiceType, publicServiceId);
            callback.onSuccess(profile);
        };
        /**
         * [pottingPublicSearchType ] 公众好查询类型
         * @param  {number} bussinessType [ 0-all 1-mp 2-mc]
         * @param  {number} searchType    [0-exact 1-fuzzy]
         */
        RongIMClient.prototype.pottingPublicSearchType = function (bussinessType, searchType) {
            var bits = 0;
            if (bussinessType == 0) {
                bits |= 3;
                if (searchType == 0) {
                    bits |= 12;
                }
                else {
                    bits |= 48;
                }
            }
            else if (bussinessType == 1) {
                bits |= 1;
                if (searchType == 0) {
                    bits |= 8;
                }
                else {
                    bits |= 32;
                }
            }
            else {
                bits |= 2;
                if (bussinessType == 0) {
                    bits |= 4;
                }
                else {
                    bits |= 16;
                }
            }
            return bits;
        };
        /**
         * [searchPublicService ]按公众服务类型搜索公众服务。
         * @param  {SearchType}                             searchType [搜索类型枚举。]
         * @param  {string}                                 keywords   [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback   [搜索结果回调。]
         */
        RongIMClient.prototype.searchPublicService = function (searchType, keywords, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "searchPublicService");
            var modules = new Modules.SearchMpInput();
            modules.setType(this.pottingPublicSearchType(0, searchType));
            modules.setId(keywords);
            RongIMClient.bridge.queryMsg(29, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "SearchMpOutput");
        };
        /**
         * [searchPublicServiceByType ]按公众服务类型搜索公众服务。
         * @param  {PublicServiceType}                      publicServiceType [公众服务类型。]
         * @param  {SearchType}                             searchType        [搜索类型枚举。]
         * @param  {string}                                 keywords          [搜索关键字。]
         * @param  {ResultCallback<PublicServiceProfile[]>} callback          [搜索结果回调。]
         */
        RongIMClient.prototype.searchPublicServiceByType = function (publicServiceType, searchType, keywords, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "number", "string", "object"], "searchPublicServiceByType");
            var type = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? 2 : 1;
            var modules = new Modules.SearchMpInput();
            modules.setType(this.pottingPublicSearchType(type, searchType));
            modules.setId(keywords);
            RongIMClient.bridge.queryMsg(29, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "SearchMpOutput");
        };
        /**
         * [subscribePublicService ] 订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [订阅公众号回调。]
         */
        RongIMClient.prototype.subscribePublicService = function (publicServiceType, publicServiceId, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "subscribePublicService");
            var modules = new Modules.MPFollowInput(), me = this, follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcFollow" : "mpFollow";
            modules.setId(publicServiceId);
            RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                onSuccess: function () {
                    me.getRemotePublicServiceList(null, null, null, {
                        onSuccess: function () { },
                        onError: function () { }
                    });
                    callback.onSuccess();
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.SUBSCRIBE_ERROR);
                }
            }, "MPFollowOutput");
        };
        /**
         * [unsubscribePublicService ] 取消订阅公众号。
         * @param  {PublicServiceType} publicServiceType [公众服务类型。]
         * @param  {string}            publicServiceId   [公共服务 Id。]
         * @param  {OperationCallback} callback          [取消订阅公众号回调。]
         */
        RongIMClient.prototype.unsubscribePublicService = function (publicServiceType, publicServiceId, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "unsubscribePublicService");
            var modules = new Modules.MPFollowInput(), me = this, follow = publicServiceType == RongIMLib.ConversationType.APP_PUBLIC_SERVICE ? "mcUnFollow" : "mpUnFollow";
            modules.setId(publicServiceId);
            RongIMClient.bridge.queryMsg(follow, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, {
                onSuccess: function () {
                    RongIMClient._memoryStore.publicServiceMap.remove(publicServiceType, publicServiceId);
                    callback.onSuccess();
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.SUBSCRIBE_ERROR);
                }
            }, "MPFollowOutput");
        };
        // #endregion Public Service
        // #region Blacklist
        /**
         * [加入黑名单]
         * @param  {string}            userId   [将被加入黑名单的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.addToBlacklist = function (userId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "addToBlacklist");
            var modules = new Modules.Add2BlackListInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(21, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function () {
                    callback.onSuccess();
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.BLACK_ADD_ERROR);
                }
            });
        };
        /**
         * [获取黑名单列表]
         * @param  {GetBlacklistCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.getBlacklist = function (callback) {
            RongIMLib.CheckParam.getInstance().check(["object"], "getBlacklist");
            var modules = new Modules.QueryBlackListInput();
            modules.setNothing(1);
            RongIMClient.bridge.queryMsg(23, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "QueryBlackListOutput");
        };
        /**
         * [得到指定人员再黑名单中的状态]
         * @param  {string}                          userId   [description]
         * @param  {ResultCallback<BlacklistStatus>} callback [返回值，函数回调]
         */
        //TODO 如果人员不在黑名单中，获取状态会出现异常
        RongIMClient.prototype.getBlacklistStatus = function (userId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "getBlacklistStatus");
            var modules = new Modules.BlackListStatusInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(24, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function (status) {
                    callback.onSuccess(RongIMLib.BlacklistStatus[status]);
                }, onError: function () {
                    callback.onError(RongIMLib.ErrorCode.BLACK_GETSTATUS_ERROR);
                }
            });
        };
        /**
         * [将指定用户移除黑名单]
         * @param  {string}            userId   [将被移除的用户Id]
         * @param  {OperationCallback} callback [返回值，函数回调]
         */
        RongIMClient.prototype.removeFromBlacklist = function (userId, callback) {
            RongIMLib.CheckParam.getInstance().check(["string", "object"], "removeFromBlacklist");
            var modules = new Modules.RemoveFromBlackListInput();
            modules.setUserId(userId);
            RongIMClient.bridge.queryMsg(22, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), userId, {
                onSuccess: function () {
                    callback.onSuccess();
                },
                onError: function () {
                    callback.onError(RongIMLib.ErrorCode.BLACK_REMOVE_ERROR);
                }
            });
        };
        RongIMClient.prototype.getFileToken = function (fileType, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "object"], "getQnTkn");
            if (!(/(1|2|3)/.test(fileType.toString()))) {
                callback.onError(RongIMLib.ErrorCode.QNTKN_FILETYPE_ERROR);
                return;
            }
            var modules = new Modules.GetQNupTokenInput();
            modules.setType(fileType);
            RongIMClient.bridge.queryMsg(30, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "GetQNupTokenOutput");
        };
        RongIMClient.prototype.getFileUrl = function (fileType, fileName, callback) {
            RongIMLib.CheckParam.getInstance().check(["number", "string", "object"], "getQnTkn");
            if (!(/(1|2|3)/.test(fileType.toString()))) {
                callback.onError(RongIMLib.ErrorCode.QNTKN_FILETYPE_ERROR);
                return;
            }
            var modules = new Modules.GetQNdownloadUrlInput();
            modules.setType(fileType);
            modules.setKey(fileName);
            RongIMClient.bridge.queryMsg(31, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), RongIMLib.Bridge._client.userId, callback, "GetQNdownloadUrlOutput");
        };
        ;
        // #endregion Blacklist
        // #region Real-time Location Service
        RongIMClient.prototype.addRealTimeLocationListener = function (conversationType, targetId, listener) {
            throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.getRealTimeLocation = function (conversationType, targetId) {
            throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.getRealTimeLocationCurrentState = function (conversationType, targetId) {
            throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.getRealTimeLocationParticipants = function (conversationType, targetId) {
            throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.joinRealTimeLocation = function (conversationType, targetId) {
            throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.quitRealTimeLocation = function (conversationType, targetId) {
            throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.startRealTimeLocation = function (conversationType, targetId) {
            throw new Error("Not implemented yet");
        };
        RongIMClient.prototype.updateRealTimeLocationStatus = function (conversationType, targetId, latitude, longitude) {
            throw new Error("Not implemented yet");
        };
        /**
         * [schemeType 选择连接方式]
         * SSL需要设置schemeType为ConnectionChannel.HTTPS
         * HTTP或WS需要设置 schemeType为ConnectionChannel.HTTP(默认)
         * 若改变连接方式此属性必须在RongIMClient.init之前赋值
         * expmale:
         * RongIMLib.RongIMClient.schemeType = RongIMLib.ConnectionChannel.HTTP
         * @type {number}
         */
        RongIMClient.schemeType = RongIMLib.ConnectionChannel.HTTP;
        RongIMClient.RegisterMessage = {};
        RongIMClient._memoryStore = {};
        RongIMClient.isNotPullMsg = false;
        return RongIMClient;
    })();
    RongIMLib.RongIMClient = RongIMClient;
    //兼容AMD CMD
    if ("function" === typeof require && "object" === typeof module && module && module.id && "object" === typeof exports && exports) {
        module.exports = RongIMLib;
    }
    else if ("function" === typeof define && define.amd) {
        define("RongIMLib", ['md5', "http://cdn.ronghub.com/Long.js", "http://cdn.ronghub.com/byteBuffer.js", "http://cdn.ronghub.com/protobuf-min-2.7.js"], function () {
            return RongIMLib;
        });
    }
    else {
        window.RongIMClient = RongIMClient;
    }
})(RongIMLib || (RongIMLib = {}));
//用于连接通道
var RongIMLib;
(function (RongIMLib) {
    (function (Qos) {
        Qos[Qos["AT_MOST_ONCE"] = 0] = "AT_MOST_ONCE";
        Qos[Qos["AT_LEAST_ONCE"] = 1] = "AT_LEAST_ONCE";
        Qos[Qos["EXACTLY_ONCE"] = 2] = "EXACTLY_ONCE";
        Qos[Qos["DEFAULT"] = 3] = "DEFAULT";
    })(RongIMLib.Qos || (RongIMLib.Qos = {}));
    var Qos = RongIMLib.Qos;
    (function (Type) {
        Type[Type["CONNECT"] = 1] = "CONNECT";
        Type[Type["CONNACK"] = 2] = "CONNACK";
        Type[Type["PUBLISH"] = 3] = "PUBLISH";
        Type[Type["PUBACK"] = 4] = "PUBACK";
        Type[Type["QUERY"] = 5] = "QUERY";
        Type[Type["QUERYACK"] = 6] = "QUERYACK";
        Type[Type["QUERYCON"] = 7] = "QUERYCON";
        Type[Type["SUBSCRIBE"] = 8] = "SUBSCRIBE";
        Type[Type["SUBACK"] = 9] = "SUBACK";
        Type[Type["UNSUBSCRIBE"] = 10] = "UNSUBSCRIBE";
        Type[Type["UNSUBACK"] = 11] = "UNSUBACK";
        Type[Type["PINGREQ"] = 12] = "PINGREQ";
        Type[Type["PINGRESP"] = 13] = "PINGRESP";
        Type[Type["DISCONNECT"] = 14] = "DISCONNECT";
    })(RongIMLib.Type || (RongIMLib.Type = {}));
    var Type = RongIMLib.Type;
    var _topic = ["invtDiz", "crDiz", "qnUrl", "userInf", "dizInf", "userInf", "joinGrp", "quitDiz", "exitGrp", "evctDiz",
        ["", "ppMsgP", "pdMsgP", "pgMsgP", "chatMsg", "pcMsgP", "", "pmcMsgN", "pmpMsgN"], "pdOpen", "rename", "uGcmpr", "qnTkn", "destroyChrm",
        "createChrm", "exitChrm", "queryChrm", "joinChrm", "pGrps", "addBlack", "rmBlack", "getBlack", "blackStat", "addRelation", "qryRelation", "delRelation", "pullMp", "schMp", "qnTkn", "qnUrl"];
    var Channel = (function () {
        function Channel(address, cb, self) {
            this.connectionStatus = -1;
            this.url = address.host + "/websocket?appId=" + self.appId + "&token=" + encodeURIComponent(self.token) + "&sdkVer=" + self.sdkVer + "&apiVer=" + self.apiVer;
            this.self = self;
            this.socket = Socket.getInstance().createServer();
            this.socket.connect(this.url, cb);
            //注册状态改变观察者
            if (typeof Channel._ConnectionStatusListener == "object" && "onChanged" in Channel._ConnectionStatusListener) {
                var me = this;
                me.socket.on("StatusChanged", function (code) {
                    //如果参数为DisconnectionStatus，就停止心跳，其他的不停止心跳。每3min连接一次服务器
                    if (code === RongIMLib.ConnectionStatus.DISCONNECTED) {
                        Channel._ConnectionStatusListener.onChanged(RongIMLib.ConnectionStatus.DISCONNECTED);
                        self.clearHeartbeat();
                        return;
                    }
                    me.connectionStatus = code;
                    Channel._ConnectionStatusListener.onChanged(code);
                });
            }
            else {
                throw new Error("setConnectStatusListener:Parameter format is incorrect");
            }
            //注册message观察者
            this.socket.on("message", self.handler.handleMessage);
            //注册断开连接观察者
            this.socket.on("disconnect", function (status) {
                self.channel.socket.fire("StatusChanged", status ? status : 2);
            });
        }
        Channel.prototype.writeAndFlush = function (val) {
            this.socket.send(val);
        };
        Channel.prototype.reconnect = function (callback) {
            RongIMLib.MessageIdHandler.clearMessageId();
            this.socket = this.socket.reconnect();
            if (callback) {
                this.self.reconnectObj = callback;
            }
        };
        Channel.prototype.disconnect = function (status) {
            this.socket.disconnect(status);
        };
        return Channel;
    })();
    RongIMLib.Channel = Channel;
    var Socket = (function () {
        function Socket() {
            this.socket = null;
            this._events = {};
        }
        Socket.getInstance = function () {
            return new Socket();
        };
        Socket.prototype.connect = function (url, cb) {
            if (this.socket) {
                if (url) {
                    this.on("connect", cb || new Function);
                }
                if (url) {
                    this.currentURL = url;
                }
                this.socket.createTransport(url);
            }
            return this;
        };
        Socket.prototype.createServer = function () {
            var transport = this.getTransport(this.checkTransport());
            if (transport === null) {
                throw new Error("the channel was not supported");
            }
            return transport;
        };
        Socket.prototype.getTransport = function (transportType) {
            if (transportType == Socket.XHR_POLLING) {
                this.socket = new RongIMLib.PollingTransportation(this);
            }
            else if (transportType == Socket.WEBSOCKET) {
                this.socket = new RongIMLib.SocketTransportation(this);
            }
            return this;
        };
        Socket.prototype.send = function (data) {
            if (this.socket) {
                if (this.checkTransport() == Socket.WEBSOCKET) {
                    this.socket.send(data);
                }
                else {
                    this.socket.send(this._encode(data));
                }
            }
        };
        Socket.prototype.onMessage = function (data) {
            this.fire("message", data);
        };
        Socket.prototype.disconnect = function (status) {
            this.socket.disconnect();
            this.fire("disconnect", status);
            return this;
        };
        Socket.prototype.reconnect = function () {
            if (this.currentURL) {
                return this.connect(this.currentURL, null);
            }
            else {
                throw new Error("reconnect:no have URL");
            }
        };
        /**
         * [checkTransport 返回通道类型]
         * WEB_XHR_POLLING:是否选择comet方式进行连接
         */
        Socket.prototype.checkTransport = function () {
            if (RongIMLib.RongIMClient._memoryStore.global["WEB_XHR_POLLING"]) {
                RongIMLib.Transportations._TransportType = Socket.XHR_POLLING;
            }
            return RongIMLib.Transportations._TransportType;
        };
        Socket.prototype.fire = function (x, args) {
            if (x in this._events) {
                for (var i = 0, ii = this._events[x].length; i < ii; i++) {
                    this._events[x][i](args);
                }
            }
            return this;
        };
        Socket.prototype.on = function (x, func) {
            if (!(typeof func == "function" && x)) {
                return this;
            }
            if (x in this._events) {
                RongIMLib.MessageUtil.indexOf(this._events, func) == -1 && this._events[x].push(func);
            }
            else {
                this._events[x] = [func];
            }
            return this;
        };
        Socket.prototype.removeEvent = function (x, fn) {
            if (x in this._events) {
                for (var a = 0, l = this._events[x].length; a < l; a++) {
                    if (this._events[x][a] == fn) {
                        this._events[x].splice(a, 1);
                    }
                }
            }
            return this;
        };
        Socket.prototype._encode = function (x) {
            var str = "?messageid=" + x.getMessageId() + "&header=" + x.getHeaderFlag() + "&sessionid=" + RongIMLib.RongIMClient._cookieHelper.getItem(RongIMLib.Navigation.Endpoint.userId + "sId");
            if (!/(PubAckMessage|QueryConMessage)/.test(x._name)) {
                str += "&topic=" + x.getTopic() + "&targetid=" + (x.getTargetId() || "");
            }
            return {
                url: str,
                data: "getData" in x ? x.getData() : ""
            };
        };
        //消息通道常量，所有和通道相关判断均用 XHR_POLLING WEBSOCKET两属性
        Socket.XHR_POLLING = "xhr-polling";
        Socket.WEBSOCKET = "websocket";
        return Socket;
    })();
    RongIMLib.Socket = Socket;
    //连接端消息累
    var Client = (function () {
        function Client(token, appId) {
            this.timeoutMillis = 100000;
            this.timeout_ = 0;
            this.sdkVer = "2.0.6";
            this.apiVer = Math.floor(Math.random() * 1e6);
            this.channel = null;
            this.handler = null;
            this.userId = "";
            this.reconnectObj = {};
            this.heartbeat = 0;
            this.chatroomId = "";
            this.SyncTimeQueue = [];
            this.token = token;
            this.appId = appId;
            this.SyncTimeQueue.state = "complete";
        }
        Client.prototype.resumeTimer = function () {
            if (!this.timeout_) {
                this.timeout_ = setTimeout(function () {
                    if (!this.timeout_) {
                        return;
                    }
                    try {
                        this.channel.disconnect();
                    }
                    catch (e) {
                        throw new Error(e);
                    }
                    clearTimeout(this.timeout_);
                    this.timeout_ = 0;
                    this.channel.reconnect();
                    this.channel.socket.fire("StatusChanged", 5);
                }, this.timeoutMillis);
            }
        };
        Client.prototype.pauseTimer = function () {
            if (this.timeout_) {
                clearTimeout(this.timeout_);
                this.timeout_ = 0;
            }
        };
        Client.prototype.connect = function (_callback) {
            if (RongIMLib.Navigation.Endpoint.host) {
                if (RongIMLib.Transportations._TransportType == Socket.WEBSOCKET) {
                    if (!window.WebSocket) {
                        _callback.onError(RongIMLib.ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION);
                        return;
                    }
                }
                //实例消息处理类
                this.handler = new MessageHandler(this);
                //设置连接回调
                this.handler.setConnectCallback(_callback);
                //实例通道类型
                var me = this;
                this.channel = new Channel(RongIMLib.Navigation.Endpoint, function () {
                    RongIMLib.Transportations._TransportType == Socket.WEBSOCKET && me.keepLive();
                }, this);
                //触发状态改变观察者
                this.channel.socket.fire("StatusChanged", 1);
            }
            else {
                //没有返回地址就手动抛出错误
                _callback.onError(RongIMLib.ConnectionState.NOT_AUTHORIZED);
            }
        };
        Client.prototype.keepLive = function () {
            if (this.heartbeat > 0) {
                clearInterval(this.heartbeat);
            }
            var me = this;
            this.heartbeat = setInterval(function () {
                me.resumeTimer();
                me.channel.writeAndFlush(new RongIMLib.PingReqMessage());
            }, 180000);
        };
        Client.prototype.clearHeartbeat = function () {
            clearInterval(this.heartbeat);
            this.heartbeat = 0;
            this.pauseTimer();
        };
        Client.prototype.publishMessage = function (_topic, _data, _targetId, _callback, _msg) {
            var msgId = RongIMLib.MessageIdHandler.messageIdPlus(this.channel.reconnect);
            if (!msgId) {
                return;
            }
            var msg = new RongIMLib.PublishMessage(_topic, _data, _targetId);
            msg.setMessageId(msgId);
            if (_callback) {
                msg.setQos(Qos.AT_LEAST_ONCE);
                this.handler.putCallback(new RongIMLib.PublishCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), _msg);
            }
            else {
                msg.setQos(Qos.AT_MOST_ONCE);
            }
            this.channel.writeAndFlush(msg);
        };
        Client.prototype.queryMessage = function (_topic, _data, _targetId, _qos, _callback, pbtype) {
            if (_topic == "userInf") {
                if (Client.userInfoMapping[_targetId]) {
                    _callback.onSuccess(Client.userInfoMapping[_targetId]);
                    return;
                }
            }
            var msgId = RongIMLib.MessageIdHandler.messageIdPlus(this.channel.reconnect);
            if (!msgId) {
                return;
            }
            var msg = new RongIMLib.QueryMessage(_topic, _data, _targetId);
            msg.setMessageId(msgId);
            msg.setQos(_qos);
            this.handler.putCallback(new RongIMLib.QueryCallback(_callback.onSuccess, _callback.onError), msg.getMessageId(), pbtype);
            this.channel.writeAndFlush(msg);
        };
        Client.prototype.invoke = function (isPullMsg) {
            var time, modules, str, me = this, target, temp = this.SyncTimeQueue.shift();
            if (temp == undefined) {
                return;
            }
            if (!window["Modules"]) {
                var exitDateTime = new Date().getTime() + 200, countTime = new Date().getTime();
                while (countTime < exitDateTime) {
                    countTime = new Date().getTime();
                }
            }
            this.SyncTimeQueue.state = "pending";
            if (temp.type != 2) {
                //普通消息
                time = RongIMLib.RongIMClient._cookieHelper.getItem(this.userId) || "0";
                modules = new Modules.SyncRequestMsg();
                modules.setIspolling(false);
                str = "pullMsg";
                target = this.userId;
            }
            else {
                //聊天室消息
                time = RongIMLib.RongIMClient._cookieHelper.getItem(this.userId + "CST") || "0";
                modules = new Modules.ChrmPullMsg();
                modules.setCount(0);
                str = "chrmPull";
                if (this.chatroomId === "") {
                    //受到聊天室消息，但是本地没有加入聊天室就手动抛出一个错误
                    throw new Error("syncTime:Received messages of chatroom but was not init");
                }
                target = this.chatroomId;
            }
            //判断服务器给的时间是否消息本地存储的时间，小于的话不执行拉取操作，进行一下步队列操作
            if (temp.pulltime <= time) {
                this.SyncTimeQueue.state = "complete";
                this.invoke();
                return;
            }
            if (isPullMsg) {
                modules.setIsPullSend(true);
            }
            modules.setSyncTime(time);
            //发送queryMessage请求
            this.queryMessage(str, RongIMLib.MessageUtil.ArrayForm(modules.toArrayBuffer()), target, Qos.AT_LEAST_ONCE, {
                onSuccess: function (collection) {
                    me.SyncTimeQueue.state = "complete";
                    me.invoke();
                    var sync = RongIMLib.MessageUtil.int64ToTimestamp(collection.syncTime), symbol = me.userId;
                    if (str == "chrmPull") {
                        symbol += "CST";
                    }
                    //防止因离线消息造成会话列表不为空而无法从服务器拉取会话列表。
                    RongIMLib.RongIMClient._memoryStore.isSyncRemoteConverList = true;
                    //把返回时间戳存入本地，普通消息key为userid，聊天室消息key为userid＋'CST'；value都为服务器返回的时间戳
                    RongIMLib.RongIMClient._cookieHelper.setItem(symbol, sync);
                    //把拉取到的消息逐条传给消息监听器
                    var list = collection.list;
                    for (var i = 0; i < list.length; i++) {
                        Bridge._client.handler.onReceived(list[i]);
                    }
                },
                onError: function () {
                    me.SyncTimeQueue.state = "complete";
                    me.invoke();
                }
            }, "DownStreamMessages");
        };
        Client.prototype.syncTime = function (_type, pullTime) {
            this.SyncTimeQueue.push({ type: _type, pulltime: pullTime });
            //如果队列中只有一个成员并且状态已经完成就执行invoke方法
            if (this.SyncTimeQueue.length == 1 && this.SyncTimeQueue.state == "complete") {
                this.invoke(!_type);
            }
        };
        Client.prototype.__init = function (f) {
            this.channel = new Channel(RongIMLib.Navigation.Endpoint, f, this);
        };
        Client.userInfoMapping = {};
        return Client;
    })();
    RongIMLib.Client = Client;
    //连接类，实现imclient与connect_client的连接
    var Bridge = (function () {
        function Bridge() {
        }
        Bridge.getInstance = function () {
            return new Bridge();
        };
        //连接服务器
        Bridge.prototype.connect = function (appKey, token, callback) {
            if (!window["Modules"]) {
                RongIMLib.RongIMClient._memoryStore.hasModules = false;
                return;
            }
            Bridge._client = new RongIMLib.Navigation().connect(appKey, token, callback);
            return Bridge._client;
        };
        Bridge.prototype.setListener = function (_changer) {
            if (typeof _changer == "object") {
                if (typeof _changer.onChanged == "function") {
                    Channel._ConnectionStatusListener = _changer;
                }
                else if (typeof _changer.onReceived == "function") {
                    Channel._ReceiveMessageListener = _changer;
                }
            }
        };
        Bridge.prototype.reconnect = function (callabck) {
            Bridge._client.channel.reconnect(callabck);
        };
        Bridge.prototype.disconnect = function () {
            Bridge._client.clearHeartbeat();
            Bridge._client.channel.disconnect(2);
        };
        //执行queryMessage请求
        Bridge.prototype.queryMsg = function (topic, content, targetId, callback, pbname) {
            if (typeof topic != "string") {
                topic = _topic[topic];
            }
            Bridge._client.queryMessage(topic, content, targetId, Qos.AT_MOST_ONCE, callback, pbname);
        };
        //发送消息 执行publishMessage 请求
        Bridge.prototype.pubMsg = function (topic, content, targetId, callback, msg) {
            Bridge._client.publishMessage(_topic[10][topic], content, targetId, callback, msg);
        };
        return Bridge;
    })();
    RongIMLib.Bridge = Bridge;
    var MessageHandler = (function () {
        function MessageHandler(client) {
            this.map = {};
            this.connectCallback = null;
            if (!Channel._ReceiveMessageListener) {
                throw new Error("please set onReceiveMessageListener");
            }
            this._onReceived = Channel._ReceiveMessageListener.onReceived;
            this._client = client;
        }
        //把对象推入回调对象队列中，并启动定时器
        MessageHandler.prototype.putCallback = function (callbackObj, _publishMessageId, _msg) {
            var item = {
                Callback: callbackObj,
                Message: _msg
            };
            item.Callback.resumeTimer();
            this.map[_publishMessageId] = item;
        };
        //设置连接回调对象，启动定时器
        MessageHandler.prototype.setConnectCallback = function (_connectCallback) {
            if (_connectCallback) {
                this.connectCallback = new RongIMLib.ConnectAck(_connectCallback.onSuccess, _connectCallback.onError, this._client);
                this.connectCallback.resumeTimer();
            }
        };
        MessageHandler.prototype.onReceived = function (msg) {
            //实体对象
            var entity, 
            //解析完成的消息对象
            message, 
            //会话对象
            con;
            if (msg._name != "PublishMessage") {
                entity = msg;
                RongIMLib.RongIMClient._cookieHelper.setItem(this._client.userId, RongIMLib.MessageUtil.int64ToTimestamp(entity.dataTime));
            }
            else {
                if (msg.getTopic() == "s_ntf") {
                    entity = Modules.NotifyMsg.decode(msg.getData());
                    this._client.syncTime(entity.type, RongIMLib.MessageUtil.int64ToTimestamp(entity.time));
                    return;
                }
                else if (msg.getTopic() == "s_msg") {
                    entity = Modules.DownStreamMessage.decode(msg.getData());
                    RongIMLib.RongIMClient._cookieHelper.setItem(this._client.userId, RongIMLib.MessageUtil.int64ToTimestamp(entity.dataTime));
                }
                else {
                    if (Bridge._client.sdkVer && Bridge._client.sdkVer == "1.0.0") {
                        return;
                    }
                    entity = Modules.UpStreamMessage.decode(msg.getData());
                    var tmpTopic = msg.getTopic();
                    var tmpType = tmpTopic.substr(0, 2);
                    //复用字段，targetId 以此为准
                    entity.groupId = msg.getTargetId();
                    if (tmpType == "pp") {
                        entity.type = 1;
                    }
                    else if (tmpType == "pd") {
                        entity.type = 2;
                    }
                    else if (tmpType == "pg") {
                        entity.type = 3;
                    }
                    else if (tmpType == "chat") {
                        entity.type = 4;
                    }
                    entity.fromUserId = this._client.userId;
                    entity.dataTime = Date.parse(new Date().toString());
                }
                if (!entity) {
                    return;
                }
            }
            //解析实体对象为消息对象。
            message = RongIMLib.MessageUtil.messageParser(entity, this._onReceived);
            if (message === null) {
                return;
            }
            con = RongIMLib.RongIMClient._dataAccessProvider.getConversation(message.conversationType, message.targetId);
            if (!con) {
                con = RongIMLib.RongIMClient.getInstance().createConversation(message.conversationType, message.targetId, "");
            }
            //根据messageTag判断是否进行消息数累加
            // if (/ISCOUNTED/.test(message.getMessageTag())) {
            if (con.conversationType != 0) {
                con.unreadMessageCount = con.unreadMessageCount + 1;
                if (RongIMLib.MessageUtil.supportLargeStorage()) {
                    var count = RongIMLib.LocalStorageProvider.getInstance().getItem("cu" + Bridge._client.userId + con.conversationType + con.targetId); // 与本地存储会话合并
                    RongIMLib.LocalStorageProvider.getInstance().setItem("cu" + Bridge._client.userId + con.conversationType + message.targetId, Number(count) + 1);
                }
            }
            // }
            con.receivedTime = new Date().getTime();
            con.receivedStatus = RongIMLib.ReceivedStatus.READ;
            con.senderUserId = message.sendUserId;
            con.notificationStatus = RongIMLib.ConversationNotificationStatus.DO_NOT_DISTURB;
            con.latestMessageId = message.messageId;
            con.latestMessage = message;
            con.setTop();
            this._onReceived(message);
        };
        MessageHandler.prototype.handleMessage = function (msg) {
            if (!msg) {
                return;
            }
            switch (msg._name) {
                case "ConnAckMessage":
                    Bridge._client.handler.connectCallback.process(msg.getStatus(), msg.getUserId(), msg.getTimestamp());
                    break;
                case "PublishMessage":
                    if (msg.getQos() != 0) {
                        Bridge._client.channel.writeAndFlush(new RongIMLib.PubAckMessage(msg.getMessageId()));
                    }
                    //如果是PublishMessage就把该对象给onReceived方法执行处理
                    Bridge._client.handler.onReceived(msg);
                    break;
                case "QueryAckMessage":
                    if (msg.getQos() != 0) {
                        Bridge._client.channel.writeAndFlush(new RongIMLib.QueryConMessage(msg.getMessageId()));
                    }
                    var temp = Bridge._client.handler.map[msg.getMessageId()];
                    if (temp) {
                        //执行回调操作
                        temp.Callback.process(msg.getStatus(), msg.getData(), msg.getDate(), temp.Message);
                        delete Bridge._client.handler.map[msg.getMessageId()];
                    }
                    break;
                case "PubAckMessage":
                    var item = Bridge._client.handler.map[msg.getMessageId()];
                    if (item) {
                        //执行回调操作
                        item.Callback.process(msg.getStatus() || 0, msg.getMessageUId(), msg.getTimestamp(), item.Message);
                        delete Bridge._client.handler.map[msg.getMessageId()];
                    }
                    break;
                case "PingRespMessage":
                    Bridge._client.pauseTimer();
                    break;
                case "DisconnectMessage":
                    Bridge._client.channel.disconnect(msg.getStatus());
                    break;
                default:
            }
        };
        return MessageHandler;
    })();
    RongIMLib.MessageHandler = MessageHandler;
})(RongIMLib || (RongIMLib = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../dts/helper.d.ts"/>
var RongIMLib;
(function (RongIMLib) {
    var MessageCallback = (function () {
        function MessageCallback(error) {
            this.timeout = null;
            this.onError = null;
            if (error && typeof error == "number") {
                this.timeoutMillis = error;
            }
            else {
                this.timeoutMillis = 6000;
                this.onError = error;
            }
        }
        MessageCallback.prototype.resumeTimer = function () {
            var me = this;
            if (this.timeoutMillis > 0 && !this.timeout) {
                this.timeout = setTimeout(function () {
                    me.readTimeOut(true);
                }, this.timeoutMillis);
            }
        };
        MessageCallback.prototype.pauseTimer = function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        };
        MessageCallback.prototype.readTimeOut = function (isTimeout) {
            if (isTimeout && this.onError) {
                this.onError(RongIMLib.ErrorCode.TIMEOUT);
            }
            else {
                this.pauseTimer();
            }
        };
        return MessageCallback;
    })();
    RongIMLib.MessageCallback = MessageCallback;
    var CallbackMapping = (function () {
        function CallbackMapping() {
            this.publicServiceList = [];
        }
        CallbackMapping.getInstance = function () {
            return new CallbackMapping();
        };
        CallbackMapping.prototype.pottingProfile = function (item) {
            var temp;
            this.profile = new RongIMLib.PublicServiceProfile();
            temp = JSON.parse(item.extra);
            this.profile.isGlobal = temp.isGlobal;
            this.profile.introduction = temp.introduction;
            this.profile.menu = temp.menu;
            this.profile.hasFollowed = temp.follow;
            this.profile.publicServiceId = item.mpid;
            this.profile.name = item.name;
            this.profile.portraitUri = item.portraitUrl;
            this.profile.conversationType = item.type == "mc" ? RongIMLib.ConversationType.APP_PUBLIC_SERVICE : RongIMLib.ConversationType.PUBLIC_SERVICE;
            this.publicServiceList.push(this.profile);
        };
        CallbackMapping.prototype.mapping = function (entity, tag) {
            switch (tag) {
                case "GetUserInfoOutput":
                    var userInfo = new RongIMLib.UserInfo(entity.userId, entity.userName, entity.userPortrait);
                    return userInfo;
                case "GetQNupTokenOutput":
                    return {
                        deadline: RongIMLib.MessageUtil.int64ToTimestamp(entity.deadline),
                        token: entity.token
                    };
                case "GetQNdownloadUrlOutput":
                    return {
                        downloadUrl: entity.downloadUrl
                    };
                case "CreateDiscussionOutput":
                    return entity.id;
                case "ChannelInfoOutput":
                    var disInfo = new RongIMLib.Discussion();
                    disInfo.creatorId = entity.adminUserId;
                    disInfo.id = entity.channelId;
                    disInfo.memberIdList = entity.firstTenUserIds;
                    disInfo.name = entity.channelName;
                    disInfo.isOpen = entity.openStatus;
                    return disInfo;
                case "GroupHashOutput":
                    return entity.result;
                case "QueryBlackListOutput":
                    return entity.userIds;
                case "SearchMpOutput":
                case "PullMpOutput":
                    if (entity.info) {
                        var self = this;
                        Array.forEach(entity.info, function (item) {
                            setTimeout(self.pottingProfile(item), 100);
                        });
                    }
                    return this.publicServiceList;
                default:
                    return entity;
            }
        };
        return CallbackMapping;
    })();
    RongIMLib.CallbackMapping = CallbackMapping;
    var PublishCallback = (function (_super) {
        __extends(PublishCallback, _super);
        function PublishCallback(_cb, _timeout) {
            _super.call(this, _timeout);
            this._cb = _cb;
            this._timeout = _timeout;
        }
        PublishCallback.prototype.process = function (_status, messageUId, timestamp, _msg) {
            this.readTimeOut();
            if (_status == 0) {
                if (_msg) {
                    _msg.setSentStatus = _status;
                }
                this._cb({ messageUId: messageUId, timestamp: timestamp });
            }
            else {
                this._timeout(_status);
            }
        };
        PublishCallback.prototype.readTimeOut = function (x) {
            MessageCallback.prototype.readTimeOut.call(this, x);
        };
        return PublishCallback;
    })(MessageCallback);
    RongIMLib.PublishCallback = PublishCallback;
    var QueryCallback = (function (_super) {
        __extends(QueryCallback, _super);
        function QueryCallback(_cb, _timeout) {
            _super.call(this, _timeout);
            this._cb = _cb;
            this._timeout = _timeout;
        }
        QueryCallback.prototype.process = function (status, data, serverTime, pbtype) {
            this.readTimeOut();
            if (pbtype && data && status == 0) {
                try {
                    data = CallbackMapping.getInstance().mapping(Modules[pbtype].decode(data), pbtype);
                }
                catch (e) {
                    this._timeout(RongIMLib.ErrorCode.UNKNOWN);
                    return;
                }
                if ("GetUserInfoOutput" == pbtype) {
                    //pb类型为GetUserInfoOutput的话就把data放入userinfo缓存队列
                    RongIMLib.Client.userInfoMapping[data.userId] = data;
                }
                this._cb(data);
            }
            else {
                status > 0 ? this._timeout(status) : this._cb(status);
            }
        };
        QueryCallback.prototype.readTimeOut = function (x) {
            MessageCallback.prototype.readTimeOut.call(this, x);
        };
        return QueryCallback;
    })(MessageCallback);
    RongIMLib.QueryCallback = QueryCallback;
    var ConnectAck = (function (_super) {
        __extends(ConnectAck, _super);
        function ConnectAck(_cb, _timeout, client) {
            _super.call(this, _timeout);
            this._client = client;
            this._cb = _cb;
            this._timeout = _timeout;
        }
        ConnectAck.prototype.process = function (status, userId, timestamp) {
            this.readTimeOut();
            if (status == 0) {
                var naviStr = RongIMLib.RongIMClient._cookieHelper.getItem(RongIMLib.RongIMClient._cookieHelper.getItemKey("navi"));
                var naviKey = RongIMLib.RongIMClient._cookieHelper.getItemKey("navi");
                var arr = decodeURIComponent(naviStr).split(",");
                if (!arr[1]) {
                    naviStr = encodeURIComponent(naviStr) + userId;
                    RongIMLib.RongIMClient._cookieHelper.setItem(naviKey, naviStr);
                }
                this._client.userId = userId;
                if (!RongIMLib.RongIMClient.isNotPullMsg) {
                    this._client.syncTime();
                }
                if (this._client.reconnectObj.onSuccess) {
                    this._client.reconnectObj.onSuccess(userId);
                    delete this._client.reconnectObj.onSuccess;
                }
                else {
                    var me = this;
                    setTimeout(function () { me._cb(userId); }, 500);
                }
                RongIMLib.Bridge._client.channel.socket.fire("StatusChanged", 0);
                RongIMLib.RongIMClient._memoryStore.deltaTime = new Date().getTime() - timestamp;
            }
            else if (status == 6) {
                //重定向
                var x = {};
                new RongIMLib.Navigation().getServerEndpoint(this._client.token, this._client.appId, function () {
                    this._client.clearHeartbeat();
                    new RongIMLib.Client(this._client.token, this._client.appId).__init.call(x, function () {
                        RongIMLib.Transportations._TransportType == "websocket" && this._client.keepLive();
                    });
                    this._client.channel.socket.fire("StatusChanged", 2);
                }, this._timeout, false);
            }
            else {
                if (this._client.reconnectObj.onError) {
                    this._client.reconnectObj.onError(status);
                    delete this._client.reconnectObj.onError;
                }
                else {
                    this._timeout(status);
                }
            }
        };
        ConnectAck.prototype.readTimeOut = function (x) {
            MessageCallback.prototype.readTimeOut.call(this, x);
        };
        return ConnectAck;
    })(MessageCallback);
    RongIMLib.ConnectAck = ConnectAck;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var Navigation = (function () {
        function Navigation() {
            window.getServerEndpoint = function (x) {
                //把导航返回的server字段赋值给CookieHelper._host，因为flash widget需要使用 decodeURIComponent
                RongIMLib.RongIMClient._cookieHelper._host = Navigation.Endpoint.host = x["server"];
                //替换本地存储的导航信息
                var temp = RongIMLib.RongIMClient._cookieHelper.getItemKey("navi");
                temp !== null && RongIMLib.RongIMClient._cookieHelper.removeItem(temp);
                RongIMLib.RongIMClient._cookieHelper.setItem("navi" + md5(RongIMLib.Bridge._client.token).slice(8, 16), x["server"] + "," + (x.userId || ""));
            };
        }
        Navigation.prototype.connect = function (appId, token, callback) {
            var oldAppId = RongIMLib.RongIMClient._cookieHelper.getItem("appId");
            //如果appid和本地存储的不一样，清空所有本地存储数据
            if (oldAppId && oldAppId != appId) {
                RongIMLib.RongIMClient._cookieHelper.clearItem();
                RongIMLib.RongIMClient._cookieHelper.setItem("appId", appId);
            }
            if (!oldAppId) {
                RongIMLib.RongIMClient._cookieHelper.setItem("appId", appId);
            }
            var client = new RongIMLib.Client(token, appId);
            var me = this;
            this.getServerEndpoint(token, appId, function () {
                client.connect(callback);
            }, callback.onError, true);
            return client;
        };
        Navigation.prototype.getServerEndpoint = function (_token, _appId, _onsuccess, _onerror, unignore) {
            if (unignore) {
                //根据token生成MD5截取8-16下标的数据与本地存储的导航信息进行比对
                //如果信息和上次的通道类型都一样，不执行navi请求，用本地存储的导航信息连接服务器
                var naviStr = md5(_token).slice(8, 16), _old = RongIMLib.RongIMClient._cookieHelper.getItem(RongIMLib.RongIMClient._cookieHelper.getItemKey("navi")), _new = RongIMLib.RongIMClient._cookieHelper.getItem("navi" + naviStr);
                if (_old == _new && _new !== null && RongIMLib.RongIMClient._cookieHelper.getItem("rongSDK") == RongIMLib.Transportations._TransportType) {
                    var obj = decodeURIComponent(_old).split(",");
                    setTimeout(function () {
                        RongIMLib.RongIMClient._cookieHelper._host = Navigation.Endpoint.host = obj[0];
                        Navigation.Endpoint.userId = obj[1];
                        _onsuccess();
                    }, 500);
                    return;
                }
            }
            //导航信息，切换Url对象的key进行线上线下测试操作
            var Url = {
                //测试环境
                "navUrl-Debug": RongIMLib.MessageUtil.schemeArrs[RongIMLib.RongIMClient.schemeType][0] + "://119.254.111.49:9100/",
                //线上环境
                "navUrl-Release": RongIMLib.MessageUtil.schemeArrs[RongIMLib.RongIMClient.schemeType][0] + "://nav.cn.ronghub.com/"
            }, xss = document.createElement("script");
            //进行jsonp请求
            xss.src = Url["navUrl-Release"] + (RongIMLib.RongIMClient._memoryStore.global["WEB_XHR_POLLING"] ? "cometnavi.js" : "navi.js") + "?appId=" + _appId + "&token=" + encodeURIComponent(_token) + "&" + "callBack=getServerEndpoint&t=" + (new Date).getTime();
            document.body.appendChild(xss);
            xss.onerror = function () {
                _onerror(RongIMLib.ConnectionState.TOKEN_INCORRECT);
            };
            if ("onload" in xss) {
                xss.onload = _onsuccess;
            }
            else {
                xss.onreadystatechange = function () {
                    xss.readyState == "loaded" && _onsuccess();
                };
            }
        };
        Navigation.Endpoint = new Object;
        return Navigation;
    })();
    RongIMLib.Navigation = Navigation;
})(RongIMLib || (RongIMLib = {}));
// TODO: 统一变量、方法等命名规范
var RongIMLib;
(function (RongIMLib) {
    /**
     * 消息基类
     */
    var BaseMessage = (function () {
        function BaseMessage(arg) {
            this._name = "BaseMessage";
            this.lengthSize = 0;
            if (arg instanceof RongIMLib.Header) {
                this._header = arg;
            }
            else {
                this._header = new RongIMLib.Header(arg, false, RongIMLib.Qos.AT_MOST_ONCE, false);
            }
        }
        BaseMessage.prototype.read = function (In, length) {
            this.readMessage(In, length);
        };
        BaseMessage.prototype.write = function (Out) {
            var binaryHelper = new RongIMLib.BinaryHelper();
            var out = binaryHelper.convertStream(Out);
            this._headerCode = this.getHeaderFlag();
            out.write(this._headerCode);
            this.writeMessage(out);
            return out;
        };
        BaseMessage.prototype.getHeaderFlag = function () {
            return this._header.encode();
        };
        BaseMessage.prototype.getLengthSize = function () {
            return this.lengthSize;
        };
        BaseMessage.prototype.toBytes = function () {
            return this.write([]).getBytesArray();
        };
        BaseMessage.prototype.isRetained = function () {
            return this._header.retain;
        };
        BaseMessage.prototype.setRetained = function (retain) {
            this._header.retain = retain;
        };
        BaseMessage.prototype.setQos = function (qos) {
            this._header.qos = Object.prototype.toString.call(qos) == "[object Object]" ? qos : RongIMLib.Qos[qos];
        };
        BaseMessage.prototype.setDup = function (dup) {
            this._header.dup = dup;
        };
        BaseMessage.prototype.isDup = function () {
            return this._header.dup;
        };
        BaseMessage.prototype.getType = function () {
            return this._header.type;
        };
        BaseMessage.prototype.getQos = function () {
            return this._header.qos;
        };
        BaseMessage.prototype.messageLength = function () {
            return 0;
        };
        BaseMessage.prototype.writeMessage = function (out) { };
        BaseMessage.prototype.readMessage = function (In, length) { };
        BaseMessage.prototype.init = function (args) {
            var valName, nana, me = this;
            for (nana in args) {
                if (!args.hasOwnProperty(nana)) {
                    continue;
                }
                valName = nana.replace(/^\w/, function (x) {
                    var tt = x.charCodeAt(0);
                    return "set" + (tt >= 0x61 ? String.fromCharCode(tt & ~32) : x);
                });
                if (valName in me) {
                    if (nana == "status") {
                        me[valName](disconnectStatus[args[nana]] ? disconnectStatus[args[nana]] : args[nana]);
                    }
                    else {
                        me[valName](args[nana]);
                    }
                }
            }
        };
        return BaseMessage;
    })();
    RongIMLib.BaseMessage = BaseMessage;
    /**
     *连接消息类型
     */
    var ConnectMessage = (function (_super) {
        __extends(ConnectMessage, _super);
        function ConnectMessage(header) {
            _super.call(this, arguments.length == 0 || arguments.length == 3 ? RongIMLib.Type.CONNECT : arguments[0]);
            this._name = "ConnectMessage";
            this.CONNECT_HEADER_SIZE = 12;
            this.protocolId = "RCloud";
            this.binaryHelper = new RongIMLib.BinaryHelper();
            this.protocolVersion = 3;
            switch (arguments.length) {
                case 0:
                case 1:
                case 3:
                    if (!arguments[0] || arguments[0].length > 64) {
                        throw new Error("ConnectMessage:Client Id cannot be null and must be at most 64 characters long: " + arguments[0]);
                    }
                    this.clientId = arguments[0];
                    this.cleanSession = arguments[1];
                    this.keepAlive = arguments[2];
                    break;
            }
        }
        ConnectMessage.prototype.messageLength = function () {
            var payloadSize = this.binaryHelper.toMQttString(this.clientId).length;
            payloadSize += this.binaryHelper.toMQttString(this.willTopic).length;
            payloadSize += this.binaryHelper.toMQttString(this.will).length;
            payloadSize += this.binaryHelper.toMQttString(this.appId).length;
            payloadSize += this.binaryHelper.toMQttString(this.token).length;
            return payloadSize + this.CONNECT_HEADER_SIZE;
        };
        ConnectMessage.prototype.readMessage = function (stream) {
            this.protocolId = stream.readUTF();
            this.protocolVersion = stream.readByte();
            var cFlags = stream.readByte();
            this.hasAppId = (cFlags & 128) > 0;
            this.hasToken = (cFlags & 64) > 0;
            this.retainWill = (cFlags & 32) > 0;
            this.willQos = cFlags >> 3 & 3;
            this.hasWill = (cFlags & 4) > 0;
            this.cleanSession = (cFlags & 32) > 0;
            this.keepAlive = stream.read() * 256 + stream.read();
            this.clientId = stream.readUTF();
            if (this.hasWill) {
                this.willTopic = stream.readUTF();
                this.will = stream.readUTF();
            }
            if (this.hasAppId) {
                try {
                    this.appId = stream.readUTF();
                }
                catch (ex) {
                    throw new Error(ex);
                }
            }
            if (this.hasToken) {
                try {
                    this.token = stream.readUTF();
                }
                catch (ex) {
                    throw new Error(ex);
                }
            }
            return stream;
        };
        ConnectMessage.prototype.writeMessage = function (out) {
            var stream = this.binaryHelper.convertStream(out);
            stream.writeUTF(this.protocolId);
            stream.write(this.protocolVersion);
            var flags = this.cleanSession ? 2 : 0;
            flags |= this.hasWill ? 4 : 0;
            flags |= this.willQos ? this.willQos >> 3 : 0;
            flags |= this.retainWill ? 32 : 0;
            flags |= this.hasToken ? 64 : 0;
            flags |= this.hasAppId ? 128 : 0;
            stream.write(flags);
            stream.writeChar(this.keepAlive);
            stream.writeUTF(this.clientId);
            if (this.hasWill) {
                stream.writeUTF(this.willTopic);
                stream.writeUTF(this.will);
            }
            if (this.hasAppId) {
                stream.writeUTF(this.appId);
            }
            if (this.hasToken) {
                stream.writeUTF(this.token);
            }
            return stream;
        };
        return ConnectMessage;
    })(BaseMessage);
    RongIMLib.ConnectMessage = ConnectMessage;
    /**
     *连接应答类型
     */
    var ConnAckMessage = (function (_super) {
        __extends(ConnAckMessage, _super);
        function ConnAckMessage(header) {
            _super.call(this, arguments.length == 0 ? RongIMLib.Type.CONNACK : arguments.length == 1 ? arguments[0] instanceof RongIMLib.Header ? arguments[0] : RongIMLib.Type.CONNACK : null);
            this._name = "ConnAckMessage";
            this.MESSAGE_LENGTH = 2;
            this.binaryHelper = new RongIMLib.BinaryHelper();
            var me = this;
            switch (arguments.length) {
                case 0:
                case 1:
                    if (!(arguments[0] instanceof RongIMLib.Header)) {
                        if (arguments[0] in RongIMLib.ConnectionState) {
                            if (arguments[0] == null) {
                                throw new Error("ConnAckMessage:The status of ConnAskMessage can't be null");
                            }
                            me.setStatus(arguments[0]);
                        }
                    }
                    break;
            }
        }
        ;
        ConnAckMessage.prototype.messageLength = function () {
            var length = this.MESSAGE_LENGTH;
            if (this.userId) {
                length += this.binaryHelper.toMQttString(this.userId).length;
            }
            return length;
        };
        ;
        ConnAckMessage.prototype.readMessage = function (_in, msglength) {
            _in.read();
            var result = +_in.read();
            if (result >= 0 && result <= 9) {
                this.setStatus(result);
            }
            else {
                throw new Error("Unsupported CONNACK code:" + result);
            }
            if (msglength > this.MESSAGE_LENGTH) {
                this.setUserId(_in.readUTF());
                var sessionId = _in.readUTF();
                var timestamp = _in.readLong();
                this.setTimestamp(timestamp);
            }
        };
        ;
        ConnAckMessage.prototype.writeMessage = function (out) {
            var stream = this.binaryHelper.convertStream(out);
            stream.write(128);
            switch (+status) {
                case 0:
                case 1:
                case 2:
                case 5:
                case 6:
                    stream.write(+status);
                    break;
                case 3:
                case 4:
                    stream.write(3);
                    break;
                default:
                    throw new Error("Unsupported CONNACK code:" + status);
            }
            if (this.userId) {
                stream.writeUTF(this.userId);
            }
            return stream;
        };
        ;
        ConnAckMessage.prototype.setStatus = function (x) {
            this.status = x;
        };
        ;
        ConnAckMessage.prototype.setUserId = function (_userId) {
            this.userId = _userId;
        };
        ;
        ConnAckMessage.prototype.getStatus = function () {
            return this.status;
        };
        ;
        ConnAckMessage.prototype.getUserId = function () {
            return this.userId;
        };
        ;
        ConnAckMessage.prototype.setTimestamp = function (x) {
            this.timestrap = x;
        };
        ;
        ConnAckMessage.prototype.getTimestamp = function () {
            return this.timestrap;
        };
        return ConnAckMessage;
    })(BaseMessage);
    RongIMLib.ConnAckMessage = ConnAckMessage;
    /**
     *断开消息类型
     */
    var DisconnectMessage = (function (_super) {
        __extends(DisconnectMessage, _super);
        function DisconnectMessage(header) {
            _super.call(this, header instanceof RongIMLib.Header ? header : RongIMLib.Type.DISCONNECT);
            this._name = "DisconnectMessage";
            this.MESSAGE_LENGTH = 2;
            this.binaryHelper = new RongIMLib.BinaryHelper();
            if (!(header instanceof RongIMLib.Header)) {
                if (header in RongIMLib.ConnectionStatus) {
                    this.status = header;
                }
            }
        }
        DisconnectMessage.prototype.messageLength = function () {
            return this.MESSAGE_LENGTH;
        };
        DisconnectMessage.prototype.readMessage = function (_in) {
            _in.read();
            var result = +_in.read();
            if (result >= 0 && result <= 5) {
                this.setStatus(disconnectStatus[result] ? disconnectStatus[result] : result);
            }
            else {
                throw new Error("Unsupported CONNACK code:" + result);
            }
        };
        DisconnectMessage.prototype.writeMessage = function (Out) {
            var out = this.binaryHelper.convertStream(Out);
            out.write(0);
            if (+status >= 1 && +status <= 3) {
                out.write((+status) - 1);
            }
            else {
                throw new Error("Unsupported CONNACK code:" + status);
            }
        };
        DisconnectMessage.prototype.setStatus = function (x) {
            this.status = x;
        };
        ;
        DisconnectMessage.prototype.getStatus = function () {
            return this.status;
        };
        ;
        return DisconnectMessage;
    })(BaseMessage);
    RongIMLib.DisconnectMessage = DisconnectMessage;
    /**
     *请求消息信令
     */
    var PingReqMessage = (function (_super) {
        __extends(PingReqMessage, _super);
        function PingReqMessage(header) {
            _super.call(this, (header && header instanceof RongIMLib.Header) ? header : RongIMLib.Type.PINGREQ);
            this._name = "PingReqMessage";
        }
        return PingReqMessage;
    })(BaseMessage);
    RongIMLib.PingReqMessage = PingReqMessage;
    /**
     *响应消息信令
     */
    var PingRespMessage = (function (_super) {
        __extends(PingRespMessage, _super);
        function PingRespMessage(header) {
            _super.call(this, (header && header instanceof RongIMLib.Header) ? header : RongIMLib.Type.PINGRESP);
            this._name = "PingRespMessage";
        }
        return PingRespMessage;
    })(BaseMessage);
    RongIMLib.PingRespMessage = PingRespMessage;
    /**
     *封装MesssageId
     */
    var RetryableMessage = (function (_super) {
        __extends(RetryableMessage, _super);
        function RetryableMessage(argu) {
            _super.call(this, argu);
            this._name = "RetryableMessage";
            this.binaryHelper = new RongIMLib.BinaryHelper();
        }
        RetryableMessage.prototype.messageLength = function () {
            return 2;
        };
        RetryableMessage.prototype.writeMessage = function (Out) {
            var out = this.binaryHelper.convertStream(Out), Id = this.getMessageId(), lsb = Id & 255, msb = (Id & 65280) >> 8;
            out.write(msb);
            out.write(lsb);
            return out;
        };
        RetryableMessage.prototype.readMessage = function (_in, msgLength) {
            var msgId = _in.read() * 256 + _in.read();
            this.setMessageId(parseInt(msgId, 10));
        };
        RetryableMessage.prototype.setMessageId = function (_messageId) {
            this.messageId = _messageId;
        };
        RetryableMessage.prototype.getMessageId = function () {
            return this.messageId;
        };
        return RetryableMessage;
    })(BaseMessage);
    RongIMLib.RetryableMessage = RetryableMessage;
    /**
     *发送消息应答（双向）
     *qos为1必须给出应答（所有消息类型一样）
     */
    var PubAckMessage = (function (_super) {
        __extends(PubAckMessage, _super);
        function PubAckMessage(header) {
            _super.call(this, (header instanceof RongIMLib.Header) ? header : RongIMLib.Type.PUBACK);
            this.msgLen = 2;
            this.date = 0;
            this.millisecond = 0;
            this.timestamp = 0;
            this.binaryHelper = new RongIMLib.BinaryHelper();
            this._name = "PubAckMessage";
            if (!(header instanceof RongIMLib.Header)) {
                _super.prototype.setMessageId.call(this, header);
            }
        }
        PubAckMessage.prototype.messageLength = function () {
            return this.msgLen;
        };
        PubAckMessage.prototype.writeMessage = function (Out) {
            var out = this.binaryHelper.convertStream(Out);
            RetryableMessage.prototype.writeMessage.call(this, out);
        };
        PubAckMessage.prototype.readMessage = function (_in, msgLength) {
            RetryableMessage.prototype.readMessage.call(this, _in);
            this.date = _in.readInt();
            this.status = _in.read() * 256 + _in.read();
            this.millisecond = _in.read() * 256 + _in.read();
            this.timestamp = this.date * 1000 + this.millisecond;
            this.messageUId = _in.readUTF();
        };
        PubAckMessage.prototype.setStatus = function (x) {
            this.status = x;
        };
        PubAckMessage.prototype.setTimestamp = function (timestamp) {
            this.timestamp = timestamp;
        };
        PubAckMessage.prototype.setMessageUId = function (messageUId) {
            this.messageUId = messageUId;
        };
        PubAckMessage.prototype.getStatus = function () {
            return this.status;
        };
        PubAckMessage.prototype.getDate = function () {
            return this.date;
        };
        PubAckMessage.prototype.getTimestamp = function () {
            return this.timestamp;
        };
        PubAckMessage.prototype.getMessageUId = function () {
            return this.messageUId;
        };
        return PubAckMessage;
    })(RetryableMessage);
    RongIMLib.PubAckMessage = PubAckMessage;
    /**
     *发布消息
     */
    var PublishMessage = (function (_super) {
        __extends(PublishMessage, _super);
        function PublishMessage(header, two, three) {
            _super.call(this, (arguments.length == 1 && header instanceof RongIMLib.Header) ? header : arguments.length == 3 ? RongIMLib.Type.PUBLISH : 0);
            this._name = "PublishMessage";
            this.binaryHelper = new RongIMLib.BinaryHelper();
            if (arguments.length == 3) {
                this.topic = header;
                this.targetId = three;
                this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;
            }
        }
        PublishMessage.prototype.messageLength = function () {
            var length = 10;
            length += this.binaryHelper.toMQttString(this.topic).length;
            length += this.binaryHelper.toMQttString(this.targetId).length;
            length += this.data.length;
            return length;
        };
        PublishMessage.prototype.writeMessage = function (Out) {
            var out = this.binaryHelper.convertStream(Out);
            out.writeUTF(this.topic);
            out.writeUTF(this.targetId);
            RetryableMessage.prototype.writeMessage.apply(this, arguments);
            out.write(this.data);
        };
        ;
        PublishMessage.prototype.readMessage = function (_in, msgLength) {
            var pos = 6;
            this.date = _in.readInt();
            this.topic = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.topic).length;
            this.targetId = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.targetId).length;
            RetryableMessage.prototype.readMessage.apply(this, arguments);
            this.data = new Array(msgLength - pos);
            this.data = _in.read(this.data);
        };
        ;
        PublishMessage.prototype.setTopic = function (x) {
            this.topic = x;
        };
        PublishMessage.prototype.setData = function (x) {
            this.data = x;
        };
        PublishMessage.prototype.setTargetId = function (x) {
            this.targetId = x;
        };
        PublishMessage.prototype.setDate = function (x) {
            this.date = x;
        };
        PublishMessage.prototype.getTopic = function () {
            return this.topic;
        };
        PublishMessage.prototype.getData = function () {
            return this.data;
        };
        PublishMessage.prototype.getTargetId = function () {
            return this.targetId;
        };
        PublishMessage.prototype.getDate = function () {
            return this.date;
        };
        return PublishMessage;
    })(RetryableMessage);
    RongIMLib.PublishMessage = PublishMessage;
    /**
     *请求查询
     */
    var QueryMessage = (function (_super) {
        __extends(QueryMessage, _super);
        function QueryMessage(header, two, three) {
            _super.call(this, header instanceof RongIMLib.Header ? header : arguments.length == 3 ? RongIMLib.Type.QUERY : null);
            this.binaryHelper = new RongIMLib.BinaryHelper();
            this._name = "QueryMessage";
            if (arguments.length == 3) {
                this.data = typeof two == "string" ? this.binaryHelper.toMQttString(two) : two;
                this.topic = header;
                this.targetId = three;
            }
        }
        QueryMessage.prototype.messageLength = function () {
            var length = 0;
            length += this.binaryHelper.toMQttString(this.topic).length;
            length += this.binaryHelper.toMQttString(this.targetId).length;
            length += 2;
            length += this.data.length;
            return length;
        };
        QueryMessage.prototype.writeMessage = function (Out) {
            var out = this.binaryHelper.convertStream(Out);
            out.writeUTF(this.topic);
            out.writeUTF(this.targetId);
            RetryableMessage.prototype.writeMessage.call(this, out);
            out.write(this.data);
        };
        QueryMessage.prototype.readMessage = function (_in, msgLength) {
            var pos = 0;
            this.topic = _in.readUTF();
            this.targetId = _in.readUTF();
            pos += this.binaryHelper.toMQttString(this.topic).length;
            pos += this.binaryHelper.toMQttString(this.targetId).length;
            this.readMessage.apply(this, arguments);
            pos += 2;
            this.data = new Array(msgLength - pos);
            _in.read(this.data);
        };
        QueryMessage.prototype.setTopic = function (x) {
            this.topic = x;
        };
        QueryMessage.prototype.setData = function (x) {
            this.data = x;
        };
        QueryMessage.prototype.setTargetId = function (x) {
            this.targetId = x;
        };
        QueryMessage.prototype.getTopic = function () {
            return this.topic;
        };
        QueryMessage.prototype.getData = function () {
            return this.data;
        };
        QueryMessage.prototype.getTargetId = function () {
            return this.targetId;
        };
        return QueryMessage;
    })(RetryableMessage);
    RongIMLib.QueryMessage = QueryMessage;
    /**
     *请求查询确认
     */
    var QueryConMessage = (function (_super) {
        __extends(QueryConMessage, _super);
        function QueryConMessage(messageId) {
            _super.call(this, (messageId instanceof RongIMLib.Header) ? messageId : RongIMLib.Type.QUERYCON);
            this._name = "QueryConMessage";
            if (!(messageId instanceof RongIMLib.Header)) {
                _super.prototype.setMessageId.call(this, messageId);
            }
        }
        return QueryConMessage;
    })(RetryableMessage);
    RongIMLib.QueryConMessage = QueryConMessage;
    /**
     *请求查询应答
     */
    var QueryAckMessage = (function (_super) {
        __extends(QueryAckMessage, _super);
        function QueryAckMessage(header) {
            _super.call(this, header);
            this._name = "QueryAckMessage";
            this.binaryHelper = new RongIMLib.BinaryHelper();
        }
        QueryAckMessage.prototype.readMessage = function (In, msgLength) {
            RetryableMessage.prototype.readMessage.call(this, In);
            this.date = In.readInt();
            this.setStatus(In.read() * 256 + In.read());
            if (msgLength > 0) {
                this.data = new Array(msgLength - 8);
                this.data = In.read(this.data);
            }
        };
        QueryAckMessage.prototype.getData = function () {
            return this.data;
        };
        QueryAckMessage.prototype.getStatus = function () {
            return this.status;
        };
        QueryAckMessage.prototype.getDate = function () {
            return this.date;
        };
        QueryAckMessage.prototype.setDate = function (x) {
            this.date = x;
        };
        QueryAckMessage.prototype.setStatus = function (x) {
            this.status = x;
        };
        QueryAckMessage.prototype.setData = function (x) {
            this.data = x;
        };
        return QueryAckMessage;
    })(RetryableMessage);
    RongIMLib.QueryAckMessage = QueryAckMessage;
})(RongIMLib || (RongIMLib = {}));
/// <reference path="../../dts/helper.d.ts"/>
var RongIMLib;
(function (RongIMLib) {
    /**
     * 把消息对象写入流中
     * 发送消息时用到
     */
    var MessageOutputStream = (function () {
        function MessageOutputStream(_out) {
            var binaryHelper = new RongIMLib.BinaryHelper();
            this.out = binaryHelper.convertStream(_out);
        }
        MessageOutputStream.prototype.writeMessage = function (msg) {
            if (msg instanceof RongIMLib.BaseMessage) {
                msg.write(this.out);
            }
        };
        return MessageOutputStream;
    })();
    RongIMLib.MessageOutputStream = MessageOutputStream;
    /**
     * 流转换为消息对象
     * 服务器返回消息时用到
     */
    var MessageInputStream = (function () {
        function MessageInputStream(In, isPolling) {
            if (!isPolling) {
                var _in = new RongIMLib.BinaryHelper().convertStream(In);
                this.flags = _in.readByte();
                this._in = _in;
            }
            else {
                this.flags = In["headerCode"];
            }
            this.header = new RongIMLib.Header(this.flags);
            this.isPolling = isPolling;
            this.In = In;
        }
        MessageInputStream.prototype.readMessage = function () {
            switch (this.header.getType()) {
                case 1:
                    this.msg = new RongIMLib.ConnectMessage(this.header);
                    break;
                case 2:
                    this.msg = new RongIMLib.ConnAckMessage(this.header);
                    break;
                case 3:
                    this.msg = new RongIMLib.PublishMessage(this.header);
                    break;
                case 4:
                    this.msg = new RongIMLib.PubAckMessage(this.header);
                    break;
                case 5:
                    this.msg = new RongIMLib.QueryMessage(this.header);
                    break;
                case 6:
                    this.msg = new RongIMLib.QueryAckMessage(this.header);
                    break;
                case 7:
                    this.msg = new RongIMLib.QueryConMessage(this.header);
                    break;
                case 9:
                case 11:
                case 13:
                    this.msg = new RongIMLib.PingRespMessage(this.header);
                    break;
                case 8:
                case 10:
                case 12:
                    this.msg = new RongIMLib.PingReqMessage(this.header);
                    break;
                case 14:
                    this.msg = new RongIMLib.DisconnectMessage(this.header);
                    break;
                default:
                    throw new Error("No support for deserializing " + this.header.getType() + " messages");
            }
            if (this.isPolling) {
                this.msg.init(this.In);
            }
            else {
                this.msg.read(this._in, this.In.length - 1);
            }
            return this.msg;
        };
        return MessageInputStream;
    })();
    RongIMLib.MessageInputStream = MessageInputStream;
    var Header = (function () {
        function Header(_type, _retain, _qos, _dup) {
            this.retain = false;
            this.qos = RongIMLib.Qos.AT_LEAST_ONCE;
            this.dup = false;
            if (_type && +_type == _type && arguments.length == 1) {
                this.retain = (_type & 1) > 0;
                this.qos = (_type & 6) >> 1;
                this.dup = (_type & 8) > 0;
                this.type = (_type >> 4) & 15;
            }
            else {
                this.type = _type;
                this.retain = _retain;
                this.qos = _qos;
                this.dup = _dup;
            }
        }
        Header.prototype.getType = function () {
            return this.type;
        };
        Header.prototype.encode = function () {
            var me = this;
            switch (this.qos) {
                case RongIMLib.Qos[0]:
                    me.qos = RongIMLib.Qos.AT_MOST_ONCE;
                    break;
                case RongIMLib.Qos[1]:
                    me.qos = RongIMLib.Qos.AT_LEAST_ONCE;
                    break;
                case RongIMLib.Qos[2]:
                    me.qos = RongIMLib.Qos.EXACTLY_ONCE;
                    break;
                case RongIMLib.Qos[3]:
                    me.qos = RongIMLib.Qos.DEFAULT;
                    break;
            }
            var _byte = (this.type << 4);
            _byte |= this.retain ? 1 : 0;
            _byte |= this.qos << 1;
            _byte |= this.dup ? 8 : 0;
            return _byte;
        };
        Header.prototype.toString = function () {
            return "Header [type=" + this.type + ",retain=" + this.retain + ",qos=" + this.qos + ",dup=" + this.dup + "]";
        };
        return Header;
    })();
    RongIMLib.Header = Header;
    /**
     * 二进制帮助对象
     */
    var BinaryHelper = (function () {
        function BinaryHelper() {
        }
        BinaryHelper.prototype.writeUTF = function (str, isGetBytes) {
            var back = [], byteSize = 0;
            for (var i = 0, len = str.length; i < len; i++) {
                var code = str.charCodeAt(i);
                if (code >= 0 && code <= 127) {
                    byteSize += 1;
                    back.push(code);
                }
                else if (code >= 128 && code <= 2047) {
                    byteSize += 2;
                    back.push((192 | (31 & (code >> 6))));
                    back.push((128 | (63 & code)));
                }
                else if (code >= 2048 && code <= 65535) {
                    byteSize += 3;
                    back.push((224 | (15 & (code >> 12))));
                    back.push((128 | (63 & (code >> 6))));
                    back.push((128 | (63 & code)));
                }
            }
            for (var i = 0, len = back.length; i < len; i++) {
                if (back[i] > 255) {
                    back[i] &= 255;
                }
            }
            if (isGetBytes) {
                return back;
            }
            if (byteSize <= 255) {
                return [0, byteSize].concat(back);
            }
            else {
                return [byteSize >> 8, byteSize & 255].concat(back);
            }
        };
        BinaryHelper.prototype.readUTF = function (arr) {
            if (Object.prototype.toString.call(arr) == "[object String]") {
                return arr;
            }
            var UTF = "", _arr = arr;
            for (var i = 0, len = _arr.length; i < len; i++) {
                if (_arr[i] < 0) {
                    _arr[i] += 256;
                }
                ;
                var one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
                if (v && one.length == 8) {
                    var bytesLength = v[0].length, store = _arr[i].toString(2).slice(7 - bytesLength);
                    for (var st = 1; st < bytesLength; st++) {
                        store += _arr[st + i].toString(2).slice(2);
                    }
                    UTF += String.fromCharCode(parseInt(store, 2));
                    i += bytesLength - 1;
                }
                else {
                    UTF += String.fromCharCode(_arr[i]);
                }
            }
            return UTF;
        };
        /**
         * [convertStream 将参数x转化为RongIMStream对象]
         * @param  {any}    x [参数]
         */
        BinaryHelper.prototype.convertStream = function (x) {
            if (x instanceof RongIMStream) {
                return x;
            }
            else {
                return new RongIMStream(x);
            }
        };
        BinaryHelper.prototype.toMQttString = function (str) {
            return this.writeUTF(str);
        };
        return BinaryHelper;
    })();
    RongIMLib.BinaryHelper = BinaryHelper;
    var RongIMStream = (function () {
        function RongIMStream(arr) {
            //当前流执行的起始位置
            this.position = 0;
            //当前流写入的多少字节
            this.writen = 0;
            this.poolLen = 0;
            this.binaryHelper = new BinaryHelper();
            this.pool = arr;
            this.poolLen = arr.length;
        }
        RongIMStream.prototype.check = function () {
            return this.position >= this.pool.length;
        };
        RongIMStream.prototype.readInt = function () {
            if (this.check()) {
                return -1;
            }
            var end = "";
            for (var i = 0; i < 4; i++) {
                var t = this.pool[this.position++].toString(16);
                if (t.length == 1 && i > 1) {
                    t = "0" + t;
                }
                end += t.toString(16);
            }
            return parseInt(end, 16);
        };
        RongIMStream.prototype.readLong = function () {
            if (this.check()) {
                return -1;
            }
            var end = "";
            for (var i = 0; i < 8; i++) {
                var t = this.pool[this.position++].toString(16);
                if (t.length == 1 && i > 1) {
                    t = "0" + t;
                }
                end += t;
            }
            return parseInt(end, 16);
        };
        RongIMStream.prototype.readTimestamp = function () {
            if (this.check()) {
                return -1;
            }
            var end = "";
            for (var i = 0; i < 8; i++) {
                end += this.pool[this.position++].toString(16);
            }
            end = end.substring(2, 8);
            return parseInt(end, 16);
        };
        RongIMStream.prototype.readUTF = function () {
            if (this.check()) {
                return -1;
            }
            var big = (this.readByte() << 8) | this.readByte();
            return this.binaryHelper.readUTF(this.pool.subarray(this.position, this.position += big));
        };
        RongIMStream.prototype.readByte = function () {
            if (this.check()) {
                return -1;
            }
            var val = this.pool[this.position++];
            if (val > 255) {
                val &= 255;
            }
            return val;
        };
        RongIMStream.prototype.read = function (bytesArray) {
            if (bytesArray) {
                return this.pool.subarray(this.position, this.poolLen);
            }
            else {
                return this.readByte();
            }
        };
        RongIMStream.prototype.write = function (_byte) {
            var b = _byte;
            if (Object.prototype.toString.call(b).toLowerCase() == "[object array]") {
                [].push.apply(this.pool, b);
            }
            else {
                if (+b == b) {
                    if (b > 255) {
                        b &= 255;
                    }
                    this.pool.push(b);
                    this.writen++;
                }
            }
            return b;
        };
        RongIMStream.prototype.writeChar = function (v) {
            if (+v != v) {
                throw new Error("writeChar:arguments type is error");
            }
            this.write(v >> 8 & 255);
            this.write(v & 255);
            this.writen += 2;
        };
        RongIMStream.prototype.writeUTF = function (str) {
            var val = this.binaryHelper.writeUTF(str);
            [].push.apply(this.pool, val);
            this.writen += val.length;
        };
        RongIMStream.prototype.toComplements = function () {
            var _tPool = this.pool;
            for (var i = 0; i < this.poolLen; i++) {
                if (_tPool[i] > 128) {
                    _tPool[i] -= 256;
                }
            }
            return _tPool;
        };
        RongIMStream.prototype.getBytesArray = function (isCom) {
            if (isCom) {
                return this.toComplements();
            }
            return this.pool;
        };
        return RongIMStream;
    })();
    RongIMLib.RongIMStream = RongIMStream;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var SocketTransportation = (function () {
        /**
         * [constructor]
         * @param  {string} url [连接地址：包含token、version]
         */
        function SocketTransportation(_socket) {
            //连接状态 true:已连接 false:未连接
            this.connected = false;
            //是否关闭： true:已关闭 false：未关闭
            this.isClose = false;
            //存放消息队列的临时变量
            this.queue = [];
            this.empty = new Function;
            this._socket = _socket;
            return this;
        }
        /**
         * [createTransport 创建WebScoket对象]
         */
        SocketTransportation.prototype.createTransport = function (url, method) {
            if (!url) {
                throw new Error("URL can't be empty");
            }
            ;
            this.url = url;
            this.socket = new WebSocket(RongIMLib.MessageUtil.schemeArrs[RongIMLib.RongIMClient.schemeType][1] + "://" + url);
            this.socket.binaryType = "arraybuffer";
            this.addEvent();
            return this.socket;
        };
        /**
         * [send 传送消息流]
         * @param  {ArrayBuffer} data [二进制消息流]
         */
        SocketTransportation.prototype.send = function (data) {
            if (!this.connected && !this.isClose) {
                //当通道不可用时，加入消息队列
                this.queue.push(data);
                return;
            }
            if (this.isClose) {
                throw new Error("The Connection is closed,Please open the Connection!!!");
            }
            var stream = new RongIMLib.RongIMStream([]), msg = new RongIMLib.MessageOutputStream(stream);
            msg.writeMessage(data);
            var val = stream.getBytesArray(true);
            var binary = new Int8Array(val);
            this.socket.send(binary.buffer);
            return this;
        };
        /**
         * [onData 通道返回数据时调用的方法，用来想上层传递服务器返回的二进制消息流]
         * @param  {ArrayBuffer}    data [二进制消息流]
         */
        SocketTransportation.prototype.onData = function (data) {
            if (RongIMLib.MessageUtil.isArray(data)) {
                this._socket.onMessage(new RongIMLib.MessageInputStream(data).readMessage());
            }
            else {
                this._socket.onMessage(new RongIMLib.MessageInputStream(RongIMLib.MessageUtil.ArrayFormInput(data)).readMessage());
            }
            return "";
        };
        /**
         * [onClose 通道关闭时触发的方法]
         */
        SocketTransportation.prototype.onClose = function () {
            this.isClose = true;
            this.socket = this.empty;
            this._socket.disconnect(RongIMLib.ConnectionStatus.DISCONNECTED);
        };
        /**
         * [onError 通道报错时触发的方法]
         * @param {any} error [抛出异常]
         */
        SocketTransportation.prototype.onError = function (error) {
            throw new Error(error);
        };
        /**
         * [addEvent 为通道绑定事件]
         */
        SocketTransportation.prototype.addEvent = function () {
            var self = this;
            self.socket.onopen = function () {
                self.connected = true;
                self.isClose = false;
                //通道可以用后，调用发送队列方法，把所有等得发送的消息发出
                self.doQueue();
                self._socket.fire("connect");
            };
            self.socket.onmessage = function (ev) {
                //判断数据是不是字符串，如果是字符串那么就是flash传过来的。
                if (typeof ev.data == "string") {
                    self.onData(ev.data.split(","));
                }
                else {
                    self.onData(ev.data);
                }
            };
            self.socket.onerror = function (ev) {
                self.onError(ev);
            };
            self.socket.onclose = function () {
                self.onClose();
            };
        };
        /**
         * [doQueue 消息队列，把队列中消息发出]
         */
        SocketTransportation.prototype.doQueue = function () {
            var self = this;
            for (var i = 0, len = self.queue.length; i < len; i++) {
                self.send(self.queue[i]);
            }
        };
        /**
         * [disconnect 断开连接]
         */
        SocketTransportation.prototype.disconnect = function () {
            if (this.socket.readyState) {
                this.isClose = true;
                this.socket.close();
            }
        };
        /**
         * [reconnect 重新连接]
         */
        SocketTransportation.prototype.reconnect = function () {
            this.disconnect();
            this.createTransport(this.url);
        };
        return SocketTransportation;
    })();
    RongIMLib.SocketTransportation = SocketTransportation;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var PollingTransportation = (function () {
        function PollingTransportation(socket) {
            this.empty = new Function;
            this.connected = false;
            this.queue = [];
            this.socket = socket;
            return this;
        }
        PollingTransportation.prototype.createTransport = function (url, method) {
            if (!url) {
                throw new Error("Url is empty,Please check it!");
            }
            ;
            this.url = url;
            var sid = RongIMLib.RongIMClient._cookieHelper.getItem(RongIMLib.Navigation.Endpoint.userId + "sId"), me = this;
            if (sid) {
                setTimeout(function () {
                    me.onSuccess("{\"status\":0,\"userId\":\"" + RongIMLib.Navigation.Endpoint.userId + "\",\"headerCode\":32,\"messageId\":0,\"sessionid\":\"" + sid + "\"}");
                    me.connected = true;
                }, 500);
                return this;
            }
            this.getRequest(url, true);
            return this;
        };
        PollingTransportation.prototype.requestFactory = function (url, method, multipart) {
            var reqest = this.XmlHttpRequest();
            if (multipart) {
                reqest.multipart = true;
            }
            reqest.open(method || "GET", RongIMLib.MessageUtil.schemeArrs[RongIMLib.RongIMClient.schemeType][0] + "://" + url);
            if (method == "POST" && "setRequestHeader" in reqest) {
                reqest.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            }
            return reqest;
        };
        PollingTransportation.prototype.getRequest = function (url, isconnect) {
            var me = this;
            me.xhr = this.requestFactory(url, "GET");
            if ("onload" in me.xhr) {
                me.xhr.onload = function () {
                    me.xhr.onload = me.empty;
                    if (this.responseText == "lost params") {
                        me.onError();
                    }
                    else {
                        me.onSuccess(this.responseText, isconnect);
                    }
                };
                me.xhr.onerror = function () {
                    me.disconnect();
                };
            }
            else {
                me.xhr.onreadystatechange = function () {
                    if (me.xhr.readyState == 4) {
                        me.xhr.onreadystatechange = me.empty;
                        if (/^(200|202)$/.test(me.xhr.status)) {
                            me.onSuccess(me.xhr.responseText, isconnect);
                        }
                        else if (/^(400|403)$/.test(me.xhr.status)) {
                            me.onError();
                        }
                        else {
                            me.disconnect();
                        }
                    }
                };
            }
            me.xhr.send();
        };
        /**
         * [send 发送消息，Method:POST]
         * queue 为消息队列，待通道可用发送所有等待消息
         * @param  {string} data [需要传入comet格式数据，此处只负责通讯通道，数据转换在外层处理]
         */
        PollingTransportation.prototype.send = function (data) {
            var me = this;
            this.sendxhr = this.requestFactory(RongIMLib.Navigation.Endpoint.host + "/websocket" + data.url, "POST");
            if ("onload" in me.sendxhr) {
                me.sendxhr.onload = function () {
                    me.sendxhr.onload = me.empty;
                    me.onData(me.sendxhr.responseText);
                };
                me.sendxhr.onerror = function () {
                    me.sendxhr.onerror = me.empty;
                };
            }
            else {
                me.sendxhr.onreadystatechange = function () {
                    if (me.sendxhr.readyState == 4) {
                        this.onreadystatechange = this.empty;
                        if (/^(202|200)$/.test(me.sendxhr.status)) {
                            me.onData(me.sendxhr.responseText);
                        }
                    }
                };
            }
            me.sendxhr.send(JSON.stringify(data.data));
        };
        PollingTransportation.prototype.onData = function (data, header) {
            if (!data || data == "lost params") {
                return;
            }
            var self = this, val = JSON.parse(data);
            if (val.userId) {
                RongIMLib.Navigation.Endpoint.userId = val.userId;
            }
            if (header) {
                RongIMLib.RongIMClient._cookieHelper.setItem(RongIMLib.Navigation.Endpoint.userId + "sId", header);
            }
            if (!RongIMLib.MessageUtil.isArray(val)) {
                val = [val];
            }
            Array.forEach(val, function (m) {
                self.socket.fire("message", new RongIMLib.MessageInputStream(m, true).readMessage());
            });
            return "";
        };
        PollingTransportation.prototype.XmlHttpRequest = function () {
            var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest(), self = this;
            if ("undefined" != typeof XMLHttpRequest && hasCORS) {
                return new XMLHttpRequest();
            }
            else if ("undefined" != typeof XDomainRequest) {
                return new XDomainRequest();
            }
            else {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        };
        PollingTransportation.prototype.onClose = function () {
            if (this.xhr) {
                if (this.xhr.onload) {
                    this.xhr.onreadystatechange = this.xhr.onload = this.empty;
                }
                else {
                    this.xhr.onreadystatechange = this.empty;
                }
                this.xhr.abort();
                this.xhr = null;
            }
            if (this.sendxhr) {
                if (this.sendxhr.onload) {
                    this.sendxhr.onreadystatechange = this.sendxhr.onload = this.empty;
                }
                else {
                    this.sendxhr.onreadystatechange = this.empty;
                }
                this.sendxhr.abort();
                this.sendxhr = null;
            }
        };
        PollingTransportation.prototype.disconnect = function () {
            RongIMLib.RongIMClient._cookieHelper.removeItem(RongIMLib.Navigation.Endpoint.userId + "sId");
            this.onClose();
        };
        PollingTransportation.prototype.reconnect = function () {
            this.disconnect();
            this.createTransport(this.url);
        };
        PollingTransportation.prototype.onSuccess = function (responseText, isconnect) {
            var txt = responseText.match(/"sessionid":"\S+?(?=")/);
            this.onData(responseText, txt ? txt[0].slice(13) : 0);
            if (/"headerCode":-32,/.test(responseText)) {
                RongIMLib.RongIMClient._cookieHelper.removeItem(RongIMLib.Navigation.Endpoint.userId + "sId");
                return;
            }
            this.getRequest(RongIMLib.Navigation.Endpoint.host + "/pullmsg.js?sessionid=" + RongIMLib.RongIMClient._cookieHelper.getItem(RongIMLib.Navigation.Endpoint.userId + "sId"));
            this.connected = true;
            isconnect && this.socket.fire("connect");
        };
        PollingTransportation.prototype.onError = function () {
            RongIMLib.RongIMClient._cookieHelper.removeItem(RongIMLib.Navigation.Endpoint.userId + "sId");
            this.onClose();
            this.connected = false;
            this.socket.fire("disconnect");
        };
        return PollingTransportation;
    })();
    RongIMLib.PollingTransportation = PollingTransportation;
})(RongIMLib || (RongIMLib = {}));
//objectname映射
var typeMapping = {
    "RC:TxtMsg": "TextMessage",
    "RC:ImgMsg": "ImageMessage",
    "RC:VcMsg": "VoiceMessage",
    "RC:ImgTextMsg": "RichContentMessage",
    "RC:LBSMsg": "LocationMessage",
    "RC:InfoNtf": "InformationNotificationMessage",
    "RC:ContactNtf": "ContactNotificationMessage",
    "RC:ProfileNtf": "ProfileNotificationMessage",
    "RC:CmdNtf": "CommandNotificationMessage",
    "RC:DizNtf": "DiscussionNotificationMessage",
    "RC:CmdMsg": "CommandMessage"
}, 
//自定义消息类型
registerMessageTypeMapping = {}, HistoryMsgType = {
    4: "qryCMsg",
    2: "qryDMsg",
    3: "qryGMsg",
    1: "qryPMsg",
    6: "qrySMsg",
    7: "qryPMsg",
    8: "qryPMsg"
}, disconnectStatus = { 1: 6 };
var RongIMLib;
(function (RongIMLib) {
    /**
     * 通道标识类
     */
    var Transportations = (function () {
        function Transportations() {
        }
        Transportations._TransportType = RongIMLib.Socket.WEBSOCKET;
        return Transportations;
    })();
    RongIMLib.Transportations = Transportations;
    var PublicServiceMap = (function () {
        function PublicServiceMap() {
            this.publicServiceList = [];
        }
        PublicServiceMap.prototype.get = function (publicServiceType, publicServiceId) {
            for (var i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (this.publicServiceList[i].conversationType == publicServiceType && publicServiceId == this.publicServiceList[i].publicServiceId) {
                    return this.publicServiceList[i];
                }
            }
        };
        PublicServiceMap.prototype.add = function (publicServiceProfile) {
            var isAdd = true, me = this;
            for (var i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.unshift(this.publicServiceList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.publicServiceList.unshift(publicServiceProfile);
            }
        };
        PublicServiceMap.prototype.replace = function (publicServiceProfile) {
            var me = this;
            for (var i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    me.publicServiceList.splice(i, 1, publicServiceProfile);
                    break;
                }
            }
        };
        PublicServiceMap.prototype.remove = function (conversationType, publicServiceId) {
            var me = this;
            for (var i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == conversationType && publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.splice(i, 1);
                    break;
                }
            }
        };
        return PublicServiceMap;
    })();
    RongIMLib.PublicServiceMap = PublicServiceMap;
    /**
     * 会话工具类。
     */
    var ConversationMap = (function () {
        function ConversationMap() {
            this.conversationList = [];
        }
        ConversationMap.prototype.get = function (conversavtionType, targetId) {
            for (var i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType == conversavtionType && this.conversationList[i].targetId == targetId) {
                    return this.conversationList[i];
                }
            }
            return null;
        };
        ConversationMap.prototype.add = function (conversation) {
            var isAdd = true;
            for (var i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.unshift(this.conversationList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.conversationList.unshift(conversation);
            }
        };
        /**
         * [replace 替换会话]
         * 会话数组存在的情况下调用add方法会是当前会话被替换且返回到第一个位置，导致用户本地一些设置失效，所以提供replace方法
         */
        ConversationMap.prototype.replace = function (conversation) {
            for (var i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1, conversation);
                    break;
                }
            }
        };
        ConversationMap.prototype.remove = function (conversation) {
            for (var i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1);
                    break;
                }
            }
        };
        return ConversationMap;
    })();
    RongIMLib.ConversationMap = ConversationMap;
    /**
     * 工具类
     */
    var MessageUtil = (function () {
        function MessageUtil() {
        }
        MessageUtil.supportLargeStorage = function () {
            if (window.localStorage) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         *4680000 为localstorage最小容量5200000字节的90%，超过90%将删除之前过早的存储
         */
        MessageUtil.checkStorageSize = function () {
            return JSON.stringify(localStorage).length < 4680000;
        };
        MessageUtil.ArrayForm = function (typearray) {
            if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {
                var arr = new Int8Array(typearray);
                return [].slice.call(arr);
            }
            return typearray;
        };
        MessageUtil.ArrayFormInput = function (typearray) {
            if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {
                var arr = new Uint8Array(typearray);
                return arr;
            }
            return typearray;
        };
        MessageUtil.indexOf = function (arr, item, from) {
            for (var l = arr.length, i = (from < 0) ? Math.max(0, +from) : from || 0; i < l; i++) {
                if (arr[i] == item) {
                    return i;
                }
            }
            return -1;
        };
        MessageUtil.isArray = function (obj) {
            return Object.prototype.toString.call(obj) == "[object Array]";
        };
        //遍历，只能遍历数组
        MessageUtil.forEach = function (arr, func) {
            if ([].forEach) {
                return function (arr, func) {
                    [].forEach.call(arr, func);
                };
            }
            else {
                return function (arr, func) {
                    for (var i = 0; i < arr.length; i++) {
                        func.call(arr, arr[i], i, arr);
                    }
                };
            }
        };
        MessageUtil.remove = function (array, func) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (func(array[i])) {
                    return array.splice(i, 1)[0];
                }
            }
            return null;
        };
        MessageUtil.int64ToTimestamp = function (obj, isDate) {
            if (obj.low === undefined) {
                return obj;
            }
            var low = obj.low;
            if (low < 0) {
                low += 0xffffffff + 1;
            }
            low = low.toString(16);
            var timestamp = parseInt(obj.high.toString(16) + "00000000".replace(new RegExp("0{" + low.length + "}$"), low), 16);
            if (isDate) {
                return new Date(timestamp);
            }
            return timestamp;
        };
        //消息转换方法
        MessageUtil.messageParser = function (entity, onReceived) {
            var message = new RongIMLib.Message(), content = entity.content, de, objectName = entity.classname, val, isUseDef = false;
            try {
                if (RongIMLib.RongIMClient._memoryStore.global["WEB_XHR_POLLING"]) {
                    val = new RongIMLib.BinaryHelper().readUTF(content.offset ? MessageUtil.ArrayForm(content.buffer).slice(content.offset, content.limit) : content);
                    de = JSON.parse(val);
                }
                else {
                    val = new RongIMLib.BinaryHelper().readUTF(content.offset ? MessageUtil.ArrayFormInput(content.buffer).subarray(content.offset, content.limit) : content);
                    de = JSON.parse(val);
                }
            }
            catch (ex) {
                de = val;
                isUseDef = true;
            }
            //处理表情
            if ("Expression" in RongIMLib && de.content) {
                de.content = de.content.replace(/[\uf000-\uf700]/g, function (x) {
                    return eval("RongIMLib.Expression.calcUTF(x) || x");
                });
            }
            //映射为具体消息对象
            if (objectName in typeMapping) {
                var str = "new RongIMLib." + typeMapping[objectName] + "(de)";
                message.content = eval(str);
                message.messageType = typeMapping[objectName];
            }
            else if (objectName in registerMessageTypeMapping) {
                var str = "new RongIMLib.RongIMClient.RegisterMessage." + registerMessageTypeMapping[objectName] + "(de)";
                if (isUseDef) {
                    message.content = eval(str).decode(de);
                }
                else {
                    message.content = eval(str);
                }
                message.messageType = registerMessageTypeMapping[objectName];
            }
            else {
                message.content = new RongIMLib.UnknownMessage({ content: de, objectName: objectName });
                message.messageType = "UnknownMessage";
            }
            //根据实体对象设置message对象
            message.sentTime = MessageUtil.int64ToTimestamp(entity.dataTime);
            message.senderUserId = entity.fromUserId;
            message.conversationType = entity.type;
            if (entity.fromUserId == RongIMLib.Bridge._client.userId) {
                message.targetId = entity.groupId;
            }
            else {
                message.targetId = (/^[234]$/.test(entity.type || entity.getType()) ? entity.groupId : message.senderUserId);
            }
            if (entity.direction == 1) {
                message.messageDirection = RongIMLib.MessageDirection.SEND;
            }
            else {
                message.messageDirection = RongIMLib.MessageDirection.RECEIVE;
            }
            if ((entity.status & 2) == 2) {
                message.hasReceivedByOtherClient = true;
            }
            message.messageUId = entity.msgId;
            message.receivedTime = new Date().getTime();
            message.messageId = (message.conversationType + "_" + ~~(Math.random() * 0xffffff));
            message.objectName = objectName;
            return message;
        };
        //适配SSL
        MessageUtil.schemeArrs = [["http", "ws"], ["https", "wss"]];
        MessageUtil.sign = { converNum: 1, msgNum: 1, isMsgStart: true, isConvStart: true };
        return MessageUtil;
    })();
    RongIMLib.MessageUtil = MessageUtil;
    var MessageIdHandler = (function () {
        function MessageIdHandler() {
        }
        MessageIdHandler.init = function () {
            this.messageId = +(RongIMLib.RongIMClient._cookieHelper.getItem("msgId") || RongIMLib.RongIMClient._cookieHelper.setItem("msgId", 0) || 0);
        };
        MessageIdHandler.messageIdPlus = function (method) {
            this.isXHR && this.init();
            if (this.messageId >= 65535) {
                method();
                return false;
            }
            this.messageId++;
            this.isXHR && RongIMLib.RongIMClient._cookieHelper.setItem("msgId", this.messageId);
            return this.messageId;
        };
        MessageIdHandler.clearMessageId = function () {
            this.messageId = 0;
            this.isXHR && RongIMLib.RongIMClient._cookieHelper.setItem("msgId", this.messageId);
        };
        MessageIdHandler.getMessageId = function () {
            this.isXHR && this.init();
            return this.messageId;
        };
        MessageIdHandler.messageId = 0;
        MessageIdHandler.isXHR = Transportations._TransportType === RongIMLib.Socket.XHR_POLLING;
        return MessageIdHandler;
    })();
    RongIMLib.MessageIdHandler = MessageIdHandler;
    var CheckParam = (function () {
        function CheckParam() {
        }
        CheckParam.getInstance = function () {
            return new CheckParam();
        };
        CheckParam.prototype.check = function (f, position, d) {
            var c = arguments.callee.caller;
            if ("_client" in RongIMLib.Bridge || d) {
                for (var g = 0, e = c.arguments.length; g < e; g++) {
                    if (!new RegExp(this.getType(c.arguments[g])).test(f[g])) {
                        throw new Error("The index of " + g + " parameter was wrong type " + this.getType(c.arguments[g]) + " [" + f[g] + "] -> position:" + position);
                    }
                }
            }
            else {
                throw new Error("The parameter is incorrect or was not yet instantiated RongIMClient -> position:" + position);
            }
        };
        CheckParam.prototype.getType = function (str) {
            var temp = Object.prototype.toString.call(str).toLowerCase();
            return temp.slice(8, temp.length - 1);
        };
        return CheckParam;
    })();
    RongIMLib.CheckParam = CheckParam;
    var LimitableMap = (function () {
        function LimitableMap(limit) {
            this.map = {};
            this.keys = [];
            this.limit = limit || 10;
        }
        LimitableMap.prototype.set = function (key, value) {
            if (this.map.hasOwnProperty(key)) {
                if (this.keys.length === this.limit) {
                    var firstKey = this.keys.shift();
                    delete this.map[firstKey];
                }
                this.keys.push(key);
            }
            this.map[key] = value;
        };
        LimitableMap.prototype.get = function (key) {
            return this.map[key] || 0;
        };
        LimitableMap.prototype.remove = function (key) {
            delete this.map[key];
        };
        return LimitableMap;
    })();
    RongIMLib.LimitableMap = LimitableMap;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var MessageContent = (function () {
        function MessageContent(data) {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        }
        MessageContent.obtain = function () {
            throw new Error("This method is abstract, you must implement this method in inherited class.");
        };
        return MessageContent;
    })();
    RongIMLib.MessageContent = MessageContent;
    var NotificationMessage = (function (_super) {
        __extends(NotificationMessage, _super);
        function NotificationMessage() {
            _super.apply(this, arguments);
        }
        return NotificationMessage;
    })(MessageContent);
    RongIMLib.NotificationMessage = NotificationMessage;
    var StatusMessage = (function (_super) {
        __extends(StatusMessage, _super);
        function StatusMessage() {
            _super.apply(this, arguments);
        }
        return StatusMessage;
    })(MessageContent);
    RongIMLib.StatusMessage = StatusMessage;
    var ModelUtil = (function () {
        function ModelUtil() {
        }
        ModelUtil.modelClone = function (object) {
            var obj = {};
            for (var item in object) {
                if (item != "messageName" && "encode" != item) {
                    obj[item] = object[item];
                }
            }
            return obj;
        };
        ModelUtil.modleCreate = function (fields) {
            if (fields.length < 1) {
                throw new Error("Array is empty  -> registerMessageType.modleCreate");
            }
            var Object = function (message) {
                for (var index in fields) {
                    if (message[fields[index]]) {
                        Object.prototype[fields[index]] = message[fields[index]];
                    }
                }
                this.encode = function () {
                    return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
                };
            };
            return Object;
        };
        return ModelUtil;
    })();
    RongIMLib.ModelUtil = ModelUtil;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var IsTypingStatusMessage = (function () {
        function IsTypingStatusMessage(data) {
            this.messageName = "IsTypingStatusMessage";
            var msg = data;
        }
        IsTypingStatusMessage.prototype.encode = function () {
            return undefined;
        };
        IsTypingStatusMessage.prototype.getMessage = function () {
            return null;
        };
        return IsTypingStatusMessage;
    })();
    RongIMLib.IsTypingStatusMessage = IsTypingStatusMessage;
    var HandshakeMessage = (function () {
        function HandshakeMessage(data) {
            this.messageName = "HandshakeMessage";
            var msg = data;
        }
        HandshakeMessage.prototype.encode = function () {
            return undefined;
        };
        HandshakeMessage.prototype.getMessage = function () {
            return null;
        };
        return HandshakeMessage;
    })();
    RongIMLib.HandshakeMessage = HandshakeMessage;
    var SuspendMessage = (function () {
        function SuspendMessage(data) {
            this.messageName = "SuspendMessage";
            var msg = data;
        }
        SuspendMessage.prototype.encode = function () {
            return undefined;
        };
        SuspendMessage.prototype.getMessage = function () {
            return null;
        };
        return SuspendMessage;
    })();
    RongIMLib.SuspendMessage = SuspendMessage;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var InformationNotificationMessage = (function () {
        function InformationNotificationMessage(message) {
            this.messageName = "InformationNotificationMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> InformationNotificationMessage.");
            }
            this.message = message.message;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        InformationNotificationMessage.obtain = function (message) {
            return new InformationNotificationMessage({ message: message, extra: "" });
        };
        InformationNotificationMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return InformationNotificationMessage;
    })();
    RongIMLib.InformationNotificationMessage = InformationNotificationMessage;
    var CommandMessage = (function () {
        function CommandMessage(message) {
            this.messageName = "CommandMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> CommandMessage.");
            }
            try {
                if (Object.prototype.toString.call(message.data) == "[object String]") {
                    this.data = JSON.parse(message.data);
                }
                else {
                    this.data = message.data;
                }
            }
            catch (e) {
                this.data = message.data;
            }
            this.name = message.name;
            this.extra = message.extra;
        }
        CommandMessage.obtain = function (data) {
            return new CommandMessage({ data: data, extra: "" });
        };
        CommandMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return CommandMessage;
    })();
    RongIMLib.CommandMessage = CommandMessage;
    var ContactNotificationMessage = (function () {
        function ContactNotificationMessage(message) {
            this.messageName = "ContactNotificationMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ContactNotificationMessage.");
            }
            this.operation = message.operation;
            this.targetUserId = message.targetUserId;
            this.message = message.message;
            this.extra = message.extra;
            this.sourceUserId = message.sourceUserId;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        ContactNotificationMessage.obtain = function (operation, sourceUserId, targetUserId, message) {
            return new InformationNotificationMessage({ operation: operation, sourceUserId: sourceUserId, targetUserId: targetUserId, message: message });
        };
        ContactNotificationMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        ContactNotificationMessage.CONTACT_OPERATION_ACCEPT_RESPONSE = "ContactOperationAcceptResponse";
        ContactNotificationMessage.CONTACT_OPERATION_REJECT_RESPONSE = "ContactOperationRejectResponse";
        ContactNotificationMessage.CONTACT_OPERATION_REQUEST = "ContactOperationRequest";
        return ContactNotificationMessage;
    })();
    RongIMLib.ContactNotificationMessage = ContactNotificationMessage;
    var ProfileNotificationMessage = (function () {
        function ProfileNotificationMessage(message) {
            this.messageName = "ProfileNotificationMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
            }
            this.operation = message.operation;
            try {
                if (Object.prototype.toString.call(message.data) == "[object String]") {
                    this.data = JSON.parse(message.data);
                }
                else {
                    this.data = message.data;
                }
            }
            catch (e) {
                this.data = message.data;
            }
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        ProfileNotificationMessage.obtain = function (operation, data) {
            return new ProfileNotificationMessage({ operation: operation, data: data });
        };
        ProfileNotificationMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return ProfileNotificationMessage;
    })();
    RongIMLib.ProfileNotificationMessage = ProfileNotificationMessage;
    var CommandNotificationMessage = (function () {
        function CommandNotificationMessage(message) {
            this.messageName = "CommandNotificationMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ProfileNotificationMessage.");
            }
            try {
                if (Object.prototype.toString.call(message.data) == "[object String]") {
                    this.data = JSON.parse(message.data);
                }
                else {
                    this.data = message.data;
                }
            }
            catch (e) {
                this.data = message.data;
            }
            this.name = message.name;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        CommandNotificationMessage.obtain = function (name, data) {
            return new CommandNotificationMessage({ name: name, data: data, extra: "" });
        };
        CommandNotificationMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return CommandNotificationMessage;
    })();
    RongIMLib.CommandNotificationMessage = CommandNotificationMessage;
    var DiscussionNotificationMessage = (function () {
        function DiscussionNotificationMessage(message) {
            this.messageName = "DiscussionNotificationMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> DiscussionNotificationMessage.");
            }
            this.extra = message.extra;
            this.extension = message.extension;
            this.type = message.type;
            this.isHasReceived = message.isHasReceived;
            this.operation = message.operation;
            this.userInfo = message.userInfo;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        DiscussionNotificationMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return DiscussionNotificationMessage;
    })();
    RongIMLib.DiscussionNotificationMessage = DiscussionNotificationMessage;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var TextMessage = (function () {
        function TextMessage(message) {
            this.messageName = "TextMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> TextMessage.");
            }
            this.content = message.content;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        TextMessage.obtain = function (text) {
            return new TextMessage({ extra: "", content: text });
        };
        TextMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return TextMessage;
    })();
    RongIMLib.TextMessage = TextMessage;
    var VoiceMessage = (function () {
        function VoiceMessage(message) {
            this.messageName = "VoiceMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> VoiceMessage.");
            }
            this.content = message.content;
            this.duration = message.duration;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        VoiceMessage.obtain = function (base64Content, duration) {
            return new VoiceMessage({ content: base64Content, duration: duration, extra: "" });
        };
        VoiceMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return VoiceMessage;
    })();
    RongIMLib.VoiceMessage = VoiceMessage;
    var ImageMessage = (function () {
        function ImageMessage(message) {
            this.messageName = "ImageMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> ImageMessage.");
            }
            this.content = message.content;
            this.imageUri = message.imageUri;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        ImageMessage.obtain = function (content, imageUri) {
            return new ImageMessage({ content: content, imageUri: imageUri, extra: "" });
        };
        ImageMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return ImageMessage;
    })();
    RongIMLib.ImageMessage = ImageMessage;
    var LocationMessage = (function () {
        function LocationMessage(message) {
            this.messageName = "LocationMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> LocationMessage.");
            }
            this.latiude = message.latitude;
            this.longitude = message.longitude;
            this.poi = message.poi;
            this.content = message.content;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        LocationMessage.obtain = function (latitude, longitude, poi, content) {
            return new LocationMessage({ latitude: longitude, longitude: longitude, poi: poi, content: content, extra: "" });
        };
        LocationMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return LocationMessage;
    })();
    RongIMLib.LocationMessage = LocationMessage;
    var RichContentMessage = (function () {
        function RichContentMessage(message) {
            this.messageName = "RichContentMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> RichContentMessage.");
            }
            this.title = message.title;
            this.content = message.content;
            this.imageUri = message.imageUri;
            this.extra = message.extra;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        RichContentMessage.obtain = function (title, content, imageUri) {
            return new RichContentMessage({ title: title, content: content, imageUri: imageUri, extra: "" });
        };
        RichContentMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return RichContentMessage;
    })();
    RongIMLib.RichContentMessage = RichContentMessage;
    var UnknownMessage = (function () {
        function UnknownMessage(message) {
            this.messageName = "UnknownMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> UnknownMessage.");
            }
            this.message = message;
        }
        UnknownMessage.prototype.encode = function () {
            return "";
        };
        return UnknownMessage;
    })();
    RongIMLib.UnknownMessage = UnknownMessage;
    var PublicServiceCommandMessage = (function () {
        function PublicServiceCommandMessage(message) {
            this.messageName = "PublicServiceCommandMessage";
            if (arguments.length == 0) {
                throw new Error("Can not instantiate with empty parameters, use obtain method instead -> PublicServiceCommandMessage.");
            }
            this.content = message.content;
            this.extra = message.extra;
            this.menuItem = message.menuItem;
            if (message.userInfo) {
                this.userInfo = message.userInfo;
            }
        }
        PublicServiceCommandMessage.obtain = function (item) {
            return new PublicServiceCommandMessage({ content: "", command: "", menuItem: item, extra: "" });
        };
        PublicServiceCommandMessage.prototype.encode = function () {
            return JSON.stringify(RongIMLib.ModelUtil.modelClone(this));
        };
        return PublicServiceCommandMessage;
    })();
    RongIMLib.PublicServiceCommandMessage = PublicServiceCommandMessage;
    var PublicServiceMultiRichContentMessage = (function () {
        function PublicServiceMultiRichContentMessage(messages) {
            this.messageName = "PublicServiceMultiRichContentMessage";
            this.richContentMessages = messages;
        }
        PublicServiceMultiRichContentMessage.prototype.encode = function () {
            return null;
        };
        return PublicServiceMultiRichContentMessage;
    })();
    RongIMLib.PublicServiceMultiRichContentMessage = PublicServiceMultiRichContentMessage;
    var PublicServiceRichContentMessage = (function () {
        function PublicServiceRichContentMessage(message) {
            this.messageName = "PublicServiceRichContentMessage";
            this.richContentMessage = message;
        }
        PublicServiceRichContentMessage.prototype.encode = function () {
            return null;
        };
        return PublicServiceRichContentMessage;
    })();
    RongIMLib.PublicServiceRichContentMessage = PublicServiceRichContentMessage;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var Conversation = (function () {
        function Conversation(conversationTitle, conversationType, draft, isTop, latestMessage, latestMessageId, notificationStatus, objectName, receivedStatus, receivedTime, senderUserId, senderUserName, sentStatus, sentTime, targetId, unreadMessageCount, senderPortraitUri) {
            this.conversationTitle = conversationTitle;
            this.conversationType = conversationType;
            this.draft = draft;
            this.isTop = isTop;
            this.latestMessage = latestMessage;
            this.latestMessageId = latestMessageId;
            this.notificationStatus = notificationStatus;
            this.objectName = objectName;
            this.receivedStatus = receivedStatus;
            this.receivedTime = receivedTime;
            this.senderUserId = senderUserId;
            this.senderUserName = senderUserName;
            this.sentStatus = sentStatus;
            this.sentTime = sentTime;
            this.targetId = targetId;
            this.unreadMessageCount = unreadMessageCount;
            this.senderPortraitUri = senderPortraitUri;
        }
        Conversation.prototype.setTop = function () {
            RongIMLib.RongIMClient._dataAccessProvider.addConversation(this, { onSuccess: function (data) { } });
        };
        return Conversation;
    })();
    RongIMLib.Conversation = Conversation;
    var Discussion = (function () {
        function Discussion(creatorId, id, memberIdList, name, isOpen) {
            this.creatorId = creatorId;
            this.id = id;
            this.memberIdList = memberIdList;
            this.name = name;
            this.isOpen = isOpen;
        }
        return Discussion;
    })();
    RongIMLib.Discussion = Discussion;
    var Group = (function () {
        function Group(id, name, portraitUri) {
            this.id = id;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return Group;
    })();
    RongIMLib.Group = Group;
    var Message = (function () {
        function Message(content, conversationType, extra, objectName, messageDirection, messageId, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId, messageType, messageUId, hasReceivedByOtherClient) {
            this.content = content;
            this.conversationType = conversationType;
            this.extra = extra;
            this.objectName = objectName;
            this.messageDirection = messageDirection;
            this.messageId = messageId;
            this.receivedStatus = receivedStatus;
            this.receivedTime = receivedTime;
            this.senderUserId = senderUserId;
            this.sentStatus = sentStatus;
            this.sentTime = sentTime;
            this.targetId = targetId;
            this.messageType = messageType;
            this.messageUId = messageUId;
            this.hasReceivedByOtherClient = hasReceivedByOtherClient;
        }
        return Message;
    })();
    RongIMLib.Message = Message;
    var MessageTag = (function () {
        function MessageTag(isCounted, isPersited) {
            this.isCounted = isCounted;
            this.isPersited = isPersited;
        }
        MessageTag.prototype.getMessageTag = function () {
            if (this.isCounted && this.isPersited) {
                return 3;
            }
            else if (this.isCounted || !this.isPersited) {
                return 2;
            }
            else if (!this.isCounted || this.isPersited) {
                return 1;
            }
            else if (!this.isCounted && !this.isPersited) {
                return 0;
            }
        };
        return MessageTag;
    })();
    RongIMLib.MessageTag = MessageTag;
    var PublicServiceMenuItem = (function () {
        function PublicServiceMenuItem(id, name, type, sunMenuItems, url) {
            this.id = id;
            this.name = name;
            this.type = type;
            this.sunMenuItems = sunMenuItems;
            this.url = url;
        }
        return PublicServiceMenuItem;
    })();
    RongIMLib.PublicServiceMenuItem = PublicServiceMenuItem;
    // TODO: TBD
    var PublicServiceProfile = (function () {
        function PublicServiceProfile(conversationType, introduction, menu, name, portraitUri, publicServiceId, hasFollowed, isGlobal) {
            this.conversationType = conversationType;
            this.introduction = introduction;
            this.menu = menu;
            this.name = name;
            this.portraitUri = portraitUri;
            this.publicServiceId = publicServiceId;
            this.hasFollowed = hasFollowed;
            this.isGlobal = isGlobal;
        }
        return PublicServiceProfile;
    })();
    RongIMLib.PublicServiceProfile = PublicServiceProfile;
    var UserInfo = (function () {
        function UserInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return UserInfo;
    })();
    RongIMLib.UserInfo = UserInfo;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var ServerDataProvider = (function () {
        function ServerDataProvider() {
        }
        ServerDataProvider.prototype.addConversation = function (conversation, callback) {
            var isAdd = true;
            for (var i = 0, len = RongIMLib.RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMLib.RongIMClient._memoryStore.conversationList[i].conversationType === conversation.conversationType && RongIMLib.RongIMClient._memoryStore.conversationList[i].targetId === conversation.targetId) {
                    RongIMLib.RongIMClient._memoryStore.conversationList.unshift(RongIMLib.RongIMClient._memoryStore.conversationList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                RongIMLib.RongIMClient._memoryStore.conversationList.unshift(conversation);
            }
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.removeConversation = function (conversationType, targetId, callback) {
            for (var i = 0, len = RongIMLib.RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMLib.RongIMClient._memoryStore.conversationList[i].conversationType === conversationType && RongIMLib.RongIMClient._memoryStore.conversationList[i].targetId === targetId) {
                    RongIMLib.RongIMClient._memoryStore.conversationList.splice(i, 1);
                    if (RongIMLib.MessageUtil.supportLargeStorage()) {
                        RongIMLib.LocalStorageProvider.getInstance().removeItem("cu" + RongIMLib.Bridge._client.userId + conversationType + targetId);
                    }
                    break;
                }
            }
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.addMessage = function (conversationType, targetId, message, callback) {
            if (callback) {
                callback.onSuccess(new RongIMLib.Message());
            }
        };
        ServerDataProvider.prototype.removeMessage = function (conversationType, targetId, messageIds, callback) {
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.updateMessage = function (message, callback) {
            callback.onSuccess(message);
        };
        ServerDataProvider.prototype.clearMessages = function (conversationType, targetId, callback) {
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.updateMessages = function (conversationType, targetId, key, value, callback) {
            var me = this;
            if (key == "readStatus") {
                if (RongIMLib.RongIMClient._memoryStore.conversationList.length > 0) {
                    me.getConversationList({
                        onSuccess: function (list) {
                            Array.forEach(list, function (conver) {
                                if (conver.conversationType == conversationType && conver.targetId == targetId) {
                                    conver.unreadMessageCount = 0;
                                }
                            });
                        },
                        onError: function (errorCode) {
                            callback.onError(errorCode);
                        }
                    }, null);
                }
            }
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.getConversation = function (conversationType, targetId) {
            var conver = null;
            for (var i = 0, len = RongIMLib.RongIMClient._memoryStore.conversationList.length; i < len; i++) {
                if (RongIMLib.RongIMClient._memoryStore.conversationList[i].conversationType == conversationType && RongIMLib.RongIMClient._memoryStore.conversationList[i].targetId == targetId) {
                    conver = RongIMLib.RongIMClient._memoryStore.conversationList[i];
                    if (RongIMLib.MessageUtil.supportLargeStorage()) {
                        var count = RongIMLib.LocalStorageProvider.getInstance().getItem("cu" + RongIMLib.Bridge._client.userId + conversationType + targetId);
                        if (conver.unreadMessageCount == 0) {
                            conver.unreadMessageCount = Number(count);
                        }
                    }
                }
            }
            return conver;
        };
        ServerDataProvider.prototype.getConversationList = function (callback, conversationTypes) {
            if (RongIMLib.RongIMClient._memoryStore.conversationList.length == 0 || RongIMLib.RongIMClient._memoryStore.isSyncRemoteConverList) {
                RongIMLib.RongIMClient.getInstance().getRemoteConversationList({
                    onSuccess: function (list) {
                        if (RongIMLib.MessageUtil.supportLargeStorage()) {
                            Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (item) {
                                var count = RongIMLib.LocalStorageProvider.getInstance().getItem("cu" + RongIMLib.Bridge._client.userId + item.conversationType + item.targetId);
                                if (item.unreadMessageCount == 0) {
                                    item.unreadMessageCount = Number(count);
                                }
                            });
                        }
                        RongIMLib.RongIMClient._memoryStore.isSyncRemoteConverList = false;
                        callback.onSuccess(list);
                    },
                    onError: function (errorcode) {
                        callback.onSuccess([]);
                    }
                }, conversationTypes);
            }
            else {
                if (conversationTypes) {
                    var convers = [];
                    Array.forEach(conversationTypes, function (converType) {
                        Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (item) {
                            if (item.conversationType == converType) {
                                convers.push(item);
                            }
                        });
                    });
                    callback.onSuccess(convers);
                }
                else {
                    callback.onSuccess(RongIMLib.RongIMClient._memoryStore.conversationList);
                }
            }
        };
        ServerDataProvider.prototype.clearConversations = function (conversationTypes, callback) {
            Array.forEach(conversationTypes, function (conversationType) {
                Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (conver) {
                    if (conversationType == conver.conversationType) {
                        RongIMLib.RongIMClient.getInstance().removeConversation(conver.conversationType, conver.targetId, { onSuccess: function () { }, onError: function () { } });
                    }
                });
            });
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.getHistoryMessages = function (conversationType, targetId, timestamp, count, callback) {
            RongIMLib.RongIMClient.getInstance().getRemoteHistoryMessages(conversationType, targetId, timestamp, count, callback);
        };
        ServerDataProvider.prototype.getTotalUnreadCount = function (callback) {
            var count = 0;
            Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (conver) {
                count += conver.unreadMessageCount;
            });
            callback.onSuccess(count);
        };
        ServerDataProvider.prototype.getConversationUnreadCount = function (conversationTypes, callback) {
            var count = 0;
            Array.forEach(conversationTypes, function (converType) {
                Array.forEach(RongIMLib.RongIMClient._memoryStore.conversationList, function (conver) {
                    if (conver.conversationType == converType) {
                        count += conver.unreadMessageCount;
                    }
                });
            });
            callback.onSuccess(count);
        };
        ServerDataProvider.prototype.getUnreadCount = function (conversationType, targetId, callback) {
            var conver = this.getConversation(conversationType, targetId);
            callback.onSuccess(conver ? conver.unreadMessageCount : 0);
        };
        ServerDataProvider.prototype.clearUnreadCount = function (conversationType, targetId, callback) {
            var conver = this.getConversation(conversationType, targetId);
            if (conver) {
                if (RongIMLib.MessageUtil.supportLargeStorage()) {
                    RongIMLib.LocalStorageProvider.getInstance().removeItem("cu" + RongIMLib.Bridge._client.userId + conversationType + targetId);
                }
                conver.unreadMessageCount = 0;
            }
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.setConversationToTop = function (conversationType, targetId, callback) {
            var conver = this.getConversation(conversationType, targetId);
            this.addConversation(conver, callback);
        };
        ServerDataProvider.prototype.setMessageExtra = function (messageId, value, callback) {
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.setMessageReceivedStatus = function (messageId, receivedStatus, callback) {
            callback.onSuccess(true);
        };
        ServerDataProvider.prototype.setMessageSentStatus = function (messageId, sentStatus, callback) {
            callback.onSuccess(true);
        };
        return ServerDataProvider;
    })();
    RongIMLib.ServerDataProvider = ServerDataProvider;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var WebSQLDataProvider = (function () {
        function WebSQLDataProvider() {
        }
        WebSQLDataProvider.prototype.addConversation = function (conversation, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.removeConversation = function (conversationType, targetId, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.addMessage = function (conversationType, targetId, message, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.removeMessage = function (conversationType, targetId, messageIds, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.updateMessage = function (message, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.clearMessages = function (conversationType, targetId, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.updateMessages = function (conversationType, targetId, key, value, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.getConversation = function (conversationType, targetId) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.getConversationList = function (callback, conversationTypes) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.clearConversations = function (conversationTypes, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.getHistoryMessages = function (conversationType, targetId, timestamp, count, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.getTotalUnreadCount = function (callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.getConversationUnreadCount = function (conversationTypes, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.getUnreadCount = function (conversationType, targetId, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.clearUnreadCount = function (conversationType, targetId, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.setConversationToTop = function (conversationType, targetId, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.setMessageExtra = function (messageId, value, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.setMessageReceivedStatus = function (messageId, receivedStatus, callback) {
            throw new Error("Not implemented yet");
        };
        WebSQLDataProvider.prototype.setMessageSentStatus = function (messageId, sentStatus, callback) {
            throw new Error("Not implemented yet");
        };
        return WebSQLDataProvider;
    })();
    RongIMLib.WebSQLDataProvider = WebSQLDataProvider;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var CookieProvider = (function () {
        function CookieProvider() {
        }
        CookieProvider.prototype.setItem = function (composedKey, object) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 15 * 24 * 3600 * 1000);
            document.cookie = composedKey + "=" + decodeURIComponent(object) + ";path=/;expires=" + exp.toGMTString();
        };
        CookieProvider.prototype.getItem = function (composedKey) {
            var arr = document.cookie.match(new RegExp("(^| )" + composedKey + "=([^;]*)(;|$)"));
            if (arr != null) {
                return (arr[2]);
            }
            return null;
        };
        CookieProvider.prototype.removeItem = function (composedKey) {
            if (this.getItem(composedKey)) {
                document.cookie = composedKey + "=;path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            }
        };
        CookieProvider.prototype.getItemKey = function (regStr) {
            var arrs = document.cookie.match(new RegExp("(^| )navi\\w+?=([^;]*)(;|$)")), val = "";
            if (arrs) {
                for (var i = 0, len = arrs.length; i < len; i++) {
                    if (arrs[i].indexOf(regStr) > -1) {
                        val = arrs[i];
                        break;
                    }
                }
            }
            return val ? val.split("=")[0].replace(/^\s/, "") : null;
        };
        CookieProvider.prototype.clearItem = function () {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;) {
                    document.cookie = keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString();
                }
            }
        };
        //单位：字节
        CookieProvider.prototype.onOutOfQuota = function () {
            return 4 * 1024;
        };
        return CookieProvider;
    })();
    RongIMLib.CookieProvider = CookieProvider;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var LocalStorageProvider = (function () {
        function LocalStorageProvider() {
        }
        LocalStorageProvider.getInstance = function () {
            return new LocalStorageProvider();
        };
        LocalStorageProvider.prototype.setItem = function (composedKey, object) {
            if (localStorage.length == 20) {
                localStorage.removeItem(localStorage.key(0));
            }
            localStorage.setItem(composedKey.toString(), object);
        };
        LocalStorageProvider.prototype.getItem = function (composedKey) {
            return localStorage.getItem(composedKey ? composedKey.toString() : "");
        };
        LocalStorageProvider.prototype.removeItem = function (composedKey) {
            localStorage.removeItem(composedKey.toString());
        };
        LocalStorageProvider.prototype.clearItem = function () {
            localStorage.clear();
        };
        //单位：字节
        LocalStorageProvider.prototype.onOutOfQuota = function () {
            return JSON.stringify(localStorage).length;
        };
        return LocalStorageProvider;
    })();
    RongIMLib.LocalStorageProvider = LocalStorageProvider;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var FeatureDectector = (function () {
        function FeatureDectector() {
            this.script = document.createElement("script");
            this.head = document.getElementsByTagName("head")[0];
            RongIMLib.Transportations._TransportType = RongIMLib.Socket.WEBSOCKET;
            if ("WebSocket" in window && "ArrayBuffer" in window && WebSocket.prototype.CLOSED === 3 && !window["WEB_XHR_POLLING"]) {
                //http://res.websdk.rongcloud.cn/protobuf-0.2.min.js
                this.script.src = RongIMLib.MessageUtil.schemeArrs[RongIMLib.RongIMClient.schemeType][0] + "://cdn.ronghub.com/protobuf-min-2.7.js";
                // this.script.src = MessageUtil.schemeArrs[RongIMClient.schemeType][0] + "://localhost:9876/base/src/3rd/protobuf-min.js";
                this.head.appendChild(this.script);
            }
            else {
                RongIMLib.Transportations._TransportType = "xhr-polling";
                window["Modules"] = Polling;
            }
        }
        return FeatureDectector;
    })();
    RongIMLib.FeatureDectector = FeatureDectector;
    if (document.readyState == "interactive" || document.readyState == "loading" || document.readyState == "complete") {
        new FeatureDectector();
    }
    else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function () {
            //TODO 替换callee
            document.removeEventListener("DOMContentLoaded", arguments.callee, false);
            new FeatureDectector();
        }, false);
    }
    else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function () {
            if (document.readyState == "interactive" || document.readyState == "loading" || document.readyState == "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                new FeatureDectector();
            }
        });
    }
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var FeaturePatcher = (function () {
        function FeaturePatcher() {
        }
        FeaturePatcher.prototype.patchAll = function () {
            this.patchJSON();
            this.patchForEach();
        };
        FeaturePatcher.prototype.patchForEach = function () {
            if (!Array.forEach) {
                Array.forEach = function (arr, func) {
                    for (var i = 0; i < arr.length; i++) {
                        func.call(arr, arr[i], i, arr);
                    }
                };
            }
        };
        FeaturePatcher.prototype.patchJSON = function () {
            if (!window["JSON"]) {
                window["JSON"] = (function () {
                    function JSON() {
                    }
                    JSON.parse = function (sJSON) {
                        return eval('(' + sJSON + ')');
                    };
                    JSON.stringify = function (value) {
                        var toString = Object.prototype.toString;
                        var isArray = Array.isArray || function (a) {
                            return toString.call(a) === '[object Array]';
                        }, escMap = {
                            '"': '\\"',
                            '\\': '\\\\',
                            '\b': '\\b',
                            '\f': '\\f',
                            '\n': '\\n',
                            '\r': '\\r',
                            '\t': '\\t'
                        }, escFunc = function (m) {
                            return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
                        }, escRE = new RegExp('[\\"-]', 'g');
                        if (value == null) {
                            return 'null';
                        }
                        else if (typeof value === 'number') {
                            return isFinite(value) ? value.toString() : 'null';
                        }
                        else if (typeof value === 'boolean') {
                            return value.toString();
                        }
                        else if (typeof value === 'object') {
                            if (typeof value.toJSON === 'function') {
                                return window["JSON"].stringify(value.toJSON());
                            }
                            else if (isArray(value)) {
                                var res = '[';
                                for (var i = 0, len = value.length; i < len; i++)
                                    res += (i ? ', ' : '') + window["JSON"].stringify(value[i]);
                                return res + ']';
                            }
                            else if (toString.call(value) === '[object Object]') {
                                var tmp = [];
                                for (var k in value) {
                                    if (value.hasOwnProperty(k))
                                        tmp.push(window["JSON"].stringify(k) + ': ' + window["JSON"].stringify(value[k]));
                                }
                                return '{' + tmp.join(', ') + '}';
                            }
                        }
                        return '"' + value.toString().replace(escRE, escFunc) + '"';
                    };
                    return JSON;
                })();
            }
        };
        return FeaturePatcher;
    })();
    RongIMLib.FeaturePatcher = FeaturePatcher;
})(RongIMLib || (RongIMLib = {}));
var RongIMLib;
(function (RongIMLib) {
    var ScriptLoader = (function () {
        function ScriptLoader() {
        }
        ScriptLoader.prototype.load = function (src, onLoad, onError) {
            var script = document.createElement("script");
            script.async = true;
            if (onLoad) {
                if (script.addEventListener) {
                    script.addEventListener("load", function (event) {
                        var target = event.target || event.srcElement;
                        onLoad(target.src);
                    }, false);
                }
                else if (script.readyState) {
                    script.onreadystatechange = function (event) {
                        var target = event.srcElement;
                        onLoad(target.src);
                    };
                }
            }
            if (onError) {
                script.onerror = function (event) {
                    var target = event.target || event.srcElement;
                    onError(target.src);
                };
            }
            (document.head || document.getElementsByTagName("head")[0]).appendChild(script);
            script.src = src;
        };
        return ScriptLoader;
    })();
})(RongIMLib || (RongIMLib = {}));
//# sourceMappingURL=RongIMLib.js.map