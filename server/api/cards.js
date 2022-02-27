const { userHasCard } = require('../queries/queries');
const queries = require('../queries/queries');

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
		description: 'Steal $300 from a player',
		cardType: 1,
		rarity: 0,
		isTargetCard: false,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		onUse: ({ targetId, targetCardId, selfCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					console.log(targetId, targetCardId, selfCardId);
					await queries.addMoney(targetId, -300);
					await queries.addMoney(user.id, 300);
					return res(`$300 was stolen from ${targetId}`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	11: {
		id: 11,
		emoji: '🏢',
		displayName: 'Pickpocket II',
		description: 'Steal $500 from a player',
		cardType: 1,
		rarity: 1,
		isTargetCard: false,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		onUse: ({ targetId, targetCardId, selfCardId }, user) =>
			new Promise(async (res, rej) => {
				try {
					console.log(targetId, targetCardId, selfCardId);
					await queries.addMoney(targetId, -500);
					await queries.addMoney(user.id, 500);
					return res(`$500 was stolen from ${targetId}`);
				} catch (err) {
					rej(err);
				}
			}),
	},
	101: {
		id: 101,
		emoji: '🐔',
		displayName: "Chee's Poultry",
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 11,
		baseIncome: 2,
		step: 0,
		industry: 0,
	},
	102: {
		id: 102,
		emoji: '🏭',
		displayName: 'Kim Seng Food Factory',
		description: 'Kim Food Factory',
		cardType: 0,
		rarity: 2,
		value: 32,
		baseIncome: 2,
		step: 1,
		industry: 0,
	},
	103: {
		id: 103,
		emoji: '🚚',
		displayName: 'Zippz Distribution',
		description: 'Zippz Distribution',
		cardType: 0,
		rarity: 3,
		value: 11,
		baseIncome: 2,
		step: 2,
		industry: 0,
	},
	104: {
		id: 104,
		emoji: '🍜',
		displayName: 'Bao Bao Diner',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 11,
		baseIncome: 2,
		step: 3,
		industry: 0,
	},
	105: {
		id: 105,
		emoji: '⚒️',
		displayName: 'Hup Beng Materials',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 4,
		baseIncome: 0.4,
		step: 0,
		industry: 1,
	},
	106: {
		id: 106,
		emoji: '🌩️',
		displayName: 'Amnicron Microchips',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 11,
		baseIncome: 2,
		step: 1,
		industry: 1,
	},
	107: {
		id: 107,
		emoji: '🛬',
		displayName: 'MPL Delivery',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 12,
		baseIncome: 2,
		step: 2,
		industry: 1,
	},
	108: {
		id: 108,
		emoji: '🍐',
		displayName: 'Pear Inc',
		description: 'test',
		cardType: 0,
		rarity: 3,
		value: 125,
		baseIncome: -3,
		step: 3,
		industry: 1,
	},
	109: {
		id: 109,
		emoji: '🐄',
		displayName: 'Old Cow Fabrics',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 1,
		baseIncome: 0.3,
		step: 3,
		industry: 2,
	},
	110: {
		id: 110,
		emoji: '🧵',
		displayName: 'Toughman Garment Factory',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 2,
		baseIncome: 0.5,
		step: 3,
		industry: 2,
	},
	111: {
		id: 109,
		emoji: '🛩️',
		displayName: 'ABL Logistics',
		description: 'test',
		cardType: 0,
		rarity: 1,
		value: 10,
		baseIncome: -0.3,
		step: 3,
		industry: 2,
	},
	112: {
		id: 109,
		emoji: '👗',
		displayName: 'HMN Clothing',
		description: 'test',
		cardType: 0,
		rarity: 2,
		value: 30,
		baseIncome: 0.2,
		step: 3,
		industry: 2,
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
	step,
	industry,
}) => ({
	id,
	emoji,
	displayName,
	description,
	cardType,
	rarity,
	value,
	baseIncome,
	step,
	industry,
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
});

const unwrapCard = (card) =>
	card.cardType == 1 ? unwrapActionCard(card) : unwrapHubCard(card);

async function useCard(req, res) {
	try {
		const user = await queries.userHasCard(
			req.user.id,
			req.query.cardId,
			req.query.instanceId
		);
		if (!user) return res.status(400).json('Card does not exist');
		const r = await Cards[req.query.cardId].onUse(req.query, req.user);
		const del = await queries.destroyCard(
			req.user.id,
			parseInt(req.query.cardId),
			parseInt(req.query.instanceId)
		);
		const logData = {
			userId: req.user.id,
			...req.query,
		};
		await queries.updateActionLog(user.gameId, logData);
		return res.status(200).json(r);
	} catch (err) {
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
