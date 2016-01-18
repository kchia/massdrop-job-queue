// App React Component bootstraps the app
var App = React.createClass({
	getInitialState: function() {
		return {
			jobsCollection: []
		}
	},

	updateDashboard: function() {
		var context = this;
		console.log('Updating dashboard...');
		$.get('/jobs').success(function (response) {
		    console.log('GET request successful, updating dashboard with ' + response);
		    context.setState({
		    	jobsCollection: response
		    });
		});
	},

	addJob: function(url) {
		console.log('Queueing job to fetch data from ' + url);
		$.post('/jobs/' + url);
    this.updateDashboard();
	},

	checkJob: function(id) {
		var context = this;
		console.log('Checking status of job with id ' + id);
		$.get('/jobs/' + id).success(function (response) {
				if(response.result) {
		    	context.updateDashboard();
				} else {
					console.log('Job is still in progress...');
					alert('Job is still in progress! Please wait...');
				}
		});
	},

	render: function() {
    return (
    	<div className='container'>
    		<Header />
    		<JobForm addJob={this.addJob} />
    		<JobQueueDashboard jobsCollection={this.state.jobsCollection} checkJob={this.checkJob}/>
    	</div>
    );
	}
}); 

// Header Component
var Header = React.createClass({
	render: function() {
		return (
			<header>
				<h1>Massdrop Job Queue Program
				</h1>
			</header>
		);
	}
});

// Job Form Component & Sub-Components
var JobForm = React.createClass({
	render: function() {
		return (
			<form className='job-form'>
				<InputBox />
				<AddJobButton addJob={this.props.addJob}/>
			</form>
		);
	}
});

var InputBox = React.createClass({
	render: function() {
		return (
			<div className='url-field'>
				I would like to fetch data from... <br />
				<input type='text' id='url-input' placeholder='e.g., www.google.com'/>
			</div>
		);		
	}
});

var AddJobButton = React.createClass({
	addJob: function(e) {
		e.preventDefault();
		var url = document.getElementById('url-input').value;
		this.props.addJob(url);
		document.getElementById('url-input').value = '';
	},

	render: function() {
		return (
			<div className='add-job-btn-container'>
				<button type='submit' onClick={this.addJob}>
					Add Job
				</button>
			</div>
		);
	}
});

// Job Queue Dashboard Component & Sub-Components
var JobQueueDashboard = React.createClass({
	render: function() {
		return (
			<section className='job-queue-dashboard'>
				<div className='job-queue-dashboard-title'>
					<JobQueueDashboardTitle />
				</div>
				<JobQueueDashboardTable jobsCollection={this.props.jobsCollection} checkJob={this.props.checkJob} />
			</section>
		);	
	}
});

var JobQueueDashboardTitle = React.createClass({
	render: function() {
		return (
			<h2>
				Job Queue Dashboard <br />
			</h2>

		);
	}
});

var JobQueueDashboardTable = React.createClass({
	render: function() {
		return (
			<table className='table'>
				<JobQueueDashboardTableHeader />
				<JobQueueDashboardTableRows jobsCollection={this.props.jobsCollection} checkJob={this.props.checkJob} />
			</table>
		);
	}
});

var JobQueueDashboardTableHeader = React.createClass({
	render: function() {
		return (
			<thead>
				<tr>
					<td>Job Id</td>
					<td>Url</td>
					<td>Job Status</td>
					<td>Result</td>
				</tr>
			</thead>
		);
	}
});

var JobQueueDashboardTableRows = React.createClass({
	render: function() {
		var context = this;
		return (
			<tbody>
				{
					this.props.jobsCollection.map(function(job) {
						return <JobQueueDashboardTableRow job={job} key={job._id} checkJob={context.props.checkJob} />
					})	
				}
			</tbody>
		);
	}
});

var JobQueueDashboardTableRow = React.createClass({
	render: function() {
		return (
			<tr className='row'>
				<JobQueueDashboardTableRowID id={this.props.job._id} />
				<JobQueueDashboardTableRowUrl url={this.props.job.url} />
				<JobQueueDashboardTableRowStatus jobStatus={this.props.job.completed} />
				<JobQueueDashboardTableRowResult result={this.props.job.result} checkJob={this.props.checkJob} />
			</tr>
		);
	}
});

var JobQueueDashboardTableRowID = React.createClass({
	render: function() {
		return (
			<td>
				{this.props.id}
			</td>
		);
	}
});

var JobQueueDashboardTableRowUrl = React.createClass({
	render: function() {
		return (
			<td>
				<a href={this.props.url} target='_blank'>
					{this.props.url}
				</a>
			</td>
		);
	}
});

var JobQueueDashboardTableRowStatus = React.createClass({
	render: function() {
		return (
			<td>
				{this.props.jobStatus ? 'Complete' : 'Processing'}
			</td>
		);
	}
});

var JobQueueDashboardTableRowResult = React.createClass({
	render: function() {
		return (
			<td>
				<div className='result'>
					{
						this.props.result ? 
							this.props.result : 
							<CheckJobButton checkJob={this.props.checkJob} />
					}
				</div>
			</td>
		);
	}
});

var CheckJobButton = React.createClass({
	checkJob: function(e) {
		e.preventDefault();
		var id = e.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].innerHTML;
		this.props.checkJob(id);
	},

	render: function() {
		return (
			<div className='check-job-btn-container'>
				<button type='submit' onClick={this.checkJob}>
					Check Job
				</button>
			</div>
		);
	}
});

//instantiates root component and injects markup into DOM
ReactDOM.render(
  <App />,
  document.getElementById('container')
);
