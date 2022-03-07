const GameInstance = require('./game/game');
const queries = require('./queries/queries');

function runScheduledTask() {
	queries.getAllExistingGames()
        .then(cursor => {
            // cursor.count(function(err, count) {
            //     console.log("Number of Games found: " + count)
            // });
            cursor.forEach(dbGame => {
                //console.log("Game Information: " + dbGame)
				var game = new GameInstance(dbGame);
                game.executeTurn().catch(console.dir);
            });
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = { runScheduledTask };