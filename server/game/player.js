class Player {
    id = null;
	username = null;
	password = null;
	displayName = null;
	cash = null;
    netWorth = null;
    netEarnings = null;
    gameId = null;
    numberOfCardsDrawn = null;
    cardIds = null;
    turnIncome = null;
    newCards = null;

	constructor(info) {
        this.id = info._id.toString();
        this.username = info.username;
        this.password = info.password;
        this.displayName = info.displayName;

        this.cash = info.cash;
        this.netWorth = info.netWorth;
        this.netEarnings = info.netEarnings;
        this.turnIncome = info.turnIncome;   

        this.gameId = info.gameId;

        this.numberOfCardsDrawn = info.numberOfCardsDrawn;
        this.cardIds = info.cardIds;
             
        this.newCards = [];
	}
}

module.exports = Player;