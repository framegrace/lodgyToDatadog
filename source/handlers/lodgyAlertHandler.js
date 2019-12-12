class lodgyAlertHandler {
    Alert(body) {
        //console.log(body);
        try {
            let lodgyAlert = JSON.parse(body);
            //console.log(" Received ");
            //console.log(lodgyAlert);
        } catch (err) {
            console.log("Invalid JSON: %s",err.message);
            return false;
        }
        return true;
    }
}

module.exports = lodgyAlertHandler;