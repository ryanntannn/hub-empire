const queries = require('../queries/queries');
const deck = require('../api/cards.js');
const Player = require('./player');

class Game {
	joinCode = null;
	turnNumber = null;
	playerIds = null;
	status = null;
	deckArray = null;

	constructor(game) {
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

		for (var playerId of this.playerIds) {
			var playerInfo = await queries.getUserDataById(playerId);
			var player = new Player(playerInfo);
			console.log(player.username)

			this.calculateTurnIncome(player);
			this.drawCards(player);
			this.calculateNetWorth(player)

			queries.updateUserStatsAndInventory(player).catch(console.dir);
		}
		this.turnNumber += 1;
		queries.updateGameTurnNumber(this.joinCode, this.turnNumber).catch(console.dir);
		console.log('Turn executed');
		return;
	}

	calculateTurnIncome(player) {
		var turnIncome = 0;
		//console.log(playerInfo.cardIds)
		player.cardIds.forEach((card) => {
			var key = parseInt(card.cardId);
			if (key in deck.Cards) {
				//Only add hub income
				if (deck.Cards[key].cardType == 0) {
					turnIncome += deck.Cards[key].baseIncome;
				}
			} else {
				//console.log('Invalid Card ID: ' + key);
			}
		});
		//console.log('Money Earned this Turn: ' + turnIncome);
		var totalCash = player.cash + turnIncome;

		player.turnIncome = turnIncome;
		player.cash = totalCash;

		return;

		return queries
			.updatePlayerIncome(playerInfo._id, turnIncome, totalCash)
			.catch(console.dir);
	}

	drawCards(player) {
		for (var i = 0; i < 3; i++) {
			var chosenCardId = this.drawOneCard();
			var cardDb = {
				instanceId: player.numberOfCardsDrawn,
				cardId: chosenCardId,
			};
			player.numberOfCardsDrawn += 1;
			player.newCards.push(cardDb);
		}
		//console.log(player.username + "'s New Cards:");
		//console.log(player.newCards);

		return;
		return queries
			.addNewCardsToPlayerHand(
				playerInfo._id,
				newCardArray,
				playerInfo.numberOfCardsDrawn
			)
			.catch(console.dir);
	}

	drawOneCard() {
		var deckArray = Object.keys(deck.Cards);
		var number = Math.floor(Math.random() * (deckArray.length - 1) + 1);
		return parseInt(deckArray[number]);
	}

	calculateNetWorth(player){
		const userUtils = require('../utils/userUtils');
		var assetValue = userUtils.getAssetValue(player.cardIds) + userUtils.getAssetValue(player.newCards);
		player.netWorth = player.cash + assetValue;
		return;
	}
}

module.exports = Game;
