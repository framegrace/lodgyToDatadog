# Multistage Dockerfile (docker 17.05 or later)

# Linker
# Setup linking on a separate build. The image
# only generates when dependencies (package.json)
# change.

FROM usemtech/nodejs-mocha:latest AS linker
WORKDIR /src/
# Just copy the dependency file
COPY ./package.json /src
# Run npm to download and install dependencies
RUN npm install
# Instead of empty, we make it do something usefull
ENTRYPOINT ["ls","/src"]

# Add the source code to the previous image
# this image will only be build if code changes
FROM linker AS build
WORKDIR /src/
COPY ./source/ /src/source
ENTRYPOINT ["ls","/src/source"]

# Add the tests to the mix
# will only be rebuild when tests change
FROM build AS test
WORKDIR /src/
COPY ./test/ /src/test
# This is the testing app
ENTRYPOINT ["mocha"]

# Running image, with only the code and deps
# (not tests) to make it as small as possible
FROM build AS runner
WORKDIR /src/source
ENTRYPOINT node server.js

