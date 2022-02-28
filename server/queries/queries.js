const { AuthMechanism } = require('mongodb');
const mongo = require('../utils/mongo');
const ObjectId = require('mongodb').ObjectId;

async function getUserDataByUsername(username) {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne({ username: username })
		.catch(console.dir);
}

async function getUserDataMinById(playerId) {
	const game = await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.findOne({
			playerIds: playerId,
		})
		.catch(console.dir);

	if (game) {
		//Get all users in the same game
		var userDataMinArray = [];

		for (playerId of game.playerIds) {
			//console.log(playerId)
			const query = {
				_id: ObjectId(playerId),
			};

			const projection = {
				//_id is returned by default
				displayName: 1,
			};

			const userDataMin = await mongo.client
				.db('HubEmpireDB')
				.collection('Users')
				.findOne(query, { projection: projection })
				.catch(console.dir);

			userDataMinArray.push(userDataMin);
		}
		return userDataMinArray;
	} else {
		return null;
	}
}

async function getUserDataBasicById(id) {
	const query = {
		_id: ObjectId(id),
		// username: req.body.username,
		// password: req.body.password
	};

	const projection = {
		//_id is returned by default
		displayName: 1,
		cash: 1,
		cardIds: 1,
		turnIncome: 1,
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne(query, { projection: projection })
		.catch(console.dir);
}

async function getUserDataById(id) {
	const query = {
		_id: ObjectId(id),
		// username: req.body.username,
		// password: req.body.password
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne(query)
		.catch(console.dir);
}

async function getUserCardsById(id) {
	const query = {
		_id: ObjectId(id),
		// username: req.body.username,
		// password: req.body.password
	};

	const projection = {
		//_id is returned by default
		cardIds: 1,
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne(query, { projection: projection })
		.catch(console.dir);
}

async function addNewGame(newGame) {
	//Need to check if Game ID already exists in DB
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.insertOne(newGame)
		.catch(console.dir);
}

async function getAllExistingGames() {
	return await mongo.client.db('HubEmpireDB').collection('Games').find();
}

async function getGameByGameId(gameCode) {
	const query = {
		code: gameCode,
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.findOne(query)
		.catch(console.dir);
}

async function assignGameIdToPlayer(gameId, playerId) {
	const query = { _id: ObjectId(playerId) };
	const valueToAppend = { $set: { gameId: gameId } };

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, valueToAppend)
		.catch(console.dir);
}

async function addPlayerToGame(gameId, playerId) {
	//Check if player is already in a game
	const query = { code: gameId };
	const valueToAppend = { $push: { playerIds: playerId } };

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.updateOne(query, valueToAppend)
		.catch(console.dir);
}

async function addMoney(playerId, amount) {
	const query = { _id: ObjectId(playerId) };
	const valueToChange = {
		$inc: { cash: amount },
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, valueToChange)
		.catch(console.dir);
}

async function userHasCard(playerId, cid, iid) {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne(
			{
				_id: ObjectId(playerId),
			},
			{
				cardIds: {
					$elemMatch: { cardId: cid, instanceId: iid },
				},
			}
		)
		.catch(console.dir);
}

async function destroyCard(playerId, cid, iid) {
	const query = {
		_id: ObjectId(playerId),
	};
	const options = {
		$pull: { cardIds: { cardId: cid, instanceId: iid } },
	};
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, options)
		.catch(console.dir);
}

async function updateActionLog(gameId, data) {
	const query = {
		code: gameId,
	};
	const valueToChange = {
		$push: { log: { ...data, time: Date.now() } },
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.updateOne(query, valueToChange)
		.catch(console.dir);
}

async function getActionLog(gameId, start, amount) {
	const query = {
		code: gameId,
	};
	const projection = { $slice: [start, amount] };

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.aggregate([
			{
				$match: query,
			},
			{
				$project: {
					log: {
						$slice: ['$log', parseInt(start), parseInt(amount)],
					},
				},
			},
		]);
}

async function updateUserStatsAndInventory(player) {
	const query = { 
		_id: ObjectId(player.id)
	};

	const valuesToUpdate = {
		$set: {
			cash: player.cash,
			netWorth: player.netWorth,
			turnIncome: player.turnIncome,
			numberOfCardsDrawn: player.numberOfCardsDrawn,
		},
		$push: {
			cardIds: {
				$each: player.newCards
			}
		},
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, valuesToUpdate)
		.catch(console.dir);
}

async function updateGameTurnNumber(code, turnNumber) {
	const query = { 
		code: code
	};

	const valuesToUpdate = {
		$set: {
			turnNumber: turnNumber,
		}
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.updateOne(query, valuesToUpdate)
		.catch(console.dir);
}

async function getLeaderboard(gameId) {
	const query = { 
		gameId: gameId
	};

	const projection = {
		displayName: 1,
		netWorth: 1,
		turnIncome: 1
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.find(query, { projection: projection })
		.sort( { netWorth: -1 } )
		.toArray();
}

const queries = {
	getUserDataByUsername,
	getUserDataMinById,
	getUserDataBasicById,
	getUserDataById,
	getUserCardsById,
	addNewGame,
	getAllExistingGames,
	getGameByGameId,
	assignGameIdToPlayer,
	addPlayerToGame,
	addMoney,
	userHasCard,
	destroyCard,
	updateActionLog,
	getActionLog,
	updateUserStatsAndInventory,
	updateGameTurnNumber,
	getLeaderboard,
};

module.exports = queries;
