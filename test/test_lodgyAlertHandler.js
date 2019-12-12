/* test/test_lodgyAlertHandler.js */

var Handler = require('../source/handlers/lodgyAlertHandler');
var expect = require('chai').expect;

let handler = new Handler();



describe('#lodgyAlertHandler()', function() {

  context('without arguments', function() {
    it('should return false', function() {
      expect(handler.Alert()).to.false
    })
  })
  
  context('with non JSON strings', function() {
    it('False with empty string', function() {
      expect(handler.Alert('')).to.false
    })
    
    it('False with a random string', function() {
      expect(handler.Alert('asdfghjkl{}/()|;alert#//')).to.false
    })
  })
  
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

  

  let sampleBadRequest = `{
    "alert_name" : "IndexOutOfBounds Exception",
    "edit_alert_link" : "https://sample.loggly.com/alerts/edit/8188",
    "source_group" : "N/A",
    "Something" : { "with": "things inside" },
    "Something Else" : "Blah"
  }`

  context('With JSON Arguments', function() {
    it('Should return false on wrong format.', function() {
      expect(handler.Alert(sampleBadRequest)).to.false
    })
    it('Should return Ok with correct format', function() {
      expect(handler.Alert(sampleRequest)).to.true
    })
  })
  
})