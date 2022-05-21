const userUtils = require('../utils/userUtils');

class Player {
    profile = {
        id: null,
        username: null,
        password: null,
        displayName: null,
    };

    game = {
        id: null,
        stats: {
            netWorth: null,
            cash: null,
            turnIncome: null,
            numberOfCardsDrawn: null,
        },
        inventory: {
            cardInstances: null,
            newCards: null,
            stolenCards: null,
        }
    };
    
	constructor(info) {
        this.profile = {
            id: info._id.toString(),
            username: info.profile.username,
            password: info.profile.password,
            displayName: info.profile.displayName,
        }

        this.game = {
            id: info.game.id,
            stats: {
                netWorth: info.game.stats.netWorth,
                cash: info.game.stats.cash,
                turnIncome: info.game.stats.turnIncome,
                numberOfCardsDrawn: info.game.stats.numberOfCardsDrawn,
            },
            inventory: {
                cardInstances: info.game.inventory.cardInstances,
                newCards: [],
                stolenCards: info.game.inventory.stolenCards,
            }
        }
	}

    calculateNetWorth() {
        var totalAssetValue = userUtils.getAssetValue(this.game.inventory.cardInstances);
        var totalCash = this.game.stats.cash;

        this.game.stats.netWorth = totalCash + totalAssetValue;

        return;
    }
}

module.exports = Player;