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
	},
	10: {
		id: 10,
		emoji: '🏢',
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
	25: {
		id: 25,
		emoji: '🏢',
		displayName: 'hub25',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 14,
		baseIncome: 1,
		step: 2,
		industry: 2,
	},
	101: {
		id: 101,
		emoji: '🏢',
		displayName: 'hub101',
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
		emoji: '🏢',
		displayName: 'hub102',
		description: 'test',
		cardType: 0,
		rarity: 2,
		value: 11,
		baseIncome: 2,
		step: 1,
		industry: 0,
	},
	103: {
		id: 103,
		emoji: '🏢',
		displayName: 'hub103',
		description: 'test',
		cardType: 0,
		rarity: 3,
		value: 11,
		baseIncome: 2,
		step: 2,
		industry: 0,
	},
	104: {
		id: 104,
		emoji: '🏢',
		displayName: 'hub103',
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
		emoji: '🏢',
		displayName: 'hub103',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 11,
		baseIncome: 2,
		step: 1,
		industry: 0,
	},
	106: {
		id: 106,
		emoji: '🏢',
		displayName: 'hub103',
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
		emoji: '🏢',
		displayName: 'hub107',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 12,
		baseIncome: 2,
		step: 1,
		industry: 0,
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
		console.log(req.user.id, req.query.cardId, req.query.instanceId);
		const user = await queries.userHasCard(
			req.user.id,
			req.query.cardId,
			req.query.instanceId
		);
		console.log(user);
		const r = await Cards[req.query.cardId].onUse(req.query, req.user);
		await queries.destroyCard(
			req.user.id,
			req.query.cardId,
			req.query.instanceId
		);
		res.status(200).json(r);
	} catch (err) {
		res.status(400).json(err);
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
