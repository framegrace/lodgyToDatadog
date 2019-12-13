var http = require('http');

// Reads configuration
const config = require('../config.json');
const ddcfg = config.datadog ? config.datadog : {};

// Creates the handles using configuration parameters
const Handler = require('./handlers/lodgyAlertHandler');
const DDHandler = require('./handlers/dataDogEventHandler');
const handler = new Handler();
const ddhandler = new DDHandler(ddcfg.api_host, ddcfg.api_key, ddcfg.priority, ddcfg.alert_type);

// Sets up the callback URL from the configuration file. Defaults to /alert 
const CallBackUrl = config.lodgycallbackurl ? config.lodgycallbackurl : '/alert';

console.log("Creating Server");

// Initiate node.js server
http.createServer(function (request, response) {
    const { headers, method, url } = request;

    let body = [];
    response.on('error', (err) => {
        console.error(err);
    });

    request.on('error', (err) => {
        console.error(err);
        response.statusCode = 400;
        response.end()
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        // We received a request
        body = Buffer.concat(body).toString();
        console.log("%s %s %s", request.url, request.method);
        if (request.method === 'POST') {
            // It's a POST. Wer check the URL part
            switch (request.url) {
                // If it's our configured URL...
                case CallBackUrl:
                    console.log("Received an alert..");
                    // We validate and generate a lodgyAlert object from the JSON request
                    let lodgyAlert = handler.generateLodgyAlert(body);
                    if (lodgyAlert != null) {
                        // lodgyAlert is valid
                        // We create an event from the lodgyAlert object
                        let ddevent = ddhandler.generateDataDogEventFromLodgy(lodgyAlert);
                        // If event is valid
                        if (ddevent != null) {
                            // We send the event to datadog
                            ddhandler.sendEvent(ddevent)
                                .then(res => { console.log("Event sent");console.log(res.status);console.log(res) }) // Request OK
                                .catch(err => { console.log("Datadog error: %s %s", err.status, err.message) }); //Log Request KO
                        } else {
                            // We log an error if the event object was wrong
                            console.log("Unable to parse event")
                        }
                    } else {
                        // We log an error if the lodgy object was wrong
                        console.log("Unable to parse lodgy alert")
                    }
                    break
                default:
                    // Anything not our URL, it's a not found
                    response.statusCode = 404
            }
        } else {
            // Every GET request, it's a not found
            response.statusCode = 404;
        }
        // Send the response
        response.end();
    });
}).listen(80, '0.0.0.0');