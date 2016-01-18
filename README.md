# massdrop-job-queue
Job queue system created using React and Node.js

## Local Setup
To run the program locally, clone this repo to your local machine and follow the steps below:

###### 1. Install the Node.js dependencies. 
```shell
  $ npm install
```
###### 2. Start your mongo database.
```shell
  $ mongod
```
###### 3. From the root directory, start the Node.js server.
```shell
  $ nodemon
```
###### 4. Navigate to `localhost:8080`.

## Features
* Entering a url into the input box and clicking 'Add Job' adds the job to the queue.
* Clicking on the 'Check Job' button of a job in progress checks the status of the job. If the job is complete, the dashboard would be updated with the result. If the job is still incomplete, an alert message would appear on the screen indicating the job is still in progress. 
