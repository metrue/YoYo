build-admin:
	cd admin && npm run build-prod
build-client:
	cd client && npm run build-prod
deploy_local:
	docker-compose -f devops/compose.yml build && docker-compose -f devops/compose.yml up
