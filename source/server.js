var http = require('http');


//const config = require('./config.json');
const config = {}
const ddcfg = config.datadog ? config.datadog : {};

const Handler = require('./handlers/lodgyAlertHandler');
const DDHandler = require('./handlers/dataDogEventHandler');
const handler = new Handler();

const ddhandler= new DDHandler(ddcfg.api_host,ddcfg.api_key,ddcfg.priority,ddcfg.alert_type);

const CallBackUrl=config.lodgycallbackurl ? config.lodgycallbackurl : '/alert';

console.log("Creating Server");

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
        body = Buffer.concat(body).toString();
        console.log("%s %s %s",request.url,request.method);
        if (request.method === 'POST') {
            switch (request.url) {
                case CallBackUrl:
                    console.log("Received an alert..");
                    let lodgyAlert=handler.generateLodgyAlert(body);
                    if (lodgyAlert!=null) {
                       let ddevent=ddhandler.generateDataDogEventFromLodgy(lodgyAlert);
                       if (ddevent!=null) {
                         ddhandler.sendEvent(ddevent)
                         .then(res => {console.log("Event sent")})
                         .catch(err => { console.log("Datadog error: %s %s",err.status,err.message)});
                       } else {
                          console.log("Unable to parse event")
                       }
                    } else {
                        console.log("Unable to parse loadgy alert")
                    }
                    break
                default:
                    response.statusCode = 404
            }
        } else {
            response.statusCode = 404;
        }
        response.end();
    });
}).listen(8080, '0.0.0.0');