build-admin:
	cd admin && npm run build-prod

build-client:
	cd client && npm run build-prod

copy-assets:
	mkdir -p backend/public/admin
	mkdir -p backend/public/client
	cp -r admin/public/dist backend/public/admin/dist
	cp -r client/public/dist backend/public/client/dist

start:
	make build-admin && make build-client && make copy-assets
	cd backend && \
	YOYO_JWT_SECRET='soooocoooool' \
	YOYO_JWT_EXPIRES_IN='10d' \
	YOYO_ADMIN_USERNAME='admin' \
	YOYO_ADMIN_PASSWORD='admin' \
	npm start

deploy:
	docker-compose -f devops/compose.yml build && docker-compose -f devops/compose.yml up
