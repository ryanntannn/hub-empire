const { Cards } = require('../api/cards');
const queries = require('../queries/queries');

function getAssetValue(cards) {
	let value = 0;
	if (cards == null) return 0;
	cards.forEach((cardInstance) => {
		const thisCard = Cards[cardInstance.cardId];
		if (thisCard == undefined) return;
		if (thisCard.cardType != 0) return;
		value += thisCard.value;
	});
	//console.log('Value:', value);
	return value;
}

function getEarningsThisTurn(cards) {
	let value = 0;
	cards.forEach((cardInstance) => {
		const thisCard = Cards[cardInstance.cardId];
		if (thisCard == undefined) return;
		if (thisCard.cardType != 0) return;
		value += thisCard.baseIncome;
	});
	console.log('Value: ', value);
	return value;
}

async function updateCardsWorth(targetId) {
	try {
		const cards = await queries.getUserCardsById(targetId);
		console.log(targetId, getEarningsThisTurn(cards), getAssetValue(cards));
		await queries.updateCardsWorth(targetId, getAssetValue(cards));
	} catch (err) {
		throw err;
	}
}

function truncateValueToTwoDp(number) {
    return parseFloat(number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
}

module.exports = {
	getAssetValue,
	getEarningsThisTurn,
	updateCardsWorth,
	truncateValueToTwoDp,
};
