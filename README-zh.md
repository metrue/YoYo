## YoYo

YoYo 是我尝试打造的一个评论服务，我希望她最终可以成为这样的一个作品:

* 保持简单
  一个简单的评论框，一个简单的回复按钮，一个可以获得回复消息的电子邮件输入框.
* 不打扰阅读
  文章是作者心血，读者为此而来，应该获得安静的阅读体验，而不是充斥着各种社交按钮的丑陋的评论框。
* 不改变页面原有风格
  页面风格是作者自己的心性选择，美感的展现，突兀的夺取眼球是对原作品的不尊重。

### 开发现状

这会是一个持续的作品，我希望自己所有的愿望都变成一行行运行的代码. 目前已经大概实现了基本的功能，不过离我内心想要的还差很多。我希望自己的每一次提交都在改进这个产品. 作为一个工程师，我希望我的代码和这个作品一样: 保持 clean. 我们都知道，这是不容易，不过因为这是一个自己自足的产品，我并不没有deadline, 我给自己足够的思考时间。

### 参与开发

目前 YoYo 的技术栈还算简单和现代，她的所有代码都是 JavaScript 的除了部署相关的几行 Bash 代码之外。她的后端由 Koa 和 Mongo 组合驱动，没有使用任何的 ORM, 而前端选用了 React 来构建，由于目前还很简单，没有复杂的状态管理，所有并没有考虑使用 Redux 或者 Mobx 来管理状态，希望将来也不要。

我特别希望:

* 你可以在你的网站中试用 YoYo, 然后告诉你的体会

* 你可以开 issue 告诉我你对 YoYo 的任何建议, 无论是功能还是设计

* 你作为一个代码洁癖的工程师 review 我的代码

具体的步骤你可以需要这样:

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

你即可在 https://localhost:8080 看到 YoYo 的评论框了, 立即开始你的开发吧。

### 怎么使用

将以下代码放在您要试用 YoYo 评论服务的任何页面中：

```
<div id ="YoYo"> </ div>
<script src ="https://yoyo.minghe.me/dist/v0.1/index.js"></ script>
```

### 部署自己的 YoYo 评论服务

YoYo 目前基于 Docker 部署在一台 VPS 上. 你可以很简单在自己的主机上部署自己的 YoYo 评论服务.

* 在你的主机上安装 docker 和 docker-compose
  1. [docker]（https://docs.docker.com/get-started/）
  2. [docker-compose]（https://docs.docker.com/compose/install/）

* 自定义你的 nginx.conf，在 devops 目录下的默认 nginx.conf 是为我的 YoYo 服务完全准备的，不过它应该是一个很好的例子, 而且它也开启了 https.

* 编译 YoYo 各服务的镜像

```
  docker-compose -f devops/compose.yml build
```

* 启动 YoYo 各服务

```
  docker-compose -f devops / compose.yml up
```

一切就OK了, 你的 YoYo 后端 API 部署在: http://your-server-ip/v1/api, 你的 YoYo 前端JavaScript代码位于: http://your-server-ip/dist/v0.1/index.js


### 他们正在试用 YoYo

* [https://minghe.me](https://minghe.me)
* [https://asmalltalk.com](https://asmalltalk.com)

### LICENSE

MIT
