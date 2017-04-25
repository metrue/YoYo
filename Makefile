deploy:
	make build-client && make copy-artifacts
	./devops/deploy.sh

build-client:
	cd client && npm run build-prod

copy-artifacts:
	cp client/public/dist/index.js backend/dist/YoYo/index.js
