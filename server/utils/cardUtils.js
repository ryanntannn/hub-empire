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

function filterCardArrayByRarity(cardArray, rarity){
	if(cardArray) {
		return cardArray.filter(card => {
			return card.rarity == rarity;
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

function getRandomCommonCardFromCardArray(cardArray) {
	const filteredCardArray = this.filterInvalidCardInCardArray(cardArray);
	const commonCards = this.filterCardArrayByRarity(filteredCardArray, 0)
	var number = Math.floor(Math.random() * commonCards.length);
	return commonCards[number];
}

function getRandomRareCardFromCardArray(cardArray) {
	const filteredCardArray = this.filterInvalidCardInCardArray(cardArray);
	const rareCards = this.filterCardArrayByRarity(filteredCardArray, 1)
	var number = Math.floor(Math.random() * rareCards.length);
	return rareCards[number];
}

function getRandomEpicCardFromCardArray(cardArray) {
	const filteredCardArray = this.filterInvalidCardInCardArray(cardArray);
	const epicCards = this.filterCardArrayByRarity(filteredCardArray, 2)
	var number = Math.floor(Math.random() * epicCards.length);
	return epicCards[number];
}

module.exports = {
	calculateEffectiveIncomeOfCard,
	getOneCardFromCardArrayByInstanceId,
	convertDeckObjectToArray,
	filterCommonCardsInCardArray,
	filterInvalidCardInCardArray,
	filterCardArrayByRarity,
	getRandomCardFromCardArray,
	getRandomCommonCardFromCardArray,
	getRandomRareCardFromCardArray,
	getRandomEpicCardFromCardArray,
};