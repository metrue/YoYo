<p align="center">
  <img src="https://github.com/metrue/YoYo/raw/master/YoYo.png"/>
</p>

A dead simple comment engine alternative to Disqus.

---

<p align="center">
  <img src="https://circleci.com/gh/metrue/YoYo.svg?&style=shield&circle-token=964ea66301703e4612ad72ec839ba2d4fa2f98b4"/>
  <img src="https://codecov.io/github/metrue/YoYo/coverage.svg?branch=master"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg"/>
</p>
<p align="center">
  <img src="https://github.com/metrue/YoYo/raw/master/screenshot.png" width='200' height='352' style="border: solid lightgrey 1px;"/>
  <img src="https://github.com/metrue/YoYo/raw/master/screenshot-zh.png" width='200' height='352' style="border: solid lightgrey 1px;"/>
</p>

### Usage

Place the following code where you'd like YoYo to load:

```
<div id="YoYo"></div>
<script src="https://c.minghe.me/client/dist/index.js"></script>
```

### How to

Make sure you have a MongoDB running on your host, then

```
make start
```
one command and all set.

* [http://localhost:5002/client](http://localhost:5002/client) is the comment box of YoYo
* [http://localhost:5002/admin](http://localhost:5002/admin) is the comment management dashbord of YoYo
* [http://localhost:5002/v1/api](http://localhost:5002/v1/api) is the backend api service

For more details you can check out the documents of backend, client and admin dashboard

* [docs](https://github.com/metrue/YoYo/blob/master/backend/README.md) of YoYo backend
* [docs](https://github.com/metrue/YoYo/blob/master/client/README.md) of YoYo client
* [docs](https://github.com/metrue/YoYo/blob/master/admin/README.md) of YoYo admin dashboard

### Showcases

* [https://minghe.me](https://minghe.me)
* [https://asmalltalk.com](https://asmalltalk.com)
* [https://singular.fm](https://singular.fm/)

### LICENSE

MIT
