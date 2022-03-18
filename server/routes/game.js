const express = require('express');
const router = express.Router();
const queries = require('../queries/queries');
const Game = require('../game/game');
const Mods = require('../api/mods')

router.post('/create', (req, res) => {
	try{
		var gameId = req.body.id;
		if (gameId == null) return res.status(400).json("New game has no ID!")

		var newGame = new Game({'code': gameId});
		queries.addNewGame(newGame)
		
		//req.body[]
		res.send('Game successfully created')
	} catch (err) {
		console.log(err)
		res.status(500);
	}
});

router.post('/join', async (req, res) => {
	try{
		var gameJoinCode = req.body.joinCode;
		var playerId = req.body.playerId;
		console.log("Joining Game...")
		
		const game = await queries.getGameByGameId(gameJoinCode);
		if (game == null) return res.status(400).send('Game ID not found');

		
		const user = await queries.getUserDataById(playerId);
		if (user == null) return res.status(400).send('User not found');
		if (user.game.id != null) return res.status(400).send('User is already in a game');

		queries.addPlayerToGame(gameJoinCode, playerId);
		console.log("Player ID: '" + playerId + "' added to Game Document");
		queries.assignGameIdToPlayer(gameJoinCode, playerId);
		console.log("Game Join Code: '" + gameJoinCode + "' added to Player Document");
		res.status(201).send('Game successfully joined');
	} catch (err) {
		res.status(500);
	}
});

router.post('/leave', async (req, res) => {
	//WIP
});

router.post('/card/mod/apply', async (req, res) => {
	switch(req.body.mod.modType){
		case 0: 
			var ownerMod = new Mods.OwnerMod(req.body.mod.playerId, req.body.mod.isPermanent, req.body.mod.turnsLeft);
			res.status(200).json("Mod Type " + 0 + " Created")
			break;
		case 1:
			var hubMod = new Mods.HubMod(req.body.mod.newHubType, req.body.mod.isPermanent, req.body.mod.turnsLeft);
			res.status(200).json("Mod Type " + 1 + " Created")
			break;
		case 2:
			var incomeMod = new Mods.IncomeMod(req.body.mod.incomeBoost, req.body.mod.isAdditive, req.body.mod.isPermanent, req.body.mod.turnsLeft);
			res.status(200).json("Mod Type " + 2 + " Created")
			break;
		default:
			res.status(400).json("Invalid Mod Type Specified")
			break;
	}
});

module.exports = router;