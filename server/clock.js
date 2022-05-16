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

//Turns occur at 8am and 5pm SGT
//Cron values can be changed for testing
//Heroku runs on UTC +0:00, Singapore is UTC+8:00
//Revert back to '0 0,9 * * *' when done
var job = cron.schedule('0 0,9 * * *', () => {
    printCurrentDateAndTime();
    worker.runScheduledTask();
}, 
{
	scheduled: true,
    timezone: 'Singapore'
});

module.exports = job;