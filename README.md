# 融云 RongCloud Web IM SDK v2.0

## Environment Setup

### 初始化开发工具

```
npm install -g typescript@1.6.0beta tsd typedoc coffee-script grunt-cli karma-cli
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

### 启动测试用例

```
grunt karma
```

### 编译开发代码

```
grunt build
```

### 发布正式代码

```
grunt release
```

### 启动本地服务器

```
grunt connect
```

### 在浏览器中打开

[http://localhost:8282](http://localhost:8282)

## Coding Guidelines

https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines
