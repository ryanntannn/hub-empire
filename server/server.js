require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { login, register } = require('./api/account');
const { useCard, getCards } = require('./api/cards');
const queries = require('./queries/queries');
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
			console.log(userData);
			const netWorth = userData.cash + getAssetValue(userData.cardIds);

			var currentDate = new Date();
			var nextTurnDate = new Date();
			nextTurnDate.setDate(currentDate.getDate());
			var currentHour = currentDate.getHours()
			if(currentHour < 7) nextTurnDate.setHours(7, 0, 0, 0);
			else if (currentHour < 11) nextTurnDate.setHours(11, 0, 0, 0);
			else if (currentHour < 15) nextTurnDate.setHours(15, 0, 0, 0);
			else {
				nextTurnDate.setDate(currentDate.getDate() + 1);
				nextTurnDate.setHours(7, 0, 0, 0);
			}
			var timeToNextTurn = Date.parse(nextTurnDate);

			//Return UserDataBasic
			res.status(200).json({
				myData: { ...userData, netWorth },
				timeToNextTurn: timeToNextTurn,
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
		userData = await queries.getUserCardsById(req.user.id);
		if (userData) {
			//Return cards
			return res.status(200).json({ cards: userData.cardIds });
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
		var players = await queries.getLeaderboard(req.query.gameId).catch(console.dir);
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
app.use('/game', gameRouter);

app.post('/use-card', authenticateToken, useCard);

app.get('/get-cards', authenticateToken, getCards);

app.get('/action-log', authenticateToken, async function (req, res) {
	try {
		const start = req.query.showAmount * (req.query.page - 1);
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
			res.status(200).json(log.log);
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json(error);
	}
});

app.get('/auth', authenticateToken, (req, res) => {
	res.json({ userData: req.user, accessToken: req.token });
});

app.post('/login', login);

app.post('/register', register);

app.listen(process.env.PORT || 42069);
