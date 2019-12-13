const axios = require('axios');

class dataDogEventHandler {

    
    constructor() {
      console.log("CONSTRUCTED!!!")
      this.URL="https://api.datadoghq.com/api/v1"
      this.API_KEY="BLAH"
      this.priority="normal"
      this.alert_type="error"
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
        console.log("Sendin((g event ============");
        let DDURL = `${this.URL}/events`
        console.log(DDURL);
        let response;
        response = await axios.post(DDURL).
            then(res => res.data)
            .catch(error =>
                console.log("Error")
            );
        console.log("WAWA");
        console.log(response);

        return response.data;
    }
    
    sendEventOLD(event) {
        console.log("=== SENDING EVENT ====")
        let DDURL=`${this.URL}/events`
        console.log(DDURL);
        try {
        let response
        response = superagent.request.post(DDURL)
        .query({api_key:this.API_KEY})
        .send(event).
        set('accept','json').then(resp => { return resp.body; });
        //end((err,res) => {
        //    console.log("========================")
        //    if (err) {
        //        return console.log(err);
        //    }
        //    console.log(res.body);
        //});
        
        console.log("SSSS")
        console.log(response);
        console.log("WWWWW")
    } catch (err) {
        console.log("ERROR");
        console.log(err);
    }
    }

    generateDataDogEventFromLodgy(lodgyAlert) {
        //validate all data needed
        if (typeof lodgyAlert === 'undefined' || lodgyAlert === null) return null;
        for(let key in this.datamapping) {
            if (! (this.datamapping[key] in lodgyAlert)) {
               console.log("Returning null")
               return null;
           }
        }
        console.log("Date: %s",lodgyAlert.start_time)
        let date_d=new Date(lodgyAlert.start_time);
        console.log("Datified %s",date_d);
        if (date_d.getFullYear()==2001) {
            date_d.setFullYear(new Date().getFullYear());
        }
        let date_int=date_d.getTime()/1000;
        let Event={
           title: lodgyAlert.alert_name,
           text: `LodgyAlert: ${lodgyAlert.search_link}`,
           priority: this.priority,
           tags: [ "source:lodgy", `lodgy_group:${lodgyAlert.source_group}`],
           alert_type: this.alert_type,
           aggregation_key: "lodgy",
           date_happened: date_int
        }
        return Event;
    }

}

module.exports = dataDogEventHandler;