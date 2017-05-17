deploy_local:
	docker-compose -f devops/local/compose.yml build && docker-compose -f devops/local/compose.yml up mongo api client admin
deploy_production:
	./devops/local/letsencrypt.sh && docker-compose -f devops/local/compose.yml build && docker-compose -f devops/local/compose.yml up
