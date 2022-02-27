const { Cards } = require('../api/cards');

function getAssetValue(cards) {
	let value = 0;
	cards.forEach((cardInstance) => {
		const thisCard = Cards[cardInstance.cardId];
		if (thisCard.cardType != 0) return;
		value += thisCard.value;
	});
	console.log('Value: ', value);
	return value;
}

module.exports = {
	getAssetValue,
};
