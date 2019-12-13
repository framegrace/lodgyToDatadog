/* test/test_lodgyAlertHandler.js */
const axios = require('axios');
var Handler = require('../source/handlers/dataDogEventHandler');
handler=new Handler();
var expect = require('chai').expect;


const nock = require('nock')

const scope = nock('https://api.datadoghq.com')
  .post('/api/v1/events')
  .reply(200, {
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT',
      url: 'https://api.github.com/licenses/mit',
      node_id: 'MDc6TGljZW5zZTEz',
    },
  })

let lodgyAlert = {
  "alert_name":"IndexOutOfBounds Exception",
  "edit_alert_link" : "https:sample.loggly.com/alerts/edit/8188",
  "source_group" : "N/A",
  "start_time" : "Mar 17 11:41:40",
  "end_time" : "Mar 17 11:46:40",
  "search_link" : "https:sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323",
  "query" : "* ",
  "num_hits" : 225,
  "recent_hits" : [ ],
  "owner_username" : "sample",
  "owner_subdomain" : "sample",
  "owner_email" : "pm@loggly.com"
}

let sampleDateYearlodgy = {
  "alert_name":"IndexOutOfBounds Exception",
  "edit_alert_link" : "https:sample.loggly.com/alerts/edit/8188",
  "source_group" : "N/A",
  "start_time" : "2019 Mar 17 11:41:40",
  "end_time" : "Mar 17 11:46:40",
  "search_link" : "https:sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323",
  "query" : "* ",
  "num_hits" : 225,
  "recent_hits" : [ ],
  "owner_username" : "sample",
  "owner_subdomain" : "sample",
  "owner_email" : "pm@loggly.com"
}
let sampleBadLodgy = {
  "alert_name" : "IndexOutOfBounds Exception",
  "edit_alert_link" : "https:sample.loggly.com/alerts/edit/8188",
  "source_group" : "N/A",
  "Something" : { "with": "things inside" },
  "Something Else" : "Blah"
}


let sampleEvent = {
   "title": "IndexOutOfBounds Exception",
   "text": "LodgyAlert: https:sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323",
   "priority": "normal",
   "tags": [ "source:lodgy" , "lodgy_group:N/A"],
   "alert_type": "error",
   "aggregation_key": "lodgy",
   "date_happened": 1552822900
}


describe('#generateDataDogEventFromLodgy', function() {

  context('with wrong arguments', function() {
   it('should return null with no arguments', function() {
      expect(handler.generateDataDogEventFromLodgy()).to.null
    })
    it('should return Null with empty object', function() {
      expect(handler.generateDataDogEventFromLodgy({})).to.null
    })
  })
  

   context('with lodgy objects', function() {
    it('Should return null on wrong object.', function() {
      expect(handler.generateDataDogEventFromLodgy(sampleBadLodgy)).to.null
    })
    it('Should return the correct even on dates with years.', function() {
      expect(handler.generateDataDogEventFromLodgy(sampleDateYearlodgy)).to.deep.equal(sampleEvent);
    })
    it('Should return the correct event with correct format', function() {
      expect(handler.generateDataDogEventFromLodgy(lodgyAlert)).to.deep.equal(sampleEvent);
    })
   })

   context('Send Evenr', function() {
    it('Should return something.', () => {
      expect(handler.sendEvent(sampleEvent)).to.deep.equal({
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz',
        }})
    })
   })
})