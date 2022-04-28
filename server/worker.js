const GameInstance = require('./game/game');
const queries = require('./queries/queries');

function runScheduledTask() {
	queries.getAllExistingGames()
        .then(cursor => {
            cursor.forEach(dbGame => {
				var game = new GameInstance(dbGame);
                game.executeTurn().catch(console.dir);
            });
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = { runScheduledTask };