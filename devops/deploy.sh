#!/bin/bash

ssh ${target_host} <<END
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

  rm -rf /tmp/YoYo
  git clone https://github.com/metrue/YoYo /tmp/YoYo
  cd /tmp/YoYo

  docker-compose -p yoyo -f devops/compose.yml build && \
  docker-compose -p yoyo -f devops/compose.yml up -d && \
END
