var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var job = require('./server/scripts/jobMethods');
var url = require('url');

mongoose.connect('mongodb://localhost/MassdropDatabase');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(function (error, request, response, next) {
  if (error) {
    console.error(error.stack);
    response.send(500);
  } else {
    next();
  }
});

app.get('/jobs', function (request, response) {
  job.findAllJobs().then(function(jobs){
    response.json(jobs);
  });
});

app.post('/jobs/:url', function (request, response) {
  var paramUrl = request.params.url;
  var stats = url.parse(paramUrl);
  var formattedUrl = url.format(paramUrl);

  if(stats.protocol){
    formattedUrl = 'http://' + stats.host + stats.pathname;
  } else {
    formattedUrl = 'http://' + formattedUrl;
  }
  console.log('User\'s input url has been formatted to ' + formattedUrl);
  job.addJob(formattedUrl);
});

app.get('/jobs/:id', function (request, response) {
  var id = request.params.id;
  console.log('Requesting update on job with id ' + id);
  job.findJob(id).then(function(job){
    response.json(job);
  });
});

app.listen(8080);
console.log("Server running on port 8080");