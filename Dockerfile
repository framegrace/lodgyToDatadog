# Build Just source code not tests, no need to be 
# included on prod deploys. Aaand...
FROM usemtech/nodejs-mocha:latest AS build
WORKDIR /src/
COPY ./package.json /src
COPY ./source/ /src/source
RUN npm install
ENTRYPOINT ["ls","/src"]

# ..then we copy the tests on a separate layer
# which has the added bonus that we are not
# rebuilding everything while developing
# or running tests.
FROM usemtech/nodejs-mocha:latest AS test
WORKDIR /src/
COPY --from=build /src/ /src/
COPY ./test/ /src/test
ENTRYPOINT ["mocha"]

FROM node:8.16-alpine AS runner
WORKDIR /src/source
COPY --from=build /src/source /src/source
ENTRYPOINT node server.js

