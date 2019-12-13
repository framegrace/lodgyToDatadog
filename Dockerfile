# this Javascript doesn't need any compilation
# just linking libraries.
# Set linking on a separate build to only do it
# when dependencies change. (Faster unit testing)
FROM usemtech/nodejs-mocha:latest AS linker
WORKDIR /src/
COPY ./package.json /src
RUN npm install
ENTRYPOINT ["ls","/src"]

# Add the source code
FROM linker AS build
WORKDIR /src/
COPY ./source/ /src/source
ENTRYPOINT ["ls","/src/source"]

# Add the tests for testing only
FROM build AS test
WORKDIR /src/
COPY ./test/ /src/test
ENTRYPOINT ["mocha"]

# Just use the code to run
FROM build AS runner
WORKDIR /src/source
ENTRYPOINT node server.js

