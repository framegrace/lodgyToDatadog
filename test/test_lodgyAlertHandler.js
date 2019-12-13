/* test/test_lodgyAlertHandler.js */

// Unit esting lodgyHandler object

var Handler = require('../source/handlers/lodgyAlertHandler');
var expect = require('chai').expect;

let handler = new Handler();

// Sample requests obtained from the provider
let sampleRequest = `{
  "alert_name":"IndexOutOfBounds Exception",
  "edit_alert_link" : "https://sample.loggly.com/alerts/edit/8188",
  "source_group" : "N/A",
  "start_time" : "Mar 17 11:41:40",
  "end_time" : "Mar 17 11:46:40",
  "search_link" : "https://sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323",
  "query" : "* ",
  "num_hits" : 225,
  "recent_hits" : [ ],
  "owner_username" : "sample",
  "owner_subdomain" : "sample",
  "owner_email" : "pm@loggly.com"
}`

// Sample Event object obtained from DataDog
let sampleEvent = `{
   "title": "IndexOutOfBounds Exception.",
   "text": "LodgyAlert: https://sample.loggly.com/alerts/edit/8188",
   "priority": "normal",
   "tags": [ "source:lodgy" , "lodgy_group":"N/A"],
   "alert_type": "error",
   "aggregation_key": "lodgy",
   "date_happened": 1552819300
}`

// A bad request to check the validation
let sampleBadRequest = `{
  "alert_name" : "IndexOutOfBounds Exception",
  "edit_alert_link" : "https://sample.loggly.com/alerts/edit/8188",
  "source_group" : "N/A",
  "Something" : { "with": "things inside" },
  "Something Else" : "Blah"
}`

// The tests. Mostly self-explanatory
describe('#generateLodgyAlert()', function() {

  context('without arguments', function() {
    it('should return null', function() {
      expect(handler.generateLodgyAlert()).to.null
    })
  })
  
  context('with non JSON strings', function() {
    it('Null with empty string', function() {
      expect(handler.generateLodgyAlert('')).to.null
    })
    
    it('Null with a random string', function() {
      expect(handler.generateLodgyAlert('asdfghjkl{}/()|;alert#//')).to.null
    })
  })

  context('With JSON Arguments', function() {
    it('Should return null on wrong format.', function() {
      expect(handler.generateLodgyAlert(sampleBadRequest)).to.null
    })
    it('Should return the object with correct format', function() {
      expect(handler.generateLodgyAlert(sampleRequest)).to.not.null
    })

    context('With JSON Arguments', function() {
      it('Should return false on wrong format.', function() {
        expect(handler.generateLodgyAlert(sampleBadRequest)).to.null
      })
      it('Should return true with correct format', function() {
        expect(handler.generateLodgyAlert(sampleRequest)).to.not.null
      })
    })
  })
})