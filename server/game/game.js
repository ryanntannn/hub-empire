const queries = require('../queries/queries');
const deck = require('../api/cards');
const Player = require('./player');
const userUtils = require('../utils/userUtils');
const cardUtils = require('../utils/cardUtils');

const Mods = require('../api/mods')

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

			// TODO add function to remove invalid cards
			// this.decrementTurnsLeftInCardModifiers(player);
			this.calculateTurnIncome(player);
			this.drawCards(player, 3);
			this.calculateNetWorth(player);

			queries.updateUserStatsAndInventory(player).catch(console.dir);


			//FOR TESTING MODS
			//var playerId = "622599dafe42733f560ee58f";
			//queries.applyNewModToCard(playerId, 4, new Mods.IncomeMod(true, null, 10, true))
			//queries.applyNewModToCard(playerId, 4, new Mods.IncomeMod(true, null, 1.1, false))

			//queries.applyNewModToCard(playerId, 4, new Mods.OwnerMod(1234, false, 10));

			//queries.applyNewModToCard(playerId, 4, new Mods.HubMod(false, 5, 2));

			// deck.Cards[20].onUse(
			// 	{ targetPlayerId: playerId, targetCardId: 101, targetCardInstanceId: 0 },
			// 	{ 
			// 		id: playerId,
			// 	})
			// .then(res => {
			// 	console.log(res);
			// })
			// .catch(rej => console.log(rej))
		}

		console.log('Turn executed');
		this.turnNumber += 1;
		queries.updateGameTurnNumber(this.joinCode, this.turnNumber);
		
		return;
	}

	async calculateTurnIncome(player) {
		var cardIncome = this.calculateCardIncome(player.game.inventory.cardInstances);
		var stolenCardIncome = await this.calculateStolenCardIncome(player.profile.id, player.game.inventory.stolenCards).catch(console.dir);
		console.log(cardIncome)
		console.log(stolenCardIncome)

		var turnIncome = userUtils.truncateValueToTwoDp(cardIncome + stolenCardIncome);
		player.game.stats.turnIncome = turnIncome;

		var totalCash = userUtils.truncateValueToTwoDp(player.game.stats.cash + turnIncome);
		player.game.stats.cash = totalCash;

		return;
	}

	calculateCardIncome(cardInstances){
		var turnIncome = 0;
		if (cardInstances == null) {
			console.log('No Cards in Player Inventory');
			return turnIncome;
		}
		cardInstances.forEach(card => {
			var key = parseInt(card.cardId);
			if (key in deck.Cards &&
					deck.Cards[key].cardType == 0 &&
					userUtils.isEmptyObject(card.modifiers.owner)) {
				turnIncome += card.effectiveIncome;
			}
		});
		return turnIncome;
	}

	async calculateStolenCardIncome(playerId, stolenCards){
		var stolenCardIncome = 0;
		if (stolenCards == null) {
			console.log('No Stolen Cards in Player Inventory');
			return stolenCardIncome;
		}

		for (const card of stolenCards) {
			var otherUserCards = await queries.getUserCardsById(card.playerId);
			var stolenCard = cardUtils.getOneCardFromCardArrayByInstanceId(otherUserCards.game.inventory.cardInstances, card.instanceId);
			var key = parseInt(stolenCard.cardId);
			if (key in deck.Cards &&
					deck.Cards[key].cardType == 0 &&
					stolenCard.modifiers.owner.playerId == playerId) {
				stolenCardIncome += stolenCard.effectiveIncome;
			}
		}
		return Promise.resolve(stolenCardIncome);
	}

	//Unused
	decrementTurnsLeftInCardModifiers(player){
		player.game.inventory.cardInstances.forEach(card => {
			if(card.modifiers.owner.isStolen)
				card.modifiers.owner.turnsLeft -= 1;

			if(!card.modifiers.type.isPermanent)
				card.modifiers.type.turnsLeft -= 1;

			card.modifiers.incomeBoost.forEach(boost => {
				if(!boost.isPermanent){
					boost.turnsLeft -= 1;
				}
			})
			
		})
	}

	drawCards(player, numberOfCardsToDraw) {
		for (var i = 0; i < numberOfCardsToDraw; i++) {
			var newCard = this.drawOneCard(player.game.stats.numberOfCardsDrawn);
			player.game.stats.numberOfCardsDrawn += 1;
			player.game.inventory.cardInstances.push(newCard);
			player.game.inventory.newCards.push(newCard);
		}
		return;
	}

	drawOneCard(instanceId) {
		var newCardId = this.getRandomCardId();
		// Card Type 0 is a Hub Card, 1 is an Action Card
		if(deck.Cards[newCardId].cardType == 0) {
			return {
				effectiveIncome: deck.Cards[newCardId].baseIncome,
				instanceId: instanceId,
				cardId: newCardId,
				modifiers: {
					owner: {},
					hub: {},
					income: [],
				},
			};
		} else {
			return {
				instanceId: instanceId,
				cardId: newCardId,
			};
		}
	}

	getRandomCardId(){
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
