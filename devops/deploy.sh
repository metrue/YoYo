#!/bin/bash

env=$1

target_host='root@45.33.106.101'
ssh ${target_host} <<END
  rm -rf /tmp/YoYo
  mkdir -p /tmp/YoYo
END

rsync -avz -e 'ssh' backend root@45.33.106.101:/tmp/YoYo/
rsync -avz -e 'ssh' devops root@45.33.106.101:/tmp/YoYo/
ssh ${target_host} <<END
  rm -rf /tmp/YoYo

  git clone https://github.com/metrue/YoYo /tmp/YoYo

  docker rm \$(docker stop \$(docker ps -a -q --filter ancestor=yoyo  --format="{{.ID}}"))

  docker run --rm -p 80:80 -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt \
    quay.io/letsencrypt/letsencrypt auth \
    --standalone -m h.minghe@gmail.com --agree-tos \
    -d yoyo.minghe.me

    docker run --rm -p 80:80 -p 443:443 \
      -v /etc/letsencrypt:/etc/letsencrypt \
      quay.io/letsencrypt/letsencrypt renew \
      --standalone

  docker-compose -p yoyo -f devops/compose.yml build && \
  docker-compose -p yoyo -f devops/compose.yml up -d && \
END
