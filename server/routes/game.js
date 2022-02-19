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
		res.send('Game successfully created')
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
		if(user.gameId != null) return res.status(400).send('User is already in a game');

		queries.addPlayerToGame(gameId, playerId);
		queries.assignGameIdToPlayer(gameId, playerId);
		res.status(201).send('Game successfully joined');
	} catch (err) {
		res.status(500);
	}
});

router.post('/leave', async (req, res) => {
	//WIP
	// try{
	// 	var gameId = req.body.gameId;
	// 	const game = await queries.getGameByGameId(gameId);
	// 	if (game == null) return res.status(400).send('Game ID not found');
	// 	var playerId = req.body.playerId;
	// 	const user = await queries.getUserDataById(playerId);
	// 	if (user == null) return res.status(400).send('User not found');
	// 	if(user.gameId != null) return res.status(400).send('User is already in a game');

	// 	queries.addPlayerToGame(gameId, playerId);
	// 	queries.assignGameIdToPlayer(gameId, playerId);
	// 	res.status(201).send('Game successfully joined');
	// } catch (err) {
	// 	console.log(err);
	// 	res.status(500);
	// }
});

module.exports = router;