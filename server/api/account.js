const { generateAccessToken } = require('../utils/authentication');
const bcrypt = require('bcrypt');
const mongo = require('../utils/mongo');
const queries = require('../queries/queries');
const Player = require('../game/player');

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
		if (!(await bcrypt.compare(req.body.password, user.profile.password))) {
			return res.status(400).send('Password is incorrect');
		}
		const gameId = user.profile.isAdmin
			? user.profile.adminGameId
			: user.game.id;
		const userData = {
			username: user.username,
			_id: user._id.toString(),
			id: user._id.toString(),
			isAdmin: user.profile.isAdmin,
			gameId,
		};
		const accessToken = generateAccessToken(userData);
		return res.json({
			userData,
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
	const user = await queries.getUserDataByUsername(req.query.username);
	if (user) return res.status(403).send('User already exists');

	try {
		const salt = await bcrypt.genSalt();
		console.log(req, salt);
		const hashedPassword = await bcrypt.hash(req.query.password, salt);

		const newUser = {
			profile: {
				username: req.query.username,
				password: hashedPassword,
				displayName: req.query.displayName,
			},
			game: {
				id: req.user.gameId,
				stats: {
					netWorth: 0,
					netEarnings: 0,
					cash: 0,
					turnIncome: 0,
					numberOfCardsDrawn: 0,
				},
				inventory: {
					cardInstances: [],
					newCards: [],
					stolenCards: [],
				},
			},
		};
		const newAccount = await mongo.client
			.db('HubEmpireDB')
			.collection('Users')
			.insertOne(newUser);
		queries.addPlayerToGame(
			req.user.gameId,
			newAccount.insertedId.toString()
		);

		const accessToken = generateAccessToken({ name: newUser.username });
		return res.status(200).json({ accessToken: accessToken });
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
}

async function editProfile(req, res) {
	try {
		if (req.query.displayName.length < 3)
			return res
				.status(400)
				.json('display name contain at least 3 characters');
		if (req.query.displayName.length > 17)
			return res
				.status(400)
				.json('display name must be 16 characters or less');
		if (/[^a-zA-Z0-9 ]/.test(req.query.displayName))
			return res
				.status(400)
				.json('display name cannot contain special characters');
		await queries.updateProfile(
			req.user.id,
			req.query.displayName,
			req.query.avatar
		);
		return res.status(200).send();
	} catch (err) {
		console.log(err);
		return res.status(400).json(err);
	}
}

module.exports = { login, register, editProfile };
