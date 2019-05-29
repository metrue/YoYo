<p align="center">
  <img src="https://github.com/metrue/YoYo/raw/master/YoYo.png"/>
</p>

A dead simple comment engine alternative to Disqus. [https://minghe.me/yoyo/](https://minghe.me/yoyo/)

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
<script src="https://yoyo-client-production.s3.amazonaws.com/dist/index.js"></script>
```

### Deploy On You Own

YoYo is build on top of AWS, so you have to have a [AWS Account](https://console.aws.amazon.com/console/home?region=us-east-1) and setup your [AWS Credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html) ready.

[YoYo APIs](https://github.com/metrue/YoYo/tree/master/api) is runing on [AWS Lambda](https://console.aws.amazon.com/lambda/home?region=us-east-1), [AWS API Gateway](https://console.aws.amazon.com/apigateway/home?region=us-east-1), and [AWS Dynamodb](https://console.aws.amazon.com/dynamodb/home?region=us-east-1).

[YoYo client](https://github.com/metrue/YoYo/tree/master/client) is build on top React, then deployed on [AWS S3](https://s3.console.aws.amazon.com/s3/home?region=us-east-1) with [AWS CloudFront](https://console.aws.amazon.com/cloudfront/home?region=us-east-1).

* Deploy API

```
$ cd api
$ npm install
$ npm run deploy:production # or npm run deploy:staging, npm run deploy:testing
```

Run test on API:
```
$ YOYO_EMAIL=h.minghe+YoYo@gmail.com \
    SENDGRID_API_KEY=<your sendgrid api key> \
    SITE_OWNER_EMAIL=<your email> \
    npm test
```

* Build Clinet

```
# cd client
# npm install
# npm run build-prod # or 'npm run develop' to do development on local
```

### Showcases

* [https://blog.minghe.me](https://minghe.me)

### LICENSE

MIT
