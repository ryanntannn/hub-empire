const cron = require('node-cron');
const GameHandler = require('../game/game.js');

//Cron values can be changed for testing
//Revery back to '0 07,11,15 * * *' when done
var task = cron.schedule('0 07,11,15 * * *', () => {
	let date = new Date()
	let day = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

    console.log('Starting scheduled job...');
	// prints date & time in YYYY-MM-DD HH:MM:SS format
	console.log('Current date: ' + day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds);

	var game = new GameHandler(0, isNew = false)
	game.executeTurn()
}, 
{
	scheduled: false,
    timezone: 'Singapore'
});

module.exports = task;