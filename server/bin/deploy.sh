#!/bin/bash

set -e

function echo_and_run {
  local cmd=$1
  if [[ 'X'${DEBUG} == 'X' ]]; then
    eval ${cmd}
  else
    echo ${cmd}
  fi
}

function create_s3_bucked {
  local name=$1
  local region=$2
	echo_and_run "aws s3api create-bucket --bucket ${name} --region ${region} --acl private"
}

function pack_spec {
  local bucket_name=$1
  local region=$2
	echo_and_run "aws --region ${region} cloudformation package \
      --template-file ./lib/spec.yaml \
      --output-template-file ./lib/def.yaml \
      --s3-bucket ${bucket_name} "
}

function deploy_api {
  local stack_name=$1
  local region=$2
	echo_and_run "aws --region ${region} cloudformation deploy \
    --template-file ./lib/def.yaml \
    --stack-name ${stack_name}  \
    --capabilities CAPABILITY_IAM"
}

function list_created_api {
  local region=$1
	echo_and_run "aws apigateway get-rest-apis --region ${region}"
}

# ++
# suppose we only have on api entity
# ++
function get_api_id {
  local region=$1
	echo_and_run "aws apigateway get-rest-apis --region ${region} | jq -r ''.items[0].id"
}

function list_stage {
  local region=$1
  local api_id=$2
	echo_and_run "aws apigateway get-stages --region ${region} --rest-api-id ${api_id}"
}

function create_api_key {
  local region=$1
  local api_id=$2
  local stage_name=$3
  local key_name=$4
  echo_and_run "aws apigateway create-api-key \
    --region ${region} \
    --enable --name ${key_name} \
    --stage-keys restApiId=${api_id},stageName=${stage_name} | jq -r ''.value"
}

function get_invoke_url {
  local api_id=$1
  local stage_name=$2
  echo "https://${api_id}.execute-api.us-east-1.amazonaws.com/${stage_name}"
}

function generate_config {
  local region=$1
  local invoke_url=$2
  local api_key=$3

  DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  echo "{
  \"region\": \"${region}\",
  \"invoke_url\": \"${invoke_url}\",
  \"apiKey\": \"${api_key}\"
}" > ${DIR}/../test/config.json
}

function deploy {
  S3_BUCKET_NAME='YoYo-luosw'
  REGION='us-east-1'
  STACK_NAME='YoYo-stack'
  API_KEY_NAME='YoYo-api-key'
  # DEBUG=true

  create_s3_bucked ${S3_BUCKET_NAME} ${REGION}
  pack_spec ${S3_BUCKET_NAME} ${REGION}
  deploy_api ${STACK_NAME} ${REGION}
  api_id=$(get_api_id ${REGION})
  api_key=$(create_api_key ${REGION} ${api_id} 'Stage' ${API_KEY_NAME})
  invoke_url=$(get_invoke_url ${api_id} 'Stage')
  generate_config ${REGION} ${invoke_url} ${api_key}
  echo "==============================================================================="
  echo '----------------------------------- deploy done ok ----------------------------'
  echo "==============================================================================="
  echo "API_KEY: ${api_key}"
  echo "invoke url: ${invoke_url}"
  echo "==============================================================================="
}

deploy
