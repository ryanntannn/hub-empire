const { userHasCard } = require('../queries/queries');
const queries = require('../queries/queries');

const cardUtils = require('../utils/cardUtils');
const Mods = require('./mods');

const Cards = {
	0: {
		id: 0,
		emoji: '⚠️',
		displayName: 'error',
		description: `this card does not exist anymore`,
		cardType: 1,
		rarity: 0,
		isTargetCard: false,
		isTargetPlayer: false,
		isTargetSelfCard: false,
		isTargetHubType: false,
		onUse: ({ targetId, targetCardId, selfCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					return res(`Removed Card`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	10: {
		id: 10,
		emoji: '💸',
		displayName: 'Pickpocket',
		description: 'Steal $30M from a player',
		cardType: 1,
		rarity: 0,
		isTargetCard: false,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		isTargetHubType: false,
		onUse: ({ targetId, targetCardId, selfCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					await queries.addMoney(targetId, -30);
					await queries.increaseNetWorth(targetId, -30);
					await queries.addMoney(user.id, 30);
					await queries.increaseNetWorth(user.id, 30);
					return res(`$30M was stolen from ${targetId}`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	11: {
		id: 11,
		emoji: '🏢',
		displayName: 'Pickpocket II',
		description: 'Steal $50M from a player',
		cardType: 1,
		rarity: 1,
		isTargetCard: false,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		isTargetHubType: false,
		onUse: ({ targetId, targetCardId, selfCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					await queries.addMoney(targetId, -50);
					await queries.increaseNetWorth(targetId, -50);
					await queries.addMoney(user.id, 50);
					await queries.increaseNetWorth(user.id, 50);
					return res(`$50M was stolen from ${targetId}`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	12: {
		id: 12,
		emoji: '🚨',
		displayName: 'Stock Discrepancy',
		description: "Decrease a Hub's income by 50%.",
		cardType: 1,
		rarity: 1,
		isTargetCard: true,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		isTargetHubType: false,
		onUse: ({ targetId, targetCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					await queries.applyNewModToCard(
						targetId,
						targetCardId,
						new Mods.IncomeMod(true, null, 0.5, false)
					);
					var cardArray = await queries.getUserCardsById(targetId);
					var card = cardUtils.getOneCardFromCardArrayByInstanceId(
						cardArray.game.inventory.cardInstances,
						targetCardId
					);
					var newEffectiveIncome =
						cardUtils.calculateEffectiveIncomeOfCard(card, Cards);
					await queries.updateEffectiveIncomeOfCard(
						targetId,
						targetCardId,
						newEffectiveIncome
					);
					return res(`Hub's Income has been decreased by 50%.`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	13: {
		id: 13,
		emoji: '🚨',
		displayName: 'Stock Discrepancy II',
		description: "Decrease a Hub's income by 100%.",
		cardType: 1,
		rarity: 2,
		isTargetCard: true,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		isTargetHubType: false,
		onUse: ({ targetId, targetCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					await queries.applyNewModToCard(
						targetId,
						targetCardId,
						new Mods.IncomeMod(true, null, 0, false)
					);
					var cardArray = await queries.getUserCardsById(targetId);
					var card = cardUtils.getOneCardFromCardArrayByInstanceId(
						cardArray.game.inventory.cardInstances,
						targetCardId
					);
					var newEffectiveIncome =
						cardUtils.calculateEffectiveIncomeOfCard(card, Cards);
					await queries.updateEffectiveIncomeOfCard(
						targetId,
						targetCardId,
						newEffectiveIncome
					);
					return res(`Hub's Income has been decreased by 100%.`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	14: {
		id: 14,
		emoji: '🤑',
		displayName: 'Market Breakthrough',
		description: "Increase a Hub's income by 50%.",
		cardType: 1,
		rarity: 1,
		isTargetCard: false,
		isTargetPlayer: false,
		isTargetSelfCard: true,
		isTargetHubType: false,
		onUse: ({ selfCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					const targetId = user.id;
					await queries.applyNewModToCard(
						targetId,
						selfCardId,
						new Mods.IncomeMod(true, null, 1.5, false)
					);
					var cardArray = await queries.getUserCardsById(targetId);
					var card = cardUtils.getOneCardFromCardArrayByInstanceId(
						cardArray.game.inventory.cardInstances,
						selfCardId
					);
					var newEffectiveIncome =
						cardUtils.calculateEffectiveIncomeOfCard(card, Cards);
					await queries.updateEffectiveIncomeOfCard(
						targetId,
						selfCardId,
						newEffectiveIncome
					);
					return res(`Hub's Income has been increased by 50%.`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	15: {
		id: 15,
		emoji: '🤑',
		displayName: 'Market Breakthrough II',
		description: "Increase a Hub's income by 100%.",
		cardType: 1,
		rarity: 2,
		isTargetCard: false,
		isTargetPlayer: false,
		isTargetSelfCard: true,
		isTargetHubType: false,
		onUse: ({ selfCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					const targetId = user.id;
					await queries.applyNewModToCard(
						targetId,
						selfCardId,
						new Mods.IncomeMod(true, null, 2, false)
					);
					var cardArray = await queries.getUserCardsById(targetId);
					var card = cardUtils.getOneCardFromCardArrayByInstanceId(
						cardArray.game.inventory.cardInstances,
						selfCardId
					);
					var newEffectiveIncome =
						cardUtils.calculateEffectiveIncomeOfCard(card, Cards);
					await queries.updateEffectiveIncomeOfCard(
						targetId,
						selfCardId,
						newEffectiveIncome
					);
					return res(`Hub's Income has been increased by 100%.`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	16: {
		id: 16,
		emoji: '🔨',
		displayName: 'Repurpose Hub',
		description: 'Change the industry of a hub permanently',
		cardType: 1,
		rarity: 2,
		isTargetCard: false,
		isTargetPlayer: false,
		isTargetSelfCard: true,
		isTargetHubType: true,
		onUse: ({ selfCardId, cardType }, user) =>
			new Promise(async (res, rej) => {
				try {
					const targetId = user.id;
					await queries.applyNewModToCard(
						targetId,
						selfCardId,
						new Mods.HubMod(true, null, cardType)
					);
					return res(`Hub's Industry has been changed.`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	20: {
		id: 20,
		emoji: '🏢',
		displayName: 'Proxy Income',
		description:
			"Gain control of a Player\\'s Hub and receive its income for 2 turns",
		cardType: 1,
		rarity: 1,
		isTargetCard: true,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		onUse: ({ targetPlayerId, targetCardId, targetCardInstanceId }, user) =>
			new Promise(async (res, rej) => {
				const targetCardIdInt = parseInt(targetCardId);
				try {
					await queries.applyNewModToCard(
						targetPlayerId,
						targetCardInstanceId,
						new Mods.OwnerMod(user.id, false, 2)
					);
					await queries.addStolenCardToPlayerInventory(
						user.id,
						targetPlayerId,
						targetCardId,
						targetCardInstanceId
					);
					return res('Hub Stolen.');
				} catch (err) {
					rej(err);
				}
			}),
	},
	101: {
		id: 101,
		cardType: 0,
		displayName: 'Air Logistics Hub',
		emoji: '🛩️',
		hubType: 0,
		rarity: 0,
		value: 45,
		baseIncome: 0.75,
	},
	102: {
		id: 102,
		cardType: 0,
		displayName: 'Commercial Airport',
		emoji: '🛩️',
		hubType: 0,
		rarity: 0,
		value: 50,
		baseIncome: 0.5,
	},
	103: {
		id: 103,
		cardType: 0,
		displayName: 'Air Shipment Centre',
		emoji: '🛩️',
		hubType: 0,
		rarity: 0,
		value: 55,
		baseIncome: 0.25,
	},
	104: {
		id: 104,
		cardType: 0,
		displayName: 'Super Airport',
		emoji: '🛩️',
		hubType: 0,
		rarity: 1,
		value: 250,
		baseIncome: 2.5,
	},
	105: {
		id: 105,
		cardType: 0,
		displayName: 'Mega Class Airhub',
		emoji: '🛩️',
		hubType: 0,
		rarity: 2,
		value: 420,
		baseIncome: 5,
	},
	106: {
		id: 106,
		cardType: 0,
		displayName: 'Sea Freight Centre',
		emoji: '🚢',
		hubType: 1,
		rarity: 0,
		value: 45,
		baseIncome: 0.75,
	},
	107: {
		id: 107,
		cardType: 0,
		displayName: 'Sea Shipment Bay',
		emoji: '🚢',
		hubType: 1,
		rarity: 0,
		value: 50,
		baseIncome: 0.5,
	},
	108: {
		id: 108,
		cardType: 0,
		displayName: 'Commercial Seaport',
		emoji: '🚢',
		hubType: 1,
		rarity: 0,
		value: 55,
		baseIncome: 0.25,
	},
	109: {
		id: 109,
		cardType: 0,
		displayName: 'Large Water Port',
		emoji: '🚢',
		hubType: 1,
		rarity: 1,
		value: 240,
		baseIncome: 3,
	},
	110: {
		id: 110,
		cardType: 0,
		displayName: 'Maritime Logistics Hub',
		emoji: '🚢',
		hubType: 1,
		rarity: 2,
		value: 400,
		baseIncome: 4.5,
	},
	111: {
		id: 111,
		cardType: 0,
		displayName: 'Common goods warehouse',
		emoji: '🏢',
		hubType: 2,
		rarity: 0,
		value: 45,
		baseIncome: 0.75,
	},
	112: {
		id: 112,
		cardType: 0,
		displayName: 'Consolidated warehouse',
		emoji: '🏢',
		hubType: 2,
		rarity: 0,
		value: 50,
		baseIncome: 0.5,
	},
	113: {
		id: 113,
		cardType: 0,
		displayName: 'Large Item warehouse',
		emoji: '🏢',
		hubType: 2,
		rarity: 0,
		value: 55,
		baseIncome: 0.25,
	},
	114: {
		id: 114,
		cardType: 0,
		displayName: 'Refrigerated Warehouse',
		emoji: '🏢',
		hubType: 2,
		rarity: 1,
		value: 260,
		baseIncome: 2,
	},
	115: {
		id: 115,
		cardType: 0,
		displayName: 'Smart Warehouse',
		emoji: '🏢',
		hubType: 2,
		rarity: 2,
		value: 380,
		baseIncome: 6,
	},
	116: {
		id: 116,
		cardType: 0,
		displayName: 'Small Item Courier Fleet',
		emoji: '🚙',
		hubType: 3,
		rarity: 0,
		value: 45,
		baseIncome: 0.75,
	},
	117: {
		id: 117,
		cardType: 0,
		displayName: 'Van Fleet',
		emoji: '🚙',
		hubType: 3,
		rarity: 0,
		value: 50,
		baseIncome: 0.5,
	},
	118: {
		id: 118,
		cardType: 0,
		displayName: 'Container Truck Fleet',
		emoji: '🚙',
		hubType: 3,
		rarity: 0,
		value: 55,
		baseIncome: 0.25,
	},
	119: {
		id: 119,
		cardType: 0,
		displayName: 'Distribution Centre',
		emoji: '🚙',
		hubType: 3,
		rarity: 1,
		value: 230,
		baseIncome: 4,
	},
	120: {
		id: 120,
		cardType: 0,
		displayName: 'Mega Distribution Centre',
		emoji: '🚙',
		hubType: 3,
		rarity: 2,
		value: 360,
		baseIncome: 8,
	},
};

const getCardById = (id) => (Cards[id] != undefined ? Cards[id] : Cards[0]);

const unwrapHubCard = ({
	id,
	emoji,
	displayName,
	description,
	cardType,
	rarity,
	value,
	baseIncome,
	hubType,
}) => ({
	id,
	emoji,
	displayName,
	description,
	cardType,
	rarity,
	value,
	baseIncome,
	hubType,
});

const unwrapActionCard = ({
	id,
	emoji,
	displayName,
	description,
	cardType,
	rarity,
	isTargetCard,
	isTargetPlayer,
	isTargetSelfCard,
	isTargetHubType,
}) => ({
	id,
	emoji,
	displayName,
	description,
	cardType,
	rarity,
	isTargetCard,
	isTargetPlayer,
	isTargetSelfCard,
	isTargetHubType,
});

const unwrapCard = (card) =>
	card.cardType == 1 ? unwrapActionCard(card) : unwrapHubCard(card);

async function useCard(req, res) {
	try {
		console.log(req.query);
		const user = await queries.userHasCard(
			req.user.id,
			parseInt(req.query.cardId),
			parseInt(req.query.instanceId)
		);
		if (!user) return res.status(400).json('Card does not exist');
		const parsedQuery = {
			targetId: req.query.targetId,
			targetCardId: parseInt(req.query.targetCardId),
			selfCardId: parseInt(req.query.selfCardId),
			cardType: parseInt(req.query.cardType),
		};
		const r = await Cards[req.query.cardId].onUse(parsedQuery, req.user);
		const del = await queries.destroyCard(
			req.user.id,
			parseInt(req.query.cardId),
			parseInt(req.query.instanceId)
		);
		const logData = {
			userId: req.user.id,
			...req.query,
		};
		await queries.updateActionLog(user.game.id, logData, 0);
		return res.status(200).json(r);
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

async function getCards(req, res) {
	const unwrapped = {};
	Object.keys(Cards).forEach((key) => {
		unwrapped[key] = unwrapCard(Cards[key]);
	});
	res.json(unwrapped);
}

module.exports = { Cards, useCard, getCards };
