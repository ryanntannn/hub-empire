class Card {
    id;
    name;
    description;
    type;
    cardValue;
}

class Card1 extends Card{
    id = 1001
    name = "Hub Card Common";
    description = "Common A S Hub Card";
    type = "Hub"
    incomePerTurn = 1001;

    industry = "Agriculture";
    supplyRole = "Supplier";
    
    rarity = "Common";
    
}

class Card2 extends Card{
    id = 1002
    name = "Hub Card Rare";
    description = "Rare A S Hub Card";
    type = "Hub"
    incomePerTurn = 1002;

    industry = "Technology";
    supplyRole = "Supplier";

    rarity = "Rare";
}

class Card3 extends Card {
    id = 1003
    name = "Hub Card Rare";
    description = "Rare F M Hub Card";
    type = "Hub"
    incomePerTurn = 1003;

    industry = "Fashion";
    supplyRole = "Manufacturer";
    rarity = "Rare";
    
}

class ActionCardSteal extends Card {
    id = 2001
    name = "Action Card Rare";
    description = "Rare Money Steal";
    type = "Action"

    amountToSteal = 300

    applyEffect(playerId) {
        console.log("Steal " + this.amountToSteal + " from " + playerId);
    }
}

class CardCollection {
    cards = [
        new Card1,
        new Card2,
        new Card3,
        new ActionCardSteal
    ]
}

module.exports = new CardCollection