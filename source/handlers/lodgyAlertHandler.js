class lodgyAlertHandler {

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

    generateLodgyAlert(body) {
        try {
            let lodgyAlert = JSON.parse(body);
            // Simple validation of received object,
            // using an object template
            for (let key in this.lodgyAlertTemplate) {
                if (!lodgyAlert[key]) {
                    // Not a valid object
                    return null
                }
            }
            return lodgyAlert;
        } catch (err) {
            console.log("Invalid JSON: %s", err.message);
            return null;
        }
    }
}

module.exports = lodgyAlertHandler;