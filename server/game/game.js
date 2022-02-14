const cardCollection = require ("./cards.js");
const queries = require('../queries/queries');

class Game {
    joinId = null;
    turnNumber = null;
    playerIds = null;
    cardIds = cardCollection.cards

    constructor(game, isNew) {
        if(isNew){
            //new game
            this.id = game.id;
            this.turnNumber = 0;
            this.playerIds = []
        } else {
            //get all this from mongo
            this.turnNumber = 0;
            this.playerIds = [1, 2, 3]
            //console.log(cardCollection.cardsById[1001])
        }   
    }

    executeTurn() {
        queries.getAllExistingGames()
        .then(cursor => {
            cursor.count(function(err, count) {
                console.log("Number of Games found: " + count)
            });
            cursor.forEach(game => {
                //Do things for each game in the db
                //console.log(game)
            });
            //console.log(gameArray.count)
        })
        .catch(err => {
            console.log(err)
        });

        return;
        this.turnNumber += 1;
        console.log("Turn " + this.turnNumber + ":")
        //calculate income
            //lone cards
            //collections
        //update leaderboard

        //give players new cards
        this.playerIds.forEach(player => {
            this.chosenCard = this.cardIds[Math.floor(Math.random() * this.cardIds.length)]
            console.log(player + " gets " + this.chosenCard.description)
            console.log(this.chosenCard.type)
            // if(this.chosenCard.type == "Action") {
            //     this.chosenCard.applyEffect(1);
            // }
        });

        //put new cards into database
    }

}

module.exports = Game;