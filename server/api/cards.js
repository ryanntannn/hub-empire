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
		displayName: 'Au au',
		description: 'Limpeh go salakau fight gang lmao who u',
		cardType: 1,
		rarity: 0,
		isTargetCard: true,
		isTargetPlayer: true,
		isTargetSelfCard: false,
		onUse: ({ targetId, targetCardId, selfCardId }) =>
			new Promise((res, rej) => {
				console.log(targetId, targetCardId, selfCardId);
				return res('test');
			}),
	},
	103: {
		id: 103,
		emoji: '🏢',
		displayName: 'hub103',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 11,
		baseIncome: 2,
		step: 0,
		industry: 0,
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
	11: {
		id: 11,
		emoji: '🏢',
		displayName: 'hub11',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 13,
		baseIncome: 2,
		step: 2,
		industry: 1,
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
	Cards[req.query.cardId]
		.onUse(req.query)
		.then((r) => res.status(200).json(r))
		.catch((err) => res.status(400).json(err));
}

async function getCards(req, res) {
	const unwrapped = {};
	Object.keys(Cards).forEach((key) => {
		unwrapped[key] = unwrapCard(Cards[key]);
	});
	res.json(unwrapped);
}

module.exports = { useCard, getCards };
