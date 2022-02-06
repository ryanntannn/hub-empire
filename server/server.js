require('dotenv').config();

const express = require('express');
const app = express();
const { login, register } = require('./api/account');
const { authenticateToken, refreshToken } = require('./utils/authentication');

const mongo = require('./utils/mongo')

app.use(express.json());

// async function createNewUser(newUser) {
// 	try {
		
// 		await client.connect();
// 		const database = client.db('HubEmpireDB');
// 		database.collection('Users').insertOne(newUser), function(err, res){
// 			if (err) throw err;
// 			return 1;
// 		}
// 		return 0;
// 		} finally {
// 		// Ensures that the client will close when you finish/error
// 		//await client.close();
// 	}
// 	MongoClient.connect(url, function(err, db) {
// 		if (err) throw err;
// 		var dbo = db.db("mydb");
// 		var myobj = { name: "Company Inc", address: "Highway 37" };
// 		dbo.collection("customers").insertOne(myobj, function(err, res) {
// 		  if (err) throw err;
// 		  console.log("1 document inserted");
// 		  db.close();
// 		});
// 	  });
// }
app.get('/', function(req, res) {
	res.redirect('/home');
});

app.get('/home', function(req, res) {
	try {
		const database = mongo.client.db('HubEmpireDB');
		const users = database.collection('Users');
		const query = { displayName: 'John' };


		(async () => {
			res.json(await users.findOne(query).catch(console.dir));
		})()
	} catch(error) {
		console.error(error);
 	}
});

app.get('/my-cards', function(req, res) {
	res.send('my-cards');
});

app.get('/leaderboard', function(req, res) {
	res.send('leaderboard');
});

app.get('/users-min', function(req, res) {
	res.send('users-min');
});

app.get('/user', function(req, res) {
	res.send('users-min');
});

app.post('/send-trade', function(req, res) {
	res.send('users-min');
});

app.get('/trade/inbox', function(req, res) {
	res.send('trade/inbox');
});

app.get('/trade/history', function(req, res) {
	res.send('trade/history');
});

app.post('/trade/action', function(req, res) {
	res.send('trade/history');
});
// app.get('/user/create/:displayName/', function(req, res){
// 	const newUser = {
// 		id: 1,
// 		displayName: req.params.displayName,
// 		cardIds: [],
// 		cash: 0,
// 		netWorth: 0,
// 		netEarnings: 0,
// 		assetValue: 0,
// 		income: 0,
// 		expenses: 0
// 	};
// 	(async () => {
// 		await createNewUser(newUser).catch(console.dir);
// 	res.json(await connectAndReturnUser(newUser.displayName).catch(console.dir));
// 	})()
	
// })

//Cors
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.get('/auth', authenticateToken, (req, res) => {
	res.json({ userData: req.user, accessToken: req.token });
});

app.post('/login', login);

app.post('/register', register);

app.listen(42069);
