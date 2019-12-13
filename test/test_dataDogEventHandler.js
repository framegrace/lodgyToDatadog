/* test/test_lodgyAlertHandler.js */

// Tests the DataDog handler

// Create a new handler with default values
var Handler = require('../source/handlers/dataDogEventHandler');
handler = new Handler();

// Test framework setup. We use som async calls, and needs special
// management.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var expect = chai.expect;

chai.use(chaiAsPromised);

// Mocker up for HTTP requests. We mock up DD calls to make things easy.
const nock = require('nock')

// Sample lodgyAlert as Input 
let lodgyAlert = {
  "alert_name": "IndexOutOfBounds Exception",
  "edit_alert_link": "https:sample.loggly.com/alerts/edit/8188",
  "source_group": "N/A",
  "start_time": "Mar 17 11:41:40",
  "end_time": "Mar 17 11:46:40",
  "search_link": "https:sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323",
  "query": "* ",
  "num_hits": 225,
  "recent_hits": [],
  "owner_username": "sample",
  "owner_subdomain": "sample",
  "owner_email": "pm@loggly.com"
}

// Sample lodgyAlert but with dates with year as Input
let sampleDateYearlodgy = {
  "alert_name": "IndexOutOfBounds Exception",
  "edit_alert_link": "https:sample.loggly.com/alerts/edit/8188",
  "source_group": "N/A",
  "start_time": "2019 Mar 17 11:41:40",
  "end_time": "Mar 17 11:46:40",
  "search_link": "https:sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323",
  "query": "* ",
  "num_hits": 225,
  "recent_hits": [],
  "owner_username": "sample",
  "owner_subdomain": "sample",
  "owner_email": "pm@loggly.com"
}

// A sample Bad lodgy object to test validation
let sampleBadLodgy = {
  "alert_name": "IndexOutOfBounds Exception",
  "edit_alert_link": "https:sample.loggly.com/alerts/edit/8188",
  "source_group": "N/A",
  "Something": { "with": "things inside" },
  "Something Else": "Blah"
}

// Sample event copied from DD but with the sample lodgy
// values
let sampleEvent = {
  "title": "IndexOutOfBounds Exception",
  "text": "LodgyAlert: https:sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323",
  "priority": "normal",
  "tags": ["source:lodgy", "lodgy_group:N/A"],
  "alert_type": "error",
  "aggregation_key": "lodgy",
  "date_happened": 1552822900
}

// This is what DD responds when OK
let sampleResponseEvent= {
  'event':
  {
    'date_happened': 1552822900,
    'handle': 'none',
    'id': 2603387619536318140,
    'priority': 'normal',
    'related_event_id': 'None',
    'tags': ["source:lodgy", "lodgy_group:N/A"],
    'text': 'LodgyAlert: https:sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323',
    'title': 'IndexOutOfBounds Exception',
    'url': 'https://app.datadoghq.com/event/jump_to?event_id=2603387619536318140'
  },
  'status': 'ok'
}

// Prepare the nock Mockup to call DD. 
const scope = nock('https://api.datadoghq.com')
  .post('/api/v1/events', sampleEvent)
  .query({ api_key: 'BLAH' })
  .reply(200, sampleResponseEvent)


// The tests. Self explanatory
describe('#generateDataDogEventFromLodgy', function () {

  context('with wrong arguments', function () {
    it('should return null with no arguments', function () {
      expect(handler.generateDataDogEventFromLodgy()).to.null
    })
    it('should return Null with empty object', function () {
      expect(handler.generateDataDogEventFromLodgy({})).to.null
    })
  })


  context('with lodgy objects', function () {
    it('Should return null on wrong object.', function () {
      expect(handler.generateDataDogEventFromLodgy(sampleBadLodgy)).to.null
    })
    it('Should return the correct even on dates with years.', function () {
      expect(handler.generateDataDogEventFromLodgy(sampleDateYearlodgy)).to.deep.equal(sampleEvent);
    })
    it('Should return the correct event with correct format', function () {
      expect(handler.generateDataDogEventFromLodgy(lodgyAlert)).to.deep.equal(sampleEvent);
    })
  })
  nock('https://api.datadoghq.com', { reqheaders: { 'Content-type': 'application/json'}})
  .post('/api/v1/events', body => { body == sampleEvent} )
  .query(queryObject => {
    if ('api_key' in queryObject) {
         if (queryObject['api_key'] == 'BLAH') {
           return true;
         }
    } 
    return false;
  })
  .reply(200, sampleResponseEvent)

  context('Send Event', function () {
    it('Should return something.', function () {
      return expect(Promise.resolve(handler.sendEvent(sampleEvent))).to.eventually.deep.equal(sampleResponseEvent)
    })
  })
})