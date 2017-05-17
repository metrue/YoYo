#!/bin/bash

docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt auth \
  --standalone -m h.minghe@gmail.com --agree-tos \
  -d api.yiqie.me

docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt renew \
  --standalone

docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt auth \
  --standalone -m h.minghe@gmail.com --agree-tos \
  -d admin.yiqie.me

docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt renew \
  --standalone

docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt auth \
  --standalone -m h.minghe@gmail.com --agree-tos \
  -d client.yiqie.me

docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt renew \
  --standalone
