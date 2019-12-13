# lodgyToDatadog

## Coding Sample for rover

- Just use the make command as asked in the requirements. Needs Docker 17.05 (Uses multistage dockerfile)
- Configuration is passed on runtime as a volume. (config.js at the root of the project). You can change various settings there. (the Lodgy callback URL, api_key and host for Datadog...)
- Done in javascript (node.js) tests use the "mocha" framework. Mocking HTTP calls with nock.
- Tested working
- Please excuse my lousy node.js programming. Had to re-learn a lot those past 3 days for this project. (Promises? Who invented that)