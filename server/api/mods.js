const OWNER_TYPE = 0;
const HUB_TYPE = 1;
const INCOME_TYPE = 2;

class Mod {
    isPermanent = null;
    turnsLeft = null;

    constructor(isPermanent, turnsLeft) {
        this.isPermanent = isPermanent;
        if(isPermanent) {
            this.turnsLeft = null;
        } else {
            this.turnsLeft = turnsLeft;
        }
        
    }
}

class OwnerMod extends Mod{
    modType = OWNER_TYPE;
    playerId = null;

    constructor(playerId, isPermanent, turnsLeft) {
        super(isPermanent, turnsLeft);
        this.playerId = playerId;
    }
}

class HubMod extends Mod {
    modType = HUB_TYPE;
    newHubType = null;
    
    constructor(isPermanent, turnsLeft, newHubType){
        super(isPermanent, turnsLeft);
        this.newHubType = newHubType;
    }
}

class IncomeMod extends Mod {
    modType = INCOME_TYPE;
    incomeBoost = null;
    isAdditive = null; //True: Additive Scaling, False: Percentage scaling

    constructor(isPermanent, turnsLeft, incomeBoost, isAdditive){
        super(isPermanent, turnsLeft);
        this.incomeBoost = incomeBoost;
        this.isAdditive = isAdditive;
    }
}

module.exports = {
    OwnerMod,
    HubMod,
    IncomeMod,
}