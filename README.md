## YoYo

a comment service built on top of AWS lambda.

### prerequisites

* [apex](http://apex.run/)

### Deploy serverless backend

* deploy lambda functions

```
  cd server/functions/create && npm install
  cd ../../ && make deploy
```

* migrate db

```
  cd server
  make migration-up
```

* test your deploy

```
  cd server
  make test-deploy
```

You should get a response like this

```
{"Items":[{"content":{"S":"test-content-2"},"uri":{"S":"https://twitter.com"},"user":{"S":"test-2"},"date":{"S":"2014-12-12"},"id":{"S":"78c6f170-0ba6-11e7-a815-2937ace0d942"}}],"Count":1,"ScannedCount":1}
```

### Deploy server by cloudformation

First of all, you need to assign enough permission to current IAM user. In the aws IAM console, create a custom policy with bellow content:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1449904348000",
      "Effect": "Allow",
      "Action": [
        "iam:*",
        "cloudformation:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

Then assign to the group of current IAM user.

* deployment

```
  cd commentor-server
  make deploy
```

* test the deployment

 you need to setup the config.json with infomations from deployment step properly, then:
```
  make test
```

### Build comment box

```
  cd client
  npm install
  npm run develop
```

then check out your demo comment service on [http://localhost:8080](http://localhost:8080)

### License

MIT
