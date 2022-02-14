const express = require('express');
const router = express.Router();
const queries = require('../queries/queries');

router.post('/send', function (req, res) {
	res.send('users-min');
});

router.get('/inbox', function (req, res) {
	res.send('trade/inbox');
});

router.get('/history', function (req, res) {
	res.send('trade/history');
});

router.post('/action', function (req, res) {
	res.send('trade/history');
});

module.exports = router;