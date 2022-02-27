const queries = require('../queries/queries');
const deck = require('../api/cards.js');

class Game {
	joinCode = null;
	turnNumber = null;
	playerIds = null;
	status = null;
	deckArray = null;

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
		if (this.playerIds == [] || this.playerIds == null) {
			console.log('No players in the game');
			return;
		}

		//queries.destroyCard("6200f29d4b5a181689df75cb", 10, 0).catch(console.dir);
		for (var playerId of this.playerIds) {
			var playerInfo = await queries.getUserDataById(playerId);
			console.log(playerInfo.username)
			this.calculateTurnIncome(playerInfo).catch(console.dir);
			this.drawCards(playerInfo).catch(console.dir);
		}
		//update turn number
		console.log('Turn executed');
		return;
		//put new cards into database
	}

	calculateTurnIncome(playerInfo) {
		var turnIncome = 0;
		//console.log(playerInfo.cardIds)
		playerInfo.cardIds.forEach(card => {
			var key = parseInt(card.cardId);
			if(key in deck.Cards) {
				//Only add hub income
				if(deck.Cards[key].cardType == 0){
					turnIncome += deck.Cards[key].baseIncome;
				}
			} else {
				console.log("Invalid Card ID: " + key);
			}
		});
		console.log("Money Earned this Turn: " + turnIncome);
		var totalCash = playerInfo.cash + turnIncome

		return queries
		.updatePlayerIncome(
			playerInfo._id,
			turnIncome,
			totalCash
		)
		.catch(console.dir);
	}

	drawCards(playerInfo) {
		var newCardArray = [];
		for (var i = 0; i < 3; i++) {
			var chosenCardId = this.drawOneCard()
			var cardDb = {
				instanceId: playerInfo.numberOfCardsDrawn,
				cardId: chosenCardId,
			};
			playerInfo.numberOfCardsDrawn += 1;
			newCardArray.push(cardDb);
		}
		console.log(playerInfo.username + "'s New Cards:");
		console.log(newCardArray);

		return queries
		.addNewCardsToPlayerHand(
			playerInfo._id,
			newCardArray,
			playerInfo.numberOfCardsDrawn
		)
		.catch(console.dir);
	}

	drawOneCard(){
		var deckArray = Object.keys(deck.Cards);
		var number = Math.floor(Math.random() * (deckArray.length - 1) + 1);
		return parseInt(deckArray[number]);
	}
}

module.exports = Game;
