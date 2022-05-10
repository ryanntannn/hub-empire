require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { login, register, editProfile } = require('./api/account');
const { useCard, getCards } = require('./api/cards');
const queries = require('./queries/queries');
const admin = require('./api/admin');
const { authenticateToken, refreshToken } = require('./utils/authentication');

const job = require('./clock');
job.start();

//Cors
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get('/', function (req, res) {
	res.redirect('/home/login');
});

app.get('/home', authenticateToken, async function (req, res) {
	try {
		if (req.user.id.length != 24) {
			res.status(400).send('Invalid User ID');
		}
		userData = await queries.getUserDataBasicById(req.user.id);
		if (userData) {
			var currentDate = new Date();
			var nextTurnDate = new Date();
			nextTurnDate.setDate(currentDate.getDate());
			var currentHour = currentDate.getHours();
			if (currentHour < 8) nextTurnDate.setHours(8, 0, 0, 0);
			else if (currentHour < 17) nextTurnDate.setHours(17, 0, 0, 0);
			else {
				nextTurnDate.setDate(currentDate.getDate() + 1);
				nextTurnDate.setHours(8, 0, 0, 0);
			}
			var nextTurn = Date.parse(nextTurnDate);

			//Return UserDataBasic
			res.status(200).json({
				myData: { ...userData },
				nextTurn,
			});
		} else {
			res.status(404).json('Page not found');
		}
	} catch (error) {
		return res.status(400).json(error);
	}
});

app.get('/my-cards', authenticateToken, async function (req, res) {
	try {
		if (req.user.id.length != 24) {
			return res.status(400).send('Invalid User ID');
		}
		let userId = req.user.id;
		if (req.query.id != undefined) userId = req.query.id;
		userData = await queries.getUserCardsById(userId);
		if (userData.game.inventory.cardInstances) {
			console.log(userData);
			//Return cards
			return res
				.status(200)
				.json({ cards: userData.game.inventory.cardInstances });
		} else {
			return res.status(404).json('Page not found');
		}
	} catch (error) {
		return res.status(404).json('Page not found');
	}
});

app.get('/leaderboard', async function (req, res) {
	try {
		console.log(req.query.gameId);
		var players = await queries
			.getLeaderboard(req.query.gameId)
			.catch(console.dir);
		res.status(200).json({
			players: players,
		});
	} catch (error) {
		return res.status(404).json('Page not found');
	}
});

app.get('/users-min', authenticateToken, async function (req, res) {
	try {
		if (req.user.id.length != 24) {
			return res.status(400).send('Invalid User ID');
		}
		userData = await queries.getUserDataMinById(req.user.id);
		if (userData) {
			//Return cards
			return res.status(200).json({ user: userData });
		} else {
			return res.status(404).json('Page not found');
		}
	} catch (error) {
		return res.status(404).json('Page not found');
	}
});

app.get('/user', authenticateToken, async function (req, res) {
	try {
		if (req.user.id.length != 24) {
			return res.status(400).send('Invalid User ID');
		}
		userData = await queries.getUserDataById(req.query.id);
		if (userData) {
			console.log(userData);
			const assetValue = getAssetValue(userData.cardIds);
			//Return cards
			return res.status(200).json({ user: { ...userData, assetValue } });
		} else {
			return res.status(404).json('Page not found');
		}
	} catch (error) {
		return res.status(404).json('Page not found');
	}
});

const tradeRouter = require('./routes/trade.js');
app.use('/trade', tradeRouter);

const gameRouter = require('./routes/game.js');
const { getAssetValue } = require('./utils/userUtils');
const { authenticateAdmin } = require('./api/admin');
app.use('/game', gameRouter);

app.post('/use-card', authenticateToken, useCard);

app.get('/get-cards', authenticateToken, getCards);

app.get('/action-log', authenticateToken, async function (req, res) {
	try {
		const start = req.query.showAmount * req.query.page;
		const amount = req.query.showAmount;
		console.log(start, amount);
		if (start < 0 || amount <= 0)
			return res.status(400).json('Invalid Req');
		const actionLog = await queries.getActionLog(
			req.query.gameId,
			start,
			amount
		);
		actionLog.forEach((log) => {
			return res.status(200).json(log.log);
		});
		//return res.status(200).json([]);
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});

app.get('/auth', authenticateToken, async (req, res) => {
	try {
		const user = await queries.getUserDataBasicById(req.user.id);
		if (user) {
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
			return res.json({ userData, accessToken: req.token });
		} else {
			return res.status(404).json('Page not found');
		}
	} catch (error) {
		console.log(error);
		return res.status(404).json('Page not found');
	}
});

app.post('/login', login);

app.post('/register', authenticateToken, authenticateAdmin, register);

app.post('/edit-profile', authenticateToken, editProfile);

app.get('/admin', authenticateToken, authenticateAdmin, (req, res) => {
	res.status(200).send();
});

app.get(
	'/admin/metrics',
	authenticateToken,
	authenticateAdmin,
	admin.adminMetrics
);

app.get(
	'/admin/testresultsdata',
	authenticateToken,
	authenticateAdmin,
	admin.testResultData
);

app.get(
	'/admin/checkrewarddata',
	authenticateToken,
	authenticateAdmin,
	admin.checkRewardData
);

app.post(
	'/admin/giverewards',
	authenticateToken,
	authenticateAdmin,
	admin.giveRewards
);

app.post(
	'/admin/updatemetric',
	authenticateToken,
	authenticateAdmin,
	admin.updateMetric
);

app.get(
	'/admin/cardbasedata',
	authenticateToken,
	authenticateAdmin,
	admin.getCardsBaseData
);

app.post(
	'/admin/updatecard',
	authenticateToken,
	authenticateAdmin,
	admin.updateCard
);

app.get(
	'/admin/accountdata',
	authenticateToken,
	authenticateAdmin,
	admin.getAccountData
);

app.post(
	'/admin/updateaccount',
	authenticateToken,
	authenticateAdmin,
	admin.updateAccount
);

app.post(
	'/admin/deleteaccount',
	authenticateToken,
	authenticateAdmin,
	admin.deleteAccount
);

app.post(
	'/admin/changepassword',
	authenticateToken,
	authenticateAdmin,
	admin.changePassword
);

app.listen(process.env.PORT || 42069);
