const { Cards } = require('../api/cards');

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

function truncateValueToTwoDp(number) {
    return parseFloat(number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
}

module.exports = {
	getAssetValue,
	truncateValueToTwoDp,
};
