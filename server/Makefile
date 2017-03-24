deploy:
	apex deploy
migration-up:
	apex invoke migration-up
migration-down:
	apex invoke migration-down
test-deploy:
	apex invoke create < test/request.json
	apex invoke query < test/request.json
