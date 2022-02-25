const queries = require('../queries/queries');
const deck = require('../api/cards.js');

class Game {
	joinCode = null;
	turnNumber = null;
	playerIds = null;
	status = null;

	constructor(game) {
		// console.log(game.playerIds)
		// console.log(game.status)
		// //No value = New game
		if (game.code == null) {
			console.log('Game Code required. Game object creation failed.');
			return -1;
		}
		this.joinCode = game.code;
		this.turnNumber = game.turnNumber || 0;
		this.playerIds = game.playerIds || [];
		this.status = game.status || 'Not started';
	}

	async executeTurn() {
		return;
		//console.log(cardIdArray)

		if (this.playerIds == [] || this.playerIds == null) {
			console.log('No players in the game');
			return;
		}
		for (var playerId of this.playerIds) {
			var playerInfo = await queries.getUserDataById(playerId);
			console.log(playerInfo);
			var newCardArray = this.generateCards(playerInfo);
			//console.log(playerInfo.numberOfCardsDrawn)
			queries
				.addNewCardsToPlayerHand(
					playerInfo._id,
					newCardArray,
					playerInfo.numberOfCardsDrawn
				)
				.catch(console.dir);

			//calculateTurnIncome(playerInfo);
		}

		console.log('Turn executed');
		return;
		//put new cards into database
	}

	generateCards(playerInfo) {
		var deckArray = Object.keys(deck.Cards);
		var newCardArray = [];
		for (var i = 0; i < 3; i++) {
			var number = Math.floor(Math.random() * (deckArray.length - 1) + 1);
			//console.log(number);
			var chosenCardId = parseInt(deckArray[number]);
			//console.log(typeof chosenCardId)
			var cardDb = {
				instanceId: playerInfo.numberOfCardsDrawn,
				cardId: chosenCardId,
			};
			playerInfo.numberOfCardsDrawn += 1;
			//console.log("Card", i, ":", cardDb);
			newCardArray.push(cardDb);
		}

		console.log(playerInfo.username + "'s New Cards:");
		console.log(newCardArray);
		return newCardArray;
	}

	calculateTurnIncome(playerInfo) {
		//rewrite this
	}
}

module.exports = Game;
