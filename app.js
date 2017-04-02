var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var index = require('./routes/index');
var users = require('./routes/users');
var google = require('googleapis');
var rp=require('request-promise');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const API_KEY = "AIzaSyCnauR5AvWYFFLD40sCxqxfszADAsVIqzU";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function (req, res, next) {
  var youtube = google.youtube({
    version: 'v3',
  });

  youtube.search.list({
    part: 'snippet',
    q: 'loi xin loi cua mot dan choi remix',
    //location:(10.762622,106.660172),
    maxResults:10,
    key: API_KEY
  }, function (err, data) {
    if (err) {
      res.send(err);
    }
    if (data) {
      var linkList = [];
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
        listlink=[];
        value.forEach(function(element) {
          listlink.push(element.url);
        },this);
        res.render("index",{items:listlink});
       //res.send(listlink);
      })
      
    }});
});
      
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    module.exports = app;
