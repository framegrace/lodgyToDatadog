# Not much use for ths source definitions
# here. But as is a Makefile standard, let's
# do it, who knows if we need to handle files
# individually later in some way.
SRC_DIR := ./source
SRC_FILES := $(wildcard $(SRC_DIR)/*.js)
TEST_DIR := ./test
TEST_FILES := $(wildcard $(TEST_DIR)/*.js)

docker: $(SRC_FILES) Dockerfile
	docker build --target runner -t runner .
docker-run: docker
	docker run -d --rm -v ./config.json:/src/config.json -p 8080:8080 --name lodgytodatadog runner
docker-shell: docker-run
	docker exec -it lodgytodatadog "/bin/sh" 
docker-test: $(TEST_FILES)
	docker build --target test -t test .
	docker run --rm test 
docker-stop:
	docker stop lodgytodatadog