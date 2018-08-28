(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.RongSticker = factory();
  }
})(window, function () {

  var utils = {
    sha1: function (msg) {
      function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
      };
      function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
          vh = (val >>> (i * 4 + 4)) & 0x0f;
          vl = (val >>> (i * 4)) & 0x0f;
          str += vh.toString(16) + vl.toString(16);
        }
        return str;
      };
      function cvt_hex(val) {
        var str = "";
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
          v = (val >>> (i * 4)) & 0x0f;
          str += v.toString(16);
        }
        return str;
      };
      function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          }
          else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      };
      var blockstart;
      var i, j;
      var W = new Array(80);
      var H0 = 0x67452301;
      var H1 = 0xEFCDAB89;
      var H2 = 0x98BADCFE;
      var H3 = 0x10325476;
      var H4 = 0xC3D2E1F0;
      var A, B, C, D, E;
      var temp;
      msg = Utf8Encode(msg);
      var msg_len = msg.length;
      var word_array = new Array();
      for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
          msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
      }
      switch (msg_len % 4) {
        case 0:
          i = 0x080000000;
          break;
        case 1:
          i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
          break;
        case 2:
          i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
          break;
        case 3:
          i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
          break;
      }
      word_array.push(i);
      while ((word_array.length % 16) != 14) word_array.push(0);
      word_array.push(msg_len >>> 29);
      word_array.push((msg_len << 3) & 0x0ffffffff);
      for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
          temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        for (i = 20; i <= 39; i++) {
          temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        for (i = 40; i <= 59; i++) {
          temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        for (i = 60; i <= 79; i++) {
          temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
          E = D;
          D = C;
          C = rotate_left(B, 30);
          B = A;
          A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
      }
      var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

      return temp.toLowerCase();
    },
    tplEngine: function (temp, data, regexp) {
      if (!(Object.prototype.toString.call(data) === '[object Array]')) data = [data];
      var ret = [];
      for (var i = 0, j = data.length; i < j; i++) {
        ret.push(replaceAction(data[i]));
      }
      return ret.join('');

      function replaceAction(object) {
        return temp.replace(regexp || (/{([^}]+)}/g), function (match, name) {
          if (match.charAt(0) == '\\') return match.slice(1);
          return (object[name] != undefined) ? object[name] : '{' + name + '}';
        });
      }
    },
    JSON: (function () {
      var str = function (key, holder) {
        var i, k, v, length, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        switch (typeof value) {
          case "string":
            return quote(value);
          case "number":
            return isFinite(value) ? String(value) : "null";
          case "boolean":
          case "null":
            return String(value);
          case "object":
            if (!value) {
              return "null";
            }
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
              length = value.length;
              for (i = 0; i < length; i += 1) {
                partial[i] = str(i, value) || "null";
              }
              v = partial.length === 0 ? "[]" : "[" + partial.join(",") + "]";
              return v;
            }
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + ":" + v);
                }
              }
            }
            v = partial.length === 0 ? "{}" : "{" + partial.join(",") + "}";
            return v;
        }
      };
      var parse = function (sJSON) {
        return eval('(' + sJSON + ')');
      };
      var stringify = function (value) {
        return str("", { "": value });
      };
      var meta = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "''": "\\''",
        "\\": "\\\\"
      };
      var rx_escapable = new RegExp('[\\\"\\\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', "g");
      var quote = function (string) {
        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ? '"' + string.replace(rx_escapable, function (a) {
          var c = meta[a];
          return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      };

      return {
        parse: parse,
        stringify: stringify
      };
    })(),
    copy: function (target, source) {
      for (var key in source) {
        target[key] = source[key];
      }
    },
    noop: function () { },
    getRandom: function (range) {
      return Math.floor(Math.random() * range);
    },
    getTimestamp: function (timestamp) {
      var date = new Date();
      if (timestamp > 0) {
        date = new Date(timestamp);
      }
      return date.getTime();
    },
    forEach: function (obj, callback) {
      callback = callback || RongUtil.noop;
      var loopObj = function () {
        for (var key in obj) {
          callback(obj[key], key, obj);
        }
      };
      var loopArr = function () {
        for (var i = 0, len = obj.length; i < len; i++) {
          callback(obj[i], i);
        }
      };
      if (utils.isObject(obj)) {
        loopObj();
      }
      if (utils.isArray(obj)) {
        loopArr();
      }
    },
    /* 
      var option = {
        url: '',
        method: '',
        headers: {},
        success: function(){},
        fail: function(){}
      };
    
    */
    ajax: function (option) {
      var getXHR = function () {
        var xhr = null;
        var hasXDomain = function () {
          return (typeof XDomainRequest != 'undefined');
        };
        var hasXMLRequest = function () {
          return (typeof XMLHttpRequest != 'undefined');
        };
        if (hasXDomain()) {
          xhr = new XDomainRequest();
        } else if (hasXMLRequest()) {
          xhr = new XMLHttpRequest();
        } else {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhr;
      };

      var xhr = getXHR();
      var method = option.method || 'GET';
      var url = option.url;
      var queryStrings = option.queryStrings || {};
      var tpl = '{key}={value}', strings = [];
      utils.forEach(queryStrings, function (value, key) {
        var str = utils.tplEngine(tpl, {
          key: key,
          value: value
        });
        strings.push(str);
      });
      var queryString = strings.join('&');
      var urlTpl = '{url}?{queryString}';
      url = utils.tplEngine(urlTpl, {
        url: url,
        queryString: queryString
      });

      xhr.open(method, url, true);

      var headers = option.headers || {};
      utils.forEach(headers, function (header, name) {
        xhr.setRequestHeader(name, header);
      });

      var success = option.success || utils.noop;
      var fail = option.fail || utils.noop;
      var isSuccess = function (result ) {
        return /^(200|202)$/.test(result.code);
      };

      var onLoad = function () {
          var result = xhr.responseText;
          if (result != '') {
            result = utils.JSON.parse(xhr.responseText);
          }
          if (isSuccess(result )) {
            success(result);
          } else {
            fail(result);
          }
      };
      if ('onload' in xhr) {
        xhr.onload = onLoad;
      }
      else {
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            onLoad();
          }
        };
      }
      xhr.send(null);
    },
    getProtocol: function () {
      var protocol = location.protocol;
      var isLocal = (protocol == 'file:');
      if (isLocal) {
        protocol = 'http:';
      }
      return protocol;
    },
    Cache: function () {
      var _cache = {};
      this.cache = _cache;
      this.set = function (key, value) {
        _cache[key] = value;
      };
      this.get = function (key) {
        return _cache[key];
      };
      this.remove = function (key) {
        delete _cache[key];
      };
    },
    rename: function (origin, newNames) {
      var isObject = utils.isObject(origin);
      if (isObject) {
        origin = [origin];
      }
      var utilJSON = utils.JSON;
      origin = utilJSON.parse(utilJSON.stringify(origin));
      var updateProperty = function (val, key, obj) {
        delete obj[key];
        key = newNames[key];
        obj[key] = val;
      };
      utils.forEach(origin, function (item) {
        utils.forEach(item, function (val, key, obj) {
          var isRename = (key in newNames);
          (isRename ? updateProperty : utils.noop)(val, key, obj);
        });
      });
      return isObject ? origin[0] : origin;
    },
    isObject: function (obj) {
      return (Object.prototype.toString.call(obj) == '[object Object]');
    },
    isArray: function (arr) {
      return (Object.prototype.toString.call(arr) == '[object Array]');
    },
    isFunction: function (arr) {
      return (Object.prototype.toString.call(arr) == '[object Function]');
    }
  };

  var config = {
    appkey: '',
    url: 'stickerservice.ronghub.com'
  };

  var StickerCache = new utils.Cache();

  var getSignature = function (data) {
    var appkey = utils.sha1(data.appkey);
    var nonce = data.nonce;
    var timestamp = data.timestamp;
    var tpl = '{appkey}{nonce}{timestamp}';
    var content = utils.tplEngine(tpl, {
      appkey: appkey,
      nonce: nonce,
      timestamp: timestamp
    });
    return utils.sha1(content);
  };

  var getQueryStrings = function () {
    var headers = {
      appkey: config.appkey,
      nonce: utils.getRandom(10000),
      timestamp: utils.getTimestamp()
    };
    var signature = getSignature(headers);
    utils.copy(headers, {
      signature: signature
    });
    return headers;
  };

  var getUrl = function (data) {
    var pathes = {
      'get-sticker': '/emoticonservice/emopkgs/{packageId}/stickers/{stickerId}',
      'get-packages': '/emoticonservice/emopkgs',
      'get-stickers': '/emoticonservice/emopkgs/{packageId}/stickers'
    };

    var path = pathes[data.type] || '';
    var tpl = utils.tplEngine('{protocol}//{host}{path}', {
      path: path
    });

    utils.copy(data, {
      protocol: utils.getProtocol(),
      host: config.url
    });
    var url = utils.tplEngine(tpl, data);
    return url;
  };

  var errorHandler = function (result) {
    var errors = {
      1004: {
        code: 1004,
        msg: '签名错误'
      },
      403: {
        code: 403,
        msg: 'AppKey 无效，请移步融云开发者后台获取 AppKey: https://developer.rongcloud.cn/'
      }
    };
    var error = errors[result.code];
    if (!error) {
      error = {
        code: 20000,
        msg: result
      };
    }
    return error;
  }

  var RequestCache = new utils.Cache();
  /* 
    rongSticker.Proxy.set(function(option, callback){
      //dosomething request
      var result = {}, error = null;
      callback(result, error);
    });
  */
  var requestProxy = function(proxy){
    if(utils.isFunction(proxy)){
      RequestCache.set('proxy', proxy);
    }
  };

  var innerProxy = function(option, callback){
    var url = getUrl(option);
    var queryStrings = getQueryStrings();
    utils.ajax({
      url: url,
      queryStrings: queryStrings,
      success: function (result) {
        var error = null;
        callback(result, error);
      },
      fail: function (error) {
        var result = null;
        callback(result, errorHandler(error));
      }
    });
  };
  RequestCache.set('proxy', innerProxy);

  var request = function (option, callback) {
    var proxy = RequestCache.get('proxy');
    proxy(option, callback);
  };

  var get = function (message, callback) {
    var packageId = message.packageId,
      stickerId = message.stickerId;

    var error = null;

    var stickers = StickerCache.get(packageId) || {};
    var sticker = stickers[stickerId];
    if (utils.isObject(sticker)) {
      utils.copy(sticker, {
        packageId: packageId,
        stickerId: stickerId
      });
      return callback(sticker, error);
    }

    var option = {
      type: 'get-sticker',
      packageId: packageId,
      stickerId: stickerId
    };
    request(option, function (result, error) {
      if (error) {
        return callback(result, error);
      }
      var sticker = result.data;
      sticker = utils.rename(sticker, {
        digest: 'desc',
        pkgId: 'packageId'
      });
      callback(sticker, error)
    });
  };

  var updatePackageCache = function(packages){
    var cachePackages = StickerCache.get('packages') || [];

    packages = packages.concat(cachePackages);

    var tmpPkg = {};
    utils.forEach(packages, function(package){
      tmpPkg[package.id] = package;
    });
    var pkgs = [];
    utils.forEach(tmpPkg, function(pkg){
      pkgs.push(pkg);
    });
    StickerCache.set('packages', pkgs);
  };

  var updateStickerCache = function(packageId, stickers){
    var tpl = '{id}_list';
    var key = utils.tplEngine(tpl, {
      id: packageId
    });

    var cacheStickers = StickerCache.get(key) || {};
    utils.forEach(stickers, function (sticker) {
      cacheStickers[sticker.stickerId] = sticker;
    });
    if(stickers.length > 0){
      // 为 getStickers 缓存
      StickerCache.set(key, stickers);
      // 为 get 获取单个 Sticker 方法缓存数据
      StickerCache.set(packageId, cacheStickers);
    }
  };

  /* 
  var packages = [{
    id: '',
    icon: '',
    name: '',
    order: 10,
    poster: '',
    stickers: [{
      packageId: '',
      stickerId: '',
      thumbUrl: '',
      url: '',
      desc: '描述',
      height: 100,
      width: 100
    }]
  }];
  */
  var extend = function (packages) {
    if (!utils.isArray(packages)) {
      throw new Error('Packages must be array');
    }

    utils.forEach(packages, function (package) {
      var stickers = package.stickers || [];
      
      //远程获取没有 stickers 此处删除为了保证本地、远程获取数据一致
      delete package.stickers;

      updateStickerCache(package.id, stickers);
    });
    updatePackageCache(packages);
  };

  var getPackages = function (callback) {
    callback = callback || utils.noop;

    var option = {
      type: 'get-packages'
    };
    request(option, function (result, error) {
      if (error) {
        return callback(result, error);
      }
      result = result.data;
      result = utils.rename(result, {
        manualLoad: 'packages'
      });

      var packages = result.packages;
      packages = packages.concat(result.preload);

      var filterProps = function (pack) {
        delete pack.createTime;
        delete pack.pkgType;
        return pack;
      };

      utils.forEach(packages, function (pack, index) {
        pack = utils.rename(pack, {
          packageId: 'id',
          digest: 'desc',
          cover: 'poster',
          isPreload: 'type'
        });
        packages[index] = filterProps(pack);
      });

      updatePackageCache(packages);
      result = {
        packages: StickerCache.get('packages')
      };
      callback(result, error);
    });
  };

  var getStickers = function (package, callback) {
    var id = package.id;
    
    var tpl = '{id}_list';
    var key = utils.tplEngine(tpl, {
      id: id
    });
    var stickers = StickerCache.get(key);
    var error = null;
    if(stickers){
      return callback({stickers: stickers}, error);
    }

    var option = {
      type: 'get-stickers',
      packageId: id
    };
    request(option, function (result, error) {
      if (error) {
        result = { data: { stickers: [] } };
      }
      var data = result.data;
      var stickers = data.stickers;

      utils.forEach(stickers, function (sticker, index) {
        sticker = utils.rename(sticker, {
          digest: 'desc'
        });
        utils.copy(sticker, {
          packageId: id
        });
        stickers[index] = sticker;
      });
      updateStickerCache(id, stickers);
      result = {stickers: stickers};
      callback(result, error);
    });
  };
  var init = function (_config) {
    utils.copy(config, _config);
    var extensions = config.extensions;
    if(utils.isArray(extensions)){
      extend(extensions);
    }
    return {
      Sticker: {
        get: get,
        getList: getStickers
      },
      Package: {
        getList: getPackages
      },
      Proxy: {
        set: requestProxy
      },
      utils: utils
    };
  };

  return {
    init: init
  };
});