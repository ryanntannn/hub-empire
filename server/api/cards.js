const Cards = {
	0: {
		id: 0,
		emoji: '⚠️',
		displayName: 'error',
		description: `this card does not exist anymore`,
		cardType: 1,
		rarity: 0,
		isTargetCard: false,
		isTargetPlayer: true,
		isTargetSelfCard: false,
	},
	10: {
		id: 10,
		emoji: '🏢',
		displayName: 'Au au',
		description: 'Limpeh go salakau fight gang lmao who u',
		cardType: 1,
		rarity: 0,
		isTargetCard: false,
		isTargetPlayer: true,
		isTargetSelfCard: false,
	},
	11: {
		id: 11,
		emoji: '🏢',
		displayName: 'hub11',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 10,
		baseIncome: 2,
		step: 2,
		industry: 2,
	},
	25: {
		id: 25,
		emoji: '🏢',
		displayName: 'hub25',
		description: 'test',
		cardType: 0,
		rarity: 0,
		value: 10,
		baseIncome: 1,
		step: 2,
		industry: 2,
	},
};

const getCardById = (id) => (Cards[id] != undefined ? Cards[id] : Cards[0]);

async function useCard(req, res) {
	console.log(req);
}

async function getCards(req, res) {
	res.json(Cards);
}

module.exports = { useCard, getCards };
