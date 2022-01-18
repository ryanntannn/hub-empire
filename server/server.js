require('dotenv').config();

const express = require('express');
const app = express();
const { login, register } = require('./api/account');
const { authenticateToken, refreshToken } = require('./utils/authentication');

app.use(express.json());

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
