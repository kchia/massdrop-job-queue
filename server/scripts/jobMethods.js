var http = require('http');
var Queue = require('bull');
var mongoose = require('mongoose');
var Job = require('./jobModel');
var jobQueue = new Queue('Get Server Value', 6379, '127.0.0.1');

jobQueue.process(function (job, done) {
  var id = job.data.id;
  var url = job.data.url;
  console.log('Job with id ' + id + ' is in progress...');
  fetchData(url, id);
  done(console.log('Job with id ' + id + 'is complete...'));
});

function fetchData (url, id) {
  var request = http.request(url, function (response) {
    var data = '';
    response.on('data', function (chunk) {
      console.log('Working on fetching data...');
      data += chunk;
    });
    response.on('end', function () {
      console.log('Adding ' + data + ' to job with id ' + id);
      Job.findOne({ _id: id }, function (error, job){
        job.completed = true;
        job.result = data;
        job.save();
      });
    });
  });
  request.on('error', function (error) {
      console.log(error.message);
  });
  request.end();
};

exports.addJob = function (data) {
  Job.create({url: data}, function (error, job) {
    if (error) {
      console.log(error);
    } else {
      var id = job._id;
      jobQueue.add({url: data, id: id}).then(function (data) {
        console.log('Job with id ' + data.jobId + ' added to queue');
      }, function (error) {
        console.error('Could not add job due to:' + error);
      });
    }
  }
  );
};

exports.findAllJobs = function(){
  console.log('Finding all jobs...');
  return Job.find({}).exec();;
};

exports.findJob = function(id){
  console.log('Finding job with id' + id);
  return Job.findOne({_id: id}).exec();
};
