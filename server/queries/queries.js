const { AuthMechanism } = require('mongodb');
const mongo = require('../utils/mongo');
const ObjectId = require('mongodb').ObjectId;

async function getUserDataByUsername(username) {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne({ 'profile.username': username })
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
				'profile.displayName': 1,
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
	};
	const projection = {
		//_id is returned by default
		'profile.displayName': 1,
		'profile.avatar': 1,
		'profile.isAdmin': 1,
		game: {
			id: 1,
			stats: {
				cash: 1,
				netWorth: 1,
				turnIncome: 1,
			},
			// 'inventory': {
			// 	'cardInstances': 1,
			// },
		},
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
	};

	const projection = {
		//_id is returned by default
		'game.inventory.cardInstances': 1,
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

async function getGameByGameId(joinCode) {
	const query = {
		joinCode: joinCode,
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.findOne(query)
		.catch(console.dir);
}

async function assignGameIdToPlayer(gameId, playerId) {
	const query = { _id: ObjectId(playerId) };
	const valueToAppend = { $set: { 'game.id': gameId } };

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, valueToAppend)
		.catch(console.dir);
}

async function addPlayerToGame(joinCode, playerId) {
	//Check if player is already in a game

	const query = { joinCode: joinCode };
	const valueToAppend = { $push: { playerIds: playerId } };

	console.log('query: ' + query);
	console.log('valueToAppend: ' + valueToAppend);

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.updateOne(query, valueToAppend)
		.catch(console.dir);
}

async function addMoney(playerId, amount) {
	const query = { _id: ObjectId(playerId) };
	const valueToChange = {
		$inc: { 'game.stats.cash': amount },
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
				'game.inventory.cardInstances': {
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
		$pull: {
			'game.inventory.cardInstances': { cardId: cid, instanceId: iid },
		},
	};
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, options)
		.catch(console.dir);
}

async function updateActionLog(gameId, data, logType) {
	console.log(gameId, data, logType);
	const query = {
		joinCode: gameId,
	};
	const valueToChange = {
		$push: {
			log: {
				...data,
				time: Date.now(),
				logType, // LogType: ACTION_LOG
			},
		},
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.updateOne(query, valueToChange)
		.catch(console.dir);
}

async function getActionLog(gameId, start, amount) {
	const query = {
		joinCode: gameId,
	};

	const startInt = parseInt(start);
	const amountInt = parseInt(amount);
	const slice =
		startInt > 0 ? ['$log', -startInt, amountInt] : ['$log', -amountInt];

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
						$slice: slice,
					},
				},
			},
		]);
}

async function updateUserStatsAndInventory(player) {
	const query = {
		_id: ObjectId(player.profile.id),
	};

	const newValues = {
		$set: {
			'game.stats': {
				cash: player.game.stats.cash,
				netWorth: player.game.stats.netWorth,
				turnIncome: player.game.stats.turnIncome,
				numberOfCardsDrawn: player.game.stats.numberOfCardsDrawn,
			},
			'game.inventory': {
				cardInstances: player.game.inventory.cardInstances,
				newCards: player.game.inventory.newCards,
				stolenCards: player.game.inventory.stolenCards,
			},
		},
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, newValues)
		.catch(console.dir);

	return;
}

async function incrementGameTurnNumber(joinCode) {
	const query = {
		joinCode: joinCode,
	};

	const valueToIncrement = {
		$inc: {
			turnNumber: 1,
		},
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.updateOne(query, valueToIncrement)
		.catch(console.dir);
}

async function getLeaderboard(gameId) {
	const query = {
		'game.id': gameId,
	};

	const projection = {
		'profile.displayName': 1,
		'profile.avatar': 1,
		'game.stats': {
			netWorth: 1,
			turnIncome: 1,
		},
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.find(query, { projection: projection })
		.sort({ 'game.stats.netWorth': -1 })
		.toArray();
}

async function applyNewModToCard(playerId, instanceId, mod) {
	const query = {
		_id: ObjectId(playerId),
		'game.inventory.cardInstances': {
			$elemMatch: {
				instanceId: instanceId,
			},
		},
	};

	var modToInsert = {};

	switch (parseInt(mod.modType)) {
		//Owner Mod
		case 0:
			modToInsert = {
				$set: {
					'game.inventory.cardInstances.$.modifiers.owner': mod,
				},
			};
			break;
		//Hub Mod
		case 1:
			modToInsert = {
				$set: {
					'game.inventory.cardInstances.$.modifiers.hub': mod,
				},
			};
			break;
		//Income Mod
		case 2:
			modToInsert = {
				$push: {
					'game.inventory.cardInstances.$.modifiers.income': mod,
				},
			};
			break;
		//Invalid Mod Type
		default:
	}

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, modToInsert)
		.catch(console.dir);
}

async function updateEffectiveIncomeOfCard(
	playerId,
	instanceId,
	newEffectiveIncome
) {
	const query = {
		_id: ObjectId(playerId),
		'game.inventory.cardInstances': {
			$elemMatch: {
				instanceId: instanceId,
			},
		},
	};

	const newValues = {
		$set: {
			'game.inventory.cardInstances.$.effectiveIncome':
				newEffectiveIncome,
		},
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, newValues)
		.catch(console.dir);

	return;
}

async function addStolenCardToPlayerInventory(
	playerId,
	targetPlayerId,
	targetCardId,
	targetCardInstanceId
) {
	const query = {
		_id: ObjectId(playerId),
	};

	const newValues = {
		$push: {
			'game.inventory.stolenCards': {
				playerId: targetPlayerId,
				cardId: targetCardId,
				instanceId: targetCardInstanceId,
			},
		},
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, newValues)
		.catch(console.dir);
}

async function updateProfile(playerId, displayName, avatar) {
	const query = {
		_id: ObjectId(playerId),
	};

	const newValues = {
		$set: {
			'profile.displayName': displayName,
			'profile.avatar': avatar,
		},
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateOne(query, newValues)
		.catch(console.dir);

	return;
}

async function addCard(newCard) {
	await mongo.client
		.db('HubEmpireDB')
		.collection('Cards')
		.insertOne(newCard)
		.catch(console.dir);
	return;
}

async function getCardById(id) {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Cards')
		.findOne({ id: id })
		.catch(console.dir);
}

async function decrementOwnerModTurnNumber() {
	const query = {
		'game.inventory.cardInstances': {
			$elemMatch: {
				'modifiers.owner.isPermanent': false,
			},
		},
	};

	const valueToDecrement = {
		$inc: {
			'game.inventory.cardInstances.$.modifiers.owner.turnsLeft': -1,
		},
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		//.updateMany(query, valueToDecrement)
		.updateMany(query, valueToDecrement)
		.catch(console.dir);

	return;
}

async function deleteExpiredOwnerMods() {
	const query = {
		'game.inventory.cardInstances': {
			$elemMatch: {
				'modifiers.owner.isPermanent': false,
			},
			$elemMatch: {
				'modifiers.owner.turnsLeft': { $lte: 0 },
			},
		},
	};

	const valueToReset = {
		$set: {
			'game.inventory.cardInstances.$.modifiers.owner': {},
		},
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateMany(query, valueToReset)
		.catch(console.dir);

	return;
}

async function decrementHubModTurnNumber() {
	const query = {
		'game.inventory.cardInstances': {
			$elemMatch: {
				'modifiers.hub.isPermanent': false,
			},
		},
	};

	const valueToDecrement = {
		$inc: {
			'game.inventory.cardInstances.$.modifiers.hub.turnsLeft': -1,
		},
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateMany(query, valueToDecrement)
		.catch(console.dir);

	return;
}

async function deleteExpiredHubMods() {
	const query = {
		'game.inventory.cardInstances': {
			$elemMatch: {
				'modifiers.hub.isPermanent': false,
			},
			$elemMatch: {
				'modifiers.hub.turnsLeft': { $lte: 0 },
			},
		},
	};

	const valueToReset = {
		$set: {
			'game.inventory.cardInstances.$.modifiers.hub': {},
		},
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateMany(query, valueToReset)
		.catch(console.dir);

	return;
}

async function decrementIncomeModTurnNumber() {
	const valueToDecrement = {
		$inc: {
			'game.inventory.cardInstances.$[i].modifiers.income.$[j].turnsLeft':
				-1,
		},
	};

	const arrayFilter = {
		arrayFilters: [
			{
				'i.cardType': 0,
			},
			{
				'j.isPermanent': false,
			},
		],
	};

	await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		//.updateMany(query, valueToDecrement)
		.updateMany({}, valueToDecrement, arrayFilter)
		.catch(console.dir);

	return;
}

async function deleteExpiredIncomeMods() {
	const valueToRemove = {
		$pull: {
			'game.inventory.cardInstances.$[i].modifiers.income': {
				isPermanent: false,
				turnsLeft: { $lte: 0 },
			},
		},
	};

	const arrayFilter = {
		arrayFilters: [
			{
				'i.cardType': 0,
			},
		],
	};

	var res = await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.updateMany({}, valueToRemove, arrayFilter)
		.catch(console.dir);

	console.log(res);

	return;
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
	incrementGameTurnNumber,
	getLeaderboard,
	applyNewModToCard,
	updateEffectiveIncomeOfCard,
	addStolenCardToPlayerInventory,
	updateProfile,
	addCard,
	getCardById,
	decrementOwnerModTurnNumber,
	deleteExpiredOwnerMods,
	decrementHubModTurnNumber,
	deleteExpiredHubMods,
	decrementIncomeModTurnNumber,
	deleteExpiredIncomeMods,
};

module.exports = queries;
