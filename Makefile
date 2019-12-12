SRC_DIR := ./source
SRC_FILES := $(wildcard $(SRC_DIR)/*.js)

docker: $(SRC_FILES) Dockerfile
	docker build --target runner -t runner .
docker-run: docker
	docker run --rm -p 8080:8080 --name lodgytodatadog runner
docker-shell: docker-run
	docker exec -it lodgytodatadog "/bin/sh" 
docker-test:
	docker build --target test -t test .
	docker run --rm test
docker-stop:
	docker stop lodgytodatadog