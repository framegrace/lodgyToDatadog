var http = require('http');



const Handler = require('./handlers/lodgyAlertHandler');
const DDHandler = require('./handlers/dataDogEventHandler');
const handler = new Handler();
const ddhandler= new DDHandler();



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
        if (request.method === 'POST') {
            switch (request.url) {
                case '/alert':
                    console.log("ReceivedAlert")
                    ddhandler.sendEvent({});
                    //if (handler.Alert(body)) {
                    //    response.statusCode = 200;
                    //    response.setHeader('Content-Type', 'application/json');
                    //    response.write('{ "errorCode": 0 }')
                    //} else {
                    //    response.statusCode = 500;
                    //};
                    break
                default:
                    response.statusCode = 404
            }
        } else {
            response.statusCode = 404;
        }
        response.end();
        console.log("%s %s",request.url);
    });
}).listen(8080, '0.0.0.0');