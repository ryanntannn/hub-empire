const mongo = require('../utils/mongo');
const ObjectId = require('mongodb').ObjectId;

async function getUserDataByUsername(username) {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne({ username: username })
		.catch(console.dir);
}

async function getUserDataMinById(id) {
	const query = {
		_id: ObjectId(id),
		// username: req.body.username,
		// password: req.body.password
	};

	const projection = {
		//_id is returned by default
		displayName: 1,
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne(query, { projection: projection })
		.catch(console.dir);
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
		netWorth: 1,
		netEarnings: 1,
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
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.insertOne(newGame)
		.catch(console.dir);
}

async function getAllExistingGames() {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.find();
}

async function getGameByGameId(gameId) {
	const query = {
		gameId: gameId,
	};

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.findOne(query)
		.catch(console.dir);
}

async function addPlayerToGame(gameId, playerId) {
	const query = { gameId: gameId };
	const valueToAppend = { $push: { playerIds: playerId } };

	return await mongo.client
		.db('HubEmpireDB')
		.collection('Games')
		.updateOne(query, valueToAppend)
		.catch(console.dir);
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
	addPlayerToGame,
};

module.exports = queries;
