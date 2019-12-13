// Datadog handler.
const superagent = require('superagent');

class dataDogEventHandler {

    // Constructor with all the parameters received
    // from the config file. (Could have passed the 
    // object, but this makes code more clear)
    constructor(api_host,api_key,priority,alert_type) {
        // Assign object variables to received one,
        // with defaults for testing.
        this.URL = api_host ? api_host : "https://api.datadoghq.com/api/v1";
        this.API_KEY = api_key ? api_key : "BLAH";
        this.priority = priority ? priority : "normal";
        this.alert_type = alert_type ? alert_type : "error";
        // Map to know if we have all the lodgy attributes needed
        // and to easy assign them.
        //   "DD attribute"_: "LODGY attribute"
        this.datamapping = {
            "title": "alert_name",
            "text": "search_link",
            "date_happened": "start_time",
            "tags": "source_group"
        }
    }

    // Sends an event to datadog
    async sendEvent(event) {
        // URL from config 
        let DDURL = `${this.URL}/events`
        try {
            // Send the event with the correct api_key
            // from the config file
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

    // Generates a DD Event object from the lodgy one
    generateDataDogEventFromLodgy(lodgyAlert) {
        //validate nulls and that we have all data needed
        if (typeof lodgyAlert === 'undefined' || lodgyAlert === null) return null;
        // For every object in the map, checks if available on lodgy
        for (let key in this.datamapping) {
            if (!(this.datamapping[key] in lodgyAlert)) {
                console.log("Returning null")
                return null;
            }
        }
        // Event object needs a timestamp. Lodgy has a lousy date
        let date_d = new Date(lodgyAlert.start_time);
        if (date_d.getFullYear() == 2001) {
            date_d.setFullYear(new Date().getFullYear());
        }
        let date_int = date_d.getTime() / 1000;

        // Create and fill the Event object
        let Event = {
            title: lodgyAlert.alert_name,
            text: `LodgyAlert: ${lodgyAlert.search_link}`,
            priority: this.priority,
            tags: ["source:lodgy", `lodgy_group:${lodgyAlert.source_group}`],
            alert_type: this.alert_type,
            aggregation_key: "lodgy",
            date_happened: date_int
        }
        // and return it
        return Event;
    }

}

module.exports = dataDogEventHandler;