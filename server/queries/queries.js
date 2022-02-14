const mongo = require('../utils/mongo');
const ObjectId = require('mongodb').ObjectId;

async function getUserDataByUsername(username) {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne({ username: username })
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

const queries = {
	getUserDataByUsername,
	getUserDataBasicById,
	getUserDataById,
	getUserCardsById,
};

module.exports = queries;
