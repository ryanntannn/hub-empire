const cron = require('node-cron');
const GameInstance = require('../game/game.js');
const queries = require('../queries/queries.js');

//Cron values can be changed for testing
//Revert back to '0 07,11,15 * * *' when done
var task = cron.schedule('0 07,11,15 * * *', () => {
	let date = new Date()
	let day = ("0" + date.getDate()).slice(-2);
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let year = date.getFullYear();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

    console.log('Starting Turn Calculation...');
	// prints date & time in YYYY-MM-DD HH:MM:SS format
	console.log('Current date: ' + day + '-' + month + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds);

	queries.getAllExistingGames()
        .then(cursor => {
            // cursor.count(function(err, count) {
            //     console.log("Number of Games found: " + count)
            // });
            cursor.forEach(dbGame => {
				var game = new GameInstance(dbGame);
                game.executeTurn().catch(console.dir);
            });
        })
        .catch(err => {
            console.log(err);
        });
	
}, 
{
	scheduled: false,
    timezone: 'Singapore'
});

module.exports = task;