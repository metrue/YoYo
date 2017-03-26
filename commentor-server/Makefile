deploy:
	aws s3api create-bucket --bucket YoYo-commentor --acl private
	aws --region us-east-1 cloudformation package --template-file ./lib/spec.yml --output-template-file ./lib/def.yml --s3-bucket YoYo-commentor
	aws --region us-east-1 cloudformation deploy --template-file ./lib/def.yml --stack-name commentor --capabilities CAPABILITY_IAM
	@echo "\nCreated api:"
	@aws apigateway get-rest-apis --region us-east-1
	@echo "\nTo get it's stages, execute:\naws apigateway get-stages --region us-east-1 --rest-api-id <api-id>"
	@echo "\nPlease create an api key and enable it to the created api by:\naws apigateway create-api-key --region us-east-1 --enable --name <key-name> --stage-keys restApiId=<api-id>,stageName=<stage-name>"
	@echo "\nTo generate api invoking url, execute:\n./apiUrlGenerator <api-id> <stage-name>"

test:
	node test/index.js

.PHONY: deploy test
