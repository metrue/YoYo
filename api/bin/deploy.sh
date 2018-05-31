#!/bin/bash

set -e

stage=$1
./node_modules/.bin/sls deploy -v \
  --stage ${stage} \
  --DYNAMODB_TABLE YoYo-${stage} \
  --SENDGRID_API_KEY ${SENDGRID_API_KEY} \
  --SITE_OWNER_EMAIL ${SITE_OWNER_EMAIL}
