const queries = require('../queries/queries');
const deck = require('../api/cards');
const Player = require('./player');
const userUtils = require('../utils/userUtils');

class Game {
	joinCode = null;
	turnNumber = null;
	playerIds = null;
	status = null;
	log = null;

	constructor(game) {
		if (game.joinCode == null) {
			console.log('Game Code required. Game object creation failed.');
			return -1;
		}
		this.joinCode = game.joinCode;
		this.turnNumber = game.turnNumber || 0;
		this.playerIds = game.playerIds || [];
		this.status = game.status || 'Not started';
		this.log = game.log;
	}

	async executeTurn() {
		if (this.playerIds == [] || this.playerIds == null) {
			console.log('No players in the game');
			return;
		}

		for (var playerId of this.playerIds) {
			var playerInfo = await queries.getUserDataById(playerId);
			var player = new Player(playerInfo);

			console.log(player);

			//TODO add function to remove invalid cards
			this.calculateTurnIncome(player);
			//this.drawCards(player);
			this.calculateNetWorth(player);

			queries.updateUserStatsAndInventory(player).catch(console.dir);
		}

		return;
		this.turnNumber += 1;
		queries
			.updateGameTurnNumber(this.joinCode, this.turnNumber)
			.catch(console.dir);
		console.log('Turn executed');
		return;
	}

	calculateTurnIncome(player) {
		var turnIncome = 0;
		var cardsInInventory = player.game.inventory.cardInstances;
		if (cardsInInventory == null) {
			console.log('Player ' + player.profile.id + ' has no cards');
			return;
		}
		cardsInInventory.forEach((card) => {
			var key = parseInt(card.cardId);
			if (key in deck.Cards) {
				//Only add hub income
				if (deck.Cards[key].cardType == 0)
					turnIncome += deck.Cards[key].baseIncome;
			} else {
				//console.log('Invalid Card ID: ' + key);
			}
		});
		//console.log('Money Earned this Turn: ' + turnIncome);
		var totalCash = player.game.stats.cash + turnIncome;

		player.game.stats.turnIncome =
			userUtils.truncateValueToTwoDp(turnIncome);
		player.game.stats.cash = userUtils.truncateValueToTwoDp(totalCash);
		console.log(player.game.stats);

		return;
		// return queries
		// 	.updatePlayerIncome(player._id, turnIncome, totalCash)
		// 	.catch(console.dir);
	}

	drawCards(player) {
		for (var i = 0; i < 3; i++) {
			var chosenCardId = this.drawOneCard();
			var cardDb = {
				instanceId: player.game.stats.numberOfCardsDrawn,
				cardId: chosenCardId,
			};
			player.game.stats.numberOfCardsDrawn += 1;
			player.game.inventory.newCards.push(cardDb);

			const logData = {
				userId: player.profile.id,
				...cardDb,
			};
			queries.updateActionLog(player.game.id, logData, 1);
		}
		//console.log(player.username + "'s New Cards:");
		console.log('New Cards for Player: ' + player.profile.displayName);
		console.log(player.game.inventory.newCards);

		return;

		// return queries
		// 	.addNewCardsToPlayerHand(
		// 		player.profile.id,
		// 		player.game.inventory.newCards,
		// 		player.game.stats.numberOfCardsDrawn
		// 	)
		// 	.catch(console.dir);
	}

	drawOneCard() {
		var deckArray = Object.keys(deck.Cards);
		var number = Math.floor(Math.random() * (deckArray.length - 1) + 1);
		return parseInt(deckArray[number]);
	}

	calculateNetWorth(player) {
		var assetValue =
			userUtils.getAssetValue(player.game.inventory.cardInstances) +
			userUtils.getAssetValue(player.game.inventory.newCards);
		player.game.stats.netWorth = userUtils.truncateValueToTwoDp(
			player.game.stats.cash + assetValue
		);
		return;
	}
}

module.exports = Game;
