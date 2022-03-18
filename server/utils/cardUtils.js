function getOneCardFromCardArrayByInstanceId(cardArray, instanceId){
	if(cardArray) {
		var card = cardArray.filter(cardObj => {
			return cardObj.instanceId == instanceId;
		})[0];
		return card;
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

module.exports = {
	calculateEffectiveIncomeOfCard,
	getOneCardFromCardArrayByInstanceId,
};