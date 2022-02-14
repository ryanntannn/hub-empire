require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { login, register } = require('./api/account');
const queries = require('./queries/queries');
const { authenticateToken, refreshToken } = require('./utils/authentication');

const task = require('./utils/cronScheduler');
//Start method is called to start the cron job
task.start();

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

//WORK IN PROGRESS, NOT FUNCTIONAL YET
app.get('/home', authenticateToken, async function (req, res) {
	try {
		if (req.user.id.length != 24) {
			res.status(400).send('Invalid User ID');
		}
		userData = await queries.getUserDataBasicById(req.user.id);
		if (userData) {
			//Return UserDataBasic
			res.json(200, { myData: userData });
		} else {
			res.json(404, 'Page not found');
		}
	} catch (error) {
		console.error(error);
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
			return res.json(200, { cards: userData.cardIds });
		} else {
			return res.json(404, 'Page not found');
		}
	} catch (error) {
		return res.json(404, 'Page not found');
		console.error(error);
	}
});

app.get('/leaderboard', function (req, res) {
	res.send('leaderboard');
});

app.get('/users-min', function (req, res) {
	res.send('users-min');
});

app.get('/user', authenticateToken, async function (req, res) {
	try {
		if (req.user.id.length != 24) {
			return res.status(400).send('Invalid User ID');
		}
		userData = await queries.getUserDataById(req.query.id);
		if (userData) {
			//Return cards
			return res.json(200, { user: userData });
		} else {
			return res.json(404, 'Page not found');
		}
	} catch (error) {
		return res.json(404, 'Page not found');
		console.error(error);
	}
});

const tradeRouter = require('./routes/trade.js');
app.use('/trade', tradeRouter);

const gameRouter = require('./routes/game.js');
app.use('/game', gameRouter);

app.get('/auth', authenticateToken, (req, res) => {
	res.json({ userData: req.user, accessToken: req.token });
});



app.post('/login', login);

app.post('/register', register);

app.listen(process.env.PORT || 42069);
