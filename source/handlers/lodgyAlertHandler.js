// Handles lodgy Requests
class lodgyAlertHandler {

    // We create a template to validate the receiving object-
    // Anyhting we receive, has to have this properties.
    constructor() {
        this.lodgyAlertTemplate = {
            "alert_name": "",
            "edit_alert_link": "",
            "source_group": "",
            "start_time": "",
            "end_time": "",
            "search_link": "",
            "query": "",
            "num_hits": 0,
            "recent_hits": [],
            "owner_username": "",
            "owner_subdomain": "",
            "owner_email": ""
        };
    }

    // Generating a lodgyAlert object from json text
    generateLodgyAlert(body) {
        try {
            // Parse json into JS object.
            let lodgyAlert = JSON.parse(body);
            // Simple validation of received object,
            // using the object template
            for (let key in this.lodgyAlertTemplate) {
                if (!lodgyAlert[key]) {
                    // Not a valid object
                    return null
                }
            }
            // We return it
            return lodgyAlert;
        } catch (err) {
            // Or log an error and return null
            console.log("Invalid JSON: %s", err.message);
            return null;
        }
    }
}

module.exports = lodgyAlertHandler;