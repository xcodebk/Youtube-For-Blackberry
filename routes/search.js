var express = require('express');
var router = express.Router();
var google=require('googleapis');
var rp=require('request-promise');
const API_KEY = "AIzaSyCnauR5AvWYFFLD40sCxqxfszADAsVIqzU";
var url = require('url');
/* GET users listing. */
router.get('/', function(req, res, next) {
  var youtube = google.youtube({
    version: 'v3',
  });
  var url_parts=url.parse(req.url,true);
  var question=url_parts.query.question;
  youtube.search.list({
    part: 'snippet',
    q: question,
    maxResults:20,
    key: API_KEY
  }, function (err, data) {
    if (err) {
      res.send(err);
    }
    if (data) {
      var listP=[];
      data.items.forEach(function(element) {
        var options={
          uri: 'https://helloacm.com/api/video/?cached&video=https://www.youtube.com/watch?v=' + element.id.videoId,
          method: 'GET',
          json:true
        }
        listP.push(rp(options));
      })
      Promise.all(listP).then(value=>{
        var items=[];
        value.forEach(function(element,idx) {
          items.push({imageUrl:data.items[idx].snippet.thumbnails.high.url,url:element.url,title:data.items[idx].snippet.title});
        },this);
        //res.send(data);
        res.render("searchResult",{items:items});
       //res.send(listlink);
      })
      
    }});
});

module.exports = router;
