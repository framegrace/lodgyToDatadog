# Not much use for ths source definitions
# here. But as is a Makefile standard, let's
# do it, who knows if we need to handle files
# individually later in some way.
SRC_DIR := ./source
SRC_FILES := $(wildcard $(SRC_DIR)/*.js)
TEST_DIR := ./test
TEST_FILES := $(wildcard $(TEST_DIR)/*.js)

# Builds the app inside on the runner image
docker: $(SRC_FILES) Dockerfile
	docker build --target runner -t runner .

# Builds and runs the runner image. 
# It passes the configuration as a volume. 
# This will have to be adapted to each env.
# Without additional infrastructure (Consul,etc..), seems
# the safer solution.
# Application fails if no config file present.
docker-run: docker
	docker run -d --rm -v `pwd`/config.json:/src/config.json -p 80:80 --name lodgytodatadog runner

# Builds and runs the app image, and shells into it.
docker-shell: docker-run
	docker exec -it lodgytodatadog "/bin/sh"

# Builds the test image and runs the tests
docker-test: $(TEST_FILES)
	docker build --target test -t test .
	docker run --rm test 

# Stops any running app image
docker-stop:
	docker stop lodgytodatadog