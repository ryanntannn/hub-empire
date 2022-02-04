require('dotenv').config();

const express = require('express');
const app = express();
const { login, register } = require('./api/account');
const { authenticateToken, refreshToken } = require('./utils/authentication');

const fs = require('fs');

let config = JSON.parse(fs.readFileSync('config.json'));

const { MongoClient } = require('mongodb');
const uri = config.uri.replace("<user>", config.username).replace("<password>", config.password)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

async function connectAndReturnUser(displayName) {
	try {
		await client.connect();
		const database = client.db('HubEmpireDB');
		const users = database.collection('Users');
		const query = { displayName: displayName };

		return await users.findOne(query);
		} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
	}
}

async function createNewUser(newUser) {
	try {
		
		await client.connect();
		const database = client.db('HubEmpireDB');
		database.collection('Users').insertOne(newUser), function(err, res){
			if (err) throw err;
			return 1;
		}
		return 0;
		} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
	}
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");
		var myobj = { name: "Company Inc", address: "Highway 37" };
		dbo.collection("customers").insertOne(myobj, function(err, res) {
		  if (err) throw err;
		  console.log("1 document inserted");
		  db.close();
		});
	  });
}

app.get('/', function(req, res) {
	const myPromise = 
	(async () => {
		res.json(await connectAndReturnUser("John").catch(console.dir));
		console.log("async done")
	})()
    
});

app.get('/user/create/:displayName/', function(req, res){
	const newUser = {
		id: 1,
		displayName: req.params.displayName,
		cardIds: [],
		cash: 0,
		netWorth: 0,
		netEarnings: 0,
		assetValue: 0,
		income: 0,
		expenses: 0
	};
	(async () => {
		await createNewUser(newUser).catch(console.dir);
	res.json(await connectAndReturnUser(newUser.displayName).catch(console.dir));
	})()
	
})

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
