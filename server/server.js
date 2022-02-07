require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { login, register } = require('./api/account');
const queries = require('./queries/queries');
const { authenticateToken, refreshToken } = require('./utils/authentication');

const mongo = require('./utils/mongo');
const ObjectId = require('mongodb').ObjectId;

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

// app.post('/login', function(req, res) {
// 	try {
// 		const query = {
// 			username: req.body.username,
// 			password: req.body.password
// 		};
// 		const projection = {
// 			//_id is returned by default
// 			displayName: 1,
// 			netWorth: 1,
// 			netEarnings: 1
// 		};

// 		(async () => {
// 			userData = await mongo.client.db('HubEmpireDB').collection('Users').findOne(query, {projection: projection}).catch(console.dir);
// 			if(userData){
// 				//Return UserDataBasic if user found
// 				res.json(200, userData._id);
// 			}
// 			else{
// 				//Return the values in form back to the user if user not found
// 				res.json(401, query)
// 			}
// 		})();
// 	} catch(error) {
// 		console.error(error);
//  	}
// });

app.get('/my-cards', function (req, res) {
	res.send('my-cards');
});

app.get('/leaderboard', function (req, res) {
	res.send('leaderboard');
});

app.get('/users-min', function (req, res) {
	res.send('users-min');
});

app.get('/user', function (req, res) {
	res.send('users-min');
});

app.post('/send-trade', function (req, res) {
	res.send('users-min');
});

app.get('/trade/inbox', function (req, res) {
	res.send('trade/inbox');
});

app.get('/trade/history', function (req, res) {
	res.send('trade/history');
});

app.post('/trade/action', function (req, res) {
	res.send('trade/history');
});

app.get('/auth', authenticateToken, (req, res) => {
	res.json({ userData: req.user, accessToken: req.token });
});

app.post('/login', login);

app.post('/register', register);

app.listen(process.env.PORT || 42069);
