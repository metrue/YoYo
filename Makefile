build-admin:
	cd admin && npm install && npm run build-prod

build-client:
	cd client && npm install && npm run build-prod

copy-assets:
	mkdir -p backend/public/admin
	mkdir -p backend/public/client
	cp -r admin/public/dist backend/public/admin/dist
	cp -r client/public/dist backend/public/client/dist

start:
	make build-admin && make build-client && make copy-assets
	cd backend && \
	npm install && \
	npm start

deploy:
	docker-compose -f devops/compose.yml build && docker-compose -f devops/compose.yml up
