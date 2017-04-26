## YoYo

一个从不打扰阅读的评论服务。

### 用法

将以下代码放在您要试用 YoYo 评论服务的任何页面中：

```
<div id ="YoYo"> </ div>
<script src ="https://yoyo.minghe.me/dist/v0.1/index.js"></ script>
```

### 部署自己的 YoYo 评论服务

YoYo 目前基于 Docker 部署在一台 VPS 上. 你可以很简单在自己的主机上部署自己的 YoYo 评论服务.

* 在你的主机上安装 docker 和 docker-compose
  [docker]（https://docs.docker.com/get-started/）
  [docker-compose]（https://docs.docker.com/compose/install/）

* 自定义你的nginx.conf，在 devops目录下的默认 nginx.conf 是为我的 YoYo 服务完全准备的，不过它应该是一个很好的例子, 而且它也开启了 https.

* 编译 YoYo 各服务的镜像

```
  docker-compose -f devops/compose.yml build
```

* 启动 YoYo 各服务

```
  docker-compose -f devops / compose.yml up
```

一切就OK了, 你的 YoYo 后端 API 部署在: <your-server-ip>/v1/api, 你的 YoYo 前端JavaScript代码位于: <your-server-ip>/dist/v0.1/index.js

### 参与开发

* clone YoYo

```
git clone https://github.com/metrue/YoYo
```

* 启动 YoYo API Server

```
cd YoYo/backend && npm run start
```

* 启动 YoYo client

```
cd YoYo/client && npm run develop
```

你即可在 https://localhost:8080 看到 YoYo 的评论框了


### 他们正在试用 YoYo

* [https://minghe.me](https://minghe.me)
* [https://asmalltalk.com](https://asmalltalk.com)

### LICENSE

MIT
