curl -X POST -H 'Content-type: application/json' 'http://localhost/alert' -d '{
"alert_name" : "IndexOutOfBounds Exception",
"edit_alert_link" : "https://sample.loggly.com/alerts/edit/8188",
"source_group" : "N/A",
"start_time" : "Des 13 20:21:40",
"end_time" : "Des 13 20:22:40",
"search_link" : "https://sample.loggly.com/search/?terms=&source_group=&savedsearchid=112323&from=2015-03",
"query" : "* ",
"num_hits" : 225,
"recent_hits" : [ ],
"owner_username" : "sample",
"owner_subdomain" : "sample",
"owner_email" : "pm@loggly.com"
}'
