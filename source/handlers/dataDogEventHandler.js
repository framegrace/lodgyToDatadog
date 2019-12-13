const superagent = require('superagent');

class dataDogEventHandler {


    constructor(api_host,api_key,priority,alert_type) {

        this.URL = api_host ? api_host : "https://api.datadoghq.com/api/v1";
        this.API_KEY = api_key ? api_key : "BLAH";
        this.priority = priority ? priority : "normal";
        this.alert_type = alert_type ? alert_type : "error";

        this.datamapping = {
            "title": "alert_name",
            "text": "search_link",
            "date_happened": "start_time",
            "tags": "source_group"
        }
    }

    received(res) {
        console.log("Received Something")
    }


    async sendEvent(event) {
        let DDURL = `${this.URL}/events`
        try {
            let response
            response = superagent.post(DDURL)
                .set('Content-type', 'application/json')
                .query({ api_key: this.API_KEY })
                .send(event)
                .set('accept', 'json')
                .then(resp => { return resp.body; });
            return response;
        } catch (err) {
            return err;
        }

    }

    generateDataDogEventFromLodgy(lodgyAlert) {
        //validate all data needed
        if (typeof lodgyAlert === 'undefined' || lodgyAlert === null) return null;
        for (let key in this.datamapping) {
            if (!(this.datamapping[key] in lodgyAlert)) {
                console.log("Returning null")
                return null;
            }
        }
        let date_d = new Date(lodgyAlert.start_time);
        if (date_d.getFullYear() == 2001) {
            date_d.setFullYear(new Date().getFullYear());
        }
        let date_int = date_d.getTime() / 1000;
        let Event = {
            title: lodgyAlert.alert_name,
            text: `LodgyAlert: ${lodgyAlert.search_link}`,
            priority: this.priority,
            tags: ["source:lodgy", `lodgy_group:${lodgyAlert.source_group}`],
            alert_type: this.alert_type,
            aggregation_key: "lodgy",
            date_happened: date_int
        }
        return Event;
    }

}

module.exports = dataDogEventHandler;