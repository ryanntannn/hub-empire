const mongo = require('../utils/mongo');

async function getUserData(username) {
	return await mongo.client
		.db('HubEmpireDB')
		.collection('Users')
		.findOne({ username: username })
		.catch(console.dir);
}

const queries = {
	getUserData,
};

module.exports = queries;
