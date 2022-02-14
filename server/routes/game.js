const express = require('express');
const router = express.Router();
const queries = require('../queries/queries');
const GameHandler = require('../game/game');

router.post('/create', (req, res) => {
	try{
		var gameId = req.body.id;
		var newGame = new GameHandler({id: gameId}, isNew = true);
		queries.addNewGame(newGame)
		//console.log(newGame)
		
		//req.body[]
		res.send('Success')
	} catch (err) {
		console.log(err)
		res.status(500);
	}
});

router.post('/join', async (req, res) => {
	try{
		var gameId = req.body.gameId;
		const game = await queries.getGameByGameId(gameId);
		if (game == null) return res.status(400).send('Game ID not found');
		var playerId = req.body.playerId;
		const user = await queries.getUserDataById(playerId);
		if (user == null) return res.status(400).send('User not found');

		queries.addPlayerToGame(gameId, playerId)
		res.status(201).send('Success');
	} catch (err) {
		console.log(err);
		res.status(500);
	}
});

module.exports = router;