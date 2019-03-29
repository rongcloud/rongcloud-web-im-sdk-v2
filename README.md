# 融云 RongCloud Web IM SDK v2.0

## Environment Setup

### 初始化开发工具

```
npm install -g typescript@1.6.2 tsd typedoc coffee-script grunt-cli karma-cli
```

如有必要，使用 `sudo npm`

### 安装依赖库

在项目根目录下执行：

```
npm install
npm install npm-shrinkwrap
bower install
tsd install
```

### 编译开发代码

```
grunt build
```

### 发布正式代码

```
grunt release
```

### 使用

拷贝 `dist` 目录下 RongIMLib.js 至项目，用法请参考参考 [WebSDK 开发指南](http://rongcloud.cn/docs/web.html) 
