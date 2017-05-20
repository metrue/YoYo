deploy_local:
	docker-compose -f devops/compose.yml build && docker-compose -f devops/compose.yml up mongo api client admin
deploy_production:
	./devops/letsencrypt.sh && docker-compose -f devops/compose.yml build && docker-compose -f devops/compose.yml up
