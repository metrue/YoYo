deploy:
	aws s3api create-bucket --bucket luosw-projects --acl private
	aws --region us-east-1 cloudformation package --template-file ./lib/spec.yml --output-template-file ./lib/def.yml --s3-bucket luosw-projects
	aws --region us-east-1 cloudformation deploy --template-file ./lib/def.yml --stack-name commentor --capabilities CAPABILITY_IAM

test:
	node test/index.js

.PHONY: deploy test
