## YoYo Server

YoYo Server is built on top of [Koa]() and [MongoDB]()

### How to

* Prepare your config.

config.json
```
{
  "host": "127.0.0.1",
  "port": 5002,
  "mongo": {
    "host": "mongo",
    "port": 27017,
    "db": "YoYo"
  },
  "mail": {
    "service": "gmail",
    "user": "yoyo-admin",
    "pass": "password-of-yoyo-admin"
  }
}
```

update the mongo and mail section as you want, YoYo need a email acount to send email notification when comment recieve a reply.

* set few enviroment variables and start YoYo server

YoYo has no user system, but YoYo support administration, use [JWT]() to do the authorization, so some enviroment variables need set before you start the server.

```
$ export YOYO_JWT_SECRET=YOYO_JWT_SECRET
$ export YOYO_JWT_EXPIRES_IN=1d
$ export YOYO_ADMIN_USERNAME=admin
$ export YOYO_ADMIN_PASSWORD=admin
$ npm run start
```

### Test

```
$ npm run test      # run all test
$ npm run coverage  # show the code coverage
```
