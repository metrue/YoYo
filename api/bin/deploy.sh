#!/bin/bash

set -e

stage=$1
SLS_DEBUG=* ./node_modules/.bin/sls deploy -v \
  --stage ${stage} \
  --YOYO_DB_TABLE YoYo-${stage} \
  --YOYO_EMAIL ${YOYO_EMAIL} \
  --SENDGRID_API_KEY ${SENDGRID_API_KEY} \
  --SITE_OWNER_EMAIL ${SITE_OWNER_EMAIL}
