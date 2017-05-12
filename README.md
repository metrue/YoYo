<p align="center">
  <img src="https://github.com/metrue/YoYo/raw/master/YoYo.png"></img>
</p>

A dead simple, dead lightweight comment engine alternative to Disqus.

![demo]("blob:https://vimeo.com/480c7afb-e0ff-4604-a5b8-c80f0a660f8a")

---

<p align="center">
  <img src="https://circleci.com/gh/metrue/YoYo.svg?&style=shield&circle-token=964ea66301703e4612ad72ec839ba2d4fa2f98b4"></img>
  <img src="https://codecov.io/github/metrue/YoYo/coverage.svg?branch=master"></img>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg"></img>
</p>


### Usage

Place the following code where you'd like YoYo to load:

```
<div id="YoYo"></div>
<script src="https://yoyo.minghe.me/dist/v0.1/index.js"></script>
```

### Installation

* clone YoYo

```
$ git clone https://github.com/metrue/YoYo
```

* start YoYo API Server

YoYo server is using [MongoDB](https://docs.mongodb.com/manual/) as database server, so you need to start your MongoDB server install first.

```
$ mongod
$ cd YoYo/backend && npm run start
```

* start YoYo client

```
$ cd YoYo/client && npm run develop
```

then YoYo is running on https://localhost:8080


### Showcases

* [https://minghe.me](https://minghe.me)
* [https://asmalltalk.com](https://asmalltalk.com)

### LICENSE

MIT
