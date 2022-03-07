const cron = require('node-cron');
var worker = require('./worker.js');

function printCurrentDateAndTime(){
    let date = new Date()
	let day = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

	// prints date & time in YYYY-MM-DD HH:MM:SS format
	console.log('Current date: ' + day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds);
    console.log('Starting Turn Calculation...');
}

//Cron values can be changed for testing
//Revert back to '0 07,11,15 * * *' when done
var job = cron.schedule('* * * * *', () => {
    printCurrentDateAndTime();
    worker.runScheduledTask();
}, 
{
	scheduled: true,
    timezone: 'Singapore'
});

module.exports = job;