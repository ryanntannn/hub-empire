const queries = require('../queries/queries');
const deck = require('../api/cards');
const Player = require('./player');
const userUtils = require('../utils/userUtils');
const cardUtils = require('../utils/cardUtils');

const Mods = require('../api/mods');

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
			await this.calculateTurnIncome(player);
			this.drawCards(player, 1);
			this.calculateNetWorth(player);

			queries.updateUserStatsAndInventory(player).catch(console.dir);
		}

		console.log('Turn executed');
		this.turnNumber += 1;
		queries.incrementGameTurnNumber(this.joinCode);

		return;
	}

	async calculateTurnIncome(player) {
		var cardIncome = this.calculateCardIncome(
			player.game.inventory.cardInstances
		);
		var stolenCardIncome = await this.calculateStolenCardIncome(
			player.profile.id,
			player.game.inventory.stolenCards
		).catch(console.dir);

		var turnIncome = userUtils.truncateValueToTwoDp(
			cardIncome + stolenCardIncome
		);
		player.game.stats.turnIncome = turnIncome;

		const logData = {
			userId: player.profile.id,
			turnIncome,
		};
		queries.updateActionLog(player.game.id, logData, 2);

		var totalCash = userUtils.truncateValueToTwoDp(
			player.game.stats.cash + turnIncome
		);
		player.game.stats.cash = totalCash;

		return Promise.resolve();
	}

	calculateCardIncome(cardInstances) {
		var turnIncome = 0;
		if (cardInstances == null) {
			console.log('No Cards in Player Inventory');
			return turnIncome;
		}
		cardInstances.forEach((card) => {
			var key = parseInt(card.cardId);
			if (
				key in deck.Cards &&
				deck.Cards[key].cardType == 0 &&
				userUtils.isEmptyObject(card.modifiers.owner)
			) {
				turnIncome += card.effectiveIncome;
			}
		});
		return turnIncome;
	}

	async calculateStolenCardIncome(playerId, stolenCards) {
		var stolenCardIncome = 0;
		if (stolenCards == null) {
			console.log('No Stolen Cards in Player Inventory');
			return stolenCardIncome;
		}

		for (const card of stolenCards) {
			var otherUserCards = await queries.getUserCardsById(card.playerId);
			var stolenCard = cardUtils.getOneCardFromCardArrayByInstanceId(
				otherUserCards.game.inventory.cardInstances,
				card.instanceId
			);
			var key = parseInt(stolenCard.cardId);
			if (
				key in deck.Cards &&
				deck.Cards[key].cardType == 0 &&
				stolenCard.modifiers.owner.playerId == playerId
			) {
				stolenCardIncome += stolenCard.effectiveIncome;
			}
		}
		return Promise.resolve(stolenCardIncome);
	}

	//Unused
	decrementTurnsLeftInCardModifiers(player) {
		player.game.inventory.cardInstances.forEach((card) => {
			if (card.modifiers.owner.isStolen)
				card.modifiers.owner.turnsLeft -= 1;

			if (!card.modifiers.type.isPermanent)
				card.modifiers.type.turnsLeft -= 1;

			card.modifiers.incomeBoost.forEach((boost) => {
				if (!boost.isPermanent) {
					boost.turnsLeft -= 1;
				}
			});
		});
	}

	drawCards(player, numberOfCardsToDraw) {
		for (var i = 0; i < numberOfCardsToDraw; i++) {
			var newCard = this.drawOneCommonRarityCard(
				player.game.stats.numberOfCardsDrawn
			);

			player.game.stats.numberOfCardsDrawn += 1;
			player.game.inventory.cardInstances.push(newCard);
			player.game.inventory.newCards.push(newCard);

			const logData = {
				userId: player.profile.id,
				...newCard,
			};
			queries.updateActionLog(player.game.id, logData, 1);
		}
		return;
	}

	drawOneCommonRarityCard(instanceId) {
		const cardArray = cardUtils.convertDeckObjectToArray(deck.Cards)
		const commonCards = cardUtils.filterCommonCardsInCardArray(cardArray)
		var newCard = cardUtils.getRandomCardFromCardArray(commonCards);
		// Card Type 0 is a Hub Card, 1 is an Action Card
		if (newCard.cardType == 0) {
			return {
				effectiveIncome: newCard.baseIncome,
				instanceId: instanceId,
				cardId: newCard.id,
				modifiers: {
					owner: {},
					hub: {},
					income: [],
				},
			};
		} else {
			return {
				instanceId: instanceId,
				cardId: newCard.id,
			};
		}
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
