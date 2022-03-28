function getOneCardFromCardArrayByInstanceId(cardArray, instanceId){
	if(cardArray) {
		return cardArray.filter(card => {
			return card.instanceId == instanceId;
		})[0];
	} else {
		return null;
	}
}

function calculateEffectiveIncomeOfCard(card, deck){
	if(card == null) return null;
	var incomeMods = card.modifiers.income;
	var effectiveCardIncome = deck[parseInt(card.cardId)].baseIncome;
	incomeMods.forEach(mod => {
		if(mod.isAdditive){
			effectiveCardIncome += mod.incomeBoost;
		} else {
			effectiveCardIncome *= mod.incomeBoost;
		}
	})
	console.log("Income of ID " + card.cardId + ": " + effectiveCardIncome)

	return effectiveCardIncome;
}

function convertDeckObjectToArray(obj){
	return Object.values(obj);
}

function filterCommonCardsInCardArray(cardArray){
	if(cardArray) {
		return cardArray.filter(card => {
			return card.rarity == 0;
		});
	} else {
		return null;
	}
}

function filterInvalidCardInCardArray(cardArray){
	if(cardArray) {
		return cardArray.filter(card => {
			return card.id != 0;
		});
	} else {
		return null;
	}
}

function getRandomCardFromCardArray(cardArray) {
	const filteredCardArray = this.filterInvalidCardInCardArray(cardArray);
	var number = Math.floor(Math.random() * filteredCardArray.length);
	return filteredCardArray[number];
}

module.exports = {
	calculateEffectiveIncomeOfCard,
	getOneCardFromCardArrayByInstanceId,
	convertDeckObjectToArray,
	filterCommonCardsInCardArray,
	filterInvalidCardInCardArray,
	getRandomCardFromCardArray,
};