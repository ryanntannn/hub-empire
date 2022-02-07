const { generateAccessToken } = require('../utils/authentication');
const bcrypt = require('bcrypt');
const mongo = require('../utils/mongo');
const queries = require('../queries/queries');

//will be moved to a db
// const users = [
// 	{
// 		name: 'dev',
// 		password:
// 			'$2b$10$h9RlHIGbZix6fV7OiBckN./mNoNeQESYZxJoS965XtYSHn3MdcFMq',
// 	},
// ];

async function login(req, res) {
	//Authenticate first
	const user = await queries.getUserDataByUsername(req.body.username);
	//const user = users.find((user) => user.name == req.body.name);
	if (user == null) return res.status(400).send('User not found');

	try {
		if (!(await bcrypt.compare(req.body.password, user.password))) {
			return res.status(400).send('Password is incorrect');
		}
		const accessToken = generateAccessToken({
			username: user.username,
			id: user._id.toString(),
		});
		return res.json({
			userData: { username: user.username },
			accessToken: accessToken,
		});
	} catch {
		return res.status(500).json({
			username: req.body.username,
			password: req.body.password,
		});
	}
}

async function register(req, res) {
	//Return 403 if username already exists
	const user = await queries.getUserDataByUsername(req.body.username);
	if (user) return res.status(403).send('User already exists');
	// if (users.some((user) => user.name == req.body.name))
	// 	return res.sendStatus(403);

	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const newUser = {
			username: req.body.username,
			password: hashedPassword,
			displayName: req.body.displayName,
			gameid: null,
			cardIds: [],
			cash: 0,
			netWorth: 0,
			netEarnings: 0,
			assetValue: 0,
			incomePerTurn: 0,
			expensesPerTurn: 0,
		};
		mongo.client.db('HubEmpireDB').collection('Users').insertOne(newUser);
		// const user = {
		// 	name: req.body.name,
		// 	password: hashedPassword,
		// };
		//users.push(user);

		const accessToken = generateAccessToken({ name: newUser.username });
		return res.status(200).json({ accessToken: accessToken });
	} catch {
		return res.status(500).json({
			username: req.body.username,
			password: req.body.password,
			displayName: req.body.displayName,
		});
	}
}

module.exports = { login, register };
